import type { ReactNode } from 'react';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent' | 'blue';

const tones: Record<Tone, string> = {
    neutral: 'bg-surface-container text-on-surface-variant border-outline-variant/50',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-error-container text-on-error-container border-error/20',
    accent: 'bg-tertiary text-on-tertiary border-transparent',
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
};

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
    return (
        <span className={`inline-flex items-center gap-1 rounded font-label-caps text-label-caps px-2 py-0.5 border ${tones[tone]} ${className ?? ''}`}>
            {children}
        </span>
    );
}
