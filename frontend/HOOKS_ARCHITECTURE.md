# Hook Architecture

## Overview
All server data access goes through centralized hooks. Business logic lives in hooks, not components.

## Core Hooks (`src/hooks/`)

### Authentication & Session
- **`useSession.ts`** - Core session management, provides current user identity
- **`useRole.ts`** - Derives user role information and permissions
- **`useRequireAuth.ts`** - Route guard hook, ensures authentication
- **`useOnboardingState.ts`** - Provider onboarding flow state

### Utilities
- **`useApiError.ts`** - Centralized API error handling and parsing

## Generated API Hooks (`src/api/generated/`)

All API operations use generated Orval hooks from OpenAPI spec:
- `useVehiclesControllerFindAll()` - List vehicles
- `useRequestsControllerCreate()` - Create service request
- `useProvidersControllerFindAll()` - Browse providers
- `useJobsControllerFindOne()` - Get job details
- `useReviewsControllerCreate()` - Submit review
- etc.

## Feature Hooks (`src/features/*/hooks/`)

Feature-specific business logic and data management:
- `useVehicles()` - Vehicle management (in `features/vehicles/hooks/`)
- `useRequests()` - Service request management
- `useAuth()` - Authentication flow
- etc.

## Architecture Principles

1. **Centralized Query Keys** - All query keys managed by Orval
2. **Business Rules in Hooks** - Components stay presentational
3. **Type Safety** - All hooks typed from OpenAPI schema
4. **Reusability** - Hooks can compose other hooks
5. **Consistency** - All API calls follow same pattern

## Usage Examples

### Authentication Check
\`\`\`tsx
const { isAuthenticated, user } = useSession();
const { isProvider, needsOnboarding } = useRole();
\`\`\`

### Data Fetching
\`\`\`tsx
const { data: vehicles, isLoading } = useVehiclesControllerFindAll();
\`\`\`

### Mutations
\`\`\`tsx
const { mutate: createRequest } = useRequestsControllerCreate({
  mutation: {
    onSuccess: () => toast.success('Created!'),
    onError: (error) => {
      const { getErrorMessage } = useApiError();
      toast.error(getErrorMessage(error));
    },
  },
});
\`\`\`

### Route Guards
\`\`\`tsx
useRequireAuth({ requireRole: 'OWNER' });
\`\`\`

## Migration Notes

Replaced all `customInstance` hardcoded API calls with generated Orval hooks:
- ✅ `/owner/requests/new` - Now uses `useVehiclesControllerFindAll`, `useRequestsControllerCreate`
- ✅ `/owner/providers/*` - Now uses `useProvidersControllerFindAll`, `useProvidersControllerFindOne`
- ✅ `/owner/jobs/$jobId` - Now uses `useJobsControllerFindOne`, `useReviewsControllerCreate`
