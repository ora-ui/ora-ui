# ADR-0004: Playground as the pre-alpha product surface

## Status

Proposed — 2026-05-18

## Context

Pre-alpha Ora has been building toward the composer vision laid out in
`.local/plans/composer-alpha.md` and `composer-architecture.md`: a
docs-embedded configurator per primitive, eventually growing into a
full composition surface in Phase 2.

In parallel, the project carries a multi-surface product footprint:

- `landing/` slice — marketing home at `/`
- `docs/` slice — per-Component MDX pages with sidebar, MDX rendering,
  Previews
- `playground/` slice — interactive `/playground/<component>`
  configurator (composer-alpha.md Phase 1, embedded inside docs pages)

At the current stage, this footprint is doing more harm than good:

- **Three surfaces, no audience yet.** Marketing copy + docs prose +
  configurators each pull effort. None of them sells the system on
  their own.
- **The configurator is the only surface that demonstrates Ora's
  thesis.** Variants + Content + tokens, manipulated live, with code
  out the other end. Everything else is talking _about_ the system
  while the configurator _is_ it.
- **The docs-embedded shape buries the demo.** A visitor lands on
  Landing, navigates to Docs, reads, eventually finds a configurator
  on a per-component page. The wow moment is several clicks deep.
- **Editorial cost of full per-Component MDX docs is high** for a
  registry still finding its shape. Writing docs against APIs that are
  still moving is repeated rewrite cost.

The pre-alpha goal is a single artifact that, when sent to a stranger,
makes the system land in 30 seconds. The current surface mix does not
do that.

## Decision

Collapse the three surfaces into one: **the Playground is the site**.

### 1. Routing

- `/` serves the Playground.
- No separate Landing route.
- No public `/docs` route. `docs/` slice content is hidden behind the
  build (kept in repo for future reactivation).
- Per-Component pages move to `/<component>` (or remain at
  `/playground/<component>` — implementation detail, picked during
  build).

### 2. Layout

```
┌──────────────────────────────────────────────────────────┐
│  Header: brand · theme controls (dark/light · accent · radius) │
├──────────┬───────────────────────────────────┬──────────┤
│          │                                   │          │
│ Sidebar  │           Preview                 │ Toolbar  │
│ (flat    │                                   │ (props   │
│ alpha-   │                                   │  only)   │
│ betical) │                                   │          │
│          │                                   │          │
└──────────┴───────────────────────────────────┴──────────┘
```

- **Sidebar (left):** Introduction entry + flat alphabetical list of
  Components. No categorisation in v1 (matches shadcn convention,
  avoids bikeshedding category names).
- **Preview (center):** the selected Component (or the Introduction
  page) renders here.
- **Toolbar (right):** controls for the Component's Variants and
  Content. Props only — no CSS-variable knobs, no data-slot
  overrides. Those layers remain part of Ora's user API but are not
  part of the demo's toolbar surface.
- **Header (top):** app-level theme controls. Dark/light toggle,
  accent picker (hand-picked colours validated against chrome design),
  radius preset (radio, not slider). Changing these re-themes the
  entire site, chrome included.

### 3. Theme controls are global, by design

The header placement signals scope: "this affects the whole app." The
demo eats its own dogfood — chrome is built on the system, so the
same accent and dark-mode token swap that flows through user-rendered
Components also flows through the sidebar, toolbar, and header.

Trade accepted: chrome design must absorb every accent + dark/light
combo. Bounded by hand-picking the accent set. Accents introduce a
new `[data-accent=…]` mechanism (does not exist today) — accent
palette scales borrowed from Radix Colors (MIT) rather than designed
from scratch.

### 4. State persistence

- **Component state** (Variants + Content selections in the toolbar)
  → URL params. Reload survives. URL is shareable. Aligns with
  composer-alpha.md's permalink direction.
- **Theme state** (dark/light, accent, radius) → localStorage. Global
  to the user's session; not part of any individual component's
  reproducible state.

Edge accepted: a shared URL renders the URL'd Component state in the
recipient's own theme. Component config is the artifact being shared;
theme is the recipient's environment.

### 5. "Get code"

A per-Component action that opens a popover with two tabs:

- **Code** — the source for the current toolbar state (JSX with
  Variants + Content materialised). Emitted automatically from the
  Entry schema.
- **Install** — sub-tabs for CLI command (`npx shadcn add …`) and
  Manual installation (matches existing docs pattern). Static
  per-Component metadata.

This makes the install path one click from any demo, which is the
specific reason `/docs` can be hidden without losing the user who
loves the demo.

### 6. Introduction page scope

The default view when a user hits `/` without selecting a Component.
Minimal + Quickstart:

