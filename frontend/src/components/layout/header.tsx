'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';

export function Header() {
    const { count } = useCart();
    const { user, logout, isAdmin } = useAuth();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            router.push('/catalogue');
        } else {
            router.push(`/catalogue?q=${encodeURIComponent(query.trim())}`);
        }
        setMenuOpen(false);
    };

    return (
        <header className="bg-surface/80 backdrop-blur-md dark:bg-surface-dim/80 docked full-width top-0 sticky border-b border-outline-variant/30 shadow-sm z-50">
            <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
                {/* Mobile menu toggle */}
                <button
                    className="md:hidden text-primary p-2 -ml-2"
                    onClick={() => setMenuOpen(v => !v)}
                    aria-label="Menu"
                >
                    <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
                </button>

                {/* Left: Logo */}
                <Link className="font-display-lg text-[28px] md:text-display-lg tracking-tighter text-primary font-bold" href="/">
                    LUXE
                </Link>

                {/* Center: Navigation (Desktop) */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link className="font-label-caps text-label-caps text-secondary transition-colors duration-200 hover:text-primary transition-all" href="/catalogue">
                        Shop
                    </Link>
                    <Link className="font-label-caps text-label-caps text-primary font-semibold border-b-2 border-primary pb-1 hover:text-primary transition-all" href="/catalogue">
                        Collections
                    </Link>
                    <Link className="font-label-caps text-label-caps text-secondary transition-colors duration-200 hover:text-primary transition-all" href="/commandes">
                        Commandes
                    </Link>
                    {isAdmin && (
                        <Link className="font-label-caps text-label-caps text-secondary transition-colors duration-200 hover:text-primary transition-all" href="/admin">
                            Admin
                        </Link>
                    )}
                </nav>

                {/* Right: Actions & Search */}
                <div className="flex items-center gap-3 md:gap-4">
                    <form onSubmit={submitSearch} className="hidden md:flex items-center bg-surface-container-lowest rounded-full border border-outline-variant px-4 py-2 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-outline-variant/50 transition-all">
                        <span className="material-symbols-outlined text-secondary mr-2 text-[20px]" data-icon="search">search</span>
                        <input
                            className="bg-transparent border-none p-0 text-body-sm font-body-sm focus:ring-0 w-28 lg:w-36 placeholder-secondary outline-none"
                            placeholder="Search"
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </form>

                    {/* Account menu dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setAccountOpen(v => !v)}
                            className="text-primary hover:text-secondary transition-all flex items-center p-1.5 rounded-full hover:bg-surface-container-low"
                            aria-label="Compte"
                        >
                            <span className="material-symbols-outlined" data-icon="person">person</span>
                        </button>
                        {accountOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-outline-variant/60 bg-surface-container-lowest shadow-pop p-1.5 z-20 animate-scale-in">
                                    {user ? (
                                        <>
                                            <div className="px-3 py-2.5 border-b border-outline-variant/30 mb-1">
                                                <p className="text-sm font-semibold text-primary truncate">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-secondary truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => { router.push('/commandes'); setAccountOpen(false); }}
                                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-body-sm font-medium text-primary hover:bg-surface-container-low transition"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                                                Mes commandes
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => { router.push('/admin'); setAccountOpen(false); }}
                                                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-body-sm font-medium text-primary hover:bg-surface-container-low transition"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                                                    Administration
                                                </button>
                                            )}
                                            <button
                                                onClick={() => { logout(); setAccountOpen(false); router.push('/'); }}
                                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-body-sm font-medium text-error hover:bg-error-container/40 transition"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                                Déconnexion
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => { router.push('/auth'); setAccountOpen(false); }}
                                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-body-sm font-medium text-primary hover:bg-surface-container-low transition"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">login</span>
                                                Connexion
                                            </button>
                                            <button
                                                onClick={() => { router.push('/auth?mode=register'); setAccountOpen(false); }}
                                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-body-sm font-medium text-primary hover:bg-surface-container-low transition"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">person_add</span>
                                                Créer un compte
                                            </button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={() => router.push('/catalogue')}
                        className="text-primary hover:text-secondary transition-all p-1.5 rounded-full hover:bg-surface-container-low"
                        aria-label="Favoris"
                    >
                        <span className="material-symbols-outlined" data-icon="favorite">favorite</span>
                    </button>

                    {/* Cart Button */}
                    <Link
                        href="/panier"
                        className="relative text-primary hover:text-secondary transition-all p-1.5 rounded-full hover:bg-surface-container-low"
                        aria-label="Panier"
                    >
                        <span className="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
                        {count > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary animate-scale-in px-1">
                                {count}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-outline-variant/30 px-margin-mobile py-4 bg-surface-container-lowest animate-fade-in">
                    <form onSubmit={submitSearch} className="mb-4 flex items-center bg-surface-container-low rounded-full border border-outline-variant px-4 py-2">
                        <span className="material-symbols-outlined text-secondary mr-2 text-[20px]">search</span>
                        <input
                            type="search"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Rechercher…"
                            className="bg-transparent border-none p-0 text-body-sm font-body-sm focus:ring-0 w-full outline-none"
                        />
                    </form>
                    <nav className="flex flex-col gap-2">
                        <Link href="/catalogue" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-body-sm font-medium text-primary hover:bg-surface-container-low rounded-lg">
                            Shop / Catalogue
                        </Link>
                        <Link href="/commandes" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-body-sm font-medium text-primary hover:bg-surface-container-low rounded-lg">
                            Mes commandes
                        </Link>
                        {isAdmin && (
                            <Link href="/admin" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-body-sm font-medium text-primary hover:bg-surface-container-low rounded-lg">
                                Administration
                            </Link>
                        )}
                        {!user ? (
                            <Link href="/auth" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-body-sm font-medium text-primary hover:bg-surface-container-low rounded-lg">
                                Connexion / Inscription
                            </Link>
                        ) : (
                            <button
                                onClick={() => { logout(); setMenuOpen(false); router.push('/'); }}
                                className="text-left px-3 py-2 text-body-sm font-medium text-error hover:bg-error-container/40 rounded-lg"
                            >
                                Déconnexion
                            </button>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
