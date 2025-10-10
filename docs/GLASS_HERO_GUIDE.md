# GlassHero Component Customization Guide

The `GlassHero` component provides a full-viewport background with a fluted glass distortion effect. This guide explains all available props and how to use them effectively.

## Basic Usage

```tsx
import GlassHero from "@/components/ui/GlassHero";
import backgroundImage from "@/assets/images/beams-bkg-v2.png";

<GlassHero imageSrc={backgroundImage} />
```

## Available Props

### Core Props

#### `imageSrc?: string`
- **Description**: URL or imported image to use as the background
- **Default**: None
- **Example**: `imageSrc={beamsImage}`

#### `videoSrc?: string`
- **Description**: URL to video file (takes precedence over imageSrc)
- **Default**: None
- **Example**: `videoSrc="/videos/background.mp4"`

### Effect Customization Props

#### `glassSegments?: number`
- **Description**: Number of vertical glass segments/ribs
- **Default**: `80`
- **Range**: `20` - `200` (practical range)
- **Effect**:
  - **Lower values (20-50)**: Chunky, bold distortion - works well with simple, high-contrast images
  - **Medium values (60-100)**: Balanced detail - good for most images
  - **Higher values (100-200)**: Fine, detailed distortion - best for complex images, but impacts performance
- **Example**:
  ```tsx
  // Bold, chunky effect for simple backgrounds
  <GlassHero imageSrc={bgImage} glassSegments={40} />

  // Fine, detailed effect for complex images
  <GlassHero imageSrc={bgImage} glassSegments={120} />
  ```

#### `glassIntensity?: number`
- **Description**: Strength of the warping/distortion effect
- **Default**: `50`
- **Range**: `0` - `100`
- **Effect**:
  - `0`: No distortion (essentially disabled)
  - `25`: Subtle distortion
  - `50`: Moderate distortion (default)
  - `75`: Strong distortion
  - `100`: Maximum distortion
- **Example**:
  ```tsx
  // Subtle effect
  <GlassHero imageSrc={bgImage} glassIntensity={30} />

  // Dramatic effect
  <GlassHero imageSrc={bgImage} glassIntensity={80} />
  ```

#### `glassRotation?: number`
- **Description**: Rotation angle of the glass distortion axis in degrees
- **Default**: `0`
- **Range**: `0` - `360` (any angle)
- **Effect**: Changes the direction of the glass ribs
  - `0°`: Vertical ribs (default)
  - `45°`: Diagonal ribs
  - `90°`: Horizontal ribs
  - `180°`: Vertical ribs (inverted)
- **Example**:
  ```tsx
  // Diagonal glass effect
  <GlassHero imageSrc={bgImage} glassRotation={45} />

  // Horizontal glass ribs
  <GlassHero imageSrc={bgImage} glassRotation={90} />
  ```

#### `glassOverlay?: number`
- **Description**: Opacity of gradient overlay for subtle light/dark bands
- **Default**: `0`
- **Range**: `0` - `100`
- **Effect**: Adds subtle shading that enhances the glass effect
- **Example**:
  ```tsx
  <GlassHero imageSrc={bgImage} glassOverlay={30} />
  ```

#### `glassDynamicSegments?: boolean`
- **Description**: Enable/disable automatic segment increase on mouse interaction
- **Default**: `false`
- **Effect**: When enabled, the number of glass segments increases when the mouse is moving, providing more detail during interaction
- **Use Case**: Great for creating an engaging effect where the glass becomes more detailed on hover, but keep disabled if you want consistent segment count
- **Performance**: Enabling this will temporarily increase GPU load during mouse movement
- **Example**:
  ```tsx
  // Enable dynamic segments for interactive detail
  <GlassHero imageSrc={bgImage} glassDynamicSegments={true} />
  ```

#### `glassSegmentMultiplier?: number`
- **Description**: Multiplier for how many extra segments to add during mouse interaction
- **Default**: `1.5`
- **Range**: `1.0` - `3.0` (practical range)
- **Effect**: Only works when `glassDynamicSegments` is `true`
  - `1.0`: No change (same as disabled)
  - `1.5`: 50% more segments on hover (default)
  - `2.0`: Double segments on hover
  - `2.5`: 2.5x segments on hover
  - `3.0`: Triple segments on hover (performance intensive!)
