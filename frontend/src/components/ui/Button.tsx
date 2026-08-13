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
    primary: 'bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-950 shadow-soft',
    secondary: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-soft',
    outline: 'border border-ink-300 bg-white text-ink-900 hover:bg-ink-50 active:bg-ink-100',
    ghost: 'text-ink-700 hover:bg-ink-100 active:bg-ink-200',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 shadow-soft',
};

const sizes: Record<Size, string> = {
    sm: 'h-9 px-3.5 text-sm gap-1.5',
    md: 'h-11 px-5 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading, fullWidth, className, children, disabled, ...props }, ref) => (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:ring-offset-1 ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className ?? ''}`}
            {...props}
        >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
        </button>
    )
);
Button.displayName = 'Button';
