# Shanda Automotive Frontend

A modern, full-featured automotive service marketplace built with React, TypeScript, and TanStack Router.

## 🏗️ Architecture Overview

This application follows a **feature-based architecture** with clean separation of concerns:

- **Routes** are thin delegation layers (routing only)
- **Features** contain all business logic and UI
- **Shared components** are reusable across features
- **Hooks** centralize data fetching and state management
- **Theme system** ensures consistent styling

## 📁 Directory Structure

```
frontend/src/
├── api/                    # Auto-generated API clients (Orval)
│   └── generated/          # TypeScript hooks for all backend endpoints
├── app/                    # App-level configuration
├── components/             # Shared/reusable components (36+ components)
│   ├── layout/            # Layout components (headers, footers, containers)
│   ├── ui/                # Base UI components (buttons, inputs, cards)
│   └── content/           # Content-specific shared components
├── config/                # App configuration
│   ├── theme.ts           # Centralized theme (colors, typography)
│   └── env.validation.ts  # Environment variable validation
├── contexts/              # React contexts (Toast, Socket, Auth)
├── features/              # Feature modules (17 features)
│   ├── auth/             # Authentication & authorization
│   ├── vehicles/         # Vehicle management
│   ├── jobs/             # Job tracking & management
│   ├── requests/         # Service request handling
│   ├── providers/        # Service provider features
│   ├── messages/         # Real-time messaging
│   ├── notifications/    # Notification system
│   ├── payments/         # Payment processing
│   ├── reviews/          # Review & rating system
│   ├── settings/         # User settings
│   └── ...               # 8 more features
├── hooks/                 # Custom React hooks (shared)
│   ├── useSession.ts     # Session management
│   ├── useRole.ts        # Role-based permissions
│   ├── useRequireAuth.ts # Auth guards
│   └── ...
├── lib/                   # External library configurations
│   ├── axios.ts          # Axios instance with interceptors
│   ├── event-bus.ts      # Event-based communication
│   └── ...
├── routes/                # File-based routing (TanStack Router)
│   ├── __root.tsx        # Root layout
│   ├── auth/             # Auth routes (login, signup, etc.)
│   ├── owner/            # Owner dashboard & features
│   ├── provider/         # Provider dashboard & features
│   └── admin/            # Admin panel routes
├── shared/                # Shared utilities and helpers
│   └── utils/            # Helper functions
├── styles/                # Global styles
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions

```

## 🎯 Feature Modules

Each feature follows a consistent structure:

```
features/[feature-name]/
├── components/           # Feature-specific components
│   ├── [Feature]View.tsx # Main view component (called by route)
│   ├── [Component].tsx   # Supporting components
│   └── ...
├── hooks/                # Feature-specific hooks
│   └── use-[feature].ts
├── types/                # Feature-specific types
│   └── [feature].ts
└── utils/                # Feature-specific utilities
```

### Feature Count: **17 Features**

1. **auth** - Login, signup, password reset, OAuth
2. **vehicles** - Vehicle CRUD, VIN decoding, maintenance tracking
3. **jobs** - Job lifecycle, timeline, status management
4. **requests** - Service request creation and quotes
5. **providers** - Provider profiles, search, ratings
6. **messages** - Real-time chat (WebSocket)
7. **notifications** - Real-time notifications
8. **payments** - Stripe integration, payout management
9. **reviews** - Rating and review system
10. **settings** - User profile, preferences, security
11. **owner** - Owner dashboard and activity feed
12. **provider** - Provider dashboard and onboarding
13. **admin** - Admin panel and management
14. **marketing** - Landing pages, pricing
15. **support** - Contact forms, help center
16. **upload** - Image upload and gallery
17. **legal** - Terms, privacy policy

## 🧩 Component Library

### Layout Components (9)
- `PageContainer` - Responsive page wrapper with max-width
- `PageHeader` - Standardized header with breadcrumbs, actions
- `Sidebar` - Navigation sidebar
- `DashboardHeader` - Dashboard-specific header
- `AppHeader` - Main application header
- `PublicHeader` - Marketing site header
- `Footer` - Site footer
- `RoleSwitch` - Role switching component
- `ContentPageLayout` - Content page wrapper

### UI Components (24+)
- **Forms**: `Input`, `Textarea`, `Button`, `FormField`, `Label`, `PhoneInput`, `Combobox`
- **Feedback**: `Badge`, `StatusBadge`, `Toast`, `Modal`, `Dialog`, `ConfirmationModal`
- **Display**: `Card`, `Tabs`, `Separator`, `ScrollArea`, `Popover`, `DropdownMenu`
- **States**: `LoadingState`, `EmptyState`, `ErrorState`, `Skeleton`
- **Navigation**: `Pagination`

