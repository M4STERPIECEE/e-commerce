import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-ink-200/70 bg-white mt-16">
            <div className="container-app py-12">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-white">
                                <span className="font-display text-sm font-bold">M</span>
                            </div>
                            <span className="font-display text-lg font-bold">Maison</span>
                        </div>
                        <p className="text-sm text-ink-500 leading-relaxed max-w-xs">
                            Des objets essentiels, pensés pour durer. Sélectionnés avec soin, livrés avec soin.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-ink-900 mb-3">Boutique</h4>
                        <ul className="space-y-2 text-sm text-ink-500">
                            <li><Link href="/catalogue" className="hover:text-ink-900 transition">Tous les produits</Link></li>
                            <li><Link href="/catalogue?cat=vetements" className="hover:text-ink-900 transition">Vêtements</Link></li>
                            <li><Link href="/catalogue?cat=accessoires" className="hover:text-ink-900 transition">Accessoires</Link></li>
                            <li><Link href="/catalogue?cat=maison" className="hover:text-ink-900 transition">Maison</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-ink-900 mb-3">Aide</h4>
                        <ul className="space-y-2 text-sm text-ink-500">
                            <li><span className="cursor-default">Livraison & retours</span></li>
                            <li><span className="cursor-default">Suivi de commande</span></li>
                            <li><span className="cursor-default">FAQ</span></li>
                            <li><span className="cursor-default">CGV</span></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-ink-900 mb-3">Contact</h4>
                        <ul className="space-y-2 text-sm text-ink-500">
                            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> michael.ramanampamonjyy@gmail.com</li>
                            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +261 34 18 321 42</li>
                            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Antananarivo, Madagascar</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-ink-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-ink-400">© 2026 Maison. Tous droits réservés.</p>
                    <p className="text-xs text-ink-400">Conçu avec attention à Antananarivo.</p>
                </div>
            </div>
        </footer>
    );
}
