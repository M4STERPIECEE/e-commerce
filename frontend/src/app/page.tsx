import { Suspense } from 'react';
import { CatalogPage } from '@/components/pages/catalog-page';

export default function HomePage() {
    return (
        <Suspense>
            <CatalogPage />
        </Suspense>
    );
}
