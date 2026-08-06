# E-Commerce Backend POC

Backend hexagonal Spring Boot 4.x + PostgreSQL pour un POC e-commerce simplifié.

## Stack technique

| Composant | Technologie |
|---|---|
| Framework | Spring Boot 4.1.0 (Java 21) |
| Architecture | Hexagonale (Ports & Adapters) |
| Base de données | PostgreSQL 16 |
| Migrations | Flyway |
| Sécurité | Spring Security + JWT (JJWT 0.12.x) |
| Build | Gradle (Groovy DSL) |
| Conteneurisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Documentation API | Springdoc OpenAPI (Swagger UI) |

---

## Prérequis

- Docker & Docker Compose
- Java 21 (pour développement local sans Docker)
- `openssl` (pour générer JWT_SECRET)

---

## Démarrage rapide avec Docker

### 1. Cloner le dépôt

```bash
git clone <repo-url>
cd e-commerce
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditer `.env` et renseigner **toutes** les valeurs :

```env
POSTGRES_DB=ecommerce
POSTGRES_USER=ecommerce_user
POSTGRES_PASSWORD=your_secure_password

JWT_SECRET=<générer avec : openssl rand -base64 64>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

> ⚠️ **Ne jamais commiter le fichier `.env`** — il est dans `.gitignore`.

### 3. Lancer les services

```bash
# Démarrage de base (backend + postgres)
docker-compose up --build

# Avec Adminer (interface web PostgreSQL sur http://localhost:8081)
docker-compose --profile tools up --build
```

### 4. Vérifier

- **API** : http://localhost:8080/api/v1/
- **Swagger UI** : http://localhost:8080/swagger-ui.html
- **API Docs** : http://localhost:8080/api-docs

---

## Développement local (sans Docker)

### 1. Démarrer PostgreSQL seulement

```bash
docker-compose up postgres -d
```

### 2. Exporter les variables d'environnement

```powershell
# Windows PowerShell
$env:POSTGRES_DB="ecommerce"
$env:POSTGRES_USER="ecommerce_user"
$env:POSTGRES_PASSWORD="change_me"
$env:DB_HOST="localhost"
$env:POSTGRES_PORT="5432"
$env:JWT_SECRET="your-base64-secret"
$env:JWT_EXPIRATION_MS="3600000"
$env:JWT_REFRESH_EXPIRATION_MS="604800000"
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="admin123"
$env:APP_PORT="8080"
```

### 3. Lancer le backend

```bash
cd backend
./gradlew bootRun
```

---

## Architecture hexagonale

```
com.commerce.ecommerce
├── domain/                    ← Cœur métier (POJOs purs, exceptions)
│   ├── model/
│   └── exception/
├── application/               ← Logique applicative (use cases, ports)
│   ├── port/
│   │   ├── in/               ← Interfaces des use cases (entrée)
│   │   └── out/              ← Interfaces vers l'extérieur (sortie)
│   └── usecase/              ← Implémentations (dépendent uniquement des ports)
├── adapter/                   ← Adapters (web, persistence, sécurité)
│   ├── in/web/               ← REST controllers + DTOs
│   └── out/
│       ├── persistence/      ← JPA entities + repositories + adapters
│       ├── security/         ← JWT + UserDetails
│       └── payment/          ← Mock payment gateway
└── config/                   ← Configuration Spring (Security, CORS, OpenAPI)
```

---

## Endpoints principaux

### Auth
| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Inscription |
| POST | `/api/v1/auth/login` | Connexion → JWT |
| POST | `/api/v1/auth/refresh` | Rafraîchissement du token |
| GET | `/api/v1/auth/me` | Profil courant 🔒 |

### Catalogue (accès public en lecture)
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/products` | Liste avec filtres/pagination |
| GET | `/api/v1/products/{id}` | Détail produit |
| POST | `/api/v1/products` | Créer produit 🔒 ADMIN |
| PUT | `/api/v1/products/{id}` | Modifier produit 🔒 ADMIN |
| DELETE | `/api/v1/products/{id}` | Supprimer produit 🔒 ADMIN |
| GET | `/api/v1/categories` | Liste catégories |
| POST | `/api/v1/categories` | Créer catégorie 🔒 ADMIN |

### Panier 🔒
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/cart` | Panier courant |
| POST | `/api/v1/cart/items` | Ajouter article |
| PUT | `/api/v1/cart/items/{productId}` | Modifier quantité |
| DELETE | `/api/v1/cart/items/{productId}` | Supprimer article |
| DELETE | `/api/v1/cart` | Vider le panier |

### Commandes 🔒
| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/orders/checkout` | Passer commande |
| GET | `/api/v1/orders` | Historique |
| GET | `/api/v1/orders/{id}` | Détail |
| POST | `/api/v1/orders/{id}/cancel` | Annuler |
| GET | `/api/v1/orders/admin/all` | Toutes commandes 🔒 ADMIN |
| PATCH | `/api/v1/orders/admin/{id}/status` | Changer statut 🔒 ADMIN |

### Paiement 🔒
| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/payments/orders/{orderId}/pay` | Payer (mock) |
| GET | `/api/v1/payments/orders/{orderId}` | Statut paiement |

---

## Filtres produits

```
GET /api/v1/products?search=iphone&categoryId=xxx&minPrice=100&maxPrice=500&page=0&size=20&sortBy=price&sortDir=asc
```

---

## CI/CD GitHub Actions

| Workflow | Déclencheur | Actions |
|---|---|---|
| `ci-develop.yml` | push/PR → `develop` | Build + Tests + JaCoCo |
| `ci-deploy.yml` | push → `main` | Build + Tests + Docker build |
| `publish.yml` | tag `v*` ou release | Docker build + push → ghcr.io |

### Secrets GitHub requis pour `publish.yml`
- `GITHUB_TOKEN` — fourni automatiquement par GitHub Actions

---

## Rôles

| Rôle | Accès |
|---|---|
| `CUSTOMER` | Catalogue (lecture), panier, commandes propres, paiement |
| `ADMIN` | Tout + CRUD produits/catégories + gestion stocks + toutes commandes |

---

## Générer un JWT_SECRET sécurisé

```bash
openssl rand -base64 64
```
