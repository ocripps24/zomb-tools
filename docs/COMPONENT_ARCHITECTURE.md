# Component Architecture Guide

This guide explains how to use the new component architecture for creating maps and sections in the zomb-tools application.

## Overview

The architecture consists of several key components that work together to eliminate code duplication and provide consistent functionality:

- **MapContainer** - Container for multi-step map pages
- **useMapState** - Hook for map state management and navigation
- **usePersistedState** - Hook for localStorage persistence
- **BaseSection** - Template for individual section components with built-in tips and settings support
- **TipsSection** - Centralized component for displaying tips/instructions
- **SettingsSection** - Centralized component for section-specific preferences
- **useGlobalSettings** - Hook for app-wide settings (UI size, theme, etc.)
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
        resetButtonText: "Reset My Section", // optional
        
        // Optional: Add tips for user guidance
        tipsConfig: {
          show: true,
          items: [
            {
              label: "Step 1",
              text: "Find the first item in the spawn room"
            },
            {
              label: "Step 2", 
              text: "Use the item to activate the mechanism"
            },
            {
              label: "Final Step",
              text: "Complete the sequence to finish"
            }
          ]
        },
        
        // Optional: Add section-specific preferences
        settingsConfig: {
          show: true,
          title: "Section Preferences", // optional, defaults to "Settings"
          description: "Customize how this section behaves.", // optional
          settings: [
            {
              id: "display-mode",
              label: "Display Mode",
              value: displayMode,
              options: [
                { value: "grid", label: "Grid View" },
                { value: "list", label: "List View" }
              ],
              note: "How items are displayed in this section",
              onChange: (value) => setDisplayMode(value)
            }
          ]
        }
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

## Tips and Settings System

### Overview

The app provides centralized components for displaying tips and managing section-specific preferences. This eliminates code duplication and ensures consistent styling across all maps.

### Tips System

**When to use:** Display instructions, hints, or step-by-step guidance for users.

#### Basic Usage

```typescript
// Add to any BaseSection config
tipsConfig: {
  show: true,
  items: [
    {
      label: "Step 1",
      text: "Look for the glowing object in the spawn room"
    },
    {
      label: "Step 2", 
      text: "Interact with the object to reveal a code"
    },
    {
      label: "Final Step",
      text: "Enter the code into the terminal to complete"
    }
  ]
}
```

#### Tips Configuration

```typescript
interface TipsConfig {
  show: boolean;                    // Whether to display tips
  items: Array<{
    label: string;                  // Bold label for the tip (e.g., "Step 1", "Location")
    text: string;                   // Descriptive text explaining the tip
  }>;
}
```

#### What You Get Automatically

- ✅ **Consistent positioning** - Tips always appear after main content, before settings
- ✅ **Standardized styling** - Border, padding, typography from centralized CSS
- ✅ **Responsive design** - Works on mobile and desktop
- ✅ **Compact mode support** - Automatically reduces spacing in compact UI mode

### Settings System

**When to use:** Provide user preferences for input methods, display formats, or UI customizations.

#### Basic Usage

```typescript
// Example: Input method preference
const [inputMethod, setInputMethod] = useState('keypad');

// Add to BaseSection config
settingsConfig: {
  show: true,
  title: "Input Preferences",                    // optional
  description: "Customize how you input data.",  // optional
  settings: [
    {
      id: "input-method",
      label: "Input Method",
      value: inputMethod,
      options: [
        { value: "keypad", label: "Touch Keypad" },
        { value: "text", label: "Text Input" }
      ],
      note: "Choose your preferred input method",  // optional
      onChange: (value) => setInputMethod(value)
    }
  ]
}
```

#### Complex Settings Example

```typescript
// Multiple related settings
const [displayFormat, setDisplayFormat] = useState('time');
const [inputMethod, setInputMethod] = useState('sliders');
const [showHints, setShowHints] = useState(true);

settingsConfig: {
  show: true,
  title: "Section Preferences",
  description: "Customize display and input options for this section.",
  settings: [
    {
      id: "display-format",
      label: "Display Format", 
      value: displayFormat,
      options: [
        { value: "time", label: "Time Format (01:45)" },
        { value: "movements", label: "Movement Format (+1/-3)" }
      ],
      note: "How values are displayed throughout the interface",
      onChange: (value) => setDisplayFormat(value)
    },
    {
      id: "input-method",
      label: "Input Method",
      value: inputMethod, 
      options: [
        { value: "sliders", label: "Sliders (range controls)" },
        { value: "steppers", label: "Steppers (+/- buttons)" },
        { value: "text", label: "Text Fields" }
      ],
      note: "How you input values for this section",
      onChange: (value) => setInputMethod(value)
    },
    {
      id: "show-hints",
      label: "Show Hints",
      value: showHints ? 'yes' : 'no',
      options: [
        { value: "yes", label: "Show helpful hints" },
        { value: "no", label: "Hide hints" }
      ],
      onChange: (value) => setShowHints(value === 'yes')
    }
  ]
}
```

#### Settings Configuration

