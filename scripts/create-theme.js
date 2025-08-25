#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Color presets for easy selection
const COLOR_PRESETS = {
  'Cyberpunk': {
    primary: '#00d4ff',
    secondary: '#ff00ff',
    tertiary: '#00ff88',
    accent: '#ffd700'
  },
  'Ocean': {
    primary: '#0891b2',
    secondary: '#06b6d4',
    tertiary: '#22d3ee',
    accent: '#67e8f9'
  },
  'Forest': {
    primary: '#10b981',
    secondary: '#34d399',
    tertiary: '#6ee7b7',
    accent: '#a7f3d0'
  },
  'Sunset': {
    primary: '#f97316',
    secondary: '#fb923c',
    tertiary: '#fdba74',
    accent: '#fed7aa'
  },
  'Purple Dream': {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    tertiary: '#c4b5fd',
    accent: '#ddd6fe'
  },
  'Monochrome': {
    primary: '#64748b',
    secondary: '#94a3b8',
    tertiary: '#cbd5e1',
    accent: '#e2e8f0'
  },
  'Rose Gold': {
    primary: '#f43f5e',
    secondary: '#fb7185',
    tertiary: '#fda4af',
    accent: '#fecdd3'
  },
  'Custom': null
};

const THEME_STYLES = {
  'Modern': 'Clean and minimalist with subtle shadows',
  'Neon': 'Vibrant with glowing effects',
  'Glass': 'Transparent with blur effects',
  'Flat': 'No shadows, solid colors',
  'Gradient': 'Rich gradients and transitions'
};

