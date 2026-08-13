'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, User as UserIcon, Menu, X, Package, LogOut, LayoutDashboard } from 'lucide-react';
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
        router.push(`/catalogue?q=${encodeURIComponent(query)}`);
        setMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/80 backdrop-blur-lg">
            <div className="container-app">
                <div className="flex h-16 items-center gap-4">
                    <button className="lg:hidden -ml-2 p-2 text-ink-700" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
                        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>

                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-white">
                            <span className="font-display text-sm font-bold">M</span>
                        </div>
                        <span className="font-display text-lg font-bold tracking-tight hidden sm:block">Maison</span>
                    </Link>

                    <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-md mx-auto">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                            <input
                                type="search"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Rechercher un produit…"
                                className="input-base h-10 pl-10"
                            />
                        </div>
                    </form>

                    <nav className="hidden lg:flex items-center gap-1 ml-auto">
                        <NavLink to="/catalogue">Catalogue</NavLink>
                        <NavLink to="/commandes">Mes commandes</NavLink>
                        {isAdmin && <NavLink to="/admin">Administration</NavLink>}
                    </nav>

                    <div className="flex items-center gap-1 ml-auto lg:ml-2">
                        <div className="relative">
                            <button
                                onClick={() => setAccountOpen(v => !v)}
                                className="relative rounded-lg p-2.5 text-ink-700 hover:bg-ink-100 transition"
                                aria-label="Compte"
                            >
                                <UserIcon className="h-5 w-5" />
                            </button>
                            {accountOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-ink-200 bg-white shadow-pop p-1.5 z-20 animate-scale-in">
                                        {user ? (
                                            <>
                                                <div className="px-3 py-2.5 border-b border-ink-100 mb-1">
                                                    <p className="text-sm font-medium text-ink-900 truncate">{user.firstName} {user.lastName}</p>
                                                    <p className="text-xs text-ink-500 truncate">{user.email}</p>
                                                </div>
                                                <MenuItem icon={<Package className="h-4 w-4" />} label="Mes commandes" onClick={() => { router.push('/commandes'); setAccountOpen(false); }} />
                                                {isAdmin && <MenuItem icon={<LayoutDashboard className="h-4 w-4" />} label="Administration" onClick={() => { router.push('/admin'); setAccountOpen(false); }} />}
                                                <MenuItem icon={<LogOut className="h-4 w-4" />} label="Déconnexion" onClick={() => { logout(); setAccountOpen(false); router.push('/'); }} danger />
                                            </>
                                        ) : (
                                            <>
                                                <MenuItem label="Connexion" onClick={() => { router.push('/auth'); setAccountOpen(false); }} />
                                                <MenuItem label="Créer un compte" onClick={() => { router.push('/auth?mode=register'); setAccountOpen(false); }} />
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <Link href="/panier" className="relative rounded-lg p-2.5 text-ink-700 hover:bg-ink-100 transition" aria-label="Panier">
                            <ShoppingBag className="h-5 w-5" />
                            {count > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-2xs font-bold text-white animate-scale-in">
                  {count}
                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {menuOpen && (
                    <div className="lg:hidden border-t border-ink-100 py-4 animate-fade-in">
                        <form onSubmit={submitSearch} className="mb-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                                <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher…" className="input-base h-10 pl-10" />
                            </div>
                        </form>
                        <div className="flex flex-col gap-1">
                            <MobileLink to="/catalogue" onClick={() => setMenuOpen(false)}>Catalogue</MobileLink>
                            <MobileLink to="/commandes" onClick={() => setMenuOpen(false)}>Mes commandes</MobileLink>
                            {isAdmin && <MobileLink to="/admin" onClick={() => setMenuOpen(false)}>Administration</MobileLink>}
                            {!user && <MobileLink to="/auth" onClick={() => setMenuOpen(false)}>Connexion</MobileLink>}
                            {user && <button onClick={() => { logout(); setMenuOpen(false); router.push('/'); }} className="px-3 py-2.5 text-left text-sm text-danger-600 hover:bg-danger-50 rounded-lg">Déconnexion</button>}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <Link href={to} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:text-ink-900 hover:bg-ink-100 transition">
            {children}
        </Link>
    );
}

function MobileLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
    return <Link href={to} onClick={onClick} className="px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100 rounded-lg">{children}</Link>;
}

function MenuItem({ icon, label, onClick, danger }: { icon?: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
    return (
        <button onClick={onClick} className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${danger ? 'text-danger-600 hover:bg-danger-50' : 'text-ink-700 hover:bg-ink-100'}`}>
            {icon} {label}
        </button>
    );
}

