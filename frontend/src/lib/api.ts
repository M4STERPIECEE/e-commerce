import { categories, products, users, seedOrders } from '@/data/mock';
import type {
    AuthTokens, Category, Order, OrderStatus, PaymentStatus,
    Product, ShippingAddress, User,
} from '@/types';

const LATENCY = 450;
const delay = (ms = LATENCY) => new Promise(r => setTimeout(r, ms));

const LS = {
    products: 'maison_products',
    orders: 'maison_orders',
    users: 'maison_users',
    tokens: 'maison_tokens',
    user: 'maison_current_user',
    pwd: 'maison_pwd',
};

function load<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) as T : fallback;
    } catch { return fallback; }
}
function save<T>(key: string, val: T) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(val));
}

function initStore() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(LS.products)) save(LS.products, products);
    if (!localStorage.getItem(LS.orders)) save(LS.orders, seedOrders);
    if (!localStorage.getItem(LS.users)) save(LS.users, users);
    if (!localStorage.getItem(LS.pwd)) {
        save(LS.pwd, { 'client@maison.fr': 'client123', 'admin@maison.fr': 'admin123' });
    }
}
initStore();

function makeTokens(userId: string): AuthTokens {
    const payload = btoa(JSON.stringify({ sub: userId, iat: Date.now(), exp: Date.now() + 1000 * 60 * 15 }));
    const refresh = btoa(JSON.stringify({ sub: userId, iat: Date.now(), exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }));
    return { accessToken: `mock.${payload}.sig`, refreshToken: `mock.${refresh}.sig` };
}

function decodeSub(token: string): string | null {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload)).sub as string;
    } catch { return null; }
}

class ApiError extends Error {
    constructor(public status: number, message: string) { super(message); }
}

