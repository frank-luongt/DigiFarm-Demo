/**
 * DigiFarm Design System - IBM Carbon Inspired
 *
 * Based on IBM Carbon Design System principles:
 * - Precision, clarity, and functional beauty
 * - Data-driven design with emphasis on productivity
 * - Consistent spacing and type scales
 * - Layered UI with elevation and depth
 */

import { Platform } from 'react-native';

export const Colors = {
  // IBM Carbon Gray Scale (adapted for agriculture)
  gray100: '#161616',    // Primary background (dark theme)
  gray90: '#262626',     // Secondary background
  gray80: '#393939',     // Tertiary background
  gray70: '#525252',     // Disabled text
  gray60: '#6F6F6F',     // Secondary text
  gray50: '#8D8D8D',     // Placeholder text
  gray40: '#A8A8A8',     // Subtle borders
  gray30: '#C6C6C6',     // Borders
  gray20: '#E0E0E0',     // Dividers
  gray10: '#F4F4F4',     // Light backgrounds
  white: '#FFFFFF',      // Primary surface

  // Agricultural Theme Colors (Carbon-inspired)
  green10: '#DEFBE6',    // Light green background
  green20: '#A7F0BA',    // Subtle green
  green30: '#6FDC8C',    // Medium green
  green40: '#42BE65',    // Primary green (productive)
  green50: '#24A148',    // Dark green
  green60: '#198038',    // Darker green
  green70: '#0E6027',    // Forest green

  // Support Colors
  blue40: '#4589FF',     // Interactive blue
  blue50: '#0F62FE',     // Primary blue
  blue60: '#0043CE',     // Dark blue

  yellow30: '#F1C21B',   // Warning/Harvest
  yellow40: '#D2A106',   // Gold accent

  orange40: '#FF832B',   // Alert
  red50: '#DA1E28',      // Error/Danger
  red60: '#A2191F',      // Dark red

  purple40: '#BE95FF',   // Feature highlight
  teal40: '#08BDBA',     // Secondary action

  // Semantic Colors
  interactive: '#0F62FE',
  focus: '#0F62FE',
  inverse: '#FFFFFF',
  hover: '#E5E5E5',
  selected: '#E0E0E0',
  disabled: '#C6C6C6',

  // UI Backgrounds
  ui01: '#FFFFFF',       // Primary background
  ui02: '#F4F4F4',       // Secondary background
  ui03: '#E0E0E0',       // Tertiary background
  ui04: '#8D8D8D',       // Border strong
  ui05: '#161616',       // Inverse background

  // Text
  text01: '#161616',     // Primary text
  text02: '#525252',     // Secondary text
  text03: '#8D8D8D',     // Placeholder text
  text04: '#FFFFFF',     // Inverse text
  textError: '#DA1E28',

  // Links
  link01: '#0F62FE',
  link02: '#0043CE',

  // Icons
  icon01: '#161616',
  icon02: '#525252',
  icon03: '#FFFFFF',

  // Field colors
  field01: '#FFFFFF',
  field02: '#F4F4F4',
  fieldHover: '#E5E5E5',

  // Agricultural context colors
  soil: '#6F6F6F',
  growth: '#42BE65',
  harvest: '#F1C21B',
  water: '#4589FF',
  alert: '#DA1E28',
};

