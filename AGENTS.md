<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Virtus Lab — Project Execution Rules

These rules apply to all implementation work in this repository.

## 1. Role

The coding agent is an IMPLEMENTER, not the product architect.

Implement the task exactly as specified.

Do not:
- redesign the requested solution
- invent requirements
- expand scope
- refactor unrelated code
- add speculative improvements
- change business copy unless explicitly instructed
- alter visual direction unless explicitly instructed

If an instruction is technically impossible or creates a direct conflict,
stop and report the conflict instead of inventing an alternative.

## 2. Source of Truth

Primary development branch:

website-redesign

Home-page business copy belongs in:

src/content/site.ts

Components must consume content from site.ts instead of duplicating business
copy inside components unless the text is purely structural/UI terminology.

Never invent:

- pricing
- testimonials
- customer counts
- project results
- availability claims
- contact information
- legal information
- business statistics

## 3. Scope Discipline

Change only files required for the requested task.

Do not perform opportunistic cleanup.

Do not rename files, folders, components, types, variables, CSS tokens or
public APIs unless the task explicitly requires it.

Do not delete fallback or legacy files unless deletion is explicitly approved.

Do not generate implementation_plan.md, walkthrough.md or similar temporary
documentation unless explicitly requested.

## 4. Dependencies

Do not install, remove or upgrade npm packages unless explicitly instructed.

The current primary frontend/3D stack is:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Three.js

Prefer native platform, React, Next.js and Three.js capabilities before adding
dependencies.

## 5. Three.js Architecture

The immersive experience uses ONE global Three.js renderer.

Do not create:

- another WebGLRenderer
- another global canvas
- another independent requestAnimationFrame loop
- another scroll listener for 3D behavior
- React Three Fiber
- Drei
- GSAP
- Babylon.js
- postprocessing libraries

unless explicitly requested.

The active signature object is:

src/experience/objects/VirtusCommandHub.ts

The global scene owner is:

src/experience/ImmersiveExperience.tsx

## 6. Depth Architecture

The centralized depth system is authoritative.

Configuration:

src/experience/experience-config.ts

Controller:

src/experience/ExperienceContext.tsx

Environment:

src/experience/environment/environment-config.ts

Use existing depth state instead of creating independent scroll calculations.

General rule:

rawDepth
= immediate UI instrumentation and direct scroll destination

smoothedDepth
= atmospheric transitions, camera/environment inertia and intentionally
smoothed visual behavior

Do not change this distinction unless explicitly instructed.

## 7. Command Hub

Preserve the Command Hub mechanical hierarchy unless the task specifically
changes it.

Scroll-linked behavior currently includes:

- primary rotor
- counter-rotating secondary rotor
- slower core rotor
- stabilized outer nodes
- scroll reversal
- mechanical damping
- final floor calibration

Do not replace this with whole-object-only rotation.

Do not change rotation counts, damping or geometry during unrelated tasks.

## 8. Performance

Do not perform expensive DOM measurement inside animation-frame loops.

Avoid unnecessary per-frame allocations in Three.js animation code.

Reuse geometries and materials where appropriate.

Use InstancedMesh for repeated geometry when materially beneficial.

Respect HIGH / MEDIUM / LOW / STATIC quality behavior.

Preserve prefers-reduced-motion behavior.

## 9. Accessibility

Do not remove:

- semantic HTML
- keyboard access
- visible focus states
- reduced-motion behavior
- aria attributes
- skip navigation behavior

Informational containers must not be made keyboard-focusable merely to trigger
visual effects.

## 10. Responsive Behavior

Every implementation must preserve:

- desktop
- narrow desktop
- tablet
- mobile

Do not fix desktop by breaking mobile.

Do not hide essential content to solve layout issues.

## 11. Validation

Every implementation task must finish by running:

npm run build
npx eslint src
npx tsc --noEmit

Do not report success unless these commands actually pass.

## 12. Completion Report

After implementation, report only:

1. files changed
2. files created
3. files deleted
4. exact requested behavior implemented
5. build result
6. ESLint result
7. TypeScript result
8. any unresolved issue

Do not propose additional work unless asked.

## 13. Stop Rule

Once the requested implementation is complete and validation passes:

STOP.

Do not continue modifying the repository.