```typescript
interface SettingsConfig {
  show: boolean;                    // Whether to display settings
  title?: string;                   // Section title (defaults to "Settings")
  description?: string;             // Optional description text
  settings: Setting[];              // Array of setting configurations
}

interface Setting {
  id: string;                       // Unique identifier
  label: string;                    // Display label
  value: string;                    // Current selected value
  options: SettingOption[];         // Available options
  note?: string;                    // Optional helper text
  onChange: (value: string) => void; // Change handler
}

interface SettingOption {
  value: string;                    // Option value
  label: string;                    // Display text
}
```

#### What You Get Automatically

- ✅ **Consistent positioning** - Settings always appear at the bottom of sections
- ✅ **Standardized styling** - Dropdown styling, grid layout, responsive design
- ✅ **Compact mode support** - Automatically adjusts spacing in compact UI mode
- ✅ **Type safety** - Full TypeScript support

### Global Settings System

**When to use:** App-wide preferences like UI size, theme, or global display options.

#### Usage with Global Settings Hook

```typescript
import { useGlobalSettings } from '@/hooks/useGlobalSettings';

function MySection() {
  const { settings, updateSetting, isCompact } = useGlobalSettings();
  
  // Settings automatically persist to localStorage
  // CSS classes automatically applied to BaseSection
  
  return (
    <BaseSection
      config={{
        // ... other config
        settingsConfig: {
          show: true,
          settings: [
            {
              id: 'ui-size',
              label: 'UI Size',
              value: settings.uiSize,
              options: [
                { value: 'standard', label: 'Standard' },
                { value: 'compact', label: 'Compact (Speedrunner)' }
              ],
              note: 'Compact mode reduces spacing throughout the app',
              onChange: (value) => updateSetting('uiSize', value as 'standard' | 'compact')
            }
          ]
        }
      }}
      // ... rest of config
    >
      {/* Component content */}
    </BaseSection>
  );
}
```

#### Available Global Settings

```typescript
interface GlobalSettings {
  uiSize: 'standard' | 'compact';   // UI density preference
  // Future settings can be added:
  // theme: 'light' | 'dark' | 'auto';
  // animations: boolean;
}
```

#### Compact Mode Implementation

The global settings system automatically applies CSS classes:

```scss
// Standard styling
.base-section {
  gap: space(xl);
  padding: space(lg);
}

// Compact mode - automatically applied when uiSize is 'compact'
.base-section.compact {
  gap: space(md);
  padding: space(sm);
  
  .section-tips {
    margin-top: space(lg);
    padding: space(md);
  }
  
  .section-settings {
    margin-top: space(xl);
    padding: space(lg);
  }
}
```

### Best Practices for Tips and Settings

#### Tips Guidelines

```typescript
// ✅ Good - Clear, specific instructions
{
  label: "Location",
  text: "Found on the table in the Pack-a-Punch room"
},
{
  label: "Activation",
  text: "Press F to interact with the glowing console"
}

// ❌ Avoid - Vague or unhelpful tips
{
  label: "Tip",
  text: "Do the thing"
}
```

#### Settings Guidelines

```typescript
// ✅ Good - Clear labels and helpful notes
{
  id: "input-method",
  label: "Input Method",
  value: currentValue,
  options: [
    { value: "keypad", label: "Touch Keypad" },      // Clear option labels
    { value: "text", label: "Text Input" }
  ],
  note: "Choose your preferred input method",        // Helpful note
  onChange: handleChange
}

// ❌ Avoid - Unclear or missing information
{
  id: "setting1",
  label: "Setting",                                  // Too generic
  value: value,
  options: [
    { value: "option1", label: "Option 1" }         // Unclear what this does
  ],
  onChange: handleChange                             // Missing note
}
```

#### State Management

```typescript
// ✅ Good - State managed at component level
function MySection() {
  const [inputMethod, setInputMethod] = useState('keypad');
  
  return (
    <BaseSection
      config={{
        settingsConfig: {
          settings: [
            {
              value: inputMethod,                    // Reference component state
              onChange: (value) => setInputMethod(value)  // Update component state
            }
          ]
        }
      }}
    >
      {({ data, setData }) => (
        <div>
          {/* Use inputMethod state throughout component */}
          <MyInputComponent mode={inputMethod} />
        </div>
      )}
    </BaseSection>
  );
}

// ❌ Avoid - State managed inside render function
{({ data, setData }) => {
  const [inputMethod, setInputMethod] = useState('keypad'); // Don't do this
  return <div>...</div>;
}}
```

### Migration from Manual Implementation

If you have existing manual tips or settings sections:

#### 1. Remove Manual HTML

```typescript
// ❌ Remove this manual implementation
<div className="section-tips">
  <h3>Tips</h3>
  <ul>
    <li><strong>Step 1:</strong> Do something</li>
  </ul>
</div>

<div className="section-settings">
  <h4>Settings</h4>
  {/* Manual dropdown HTML */}
</div>
```

#### 2. Add to BaseSection Config

```typescript
// ✅ Replace with centralized config
config={{
  // ... existing config
  tipsConfig: {
    show: true,
    items: [
      { label: "Step 1", text: "Do something" }
    ]
  },
  settingsConfig: {
    show: true,
    settings: [/* ... */]
  }
}}
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