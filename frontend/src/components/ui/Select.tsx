import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, className, id, children, ...props }, ref) => {
        const selectId = id ?? props.name;
        return (
            <div className="w-full">
                {label && <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink-700">{label}</label>}
                <select
                    ref={ref}
                    id={selectId}
                    className={`input-base appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b6e78%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-no-repeat bg-[right_0.75rem_center] pr-10 ${className ?? ''}`}
                    {...props}
                >
                    {children}
                </select>
            </div>
        );
    }
);
Select.displayName = 'Select';
