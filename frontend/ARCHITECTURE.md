# Frontend Architecture Documentation

## Overview
The frontend has been restructured to follow best practices with a feature-based architecture, reusable components, and clear separation of concerns.

## Directory Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── ContentPageLayout.tsx    # Reusable page layout wrapper
│   │   ├── Footer.tsx                # Global footer component
│   │   └── Navbar.tsx                # Global navbar component
│   └── content/
│       └── ContentSection.tsx        # Content utilities (Section, List, Text)
│
├── features/
│   ├── auth/
│   │   └── components/
│   │       ├── Login.tsx             # Login page component
│   │       ├── Signup.tsx            # Signup page component
│   │       ├── ForgotPassword.tsx    # Forgot password page component
│   │       └── ResetPassword.tsx     # Reset password page component
│   ├── errors/
│   │   └── components/
│   │       └── NotFound.tsx          # 404 page component
│   ├── legal/
│   │   └── components/
│   │       ├── Privacy.tsx           # Privacy policy page component
│   │       └── Terms.tsx             # Terms of service page component
│   ├── marketing/
│   │   └── components/
│   │       └── About.tsx             # About page component
│   ├── owner/
│   │   └── components/
│   │       └── OwnerSetup.tsx        # Owner onboarding page component
│   ├── provider/
│   │   └── components/
│   │       └── ProviderSetup.tsx     # Provider onboarding page component
│   └── support/
│       └── components/
│           ├── Contact.tsx           # Contact form page component
│           └── Help.tsx              # FAQ/help center page component
│
└── routes/
    ├── index.tsx                     # Landing page (imports components)
    ├── $.tsx                         # 404 route (5 lines - imports only)
    ├── privacy.tsx                   # Privacy route (5 lines - imports only)
    ├── terms.tsx                     # Terms route (5 lines - imports only)
    ├── about.tsx                     # About route (5 lines - imports only)
    ├── help.tsx                      # Help route (5 lines - imports only)
    ├── contact.tsx                   # Contact route (5 lines - imports only)
    ├── -components/                  # Landing page components
    │   ├── Hero.tsx
    │   ├── HowItWorks.tsx
    │   ├── TopProviders.tsx
    │   ├── RecentRequests.tsx
    │   └── CTA.tsx
    ├── auth/
    │   ├── login.tsx                 # Login route (5 lines - imports only)
    │   ├── signup.tsx                # Signup route (5 lines - imports only)
    │   ├── forgot-password.tsx       # Forgot password route (5 lines - imports only)
    │   └── reset-password.tsx        # Reset password route (5 lines - imports only)
    ├── owner/
    │   ├── owner-setup.tsx           # Owner setup route (5 lines - imports only)
    │   └── -components/              # Owner setup step components
    └── provider/
        ├── provider-setup.tsx        # Provider setup route (5 lines - imports only)
        └── -components/              # Provider components (if any)
```

## Design Principles

### 1. **Minimal Route Files**
- Route files are 5-6 lines: import component + export Route
- No business logic or UI code in route files
- Example:
  ```tsx
  import { createFileRoute } from '@tanstack/react-router';
  import { Privacy } from '@/features/legal/components/Privacy';

  export const Route = createFileRoute('/privacy')({
    component: Privacy,
  });
  ```

### 2. **Feature-Based Organization**
- Components organized by domain: `legal`, `marketing`, `support`
- Each feature has its own `/components` directory
- Co-locate related components, hooks, and utilities

### 3. **Reusable Layout Components**

#### ContentPageLayout
Located at: `src/components/layout/ContentPageLayout.tsx`

Provides consistent layout for all footer pages:
- Header with title and optional highlighting
- Back link to home
- Content wrapper with proper spacing
- Footer integration
- Responsive design

Props:
```tsx
{
  title: string;              // Main title
  titleHighlight?: string;    // Highlighted portion (yellow)
  lastUpdated?: string;       // Last updated date
  showBackLink?: boolean;     // Show/hide back link
  children: React.ReactNode;  // Page content
}
```

Used by: Privacy, Terms pages

#### ContentSection Components
Located at: `src/components/content/ContentSection.tsx`

Utilities for consistent content styling:
- `ContentSection`: Wrapper with title
- `ContentList`: Styled bullet lists
- `ContentText`: Consistent paragraph styling

Example:
```tsx
<ContentSection title="Data Collection">
  <ContentText>We collect information when you:</ContentText>
  <ContentList items={[
    'Create an account',
    'Submit requests',
    'Contact support'
  ]} />
