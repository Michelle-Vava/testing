/**
 * Shanda Brand Theme Tokens
 * Single source of truth for all colors, spacing, and design tokens.
 * DO NOT use arbitrary colors outside this system.
 */

export const theme = {
  // Brand Colors
  brand: {
    primary: '#F5B700',      // Yellow - CTAs, highlights, active states
    primaryDark: '#0F172A',  // Navy - Headers, sidebar, dark surfaces
    primaryLight: '#FEF3C7', // Light yellow - Subtle highlights
  },

  // Surface Colors
  surface: {
    base: '#FFFFFF',         // Main content background
    elevated: '#F8FAFC',     // Cards, elevated surfaces
    muted: '#F1F5F9',        // Disabled states, subtle backgrounds
  },

  // Text Colors
  text: {
    primary: '#0F172A',      // Main text (dark)
    secondary: '#64748B',    // Secondary text
    muted: '#94A3B8',        // Disabled, placeholder text
    inverse: '#FFFFFF',      // Text on dark backgrounds
    inverseMuted: '#CBD5E1', // Muted text on dark backgrounds
  },

  // Border Colors
  border: {
    light: '#E2E8F0',        // Light borders
    dark: '#1E293B',         // Dark borders (on dark surfaces)
    focus: '#F5B700',        // Focus rings
  },

  // State Colors
  state: {
    success: '#10B981',      // Green - Success states
    error: '#EF4444',        // Red - Errors
    warning: '#F59E0B',      // Amber - Warnings
    info: '#3B82F6',         // Blue - Info
  },

  // App Chrome (unified header/sidebar system)
  chrome: {
    // Background - EXACT same for sidebar, top header, and landing header
    background: '#0F172A',   // slate-900 equivalent
    border: '#1E293B',       // slate-800 equivalent
    shadow: 'rgba(0, 0, 0, 0.1)',
    
    // Height system
    headerHeight: '4rem',    // 64px - h-16
    
    // Text on chrome
    text: '#FFFFFF',
    textMuted: '#CBD5E1',    // slate-300
    textDim: '#94A3B8',      // slate-400
    
    // Dividers/separators on chrome
    divider: '#334155',      // slate-700
    
    // Interactive states on chrome
    hoverBg: '#1E293B',      // slate-800
    activeBg: '#F5B700',     // Yellow
    activeText: '#0F172A',   // Dark text on yellow
    
    // Branding on chrome
    logoIconBg: '#F5B700',
    logoIconText: '#0F172A',
    logoText: '#FFFFFF',
  },

  // Semantic Mapping (DEPRECATED - use chrome.* instead)
  semantic: {
    // Navigation (use chrome.*)
    navBackground: '#0F172A',
    navText: '#CBD5E1',
    navTextHover: '#FFFFFF',
    navTextActive: '#0F172A',
    navBackgroundActive: '#F5B700',

    // Header (use chrome.*)
    headerBackground: '#0F172A',
    headerBorder: '#1E293B',
    headerText: '#FFFFFF',
    headerTextMuted: '#CBD5E1',

    // Actions
    ctaPrimary: '#F5B700',
    ctaPrimaryText: '#0F172A',
    ctaSecondary: '#F1F5F9',
    ctaSecondaryText: '#0F172A',
  },
} as const;

export type Theme = typeof theme;
