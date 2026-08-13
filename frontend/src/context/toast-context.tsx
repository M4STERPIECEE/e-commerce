import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] sm:w-auto">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className="animate-slide-in-right flex items-start gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-pop"
                    >
                        {t.type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 text-success-500" />}
                        {t.type === 'error' && <AlertCircle className="h-5 w-5 shrink-0 text-danger-500" />}
                        {t.type === 'info' && <Info className="h-5 w-5 shrink-0 text-accent-500" />}
                        <p className="flex-1 text-sm text-ink-700 leading-snug">{t.message}</p>
                        <button onClick={() => dismiss(t.id)} className="text-ink-400 hover:text-ink-700 transition">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
