import type {
    AuthTokens, Category, Order, OrderStatus, PaymentStatus,
    Product, ShippingAddress, User,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const LS_TOKENS = 'maison_tokens';
const LS_USER = 'maison_current_user';

class ApiError extends Error {
    constructor(public status: number, message: string) { super(message); }
}

interface BackendUserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'ADMIN';
    createdAt?: string;
}

interface BackendCategoryResponse {
    id: string;
    name: string;
    slug?: string;
    description?: string;
}

interface BackendProductResponse {
    id: string;
    name: string;
    description?: string;
    price: number | string;
    stock: number;
    imageUrl?: string;
    active?: boolean;
    categoryId?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface BackendPageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

interface BackendOrderItemResponse {
    id?: string;
    productId: string;
    productName?: string;
    unitPriceSnapshot?: number | string;
    unitPrice?: number | string;
    quantity: number;
    imageUrl?: string;
}

interface BackendOrderResponse {
    id: string;
    userId: string;
    status: OrderStatus;
    paymentStatus?: PaymentStatus;
    totalAmount?: number | string;
    shippingAddress?: string | ShippingAddress;
    createdAt: string;
    updatedAt: string;
    items?: BackendOrderItemResponse[];
}

interface BackendPaymentResponse {
    id: string;
    orderId: string;
    status?: PaymentStatus;
    amount?: number | string;
    transactionRef?: string;
    createdAt?: string;
}

function getTokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(LS_TOKENS);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveTokens(tokens: AuthTokens | null) {
    if (typeof window === 'undefined') return;
    if (tokens) {
        localStorage.setItem(LS_TOKENS, JSON.stringify(tokens));
    } else {
        localStorage.removeItem(LS_TOKENS);
    }
}

function saveUser(user: User | null) {
    if (typeof window === 'undefined') return;
    if (user) {
        localStorage.setItem(LS_USER, JSON.stringify(user));
    } else {
        localStorage.removeItem(LS_USER);
    }
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth = false
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    let tokens = getTokens();
    if (requireAuth && tokens?.accessToken) {
        headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }

    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Réseau';
        throw new ApiError(503, `Impossible de contacter le serveur backend (${msg}).`);
    }

    if (response.status === 401 && requireAuth && tokens?.refreshToken) {
        try {
            tokens = await api.refreshToken();
            headers['Authorization'] = `Bearer ${tokens.accessToken}`;
            response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });
        } catch {
            api.logout();
            throw new ApiError(401, 'Session expirée. Veuillez vous re-connecter.');
        }
    }

    const json = await response.json().catch(() => null);

    if (!response.ok) {
        const message = json?.message || `Erreur ${response.status}`;
        throw new ApiError(response.status, message);
    }

    if (json && typeof json.success === 'boolean') {
        if (!json.success) {
            throw new ApiError(response.status, json.message || 'Une erreur est survenue');
        }
        return json.data as T;
    }

    return json as T;
}

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
    vetements: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
    accessoires: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    maison: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
    electronique: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
};

const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

