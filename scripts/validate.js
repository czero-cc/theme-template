#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

// Color pattern for validation
const colorPattern = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgba?\\([^)]+\\)|^linear-gradient|^transparent$";

// Base color schema used in variants
const colorSchema = {
  type: 'object',
  required: ['brand', 'semantic', 'background', 'text', 'border'],
  properties: {
    brand: {
      type: 'object',
      required: ['primary', 'secondary', 'tertiary', 'accent'],
      properties: {
        primary: { type: 'string', pattern: colorPattern },
        secondary: { type: 'string', pattern: colorPattern },
        tertiary: { type: 'string', pattern: colorPattern },
        accent: { type: 'string', pattern: colorPattern },
        dark: { type: 'string', pattern: colorPattern },
        light: { type: 'string', pattern: colorPattern }
      }
    },
    semantic: {
      type: 'object',
      required: ['success', 'warning', 'error', 'info'],
      properties: {
        success: { type: 'string', pattern: colorPattern },
        warning: { type: 'string', pattern: colorPattern },
        error: { type: 'string', pattern: colorPattern },
        info: { type: 'string', pattern: colorPattern }
      }
    },
    background: {
      type: 'object',
      required: ['primary', 'secondary', 'tertiary', 'elevated', 'overlay'],
      properties: {
        primary: { type: 'string', pattern: colorPattern },
        secondary: { type: 'string', pattern: colorPattern },
        tertiary: { type: 'string', pattern: colorPattern },
        elevated: { type: 'string', pattern: colorPattern },
        overlay: { type: 'string', pattern: colorPattern },
        blur: { type: 'string', pattern: colorPattern },
        muted: { type: 'string', pattern: colorPattern }
      }
    },
    text: {
      type: 'object',
      required: ['primary', 'secondary', 'tertiary', 'disabled', 'inverse'],
      properties: {
        primary: { type: 'string', pattern: colorPattern },
        secondary: { type: 'string', pattern: colorPattern },
        tertiary: { type: 'string', pattern: colorPattern },
        disabled: { type: 'string', pattern: colorPattern },
        inverse: { type: 'string', pattern: colorPattern },
        accent: { type: 'string', pattern: colorPattern },
        muted: { type: 'string', pattern: colorPattern },
        link: { type: 'string', pattern: colorPattern },
        linkHover: { type: 'string', pattern: colorPattern }
      }
    },
    border: {
      type: 'object',
      required: ['default', 'hover', 'focus', 'subtle'],
      properties: {
        default: { type: 'string', pattern: colorPattern },
        hover: { type: 'string', pattern: colorPattern },
        focus: { type: 'string', pattern: colorPattern },
        subtle: { type: 'string', pattern: colorPattern },
        muted: { type: 'string', pattern: colorPattern }
      }
    },
    button: {
      type: 'object',
      properties: {
        primary: {
          type: 'object',
          properties: {
            background: { type: 'string', pattern: colorPattern },
            text: { type: 'string', pattern: colorPattern },
            hover: { type: 'string', pattern: colorPattern },
            active: { type: 'string', pattern: colorPattern }
          }
        },
        secondary: {
          type: 'object',
          properties: {
            background: { type: 'string', pattern: colorPattern },
            text: { type: 'string', pattern: colorPattern },
            border: { type: 'string', pattern: colorPattern },
            hover: { type: 'string', pattern: colorPattern },
            active: { type: 'string', pattern: colorPattern }
          }
        },
        ghost: {
          type: 'object',
          properties: {
            background: { type: 'string', pattern: colorPattern },
            text: { type: 'string', pattern: colorPattern },
            hover: { type: 'string', pattern: colorPattern },
            active: { type: 'string', pattern: colorPattern }
          }
        }
      }
    },
    input: {
      type: 'object',
      properties: {
        background: { type: 'string', pattern: colorPattern },
        border: { type: 'string', pattern: colorPattern },
        borderHover: { type: 'string', pattern: colorPattern },
        borderFocus: { type: 'string', pattern: colorPattern },
        text: { type: 'string', pattern: colorPattern },
        placeholder: { type: 'string', pattern: colorPattern }
      }
    },
    card: {
      type: 'object',
      properties: {
        background: { type: 'string', pattern: colorPattern },
        border: { type: 'string', pattern: colorPattern },
        hover: {
          type: 'object',
          properties: {
            background: { type: 'string', pattern: colorPattern },
            border: { type: 'string', pattern: colorPattern }
          }
        }
      }
    }
  }
};

// Variant schema (what each light/dark mode contains)
const variantSchema = {
  type: 'object',
  required: ['colors'],
  properties: {
    colors: colorSchema,
    typography: { type: 'object' },
    spacing: { type: 'object' },
    borderRadius: { type: 'object' },
    shadows: { type: 'object' },
    animations: { type: 'object' },
    effects: { type: 'object' }
  }
};

