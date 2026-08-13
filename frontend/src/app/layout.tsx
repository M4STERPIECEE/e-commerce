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
    title: 'Maison — L\'essentiel, fait pour durer',
    description: 'Des pièces sélectionnées avec soin, alliant élégance et fonctionnalité.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" className={`${inter.variable} ${plusJakartaSans.variable}`}>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
