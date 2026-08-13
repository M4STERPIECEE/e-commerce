import type { ReactNode } from 'react';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent' | 'blue';

const tones: Record<Tone, string> = {
    neutral: 'bg-ink-100 text-ink-700 border-ink-200',
    success: 'bg-success-100 text-success-800 border-success-200',
    warning: 'bg-warning-100 text-warning-800 border-warning-200',
    danger: 'bg-danger-100 text-danger-800 border-danger-200',
    accent: 'bg-accent-100 text-accent-800 border-accent-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
};

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className ?? ''}`}>
      {children}
    </span>
    );
}
