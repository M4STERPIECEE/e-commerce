'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, MapPin, Check } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { ShippingAddress } from '@/types';

type FormData = ShippingAddress;
type FormErrors = Partial<Record<keyof FormData, string>>;

const COUNTRIES = ['France', 'Belgique', 'Suisse', 'Luxembourg', 'Canada'];

export function CheckoutPage() {
    const { items, total, clear } = useCart();
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const [form, setForm] = useState<FormData>({
        fullName: user ? `${user.firstName} ${user.lastName}` : '',
        line1: '',
        line2: '',
        city: '',
        postalCode: '',
        country: 'France',
        phone: '',
    });

    const shipping = total >= 50 ? 0 : 4.90;
    const grandTotal = total + shipping;

    useEffect(() => {
        if (items.length === 0) {
            router.replace('/panier');
            return;
        }
        if (!user) {
            router.replace('/auth?redirect=/checkout');
        }
    }, [items.length, user, router]);

    if (items.length === 0 || !user) return null;

    const set = (key: keyof FormData, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
        setErrors(prev => ({ ...prev, [key]: undefined }));
    };

    const validate = (): boolean => {
        const e: FormErrors = {};
        if (!form.fullName.trim()) e.fullName = 'Le nom est requis.';
        if (!form.line1.trim()) e.line1 = 'L\'adresse est requise.';
        if (!form.city.trim()) e.city = 'La ville est requise.';
        if (!form.postalCode.trim()) e.postalCode = 'Le code postal est requis.';
        else if (!/^\d{4,6}$/.test(form.postalCode.trim())) e.postalCode = 'Code postal invalide.';
        if (!form.phone.trim()) e.phone = 'Le téléphone est requis.';
        else if (!/^[\d\s+]{8,}$/.test(form.phone.trim())) e.phone = 'Téléphone invalide.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast('Veuillez corriger les champs en rouge.', 'error');
            return;
        }
        setSubmitting(true);
        try {
            const order = await api.createOrder(
                user.id,
                items.map(i => ({ productId: i.product.id, productName: i.product.name, unitPrice: i.product.price, quantity: i.quantity, image: i.product.image })),
                grandTotal,
                form
            );
            clear();
            toast('Commande créée. Procédez au paiement.');
            router.push(`/paiement/${order.id}`);
        } catch {
            toast('Erreur lors de la création de la commande.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container-app py-10">
            <button onClick={() => router.push('/panier')} className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition mb-6">
                <ArrowLeft className="h-4 w-4" /> Retour au panier
            </button>

            <h1 className="text-2xl font-display font-bold mb-8">Finaliser la commande</h1>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Address form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-5 sm:p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <MapPin className="h-5 w-5 text-accent-500" />
                            <h2 className="text-lg font-semibold">Adresse de livraison</h2>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <Input label="Nom complet" value={form.fullName} onChange={e => set('fullName', e.target.value)} error={errors.fullName} placeholder="Jean Dupont" />
                            </div>
                            <div className="sm:col-span-2">
                                <Input label="Adresse" value={form.line1} onChange={e => set('line1', e.target.value)} error={errors.line1} placeholder="12 rue des Lilas" />
                            </div>
                            <div className="sm:col-span-2">
                                <Input label="Complément d'adresse (optionnel)" value={form.line2 ?? ''} onChange={e => set('line2', e.target.value)} placeholder="Appartement, étage…" />
                            </div>
                            <Input label="Ville" value={form.city} onChange={e => set('city', e.target.value)} error={errors.city} placeholder="Paris" />
                            <Input label="Code postal" value={form.postalCode} onChange={e => set('postalCode', e.target.value)} error={errors.postalCode} placeholder="75001" />
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-ink-700">Pays</label>
                                <select value={form.country} onChange={e => set('country', e.target.value)} className="input-base">
                                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <Input label="Téléphone" value={form.phone} onChange={e => set('phone', e.target.value)} error={errors.phone} placeholder="06 12 34 56 78" />
                        </div>
                    </div>

                    {/* Items recap */}
                    <div className="card p-5 sm:p-6">
                        <h2 className="text-lg font-semibold mb-4">Articles ({items.length})</h2>
                        <div className="space-y-3">
                            {items.map(({ product, quantity }) => (
                                <div key={product.id} className="flex items-center gap-3">
                                    <img src={product.image} alt={product.name} className="h-14 w-14 rounded-lg object-cover bg-ink-100" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-ink-900 truncate">{product.name}</p>
                                        <p className="text-xs text-ink-500">×{quantity}</p>
                                    </div>
                                    <p className="text-sm font-semibold">{formatPrice(product.price * quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="card p-5 sticky top-24">
                        <h2 className="text-lg font-semibold mb-4">Récapitulatif</h2>
                        <div className="space-y-2.5 text-sm">
                            <div className="flex justify-between text-ink-600">
                                <span>Sous-total</span>
                                <span className="font-medium text-ink-900">{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between text-ink-600">
                                <span>Livraison</span>
                                <span className="font-medium text-ink-900">{shipping === 0 ? 'Offerte' : formatPrice(shipping)}</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-ink-100 flex justify-between items-center">
                            <span className="font-medium">Total</span>
                            <span className="text-xl font-display font-bold">{formatPrice(grandTotal)}</span>
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-accent-50 border border-accent-100 flex items-start gap-2">
                            <Check className="h-4 w-4 text-accent-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-accent-800">Le paiement sera effectué à l’étape suivante. Vos informations sont sécurisées.</p>
                        </div>
                        <Button fullWidth size="lg" className="mt-5" loading={submitting} onClick={handleSubmit}>
                            <CreditCard className="h-5 w-5" /> Payer {formatPrice(grandTotal)}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

