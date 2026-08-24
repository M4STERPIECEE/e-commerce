'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/context/toast-context';

export function ProductCard({ product }: { product: Product }) {
    const { add } = useCart();
    const { toast } = useToast();
    const outOfStock = product.stock === 0;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (outOfStock) return;
        add(product, 1);
        toast(`${product.name} ajouté au panier.`);
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toast(`${product.name} ajouté aux favoris.`);
    };

    return (
        <div className="product-card group cursor-pointer">
            <Link href={`/produit/${product.id}`} className="block">
                <div className="relative aspect-[4/5] bg-surface-container-lowest border border-outline-variant overflow-hidden rounded mb-4">
                    <Image
                        className="product-img object-cover transition-transform duration-500 ease-out"
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Top left badge */}
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                        {outOfStock ? (
                            <span className="bg-error text-on-error font-label-caps text-label-caps px-2 py-1 rounded">
                                ÉPUISÉ
                            </span>
                        ) : product.stock <= 5 ? (
                            <span className="bg-tertiary text-on-tertiary font-label-caps text-label-caps px-2 py-1 rounded">
                                RARE ({product.stock})
                            </span>
                        ) : product.rating >= 4.7 ? (
                            <span className="bg-tertiary text-on-tertiary font-label-caps text-label-caps px-2 py-1 rounded">
                                NEW
                            </span>
                        ) : (
                            <span className="bg-surface-variant text-on-surface-variant font-label-caps text-label-caps px-2 py-1 rounded">
                                BEST SELLER
                            </span>
                        )}
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={handleFavorite}
                        className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors z-10"
                        aria-label="Ajouter aux favoris"
                    >
                        <span className="material-symbols-outlined bg-surface-container-lowest/80 backdrop-blur rounded-full p-2 text-[18px]" data-icon="favorite">
                            favorite
                        </span>
                    </button>

                    {/* Quick Add To Cart Button */}
                    <div className="quick-add absolute bottom-0 left-0 w-full p-4 transform translate-y-full opacity-0 transition-all duration-300 ease-out z-10">
                        <button
                            onClick={handleAdd}
                            disabled={outOfStock}
                            className="w-full bg-primary text-on-primary font-button text-button py-3 rounded shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {outOfStock ? 'Rupture de stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>

                {/* Details */}
                <div>
                    <div className="flex justify-between items-start mb-1 gap-2">
                        <h3 className="font-body-sm text-body-sm text-primary font-semibold line-clamp-1">
                            {product.name}
                        </h3>
                        <span className="font-body-sm text-body-sm text-primary font-bold shrink-0">
                            {formatPrice(product.price)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-secondary">
                        <span
                            className="material-symbols-outlined text-[14px] text-primary"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            star
                        </span>
                        <span className="font-label-caps text-[11px] text-secondary">
                            {product.rating ? product.rating.toFixed(1) : '5.0'} ({(product.rating * 27).toFixed(0)})
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
