# GSAP ScrollSmoother Setup Guide

This guide walks you through adding GSAP ScrollSmoother to your React/Vite project.

## Prerequisites

- Club GreenSock membership (you have this ✓)
- Access to your GSAP private token

## Step 1: Get Your GSAP Token

1. Go to https://greensock.com/
2. Sign in to your Club GreenSock account
3. Navigate to your account dashboard
4. Find your "Private NPM Token"
5. Copy the token

## Step 2: Configure NPM for GSAP

Create a `.npmrc` file in your project root (same directory as `package.json`):

```bash
# Create .npmrc
touch .npmrc
```

Add these lines to `.npmrc`:

```
@gsap:registry=https://npm.greensock.com
//npm.greensock.com/:_authToken=YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with your actual GSAP token.

**IMPORTANT**: Add `.npmrc` to your `.gitignore` to keep your token private:

```bash
echo ".npmrc" >> .gitignore
```

## Step 3: Install GSAP

```bash
npm install gsap
```

This will install the full GSAP library including ScrollSmoother, ScrollTrigger, and all premium plugins.

## Step 4: Uncomment the SmoothScroll Component

Open `src/components/core/SmoothScroll.tsx` and uncomment:
1. The import statements at the top
2. The code inside the `useEffect` hook

## Step 5: Add SCSS Import

Add to `src/styles/main.scss`:

```scss
// In the Core Components section:
@use "core/smooth-scroll";
```

## Step 6: Wrap Your App

Open `src/App.tsx` and wrap your content with `SmoothScroll`:

```tsx
import SmoothScroll from "./components/core/SmoothScroll";

function App() {
  // ... your existing code

  return (
    <SmoothScroll smooth={1.2}>
      <div className={`app ${isMapPage ? "app--map-page" : ""}`}>
        {/* Your existing app content */}
      </div>
    </SmoothScroll>
  );
}
```

## Step 7: Test

```bash
npm run dev
```

Visit your site and test the smooth scrolling!

## Configuration Options

### Basic Settings

```tsx
<SmoothScroll
  smooth={1.5}           // 0-3, higher = smoother (default: 1)
  effects={true}         // Enable parallax effects (default: false)
  smoothTouch={false}    // Enable on touch devices (default: false)
  normalizeScroll={true} // Normalize scroll behavior (default: true)
>
  {children}
</SmoothScroll>
```

### Recommended Settings by Use Case

#### Subtle Smoothing (Recommended for Your Site)
```tsx
<SmoothScroll smooth={1.2}>
  {children}
</SmoothScroll>
```

#### Buttery Smooth
```tsx
<SmoothScroll smooth={2}>
  {children}
</SmoothScroll>
```

#### With Parallax Effects
```tsx
<SmoothScroll smooth={1.5} effects={true}>
  {children}
</SmoothScroll>
```

Then add `data-speed` attributes to elements:
```tsx
<div data-speed="0.8">Slower than scroll</div>
<div data-speed="1.2">Faster than scroll</div>
```

## Considerations for Your Site

### 1. Glass Hero Background

Your glass hero is `position: fixed`. With ScrollSmoother, you may need to adjust:

```scss
// In _glass-hero.scss
.glass-hero {
  position: fixed;
  z-index: 1;
  // Add this to ensure it works with ScrollSmoother:
  will-change: transform;
}
```

### 2. Fixed Navigation

Your navbar should work fine, but if you notice issues, add:

```tsx
<NavBar className="smooth-scroll-fixed" />
```

### 3. React Router Transitions

Your existing `framer-motion` page transitions should work fine with ScrollSmoother. However, you might want to scroll to top on route change:

```tsx
// In App.tsx, add to your route change effect:
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Uncomment after GSAP is installed:
    // const smoother = ScrollSmoother.get();
    // if (smoother) {
    //   smoother.scrollTo(0, false); // Instant scroll to top
    // }
  }, [location.pathname]);
}
```

### 4. Mobile Considerations

By default, `smoothTouch` is `false` because smooth scrolling on mobile can:
- Increase battery usage
- Feel "floaty" on touch devices
- Interfere with native scrolling momentum

If you want to enable it:
```tsx
<SmoothScroll smooth={1} smoothTouch={0.5}>
```

Use a lower value for touch (0.5-1.0) than desktop.

## Alternative: Simple CSS-Only Smooth Scroll

If you want something simpler without GSAP, you can use CSS only:

### Option A: CSS `scroll-behavior`

Add to your `src/styles/base/_reset.scss`:

```scss
html {
  scroll-behavior: smooth;
}

// Optional: Reduce motion for accessibility
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

**Pros:**
- Zero JavaScript
- Works everywhere
- No performance cost

**Cons:**
- Not as smooth as GSAP
- Only affects programmatic scrolling (anchor links, scrollTo)
- Doesn't affect wheel/touch scrolling

### Option B: CSS Snap Scrolling

For sections that should snap:

```scss
.scroll-container {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
}

.scroll-section {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

## Troubleshooting

### ScrollSmoother not working
- Check console for errors
- Verify GSAP is installed: `npm list gsap`
- Make sure you uncommented the code in `SmoothScroll.tsx`
- Check that wrapper and content divs are rendering

### Fixed elements not working
- Add `smooth-scroll-fixed` class to fixed elements
- Check z-index values

### Performance issues
- Lower the `smooth` value
- Disable `effects` if not needed
- Check for heavy animations running simultaneously

### Conflicts with framer-motion
- ScrollSmoother and framer-motion generally play nice
- If issues arise, disable page transitions or adjust AnimatePresence timing

## Performance Tips

1. **Start subtle**: `smooth: 1.2` is usually perfect
2. **Test on mobile**: Smooth scrolling can feel different on touch
3. **Monitor FPS**: Open DevTools Performance tab while scrolling
4. **Disable on low-end devices**: Check `navigator.hardwareConcurrency` or use a performance API

## Next Steps

Once you have basic scrolling working, you can explore:
- **ScrollTrigger**: Trigger animations on scroll
- **Parallax effects**: Use `data-speed` attributes
- **Pin elements**: Pin sections while scrolling
- **Horizontal scrolling**: Create horizontal scroll sections

Let me know if you need help with any of these!

## Resources

- [ScrollSmoother Docs](https://greensock.com/docs/v3/Plugins/ScrollSmoother)
- [ScrollTrigger Docs](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [GSAP React Guide](https://greensock.com/react)
