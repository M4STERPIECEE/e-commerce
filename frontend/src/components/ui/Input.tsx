import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, icon, className, id, ...props }, ref) => {
        const inputId = id ?? props.name;
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
              {icon}
            </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`input-base ${icon ? 'pl-10' : ''} ${error ? 'input-error' : ''} ${className ?? ''}`}
                        {...props}
                    />
                </div>
                {error ? (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-danger-600">
                        <AlertCircle className="h-3.5 w-3.5" /> {error}
                    </p>
                ) : hint ? (
                    <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
                ) : null}
            </div>
        );
    }
);
Input.displayName = 'Input';
