import { Suspense } from 'react';
import { AuthPage } from '@/components/pages/auth-page';

export default function AuthRoute() {
    return (
        <Suspense>
            <AuthPage />
        </Suspense>
    );
}