export const api = {
    async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
        await delay();
        const pwdStore = load<Record<string, string>>(LS.pwd, {});
        const allUsers = load<User[]>(LS.users, []);
        const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user || pwdStore[email.toLowerCase()] !== password) {
            throw new ApiError(401, 'Email ou mot de passe incorrect.');
        }
        const tokens = makeTokens(user.id);
        save(LS.tokens, tokens);
        save(LS.user, user);
        return { user, tokens };
    },

    async register(email: string, password: string, firstName: string, lastName: string): Promise<{ user: User; tokens: AuthTokens }> {
        await delay();
        const allUsers = load<User[]>(LS.users, []);
        if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new ApiError(409, 'Un compte existe déjà avec cet email.');
        }
        const user: User = {
            id: `u-${Date.now()}`, email, firstName, lastName, role: 'USER',
        };
        allUsers.push(user);
        save(LS.users, allUsers);
        const pwdStore = load<Record<string, string>>(LS.pwd, {});
        pwdStore[email.toLowerCase()] = password;
        save(LS.pwd, pwdStore);
        const tokens = makeTokens(user.id);
        save(LS.tokens, tokens);
        save(LS.user, user);
        return { user, tokens };
    },

    async refreshToken(): Promise<AuthTokens> {
        await delay(200);
        const stored = load<AuthTokens | null>(LS.tokens, null);
        if (!stored) throw new ApiError(401, 'Session expirée.');
        const userId = decodeSub(stored.refreshToken);
        if (!userId) throw new ApiError(401, 'Session expirée.');
        const tokens = makeTokens(userId);
        save(LS.tokens, tokens);
        return tokens;
    },

    getCurrentUser(): User | null {
        return load<User | null>(LS.user, null);
    },

    logout() {
        localStorage.removeItem(LS.tokens);
        localStorage.removeItem(LS.user);
    },

    async getCategories(): Promise<Category[]> {
        await delay(250);
        return categories;
    },

    async getProducts(params?: { search?: string; categoryId?: string; sort?: string; page?: number; pageSize?: number }): Promise<{ items: Product[]; total: number; page: number; pageSize: number; totalPages: number }> {
        await delay();
        let all = load<Product[]>(LS.products, products);
        if (params?.search) {
            const q = params.search.toLowerCase();
            all = all.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
        }
        if (params?.categoryId) {
            all = all.filter(p => p.categoryId === params.categoryId);
        }
        switch (params?.sort) {
            case 'price-asc': all = [...all].sort((a, b) => a.price - b.price); break;
            case 'price-desc': all = [...all].sort((a, b) => b.price - a.price); break;
            case 'newest': all = [...all].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)); break;
            case 'rating': all = [...all].sort((a, b) => b.rating - a.rating); break;
            default: break;
        }
        const page = params?.page ?? 1;
        const pageSize = params?.pageSize ?? 8;
        const total = all.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const start = (page - 1) * pageSize;
        return { items: all.slice(start, start + pageSize), total, page, pageSize, totalPages };
    },

    async getProduct(id: string): Promise<Product> {
        await delay(300);
        const all = load<Product[]>(LS.products, products);
        const p = all.find(p => p.id === id);
        if (!p) throw new ApiError(404, 'Produit introuvable.');
        return p;
    },

    async saveProduct(product: Product): Promise<Product> {
        await delay();
        const all = load<Product[]>(LS.products, products);
        const idx = all.findIndex(p => p.id === product.id);
        if (idx >= 0) all[idx] = product;
        else all.unshift(product);
        save(LS.products, all);
        return product;
    },

    async deleteProduct(id: string): Promise<void> {
        await delay();
        const all = load<Product[]>(LS.products, products).filter(p => p.id !== id);
        save(LS.products, all);
    },

    async getMyOrders(userId: string): Promise<Order[]> {
        await delay();
        return load<Order[]>(LS.orders, []).filter(o => o.userId === userId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    },

    async getOrder(id: string): Promise<Order> {
        await delay(300);
        const order = load<Order[]>(LS.orders, []).find(o => o.id === id);
        if (!order) throw new ApiError(404, 'Commande introuvable.');
        return order;
    },

    async getAllOrders(): Promise<Order[]> {
        await delay();
        return load<Order[]>(LS.orders, []).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    },

    async createOrder(userId: string, items: { productId: string; productName: string; unitPrice: number; quantity: number; image: string }[], total: number, shippingAddress: ShippingAddress): Promise<Order> {
        await delay(600);
        const all = load<Order[]>(LS.orders, []);
        const now = new Date().toISOString();
        const order: Order = {
            id: `ord-${1000 + all.length + Math.floor(Math.random() * 900)}`,
            userId,
            items,
            total,
            status: 'PENDING',
            paymentStatus: 'PENDING',
            shippingAddress,
            createdAt: now,
            updatedAt: now,
        };
        all.push(order);
        save(LS.orders, all);
        return order;
    },

    async payOrder(orderId: string, cardLast4: string): Promise<{ order: Order; paymentStatus: PaymentStatus }> {
        await delay(1500);
        const all = load<Order[]>(LS.orders, []);
        const order = all.find(o => o.id === orderId);
        if (!order) throw new ApiError(404, 'Commande introuvable.');
        const success = cardLast4 !== '0000';
        order.paymentStatus = success ? 'COMPLETED' : 'FAILED';
        order.status = success ? 'CONFIRMED' : 'PENDING';
        order.updatedAt = new Date().toISOString();
        save(LS.orders, all);
        return { order, paymentStatus: order.paymentStatus };
    },

    async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
        await delay();
        const all = load<Order[]>(LS.orders, []);
        const order = all.find(o => o.id === orderId);
        if (!order) throw new ApiError(404, 'Commande introuvable.');
        order.status = status;
        order.updatedAt = new Date().toISOString();
        save(LS.orders, all);
        return order;
    },

    async cancelOrder(orderId: string): Promise<Order> {
        await delay();
        const all = load<Order[]>(LS.orders, []);
        const order = all.find(o => o.id === orderId);
        if (!order) throw new ApiError(404, 'Commande introuvable.');
        if (order.status !== 'PENDING') throw new ApiError(409, 'Seule une commande en attente peut être annulée.');
        order.status = 'CANCELLED';
        order.updatedAt = new Date().toISOString();
        save(LS.orders, all);
        return order;
    },

    async checkStock(productId: string, quantity: number): Promise<{ available: boolean; stock: number }> {
        await delay(200);
        const all = load<Product[]>(LS.products, products);
        const p = all.find(p => p.id === productId);
        return { available: !!p && p.stock >= quantity, stock: p?.stock ?? 0 };
    },
};

export { ApiError };
