'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreditCard, Lock, CheckCircle2, XCircle, ArrowLeft, Package } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice, orderStatusLabel, paymentStatusLabel, paymentStatusColor } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import type { Order, PaymentStatus } from '@/types';
import { useToast } from '@/context/toast-context';

export function PaymentPage() {
    const params = useParams<{ orderId: string }>();
    const orderId = params?.orderId ?? '';
    const router = useRouter();
    const { toast } = useToast();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
    const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!orderId) return;
        api.getOrder(orderId)
            .then(o => {
                setOrder(o);
                if (o.paymentStatus === 'COMPLETED') setPaymentStatus('COMPLETED');
                else if (o.paymentStatus === 'FAILED') setPaymentStatus('FAILED');
            })
            .catch(() => toast('Commande introuvable.', 'error'))
            .finally(() => setLoading(false));
    }, [orderId, toast]);

    const validate = () => {
        const e: Record<string, string> = {};
        const digits = card.number.replace(/\s/g, '');
        if (digits.length < 13 || digits.length > 19) e.number = 'Numéro de carte invalide.';
        if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = 'Format MM/AA.';
        if (!/^\d{3,4}$/.test(card.cvc)) e.cvc = 'CVC invalide.';
        if (!card.name.trim()) e.name = 'Nom requis.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handlePay = async () => {
        if (!validate() || !order) return;
        setPaying(true);
        try {
            const last4 = card.number.replace(/\s/g, '').slice(-4);
            const { paymentStatus } = await api.payOrder(order.id, last4);
            setPaymentStatus(paymentStatus);
            if (paymentStatus === 'COMPLETED') {
                toast('Paiement réussi ! Votre commande est confirmée.');
            } else {
                toast('Le paiement a échoué. Vérifiez vos informations.', 'error');
            }
            const updated = await api.getOrder(order.id);
            setOrder(updated);
        } catch {
            toast('Erreur lors du paiement.', 'error');
        } finally {
            setPaying(false);
        }
    };

    if (loading) return <div className="container-app py-20 text-center text-ink-500">Chargement…</div>;
    if (!order) return (
        <div className="container-app py-20 text-center">
            <p className="text-ink-500 mb-4">Commande introuvable.</p>
            <Button variant="outline" onClick={() => router.push('/catalogue')}>Retour au catalogue</Button>
        </div>
    );

    // Success state
    if (paymentStatus === 'COMPLETED') {
        return (
            <div className="container-app py-16 max-w-lg text-center animate-fade-up">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-100 animate-scale-in">
                    <CheckCircle2 className="h-10 w-10 text-success-600" />
                </div>
                <h1 className="text-3xl font-display font-bold">Paiement réussi !</h1>
                <p className="mt-3 text-ink-500">Votre commande <span className="font-semibold text-ink-900">#{order.id}</span> a été confirmée. Vous recevrez un email de suivi prochainement.</p>
                <div className="mt-6 card p-5 text-left">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-ink-500">Montant payé</span>
                        <span className="text-lg font-semibold">{formatPrice(order.total)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-ink-500">Statut</span>
                        <Badge tone="success">{orderStatusLabel[order.status]}</Badge>
                    </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => router.push('/commandes')}><Package className="h-4 w-4" /> Suivre ma commande</Button>
                    <Button variant="outline" onClick={() => router.push('/catalogue')}>Continuer mes achats</Button>
                </div>
            </div>
        );
    }

    // Failed state
    if (paymentStatus === 'FAILED') {
        return (
            <div className="container-app py-16 max-w-lg text-center animate-fade-up">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-danger-100 animate-scale-in">
                    <XCircle className="h-10 w-10 text-danger-600" />
                </div>
                <h1 className="text-3xl font-display font-bold">Paiement échoué</h1>
                <p className="mt-3 text-ink-500">Le paiement n’a pas pu aboutir. Vous pouvez réessayer avec une autre carte.</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => setPaymentStatus(null)}>Réessayer le paiement</Button>
                    <Button variant="outline" onClick={() => router.push('/commandes')}>Voir mes commandes</Button>
                </div>
            </div>
        );
    }

    // Payment form
    return (
        <div className="container-app py-10 max-w-2xl">
            <button onClick={() => router.push('/commandes')} className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition mb-6">
                <ArrowLeft className="h-4 w-4" /> Retour
            </button>

            <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-success-500" />
                <h1 className="text-2xl font-display font-bold">Paiement sécurisé</h1>
            </div>
            <p className="text-sm text-ink-500 mb-8">Commande <span className="font-semibold text-ink-900">#{order.id}</span> — {formatPrice(order.total)}</p>

            <div className="grid gap-6 md:grid-cols-5">
                {/* Card form */}
                <div className="md:col-span-3">
                    <div className="card p-5 sm:p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <CreditCard className="h-5 w-5 text-accent-500" />
                            <h2 className="text-lg font-semibold">Carte bancaire</h2>
                        </div>
                        <div className="space-y-4">
                            <Input label="Titulaire de la carte" value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} error={errors.name} placeholder="Jean Dupont" />
                            <Input
                                label="Numéro de carte"
                                value={card.number}
                                onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                                error={errors.number}
                                placeholder="4242 4242 4242 4242"
                                inputMode="numeric"
                                maxLength={23}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Expiration" value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))} error={errors.expiry} placeholder="MM/AA" maxLength={5} />
                                <Input label="CVC" value={card.cvc} onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g, '') }))} error={errors.cvc} placeholder="123" maxLength={4} inputMode="numeric" />
                            </div>
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-ink-50 flex items-start gap-2">
                            <Lock className="h-4 w-4 text-ink-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-ink-500">Vos données sont chiffrées. Nous ne stockons jamais votre carte. Astuce : utilisez 4242… pour réussir, 0000 pour échouer.</p>
                        </div>
                        <Button fullWidth size="lg" className="mt-5" loading={paying} onClick={handlePay}>
                            {paying ? 'Traitement…' : `Payer ${formatPrice(order.total)}`}
                        </Button>
                    </div>
                </div>

                {/* Order recap */}
                <div className="md:col-span-2">
                    <div className="card p-5">
                        <h2 className="text-sm font-semibold mb-3">Récapitulatif</h2>
                        <div className="space-y-2.5">
                            {order.items.map(item => (
                                <div key={item.productId} className="flex items-center gap-2.5">
                                    <img src={item.image} alt={item.productName} className="h-10 w-10 rounded-md object-cover bg-ink-100" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">{item.productName}</p>
                                        <p className="text-2xs text-ink-500">×{item.quantity}</p>
                                    </div>
                                    <p className="text-xs font-semibold">{formatPrice(item.unitPrice * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-ink-100 flex justify-between items-center">
                            <span className="text-sm font-medium">Total</span>
                            <span className="text-lg font-display font-bold">{formatPrice(order.total)}</span>
                        </div>
                        <div className="mt-3">
                            <Badge tone="warning" className={paymentStatusColor[order.paymentStatus]}>{paymentStatusLabel[order.paymentStatus]}</Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatCardNumber(v: string): string {
    const digits = v.replace(/\D/g, '').slice(0, 19);
    return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(v: string): string {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
}