- Tagline + 2-paragraph "what is Ora"
- Install command
- Token setup snippet
- One first-component example with copy-paste

Philosophy / principles deferred — they live in the contributor docs,
not the visitor surface. The sidebar is inviting enough that visitors
who want to _try_ the system click a Component immediately;
Introduction serves the minority who want grounding first.

### 7. Examples deferred to v1.1

The framework recognises **Examples** as a third category (showcase
compositions demonstrating product scenarios — a settings panel, an
onboarding step, a billing form). Examples are product surface, not
docs, and will land as their own sidebar section.

Deferred from v1 to keep the build focused on Components. Examples'
shape captured in `CONTEXT.md` so the v1 sidebar reserves room for
the section without scaffolding it now.

### 8. Build approach

Vertical slice through one Component first — **Button** — including:

- Schema runtime
- Header theme controls
- Sidebar with one entry
- Preview + Toolbar layout
- "Get code" with both tabs

Ship `/` with Button-only and a "more components coming" affordance.
Then migrate remaining Entries one by one. Reasons:

- Button forces the schema design against the hardest case (its
  icon-position Content template would have been the bespoke-render
  escape hatch under an inferior schema model; see ADR-0005).
- End-to-end demo running in days, not weeks. Layout/UX correctable
  before the cost of 12 more Entry migrations is sunk.
- "Demo with one Component" is still impressive when the rest of the
  UI is polished.

## Alternatives considered

### Keep all three surfaces, polish per-Component docs

Rejected. Doubles down on the cost without resolving the "wow moment
is buried" problem. The system's pitch is interactive; the docs read
is not the strongest form of it.

### Keep separate Landing, make Playground a sub-route

Rejected. Funnel friction with no payoff at pre-alpha (no SEO to
protect, no audience to convert). The visitor we want — someone
evaluating Ora — is better served dropped straight into the thing.
Post-alpha may revisit.

### Theme controls inside the Playground (per-Component panel)

Rejected. Placement sets expectation. A theme panel inside the
playground implies "this controls only this component's preview,"
which would require scoping tokens to a preview wrapper and locking
chrome to a fixed look. Header placement signals "global" and lets
chrome dogfood the system. Cheaper to build, stronger demo moment.

### "Get code" emits only an install command (no live snippet)

Rejected. Snippet of the current toolbar state is the satisfying
loop that makes the playground worth using. Static install command
alone is a downgrade from the play experience.

### Toolbar exposes CSS-variable and data-slot knobs

Rejected for v1. Props alone are enough to demonstrate the system's
core thesis; CSS-variable knobs require per-Component descriptor
metadata that does not exist yet; data-slot overrides are a
power-user escape hatch better explained in prose than dial-able in
a demo.

### Categorised sidebar (Forms / Overlays / Navigation / …)

Rejected for v1. Better discovery in theory but bikeshedding cost on
category names is real. Flat alphabetical matches shadcn convention
and ships immediately. Migrate to categories in v1.1+ if/when
Component count makes the flat list painful.

## Consequences

**Positive:**

- One demo URL is the entire pitch.
- Hidden docs route removes editorial-debt pressure on per-Component
  prose — energy redirects to schema-driven Entry quality.
- Theme controls' global placement forces (and demonstrates) the
  cascade behaviour PRINCIPLES describes ("global constraints, local
  flexibility").
- Vertical-slice build means a working demo in days; surface decisions
  validated against a real user flow before scaling.
- composer-alpha.md Phase 1 is delivered as a side-effect of this work
  — the configurator-per-primitive shape is preserved; it just lives
  at `/<component>` instead of `/docs/<component>`.

**Negative:**

- Chrome design is now constrained by the theme matrix (every
  accent × dark/light combo must look intentional). Bounded by
  hand-picking accents.
- Existing `landing/` slice and `docs/` slice content go dormant.
  Maintenance cost is zero (no code change required to keep them
  buildable), but they accumulate stale-doc risk until reactivated or
  deleted.
- Visitors expecting `/docs/<component>` URLs from external links
  (none exist yet — pre-alpha) would 404. Not a real cost today;
  worth a redirect map when docs reactivate.
- Per-Component Entry quality becomes a single point of failure. A
  bad Entry now sits _on the homepage_, not buried in docs. Quality
  bar rises.

## Followups

- ADR-0005 — schema-driven Playground entries. Captures how Variants
  and Content are encoded so the toolbar and code emitter can be
  generic.
- v1.1 — Examples section in sidebar. Pattern-focused (product
  scenarios), not brand-clone. Single-command install via shadcn
  registry entry per Example.
- `landing/` and `docs/` slice cleanup. Decide whether to delete or
  preserve once v1 is shipped and the shape has settled.