</ContentSection>
```

### 4. **Component Patterns**

#### Landing Page Components
Located at: `src/routes/-components/`

Split into logical sections:
- **Hero**: Main hero section with CTA
- **HowItWorks**: 3-step process explanation
- **TopProviders**: Featured provider cards
- **RecentRequests**: Recent service requests
- **CTA**: Final call-to-action banner

Each component:
- Uses Framer Motion for subtle animations (150-300ms, easeOut)
- Implements responsive design
- Follows consistent spacing and typography

#### Feature Components

**About Component** (`features/marketing/components/About.tsx`):
- Stats grid with API integration
- Company values cards
- Mission statement
- Team section
- CTA section

**Help Component** (`features/support/components/Help.tsx`):
- FAQ categories with search
- Accordion for Q&A
- Contact CTA
- Search filter state management

**Contact Component** (`features/support/components/Contact.tsx`):
- Contact methods cards
- Contact form with validation
- API integration for settings
- Toast notifications
- Form state management

## Best Practices

### Animation
- Use Framer Motion sparingly
- Duration: 150-300ms
- Easing: easeOut
- Delay: max 100ms per item in staggered animations

### Validation
- Use validation utilities from `shared/utils/validation.tsx`
- Functions:
  - `getInputClasses(hasError?: boolean, disabled?: boolean)`
  - `renderError(error?: string)`
  - `validateField(value, rules)`
  - `validateForm(values, rules)`

### API Integration
- Use React Query for data fetching
- Define API clients in `src/api/generated/`
- Handle loading and error states

### Styling
- Tailwind CSS for all styling
- shadcn/ui components for common UI elements
- Consistent color scheme: slate + yellow accent
- Responsive breakpoints: sm, md, lg, xl

## Code Organization Rules

### ✅ DO
- Keep route files minimal (imports only)
- Create reusable layout components
- Group related components in feature directories
- Use consistent naming conventions
- Extract shared utilities
- Implement proper TypeScript types

### ❌ DON'T
- Put business logic in route files
- Duplicate layout code across pages
- Create overly large components (>300 lines)
- Mix concerns in single files
- Use inline styles
- Ignore TypeScript errors

## Migration Summary

### Before
- Route files: 100-300 lines each
- Duplicated layout code across pages
- No shared components
- Mixed concerns (routing + UI + logic)
- Poor organization

### After
- Route files: 5-6 lines each
- Shared layout components (ContentPageLayout, ContentSection)
- Feature-based organization
- Clear separation: routes → components → logic
- Improved maintainability

### Changes Made
1. Created `ContentPageLayout` for consistent page structure
2. Created `ContentSection` utilities for content blocks
3. Extracted all pages to feature components:
   - Privacy → `features/legal/components/Privacy.tsx`
   - Terms → `features/legal/components/Terms.tsx`
   - About → `features/marketing/components/About.tsx`
   - Help → `features/support/components/Help.tsx`
   - Contact → `features/support/components/Contact.tsx`
   - Login → `features/auth/components/Login.tsx`
   - Signup → `features/auth/components/Signup.tsx`
   - ForgotPassword → `features/auth/components/ForgotPassword.tsx`
   - ResetPassword → `features/auth/components/ResetPassword.tsx`
   - NotFound → `features/errors/components/NotFound.tsx`
   - OwnerSetup → `features/owner/components/OwnerSetup.tsx`
   - ProviderSetup → `features/provider/components/ProviderSetup.tsx`
4. Cleaned all route files to minimal imports (13 routes total)
5. Fixed validation utility usage
6. Ensured all files compile without errors

## Next Steps

### Potential Improvements
1. Add loading skeletons for async content
2. Implement error boundaries
3. Add unit tests for components
4. Create Storybook documentation
5. Optimize bundle size with code splitting
6. Add E2E tests for critical flows
7. Implement i18n for multi-language support

### Adding New Pages
1. Create component in appropriate feature directory
2. Use `ContentPageLayout` if it fits the pattern
3. Keep route file minimal (5-6 lines)
4. Add proper TypeScript types
5. Follow animation and styling guidelines

### Performance
- All components use proper React patterns
- Memoization where needed (React.memo, useMemo, useCallback)
- Lazy loading for heavy components
- Optimized images and assets
