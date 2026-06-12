# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **秦腔文化科普网站** (Qinqiang Culture Educational Website) — a single-page static site showcasing Chinese intangible cultural heritage Qinqiang opera through modern "guochao" (国潮) visual design.

- **Framework**: Astro 4 with static output for GitHub Pages
- **Interactive**: Vue 3 components for galleries and media players
- **Styling**: Tailwind CSS with custom Chinese-themed color palette
- **Data**: JSON files in `public/assets/data/`, imported at build time

## Common Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:4321

# Build
npm run build        # Build to dist/ for static deployment
npm run preview      # Preview the production build locally

# Direct Astro commands
npx astro <command>  # Run any Astro CLI command
```

## Architecture

### Single-Page Structure

The entire site is a single `src/pages/index.astro` that composes six section components. Navigation uses anchor links (`#history`, `#roles`, etc.) with smooth scrolling.

### Component Patterns

- **Astro components (.astro)**: For static, server-rendered content. Data is passed as props from `index.astro` at build time.
- **Vue components (.vue)**: For interactive features (gallery filtering, lightbox, audio players). Mounted client-side via `<script>` tags in Astro components.
- **Client-side scripts**: Inline `<script>` blocks in `.astro` files for navigation, scroll effects, and mobile menu.

### Data Layer

All content data lives in `public/assets/data/*.json`. The build process imports these directly in `index.astro`:
```astro
import historyData from '../../public/assets/data/history.json';
```

TypeScript interfaces in `src/types/index.ts` define the shape of each data module. A `src/utils/data-loader.ts` utility exists but is not actively used — the preferred pattern is direct import.

### Styling System

- **Colors**: Custom Chinese-themed palette in `tailwind.config.mjs`:
  - `china-red-*` — Primary red (#C41A1A)
  - `ink-*` — Ink black (#1A1A1A)
  - `gold-*` — Gold (#D4A843)
  - `rice-paper-*` — Paper white (#F5F0E8)

- **Fonts**:
  - `font-display` — ZCOOL XiaoWei (decorative headers)
  - `font-body` — Noto Serif SC (body text)

- **Global styles**: Defined in `src/styles/` and imported via `global.css` with Tailwind directives.

### Component Organization

```
src/components/
├── artists/    — Artist cards and play listings
├── gallery/    — GalleryApp.vue (filterable grid + lightbox)
├── history/    — Timeline.vue (vertical timeline)
├── home/       — HeroSection.astro (landing banner)
├── layout/     — SectionTitle.astro, Divider.astro
├── media/      — VideoEmbed.vue, audio players
├── roles/      — RoleCard.vue for four role categories
└── ui/         — BackToTop.vue, ScrollReveal.vue (utility UI)
```

### Key Utilities

- `src/utils/intersection.ts` — Factory functions for IntersectionObserver (scroll animations, lazy loading)
- `src/utils/smooth-scroll.ts` — Smooth scrolling behavior
- `src/utils/data-loader.ts` — JSON data loader (unused, prefer direct import)

## Deployment

The site is configured for GitHub Pages:
- `base: '/ai-project-cmpt4nay'` in `astro.config.mjs`
- `site: 'https://leisurehuang.github.io'`
- Static output to `dist/`

When modifying links or asset paths, ensure they respect the base path. Use absolute paths from public root (`/assets/...`) or the `base` automatic replacement.

## Working with Vue Components

Interactive features are built as Vue 3 components with the Composition API:

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// Define local types or import from src/types/index.ts
</script>
```

They're mounted in Astro components via:
```astro
<div id="app-mount" data-props={JSON.stringify(propsData)}></div>
<script>
  import { createApp } from 'vue';
  import App from './App.vue';
  // Mount logic...
</script>
```

## Adding New Content Sections

1. Add JSON data to `public/assets/data/`
2. Define TypeScript interface in `src/types/index.ts`
3. Import in `src/pages/index.astro` and pass to new section component
4. Create section component in appropriate `src/components/` subdirectory
5. Add navigation link in `src/layouts/MainLayout.astro` header and footer

---

## Agent skills

### Issue tracker

Local markdown — issues stored as `.md` files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical labels: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: CONTEXT.md at repo root, ADRs in docs/adr/. See `docs/agents/domain.md`.
