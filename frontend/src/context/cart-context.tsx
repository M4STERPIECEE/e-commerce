import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { CartItem, Product } from '@/types';

const LS_KEY = 'maison_cart';

interface CartState {
    items: CartItem[];
}

type Action =
    | { type: 'ADD'; product: Product; quantity: number }
    | { type: 'REMOVE'; productId: string }
    | { type: 'SET_QTY'; productId: string; quantity: number }
    | { type: 'CLEAR' }
    | { type: 'INIT'; items: CartItem[] };

function reducer(state: CartState, action: Action): CartState {
    switch (action.type) {
        case 'INIT':
            return { items: action.items };
        case 'ADD': {
            const existing = state.items.find(i => i.product.id === action.product.id);
            if (existing) {
                return {
                    items: state.items.map(i =>
                        i.product.id === action.product.id
                            ? { ...i, quantity: Math.min(i.quantity + action.quantity, i.product.stock) }
                            : i
                    ),
                };
            }
            return { items: [...state.items, { product: action.product, quantity: Math.min(action.quantity, action.product.stock) }] };
        }
        case 'REMOVE':
            return { items: state.items.filter(i => i.product.id !== action.productId) };
        case 'SET_QTY':
            return {
                items: state.items
                    .map(i => i.product.id === action.productId
                        ? { ...i, quantity: Math.max(1, Math.min(action.quantity, i.product.stock)) }
                        : i)
                    .filter(i => i.quantity > 0),
            };
        case 'CLEAR':
            return { items: [] };
        default:
            return state;
    }
}

interface CartContextValue {
    items: CartItem[];
    count: number;
    total: number;
    add: (product: Product, quantity?: number) => void;
    remove: (productId: string) => void;
    setQty: (productId: string, quantity: number) => void;
    clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, { items: [] });

    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) dispatch({ type: 'INIT', items: JSON.parse(raw) });
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(state.items));
    }, [state.items]);

    const value = useMemo<CartContextValue>(() => ({
        items: state.items,
        count: state.items.reduce((s, i) => s + i.quantity, 0),
        total: state.items.reduce((s, i) => s + i.product.price * i.quantity, 0),
        add: (product, quantity = 1) => dispatch({ type: 'ADD', product, quantity }),
        remove: (productId) => dispatch({ type: 'REMOVE', productId }),
        setQty: (productId, quantity) => dispatch({ type: 'SET_QTY', productId, quantity }),
        clear: () => dispatch({ type: 'CLEAR' }),
    }), [state.items]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
