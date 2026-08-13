import { Suspense } from 'react';
import { CatalogPage } from '@/components/pages/catalog-page';

export default function CataloguePage() {
    return (
        <Suspense>
            <CatalogPage />
        </Suspense>
    );
}
