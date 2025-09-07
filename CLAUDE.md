# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with hot reload on port 5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to GitHub Pages

### TypeScript Checking
This project uses TypeScript with strict mode enabled. Run TypeScript checking with:
```bash
npx tsc --noEmit
```

## Project Architecture

### Tech Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router DOM** for routing
- **SCSS** with modern @use syntax
- **localStorage** for data persistence
- **@dnd-kit** for drag and drop functionality

### Code Organization

**Component Architecture**: This project follows a strict component hierarchy designed to eliminate code duplication:

1. **MapContainer**: Central container for multi-step maps that provides navigation, state management, and persistence
2. **BaseSection**: Template wrapper for individual sections that handles common functionality 
3. **useMapState**: Custom hook for map navigation and state management
4. **usePersistedState**: Custom hook for localStorage data persistence

**Directory Structure**:
```
src/
├── components/
│   ├── core/           # Infrastructure components (MapContainer, BaseSection, etc.)
│   ├── content/        # Reusable content components  
│   ├── games/
│   │   ├── bo4/maps/   # Black Ops 4 map components
│   │   └── bo6/maps/   # Black Ops 6 map components
│   ├── layout/         # Layout components (NavBar, Footer)
│   └── pages/          # Top-level page components
├── data/               # Game and map configuration data
├── hooks/              # Custom React hooks
├── routes/             # Centralized routing configuration
├── styles/             # SCSS organized by component hierarchy
└── utils/              # Utility functions
```

### Path Aliases
The project uses path aliases configured in both `vite.config.js` and `tsconfig.json`:
- `@/*` → `src/*`
- `@/components/*` → `src/components/*` 
- `@/assets/*` → `src/assets/*`
- `@/hooks/*` → `src/hooks/*`
- `@/utils/*` → `src/utils/*`

### Routing System
Routes are centrally managed in `src/routes/config.ts` with:
- **ROUTES**: Static route definitions
- **MAP_STEPS**: Nested routes for map steps
- **ROUTE_PATTERNS**: Patterns for React Router with wildcards
- **ROUTE_METADATA**: Page titles and SEO data

### State Management Pattern
All components use a consistent pattern:
1. **MapContainer** handles navigation and step orchestration
2. **BaseSection** components handle individual step data with `usePersistedState`
3. **localStorage** keys follow pattern: `${storagePrefix}-${sectionId}-data`
4. Data structures must be JSON serializable

### Styling Architecture
SCSS files are organized to match component hierarchy:
- `abstracts/` - Variables, mixins, functions (no CSS output)
- `base/` - Reset, typography, utilities
- `components/` - Reusable component styles
- `core/` - Infrastructure component styles
- `content/` - Content component styles  
- `layout/` - Layout-specific styles
- `maps/` - Map-specific styles organized by game

Uses CSS custom properties for theming and modern @use syntax.

## Adding New Content

### Adding a New Map
1. Create map directory: `src/components/games/{game}/maps/{map-name}/`
2. Define steps array with `MapStep[]` interface
3. Create main component using `MapContainer`
4. Create section components using `BaseSection`
5. Add route configuration to `src/routes/config.ts`
6. Add route to `App.tsx`
7. Add map data to `src/data/{game}/maps.js`

### Adding a New Section
Use `BaseSection` wrapper with required props:
- `storageKey`: localStorage key (format: `"mapname-sectionname-data"`)
- `defaultValue`: Initial data structure
- `title`: Section display title
- `getProgress`: Function returning `{ completed: number, total: number, isComplete: boolean }`

### Asset Management
- SVG icons in `src/assets/symbols/` (imported as React components via vite-plugin-svgr)
- Game logos in `src/assets/games/`
- Map preview images in `src/assets/maps/{game}/`

## Important Development Notes

### Data Persistence
- All section data automatically persists to localStorage
- Data structures must be JSON serializable
- Use consistent storage key naming: `"mapname-sectionname-data"`

### Component Patterns
- **Always** use `BaseSection` for new sections to maintain consistency
- **Never** implement manual localStorage operations - use `usePersistedState`
- **Always** define TypeScript interfaces for data structures
- Follow existing naming conventions for CSS classes

### Background Color Guidelines
- **Primary content background:** Always use `var(--bg-tertiary)` for component backgrounds (this matches map-content)
- **Transparent backgrounds:** Use `transparent` for overlays and display elements that should inherit parent background
- **Never use bright backgrounds:** Avoid `white`, `var(--bg-secondary)`, or other bright colors as primary backgrounds
- **Card containers:** Use `var(--bg-tertiary)` to maintain consistency with the dark theme while supporting light mode
- **Input displays:** Use `transparent` with borders to avoid harsh contrast

### Code Style
- Use functional components with hooks
- Prefer const assertions for configuration objects (`as const`)
- Use destructuring for props and state
- Follow existing file naming conventions (PascalCase for components)

### Performance Considerations
- Components use React.memo where appropriate
- State updates are batched using functional updates
- Assets are optimized through Vite's build process