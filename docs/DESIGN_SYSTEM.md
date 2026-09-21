# 🎨 AURA FanVerse: Official Design System & UI Specifications

---

## 🌟 Brand Emblem (SVG Vector Specification)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
  <defs>
    <linearGradient id="auraGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="50%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
    <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect width="120" height="120" rx="32" fill="#130E24"/>
  <circle cx="60" cy="60" r="44" stroke="url(#auraGlow)" stroke-width="2" opacity="0.4"/>
  <path d="M60 22 L86 78 L72 78 L60 52 L48 78 L34 78 Z" fill="url(#auraGlow)" filter="url(#neonBlur)"/>
  <circle cx="60" cy="40" r="5" fill="#FFFFFF"/>
  <path d="M42 66 L78 66" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
</svg>
```

---

## 🎨 Color Palette & Tokens

| Token Name | Hex Code | Purpose |
|---|---|---|
| `surface` / `background` | `#151026` | Primary deep obsidian viewport backdrop |
| `surface-container` | `#211c33` | Elevated component card container |
| `surface-container-high` | `#2c273e` | Hover states & interactive button cards |
| `primary` | `#ddb7ff` | Neon lilac highlights & hero headers |
| `primary-container` | `#b76dff` | Main CTA gradients & active states |
| `secondary` | `#ffb0cd` | Electric coral accents & badge highlights |
| `secondary-container` | `#aa0266` | Critical alert pills & live match indicator |
| `tertiary` | `#4cd7f6` | Cyan glow, telemetry HUD & verified badges |
| `on-surface-variant` | `#cfc2d6` | Secondary body text & muted metrics |

---

## 🔤 Typography

* **Headlines & Display:** `Plus Jakarta Sans` (Weights: 600, 700, 800)
* **Body & Telemetry:** `Inter` (Weights: 400, 600)
* **Icons:** `Material Symbols Outlined` (Fill, Weight & Grade enabled)

---

## 📱 Integrated App Screens

1. **Landing & Discover (`mobile_blank`)**: Genesis canon protocol showcase with horizontal story card carousels.
2. **Welcome Loading & Multiverse Sync (`mobile_blank`)**: Shard loading animation (84% $\rightarrow$ 100%) with neural weight synthesis indicators.
3. **Lorekeeper Sign-In (`mobile_blank`)**: Multi-node OAuth (Discord, Google, Apple ID, Web3 Fan Token Wallet) + Neural Face ID quick pass.
4. **Neural Link OTP Verification (`mobile_stack`)**: 6-digit futuristic glowing digit slots with tactile numeric keypad.
5. **Main Multiverse Dashboard (`mobile_tab`)**: Live co-creation rooms, community canon voting polls, and multimodal audio/art streams.
6. **Fan Dossier & Athlete Profile (`mobile_tab`)**: Neon cyber banner, spark balances, canon coherence arcs, and faction applications.