// Theme v2.0 JSON Schema - STRICT, no v1.0 support
// Themes must have BOTH top-level properties (for engine compatibility) AND variants (for v2.0 compliance)
const themeSchemaV2 = {
  type: 'object',
  required: ['name', 'version', 'colors', 'typography', 'spacing', 'shadows', 'animations', 'borderRadius', 'variants'],
  properties: {
    name: { 
      type: 'string', 
      pattern: '^[a-z0-9-]+$',
      description: 'Theme identifier (lowercase, hyphens only)'
    },
    displayName: { 
      type: 'string',
      description: 'Human-readable theme name'
    },
    version: { 
      type: 'string', 
      pattern: '^2\\.\\d+\\.\\d+$',
      description: 'Must be 2.0.0 or higher'
    },
    description: { type: 'string' },
    author: { type: 'string' },
    colors: colorSchema,
    typography: { type: 'object' },
    spacing: { type: 'object' },
    shadows: { type: 'object' },
    animations: { type: 'object' },
    borderRadius: { type: 'object' },
    effects: { type: 'object' },
    loadingAnimation: { 
      type: 'string',
      enum: ['pulse', 'spinner', 'dots', 'fractal', 'glitch', 'wave'],
      description: 'Loading animation type'
    },
    variants: {
      type: 'object',
      required: ['light', 'dark'],
      properties: {
        light: variantSchema,
        dark: variantSchema
      },
      additionalProperties: false
    }
  }
};

// Validate a theme file
function validateTheme(themePath) {
  console.log(`\nValidating: ${themePath}`);
  
  try {
    // Read theme file
    const themeContent = fs.readFileSync(themePath, 'utf8');
    const theme = JSON.parse(themeContent);
    
    // Check version first
    if (!theme.version || !theme.version.startsWith('2.')) {
      console.log('✗ Theme must be version 2.0.0 or higher');
      console.log('  Current version:', theme.version || 'not specified');
      console.log('  Please update your theme to v2.0 format with light/dark variants');
      return false;
    }
    
    // Validate against v2.0 schema
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(themeSchemaV2);
    const valid = validate(theme);
    
    if (valid) {
      console.log('✓ Theme is valid (v2.0 format)');
      
      // Display theme info
      console.log(`  Name: ${theme.name}`);
      console.log(`  Display Name: ${theme.displayName || theme.name}`);
      console.log(`  Version: ${theme.version}`);
      console.log(`  Author: ${theme.author || 'Not specified'}`);
      console.log(`  Description: ${theme.description || 'Not specified'}`);
      
      // Validate both variants have required properties
      console.log('  Variants:');
      console.log('    ✓ Light mode configured');
      console.log('    ✓ Dark mode configured');
      
      // Check for advanced features
      const features = [];
      if (theme.variants.light.effects || theme.variants.dark.effects) {
        features.push('effects');
      }
      if (theme.variants.light.typography?.fontFamily) {
        features.push('custom typography');
      }
      if (theme.variants.light.shadows) {
        features.push('custom shadows');
      }
      
      if (features.length > 0) {
        console.log(`  Features: ${features.join(', ')}`);
      }
      
      return true;
    } else {
      console.log('✗ Theme validation failed:');
      validate.errors.forEach(error => {
        const path = error.instancePath || '/';
        console.log(`  - ${path}: ${error.message}`);
        if (error.params) {
          if (error.params.missingProperty) {
            console.log(`    Missing required property: ${error.params.missingProperty}`);
          }
          if (error.params.additionalProperty) {
            console.log(`    Unknown property: ${error.params.additionalProperty}`);
          }
        }
      });
      
      // Helpful migration message
      if (!theme.variants) {
        console.log('\n  💡 Migration tip: Your theme needs to be updated to v2.0 format.');
        console.log('     Use "npm run create" to generate a new v2.0 theme,');
        console.log('     or manually add "variants" with light and dark modes.');
      }
      
      return false;
    }
  } catch (error) {
    console.log(`✗ Error reading/parsing theme: ${error.message}`);
    return false;
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  let themePaths = [];
  
  if (args.length === 0) {
    // Validate theme.json in root
    if (fs.existsSync('theme.json')) {
      themePaths.push('theme.json');
    }
    
    // Validate all themes in themes directory
    const themesDir = 'themes';
    if (fs.existsSync(themesDir)) {
      const themes = fs.readdirSync(themesDir);
      themes.forEach(theme => {
        const themePath = path.join(themesDir, theme, 'theme.json');
        if (fs.existsSync(themePath)) {
          themePaths.push(themePath);
        }
      });
    }
  } else {
    themePaths = args;
  }
  
  if (themePaths.length === 0) {
    console.log('No theme files found to validate');
    console.log('\nUsage:');
    console.log('  npm run validate           # Validate theme.json and all themes in themes/');
    console.log('  npm run validate <file>    # Validate specific theme file');
    process.exit(1);
  }
  
  console.log('CZero Theme Validator v2.0');
  console.log('===========================');
  console.log('Strict v2.0 format validation (no v1.0 support)');
  
  let allValid = true;
  themePaths.forEach(themePath => {
    const valid = validateTheme(themePath);
    if (!valid) allValid = false;
  });
  
  console.log('\n' + '===========================');
  if (allValid) {
    console.log('✅ All themes are valid v2.0 format!');
    process.exit(0);
  } else {
    console.log('❌ Some themes have validation errors');
    console.log('   Please update to v2.0 format with variants');
    process.exit(1);
  }
}

main();