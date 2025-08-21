# Component Architecture Guide

This guide explains how to use the new component architecture for creating maps and sections in the zomb-tools application.

## Overview

The architecture consists of several key components that work together to eliminate code duplication and provide consistent functionality:

- **MapContainer** - Container for multi-step map pages
- **useMapState** - Hook for map state management and navigation
- **usePersistedState** - Hook for localStorage persistence
- **BaseSection** - Template for individual section components
- **StepNavigation** - Tab navigation between steps
- **StepNavigationButtons** - Previous/Next navigation

## Creating a New Map

### 1. Define Your Steps

First, create an array of steps that define your map's structure:

```typescript
// Example: src/components/games/bo6/maps/my-map/MyMap.tsx
import { MapStep } from '../../../hooks';
import { MyFirstSection } from './sections/MyFirstSection';
import { MySecondSection } from './sections/MySecondSection';

const STEPS: MapStep[] = [
  {
    id: 'first-step',
    name: 'First Step',
    path: '/bo6/my-map/first',
    component: MyFirstSection,
  },
  {
    id: 'second-step', 
    name: 'Second Step',
    path: '/bo6/my-map/second',
    component: MySecondSection,
  },
];
```

### 2. Create the Map Component

Use the MapContainer to wrap your map with minimal code:

```typescript
import React from 'react';
import { MapContainer } from '../../../core';

function MyMap() {
  return (
    <MapContainer
      steps={STEPS}
      basePath="/bo6/my-map"
      storagePrefix="my-map"
      mapName="My Map"
      backTo="/bo6"
      className="my-map"
    />
  );
}

export default MyMap;
```

**MapContainer Props:**
- `steps` - Array of MapStep objects defining the map structure
- `basePath` - Base URL path for the map (e.g., "/bo6/my-map")
- `storagePrefix` - Prefix for localStorage keys (e.g., "my-map")
- `mapName` - Display name for the map
- `backTo` - Path to navigate back to (e.g., "/bo6")
- `className` - Optional CSS class for styling

### 3. What You Get Automatically

The MapContainer provides:
- ✅ Step tab navigation above content
- ✅ Previous/Next buttons below content
- ✅ State management for all steps
- ✅ localStorage persistence
- ✅ Reset functionality
- ✅ Consistent routing and navigation

## Creating Sections

### Method 1: Using BaseSection Wrapper (Recommended)

For most sections, use the BaseSection wrapper component:

```typescript
// Example: src/components/games/bo6/maps/my-map/sections/MySection.tsx
import React from 'react';
import { BaseSection, BaseSectionProps } from '../../../../../core';

interface MyData {
  selectedItems: string[];
  completed: boolean;
}

function MySection(props: BaseSectionProps<MyData>) {
  return (
    <BaseSection
      config={{
        storageKey: "my-map-my-section-data",
        defaultValue: { selectedItems: [], completed: false },
        title: "My Section",
        description: "Description of what this section does",
        resetButtonText: "Reset My Section" // optional
      }}
      getProgress={(data) => ({
        completed: data.selectedItems.length,
        total: 5, // example: 5 items to collect
        isComplete: data.completed
      })}
      {...props}
    >
      {({ data, setData, reset, progress }) => (
        <div className="my-section-content">
          {/* Your section UI here */}
          <div className="items-grid">
            {/* Example: render selectable items */}
            {ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setData(prev => ({
                    ...prev,
                    selectedItems: prev.selectedItems.includes(item.id)
                      ? prev.selectedItems.filter(id => id !== item.id)
                      : [...prev.selectedItems, item.id]
                  }));
                }}
                className={data.selectedItems.includes(item.id) ? 'selected' : ''}
              >
                {item.name}
              </button>
            ))}
          </div>
          
          {progress.isComplete && (
            <div className="completion-message">
              Section completed! 🎉
            </div>
          )}
        </div>
      )}
    </BaseSection>
  );
}

export default MySection;
```

### Method 2: Using createSection HOC

For sections with lots of logic, use the Higher-Order Component pattern:

```typescript
import { createSection } from '../../../../../core';

interface MyComplexData {
  calculations: number[];
  results: string[];
}

export const MyComplexSection = createSection<MyComplexData>({
  storageKey: "my-map-complex-section-data",
  defaultValue: { calculations: [], results: [] },
  title: "Complex Section",
  description: "A section with complex calculations",
  getProgress: (data) => ({
    completed: data.results.length,
    total: 3,
    isComplete: data.results.length === 3
  }),
  renderContent: ({ data, setData, progress }) => (
    <div className="complex-section">
      {/* Complex UI logic here */}
      <ComplexCalculator 
        data={data}
        onChange={setData}
      />
      
      {data.results.map((result, index) => (
        <div key={index} className="result">
          Result {index + 1}: {result}
        </div>
      ))}
    </div>
  )
});
```

