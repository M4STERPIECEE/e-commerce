'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Category, Product } from '@/types';
import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

const SORTS = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'newest', label: 'Nouveautés' },
    { value: 'rating', label: 'Mieux notés' },
];

export function CatalogPage() {
    const rawSearchParams = useSearchParams();
    const searchParams = useMemo(() => rawSearchParams ?? new URLSearchParams(), [rawSearchParams]);
    const router = useRouter();
    const pathname = usePathname() ?? '/';
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const search = searchParams.get('q') ?? '';
    const categoryId = searchParams.get('cat') ?? '';
    const sort = searchParams.get('sort') ?? 'relevance';
    const page = parseInt(searchParams.get('page') ?? '1', 10);

    const updateParam = useCallback((key: string, value: string) => {
        const next = new URLSearchParams(searchParams.toString());
        if (value) next.set(key, value); else next.delete(key);
        if (key !== 'page') next.delete('page');
        const qs = next.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname);
    }, [searchParams, pathname, router]);

    const [refetchKey, setRefetchKey] = useState(0);
    const fetchProducts = useCallback(() => setRefetchKey(k => k + 1), []);

    useEffect(() => {
        api.getCategories().then(setCategories).catch(() => {});
    }, []);

    useEffect(() => {
        let isMounted = true;
        api.getProducts({ search, categoryId, sort, page, pageSize: 8 })
            .then(res => {
                if (!isMounted) return;
                setItems(res.items);
                setTotal(res.total);
                setTotalPages(res.totalPages);
                setError(null);
            })
            .catch(() => {
                if (isMounted) setError('Impossible de charger les produits. Veuillez réessayer.');
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false; };
    }, [search, categoryId, sort, page, refetchKey]);

    return (
        <div>
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #f97316 0, transparent 50%), radial-gradient(circle at 80% 70%, #fb923c 0, transparent 40%)' }} />
                <div className="relative container-app py-16 sm:py-24 text-center">
                    <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-400 animate-fade-up">Nouvelle collection</p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white text-balance animate-fade-up">
                        L’essentiel, fait pour durer.
                    </h1>
                    <p className="mt-4 max-w-xl mx-auto text-base sm:text-lg text-ink-300 animate-fade-up">
                        Des pièces sélectionnées avec soin, alliant élégance et fonctionnalité.
                    </p>
                    <div className="mt-8 flex justify-center animate-fade-up">
                        <Button size="lg" variant="secondary" onClick={() => document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })}>
                            Découvrir le catalogue
                        </Button>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="container-app py-12">
                <div className="flex items-end justify-between mb-6">
                    <h2 className="text-2xl font-display font-bold">Catégories</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => updateParam('cat', cat.slug)}
                            className={`group relative overflow-hidden rounded-xl border transition-all ${categoryId === cat.slug ? 'border-accent-500 ring-2 ring-accent-500/20' : 'border-ink-200 hover:border-ink-300'}`}
                        >
                            <div className="aspect-square overflow-hidden bg-ink-100">
                                <img src={cat.image} alt={cat.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                                <p className="text-sm font-semibold text-white">{cat.name}</p>
                                <p className="text-2xs text-ink-300">{cat.productCount} produits</p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Catalogue */}
            <section id="catalogue" className="container-app pb-16">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-display font-bold">
                            {categoryId ? categories.find(c => c.slug === categoryId)?.name ?? 'Produits' : 'Tous les produits'}
                        </h2>
                        <p className="text-sm text-ink-500 mt-0.5">{loading ? 'Chargement…' : `${total} produit${total > 1 ? 's' : ''}`}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {search && (
                            <div className="flex items-center gap-1.5 rounded-lg bg-ink-100 px-3 py-2 text-sm text-ink-700">
                                <Search className="h-3.5 w-3.5" />
                                « {search} »
                                <button onClick={() => updateParam('q', '')} className="ml-1 text-ink-400 hover:text-ink-700"><X className="h-3.5 w-3.5" /></button>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4 text-ink-400 hidden sm:block" />
                            <Select value={sort} onChange={e => updateParam('sort', e.target.value)} className="h-10 w-auto min-w-[160px]">
                                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </Select>
                        </div>
                    </div>
                </div>

                {error ? (
                    <EmptyState title="Une erreur est survenue" description={error} action={<Button onClick={fetchProducts}>Réessayer</Button>} />
                ) : loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                ) : items.length === 0 ? (
                    <EmptyState
                        title="Aucun produit trouvé"
                        description="Essayez de modifier votre recherche ou de changer de catégorie."
                        action={<Button variant="outline" onClick={() => router.replace(pathname)}>Réinitialiser les filtres</Button>}
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {items.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => updateParam('page', String(page - 1))}>
                                    Précédent
                                </Button>
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const n = i + 1;
                                    return (
                                        <button
                                            key={n}
                                            onClick={() => updateParam('page', String(n))}
                                            className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${n === page ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'}`}
                                        >
                                            {n}
                                        </button>
                                    );
                                })}
                                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => updateParam('page', String(page + 1))}>
                                    Suivant
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