## 🎨 Theming System

Centralized theme in `config/theme.ts`:

```typescript
export const theme = {
  colors: {
    brand: {
      primary: '#F5B700',      // Yellow
      primaryDark: '#0F172A',  // Navy
    },
    surface: {
      white: '#FFFFFF',
      light: '#F8FAFC',
      medium: '#F1F5F9',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      tertiary: '#94A3B8',
    },
    // ... more colors
  },
  typography: { /* ... */ },
  spacing: { /* ... */ },
  borderRadius: { /* ... */ },
}
```

**Usage**: All components use Tailwind classes that map to theme colors:
- `bg-yellow-500` → Brand primary
- `text-slate-900` → Text primary
- `bg-slate-50` → Surface light

## 🔗 Data Fetching

### Orval-Generated Hooks

API hooks are auto-generated from OpenAPI spec:

```typescript
// ✅ Generated hooks (type-safe)
import { 
  useVehiclesControllerFindAll,
  useVehiclesControllerCreate,
  useVehiclesControllerUpdate
} from '@/api/generated/vehicles/vehicles';

function VehiclesView() {
  const { data: vehicles, isLoading } = useVehiclesControllerFindAll({
    params: { page: 1, limit: 10 }
  });
  
  const createMutation = useVehiclesControllerCreate();
  
  // ...
}
```

### Custom Hooks

Centralized business logic:

```typescript
// hooks/useSession.ts
export function useSession() {
  return {
    user,
    token,
    isAuthenticated,
    userId,
  };
}

// hooks/useRole.ts
export function useRole() {
  return {
    isOwner,
    isProvider,
    isAdmin,
    isVerifiedProvider,
    needsOnboarding,
  };
}
```

## 🛣️ Routing Pattern

Routes are **thin delegation layers**:

```typescript
// ❌ OLD: Route with logic (bad)
function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  // ... lots of logic
  return <div>...</div>
}

// ✅ NEW: Route delegates to feature component (good)
import { createFileRoute } from '@tanstack/react-router';
import { VehiclesView } from '@/features/vehicles/components/VehiclesView';

export const Route = createFileRoute('/owner/_layout/vehicles/')({
  component: VehiclesView,  // Just 6 lines!
});
```

## 📝 Code Style & Conventions

### Component Naming
- **Views**: `[Feature]View.tsx` - Main feature components
- **Components**: `[PascalCase].tsx` - Reusable components
- **Hooks**: `use[Feature].ts` - Custom hooks
- **Types**: `[feature].ts` - Type definitions

### File Organization
```typescript
// ✅ Good: Grouped by feature
features/
  vehicles/
    components/
      VehiclesView.tsx
      VehicleCard.tsx
      VehicleForm.tsx
    hooks/
      use-vehicles.ts
    types/
      vehicle.ts

// ❌ Bad: Grouped by type
components/
  VehiclesView.tsx
  VehicleCard.tsx
hooks/
  use-vehicles.ts
```

### Component Structure
```typescript
// Standard component pattern
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useFeatureHook } from '../hooks/use-feature';

export function FeatureView() {
  // 1. Hooks
  const { data, isLoading } = useFeatureHook();
  
  // 2. Event handlers
  const handleAction = () => { /* ... */ };
  
  // 3. Early returns (loading, error states)
  if (isLoading) return <LoadingState />;
  if (!data) return <EmptyState />;
  
  // 4. Main render
  return (
    <PageContainer maxWidth="6xl">
      <PageHeader title="Feature Name" />
      {/* ... content */}
    </PageContainer>
  );
}
```

### Import Order
```typescript
// 1. React & external libraries
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal absolute imports (@/)
import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/useSession';

// 3. Relative imports
import { FeatureComponent } from './FeatureComponent';
import type { Feature } from '../types/feature';
```

## 🔧 State Management

### Server State (React Query)
- All API data fetching uses Orval-generated hooks
- Automatic caching, refetching, and error handling
- Optimistic updates for mutations

### Client State
- **Zustand** for global client state (auth gate, messages)
- **React Context** for scoped state (Toast, Socket)
- **useState** for local component state

### Example:
```typescript
// Server state (React Query via Orval)
const { data: vehicles } = useVehiclesControllerFindAll();

// Global client state (Zustand)
const { messages, addMessage } = useMessagesStore();

// Local state (useState)
const [isOpen, setIsOpen] = useState(false);
```

## 🎭 Error Handling

### Global Error Handling
```typescript
// lib/axios.ts - Interceptor handles:
// - Network errors
// - 401 (unauthorized) with token refresh
// - 403 (forbidden)
// - 404 (not found)
// - 500 (server errors)

// Automatic toast notifications via event bus
```

