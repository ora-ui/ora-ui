# ADR-0008: Interim role layer for the token system

## Status

Proposed — 2026-06-04

## Context

The current token system mixes three layers — palette (`--gray-*`,
`--accent-*`), semantic roles (`--ui`, `--fill`, `--hover`, `--primary`),
and component usage (`bg-ui`, `border-line-ui`) — without crisp contracts
between them. Friction has surfaced as the component set has grown:

- **Opacity escape hatches everywhere.** `bg-fill/90`, `bg-fill/80`,
  `bg-hover/50`, `bg-ui/25`, `ring-primary/15`, `border-primary/10` —
  each one a "the palette doesn't have the step I need" workaround.
  When this many components reach for the same kind of hack, the
  palette is the wrong shape.

- **Deprecation purgatory.** `--line-ui` marked deprecated in favour
  of `--ring`, but every component still uses it. `--muted` annotated
  "may deprecate — TBD" with an identical value to `--secondary`.
  Floating "may be removed" tokens in a contract layer block decisions
  downstream and rot fast.

- **Names too literally tied to interaction states.** `--hover` and
  `--active` encode a state contract — "use this for hover" — but in
  practice components want the same _tone_ for different states. A
  Toggle's pressed state visually wants the hover weight, not the
  active weight; an Accordion's expanded state wants hover. The
  workaround was `active/75`, `hover/50` — alpha modulation to wrong-name
  a tone into a different state. The state-name was the bug, not the
  alpha.

- **Naming axes mixed.** `--primary`/`--secondary` mean text hierarchy
  in Ora but brand fill almost everywhere else. `--fill` is actually a
  _solid_ (used by solid buttons) but the name is generic. `--ring`
  was overloaded between focus indicator and decorative border. Each
  ambiguity costs a moment of "which one do I reach for" per use.

- **Asymmetric palette coverage.** Gray has `--gray-line`,
  `--gray-line-subtle`, `--gray-background`, `--gray-overlay`. Accent
  doesn't. Themed components silently fall back to gray for missing
  steps or escape to `primary/15`. The theme contract isn't enforced
  because the shape isn't symmetric.

A separate concern surfaced underneath the friction: the system's
forward path. Ora wants to support theming approaches beyond
Radix-style product UI — game UI, expressive personal sites,
RYBitten-derived palettes — without forking the component set per
theme or rebuilding the token system each time. Whatever shape we
land on has to be a _contract_ themes can implement, not a baked-in
philosophy.

## Decision

Adopt a three-tier token architecture with a small, fixed-shape
semantic layer in the middle:

1. **Scale (palette)** — palette steps per hue. Pure values. A theme
   is a scale implementation. Existing `--gray-*` and `--accent-*`
   palettes stay; new themes plug in by providing scale values.

2. **Semantic layer** — small set of named roles, mapped onto scale
   steps. This is what components read. Themes reimplement this layer
   to swap aesthetics; the role names and their intent stay constant.

3. **Component vars** — opt-in per-component CSS custom properties for
   expression that isn't covered by the semantic layer (shadows,
   blurs, decoration). Default to semantic roles; overridable in
   isolation. Out of scope for this ADR; covered case-by-case as
   components grow.

### The semantic layer — 18 tokens

| Domain                | Tokens                                                                | Notes                                                                                                                                                                                                                        |
| --------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Background & Surfaces | `--background`, `--subtle`, `--surface-1`, `--surface-2`, `--overlay` | `--subtle` is a solid surface one notch above the floor. `--surface-N` is an ordinal ladder (1 = subtle raised → 2 = most raised). `--overlay` matches `--background` in light, steps up to the first solid surface in dark. |
| UI                    | `--ui`, `--interactive-1`, `--interactive-2`                          | Soft interactive container, alpha-based. `--ui` rests; `--interactive-N` are its interaction weights. Bare `--interactive` aliases step 1.                                                                                   |
| Solid                 | `--solid`, `--solid-interactive`                                      | Emphatic fill: a resting fill plus its interaction weight. Replaces the `bg-fill/90` hover hack. Deeper states handled per-component.                                                                                        |
| Borders               | `--separator`, `--border-1`, `--border-2`                             | `--separator` is solid (layout/structural). `--border-N` are alpha (ui-element borders that tint with theme). Bare `--border` aliases step 1.                                                                                |
| Outline               | `--ring`                                                              | Focus ring and decorative outlines. One value works for solid backgrounds via outline-offset.                                                                                                                                |
| Foreground            | `--primary`, `--secondary`, `--ui-label`, `--on-solid`                | Covers text and icon fills. `--primary`/`--secondary` are the two-tier hierarchy. `--ui-label` and `--on-solid` are contextual companions, used when painting on `--ui` and `--solid` surfaces respectively.                 |

