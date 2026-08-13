'use client';

import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';
import { ToastProvider } from '@/context/toast-context';
import { Layout } from '@/components/layout/layout';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>
                <ToastProvider>
                    <Layout>{children}</Layout>
                </ToastProvider>
            </CartProvider>
        </AuthProvider>
    );
}
