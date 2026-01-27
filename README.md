# Platform Web App

> Primary user-facing web application for the SaaS platform

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

## Overview

**platform-web-app** is the main user interface for the SaaS platform. It consumes APIs from platform-api-core and provides shared UI components used by platform-admin-dashboard.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   platform-web-app (This Repo - Port 3000)                                   │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                                                                       │  │
│   │   ┌───────────────────────────────────────────────────────────────┐  │  │
│   │   │  Pages                                                         │  │  │
│   │   │  • /login          → POST /api/v1/auth/login                   │  │  │
│   │   │  • /dashboard      → GET /api/v1/auth/me, GET /workspaces      │  │  │
│   │   │  • /projects       → GET /workspaces/{id}/projects             │  │  │
│   │   │  • /projects/:id   → GET /workspaces/{id}/projects/{id}        │  │  │
│   │   └───────────────────────────────────────────────────────────────┘  │  │
│   │                                                                       │  │
│   │   ┌───────────────────────────────────────────────────────────────┐  │  │
│   │   │  Shared Components (also used by admin-dashboard)              │  │  │
│   │   │  • Button   → Primary, Secondary, Ghost, Danger                │  │  │
│   │   │  • Modal    → Dialogs, Confirmations                          │  │  │
│   │   │  • Input    → Form fields                                      │  │  │
│   │   │  • Card     → Content containers                               │  │  │
│   │   └───────────────────────────────────────────────────────────────┘  │  │
│   │                                                                       │  │
│   │   ┌───────────────────────────────────────────────────────────────┐  │  │
│   │   │  Storybook (Port 6006)                                         │  │  │
│   │   │  Component documentation for cross-repo sharing                │  │  │
│   │   └───────────────────────────────────────────────────────────────┘  │  │
│   │                                                                       │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                           │                                  │
│                                           ▼                                  │
│   platform-api-core (Port 8000) ──────────────────────────────────────────  │
│   OpenAPI: /openapi/v1.json                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## API ↔ Screen Mapping

| Screen | API Endpoint | Response Type | Breaking Changes |
|--------|--------------|---------------|------------------|
| Login | `POST /auth/login` | `TokenResponse` | Breaks auth flow |
| Login | `GET /auth/me` | `User` | Breaks header, profile |
| Dashboard | `GET /workspaces` | `WorkspaceListResponse` | Breaks workspace cards |
| Projects List | `GET /workspaces/{id}/projects` | `ProjectListResponse` | Breaks project grid |
| Project Detail | `GET /workspaces/{id}/projects/{id}` | `Project` | Breaks detail page |

## Directory Structure

```
platform-web-app/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Router + providers
│   │
│   ├── components/           # Shared UI (Storybook)
│   │   ├── Button/           # ★ Shared with admin-dashboard
│   │   ├── Modal/            # ★ Shared with admin-dashboard
│   │   ├── Form/             # ★ Shared with admin-dashboard
│   │   ├── Card/
│   │   └── Layout/
│   │
│   ├── pages/
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   └── Projects/
│   │
│   ├── hooks/
│   │   ├── useProjects.ts
│   │   └── useWorkspaces.ts
│   │
│   ├── services/             # API client
│   │   ├── api.ts            # Axios + token refresh
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   └── workspaces.ts
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx
│   │
│   └── types/
│       └── api.ts            # TypeScript types from OpenAPI
│
├── .storybook/               # Storybook config
├── .env.example
├── package.json
└── vite.config.ts
```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Start Storybook (Port 6006)
npm run storybook

# Generate TypeScript types from OpenAPI
# (requires platform-api-core running on :8000)
npm run generate-api
```

## Shared Components

These components are designed for reuse in platform-admin-dashboard:

| Component | Purpose | Cross-Repo Usage |
|-----------|---------|------------------|
| `Button` | Actions, CTAs | Copy to admin-dashboard |
| `Modal` | Dialogs, confirmations | Copy to admin-dashboard |
| `Input` | Form fields | Copy to admin-dashboard |
| `Card` | Content containers | Copy to admin-dashboard |

View in Storybook: `npm run storybook`

## API Client Generation

TypeScript types can be auto-generated from the OpenAPI spec:

```bash
# 1. Ensure platform-api-core is running
cd ../server-one/platform-api-core
uvicorn app.main:app --reload

# 2. Generate types
npm run generate-api
# Creates: src/types/api-generated.ts
```

## Cross-Repo Dependencies

| Repository | Relationship |
|------------|--------------|
| [platform-api-core](../server-one/platform-api-core) | API backend (all endpoints) |
| [platform-admin-dashboard](../ui-two/platform-admin-dashboard) | Shares UI components |

## Environment Variables

```env
# .env
VITE_API_URL=http://localhost:8000
VITE_API_VERSION=v1
VITE_APP_NAME=Platform
```

## License

Proprietary - All rights reserved
