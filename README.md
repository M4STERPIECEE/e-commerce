Backend hexagonal pour un POC e-commerce simplifié.

## Démarrage rapide avec Docker

### 1. Cloner le dépôt

```bash
git clone <repo-url>
cd e-commerce
```

### Configurer les variables d'environnement

```bash
cp .env.example .env
```

### Démarrer PostgreSQL seulement

```bash
docker-compose up postgres -d
```

### Lancer le backend

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

