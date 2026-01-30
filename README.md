Platform Web App
Primary user-facing web application for the SaaS platform

React Vite TypeScript Storybook

Project Overview
platform-web-app is the primary user-facing web application for the SaaS platform. It provides the main interface for users to manage workspaces, projects, and collaborate with team members. Built with React 18, TypeScript, and Vite for optimal developer experience and performance.

Purpose
This application serves as: - User Dashboard: Central hub for workspace and project management - Component Library Source: Provides shared UI components used by platform-admin-dashboard - Design System: Storybook documentation for consistent UI patterns across the platform

Key Features
Feature	Description
🔐 Authentication	JWT-based auth with automatic token refresh
📁 Project Management	Create, view, and manage projects within workspaces
🏢 Workspace Support	Multi-workspace organization with switcher
🎨 Component Library	Shared components documented in Storybook
⚡ Token Refresh	Automatic silent refresh on 401 with request queuing
📖 Storybook	Interactive component documentation (Port 6006)
Tech Stack
Layer	Technology
Framework	React 18 with TypeScript
Build Tool	Vite 5
Styling	CSS Modules
State Management	React Context API
HTTP Client	Axios with interceptors
Routing	React Router v6
Documentation	Storybook 8
API Types	openapi-typescript (auto-generated)
Architecture
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
Technical Architecture
Authentication Flow
┌──────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│  Login Page  │────▶│  POST /auth/login   │────▶│  Token Response  │
└──────────────┘     └─────────────────────┘     └────────┬─────────┘
                                                          │
                     ┌─────────────────────┐              │
                     │  Store in           │◀─────────────┘
                     │  localStorage       │
                     └──────────┬──────────┘
                                │
                     ┌──────────▼──────────┐
                     │  GET /auth/me       │
                     └──────────┬──────────┘
                                │
                     ┌──────────▼──────────┐
                     │  Set user in        │
                     │  AuthContext        │
                     └─────────────────────┘
Token Management: - Access tokens stored in localStorage with key access_token - Refresh tokens stored with key refresh_token - Automatic 401 handling triggers token refresh via POST /auth/refresh - Failed requests are queued and retried after successful refresh - On refresh failure, user is redirected to /login

API Client Architecture
api.ts - Core API Client (:8000)

// Features
- Axios instance with baseURL: ${VITE_API_URL}/api/v1
- Request interceptor: Attaches Bearer token
- Response interceptor: 401 → Refresh token → Retry request
- Request queuing during refresh to prevent race conditions

// Token Functions
getAccessToken() → string | null
getRefreshToken() → string | null
setTokens(access, refresh) → void
clearTokens() → void
Type System
All API types are centralized in src/types/api.ts, derived from backend schemas:

Authentication Types: | Type | Fields | |------|--------| | LoginRequest | email, password | | TokenResponse | access_token, refresh_token, token_type, expires_in | | RefreshTokenRequest | refresh_token |

Core Models: | Type | Fields | |------|--------| | User | id, email, full_name, avatar_url?, role, is_active, created_at, updated_at | | Workspace | id, name, slug, description?, created_at, updated_at | | Project | id, name, description?, status, workspace_id, owner_id, owner?, created_at, updated_at |

User Roles:

type UserRole = 'super_admin' | 'admin' | 'member' | 'viewer';
Project Status:

type ProjectStatus = 'active' | 'archived' | 'draft';
Context Providers
AuthContext (src/contexts/AuthContext.tsx)

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email, password) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;  // Re-fetch user profile
}
Custom Hooks
useWorkspaces (src/hooks/useWorkspaces.ts)

interface UseWorkspacesResult {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    setCurrentWorkspace: (workspace: Workspace) => void;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
useProjects (src/hooks/useProjects.ts)

interface UseProjectsOptions {
    workspaceId: string;
    page?: number;       // Default: 1
    pageSize?: number;   // Default: 20
    autoFetch?: boolean; // Default: true
}

interface UseProjectsResult {
    projects: Project[];
    total: number;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
useProject (single project)

// Returns: { project, isLoading, error, refetch }
const { project } = useProject(workspaceId, projectId);
React Components
Component Library
All UI components are designed for reuse in platform-admin-dashboard and documented in Storybook.

Button
Location: src/components/Button/Button.tsx | Storybook: Button.stories.tsx

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    scale?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
    children: React.ReactNode;
}
Prop	Type	Default	Description
variant	'primary' | 'secondary' | 'ghost' | 'danger'	'primary'	Visual style
scale	'sm' | 'md' | 'lg'	'md'	Button size
fullWidth	boolean	false	Stretch to container width
isLoading	boolean	false	Shows spinner, disables button
Usage:

<Button variant="primary" scale="md" onClick={handleSubmit}>
    Submit
</Button>

<Button variant="danger" isLoading={isDeleting}>
    Delete
</Button>
Modal
Location: src/components/Modal/Modal.tsx | Storybook: Modal.stories.tsx

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}
Prop	Type	Default	Description
isOpen	boolean	-	Controls visibility
onClose	() => void	-	Close handler (also triggered by Escape key)
title	string	-	Optional header title
size	'sm' | 'md' | 'lg'	'md'	Modal width
Features: - Closes on Escape key - Closes on backdrop click - Prevents body scroll when open - Accessible: role="dialog", aria-modal="true"

