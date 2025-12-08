# Dashboard Feature - Multi-Section View

## Overview

This feature enables speedrunners to create custom multi-section views that combine sections from one or multiple maps into a single page. This supports both single-map optimization and Super Easter Egg (EE) runs where players complete multiple maps sequentially.

## Implementation Approach: Hybrid (Dashboard + Widget)

### Phase 1: Dashboard Route (Core Feature) ✅ CURRENT FOCUS
- Create `/dashboard` route for building custom multi-section views
- Support cross-map sections (Super EE runs)
- Drag-and-drop section ordering
- Save/load/share dashboards
- Clean, focused UI

### Phase 2: Quick Access Widget (Future Enhancement)
- Small floating button (e.g., ⚡ icon) on map pages
- Click to open drawer with "Quick Dashboard" options
- Shows recently used dashboards
- "Create new dashboard with current map" shortcut

---

## Architecture Deep Dive

### Current System Understanding

**MapContainer Pattern:**
- Each map uses `MapContainer` which renders one section at a time
- Navigation via URL routing (`/bo7/astra-malorum/books`)
- Section data stored in localStorage: `"{mapId}-{sectionId}-data"`
- All sections are independent, using `BaseSection` wrapper

**Section Component Pattern:**
```typescript
function SomeSection(props: BaseSectionProps<SectionData>) {
  return (
    <BaseSection
      config={{
        storageKey: "mapId-sectionId-data",
        defaultValue: {},
        title: "Section Title",
        description: "What to do",
        // ... other config
      }}
      getProgress={(data) => ({ completed, total, isComplete })}
      {...props}
    >
      {({ data, setData, reset, progress }) => (
        // Section UI
      )}
    </BaseSection>
  );
}
```

**Key Insight:** Sections are already self-contained and reusable! They just need proper props.

---

## Phase 1: Dashboard Implementation Plan

### 1. Data Structures

```typescript
// Dashboard configuration
interface DashboardSection {
  gameId: string;           // "bo7"
  mapId: string;            // "astra-malorum"
  sectionId: string;        // "books"
  sectionName: string;      // "Books"
  mapName: string;          // "Astra Malorum"
  gameName: string;         // "Black Ops 7"
  order: number;            // User-defined order
}

interface Dashboard {
  id: string;               // "super-ee-run-1" (UUID)
  name: string;             // "Super EE Run - Feb 2025"
  description?: string;     // Optional description
  sections: DashboardSection[];
  createdAt: Date;
  updatedAt: Date;
  layout?: "stacked" | "grid"; // Future: different layouts
}

// Section registry - maps section IDs to components
interface SectionRegistryEntry {
  id: string;               // "books"
  name: string;             // "Books"
  component: ComponentType; // BooksSection
  gameId: string;           // "bo7"
  gameName: string;         // "Black Ops 7"
  mapId: string;            // "astra-malorum"
  mapName: string;          // "Astra Malorum"
}
```

### 2. URL Structure

```
/dashboard                      → Dashboard list/manager page
/dashboard/new                  → Dashboard builder (select sections)
/dashboard/:id                  → View specific dashboard
/dashboard/:id/edit             → Edit dashboard configuration
/dashboard/share/:encodedData   → View shared dashboard (via URL)
```

### 3. Component Architecture

```
Dashboard Module
├── DashboardList.tsx           // List all saved dashboards
├── DashboardBuilder.tsx        // Select & order sections
├── DashboardView.tsx           // Display dashboard sections
├── DashboardEditor.tsx         // Edit existing dashboard
└── components/
    ├── SectionSelector.tsx     // Tree view: Game > Map > Sections
    ├── SelectedSectionsList.tsx // Draggable list of chosen sections
    ├── DashboardCard.tsx       // Dashboard preview card
    └── ShareDialog.tsx         // Share URL generation
```

### 4. Section Registry

**File:** `src/data/sectionRegistry.ts`

```typescript
import { BooksSection } from "@/components/games/bo7/maps/astra-malorum/sections/BooksSection";
import { OrganSection } from "@/components/games/bo7/maps/astra-malorum/sections/OrganSection";
// ... import all sections

export const SECTION_REGISTRY: Record<string, Record<string, Record<string, SectionRegistryEntry>>> = {
  "bo7": {
    "astra-malorum": {
      "oscar-code": {
        id: "oscar-code",
        name: "OSCAR Code",
        component: PapCodeSection,
        gameId: "bo7",
        gameName: "Black Ops 7",
        mapId: "astra-malorum",
        mapName: "Astra Malorum",
      },
      "books": {
        id: "books",
        name: "Books",
        component: BooksSection,
        gameId: "bo7",
        gameName: "Black Ops 7",
        mapId: "astra-malorum",
        mapName: "Astra Malorum",
      },
      // ... other sections
    },
  },
  // ... other games
};

// Helper functions
export function getSectionByPath(gameId: string, mapId: string, sectionId: string) {
  return SECTION_REGISTRY[gameId]?.[mapId]?.[sectionId];
}

export function getAllSections(): SectionRegistryEntry[] {
  // Flatten registry into array
}

export function getSectionsByGame(gameId: string): SectionRegistryEntry[] {
  // Get all sections for a game
}
```