### Method 3: Manual Implementation (Legacy Support)

If you need full control, implement the section manually but still use usePersistedState:

```typescript
import React from 'react';
import { SectionHeader } from '../../../../../core';
import { usePersistedState } from '../../../../../../hooks';

interface ManualSectionProps {
  onChange?: (data: any) => void;
  // ... other props from BaseSectionProps
}

function ManualSection({ onChange, ...props }: ManualSectionProps) {
  const { data, setData, reset } = usePersistedState({
    storageKey: "my-map-manual-section-data",
    defaultValue: { items: [] },
    onChange,
    debug: false
  });

  const progress = {
    completed: data.items.length,
    total: 10,
    isComplete: data.items.length === 10
  };

  return (
    <div className="manual-section">
      <SectionHeader
        title="Manual Section"
        progress={progress}
        description="Manually implemented section"
        onReset={reset}
        resetButtonText="Reset Manual Section"
      />
      
      <div className="section-content">
        {/* Your custom implementation */}
      </div>
    </div>
  );
}

export default ManualSection;
```

## Best Practices

### Storage Keys
- Use consistent naming: `"mapname-sectionname-data"`
- Examples: `"terminus-beam-code-data"`, `"reckoning-documents-data"`

### Progress Calculation
Always provide meaningful progress tracking:
```typescript
getProgress: (data) => ({
  completed: calculateCompleted(data), // number of completed items
  total: calculateTotal(data),         // total number of items
  isComplete: isFullyComplete(data)    // boolean completion status
})
```

### Data Structure
Keep your data structures simple and serializable:
```typescript
// ✅ Good
interface SectionData {
  selectedItems: string[];
  settings: { option1: boolean; option2: string };
  completedSteps: number[];
}

// ❌ Avoid
interface BadSectionData {
  complexObjects: SomeClass[];      // Not serializable
  functions: () => void;            // Not serializable
  dates: Date[];                    // Use ISO strings instead
}
```

### TypeScript
Always define interfaces for your data:
```typescript
interface MyMapData {
  step1Data: Step1Data;
  step2Data: Step2Data;
}

interface Step1Data {
  selectedSymbols: string[];
  calculatedValue: number;
}
```

## Migration from Legacy Components

### Converting Existing Maps
1. Replace the existing map component structure with MapContainer
2. Extract step definitions into a STEPS array
3. Update section components to use BaseSection
4. Remove manual localStorage operations
5. Remove manual navigation logic

### Converting Existing Sections
1. Identify localStorage operations and data structure
2. Wrap with BaseSection or use createSection
3. Replace manual SectionHeader usage
4. Update progress calculation logic
5. Remove manual reset functionality

## File Structure

```
src/components/games/[game]/maps/[map-name]/
├── [MapName].tsx              # Main map component using MapContainer
├── sections/
│   ├── Section1.tsx           # Individual sections using BaseSection
│   ├── Section2.tsx
│   └── SectionN.tsx
└── index.ts                   # Barrel export (optional)
```

## Example: Complete Map Implementation

```typescript
// src/components/games/bo6/maps/example/Example.tsx
import React from 'react';
import { MapContainer } from '../../../core';
import { MapStep } from '../../../hooks';
import { CodeSection } from './sections/CodeSection';
import { PuzzleSection } from './sections/PuzzleSection';
import { FinalSection } from './sections/FinalSection';

const STEPS: MapStep[] = [
  {
    id: 'code',
    name: 'Code Collection',
    path: '/bo6/example/code',
    component: CodeSection,
  },
  {
    id: 'puzzle',
    name: 'Puzzle Solving',
    path: '/bo6/example/puzzle',
    component: PuzzleSection,
  },
  {
    id: 'final',
    name: 'Final Step',
    path: '/bo6/example/final',
    component: FinalSection,
  },
];

function Example() {
  return (
    <MapContainer
      steps={STEPS}
      basePath="/bo6/example"
      storagePrefix="example"
      mapName="Example Map"
      backTo="/bo6"
      className="example-map"
    />
  );
}

export default Example;
```

This architecture provides:
- **80% less code** in map components
- **Centralized state management** with automatic persistence
- **Consistent user experience** across all maps
- **Type safety** throughout the application
- **Easy maintenance** and future enhancements

## Support

When creating new maps or sections, refer to existing implementations in:
- `src/components/games/bo6/maps/terminus/` - Example using MapContainer
- `src/components/games/bo6/maps/terminus/sections/BeamCodeSection.tsx` - Example using BaseSection
- `src/components/core/` - Core component implementations