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

**Step-by-step Process:**

1. **Create map directory structure**

   ```
   src/components/games/{game}/maps/{map-name}/
   ├── {MapName}.tsx           # Main map component
   └── sections/
       ├── Section1.tsx
       ├── Section2.tsx
       └── Section3.tsx
   ```

2. **Create main map component** using `MapContainer`

   ```tsx
   import { MapContainer } from "@/components/core";
   import type { MapStep } from "@/components/core/MapContainer";

   const STEPS: MapStep[] = [
   	{
   		id: "step1",
   		name: "Step 1",
   		path: "/game/map/step1",
   		component: Step1Section,
   	},
   	{
   		id: "step2",
   		name: "Step 2",
   		path: "/game/map/step2",
   		component: Step2Section,
   	},
   ];

   export default function MapName() {
   	return (
   		<MapContainer
   			mapId="map-name"
   			mapName="Map Display Name"
   			game="bo6" // or "bo4", "bo3"
   			steps={STEPS}
   			guide={{ url: "video-id", type: "internal" }} // Optional
   		/>
   	);
   }
   ```

3. **Create section components** using `BaseSection` (see section guide below)

4. **Add routing configuration** to `src/routes/config.ts`

   - Add map entry to `ROUTES`
   - Add step routes to `MAP_STEPS`
   - Add metadata to `ROUTE_METADATA`

5. **Add route to `App.tsx`**

   ```tsx
   <Route path="/game/map/*" element={<MapName />} />
   ```

6. **Add map data** to `src/data/{game}/maps.js`

   ```js
   {
     id: "map-id",
     name: "Map Name",
     difficulty: "medium",  // easy, medium, hard
     image: MapImage,
     path: "/game/map"
   }
   ```

7. **Create map-specific SCSS** (if needed)

   ```scss
   // src/styles/maps/{game}/_map-name.scss
   @use "../../abstracts/variables" as *;
   @use "../../abstracts/functions" as *;
   @use "../../abstracts/mixins" as *;

   // Map-specific styles here
   ```

### Adding a New Section

**Required Configuration:**

```tsx
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

interface SectionData {
	// Your data structure (must be JSON serializable)
}

function MySection(props: BaseSectionProps<SectionData>) {
	return (
		<BaseSection
			config={{
				// REQUIRED
				storageKey: "mapname-sectionname-data", // Format: "{map}-{section}-data"
				defaultValue: {}, // Initial empty data
				title: "Section Title",
				description: "What the user needs to do",

				// OPTIONAL
				resetButtonText: "Clear", // Default: "Clear"
				hasCompactMode: true, // Enables compact mode toggle

				// Tips (help/instructions)
				tipsConfig: {
					show: true,
					items: [
						{ label: "Tip 1", text: "Helpful information" },
						{ label: "Location", text: "Where to find something" },
					],
				},

				// Custom settings (input preferences, etc.)
				settingsConfig: {
					show: true,
					title: "Section Settings",
					description: "Customize preferences",
					settings: [
						{
							id: "ui-size", // Use "ui-size" for global compact mode
							label: "UI Density",
							value: settings.uiSize, // From useGlobalSettings()
							options: [
								{ value: "standard", label: "Standard" },
								{ value: "compact", label: "Compact" },
							],
							note: "Compact mode reduces spacing",
							onChange: (value) => updateSetting("uiSize", value),
						},
					],
				},

				// YouTube guide for this section
				guide: { url: "video-id", type: "internal" },
			}}
			getProgress={(data: SectionData) => ({
				completed: 0, // Count of completed items
				total: 0, // Total items needed
				isComplete: false, // Whether section is complete
			})}
			{...props}
		>
			{({ data, setData, reset, progress }) => ({
				/* Your section UI here */
			})}
		</BaseSection>
	);
}
```

**Compact Mode Support:**

To add compact mode to a section:

1. **Option A: Auto-generated toggle** (simplest)

   ```tsx
   config={{
     hasCompactMode: true,  // Automatically shows settings with compact toggle
     // ... other config
   }}
   ```

2. **Option B: Custom settings** (if you need additional settings)

   ```tsx
   import { useGlobalSettings } from "@/hooks/useGlobalSettings";

   function MySection(props) {
   	const { settings, updateSetting } = useGlobalSettings();

   	return (
   		<BaseSection
   			config={{
   				settingsConfig: {
   					show: true,
   					settings: [
   						// Compact mode toggle
   						{
   							id: "ui-size",
   							label: "UI Density",
   							value: settings.uiSize,
   							options: [
   								{ value: "standard", label: "Standard" },
   								{ value: "compact", label: "Compact" },
   							],
   							onChange: (value) =>
   								updateSetting("uiSize", value as "standard" | "compact"),
   						},
   						// Your custom settings...
   					],
   				},
   			}}
   		>
   			{/* ... */}
   		</BaseSection>
   	);
   }
   ```

3. **Add compact SCSS styles** (if section has custom layout)

   ```scss
   // src/styles/maps/{game}/_map-name.scss

   .base-section.compact .my-section {
   	// Reduced spacing for compact mode
   	.my-grid {
   		gap: space(sm); // Instead of space(lg)
   	}

   	// Hide secondary information
   	.secondary-text {
   		display: none;
   	}
   }
   ```

### Available Reusable Components

**Core Components:**

- `BaseSection` - Wrapper for all sections (provides state, tips, settings)
- `MapContainer` - Container for multi-step maps
- `SectionHeader` - Header with title, progress, reset button
- `TipsSection` - Collapsible tips/instructions
- `SettingsSection` - Section-specific settings panel

**UI Components:**

- `ResultsDisplay` - Display codes/results (single-code, grid, sequence variants)
- `CircularProgress` - Progress indicator (badge or large variant)
- `NumberPad` - Numeric keypad for code entry
- `LocationCard` - Selectable location cards with completion states
- `OrderedLocationSection` - Drag-and-drop location ordering
- `SymbolPicker` - Symbol selection grid with categories

**Specialized Components:**

- `NumberCodeSection` - Standard 4-digit code input with validation
- `YouTubeGuideSection` - Embedded YouTube video player

### Asset Management

- **SVG icons**: `src/assets/symbols/` (imported as React components via vite-plugin-svgr)
- **Game logos**: `src/assets/games/`
- **Map previews**: `src/assets/maps/{game}/`
- **Usage**:

  ```tsx
  // IMPORTANT: Do NOT use ?react suffix for SVG imports
  // Import SVGs directly and cast to ComponentType
  import MyIcon from "@/assets/symbols/my-icon.svg";

  // Cast to React component type
  const ICONS = [
  	{
  		id: "my-icon",
  		component: MyIcon as unknown as React.ComponentType<
  			React.SVGProps<SVGSVGElement>
  		>,
  	},
  ];

  // Use as component
  const IconComponent = ICONS[0].component;
  <IconComponent className="icon-class" />;
  ```

**SVG Import Pattern (IMPORTANT)**:

- ❌ **WRONG**: `import Icon from "@/path/icon.svg?react"`
- ✅ **CORRECT**: `import Icon from "@/path/icon.svg"`
- Always cast to `React.ComponentType<React.SVGProps<SVGSVGElement>>`
- See `shadows-of-evil/EggSymbols.tsx` for reference implementation

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
