'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export function CartPage() {
    const { items, total, setQty, remove } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const shipping = total >= 50 ? 0 : 4.90;
    const grandTotal = total + shipping;

    if (items.length === 0) {
        return (
            <div className="container-app py-10">
                <h1 className="text-2xl font-display font-bold mb-8">Mon panier</h1>
                <EmptyState
                    icon={<ShoppingBag className="h-8 w-8" />}
                    title="Votre panier est vide"
                    description="Parcourez le catalogue et ajoutez vos articles préférés."
                    action={<Button onClick={() => router.push('/catalogue')}>Découvrir le catalogue</Button>}
                />
            </div>
        );
    }

    const goCheckout = () => {
        if (!user) { router.push('/auth?redirect=/checkout'); return; }
        router.push('/checkout');
    };

    return (
        <div className="container-app py-10">
            <h1 className="text-2xl font-display font-bold mb-8">Mon panier</h1>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Items */}
                <div className="lg:col-span-2 space-y-3">
                    {items.map(({ product, quantity }) => (
                        <div key={product.id} className="card p-3 sm:p-4 flex gap-4 animate-fade-up">
                            <Link href={`/produit/${product.id}`} className="shrink-0">
                                <Image src={product.image} alt={product.name} width={96} height={96} className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg object-cover bg-ink-100" />
                            </Link>
                            <div className="flex flex-1 flex-col">
                                <div className="flex items-start justify-between gap-2">
                                    <Link href={`/produit/${product.id}`} className="text-sm sm:text-base font-medium text-ink-900 hover:underline line-clamp-2">{product.name}</Link>
                                    <button onClick={() => remove(product.id)} className="text-ink-400 hover:text-danger-600 transition shrink-0" aria-label="Supprimer">
                                        <Trash2 className="h-4.5 w-4.5" />
                                    </button>
                                </div>
                                <p className="text-sm text-ink-500 mt-0.5">{formatPrice(product.price)} l&apos;unité</p>
                                {product.stock < quantity && (
                                    <p className="mt-1 text-xs text-danger-600">Stock insuffisant — disponible : {product.stock}</p>
                                )}
                                <div className="mt-auto flex items-center justify-between pt-3">
                                    <div className="flex items-center rounded-lg border border-ink-200">
                                        <button onClick={() => setQty(product.id, quantity - 1)} className="flex h-9 w-9 items-center justify-center text-ink-600 hover:bg-ink-100 rounded-l-lg transition">
                                            <Minus className="h-3.5 w-3.5" />
                                        </button>
                                        <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                                        <button onClick={() => setQty(product.id, Math.min(quantity + 1, product.stock))} disabled={quantity >= product.stock} className="flex h-9 w-9 items-center justify-center text-ink-600 hover:bg-ink-100 rounded-r-lg transition disabled:opacity-40">
                                            <Plus className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <p className="text-base font-semibold">{formatPrice(product.price * quantity)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="card p-5 sticky top-24 animate-fade-up">
                        <h2 className="text-lg font-semibold mb-4">Récapitulatif</h2>
                        <div className="space-y-2.5 text-sm">
                            <div className="flex justify-between text-ink-600">
                                <span>Sous-total</span>
                                <span className="font-medium text-ink-900">{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between text-ink-600">
                                <span>Livraison</span>
                                <span className="font-medium text-ink-900">{shipping === 0 ? 'Offerte' : formatPrice(shipping)}</span>
                            </div>
                            {shipping > 0 && (
                                <p className="text-xs text-accent-600 pt-1">Plus que {formatPrice(50 - total)} pour la livraison offerte.</p>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-ink-100 flex justify-between items-center">
                            <span className="font-medium">Total</span>
                            <span className="text-xl font-display font-bold">{formatPrice(grandTotal)}</span>
                        </div>
                        <Button fullWidth size="lg" className="mt-5" onClick={goCheckout}>
                            Passer commande <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Link href="/catalogue" className="mt-3 block text-center text-sm text-ink-500 hover:text-ink-900 transition">
                            Continuer mes achats
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

