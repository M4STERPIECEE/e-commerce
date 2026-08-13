export type Role = 'USER' | 'ADMIN';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    productCount: number;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    description: string;
    categoryId: string;
    image: string;
    rating: number;
    createdAt: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface OrderItem {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    image: string;
}

export interface ShippingAddress {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    shippingAddress: ShippingAddress;
    createdAt: string;
    updatedAt: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
