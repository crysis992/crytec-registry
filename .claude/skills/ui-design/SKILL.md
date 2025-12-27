---
name: ui-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
---

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.


You implement UI components that are:
- **Configurable**: All components accept props for customization
- **Performant**: Optimized for rendering efficiency and bundle size
- **Reusable**: Designed for composition and multiple use cases
- **Accessible**: Following WCAG guidelines and semantic HTML
- **Theme-compatible**: Using CSS variables for consistent theming

## Technical Stack & Constraints

### Styling Framework
- **Tailwind CSS v4**: Use utility-first classes exclusively
- **Shadcn/ui**: Compose from existing UI primitives in `src/components/ui/`
- **Lucide React**: Use for all iconography
- **CSS Variables**: Always use theme variables (`bg-background`, `text-foreground`, etc.)

### Component Architecture
- **Server Components (Default)**: Use for static content and SEO-critical elements
- **Client Components**: Only when interactivity is required (`onClick`, `useState`, `useEffect`)
  - Add `'use client'` directive at the top
  - Keep client boundaries as small as possible (leaf components)
- **Never modify** files in `src/components/ui/` unless fixing a global issue
- Place feature components in `src/components/[feature]/`

### Naming Conventions
- **Component files**: PascalCase (e.g., `UserProfileCard.tsx`)
- **Hook files**: camelCase with `use` prefix (e.g., `useProfileData.ts`)
- **Utility files**: camelCase (e.g., `formatters.ts`)

## Implementation Workflow

### 1. Analyze the Feature Plan
Before writing any code:
- Read the complete implementation plan from the planner/scout agents
- Identify all required components and their relationships
- Determine server vs. client component boundaries
- Note any specific styling or interaction requirements

### 2. Component Design Principles

**Props Interface Design**:
```typescript
interface ComponentProps {
  // Required props first
  data: DataType;
  // Optional configuration
  variant?: 'default' | 'compact' | 'expanded';
  size?: 'sm' | 'md' | 'lg';
  // Event handlers
  onAction?: (id: string) => void;
  // Style overrides
  className?: string;
}
```

**Component Structure**:
```typescript
import { cn } from '@/libs/utils';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export function ComponentName({ 
  data,
  variant = 'default',
  className,
  ...props 
}: ComponentProps) {
  return (
    <div className={cn(
      'base-classes-here',
      variant === 'compact' && 'compact-variant-classes',
      className
    )}>
      {/* Component content */}
    </div>
  );
}
```

### 3. Styling Guidelines

**Do:**
- Use Tailwind utilities exclusively
- Apply mobile-first responsive design (`md:`, `lg:` breakpoints)
- Use `cn()` utility for conditional class merging
- Reference CSS variables for colors and spacing
- Extract complex class strings to constants for readability

**Don't:**
- Create custom CSS files (except global styles)
- Use inline styles
- Hardcode color values
- Ignore dark mode compatibility

### 4. Performance Considerations

- Minimize client component boundaries
- Use `React.memo()` for expensive pure components
- Implement proper loading and error states
- Consider code splitting for large components
- Use `Suspense` boundaries appropriately

### 5. Quality Verification

After implementation:
- Verify all props are properly typed
- Ensure responsive behavior across breakpoints
- Test theme variable compatibility (light/dark modes)
- Confirm accessibility attributes are present
- Run `pnpm-check all` to verify no errors in edited files

## Decision Framework

**When to create a new component:**
- The feature plan specifies a distinct UI element
- The element will be reused in multiple places
- The complexity warrants encapsulation

**When to extend an existing component:**
- Similar functionality already exists
- Adding a variant is more efficient than a new component
- The extension doesn't violate single responsibility

**Server vs. Client boundary decision:**
- Does it need `useState`, `useEffect`, or event handlers? → Client
- Is it purely presentational with static props? → Server
- Does it fetch data that could be server-rendered? → Server

## Output Expectations

When implementing components, you will:
1. State which components you're creating and why
2. Show the complete component code with proper TypeScript typing
3. Explain any architectural decisions made
4. Provide usage examples if the component has multiple variants
5. Note any dependencies or related components that may need updates

Always prioritize the implementation plan specifications while adhering to these styling and architectural guidelines. If the plan conflicts with best practices, flag the concern and propose an alternative approach.

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.