(Bare aliases `--interactive`, `--border` are ergonomic duplicates of step 1, not counted in the 18.)

### Naming convention: ordinal ladders + a rest/interactive split

Two shapes, each applied where it is honest:

- **Ordinal strength** where a true intensity ladder exists
  (`--surface-N`, `--border-N`): named by intensity, not by which
  state they "belong to". A component maps any state to any level by
  visual intent.
- **Rest / interactive split** where the meaningful distinction is
  interaction rather than raw intensity (`--ui` vs `--interactive-N`,
  `--solid` vs `--solid-interactive`): the resting token is where a
  control sits, the interactive token(s) where it goes when touched.

The original draft made everything a pure ordinal ladder (`--ui-N`,
`--solid-N`). In practice the soft-container and solid families have a
clear rest state plus one or two interaction weights, and naming them
`--ui` / `--interactive-N`, `--solid` / `--solid-interactive` reads
truer than `--ui-1/2/3`. The interaction problem the ordinal scheme
was solving lived in the old `--hover` / `--active` _state_ tokens, not
in `--ui` itself — so `--ui` returns as the single resting container,
and the interaction weights become an ordinal `--interactive-N`
sub-ladder.

Which state reads which token stays a component decision (e.g. a
Toggle's pressed state may read `--interactive-1` rather than the
deeper weight). States past what the tokens name are handled via alpha
or component vars. This is the fix for the `active/75`, `bg-fill/90`
escape-hatch family.

### Layout vs ui borders: solid vs alpha

`--separator` is solid; `--border-N` are alpha. The value-type
distinction _is_ the role distinction:

- Solid separators are for layout/structural lines (between sections,
  panel edges, table rows). They don't need to tint with theme — they
  belong to the page chrome.
- Alpha borders are for interactive ui elements (inputs, outline
  buttons, decorative hairlines on themed surfaces). They tint
  correctly when a parent sets `data-theme="accent"`.

Subtle/strong modulation on either is handled by alpha escape hatch,
not new tokens.

### Alpha modifiers as a sanctioned escape hatch

Components are free to use `bg-ui/50`, `bg-interactive-1/50`, `border-border-1/80`
etc. for **subtle contextual modulation of the same role**. The
canonical case: a surface button variant has a border, so its
container fill wants less weight than a soft button's container fill
— same role, slightly softer. Adding a fourth strength level for
"border-compensated" would inflate the contract; alpha modulation is
honest.

The line between sanctioned modulation and "missing token" is intent:

- Sanctioned: same role, contextually softer/stronger because of an
  adjacent affordance.
- Missing token: reaching for a value that conceptually wants its own
  name (e.g. `bg-fill/90` for solid button hover — the fix was to add
  `--solid-interactive`, not normalise the hack).

### Theme remapping

`[data-theme="X"]` continues to remap the semantic layer onto themed
scales. The 18-token contract means each themed palette must
implement the same set of slots — no more asymmetric coverage. New
themes (success, warning, a brand palette, an entire alternative
aesthetic) implement the same 18 slots.

## Alternatives considered

### Pure scale at base, no semantic layer

Each component would surface its own token interface (`--button-bg`,
`--button-fg`, …) mapped onto raw scale steps; shared interfaces
between component families would carry consistency.

Rejected. Three problems:

1. Cohesion is no longer enforced. Two components both rendering
   "soft container hover" might land on different scale steps because
   nothing forces alignment. Component drift over time.
2. Theming explodes. A theme wanting "everything a bit warmer" has
   to override `--button-*`, `--input-*`, `--card-*`, … even when the
   intent is "same change everywhere". The semantic layer collapses
   that into one or two lines.
3. Tailwind ergonomics suffer. `bg-ui hover:bg-interactive-1` reads
   beautifully; `bg-[--button-bg] hover:bg-[--button-bg-hover]`
   doesn't. The semantic layer lets utility classes stay terse.
4. The "shared interfaces" rescue recreates the role layer at a less
   rigorous level — fragmented and informal. The problem doesn't
   disappear, it shifts.

### Keep state names, redefine them as "default mapping not contract"

Keep `--ui-hover`/`--ui-active`, document that components may map any
interaction state to any level by intent.

Rejected as the _wholesale_ scheme. Naming every level after a
specific interaction state (`--ui-hover` used for a pressed state) is
too clever for a contract layer 30+ contributors touch. But the final
design is not pure-ordinal either: it keeps ordinal where a real
intensity ladder exists (`--surface-N`, `--border-N`) and uses a
rest/interactive split where interaction is the actual distinction
(`--ui`/`--interactive-N`, `--solid`/`--solid-interactive`).
`--interactive` is not a specific-state name — it's "the interacted
weight", with the exact state→token mapping left to the component.
That keeps the honesty (the name describes what the value is) without
forcing soft-container and solid fills through an awkward `-1/2/3`
ladder.