### Component-Level Error Handling
```typescript
import { useApiError } from '@/hooks/useApiError';

function Component() {
  const { parseError, getErrorMessage } = useApiError();
  const mutation = useMutation({
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  });
}
```

## 🚀 Performance Optimizations

1. **Code Splitting** - Route-based lazy loading (TanStack Router)
2. **Image Optimization** - Lazy loading, responsive images
3. **API Optimization** - Request deduplication, caching (React Query)
4. **Bundle Size** - Tree-shaking, dynamic imports
5. **Rendering** - React.memo for expensive components

## 📦 Key Dependencies

- **React 18** - UI library
- **TypeScript** - Type safety
- **TanStack Router** - File-based routing
- **TanStack Query** - Server state management
- **Orval** - API client generation
- **Tailwind CSS** - Styling
- **Zustand** - Client state
- **Axios** - HTTP client
- **Socket.io** - Real-time communication
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 🔐 Authentication Flow

1. User logs in → Backend sets `csrf_token` cookie
2. `useSession()` hook reads cookie → Provides user data
3. `useRole()` hook derives permissions from session
4. `useRequireAuth()` protects routes
5. Axios interceptor adds CSRF token to mutations
6. 401 errors trigger automatic token refresh

## 📊 Statistics

- **Total Routes**: ~40+ routes
- **Total Components**: 100+ components
- **Total Features**: 17 features
- **UI Components**: 24+ reusable components
- **Custom Hooks**: 15+ hooks
- **API Endpoints**: Auto-generated from OpenAPI
- **Lines of Code**: ~15,000+ LOC

## 🧪 Testing Strategy

- **Unit Tests**: Component logic (Jest + React Testing Library)
- **Integration Tests**: Feature flows
- **E2E Tests**: Critical user journeys (backend/test/)

## 🔄 Development Workflow

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Generate API client from OpenAPI
npm run generate:api

# Type check
npm run type-check

# Build for production
npm run build

# Lint
npm run lint
```

## 📝 Code Examples

### Creating a New Feature

1. **Create feature folder**:
```
features/my-feature/
  components/
    MyFeatureView.tsx
  hooks/
    use-my-feature.ts
  types/
    my-feature.ts
```

2. **Create view component**:
```typescript
// features/my-feature/components/MyFeatureView.tsx
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useMyFeature } from '../hooks/use-my-feature';

export function MyFeatureView() {
  const { data, isLoading } = useMyFeature();
  
  return (
    <PageContainer maxWidth="4xl">
      <PageHeader title="My Feature" />
      {/* Content */}
    </PageContainer>
  );
}
```

3. **Create route**:
```typescript
// routes/my-feature/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { MyFeatureView } from '@/features/my-feature/components/MyFeatureView';

export const Route = createFileRoute('/my-feature/')({
  component: MyFeatureView,
});
```

### Using the Theme

```typescript
// ✅ Good: Use Tailwind classes that map to theme
<div className="bg-yellow-500 text-slate-900 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-slate-900">Title</h1>
  <p className="text-slate-600">Description</p>
</div>

// ❌ Bad: Hardcoded colors
<div style={{ backgroundColor: '#F5B700' }}>
```

### Creating Shared Components

```typescript
// components/ui/my-component.tsx
import React from 'react';
import { cn } from '@/utils/cn'; // Utility for class merging

interface MyComponentProps {
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function MyComponent({ 
  variant = 'primary', 
  className 
}: MyComponentProps) {
  return (
    <div className={cn(
      'base-classes',
      variant === 'primary' && 'primary-classes',
      variant === 'secondary' && 'secondary-classes',
      className
    )}>
      {/* Content */}
    </div>
  );
}
```

## 🎯 Best Practices

1. **Routes are thin** - No business logic, just routing
2. **Features are isolated** - Each feature is self-contained
3. **Shared components are dumb** - No business logic, just UI
4. **Hooks centralize logic** - Reusable data fetching and state
5. **Use TypeScript** - Leverage type safety everywhere
6. **Follow naming conventions** - Consistent naming across codebase
7. **Keep components small** - Single responsibility principle
8. **Use Orval hooks** - Don't manually call axios
9. **Respect the theme** - Use theme colors, not hardcoded values
10. **Write accessible code** - aria-labels, semantic HTML

## 🐛 Common Issues & Solutions

### Network Error Toast on Page Load
**Fixed**: Axios interceptor now only shows network errors after first successful connection.

### TypeScript Errors
**Solution**: Run `npm run generate:api` to regenerate API client.

### Styling Not Applied
**Solution**: Check if Tailwind classes are correctly configured in `tailwind.config.js`.

## 📚 Further Reading

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query)
- [Orval Docs](https://orval.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

---

**Built with ❤️ by the Shanda Automotive team**
