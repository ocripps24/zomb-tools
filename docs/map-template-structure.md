# Map Template Structure

This document outlines the standardized structure for all map pages in the ZomB Tools application.

## JSX Structure

```jsx
<div className="map-page {map-name}">
  {/* Map Info - Standardized container for map metadata */}
  <div className="map-info">
    <h1 className="map-title">{Map Name}</h1>
  </div>

  {/* Map Header - Standardized container for map navigation */}
  <div className="map-header">
    {/* Map Navigation - Reusable component */}
    <div className="map-nav">
      <MapNavigation
        backTo="/{game-id}"
        settingsPath="/{game-id}/{map-id}/settings"
        onReset={handleReset}
      />
    </div>

    {/* Step Navigation - Reusable component across all maps */}
    <div className="step-navigation">
      <StepNavigation
        steps={STEPS}
        currentStep={activeStepIndex}
        onStepChange={goToStep}
      />
    </div>
  </div>

  {/* Map Content - Standardized container for map-specific content */}
  <div className="map-content">
    <Routes>
      <Route path="/" element={<FirstStepComponent />} />
      <Route path="/{step-id}" element={<StepComponent />} />
      <Route path="/settings" element={<SettingsPage backTo="/{game-id}/{map-id}" />} />
      <Route path="*" element={<FirstStepComponent />} />
    </Routes>
  </div>

  {/* Map Footer - Standardized container for step navigation buttons */}
  <div className="map-footer">
    <StepNavigationButtons
      currentStepIndex={activeStepIndex}
      totalSteps={STEPS.length}
      onPrevious={goToPrevious}
      onNext={goToNext}
      stepNames={STEPS.map(step => step.name)}
    />
  </div>
</div>
```

## CSS Classes

### Required Classes

- `.map-page` - Main container for the entire map
- `.map-info` - Container for map title and metadata
- `.map-title` - Map name heading (h1)
- `.map-header` - Container for navigation elements
- `.map-nav` - Container for map-level navigation (back, settings, reset)
- `.step-navigation` - Container for step tabs
- `.map-content` - Container for step-specific content
- `.map-footer` - Container for step navigation buttons

### Optional Classes

- `.{map-name}` - Map-specific class for custom styling

## Required Components

### Core Components

1. **MapNavigation** - Handles back button, settings, and data reset
2. **StepNavigation** - Provides step tabs for navigation between sections
3. **StepNavigationButtons** - Provides prev/next buttons with step counter
4. **SettingsPage** - Map-specific settings page
5. **FloatingCard** - Reusable card container for content

### Map-Specific Components

- Individual step components (e.g., `TotemsSection`, `SealOfDualitySection`)

## Data Structure

### STEPS Array

```javascript
const STEPS = [
	{
		id: "step-id",
		name: "Step Name",
		path: "/{game-id}/{map-id}/{step-id}",
		component: StepComponent,
	},
	// ... more steps
];
```

### Required Functions

- `goToStep(stepIndex)` - Navigate to specific step
- `goToNext()` - Navigate to next step
- `goToPrevious()` - Navigate to previous step
- `handleReset()` - Reset map data and localStorage

## Implementation Checklist

### ✅ Required Setup

- [ ] Import all required components
- [ ] Define STEPS array with proper structure
- [ ] Implement navigation functions
- [ ] Set up state management for each section
- [ ] Implement data persistence with localStorage
- [ ] Add reset functionality

### ✅ Structure Implementation

- [ ] Wrap component in `.map-page` div
- [ ] Add `.map-info` with `.map-title`
- [ ] Create `.map-header` with `.map-nav` and `.step-navigation`
- [ ] Set up `.map-content` with Routes
- [ ] Add `.map-footer` with StepNavigationButtons

### ✅ Navigation Setup

- [ ] Configure Routes for each step
- [ ] Add settings route
- [ ] Add catch-all route for default step
- [ ] Ensure proper step indexing logic

### ✅ Styling

- [ ] Import map-specific SCSS file
- [ ] Apply standardized CSS classes
- [ ] Test responsive behavior
- [ ] Verify theme compatibility

## Benefits

1. **Consistency** - All maps follow the same structure
2. **Maintainability** - Changes to navigation affect all maps
3. **Reusability** - Components can be shared across maps
4. **Scalability** - Easy to add new maps following the template
5. **User Experience** - Consistent navigation patterns across all maps

## Example Implementation

See `src/components/games/bo4/maps/tag-der-toten/TagDerToten.jsx` for a complete implementation example.
