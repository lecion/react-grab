# Vue2 Playground

Test project for verifying Vue2 support in react-grab.

## Quick Start

```bash
# From repository root
pnpm install

# Build react-grab
cd packages/react-grab && pnpm build

# Run Vue2 playground
cd packages/vue2-playground && pnpm dev
```

Opens at http://localhost:5174

## Testing Instructions

1. **Framework Detection**
   - Open browser console
   - Should see: `[React Grab] Framework detected: vue2`

2. **Component Detection**
   - Click on any element (header, card, list item)
   - react-grab panel should appear showing component info

3. **Component Hierarchy**
   - Click on UserCard in /user/123
   - Should show: UserCard ← UserProfile ← User ← App ← RouterView

4. **Router-View Detection**
   - Navigate to different routes
   - Router-view should show: `[Route: /]`, `[Route: /about]`, `[Route: /user/123]`

5. **File Paths**
   - Component file paths should display (may vary based on build config)
   - Format: `src/components/UserCard.vue`

## Expected Behavior

✅ Framework detected as "vue2"
✅ Component names display correctly
✅ Component hierarchy shows parent chain
✅ Router-view displays route paths in format `[Route: path]`
✅ No Vue internal components shown (transition, keep-alive, etc.)
✅ Click on any element shows component information

## Test Scenarios

| Route | Component | Expected Hierarchy |
|-------|-----------|-------------------|
| `/` | ProductList | ProductList ← Home ← App ← RouterView [Route: /] |
| `/about` | About content | About ← App ← RouterView [Route: /about] |
| `/user/123` | UserCard | UserCard ← UserProfile ← User ← App ← RouterView [Route: /user/123] |

## Verification Checklist

### Framework Detection
- [ ] Console shows: `[React Grab] Framework detected: vue2`
- [ ] No errors in browser console
- [ ] react-grab initializes successfully

### Component Name Detection
- [ ] Click on Header → shows "Header"
- [ ] Click on UserCard → shows "UserCard"
- [ ] Click on ProductList → shows "ProductList"
- [ ] Click on any view component → shows view name

### Component Hierarchy
- [ ] Shows parent chain in correct order (child ← parent ← grandparent)
- [ ] All components in hierarchy are user-defined
- [ ] No internal Vue components shown
- [ ] Hierarchy matches actual component tree

### Router-View Detection
- [ ] Router-view detected in component hierarchy
- [ ] Shows `[Route: /]` on home page
- [ ] Shows `[Route: /about]` on about page
- [ ] Shows `[Route: /user/123]` on user/123 page
- [ ] Route path updates when navigating

### File Path Display
- [ ] Shows `.vue` file paths when available
- [ ] Paths are readable and correct
- [ ] Falls back gracefully if `__file` missing

### Internal Component Filtering
- [ ] Does NOT show "transition"
- [ ] Does NOT show "transition-group"
- [ ] Does NOT show "keep-alive"
- [ ] Does NOT show "router-link"
- [ ] DOES show "RouterView" with route path

## Build & Run Commands

```bash
# Install dependencies (from root)
pnpm install

# Build react-grab first (required)
cd packages/react-grab
pnpm build

# Run Vue2 playground
cd packages/vue2-playground
pnpm dev
```

Server runs at: http://localhost:5174

## Critical Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `vite.config.js` | Vite + Vue2 plugin configuration |
| `src/main.js` | App entry + react-grab initialization |
| `src/router/index.js` | Vue Router configuration |
| `src/App.vue` | Root component with router-view |
| `src/views/*.vue` | Route components for testing |
| `src/components/*.vue` | Reusable components for testing hierarchy |

## Success Criteria

All of the following must work correctly:

✅ Vue2 playground runs without errors
✅ Framework detection shows "vue2"
✅ Component names display on click
✅ Component hierarchy shows complete parent chain
✅ Router-view displays with route path
✅ File paths display when available
✅ Internal components filtered out
✅ No breaking of React functionality

## Troubleshooting

**Issue:** Framework detection shows "unknown"
- **Solution:** Ensure react-grab is built (`pnpm build`)
- **Solution:** Check that `init()` is called in main.js

**Issue:** Component names not showing
- **Solution:** Ensure components have `name` property in script section
- **Solution:** Check browser console for errors

**Issue:** Router-view not showing route path
- **Solution:** Verify Vue Router is installed and configured
- **Solution:** Check that routes have `path` property

**Issue:** File paths missing
- **Solution:** This is normal if `__file` not set by build tool
- **Solution:** Falls back to component name

## Architecture Notes

The Vue2 detector implementation:
- Uses `element.__vue__` to access Vue component instance
- Traverses `vm.$parent` chain for component hierarchy
- Reads `vm.$options.name` or `vm.$options._componentTag` for component name
- Reads `vm.$options.__file` for file path
- Special handling for router-view: reads `vm.$route.path` and displays as `[Route: path]`
- Filters out Vue2 internal components (transition, keep-alive, etc.)

This playground validates all these features end-to-end.