export const Typography = {
  // IBM Plex Font Stack
  fontFamily: {
    sans: Platform.OS === 'ios' ? 'System' : 'Roboto',
    mono: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    // In production, use IBM Plex Sans and IBM Plex Mono
  },

  // Type Scale (Carbon Design)
  fontSize: {
    caption01: 12,      // Legal, helper text
    label01: 12,        // Labels, small tags
    helperText01: 12,   // Helper text
    bodyShort01: 14,    // Short body text
    bodyLong01: 14,     // Long body text
    bodyShort02: 16,    // Primary body
    bodyLong02: 16,     // Primary long body
    code01: 12,         // Inline code
    code02: 14,         // Code snippets
    heading01: 14,      // Δ heading
    productiveHeading01: 14,
    heading02: 16,      // Ε heading
    productiveHeading02: 16,
    productiveHeading03: 20,  // Γ heading
    productiveHeading04: 28,  // Β heading
    productiveHeading05: 32,  // Α heading
    productiveHeading06: 42,  // Hero heading
    productiveHeading07: 54,  // Display heading
    expressiveHeading01: 14,
    expressiveHeading02: 16,
    expressiveHeading03: 20,
    expressiveHeading04: 32,
    expressiveHeading05: 48,
    expressiveHeading06: 60,
    quotation01: 20,
    quotation02: 32,
    display01: 42,
    display02: 48,
    display03: 54,
    display04: 60,
  },

  // Font Weights
  fontWeight: {
    light: '300',
    regular: '400',
    semibold: '600',
  },

  // Line Heights
  lineHeight: {
    tight: 1.125,    // 18/16
    normal: 1.375,   // 22/16
    loose: 1.5,      // 24/16
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.32,
    normal: 0,
    wide: 0.16,
  },
};

export const Spacing = {
  // IBM Carbon Spacing Scale (2px base)
  spacing01: 2,
  spacing02: 4,
  spacing03: 8,
  spacing04: 12,
  spacing05: 16,
  spacing06: 24,
  spacing07: 32,
  spacing08: 40,
  spacing09: 48,
  spacing10: 64,
  spacing11: 80,
  spacing12: 96,
  spacing13: 160,

  // Layout spacing
  layoutXs: 16,
  layoutSm: 24,
  layoutMd: 32,
  layoutLg: 48,
  layoutXl: 64,
  layout2xl: 96,
};

export const Layout = {
  // Container Max Widths
  maxWidthSm: 672,
  maxWidthMd: 1056,
  maxWidthLg: 1312,
  maxWidthXl: 1584,

  // Columns
  columns: {
    sm: 4,
    md: 8,
    lg: 16,
  },

  // Gutters
  gutter: 16,
  gutterCondensed: 1,
};

export const BorderRadius = {
  none: 0,
  sm: 2,
  default: 4,
  lg: 8,
};

export const Elevation = {
  // IBM Carbon uses subtle shadows
  shadow01: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  shadow02: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  shadow03: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
};

export const Motion = {
  // IBM Carbon Motion Durations
  duration: {
    fast01: 70,
    fast02: 110,
    moderate01: 150,
    moderate02: 240,
    slow01: 400,
    slow02: 700,
  },

  // Easing
  easing: {
    standard: {
      productive: 'cubic-bezier(0.2, 0, 0.38, 0.9)',
      expressive: 'cubic-bezier(0.4, 0.14, 0.3, 1)',
    },
    entrance: {
      productive: 'cubic-bezier(0, 0, 0.38, 0.9)',
      expressive: 'cubic-bezier(0, 0, 0.3, 1)',
    },
    exit: {
      productive: 'cubic-bezier(0.2, 0, 1, 0.9)',
      expressive: 'cubic-bezier(0.4, 0.14, 1, 1)',
    },
  },
};

export const IconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

// Component-specific tokens
export const Components = {
  button: {
    height: {
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
    },
    paddingX: {
      sm: Spacing.spacing05,
      md: Spacing.spacing05,
      lg: Spacing.spacing05,
      xl: Spacing.spacing05,
    },
  },
  input: {
    height: {
      sm: 32,
      md: 40,
      lg: 48,
    },
    paddingX: Spacing.spacing05,
  },
  card: {
    padding: Spacing.spacing05,
    gap: Spacing.spacing05,
  },
  tag: {
    height: 24,
    paddingX: Spacing.spacing03,
  },
};

export default {
  Colors,
  Typography,
  Spacing,
  Layout,
  BorderRadius,
  Elevation,
  Motion,
  IconSize,
  Components,
};