class ThemeBuilder {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.theme = {
      name: '',
      displayName: '',
      version: '2.0.0',
      description: '',
      author: '',
      loadingAnimation: 'pulse',
      variants: {
        light: null,
        dark: null
      }
    };
  }

  async prompt(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async promptWithOptions(question, options) {
    console.log('\n' + question);
    options.forEach((opt, i) => {
      console.log(`  ${i + 1}. ${opt}`);
    });
    
    while (true) {
      const answer = await this.prompt('\nSelect an option (number): ');
      const index = parseInt(answer) - 1;
      if (index >= 0 && index < options.length) {
        return options[index];
      }
      console.log('Invalid selection. Please try again.');
    }
  }

  async promptColor(colorName) {
    console.log(`\nEnter ${colorName} color (hex format like #00d4ff)`);
    console.log('Press Enter to use suggested color');
    
    while (true) {
      const answer = await this.prompt('Color: ');
      if (!answer) return null; // Use suggested
      if (/^#[0-9A-Fa-f]{6}$/.test(answer)) {
        return answer;
      }
      console.log('Invalid hex color. Please use format: #RRGGBB');
    }
  }

  generateLightVariant(colors, style) {
    const variant = {
      colors: {
        brand: {
          primary: colors.primary,
          secondary: colors.secondary,
          tertiary: colors.tertiary,
          accent: colors.accent,
          dark: this.darken(colors.primary, 0.3),
          light: this.lighten(colors.primary, 0.3)
        },
        semantic: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6'
        },
        background: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
          elevated: '#ffffff',
          overlay: 'rgba(0, 0, 0, 0.5)',
          blur: 'rgba(255, 255, 255, 0.85)',
          muted: '#f8fafc'
        },
        text: {
          primary: '#0f172a',
          secondary: '#475569',
          tertiary: '#64748b',
          disabled: '#94a3b8',
          inverse: '#ffffff',
          accent: colors.primary,
          muted: '#94a3b8',
          link: colors.secondary,
          linkHover: this.lighten(colors.secondary, 0.2)
        },
        border: {
          default: 'rgba(0, 0, 0, 0.1)',
          hover: 'rgba(0, 0, 0, 0.2)',
          focus: colors.primary,
          subtle: 'rgba(0, 0, 0, 0.05)',
          muted: 'rgba(0, 0, 0, 0.03)'
        },
        button: {
          primary: {
            background: colors.primary,
            text: '#ffffff',
            hover: colors.secondary,
            active: colors.tertiary
          },
          secondary: {
            background: 'transparent',
            text: colors.primary,
            border: colors.primary,
            hover: this.hexToRgba(colors.primary, 0.1),
            active: this.hexToRgba(colors.primary, 0.2)
          },
          ghost: {
            background: 'transparent',
            text: '#0f172a',
            hover: 'rgba(15, 23, 42, 0.1)',
            active: 'rgba(15, 23, 42, 0.2)'
          }
        },
        input: {
          background: 'rgba(248, 250, 252, 0.8)',
          border: 'rgba(0, 0, 0, 0.1)',
          borderHover: 'rgba(0, 0, 0, 0.2)',
          borderFocus: colors.primary,
          text: '#0f172a',
          placeholder: '#64748b'
        },
        card: {
          background: '#f8fafc',
          border: 'rgba(0, 0, 0, 0.05)',
          hover: {
            background: '#f1f5f9',
            border: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      shadows: this.generateShadows('light', style),
      typography: this.generateTypography(style),
      spacing: this.generateSpacing(),
      borderRadius: this.generateBorderRadius(style),
      animations: this.generateAnimations()
    };

    // Add style-specific effects
    if (style === 'Neon' || style === 'Glass') {
      variant.effects = this.generateEffects(colors, 'light', style);
    }

    return variant;
  }

  generateDarkVariant(colors, style) {
    const variant = {
      colors: {
        brand: {
          primary: colors.primary,
          secondary: colors.secondary,
          tertiary: colors.tertiary,
          accent: colors.accent,
          dark: this.darken(colors.primary, 0.3),
          light: this.lighten(colors.primary, 0.3)
        },
        semantic: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6'
        },
        background: {
          primary: '#0a0e27',
          secondary: '#0f1428',
          tertiary: '#141b3c',
          elevated: '#1a2240',
          overlay: 'rgba(0, 0, 0, 0.8)',
          blur: 'rgba(10, 14, 39, 0.85)',
          muted: '#0d1220'
        },
        text: {
          primary: '#ffffff',
          secondary: '#94a3b8',
          tertiary: '#64748b',
          disabled: '#475569',
          inverse: '#0f172a',
          accent: colors.primary,
          muted: '#52606d',
          link: colors.secondary,
          linkHover: this.lighten(colors.secondary, 0.2)
        },
        border: {
          default: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.2)',
          focus: colors.primary,
          subtle: 'rgba(255, 255, 255, 0.05)',
          muted: 'rgba(255, 255, 255, 0.03)'
        },
        button: {
          primary: {
            background: colors.primary,
            text: '#ffffff',
            hover: colors.secondary,
            active: colors.tertiary
          },
          secondary: {
            background: 'transparent',
            text: colors.primary,
            border: colors.primary,
            hover: this.hexToRgba(colors.primary, 0.2),
            active: this.hexToRgba(colors.primary, 0.3)
          },
          ghost: {
            background: 'transparent',
            text: '#ffffff',
            hover: 'rgba(255, 255, 255, 0.1)',
            active: 'rgba(255, 255, 255, 0.2)'
          }
        },
        input: {
          background: 'rgba(10, 14, 39, 0.8)',
          border: 'rgba(255, 255, 255, 0.1)',
          borderHover: 'rgba(255, 255, 255, 0.2)',
          borderFocus: colors.primary,
          text: '#ffffff',
          placeholder: '#52606d'
        },
        card: {
          background: '#0d1220',
          border: 'rgba(255, 255, 255, 0.05)',
          hover: {
            background: '#141b3c',
            border: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      shadows: this.generateShadows('dark', style),
      typography: this.generateTypography(style),
      spacing: this.generateSpacing(),
      borderRadius: this.generateBorderRadius(style),
      animations: this.generateAnimations()
    };

    // Add style-specific effects
    if (style === 'Neon' || style === 'Glass') {
      variant.effects = this.generateEffects(colors, 'dark', style);
    }

    return variant;
  }

  generateShadows(mode, style) {
    if (style === 'Flat') {
      return {
        xs: 'none',
        sm: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        inner: 'none',
        glow: 'none',
        none: 'none'
      };
    }

    const opacity = mode === 'light' ? 0.1 : 0.3;
    const glowOpacity = style === 'Neon' ? 0.5 : 0.3;

    return {
      xs: `0 1px 2px rgba(0, 0, 0, ${opacity * 0.5})`,
      sm: `0 2px 4px rgba(0, 0, 0, ${opacity})`,
      md: `0 4px 8px rgba(0, 0, 0, ${opacity * 1.5})`,
      lg: `0 8px 16px rgba(0, 0, 0, ${opacity * 2})`,
      xl: `0 12px 24px rgba(0, 0, 0, ${opacity * 2.5})`,
      '2xl': `0 16px 32px rgba(0, 0, 0, ${opacity * 3})`,
      inner: `inset 0 2px 4px rgba(0, 0, 0, ${opacity})`,
      glow: style === 'Neon' ? `0 0 20px rgba(0, 212, 255, ${glowOpacity})` : 'none',
      none: 'none'
    };
  }

  generateEffects(colors, mode, style) {
    const effects = {};

    if (style === 'Glass') {
      effects.glass = {
        background: mode === 'light' 
          ? 'rgba(255, 255, 255, 0.7)'
          : 'rgba(255, 255, 255, 0.1)',
        backdrop: 'blur(10px) saturate(180%)',
        border: mode === 'light'
          ? '1px solid rgba(0, 0, 0, 0.1)'
          : '1px solid rgba(255, 255, 255, 0.2)'
      };
    }

    if (style === 'Neon') {
      effects.glow = {
        primary: `0 0 20px ${this.hexToRgba(colors.primary, 0.5)}`,
        secondary: `0 0 20px ${this.hexToRgba(colors.secondary, 0.5)}`,
        error: '0 0 20px rgba(239, 68, 68, 0.5)',
        success: '0 0 20px rgba(16, 185, 129, 0.5)'
      };
      
      effects.neon = {
        text: '0 0 10px currentColor, 0 0 20px currentColor',
        box: `0 0 30px ${this.hexToRgba(colors.primary, 0.3)}, inset 0 0 30px ${this.hexToRgba(colors.primary, 0.1)}`
      };
    }

    if (style === 'Gradient') {
      effects.gradient = {
        brand: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        accent: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
        vibrant: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.tertiary}, ${colors.accent})`
      };
    }

    return Object.keys(effects).length > 0 ? effects : undefined;
  }

  generateTypography(style) {
    const fonts = {
      'Modern': {
        heading: "'Inter', 'Segoe UI', system-ui, sans-serif",
        body: "'Inter', 'Segoe UI', system-ui, sans-serif",
        mono: "'JetBrains Mono', 'Cascadia Code', monospace",
        display: "'Inter', 'Segoe UI', sans-serif"
      },
      'Neon': {
        heading: "'Orbitron', 'Segoe UI', system-ui, sans-serif",
        body: "'Inter', 'Segoe UI', system-ui, sans-serif",
        mono: "'JetBrains Mono', 'Cascadia Code', monospace",
        display: "'Michroma', 'Orbitron', sans-serif"
      },
      'Glass': {
        heading: "'Poppins', 'Segoe UI', system-ui, sans-serif",
        body: "'Inter', 'Segoe UI', system-ui, sans-serif",
        mono: "'Fira Code', 'Cascadia Code', monospace",
        display: "'Poppins', 'Segoe UI', sans-serif"
      },
      'Flat': {
        heading: "'Roboto', 'Segoe UI', system-ui, sans-serif",
        body: "'Roboto', 'Segoe UI', system-ui, sans-serif",
        mono: "'Roboto Mono', monospace",
        display: "'Roboto', 'Segoe UI', sans-serif"
      },
      'Gradient': {
        heading: "'Montserrat', 'Segoe UI', system-ui, sans-serif",
        body: "'Open Sans', 'Segoe UI', system-ui, sans-serif",
        mono: "'Source Code Pro', monospace",
        display: "'Montserrat', 'Segoe UI', sans-serif"
      }
    };

    return {
      fontFamily: fonts[style] || fonts['Modern'],
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2
      }
    };
  }

  generateSpacing() {
    return {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem'
    };
  }

  generateBorderRadius(style) {
    if (style === 'Flat') {
      return {
        none: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        full: '0'
      };
    }

    if (style === 'Glass' || style === 'Modern') {
      return {
        none: '0',
        sm: '0.375rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px'
      };
    }

    return {
      none: '0',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1.5rem',
      full: '9999px'
    };
  }

  generateAnimations() {
    return {
      duration: {
        instant: '0ms',
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        slower: '700ms'
      },
      easing: {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    };
  }

  // Helper functions
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  darken(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
    const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(255 * amount));
    const b = Math.max(0, (num & 0x0000FF) - Math.round(255 * amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  lighten(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
    const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * amount));
    const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  async run() {
    console.log('\n🎨 Welcome to CZero Theme Builder!\n');
    console.log('This interactive tool will help you create a beautiful custom theme.\n');

    // Basic information
    console.log('📝 Let\'s start with basic information:\n');
    
    this.theme.displayName = await this.prompt('Theme display name (e.g., "My Awesome Theme"): ');
    this.theme.name = this.theme.displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    this.theme.description = await this.prompt('Brief description: ');
    this.theme.author = await this.prompt('Your name or organization: ');

    // Color preset selection
    console.log('\n🎨 Choose a color preset or create custom colors:\n');
    const presetNames = Object.keys(COLOR_PRESETS);
    const selectedPreset = await this.promptWithOptions('Select a color preset:', presetNames);

    let colors;
    if (selectedPreset === 'Custom') {
      console.log('\n🎨 Create your custom color palette:');
      console.log('(Tip: Use online color pickers or tools like coolors.co)\n');
      
      colors = {
        primary: await this.promptColor('primary (main brand)') || '#00d4ff',
        secondary: await this.promptColor('secondary accent') || '#ff00ff',
        tertiary: await this.promptColor('tertiary accent') || '#00ff88',
        accent: await this.promptColor('highlight accent') || '#ffd700'
      };
      
      console.log('\n✅ Custom colors selected!');
    } else {
      colors = COLOR_PRESETS[selectedPreset];
      console.log(`\n✅ ${selectedPreset} color preset selected!`);
    }

    // Style selection
    console.log('\n✨ Choose a visual style:\n');
    const styleNames = Object.keys(THEME_STYLES);
    styleNames.forEach(style => {
      console.log(`  • ${style}: ${THEME_STYLES[style]}`);
    });
    
    const selectedStyle = await this.promptWithOptions('\nSelect a style:', styleNames);
    console.log(`\n✅ ${selectedStyle} style selected!`);

    // Loading animation selection
    console.log('\n⚡ Choose a loading animation:\n');
    const loadingAnimations = ['pulse', 'spinner', 'dots', 'fractal', 'glitch', 'wave'];
    const selectedAnimation = await this.promptWithOptions('Select a loading animation:', loadingAnimations);
    this.theme.loadingAnimation = selectedAnimation;
    console.log(`\n✅ ${selectedAnimation} animation selected!`);

    // Generate theme variants
    console.log('\n🔨 Generating theme variants...\n');
    
    this.theme.variants.light = this.generateLightVariant(colors, selectedStyle);
    this.theme.variants.dark = this.generateDarkVariant(colors, selectedStyle);

    // CRITICAL: Add top-level properties that the engine actually uses (defaults to dark variant)
    console.log('🔧 Adding top-level properties for engine compatibility...\n');
    this.theme.colors = this.theme.variants.dark.colors;
    this.theme.typography = this.theme.variants.dark.typography;
    this.theme.spacing = this.theme.variants.dark.spacing;
    this.theme.shadows = this.theme.variants.dark.shadows;
    this.theme.animations = this.theme.variants.dark.animations;
    this.theme.borderRadius = this.theme.variants.dark.borderRadius;
    if (this.theme.variants.dark.effects) {
      this.theme.effects = this.theme.variants.dark.effects;
    }

    // Save theme
    const outputPath = path.join(process.cwd(), 'theme.json');
    fs.writeFileSync(outputPath, JSON.stringify(this.theme, null, 2));

    // Show summary
    console.log('✨ Theme created successfully!\n');
    console.log('📊 Theme Summary:');
    console.log(`  • Name: ${this.theme.displayName}`);
    console.log(`  • Style: ${selectedStyle}`);
    console.log(`  • Colors:`);
    console.log(`    - Primary: ${colors.primary}`);
    console.log(`    - Secondary: ${colors.secondary}`);
    console.log(`    - Tertiary: ${colors.tertiary}`);
    console.log(`    - Accent: ${colors.accent}`);
    console.log(`  • File: ${outputPath}\n`);

    console.log('📦 Next steps:');
    console.log('  1. Run "npm run validate" to validate your theme');
    console.log('  2. Import theme.json into CZero Overlay');
    console.log('  3. Test in both light and dark modes');
    console.log('  4. Share with the community!\n');

    this.rl.close();
  }
}

// Run the builder
const builder = new ThemeBuilder();
builder.run().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});