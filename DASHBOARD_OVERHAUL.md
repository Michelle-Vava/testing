# Dashboard Overhaul Implementation Guide

## ✅ COMPLETED: Backend Foundation

### Database Schema Updates
- Added User fields: avatarUrl, bio, certifications, shop details, service areas, mobile/shop flags, rating, reviewCount
- Created Services table: Manage platform services (Oil Change, Brakes, Battery, etc.)
- Created Notifications table: System notifications for users
- Created Activities table: User activity timeline
- Migration file created: `migrations/20251231000000_add_services_notifications_activities/migration.sql`
- Updated seed file: `seed-updated.ts` with Halifax providers and sample data

### To Apply Database Changes:
```bash
cd backend
npx prisma migrate deploy  # Apply migration
npx prisma db seed          # Seed data (use seed-updated.ts)
npm run generate            # Generate Prisma client
```

## 🔨 TODO: Backend APIs

### 1. Services Controller
- GET /services - List all active services
- GET /services/popular - Get popular services only

### 2. Notifications Controller  
- GET /notifications - User's notifications
- PUT /notifications/:id/read - Mark as read
- GET /notifications/unread-count - Badge count

### 3. Activities Controller
- GET /activities - User's activity timeline
- POST /activities - Create activity (internal)

### 4. User/Profile Controller Updates
- PUT /users/profile - Update profile (address, phone, bio, avatar)
- GET /providers - Browse providers (with filters)
- GET /providers/:id - Provider profile detail

## 🎨 TODO: Frontend Components

### 1. Hero State Banner (CRITICAL)
**File**: `frontend/src/features/owner/components/HeroStateBanner.tsx`

States:
- No vehicles → "Add your first vehicle"
- Has vehicle, no requests → "Request quotes from local providers"
- Has open request → "View quotes (2 received)"
- Has booking → "Upcoming appointment"

### 2. Getting Started Checklist
**File**: `frontend/src/features/owner/components/GettingStartedChecklist.tsx`

Items:
- ✅ Account created
- ⬜ Complete profile
- ⬜ Add a vehicle
- ⬜ Request your first quote

Rules: Only show when incomplete, clickable, disappears when done

### 3. User Menu (Top-Right)
**File**: `frontend/src/components/layout/AppHeader.tsx` (update)

Add dropdown:
- Profile
- Notifications (with badge)
- Settings
- Logout

### 4. Notifications System
**Files**:
- `frontend/src/features/notifications/components/NotificationBell.tsx`
- `frontend/src/features/notifications/components/NotificationDropdown.tsx`
- `frontend/src/routes/owner/_layout/notifications.tsx`

Features:
- Bell icon with badge count
- Dropdown preview (5 recent)
- "View all" page

### 5. Activity Timeline
**File**: `frontend/src/features/owner/components/ActivityFeed.tsx`

Show:
- "You added a vehicle"
- "Service request sent"
- "Quote received from X"

Empty state: "No activity yet. Add a vehicle to get started."

### 6. Popular Services Section
**File**: `frontend/src/features/owner/components/PopularServices.tsx`

Grid of service chips:
- Oil change, Brakes, Battery, Inspection
- Click → Opens Create Request (pre-filled)
- If no vehicle → Prompt "Add vehicle first"

### 7. Provider Preview on Dashboard
**File**: `frontend/src/features/owner/components/ProviderPreview.tsx`

Show 3 provider cards:
- Name + avatar
- Rating + review count
- Distance (approx)
- Service types (chips)
- Mobile/Shop/Both badge
- "Verified" badge
- CTA: "View profile"

### 8. Provider Browse Page
**File**: `frontend/src/routes/owner/_layout/providers/index.tsx`

Full provider listing with filters:
- Service type
- Mobile/Shop
- Distance
- Rating

### 9. Provider Profile Page
**File**: `frontend/src/routes/owner/_layout/providers/$providerId.tsx`

Sections:
- Header (name, rating, verified badge)
- About
- Services offered
- Certifications
- Photos
- Reviews
- Service area map
- CTAs: "Request a quote" (opens Create Request, pre-selects provider)

### 10. Profile Settings Page
**File**: `frontend/src/routes/owner/_layout/settings.tsx` (update)

Tabs:
- Profile: Name, phone, address, avatar
- Preferences: Notifications settings
- Security: Change password

### 11. Dashboard Metrics Update
**File**: `frontend/src/features/owner/components/OwnerDashboard.tsx`

Remove fake metrics:
- ❌ Money Saved (until real)

Keep real metrics:
- ✅ Vehicles count
- ✅ Requests count
- ✅ Active requests count

Add when data exists:
- Quotes received count
- Avg response time

### 12. Quick Actions Update
**File**: Already exists, needs state-awareness

Make actions:
- State-aware (disable if no vehicle)
- Never lead to dead ends
- Reduce clicks

## 📊 Implementation Priority

### Phase 1: Foundation (Do First)
1. Apply database migration
2. Run updated seed
3. Create Services API
4. Create Notifications API
5. Create Activities API

### Phase 2: Core UX (Critical)
1. Hero State Banner
2. Getting Started Checklist
3. Fix dashboard metrics (remove fake ones)
4. User menu (top-right)
5. Profile settings page

### Phase 3: Engagement
1. Notifications bell + dropdown
2. Activity timeline
3. Popular services section
4. Provider preview cards

### Phase 4: Marketplace
1. Provider browse page
2. Provider profile page
3. Request quote flow updates

## 🔄 Flow Improvements

### Create Request Flow
Before: Dashboard → Create Request → Pick vehicle
After: Dashboard → (Check vehicle) → Pre-filled request

### Add Vehicle Flow
Before: Settings → Vehicles → Add
After: Multiple entry points with context

### Provider Discovery
Before: Not possible
After: Dashboard preview → Browse all → Profile → Request quote

## 📝 Notes

- All backend changes preserve existing functionality
- Frontend changes are additive (no breaking changes)
- Migration is reversible if needed
- Seed data uses Halifax (user's location)
- Focus on reducing decision paralysis
- Every action should have clear next step
