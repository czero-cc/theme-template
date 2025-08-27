# CZero Engine Theme Template

Create custom themes for CZero Engine desktop App with light/dark mode support, and ofcourse, comes with its own CLI.


## 🚀 Quick Start

### Option 1: Interactive Theme Builder (Recommended)

```bash
# 1. Fork/Clone this repository
git clone https://github.com/yourusername/theme-template.git my-theme
cd my-theme

# 2. Install dependencies
npm install

# 3. Run the interactive theme builder
npm run create

# 4. Validate your theme
npm run validate

# 5. Install into CZero (Permanent!)
# Open CZero Engine → Settings → General → "Import Theme"
# Select your theme.json file - it's permanently installed!
```

### Option 2: Manual Creation

```bash
# 1-2. Same as above
# 3. Edit theme.json manually
# 4-5. Same as above
```

## 📁 What's Included

```
my-theme/
├── theme.json          # Main theme (complete v2.0 structure)
├── package.json        # Package metadata  
├── README.md          # This documentation
├── scripts/           # Validation & creation tools
│   ├── validate.js    # Strict v2.0 validation
│   └── create-theme.js # Interactive theme builder
└── themes/           # 6 professional example themes
    ├── cyberpunk-neon/     # High-contrast neon theme
    ├── dark-forest/        # Nature-inspired theme  
    ├── minimal-light/      # Clean, professional theme
    ├── monochrome-modern/  # Black & white theme
    ├── ocean-depths/       # Deep blue oceanic theme
    └── retro-terminal/     # Classic terminal theme
```

## 🎯 Interactive Theme Builder Features

Run `npm run create` for guided theme creation:

**🎨 Color Presets**: Cyberpunk, Ocean, Forest, Sunset, Purple Dream, Monochrome, Rose Gold, Custom

**✨ Visual Styles**: 
- **Modern**: Clean, minimalist with subtle shadows
- **Neon**: Vibrant with glowing effects  
- **Glass**: Transparent with blur effects
- **Flat**: No shadows, solid colors
- **Gradient**: Rich gradients and transitions

**⚡ Loading Animations**: Pulse, Spinner, Dots, Fractal, Glitch, Wave

**🌓 Auto-Generation**: Creates matching light and dark variants automatically

## 🎨 Complete v2.0 Theme Structure

Your theme includes **both** top-level properties (engine compatibility) **and** variants (v2.0 compliance):

```json
{
  "name": "my-theme",
  "displayName": "My Theme", 
  "version": "2.0.0",
  "description": "Beautiful custom theme",
  "author": "Your Name",
  "loadingAnimation": "pulse",
  
  // TOP-LEVEL PROPERTIES (Engine Compatibility)
  "colors": { /* complete color system */ },
  "typography": { /* font definitions */ },
  "spacing": { /* spacing scale */ },
  "shadows": { /* shadow system */ },
  "animations": { /* timing & easing */ },
  "borderRadius": { /* corner system */ },
  "effects": { /* special effects */ },
  
  // VARIANTS (v2.0 Compliance) 
  "variants": {
    "light": { /* complete light mode */ },
    "dark": { /* complete dark mode */ }
  }
}
```

## 🌈 Complete Color System

### Brand Colors
```json
"brand": {
  "primary": "#00d4ff",    // Main brand color
  "secondary": "#ff00ff",   // Secondary accent  
  "tertiary": "#00ff88",    // Additional accent
  "accent": "#ffd700"       // Highlight color
}
```

### Component-Specific Colors (v2.0)
```json
"button": {
  "primary": { "background": "#00d4ff", "text": "#000", "hover": "#00b8e6", "active": "#009cc7" },
  "secondary": { "background": "transparent", "text": "#00d4ff", "border": "#00d4ff", "hover": "rgba(0,212,255,0.1)" },
  "ghost": { "background": "transparent", "text": "#fff", "hover": "rgba(255,255,255,0.1)" }
},
"input": {
  "background": "rgba(0,0,0,0.8)", "border": "rgba(255,255,255,0.1)", 
  "borderHover": "rgba(255,255,255,0.2)", "borderFocus": "#00d4ff",
  "text": "#fff", "placeholder": "#666"
},
"card": {
  "background": "#0d1220", "border": "rgba(255,255,255,0.05)",
  "hover": { "background": "#141b3c", "border": "rgba(255,255,255,0.1)" }
}
```