### 5. Dashboard Storage

**File:** `src/hooks/useDashboards.ts`

```typescript
const DASHBOARDS_KEY = "zomb-tools-dashboards";

export function useDashboards() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  // Load dashboards from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(DASHBOARDS_KEY);
    if (stored) {
      setDashboards(JSON.parse(stored));
    }
  }, []);

  // Save dashboards to localStorage
  const saveDashboards = useCallback((dashboards: Dashboard[]) => {
    localStorage.setItem(DASHBOARDS_KEY, JSON.stringify(dashboards));
    setDashboards(dashboards);
  }, []);

  // CRUD operations
  const createDashboard = useCallback((dashboard: Omit<Dashboard, "id" | "createdAt" | "updatedAt">) => {
    const newDashboard: Dashboard = {
      ...dashboard,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    saveDashboards([...dashboards, newDashboard]);
    return newDashboard;
  }, [dashboards, saveDashboards]);

  const updateDashboard = useCallback((id: string, updates: Partial<Dashboard>) => {
    const updated = dashboards.map(d =>
      d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
    );
    saveDashboards(updated);
  }, [dashboards, saveDashboards]);

  const deleteDashboard = useCallback((id: string) => {
    saveDashboards(dashboards.filter(d => d.id !== id));
  }, [dashboards, saveDashboards]);

  const getDashboard = useCallback((id: string) => {
    return dashboards.find(d => d.id === id);
  }, [dashboards]);

  return {
    dashboards,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    getDashboard,
  };
}
```

### 6. Data Isolation Strategy

**Problem:** Dashboard sections need separate data from regular map sections.

**Solution:** Use different storage keys.

```typescript
// Regular map section:
storageKey: "astra-malorum-books-data"

// Dashboard section:
storageKey: "dashboard-${dashboardId}-astra-malorum-books-data"
```

This keeps dashboard progress completely separate from regular map progress.

### 7. DashboardView Component

**File:** `src/components/dashboard/DashboardView.tsx`

