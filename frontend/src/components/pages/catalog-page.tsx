'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import type { Category, Product } from '@/types';
import { ProductCard } from '@/components/product/product-card';
import { HeroSection } from '@/components/home/hero-section';
import { ValueProps } from '@/components/home/value-props';

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
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [loadedKey, setLoadedKey] = useState<string | null>(null);

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

    const requestKey = `${search}|${categoryId}|${sort}|${page}|${refetchKey}`;
    const loading = loadedKey !== requestKey;

    useEffect(() => {
        let isMounted = true;
        api.getProducts({ search, categoryId, sort, page, pageSize: 8 })
            .then(res => {
                if (!isMounted) return;
                setItems(res.items);
                setTotalPages(res.totalPages);
                setError(null);
                setLoadedKey(requestKey);
            })
            .catch(() => {
                if (!isMounted) return;
                setError('Impossible de charger les produits.');
                setLoadedKey(requestKey);
            });
        return () => { isMounted = false; };
    }, [requestKey, search, categoryId, sort, page]);

    return (
        <div className="w-full">
            {/* Hero Section */}
            <HeroSection onExploreClick={() => document.getElementById('curations-section')?.scrollIntoView({ behavior: 'smooth' })} />

            {/* Value Props */}
            <ValueProps />

            {/* Featured Curations / Catalog */}
            <section id="curations-section" className="py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h2 className="font-headline-lg text-headline-lg md:text-headline-lg text-primary mb-2 font-bold tracking-tight">
                            {search ? `Résultats pour « ${search} »` : categoryId ? (categories.find(c => c.slug === categoryId)?.name ?? 'Collection') : 'Featured Curations'}
                        </h2>
                        <p className="font-body-lg text-body-lg text-secondary">
                            Discover our most sought-after essentials.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {search && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant text-body-sm text-primary">
                                <span>« {search} »</span>
                                <button
                                    onClick={() => updateParam('q', '')}
                                    className="text-secondary hover:text-primary transition"
                                >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            </div>
                        )}

                        {/* Sort Select */}
                        <div className="relative">
                            <select
                                value={sort}
                                onChange={e => updateParam('sort', e.target.value)}
                                className="appearance-none bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-2 pr-9 text-body-sm font-button text-primary focus:outline-none focus:ring-2 focus:ring-outline-variant transition cursor-pointer"
                            >
                                {SORTS.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-[18px]">
                                expand_more
                            </span>
                        </div>
                    </div>
                </div>

                {/* Categories Tabs */}
                {categories.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-6">
                        <button
                            onClick={() => updateParam('cat', '')}
                            className={`px-5 py-2 rounded-full text-label-caps font-label-caps transition-all shrink-0 cursor-pointer ${
                                !categoryId
                                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                                    : 'bg-surface-container-lowest text-secondary border border-outline-variant hover:border-primary hover:text-primary'
                            }`}
                        >
                            All Collections
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => updateParam('cat', cat.slug)}
                                className={`px-5 py-2 rounded-full text-label-caps font-label-caps transition-all shrink-0 cursor-pointer ${
                                    categoryId === cat.slug
                                        ? 'bg-primary text-on-primary font-bold shadow-sm'
                                        : 'bg-surface-container-lowest text-secondary border border-outline-variant hover:border-primary hover:text-primary'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Product Grid */}
                {error ? (
                    <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant p-8">
                        <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
                        <p className="font-headline-md text-primary mb-4">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="bg-primary text-on-primary font-button px-6 py-2.5 rounded hover:bg-primary/90 transition"
                        >
                            Réessayer
                        </button>
                    </div>
                ) : loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[4/5] bg-surface-container-low rounded border border-outline-variant/40 mb-4" />
                                <div className="h-4 bg-surface-container-low rounded w-3/4 mb-2" />
                                <div className="h-4 bg-surface-container-low rounded w-1/4" />
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant p-8">
                        <span className="material-symbols-outlined text-4xl text-secondary mb-2">inventory_2</span>
                        <p className="font-headline-md text-primary mb-2">Aucun produit trouvé</p>
                        <p className="text-secondary mb-6 text-body-sm">Essayez de modifier votre recherche ou vos filtres.</p>
                        <button
                            onClick={() => router.replace(pathname)}
                            className="bg-primary text-on-primary font-button px-6 py-2.5 rounded hover:bg-primary/90 transition"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                            {items.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-14 flex items-center justify-center gap-2">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => updateParam('page', String(page - 1))}
                                    className="px-4 py-2 rounded border border-outline-variant text-body-sm font-medium text-primary hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    Précédent
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const n = i + 1;
                                    return (
                                        <button
                                            key={n}
                                            onClick={() => updateParam('page', String(n))}
                                            className={`h-10 min-w-10 rounded text-body-sm font-semibold transition ${
                                                n === page
                                                    ? 'bg-primary text-on-primary'
                                                    : 'border border-outline-variant text-primary hover:bg-surface-container-low'
                                            }`}
                                        >
                                            {n}
                                        </button>
                                    );
                                })}
                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => updateParam('page', String(page + 1))}
                                    className="px-4 py-2 rounded border border-outline-variant text-body-sm font-medium text-primary hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
