'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, ShoppingBag, Minus, Plus, Star, ArrowLeft, Check } from 'lucide-react';
import { api } from '@/lib/api';
import type { Product, Category } from '@/types';
import { formatPrice } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/context/toast-context';

export function ProductDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id ?? '';
    const router = useRouter();
    const { add } = useCart();
    const { toast } = useToast();
    const [product, setProduct] = useState<Product | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        if (!id) return;
        api.getProduct(id)
            .then(async p => {
                setProduct(p);
                setQty(1);
                setError(null);
                const cats = await api.getCategories();
                setCategory(cats.find(c => c.id === p.categoryId) ?? null);
            })
            .catch(() => setError('Produit introuvable.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAdd = () => {
        if (!product || product.stock === 0) return;
        if (qty > product.stock) {
            toast(`Stock insuffisant. Seulement ${product.stock} unité(s) disponible(s).`, 'error');
            return;
        }
        add(product, qty);
        toast(`${product.name} (×${qty}) ajouté au panier.`);
    };

    if (loading) return <ProductDetailSkeleton />;
    if (error || !product) return (
        <div className="container-app py-20 text-center">
            <p className="text-ink-500 mb-4">{error ?? 'Produit introuvable.'}</p>
            <Button variant="outline" onClick={() => router.push('/catalogue')}>Retour au catalogue</Button>
        </div>
    );

    const outOfStock = product.stock === 0;

    return (
        <div className="container-app py-6 sm:py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-ink-500 mb-6">
                <Link href="/" className="hover:text-ink-900 transition">Accueil</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href="/catalogue" className="hover:text-ink-900 transition">Catalogue</Link>
                {category && (<><ChevronRight className="h-3.5 w-3.5" /><Link href={`/catalogue?cat=${category.slug}`} className="hover:text-ink-900 transition">{category.name}</Link></>)}
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-ink-700 truncate">{product.name}</span>
            </nav>

            <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
                {/* Image */}
                <div className="relative">
                    <div className="relative sticky top-24 overflow-hidden rounded-2xl border border-ink-200/70 bg-ink-100 aspect-square">
                        <Image src={product.image} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="h-full w-full object-cover animate-fade-in" />
                        {outOfStock && <div className="absolute top-4 left-4"><Badge tone="danger" className="shadow-soft">En rupture de stock</Badge></div>}
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col animate-fade-up">
                    {category && <Link href={`/catalogue?cat=${category.slug}`} className="text-sm text-accent-600 font-medium mb-2 hover:underline">{category.name}</Link>}
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-balance">{product.name}</h1>

                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-accent-500 text-accent-500' : 'text-ink-200'}`} />
                            ))}
                        </div>
                        <span className="text-sm text-ink-500">{product.rating.toFixed(1)} / 5</span>
                    </div>

                    <p className="mt-6 text-3xl font-display font-bold">{formatPrice(product.price)}</p>

                    <div className="mt-4">
                        {outOfStock ? (
                            <Badge tone="danger">En rupture de stock</Badge>
                        ) : product.stock <= 5 ? (
                            <Badge tone="warning"><span className="flex items-center gap-1"><Check className="h-3 w-3" /> En stock — plus que {product.stock}</span></Badge>
                        ) : (
                            <Badge tone="success"><span className="flex items-center gap-1"><Check className="h-3 w-3" /> En stock</span></Badge>
                        )}
                    </div>

                    <p className="mt-6 text-ink-600 leading-relaxed">{product.description}</p>

                    {/* Quantity + Add */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <div className="flex items-center rounded-lg border border-ink-200 bg-white">
                            <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={outOfStock} className="flex h-11 w-11 items-center justify-center text-ink-600 hover:bg-ink-100 rounded-l-lg transition disabled:opacity-40">
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center text-sm font-semibold">{qty}</span>
                            <button onClick={() => setQty(q => Math.min(product.stock || 1, q + 1))} disabled={outOfStock} className="flex h-11 w-11 items-center justify-center text-ink-600 hover:bg-ink-100 rounded-r-lg transition disabled:opacity-40">
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <Button size="lg" onClick={handleAdd} disabled={outOfStock} fullWidth className="flex-1">
                            <ShoppingBag className="h-5 w-5" /> {outOfStock ? 'Indisponible' : 'Ajouter au panier'}
                        </Button>
                    </div>

                    <button onClick={() => router.back()} className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition w-fit">
                        <ArrowLeft className="h-4 w-4" /> Retour
                    </button>
                </div>
            </div>
        </div>
    );
}

function ProductDetailSkeleton() {
    return (
        <div className="container-app py-10">
            <div className="grid gap-8 lg:grid-cols-2">
                <Skeleton className="aspect-square rounded-2xl" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    );
}

