import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
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

    return (
        <Link href={`/produit/${product.id}`} className="card card-hover group block overflow-hidden">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-100">
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {outOfStock && <Badge tone="danger" className="shadow-soft">En rupture</Badge>}
                    {!outOfStock && product.stock <= 5 && <Badge tone="warning" className="shadow-soft">Plus que {product.stock}</Badge>}
                </div>
                <button
                    onClick={handleAdd}
                    disabled={outOfStock}
                    className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-900 shadow-pop opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-accent-500 hover:text-white disabled:opacity-0 disabled:cursor-not-allowed"
                    aria-label="Ajouter au panier"
                >
                    <ShoppingBag className="h-4.5 w-4.5" />
                </button>
            </div>
            <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                    <span className="text-2xs uppercase tracking-wider text-ink-400">★ {product.rating.toFixed(1)}</span>
                </div>
                <h3 className="text-sm font-medium text-ink-900 line-clamp-2 leading-snug">{product.name}</h3>
                <p className="mt-2 text-base font-semibold text-ink-900">{formatPrice(product.price)}</p>
            </div>
        </Link>
    );
}
