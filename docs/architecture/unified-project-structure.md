# Unified Project Structure

## Monorepo Structure

```
gmaoapp/
├── .github/                     # CI/CD workflows
│   └── workflows/
│       ├── ci.yaml
│       └── deploy.yaml
├── apps/                        # Application packages
│   ├── web/                     # Frontend application
│   │   ├── src/
│   │   │   ├── components/      # UI components
│   │   │   ├── pages/           # Page components/routes
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── services/        # API client services
│   │   │   ├── stores/          # State management
│   │   │   ├── styles/          # Global styles/themes
│   │   │   └── utils/           # Frontend utilities
│   │   ├── public/              # Static assets
│   │   ├── tests/               # Frontend tests
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   └── api/                     # Backend application
│       ├── src/
│       │   ├── routes/          # API routes/controllers
│       │   ├── services/        # Business logic
│       │   ├── models/          # Data models
│       │   ├── middleware/      # Express/API middleware
│       │   ├── utils/           # Backend utilities
│       │   └── server.ts        # Express server entry
│       ├── tests/               # Backend tests
│       ├── package.json
│       └── tsconfig.json
├── packages/                    # Shared packages
│   ├── shared/                  # Shared types/utilities
│   │   ├── src/
│   │   │   ├── types/           # TypeScript interfaces
│   │   │   ├── constants/       # Shared constants
│   │   │   └── utils/           # Shared utilities
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ui/                      # Shared UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   └── styles/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── config/                  # Shared configuration
│       ├── eslint/
│       ├── typescript/
│       └── jest/
├── infrastructure/              # IaC definitions
│   └── supabase/
│       ├── migrations/
│       ├── functions/
│       └── seed.sql
├── scripts/                     # Build/deploy scripts
│   ├── build.sh
│   ├── deploy.sh
│   └── seed-dev-db.sh
├── docs/                        # Documentation
│   ├── prd.md
│   ├── architecture.md
│   └── api-reference.md
├── .env.example                 # Environment template
├── package.json                 # Root package.json
├── pnpm-workspace.yaml          # pnpm workspace configuration
└── README.md
```

---