export const api = {
    async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
        const tokens = await request<AuthTokens>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        saveTokens(tokens);
        const user = await this.getMe();
        saveUser(user);
        return { user, tokens };
    },

    async register(email: string, password: string, firstName: string, lastName: string): Promise<{ user: User; tokens: AuthTokens }> {
        await request<BackendUserResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, firstName, lastName }),
        });
        return this.login(email, password);
    },

    async getMe(): Promise<User> {
        const raw = await request<BackendUserResponse>('/auth/me', { method: 'GET' }, true);
        const user: User = {
            id: raw.id,
            email: raw.email,
            firstName: raw.firstName,
            lastName: raw.lastName,
            role: raw.role,
        };
        saveUser(user);
        return user;
    },

    async refreshToken(): Promise<AuthTokens> {
        const current = getTokens();
        if (!current?.refreshToken) throw new ApiError(401, 'Aucun jeton de rafraîchissement disponible');
        const tokens = await request<AuthTokens>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken: current.refreshToken }),
        });
        saveTokens(tokens);
        return tokens;
    },

    getCurrentUser(): User | null {
        if (typeof window === 'undefined') return null;
        try {
            const raw = localStorage.getItem(LS_USER);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },

    logout() {
        saveTokens(null);
        saveUser(null);
    },

    async getCategories(): Promise<Category[]> {
        const list = await request<BackendCategoryResponse[]>('/categories', { method: 'GET' });
        return (list || []).map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            image: DEFAULT_CATEGORY_IMAGES[c.slug || ''] || DEFAULT_CATEGORY_IMAGES.maison,
            productCount: 12,
        }));
    },

    async getProducts(params?: {
        search?: string;
        categoryId?: string;
        sort?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{ items: Product[]; total: number; page: number; pageSize: number; totalPages: number }> {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.set('search', params.search);
        if (params?.categoryId) queryParams.set('categoryId', params.categoryId);
        if (params?.page) queryParams.set('page', String(params.page - 1));
        if (params?.pageSize) queryParams.set('size', String(params.pageSize));

        if (params?.sort) {
            switch (params.sort) {
                case 'price-asc':
                    queryParams.set('sortBy', 'price');
                    queryParams.set('sortDir', 'asc');
                    break;
                case 'price-desc':
                    queryParams.set('sortBy', 'price');
                    queryParams.set('sortDir', 'desc');
                    break;
                case 'newest':
                    queryParams.set('sortBy', 'createdAt');
                    queryParams.set('sortDir', 'desc');
                    break;
                default:
                    queryParams.set('sortBy', 'createdAt');
                    queryParams.set('sortDir', 'desc');
                    break;
            }
        }

        const qs = queryParams.toString();
        const pageData = await request<BackendPageResponse<BackendProductResponse>>(`/products${qs ? `?${qs}` : ''}`, { method: 'GET' });
        const items: Product[] = (pageData.content || []).map(p => ({
            id: p.id,
            name: p.name,
            slug: p.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            price: Number(p.price),
            stock: p.stock,
            description: p.description || '',
            categoryId: p.categoryId || '',
            image: p.imageUrl || DEFAULT_PRODUCT_IMAGE,
            rating: 4.5,
            createdAt: p.createdAt || new Date().toISOString(),
        }));

        return {
            items,
            total: pageData.totalElements || items.length,
            page: (pageData.number || 0) + 1,
            pageSize: pageData.size || params?.pageSize || 8,
            totalPages: pageData.totalPages || 1,
        };
    },

    async getProduct(id: string): Promise<Product> {
        const p = await request<BackendProductResponse>(`/products/${id}`, { method: 'GET' });
        return {
            id: p.id,
            name: p.name,
            slug: p.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            price: Number(p.price),
            stock: p.stock,
            description: p.description || '',
            categoryId: p.categoryId || '',
            image: p.imageUrl || DEFAULT_PRODUCT_IMAGE,
            rating: 4.5,
            createdAt: p.createdAt || new Date().toISOString(),
        };
    },

    async saveProduct(product: Product): Promise<Product> {
        const body = {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            imageUrl: product.image,
            active: true,
            categoryId: product.categoryId || null,
        };

        let res: BackendProductResponse;
        if (product.id && !product.id.startsWith('new-')) {
            res = await request<BackendProductResponse>(`/products/${product.id}`, {
                method: 'PUT',
                body: JSON.stringify(body),
            }, true);
        } else {
            res = await request<BackendProductResponse>('/products', {
                method: 'POST',
                body: JSON.stringify(body),
            }, true);
        }

        return {
            id: res.id,
            name: res.name,
            slug: res.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            price: Number(res.price),
            stock: res.stock,
            description: res.description || '',
            categoryId: res.categoryId || '',
            image: res.imageUrl || DEFAULT_PRODUCT_IMAGE,
            rating: 4.5,
            createdAt: res.createdAt || new Date().toISOString(),
        };
    },

    async deleteProduct(id: string): Promise<void> {
        await request<void>(`/products/${id}`, { method: 'DELETE' }, true);
    },

    async getMyOrders(_userId?: string): Promise<Order[]> {
        const pageData = await request<BackendPageResponse<BackendOrderResponse>>('/orders?page=0&size=50', { method: 'GET' }, true);
        const list = pageData.content || [];
        return list.map(o => ({
            id: o.id,
            userId: o.userId,
            items: (o.items || []).map(item => ({
                productId: item.productId,
                productName: item.productName || 'Produit',
                unitPrice: Number(item.unitPriceSnapshot || item.unitPrice || 0),
                quantity: item.quantity,
                image: item.imageUrl || DEFAULT_PRODUCT_IMAGE,
            })),
            total: Number(o.totalAmount || 0),
            status: o.status,
            paymentStatus: o.paymentStatus || 'PENDING',
            shippingAddress: typeof o.shippingAddress === 'string'
                ? { fullName: '', line1: o.shippingAddress, city: '', postalCode: '', country: '', phone: '' }
                : (o.shippingAddress || { fullName: '', line1: '', city: '', postalCode: '', country: '', phone: '' }),
            createdAt: o.createdAt,
            updatedAt: o.updatedAt,
        }));
    },

    async getOrder(id: string): Promise<Order> {
        const o = await request<BackendOrderResponse>(`/orders/${id}`, { method: 'GET' }, true);
        return {
            id: o.id,
            userId: o.userId,
            items: (o.items || []).map(item => ({
                productId: item.productId,
                productName: item.productName || 'Produit',
                unitPrice: Number(item.unitPriceSnapshot || item.unitPrice || 0),
                quantity: item.quantity,
                image: item.imageUrl || DEFAULT_PRODUCT_IMAGE,
            })),
            total: Number(o.totalAmount || 0),
            status: o.status,
            paymentStatus: o.paymentStatus || 'PENDING',
            shippingAddress: typeof o.shippingAddress === 'string'
                ? { fullName: '', line1: o.shippingAddress, city: '', postalCode: '', country: '', phone: '' }
                : (o.shippingAddress || { fullName: '', line1: '', city: '', postalCode: '', country: '', phone: '' }),
            createdAt: o.createdAt,
            updatedAt: o.updatedAt,
        };
    },

    async getAllOrders(): Promise<Order[]> {
        const pageData = await request<BackendPageResponse<BackendOrderResponse>>('/orders/admin/all?page=0&size=50', { method: 'GET' }, true);
        const list = pageData.content || [];
        return list.map(o => ({
            id: o.id,
            userId: o.userId,
            items: (o.items || []).map(item => ({
                productId: item.productId,
                productName: item.productName || 'Produit',
                unitPrice: Number(item.unitPriceSnapshot || item.unitPrice || 0),
                quantity: item.quantity,
                image: item.imageUrl || DEFAULT_PRODUCT_IMAGE,
            })),
            total: Number(o.totalAmount || 0),
            status: o.status,
            paymentStatus: o.paymentStatus || 'PENDING',
            shippingAddress: typeof o.shippingAddress === 'string'
                ? { fullName: '', line1: o.shippingAddress, city: '', postalCode: '', country: '', phone: '' }
                : (o.shippingAddress || { fullName: '', line1: '', city: '', postalCode: '', country: '', phone: '' }),
            createdAt: o.createdAt,
            updatedAt: o.updatedAt,
        }));
    },

    async createOrder(
        _?: string,
        _items?: { productId: string; productName: string; unitPrice: number; quantity: number; image: string }[],
        total?: number,
        shippingAddress?: ShippingAddress
    ): Promise<Order> {
        const addressString = shippingAddress ? `${shippingAddress.fullName}, ${shippingAddress.line1}, ${shippingAddress.city} ${shippingAddress.postalCode}, ${shippingAddress.country} (Tél: ${shippingAddress.phone})` : '';
        const o = await request<BackendOrderResponse>('/orders/checkout', {
            method: 'POST',
            body: JSON.stringify({ shippingAddress: addressString }),
        }, true);

        return {
            id: o.id,
            userId: o.userId,
            items: (o.items || []).map(item => ({
                productId: item.productId,
                productName: item.productName || 'Produit',
                unitPrice: Number(item.unitPriceSnapshot || item.unitPrice || 0),
                quantity: item.quantity,
                image: item.imageUrl || DEFAULT_PRODUCT_IMAGE,
            })),
            total: Number(o.totalAmount || total || 0),
            status: o.status,
            paymentStatus: o.paymentStatus || 'PENDING',
            shippingAddress: shippingAddress || { fullName: '', line1: '', city: '', postalCode: '', country: '', phone: '' },
            createdAt: o.createdAt,
            updatedAt: o.updatedAt,
        };
    },

    async payOrder(orderId: string, _cardLast4?: string): Promise<{ order: Order; paymentStatus: PaymentStatus }> {
        const payRes = await request<BackendPaymentResponse>(`/payments/orders/${orderId}/pay`, {
            method: 'POST',
        }, true);
        const order = await this.getOrder(orderId);
        return { order, paymentStatus: payRes.status || 'COMPLETED' };
    },

    async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
        await request<BackendOrderResponse>(`/orders/admin/${orderId}/status?status=${status}`, {
            method: 'PATCH',
        }, true);
        return this.getOrder(orderId);
    },

    async cancelOrder(orderId: string): Promise<Order> {
        await request<void>(`/orders/${orderId}/cancel`, { method: 'POST' }, true);
        return this.getOrder(orderId);
    },

    async checkStock(productId: string, quantity: number): Promise<{ available: boolean; stock: number }> {
        try {
            const p = await this.getProduct(productId);
            return { available: p.stock >= quantity, stock: p.stock };
        } catch {
            return { available: false, stock: 0 };
        }
    },
};

export { ApiError };
