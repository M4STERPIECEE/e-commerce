'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, TrendingUp, Plus, Pencil, Trash2, Search, DollarSign } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { formatPrice, formatDate, orderStatusLabel, orderStatusColor } from '@/lib/format';
import type { Order, OrderStatus, Product, Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';

const ORDER_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

type Tab = 'overview' | 'orders' | 'products';

export function AdminPage() {
    const { user, isAdmin } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('overview');
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderSearch, setOrderSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [productSearch, setProductSearch] = useState('');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showProductModal, setShowProductModal] = useState(false);

    useEffect(() => {
        if (!user) { router.push('/auth?redirect=/admin'); return; }
        if (user && !isAdmin) { router.push('/'); toast('Accès réservé aux administrateurs.', 'error'); return; }
        Promise.all([api.getAllOrders(), api.getProducts({ pageSize: 100 }), api.getCategories()])
            .then(([o, p, c]) => { setOrders(o); setProducts(p.items); setCategories(c); })
            .catch(() => toast('Erreur de chargement.', 'error'))
            .finally(() => setLoading(false));
    }, [user, isAdmin, router, toast]);

    const refreshOrders = useCallback(async () => {
        const o = await api.getAllOrders();
        setOrders(o);
    }, []);

    const refreshProducts = useCallback(async () => {
        const p = await api.getProducts({ pageSize: 100 });
        setProducts(p.items);
    }, []);

    const handleStatusChange = async (orderId: string, status: OrderStatus) => {
        try {
            await api.updateOrderStatus(orderId, status);
            await refreshOrders();
            toast(`Statut mis à jour : ${orderStatusLabel[status]}.`);
        } catch {
            toast('Erreur lors de la mise à jour.', 'error');
        }
    };

    const handleSaveProduct = async (product: Product) => {
        try {
            await api.saveProduct(product);
            await refreshProducts();
            toast('Produit enregistré.');
            setShowProductModal(false);
            setEditingProduct(null);
        } catch {
            toast('Erreur lors de l\'enregistrement.', 'error');
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Supprimer ce produit ?')) return;
        try {
            await api.deleteProduct(id);
            await refreshProducts();
            toast('Produit supprimé.');
        } catch {
            toast('Erreur lors de la suppression.', 'error');
        }
    };

    if (!user || !isAdmin) return null;

    const filteredOrders = orders.filter(o => {
        if (statusFilter && o.status !== statusFilter) return false;
        if (orderSearch) {
            const q = orderSearch.toLowerCase();
            return o.id.toLowerCase().includes(q) || o.shippingAddress.fullName.toLowerCase().includes(q);
        }
        return true;
    });

    const filteredProducts = products.filter(p => {
        if (!productSearch) return true;
        const q = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    });

    const revenue = orders.filter(o => o.paymentStatus === 'COMPLETED').reduce((s, o) => s + o.total, 0);
    const pendingCount = orders.filter(o => o.status === 'PENDING').length;

    return (
        <div className="container-app py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-display font-bold flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6" /> Administration
                    </h1>
                    <p className="text-sm text-ink-500 mt-1">Gérez votre boutique en un coup d&apos;œil.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-ink-200 mb-6 overflow-x-auto no-scrollbar">
                <TabButton active={tab === 'overview'} onClick={() => setTab('overview')}>Vue d&apos;ensemble</TabButton>
                <TabButton active={tab === 'orders'} onClick={() => setTab('orders')}>Commandes ({orders.length})</TabButton>
                <TabButton active={tab === 'products'} onClick={() => setTab('products')}>Produits ({products.length})</TabButton>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="skeleton h-8 w-8 rounded-full" />
                </div>
            ) : (
                <>
                    {/* OVERVIEW */}
                    {tab === 'overview' && (
                        <div className="space-y-6 animate-fade-up">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <StatCard icon={<DollarSign className="h-5 w-5" />} label="Chiffre d'affaires" value={formatPrice(revenue)} tone="success" />
                                <StatCard icon={<ShoppingBag className="h-5 w-5" />} label="Commandes" value={String(orders.length)} tone="accent" />
                                <StatCard icon={<Package className="h-5 w-5" />} label="Produits" value={String(products.length)} tone="blue" />
                                <StatCard icon={<TrendingUp className="h-5 w-5" />} label="En attente" value={String(pendingCount)} tone="warning" />
                            </div>

                            <div className="card p-5">
                                <h2 className="text-lg font-semibold mb-4">Dernières commandes</h2>
                                <div className="space-y-2">
                                    {orders.slice(0, 5).map(order => (
                                        <div key={order.id} className="flex items-center gap-3 py-2.5 border-b border-ink-100 last:border-0">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">#{order.id}</p>
                                                <p className="text-xs text-ink-500">{order.shippingAddress.fullName} · {formatDate(order.createdAt)}</p>
                                            </div>
                                            <Badge tone="neutral" className={orderStatusColor[order.status]}>{orderStatusLabel[order.status]}</Badge>
                                            <p className="text-sm font-semibold w-20 text-right">{formatPrice(order.total)}</p>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" size="sm" className="mt-4" onClick={() => setTab('orders')}>Voir toutes les commandes</Button>
                            </div>
                        </div>
                    )}

                    {/* ORDERS */}
                    {tab === 'orders' && (
                        <div className="space-y-4 animate-fade-up">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                                    <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="Rechercher par n° de commande ou nom" className="input-base h-10 pl-10" />
                                </div>
                                <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-10 w-auto sm:min-w-[180px]">
                                    <option value="">Tous les statuts</option>
                                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{orderStatusLabel[s]}</option>)}
                                </Select>
                            </div>

                            {filteredOrders.length === 0 ? (
                                <EmptyState title="Aucune commande" description="Aucune commande ne correspond à votre recherche." />
                            ) : (
                                <div className="card overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                            <tr className="border-b border-ink-100 bg-ink-50">
                                                <th className="px-4 py-3 text-left font-medium text-ink-600">Commande</th>
                                                <th className="px-4 py-3 text-left font-medium text-ink-600 hidden sm:table-cell">Client</th>
                                                <th className="px-4 py-3 text-left font-medium text-ink-600 hidden md:table-cell">Date</th>
                                                <th className="px-4 py-3 text-left font-medium text-ink-600">Statut</th>
                                                <th className="px-4 py-3 text-right font-medium text-ink-600">Total</th>
                                                <th className="px-4 py-3 text-left font-medium text-ink-600">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {filteredOrders.map(order => (
                                                <tr key={order.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/50 transition">
                                                    <td className="px-4 py-3 font-medium">#{order.id}</td>
                                                    <td className="px-4 py-3 text-ink-600 hidden sm:table-cell">{order.shippingAddress.fullName}</td>
                                                    <td className="px-4 py-3 text-ink-500 hidden md:table-cell">{formatDate(order.createdAt)}</td>
                                                    <td className="px-4 py-3">
                                                        <Badge tone="neutral" className={orderStatusColor[order.status]}>{orderStatusLabel[order.status]}</Badge>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-semibold">{formatPrice(order.total)}</td>
                                                    <td className="px-4 py-3">
                                                        <select
                                                            value={order.status}
                                                            onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                                            className="rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-xs font-medium text-ink-700 focus:outline-none focus:border-accent-500"
                                                        >
                                                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{orderStatusLabel[s]}</option>)}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* PRODUCTS */}
                    {tab === 'products' && (
                        <div className="space-y-4 animate-fade-up">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                                    <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Rechercher un produit…" className="input-base h-10 pl-10" />
                                </div>
                                <Button onClick={() => { setEditingProduct(null); setShowProductModal(true); }}>
                                    <Plus className="h-4 w-4" /> Nouveau produit
                                </Button>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredProducts.map(product => {
                                    const cat = categories.find(c => c.id === product.categoryId);
                                    return (
                                        <div key={product.id} className="card p-4 flex gap-3">
                                            <img src={product.image} alt={product.name} className="h-16 w-16 rounded-lg object-cover bg-ink-100 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{product.name}</p>
                                                <p className="text-xs text-ink-500">{cat?.name ?? '—'}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
                                                    <Badge tone={product.stock === 0 ? 'danger' : product.stock <= 5 ? 'warning' : 'success'}>
                                                        Stock: {product.stock}
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-1 mt-2">
                                                    <button onClick={() => { setEditingProduct(product); setShowProductModal(true); }} className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition" aria-label="Modifier">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button onClick={() => handleDeleteProduct(product.id)} className="rounded-lg p-1.5 text-ink-500 hover:bg-danger-50 hover:text-danger-600 transition" aria-label="Supprimer">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredProducts.length === 0 && (
                                <EmptyState title="Aucun produit" description="Aucun produit ne correspond à votre recherche." />
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Product edit modal */}
            {showProductModal && (
                <ProductEditModal
                    product={editingProduct}
                    categories={categories}
                    onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
                    onSave={handleSaveProduct}
                />
            )}
        </div>
    );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${active ? 'border-accent-500 text-ink-900' : 'border-transparent text-ink-500 hover:text-ink-700'}`}
        >
            {children}
        </button>
    );
}

const TONES = { success: 'bg-success-100 text-success-600', accent: 'bg-accent-100 text-accent-600', blue: 'bg-blue-100 text-blue-600', warning: 'bg-warning-100 text-warning-600' } as const;

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: keyof typeof TONES }) {
    return (
        <div className="card p-5">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${TONES[tone]}`}>{icon}</div>
            <p className="text-2xl font-display font-bold">{value}</p>
            <p className="text-sm text-ink-500 mt-0.5">{label}</p>
        </div>
    );
}

function ProductEditModal({ product, categories, onClose, onSave }: {
    product: Product | null;
    categories: Category[];
    onClose: () => void;
    onSave: (p: Product) => void;
}) {
    const [form, setForm] = useState<Product>(
        product ?? {
            id: '',
            name: '',
            slug: '',
            price: 0,
            stock: 0,
            description: '',
            categoryId: categories[0]?.id ?? '',
            image: 'https://images.pexels.com/photos/4214643/pexels-photo-4214643.jpeg?auto=compress&cs=tinysrgb&w=800',
            rating: 4.5,
            createdAt: new Date().toISOString(),
        }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = 'Nom requis.';
        if (form.price <= 0) e.price = 'Prix invalide.';
        if (form.stock < 0) e.stock = 'Stock invalide.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        onSave({
            ...form,
            id: form.id || `p-${Date.now()}`,
            slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        });
    };

    return (
        <Modal open onClose={onClose} title={product ? 'Modifier le produit' : 'Nouveau produit'} size="lg">
            <div className="space-y-4">
                <Input label="Nom" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name} />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Prix (€)" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} error={errors.price} />
                    <Input label="Stock" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))} error={errors.stock} />
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Catégorie</label>
                    <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="input-base">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink-700">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="input-base resize-none" />
                </div>
                <Input label="URL de l'image" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
                {form.image && (
                    <div className="flex items-center gap-3">
                        <img src={form.image} alt="Aperçu" className="h-20 w-20 rounded-lg object-cover bg-ink-100" />
                        <p className="text-xs text-ink-400">Aperçu de l&apos;image</p>
                    </div>
                )}
                <div className="flex gap-2 pt-2 border-t border-ink-100">
                    <Button variant="outline" fullWidth onClick={onClose}>Annuler</Button>
                    <Button fullWidth onClick={handleSubmit}>{product ? 'Enregistrer' : 'Créer'}</Button>
                </div>
            </div>
        </Modal>
    );
}