- **Example**:
  ```tsx
  // Double the segments on mouse hover
  <GlassHero
    imageSrc={bgImage}
    glassSegments={60}
    glassDynamicSegments={true}
    glassSegmentMultiplier={2.0}
  />

  // Subtle increase (25% more)
  <GlassHero
    imageSrc={bgImage}
    glassDynamicSegments={true}
    glassSegmentMultiplier={1.25}
  />
  ```

### Interaction Props

#### `glassMode?: "static" | "mouse" | "scroll"`
- **Description**: How the effect responds to user interaction
- **Default**: `"mouse"`
- **Options**:
  - `"static"`: Ambient animation only (gentle sine wave)
  - `"mouse"`: Responds to mouse movement (automatically converts to "static" on touch devices)
  - `"scroll"`: Responds to page scroll position
- **Example**:
  ```tsx
  // Ambient animation only (good for mobile)
  <GlassHero imageSrc={bgImage} glassMode="static" />

  // Scroll-based effect
  <GlassHero imageSrc={bgImage} glassMode="scroll" />
  ```

#### `glassMotion?: number`
- **Description**: Sensitivity/responsiveness multiplier for mouse/scroll interaction
- **Default**: `1`
- **Range**: `0.1` - `5` (practical range)
- **Effect**:
  - Lower values: Less responsive, subtler movement
  - Higher values: More responsive, more dramatic movement
- **Example**:
  ```tsx
  // Subtle mouse interaction
  <GlassHero imageSrc={bgImage} glassMotion={0.5} />

  // Exaggerated mouse interaction
  <GlassHero imageSrc={bgImage} glassMotion={2} />
  ```

## Recommended Configurations

### For Simple, High-Contrast Images
Images with bold shapes, gradients, or simple patterns:
```tsx
<GlassHero
  imageSrc={simpleBackground}
  glassSegments={50}
  glassIntensity={60}
  glassMode="mouse"
/>
```

### For Complex, Detailed Images
Images with lots of detail, textures, or fine elements:
```tsx
<GlassHero
  imageSrc={detailedBackground}
  glassSegments={100}
  glassIntensity={40}
  glassMode="mouse"
/>
```

### For Subtle, Ambient Effect
When you want the effect to be noticeable but not distracting:
```tsx
<GlassHero
  imageSrc={bgImage}
  glassSegments={80}
  glassIntensity={35}
  glassMode="static"
/>
```

### For Dramatic, Eye-Catching Effect
When you want the glass effect to be the focal point:
```tsx
<GlassHero
  imageSrc={bgImage}
  glassSegments={120}
  glassIntensity={75}
  glassRotation={45}
  glassOverlay={20}
  glassMode="mouse"
  glassMotion={1.5}
/>
```

### For Horizontal Glass Effect
Creates a horizontal "blinds" effect:
```tsx
<GlassHero
  imageSrc={bgImage}
  glassSegments={60}
  glassIntensity={50}
  glassRotation={90}
  glassMode="mouse"
/>
```

### For Interactive Detail Boost
Increases detail when user moves their mouse:
```tsx
<GlassHero
  imageSrc={bgImage}
  glassSegments={50}
  glassIntensity={50}
  glassDynamicSegments={true}
  glassSegmentMultiplier={2.0}
  glassMode="mouse"
/>
```

## Performance Considerations

- **glassSegments** has the biggest performance impact
  - 40-80 segments: Good for most use cases
  - 100+ segments: Use sparingly, mainly on desktop
  - Consider lower values for mobile devices
- **glassDynamicSegments** adds temporary performance cost
  - Only active during mouse movement
  - The cost depends on `glassSegmentMultiplier` value
  - Multipliers above 2.0 can cause frame drops on lower-end devices
  - Consider disabling on mobile or keeping multiplier low (1.5 or less)

## Testing Tips

1. **Start with defaults** and adjust one property at a time
2. **Test on mobile** - effects behave differently on touch devices
3. **Consider your image** - some combinations work better with certain types of images:
   - Beams/rays → Higher segments, moderate intensity
   - Gradients → Lower segments, higher intensity
   - Textures → Medium segments, moderate intensity
4. **Preview at different screen sizes** - the effect scales with viewport size

## Current Usage in Project

- **Game Selection**: `glassSegments={60}`, `glassIntensity={50}`
- **Roadmap**: `glassSegments={60}`, `glassIntensity={50}`

Feel free to experiment with different values to find what works best for your specific images!
