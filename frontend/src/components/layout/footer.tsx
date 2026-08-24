'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Footer() {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (newsletterEmail.trim()) {
            setSubscribed(true);
        }
    };

    return (
        <footer className="bg-surface dark:bg-surface-dim full-width border-t border-outline-variant mt-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-16 w-full max-w-container-max mx-auto">
                {/* Brand */}
                <div className="flex flex-col gap-4">
                    <Link className="font-headline-md text-headline-md text-primary dark:text-on-surface font-bold tracking-tight" href="/">
                        LUXE
                    </Link>
                    <p className="font-body-sm text-body-sm text-secondary dark:text-on-secondary-fixed-variant max-w-xs">
                        Elevating the everyday through uncompromising design and exceptional quality.
                    </p>
                </div>

                {/* Links Col 1 */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-label-caps text-label-caps text-primary dark:text-on-surface font-semibold tracking-wider">Support</h4>
                    <Link className="font-body-sm text-body-sm text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-surface transition-colors" href="/catalogue">
                        Shipping &amp; Returns
                    </Link>
                    <Link className="font-body-sm text-body-sm text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-surface transition-colors" href="/catalogue">
                        Contact Us
                    </Link>
                </div>

                {/* Links Col 2 */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-label-caps text-label-caps text-primary dark:text-on-surface font-semibold tracking-wider">Legal</h4>
                    <Link className="font-body-sm text-body-sm text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-surface transition-colors" href="#">
                        Privacy Policy
                    </Link>
                    <Link className="font-body-sm text-body-sm text-secondary dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-on-surface transition-colors" href="#">
                        Terms of Service
                    </Link>
                </div>

                {/* Newsletter */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-label-caps text-label-caps text-primary dark:text-on-surface font-semibold tracking-wider">Stay Updated</h4>
                    <p className="font-body-sm text-body-sm text-secondary dark:text-on-secondary-fixed-variant">
                        Subscribe for 10% off your first order.
                    </p>
                    {subscribed ? (
                        <p className="font-body-sm text-body-sm text-primary font-medium">Merci pour votre inscription !</p>
                    ) : (
                        <form onSubmit={handleSubscribe} className="flex items-center border border-outline-variant rounded p-1 bg-surface-container-lowest focus-within:border-primary transition-colors">
                            <input
                                className="w-full bg-transparent border-none text-body-sm font-body-sm focus:ring-0 px-3 py-2 outline-none text-on-surface placeholder:text-secondary"
                                placeholder="Email address"
                                type="email"
                                value={newsletterEmail}
                                onChange={e => setNewsletterEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="bg-primary text-on-primary font-button text-button px-4 py-2 rounded hover:bg-primary/90 transition-colors">
                                Join
                            </button>
                        </form>
                    )}
                </div>

                {/* Copyright */}
                <div className="col-span-1 md:col-span-4 mt-12 pt-8 border-t border-outline-variant/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-body-sm text-body-sm text-secondary dark:text-on-secondary-fixed-variant">
                        © 2026 LUXE Premium. All rights reserved.
                    </p>
                    <div className="flex gap-4 items-center">
                        <span className="text-secondary hover:text-primary transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]" data-icon="language">language</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
