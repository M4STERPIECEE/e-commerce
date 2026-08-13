import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-up">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 text-ink-400">
                {icon ?? <Inbox className="h-8 w-8" />}
            </div>
            <h3 className="text-lg font-semibold text-ink-800">{title}</h3>
            {description && <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
