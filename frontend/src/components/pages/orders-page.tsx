'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight, X, MapPin, CreditCard, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { formatPrice, formatDate, formatDateTime, orderStatusLabel, orderStatusColor, paymentStatusLabel, paymentStatusColor } from '@/lib/format';
import type { Order } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';

export function OrdersPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Order | null>(null);
    const [cancelling, setCancelling] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        if (!user) { router.push('/auth?redirect=/commandes'); return; }
        api.getMyOrders(user.id)
            .then(setOrders)
            .catch(() => toast('Impossible de charger vos commandes.', 'error'))
            .finally(() => setLoading(false));
    }, [user, router, toast]);

    const openDetail = async (id: string) => {
        setDetailLoading(true);
        setSelected(null);
        try {
            const order = await api.getOrder(id);
            setSelected(order);
        } catch {
            toast('Commande introuvable.', 'error');
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!selected) return;
        setCancelling(true);
        try {
            const updated = await api.cancelOrder(selected.id);
            setSelected(updated);
            setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
            toast('Commande annulée.');
        } catch (e) {
            toast(e instanceof Error ? e.message : 'Impossible d\'annuler la commande.', 'error');
        } finally {
            setCancelling(false);
        }
    };

    if (!user) return null;

    return (
        <div className="container-app py-10">
            <h1 className="text-2xl font-display font-bold mb-8">Mes commandes</h1>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="card p-4 flex items-center gap-4">
                            <div className="skeleton h-12 w-12 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="skeleton h-4 w-32" />
                                <div className="skeleton h-3 w-48" />
                            </div>
                            <div className="skeleton h-6 w-20 rounded-full" />
                        </div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <EmptyState
                    icon={<Package className="h-8 w-8" />}
                    title="Aucune commande"
                    description="Vous n'avez pas encore passé de commande. Explorez le catalogue pour commencer."
                    action={<Button onClick={() => router.push('/catalogue')}>Découvrir le catalogue</Button>}
                />
            ) : (
                <div className="space-y-3">
                    {orders.map(order => (
                        <button
                            key={order.id}
                            onClick={() => openDetail(order.id)}
                            className="card card-hover w-full p-4 flex items-center gap-4 text-left animate-fade-up"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink-100 text-ink-500 shrink-0">
                                <Package className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-ink-900">#{order.id}</p>
                                    <Badge tone="neutral" className={orderStatusColor[order.status]}>{orderStatusLabel[order.status]}</Badge>
                                </div>
                                <p className="text-xs text-ink-500 mt-0.5">{formatDate(order.createdAt)} · {order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                                <ChevronRight className="h-4 w-4 text-ink-400 ml-auto mt-1" />
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Detail modal */}
            <Modal open={!!selected || detailLoading} onClose={() => { if (!cancelling) { setSelected(null); setDetailLoading(false); } }} title={selected ? `Commande #${selected.id}` : 'Chargement…'} size="lg">
                {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
                    </div>
                ) : selected ? (
                    <div className="space-y-5">
                        {/* Status badges */}
                        <div className="flex flex-wrap gap-2">
                            <Badge tone="neutral" className={orderStatusColor[selected.status]}>{orderStatusLabel[selected.status]}</Badge>
                            <Badge tone="neutral" className={paymentStatusColor[selected.paymentStatus]}>{paymentStatusLabel[selected.paymentStatus]}</Badge>
                        </div>

                        {/* Items */}
                        <div>
                            <h4 className="text-sm font-semibold mb-3">Articles</h4>
                            <div className="space-y-2.5">
                                {selected.items.map(item => (
                                    <div key={item.productId} className="flex items-center gap-3">
                                        <img src={item.image} alt={item.productName} className="h-12 w-12 rounded-lg object-cover bg-ink-100" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.productName}</p>
                                            <p className="text-xs text-ink-500">{formatPrice(item.unitPrice)} × {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold">{formatPrice(item.unitPrice * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-ink-100 flex justify-between items-center">
                                <span className="font-medium">Total</span>
                                <span className="text-lg font-display font-bold">{formatPrice(selected.total)}</span>
                            </div>
                        </div>

                        {/* Shipping address */}
                        <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-ink-400" /> Livraison</h4>
                            <div className="rounded-lg bg-ink-50 p-3 text-sm text-ink-600">
                                <p className="font-medium text-ink-900">{selected.shippingAddress.fullName}</p>
                                <p>{selected.shippingAddress.line1}</p>
                                {selected.shippingAddress.line2 && <p>{selected.shippingAddress.line2}</p>}
                                <p>{selected.shippingAddress.postalCode} {selected.shippingAddress.city}, {selected.shippingAddress.country}</p>
                                <p>{selected.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="text-xs text-ink-400 space-y-0.5">
                            <p>Créée le {formatDateTime(selected.createdAt)}</p>
                            <p>Mise à jour le {formatDateTime(selected.updatedAt)}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t border-ink-100">
                            {selected.status === 'PENDING' && selected.paymentStatus !== 'COMPLETED' && (
                                <Button variant="danger" loading={cancelling} onClick={handleCancel} fullWidth>
                                    <X className="h-4 w-4" /> Annuler la commande
                                </Button>
                            )}
                            {selected.status === 'PENDING' && selected.paymentStatus === 'PENDING' && (
                                <Button onClick={() => { router.push(`/paiement/${selected.id}`); setSelected(null); }} fullWidth>
                                    <CreditCard className="h-4 w-4" /> Payer maintenant
                                </Button>
                            )}
                            {selected.status !== 'PENDING' && (
                                <Button variant="outline" fullWidth onClick={() => setSelected(null)}>Fermer</Button>
                            )}
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
    );
}