```typescript
interface DashboardViewProps {
  dashboard: Dashboard;
}

export function DashboardView({ dashboard }: DashboardViewProps) {
  // Sort sections by order
  const sortedSections = useMemo(() =>
    [...dashboard.sections].sort((a, b) => a.order - b.order),
    [dashboard.sections]
  );

  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <h1>{dashboard.name}</h1>
        {dashboard.description && <p>{dashboard.description}</p>}
      </header>

      <div className="dashboard-sections">
        {sortedSections.map((section) => {
          const registryEntry = getSectionByPath(
            section.gameId,
            section.mapId,
            section.sectionId
          );

          if (!registryEntry) {
            return (
              <div key={`${section.mapId}-${section.sectionId}`}>
                Section not found: {section.sectionName}
              </div>
            );
          }

          const SectionComponent = registryEntry.component;

          return (
            <div
              key={`${section.mapId}-${section.sectionId}`}
              className="dashboard-section"
            >
              {/* Optional: Section header showing map/game context */}
              <div className="dashboard-section-context">
                <span className="game-name">{section.gameName}</span>
                <span className="separator">›</span>
                <span className="map-name">{section.mapName}</span>
              </div>

              {/* Render the section component */}
              <SectionComponent
                storageKey={`dashboard-${dashboard.id}-${section.mapId}-${section.sectionId}-data`}
                // ... other required props
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### 8. DashboardBuilder Component

**File:** `src/components/dashboard/DashboardBuilder.tsx`

```typescript
export function DashboardBuilder() {
  const [dashboardName, setDashboardName] = useState("");
  const [selectedSections, setSelectedSections] = useState<DashboardSection[]>([]);
  const { createDashboard } = useDashboards();
  const navigate = useNavigate();

  const handleAddSection = (section: SectionRegistryEntry) => {
    setSelectedSections([
      ...selectedSections,
      {
        gameId: section.gameId,
        mapId: section.mapId,
        sectionId: section.id,
        sectionName: section.name,
        mapName: section.mapName,
        gameName: section.gameName,
        order: selectedSections.length,
      },
    ]);
  };

  const handleReorder = (newOrder: DashboardSection[]) => {
    setSelectedSections(
      newOrder.map((section, index) => ({ ...section, order: index }))
    );
  };

  const handleSave = () => {
    const dashboard = createDashboard({
      name: dashboardName,
      sections: selectedSections,
    });
    navigate(`/dashboard/${dashboard.id}`);
  };

  return (
    <div className="dashboard-builder">
      <input
        type="text"
        placeholder="Dashboard Name (e.g., Super EE Run)"
        value={dashboardName}
        onChange={(e) => setDashboardName(e.target.value)}
      />

      <div className="builder-layout">
        <SectionSelector onSelectSection={handleAddSection} />
        <SelectedSectionsList
          sections={selectedSections}
          onReorder={handleReorder}
          onRemove={(index) => {
            setSelectedSections(selectedSections.filter((_, i) => i !== index));
          }}
        />
      </div>

      <button onClick={handleSave} disabled={!dashboardName || selectedSections.length === 0}>
        Create Dashboard
      </button>
    </div>
  );
}
```

---

## Implementation Phases

### Phase 1.1: Foundation (Week 1)
- [ ] Create section registry (`src/data/sectionRegistry.ts`)
- [ ] Create dashboard data structures & types
- [ ] Create `useDashboards` hook
- [ ] Set up routing for `/dashboard/*`
- [ ] Create basic DashboardList page

### Phase 1.2: Builder (Week 2)
- [ ] Create SectionSelector component (tree view)
- [ ] Create SelectedSectionsList component (drag-and-drop)
- [ ] Create DashboardBuilder page
- [ ] Implement drag-and-drop with @dnd-kit
- [ ] Add validation (prevent duplicates, require name)

### Phase 1.3: Viewer (Week 3)
- [ ] Create DashboardView page
- [ ] Implement section rendering with isolated data
- [ ] Add section context headers (game/map name)
- [ ] Handle missing sections gracefully
- [ ] Add navigation between dashboards

### Phase 1.4: Polish (Week 4)
- [ ] Create DashboardEditor page (modify existing dashboards)
- [ ] Add delete confirmation
- [ ] Create ShareDialog component (URL encoding)
- [ ] Add dashboard duplication
- [ ] Styling and responsive design
- [ ] Add empty states

---

## Technical Considerations

### 1. Section Props Compatibility
All sections already work with `BaseSectionProps`:
```typescript
interface BaseSectionProps<T = any> {
  data?: T;
  onChange?: (data: T) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentStep?: number;
  totalSteps?: number;
  guide?: Guide;
}
```

In dashboard context:
- `data` will be loaded from dashboard-specific storage key
- `onChange` will save to dashboard-specific storage key
- `onNext`/`onPrevious` can be omitted (no navigation in dashboard view)
- `currentStep`/`totalSteps` can be omitted or set to dashboard position

### 2. Data Migration
Dashboard data is completely separate from regular map data. Users can:
- Use dashboards for speedruns
- Use regular maps for practice
- Data never conflicts

### 3. Performance
- Lazy load section components
- Virtualize long section lists (if needed)
- Consider pagination for dashboards with many sections

### 4. Mobile Considerations
- Stacked layout works well on mobile
- Section selector needs mobile-friendly tree view
- Drag-and-drop may need alternative on mobile (reorder buttons)

### 5. Error Handling
- Missing sections: Show placeholder with message
- Corrupted dashboard data: Validate on load
- localStorage limits: Warn if approaching quota

---

## Future Enhancements (Phase 2+)

### Phase 2: Quick Access Widget
- Floating button on map pages
- Quick access to recent dashboards
- "Add current section to dashboard" shortcut

### Phase 3: Advanced Features
- Dashboard templates (common speedrun routes)
- Import/export JSON
- Dashboard tags/categories
- Search/filter dashboards
- Dashboard statistics (completion time, etc.)
- Grid layout option (side-by-side sections)
- Print-friendly mode
- Dark/light theme per dashboard

### Phase 4: Collaboration
- Cloud sync (optional backend)
- Public dashboard library
- Community templates
- Comments/notes on sections

---

## Design Decisions

### Why Dashboard Route vs Toggle?
✅ Doesn't interfere with existing map navigation
✅ Clean separation of concerns
✅ Supports cross-map sections (Super EE runs)
✅ URL-based: `/dashboard/:id` for bookmarking
✅ Can have multiple saved dashboards

### Why Not Widget-Only?
❌ Limited screen real estate
❌ Harder to build full-featured sections in compact format
❌ Mobile experience challenging

### Why Hybrid Approach?
✅ Dashboard solves core need (custom views)
✅ Widget provides quick access (Phase 2)
✅ Can be built incrementally
✅ Non-disruptive to existing UI

---

## Open Questions

1. **Should dashboards auto-save progress?**
   - Yes, using isolated storage keys per dashboard

2. **Max sections per dashboard?**
   - Start with no limit, add if performance issues arise

3. **Should we support section-specific settings in dashboard view?**
   - Yes, settings should work normally (compact mode, etc.)

4. **What happens if a section component is removed from codebase?**
   - Show placeholder with message, allow removal from dashboard

5. **Should users be able to rename sections within a dashboard?**
   - Future enhancement, start with original names

---

## Success Metrics

- [ ] Users can create multi-section dashboards
- [ ] Users can reorder sections via drag-and-drop
- [ ] Users can combine sections from different maps
- [ ] Dashboard data is isolated from regular map data
- [ ] Dashboards are shareable via URL
- [ ] Mobile-friendly experience
- [ ] Fast performance (< 100ms section load)

---

## Next Steps

1. ✅ Create this planning document
2. Start with Phase 1.1 (Foundation)
3. Build section registry
4. Implement dashboard storage
5. Create basic UI

Let's build this! 🚀