Usage:

<Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm">
    <p>Are you sure?</p>
    <Button onClick={handleConfirm}>Yes</Button>
</Modal>
Card
Location: src/components/Card/Card.tsx | Storybook: Card.stories.tsx

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
}
Prop	Type	Default	Description
hoverable	boolean	false	Adds hover elevation effect
onClick	() => void	-	Makes card clickable
Usage:

<Card hoverable onClick={() => navigate(`/projects/${project.id}`)}>
    <h3>{project.name}</h3>
    <p>{project.description}</p>
</Card>
Input
Location: src/components/Form/Input.tsx | Storybook: Input.stories.tsx

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}
Prop	Type	Default	Description
label	string	-	Label text above input
error	string	-	Error message (red styling)
helperText	string	-	Helper text below input (hidden when error present)
Usage:

<Input
    id="email"
    label="Email Address"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    error={errors.email}
    helperText="We'll never share your email"
/>
MainLayout
Location: src/components/Layout/MainLayout.tsx

interface MainLayoutProps {
    children: React.ReactNode;
}
Features: - Top navigation header with logo, nav links, user info - Logout button using AuthContext - Main content area

Usage:

<MainLayout>
    <DashboardPage />
</MainLayout>
ProtectedRoute
Location: src/components/Layout/ProtectedRoute.tsx

No Props - Uses AuthContext internally

Behavior: | State | Result | |-------|--------| | isLoading | Shows loading spinner | | !isAuthenticated | Redirects to /login | | Authenticated | Renders child routes via <Outlet /> |

Usage:

<Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/projects" element={<ProjectsPage />} />
</Route>
Component Hierarchy
App
├── AuthProvider
│   └── BrowserRouter
│       └── Routes
│           ├── /login → LoginPage
│           └── ProtectedRoute
│               └── MainLayout
│                   ├── /dashboard → DashboardPage
│                   ├── /projects → ProjectsPage
│                   └── /projects/:id → ProjectDetailPage
API ↔ Screen Mapping
Screen	API Endpoint	Response Type	Breaking Changes
Login	POST /auth/login	TokenResponse	Breaks auth flow
Login	GET /auth/me	User	Breaks header, profile
Dashboard	GET /workspaces	WorkspaceListResponse	Breaks workspace cards
Projects List	GET /workspaces/{id}/projects	ProjectListResponse	Breaks project grid
Project Detail	GET /workspaces/{id}/projects/{id}	Project	Breaks detail page
Directory Structure
platform-web-app/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Router + providers
│   │
│   ├── components/           # Shared UI (Storybook)
│   │   ├── Button/           # ★ Shared with admin-dashboard
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── Button.stories.tsx
│   │   ├── Modal/            # ★ Shared with admin-dashboard
│   │   ├── Form/             # ★ Shared with admin-dashboard
│   │   ├── Card/
│   │   └── Layout/
│   │       ├── MainLayout.tsx
│   │       └── ProtectedRoute.tsx
│   │
│   ├── pages/
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   └── Projects/
│   │
│   ├── hooks/
│   │   ├── useProjects.ts    # Project list/detail fetching
│   │   └── useWorkspaces.ts  # Workspace management
│   │
│   ├── services/             # API client
│   │   ├── api.ts            # Axios + token refresh
│   │   ├── auth.ts           # Login, logout, getCurrentUser
│   │   ├── projects.ts       # Project CRUD
│   │   └── workspaces.ts     # Workspace fetching
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication state
│   │
│   └── types/
│       └── api.ts            # TypeScript types from OpenAPI
│
├── .storybook/               # Storybook config
├── .env.example
├── package.json
└── vite.config.ts
Quick Start
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Start Storybook (Port 6006)
npm run storybook

# Generate TypeScript types from OpenAPI
# (requires platform-api-core running on :8000)
npm run generate-api

# Build for production
npm run build
Dependencies
{
  "dependencies": {
    "axios": "^1.6.5",           // HTTP client with interceptors
    "react": "^18.2.0",          // UI framework
    "react-dom": "^18.2.0",      // React DOM renderer
    "react-router-dom": "^6.21.3" // Client-side routing
  },
  "devDependencies": {
    "storybook": "^8.0.0",       // Component documentation
    "openapi-typescript": "^6.7.4", // API type generation
    "vite": "^5.0.12",           // Build tool
    "typescript": "^5.3.3"       // Type checking
  }
}
Cross-Repo Dependencies
Repository	Relationship
platform-api-core	API backend (all endpoints)
platform-admin-dashboard	Shares UI components
Environment Variables
# .env
VITE_API_URL=http://localhost:8000
VITE_API_VERSION=v1
VITE_APP_NAME=Platform
License
Proprietary - All rights reserved