## ✨ Advanced Features

### Visual Effects
```json
"effects": {
  "glass": { "background": "rgba(255,255,255,0.1)", "backdropFilter": "blur(10px)", "border": "1px solid rgba(255,255,255,0.2)" },
  "neonText": { "color": "#00d4ff", "textShadow": "0 0 10px #00d4ff, 0 0 20px #00d4ff" },
  "holographic": { "background": "linear-gradient(135deg, #ff0080, #ff8c00, #40e0d0)", "animation": "holo 3s ease infinite" }
}
```

### Professional Shadows
```json
"shadows": {
  "xs": "0 1px 2px rgba(0,0,0,0.05)", "sm": "0 2px 4px rgba(0,0,0,0.1)",
  "md": "0 4px 8px rgba(0,0,0,0.15)", "lg": "0 8px 16px rgba(0,0,0,0.2)",
  "glow": "0 0 20px rgba(0,212,255,0.5)", "none": "none"
}
```

## 🧪 Strict v2.0 Validation

```bash
npm run validate  # Validates all themes
npm run validate theme.json  # Validates specific theme
```

**What's Validated:**
- ✅ Complete top-level structure (engine compatibility)
- ✅ Both light and dark variants (v2.0 compliance)  
- ✅ All required color properties exist
- ✅ Component-specific colors (button, input, card)
- ✅ Valid color formats (hex, rgb, rgba, gradients)
- ✅ Loading animation enums
- ✅ Complete typography, spacing, shadows

## 🔧 Installation Methods

### Method A: Import Button (Recommended)
1. Open CZero Engine → Settings → General → Appearance
2. Click **"Import Theme"** 
3. Select your `theme.json` file
4. **✅ Theme permanently installed to app directory!**

### Method B: Manual Installation (Like a Mod!)  
1. Click **"Open Themes Folder"** in Settings
2. Copy `theme.json` to the themes folder (app directory)
3. Click **"Refresh"** or restart app
4. **✅ Theme appears in selector!**

**Installation Path:**
- Windows: `%APPDATA%\czero-overlay\themes\`
- macOS: `~/Library/Application Support/czero-overlay/themes/`  

## 💡 Theme Management Features

- **🗑️ Delete Custom Themes**: Delete button on theme cards (built-ins protected)
- **🔄 Manual Refresh**: Refresh button picks up manually added themes
- **📤 Export Themes**: Export any theme as shareable JSON
- **🎨 Theme Previews**: Visual previews with color swatches
- **🌓 Mode Switching**: Automatic light/dark variant switching

## 📸 Included Professional Themes

- **Cyberpunk Neon**: High-contrast neon with vibrant magenta/cyan colors
- **Dark Forest**: Nature-inspired with earthy greens and natural browns  
- **Minimal Light**: Clean, professional with subtle accents
- **Monochrome Modern**: Ultra-modern black/white with sharp contrasts
- **Ocean Depths**: Deep oceanic blues with bioluminescent gradients
- **Retro Terminal**: Classic green phosphor terminal with VT323 font

## 🛠️ Advanced Tips

1. **Use the Interactive Builder** - It generates perfect v2.0 structure
2. **Test Both Modes** - Always test light and dark variants thoroughly  
3. **Follow Accessibility** - Ensure WCAG AA compliance (4.5:1 contrast)
4. **Validate Before Sharing** - Use `npm run validate` to ensure quality
5. **Component Colors Matter** - Don't skip button/input/card color definitions
6. **Effects in Moderation** - Enhance, don't distract


## 🤝 Contributing & Sharing

1. Create your theme using this template
2. Test thoroughly in CZero Overlay
3. Take screenshots in both light/dark modes
4. Share JSON files with the community
5. Contribute to the [theme repository](https://github.com/czero-cc/theme-template)

## 📚 Resources

- [Discord Community](https://discord.gg/yjEUkUTEak)
- [GitHub Issues](https://github.com/czero-cc/theme-template/issues)
- [Example Themes](./themes/)

## 📄 License

MIT - Create and share themes freely!

