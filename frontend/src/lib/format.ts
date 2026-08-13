export function formatPrice(value: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

export function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

export const orderStatusLabel: Record<string, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
    CANCELLED: 'Annulée',
};

export const paymentStatusLabel: Record<string, string> = {
    PENDING: 'Paiement en attente',
    COMPLETED: 'Paiement réussi',
    FAILED: 'Paiement échoué',
};

export const orderStatusColor: Record<string, string> = {
    PENDING: 'bg-warning-100 text-warning-800 border-warning-200',
    CONFIRMED: 'bg-accent-100 text-accent-800 border-accent-200',
    SHIPPED: 'bg-blue-100 text-blue-800 border-blue-200',
    DELIVERED: 'bg-success-100 text-success-800 border-success-200',
    CANCELLED: 'bg-danger-100 text-danger-800 border-danger-200',
};

export const paymentStatusColor: Record<string, string> = {
    PENDING: 'bg-warning-100 text-warning-800 border-warning-200',
    COMPLETED: 'bg-success-100 text-success-800 border-success-200',
    FAILED: 'bg-danger-100 text-danger-800 border-danger-200',
};
