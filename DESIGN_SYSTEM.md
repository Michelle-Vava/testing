# Shanda Design System

## Brand Colors (Easy to Change)

All brand colors are defined in `tailwind.config.js` for easy theming:

```javascript
colors: {
  brand: {
    dark: '#0f172a',      // slate-900 - Primary dark backgrounds
    darker: '#1e293b',    // slate-800 - Secondary dark
    medium: '#334155',    // slate-700 - Medium tone
    light: '#64748b',     // slate-500 - Light text
    accent: '#eab308',    // yellow-500 - CTAs, alerts, savings
    'accent-hover': '#ca8a04',  // yellow-600 - Hover states
    'accent-light': '#fef3c7',  // yellow-100 - Backgrounds
  }
}
```

## Color Usage Guide

### Backgrounds
- **Hero sections**: `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`
- **Page backgrounds**: `bg-gradient-to-br from-slate-50 to-slate-100`
- **Cards**: `bg-white` with `border-slate-200`
- **Header/Footer**: `bg-slate-900 border-slate-800`

### Text
- **Headings**: `text-slate-900` (on light) or `text-white` (on dark)
- **Body text**: `text-slate-600` (on light) or `text-slate-300` (on dark)
- **Links**: `text-slate-900 hover:text-slate-700`

### Buttons (via Button component)
- **Primary**: `variant="primary"` → Slate 900 background
- **Secondary/CTA**: `variant="secondary"` → Yellow 500 accent (use for main CTAs)
- **Outline**: `variant="outline"` → Slate border
- **Ghost**: `variant="ghost"` → Transparent

### Accents
- **Savings/Alerts**: `text-yellow-500`
- **Success**: `text-green-600`
- **Error**: `text-red-600`
- **Warning**: `text-yellow-600`

### Focus States
- **All inputs**: `focus:ring-2 focus:ring-slate-500 focus:border-transparent`

## Button Examples

```tsx
// Primary action (dark slate)
<Button variant="primary">Sign In</Button>

// Main CTA (yellow accent)
<Button variant="secondary">Get Free Quotes →</Button>

// Secondary action
<Button variant="outline">Learn More</Button>

// Subtle action
<Button variant="ghost">Cancel</Button>
```

## Typography

- **Hero**: `text-5xl md:text-6xl font-bold`
- **Section heading**: `text-3xl md:text-4xl font-bold text-slate-900`
- **Card title**: `text-xl font-semibold text-slate-900`
- **Body**: `text-base text-slate-600`
- **Small text**: `text-sm text-slate-500`

## Component Patterns

### Hero Section
```tsx
<section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 overflow-hidden">
  {/* Subtle grid pattern */}
  <div className="absolute inset-0 bg-[url('data:image/svg+xml;...')] opacity-50"></div>
  
  <div className="max-w-7xl mx-auto px-4 relative z-10">
    <h1 className="text-5xl md:text-6xl font-bold">
      Your Heading
      <span className="text-yellow-400">Accent Text</span>
    </h1>
  </div>
</section>
```

### Card
```tsx
<Card className="bg-white border border-slate-200 hover:shadow-lg transition-shadow">
  <CardContent>
    <h3 className="text-xl font-semibold text-slate-900">Title</h3>
    <p className="text-slate-600">Description</p>
  </CardContent>
</Card>
```

### Form Input
```tsx
<input
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
  placeholder="Enter value"
/>
```

## How to Change Theme

To update the entire app's color scheme:

1. **Edit `tailwind.config.js`**:
   - Update `brand.dark` / `brand.darker` for dark backgrounds
   - Update `brand.accent` for CTAs and highlights
   - Update `primary.*` scale for neutral tones

2. **Components auto-update**:
   - Button component uses these colors
   - All focus rings use `focus:ring-slate-500`
   - All headings use `text-slate-900`

3. **Pattern overrides**:
   - Search for hardcoded colors: `grep -r "blue-" src/`
   - Replace with `slate-*` or `yellow-*` equivalents

## Accessibility

- **Contrast ratios**: All text meets WCAG AA
- **Focus indicators**: 2px ring on all interactive elements
- **Touch targets**: Minimum 44px for mobile

## Dark Mode (Future)

The slate/yellow palette is dark-mode ready:
- Light mode: White backgrounds + slate text
- Dark mode: Slate 900 backgrounds + white text
- Yellow accent works in both modes
