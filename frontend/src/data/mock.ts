import type { Category, Product, Order, User } from '@/types';

export const categories: Category[] = [
    { id: 'cat-1', name: 'Vêtements', slug: 'vetements', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 12 },
    { id: 'cat-2', name: 'Accessoires', slug: 'accessoires', image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 8 },
    { id: 'cat-3', name: 'Maison', slug: 'maison', image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 10 },
    { id: 'cat-4', name: 'Beauté', slug: 'beaute', image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 6 },
    { id: 'cat-5', name: 'Tech', slug: 'tech', image: 'https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 9 },
    { id: 'cat-6', name: 'Sport', slug: 'sport', image: 'https://images.pexels.com/photos/2294353/pexels-photo-2294353.jpeg?auto=compress&cs=tinysrgb&w=800', productCount: 7 },
];

const img = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

export const products: Product[] = [
    { id: 'p-1', name: 'T-shirt en coton bio', slug: 'tshirt-coton-bio', price: 34.90, stock: 24, description: "T-shirt en coton biologique, coupe régulière, extrêmement doux au toucher. Fabrication responsable, coutures renforcées. Disponible en plusieurs tailles.", categoryId: 'cat-1', image: img(996329), rating: 4.6, createdAt: '2025-03-01T10:00:00Z' },
    { id: 'p-2', name: 'Chemise en lin', slug: 'chemise-lin', price: 69.00, stock: 12, description: "Chemise en lin lavé, respirante et légère. Coupe moderne, col français, boutons en nacre. Idéale pour les saisons chaudes.", categoryId: 'cat-1', image: img(7679720), rating: 4.8, createdAt: '2025-03-02T10:00:00Z' },
    { id: 'p-3', name: 'Manteau en laine', slug: 'manteau-laine', price: 189.00, stock: 5, description: "Manteau structuré en laine vierge. Doublure intérieure, fermeture par double boutonnage. Une pièce intemporelle pour l'hiver.", categoryId: 'cat-1', image: img(6311624), rating: 4.7, createdAt: '2025-03-03T10:00:00Z' },
    { id: 'p-4', name: 'Robe midi plissée', slug: 'robe-midi-plissee', price: 89.90, stock: 0, description: "Robe midi plissée, taille marquée, tissu fluide à base de viscose recyclée. Élégante et confortable pour toutes les occasions.", categoryId: 'cat-1', image: img(2703202), rating: 4.5, createdAt: '2025-03-04T10:00:00Z' },
    { id: 'p-5', name: 'Lunettes de soleil acétate', slug: 'lunettes-soleil-acetate', price: 129.00, stock: 18, description: "Lunettes de soleil en acétate italien, verres polarisés UV400. Monture légère et durable, étui en cuir inclus.", categoryId: 'cat-2', image: img(701877), rating: 4.9, createdAt: '2025-03-05T10:00:00Z' },
    { id: 'p-6', name: 'Ceinture cuir tressé', slug: 'ceinture-cuir-tresse', price: 59.00, stock: 30, description: "Ceinture en cuir pleine fleur tressée, boucle en laiton brossé. Cuir tanné végétal, fabrication artisanale.", categoryId: 'cat-2', image: img(1152077), rating: 4.4, createdAt: '2025-03-06T10:00:00Z' },
    { id: 'p-7', name: 'Montre minimaliste', slug: 'montre-minimaliste', price: 159.00, stock: 8, description: "Montre à quartz au design épuré, boîtier en acier inoxydable, bracelet en cuir grainé. Résistance 3 ATM.", categoryId: 'cat-2', image: img(9978722), rating: 4.7, createdAt: '2025-03-07T10:00:00Z' },
    { id: 'p-8', name: 'Sac à dos en cuir', slug: 'sac-dos-cuir', price: 199.00, stock: 0, description: "Sac à dos en cuir vieilli, doublure en coton, compartiment rembourré pour ordinateur 15 pouces. Fermeture magnétique.", categoryId: 'cat-2', image: img(2905247), rating: 4.8, createdAt: '2025-03-08T10:00:00Z' },
    { id: 'p-9', name: 'Vase en céramique', slug: 'vase-ceramique', price: 49.00, stock: 22, description: "Vase en céramique émaillée à la main, finition mate. Chaque pièce est unique, légères variations de teinte possibles.", categoryId: 'cat-3', image: img(1571460), rating: 4.6, createdAt: '2025-03-09T10:00:00Z' },
    { id: 'p-10', name: 'Bougie parfumée figue', slug: 'bougie-parfumee-figue', price: 32.00, stock: 40, description: "Bougie 100% cire de soja, parfum figue & bois de cèdre. Combustion 45h, mèche en coton non plombée.", categoryId: 'cat-3', image: img(3270203), rating: 4.9, createdAt: '2025-03-10T10:00:00Z' },
    { id: 'p-11', name: 'Plaid en laine mérinos', slug: 'plaid-laine-merinos', price: 119.00, stock: 14, description: "Plaid extra-moelleux en laine mérinos, bordures contrastées. Chaud, léger et hypoallergénique.", categoryId: 'cat-3', image: img(695655), rating: 4.7, createdAt: '2025-03-11T10:00:00Z' },
    { id: 'p-12', name: 'Service de table 12 pièces', slug: 'service-table-12', price: 89.00, stock: 7, description: "Service 12 pièces en porcelaine fine, finition émaillée. Passe au lave-vaisselle et au micro-ondes.", categoryId: 'cat-3', image: img(6194125), rating: 4.5, createdAt: '2025-03-12T10:00:00Z' },
    { id: 'p-13', name: 'Sérum éclat vitamine C', slug: 'serum-eclat-vitamine-c', price: 42.00, stock: 35, description: "Sérum concentré à 15% de vitamine C, acide hyaluronique et vitamine E. Texture légère, pénètre rapidement.", categoryId: 'cat-4', image: img(3373736), rating: 4.8, createdAt: '2025-03-13T10:00:00Z' },
    { id: 'p-14', name: 'Crème hydratante nuit', slug: 'creme-hydratante-nuit', price: 38.00, stock: 0, description: "Crème de nuit riche en céramides et beurre de karité. Régénération cutanée pendant le sommeil.", categoryId: 'cat-4', image: img(3737576), rating: 4.6, createdAt: '2025-03-14T10:00:00Z' },
    { id: 'p-15', name: 'Huile précieuse cheveux', slug: 'huile-precieuse-cheveux', price: 28.00, stock: 28, description: "Huile capillaire multi-usage à l'argan et au camélia. Discipline, nourrit et fait briller sans graisser.", categoryId: 'cat-4', image: img(3993447), rating: 4.7, createdAt: '2025-03-15T10:00:00Z' },
    { id: 'p-16', name: 'Écouteurs sans fil ANC', slug: 'ecouteurs-sans-fil-anc', price: 149.00, stock: 16, description: "Écouteurs true wireless avec réduction de bruit active hybride. Autonomie 28h avec boîtier, IPX5.", categoryId: 'cat-5', image: img(799443), rating: 4.7, createdAt: '2025-03-16T10:00:00Z' },
    { id: 'p-17', name: 'Chargeur magnétique 3-en-1', slug: 'chargeur-magnetique-3en1', price: 79.00, stock: 20, description: "Station de charge sans fil 15W pour téléphone, montre et écouteurs. Design compact en aluminium.", categoryId: 'cat-5', image: img(4344840), rating: 4.5, createdAt: '2025-03-17T10:00:00Z' },
    { id: 'p-18', name: 'Enceinte Bluetooth nomade', slug: 'enceinte-bluetooth-nomade', price: 99.00, stock: 11, description: "Enceinte portable IP67, autonomie 24h, son stéréo 360°. Paire stéréo possible avec une seconde unité.", categoryId: 'cat-5', image: img(1666757), rating: 4.6, createdAt: '2025-03-18T10:00:00Z' },
    { id: 'p-19', name: 'Tapis de yoga premium', slug: 'tapis-yoga-premium', price: 55.00, stock: 25, description: "Tapis de yoga en caoutchouc naturel, surface micro-texturée anti-glisse. 6mm d'épaisseur, sangle incluse.", categoryId: 'cat-6', image: img(2294353), rating: 4.8, createdAt: '2025-03-19T10:00:00Z' },
    { id: 'p-20', name: 'Gourde isotherme 500ml', slug: 'gourde-isotherme-500ml', price: 29.00, stock: 50, description: "Gourde inox double paroi, garde froid 24h et chaud 12h. Bouchon anti-fuite, sans BPA.", categoryId: 'cat-6', image: img(1188647), rating: 4.9, createdAt: '2025-03-20T10:00:00Z' },
    { id: 'p-21', name: 'Haltères réglables 20kg', slug: 'halteres-reglables-20kg', price: 159.00, stock: 6, description: "Paire d'haltères réglables de 2 à 20kg. Système de sélection rapide, rangement compact inclus.", categoryId: 'cat-6', image: img(4753982), rating: 4.7, createdAt: '2025-03-21T10:00:00Z' },
    { id: 'p-22', name: 'Pull col roulé cachemire', slug: 'pull-col-roule-cachemire', price: 145.00, stock: 9, description: "Pull col roulé en cachemire grade A, douceur extrême, sans grattage. Tricotage 12 jauges, coupe ajustée.", categoryId: 'cat-1', image: img(8214130), rating: 4.8, createdAt: '2025-03-22T10:00:00Z' },
    { id: 'p-23', name: 'Portefeuille minimaliste', slug: 'portefeuille-minimaliste', price: 65.00, stock: 17, description: "Portefeuille compact en cuir grainé, 6 emplacements cartes, poche billets. Patine joliment avec le temps.", categoryId: 'cat-2', image: img(2647818), rating: 4.6, createdAt: '2025-03-23T10:00:00Z' },
    { id: 'p-24', name: 'Lampe de bureau LED', slug: 'lampe-bureau-led', price: 89.00, stock: 13, description: "Lampe LED dimmable, température de couleur réglable. Bras articulé, port USB-C de charge intégré.", categoryId: 'cat-3', image: img(3757317), rating: 4.7, createdAt: '2025-03-24T10:00:00Z' },
];

export const users: User[] = [
    { id: 'u-1', email: 'client@maison.fr', firstName: 'Camille', lastName: 'Durand', role: 'USER' },
    { id: 'u-2', email: 'admin@maison.fr', firstName: 'Alex', lastName: 'Martin', role: 'ADMIN' },
];

export const seedOrders: Order[] = [
    {
        id: 'ord-1001',
        userId: 'u-1',
        items: [
            { productId: 'p-1', productName: 'T-shirt en coton bio', unitPrice: 34.90, quantity: 2, image: img(996329) },
            { productId: 'p-10', productName: 'Bougie parfumée figue', unitPrice: 32.00, quantity: 1, image: img(3270203) },
        ],
        total: 101.80,
        status: 'DELIVERED',
        paymentStatus: 'COMPLETED',
        shippingAddress: { fullName: 'Camille Durand', line1: '12 rue des Lilas', city: 'Lyon', postalCode: '69003', country: 'France', phone: '0612345678' },
        createdAt: '2025-07-10T14:30:00Z',
        updatedAt: '2025-07-14T09:00:00Z',
    },
    {
        id: 'ord-1002',
        userId: 'u-1',
        items: [
            { productId: 'p-5', productName: 'Lunettes de soleil acétate', unitPrice: 129.00, quantity: 1, image: img(701877) },
        ],
        total: 129.00,
        status: 'SHIPPED',
        paymentStatus: 'COMPLETED',
        shippingAddress: { fullName: 'Camille Durand', line1: '12 rue des Lilas', city: 'Lyon', postalCode: '69003', country: 'France', phone: '0612345678' },
        createdAt: '2025-08-01T11:20:00Z',
        updatedAt: '2025-08-03T16:00:00Z',
    },
    {
        id: 'ord-1003',
        userId: 'u-1',
        items: [
            { productId: 'p-16', productName: 'Écouteurs sans fil ANC', unitPrice: 149.00, quantity: 1, image: img(799443) },
            { productId: 'p-20', productName: 'Gourde isotherme 500ml', unitPrice: 29.00, quantity: 2, image: img(1188647) },
        ],
        total: 207.00,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        shippingAddress: { fullName: 'Camille Durand', line1: '12 rue des Lilas', city: 'Lyon', postalCode: '69003', country: 'France', phone: '0612345678' },
        createdAt: '2025-08-08T08:15:00Z',
        updatedAt: '2025-08-08T08:15:00Z',
    },
    {
        id: 'ord-1004',
        userId: 'u-1',
        items: [
            { productId: 'p-9', productName: 'Vase en céramique', unitPrice: 49.00, quantity: 1, image: img(1571460) },
        ],
        total: 49.00,
        status: 'CONFIRMED',
        paymentStatus: 'COMPLETED',
        shippingAddress: { fullName: 'Camille Durand', line1: '12 rue des Lilas', city: 'Lyon', postalCode: '69003', country: 'France', phone: '0612345678' },
        createdAt: '2025-08-05T10:00:00Z',
        updatedAt: '2025-08-06T12:00:00Z',
    },
    {
        id: 'ord-1005',
        userId: 'u-1',
        items: [
            { productId: 'p-3', productName: 'Manteau en laine', unitPrice: 189.00, quantity: 1, image: img(6311624) },
        ],
        total: 189.00,
        status: 'CANCELLED',
        paymentStatus: 'FAILED',
        shippingAddress: { fullName: 'Camille Durand', line1: '12 rue des Lilas', city: 'Lyon', postalCode: '69003', country: 'France', phone: '0612345678' },
        createdAt: '2025-06-20T15:45:00Z',
        updatedAt: '2025-06-21T08:30:00Z',
    },
];
