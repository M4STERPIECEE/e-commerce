import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-display',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'LUXE - Curated essentials for modern life',
    description: 'Elevate your daily routine with meticulously designed products that blend minimalist aesthetics with uncompromising utility.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" className={`${inter.variable} ${plusJakartaSans.variable}`}>
            <body className="bg-background text-on-background antialiased selection:bg-primary selection:text-on-primary font-body-lg">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