### Radix-12 ramp as the contract

Adopt Radix's canonical 12-step scale semantics (1 = app bg, 2 =
subtle bg, …, 12 = high-contrast text) as the contract; semantic
roles become aliases onto steps.

Rejected. Bakes a specific philosophy (lightness ramps) into the
contract. Game UI doesn't ramp on lightness — it picks deliberate
neon hues. Brutalist themes may want `hover == rest` (no affordance
via colour). RYBitten ramps on perceptual hue. Forcing all of them
through a 12-step lightness ladder defeats the goal of supporting
different theming approaches.

The 12-step ramp is fine as _one implementation strategy_ a theme
can use internally, but it isn't the right shape for the contract
itself.

### Path B foreground naming (`--foreground`/`--muted`)

Replace `--primary`/`--secondary` with `--foreground`/`--muted` to
sidestep the shadcn semantic collision (where `--primary` typically
means brand fill, not text).

Rejected. `--muted` doesn't survive theme remapping — when
`[data-theme="accent"]` remaps the second text token, the value is a
vibrant accent step, not a muted gray. Calling it `--muted` would
lie in every themed context. `--secondary` is theme-neutral: it just
means "second tier", and the remap is honest.

### Three text tiers (`--primary`/`--secondary`/`--muted`)

Keep all three with differentiated values; scope by usage (secondary
for prose, muted for ui captions/helpers).

Rejected. The current values for `--secondary` and `--muted` are
identical in source — a smoking gun that the distinction isn't
real. Collapsing to two tiers (`--primary`, `--secondary`) is the
honest move; if a third level proves necessary, add it deliberately
later.

### Documenting `--on-solid` and `--ui-label` as their own "Pairs" domain

Treat contextual foreground tokens as a separate category, distinct
from text tokens.

Rejected. They're foreground values used in the same situations as
`--primary`/`--secondary` — a reader looking for "what colours my
text/icon on a ui surface" finds them all together if they live in
the Foreground domain. A separate Pairs category fragments the
mental model.

## Consequences

**Positive:**

- 18 semantic tokens, down from ~25. Less to remember, fewer
  ambiguous reaches.
- A rest/interactive split (`--ui`/`--interactive-N`,
  `--solid`/`--solid-interactive`) plus ordinal border/surface ladders
  kill the `bg-fill/90` / `bg-ui/25` opacity-hatch family.
- Components are free to map any interaction state to any interactive
  weight by visual intent. No more state-name mismatch hacks.
- Layout vs ui distinction encoded in `--separator` (solid) vs
  `--border-N` (alpha). The value type _is_ the role.
- Theme remapping contract is uniform — every themed palette
  implements the same 18 slots. New themes (game, expressive,
  RYBitten-style) drop into the same shape.
- Alpha modulation becomes a sanctioned, documented escape hatch for
  same-role contextual softening, rather than a smell.

**Negative:**

- Every component using current tokens needs a port pass to the new
  names. Mechanical, but it's work.
- "Sanctioned escape hatch vs missing token" is a judgment call at
  the margins. The intent test (same role, contextually softer? vs
  reaching for an unnamed value?) resolves most cases; reviewers
  call out ambiguous ones during PR review.
- `--secondary` without a sibling `--primary` still reads "secondary
  to what?" in isolation. Mitigated by docs placing them together;
  not solved.
- Consumers who installed components under the old token names face
  a one-time migration. Documented in migration notes.

## Followups

- Full rewrite of `docs/conventions/TOKEN-SYSTEM.md` against the
  three-tier model, the 18-token contract, the naming convention,
  and the alpha-modifier policy. Absorbs the existing
  `Performance Contract` section's radius warning as a one-liner
  inside the Radius section; drops the rest.
- Update worked examples in `docs/conventions/INDEX.md` (theming
  pattern, CVA snippet, token usage note) to use new token names.
- Swap the canonical "intent over scale" example in
  `docs/PRINCIPLES.md` from `--hover` vs `--gray-200` to
  `--separator` vs `--gray-400` — preserves the principle without
  the ordinal-name ambiguity.
- Update the one-line token reference in
  `docs/COMPONENT-GUIDE.md`.
- Add `Semantic layer` and `Scale` glossary entries to
  `CONTEXT.md`. They are contributor-meaningful terms (consistent
  with how `Slice`, `Manifest`, etc. are scoped).
- Port components to the new token names. The Reference
  Implementations list in `docs/conventions/INDEX.md` updates
  organically as components migrate. No separate migration doc
  needed.
- Component-scoped CSS custom properties (the third tier) are
  covered case-by-case as components grow. A future ADR may
  consolidate conventions once enough cases exist; not blocking
  this decision.
- Avatar-group / overlapping-ui solid-bg needs are deferred to the
  component-vars path. Not a system-token concern.
