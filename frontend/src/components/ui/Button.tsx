import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
    primary: 'bg-primary text-on-primary hover:bg-primary/90 active:bg-black shadow-sm',
    secondary: 'bg-surface-container-lowest text-primary border border-outline-variant hover:bg-surface-container-low active:bg-surface-container shadow-sm',
    outline: 'border border-outline-variant bg-transparent text-primary hover:bg-surface-container-low active:bg-surface-container',
    ghost: 'text-primary hover:bg-surface-container-low active:bg-surface-container',
    danger: 'bg-error text-on-error hover:bg-error/90 active:bg-error shadow-sm',
};

const sizes: Record<Size, string> = {
    sm: 'h-9 px-3.5 text-body-sm font-button gap-1.5',
    md: 'h-11 px-5 text-body-sm font-button gap-2',
    lg: 'h-12 px-6 text-base font-button gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading, fullWidth, className, children, disabled, ...props }, ref) => (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center rounded font-button transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-outline-variant/50 ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className ?? ''}`}
            {...props}
        >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
        </button>
    )
);
Button.displayName = 'Button';
