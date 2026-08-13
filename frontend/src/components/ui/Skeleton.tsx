export function Skeleton({ className }: { className?: string }) {
    return <div className={`skeleton ${className ?? ''}`} />;
}

export function ProductCardSkeleton() {
    return (
        <div className="card overflow-hidden">
            <Skeleton className="aspect-[4/5] rounded-none" />
            <div className="space-y-2.5 p-4">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-1/4" />
            </div>
        </div>
    );
}
