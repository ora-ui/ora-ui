# ADR-0008: Token architecture (scale foundation, semantic API, inline theme retargeting)

## Status

Proposed — 2026-06-09

## Relationship to ADR-0008 (interim role layer)

This ADR sits alongside `0008-interim-role-layer-for-tokens.md`. The
two share a number; they cover different cuts of the same decision:

- **The interim ADR is the contract**: the 18-token semantic layer
  shape, naming convention (rest/interactive split + ordinal ladders
  - adjective triads, refined below), the layout-vs-ui borders
    distinction, the alpha-modifier escape-hatch policy, and the
    rejection of Radix-12 as a _cross-theme_ contract.
- **This ADR is the implementation strategy** for Ora's base theme:
  how the scale layer is sourced (Radix step semantics for gray and
  custom accents), how `[data-theme]` retargeting works without an
  intermediate role-binding layer, how docs serve as the spec, how
  promotion of new semantic tokens is governed, and how migration
  sequences.

Read both. Where they appear to disagree, the interim ADR wins on
contract questions (token names, naming convention, theming model);
this ADR wins on implementation questions (how the scale layer is
authored, how `[data-theme]` blocks resolve, migration sequencing).

## Context

Ora's current token system (documented in `docs/conventions/TOKEN-SYSTEM.md`)
defines semantic tokens directly with hex values and uses a per-theme
alias layer to support themed components:

```css
:root {
  --ui: oklch(0 0 0 / 0.059);
  --accent-ui: var(--accent-3);
  /* ...one --accent-* alias per semantic token... */
}

[data-theme='accent'] {
  --ui: var(--accent-ui);
  --hover: var(--accent-hover);
  /* ...one remap per token... */
}
```

This shipped, works, and has carried Ora through pre-alpha. Three
observations from continued use forced a rethink:

- **Alpha-modifier escape hatches accumulate.** Components reach for
  `bg-ui/50` or `text-foreground/50` whenever a token doesn't quite
  fit. The opacity modifier is doing the work a real semantic token
  should do — and it doesn't survive theme swaps cleanly (alpha on a
  light surface ≠ alpha on a dark surface).
- **The alias layer (`--accent-ui`, `--accent-hover`, `--accent-fill`,
  `--accent-line-ui`, `--accent-ui-label`, etc.) doubles the surface
  area** of the token system without adding a layer of meaning.
  Adding a new semantic token requires defining it twice (base +
  accent) plus a third line in every `[data-theme]` block.
- **No principled foundation for the semantic tokens to _derive_
  from.** Values are hand-picked per token. Step relationships
  between tokens (`--hover` slightly darker than `--ui`, `--active`
  slightly darker again) are implicit, not enforced by structure.

Radix Colors solves the foundational layer well: a 12-step scale per
palette, each step assigned a designated use case (3 = ui element
background, 4 = hovered ui, 5 = active ui, 6 = subtle border,
7 = ui border, 9 = solid fill, 11 = low-contrast text, 12 = high-
contrast text). Adopting it gives the semantic tokens a place to read
_from_.

## Decision

Adopt the three-tier architecture established in the interim ADR
(Scale → Semantic → Component vars), with theme switching happening
at the semantic-token site via inline retargeting under `[data-theme]`.
Component vars are out of scope for this ADR and covered case-by-case
as components grow.

### Layer 1 — Scale (foundation)

Concrete color scales. For Ora's base theme:

- **Gray**: track Radix's step semantics. Eleven steps,
  `--gray-1`..`--gray-11`, plus alpha variants `--gray-a1`..`--gray-a11`.
  Radix's step 1 (the app-background floor) is omitted at the scale
  layer — that role is held by the semantic `--background` token, not
  re-exposed as a scale step. The old `--gray-base` retires.
- **Accent palettes** (blue, indigo, etc.): custom values authored
  in Ora's codebase via Radix's color generator as a sketching tool,
  then vendored as Ora's values. No runtime dependency on
  `@radix-ui/colors`.

Scale tokens are intentionally exposed. Components and consumers can
reach for them as a documented escape hatch when no semantic token
fits (see "Semantic-first rule" below). The previous concern about
scale-token bloat in the consumer interface is treated as something
that earns its keep through real complaints, not something hidden
preemptively.

**Cross-theme note:** Radix step semantics are _Ora's base-theme
implementation_, not the contract. Per the interim ADR, the 18 token
roles are the cross-theme contract; other themes (game UI, brutalist,
RYBitten-style) may map those roles to their own scale shapes that
don't follow a lightness ramp at all.

### Layer 2 — Semantic (API)

The 18-token semantic layer defined in the interim ADR. This is the
consumer-facing API; components reach for these first when authoring
styles.

The current set, with naming refinements landed alongside this ADR:

```
Backgrounds & Surfaces:  --background, --subtle, --surface-1, --surface-2, --overlay
UI:                      --ui-subtle, --ui
Interactive:             --interactive-subtle, --interactive, --interactive-strong
Solid:                   --solid, --solid-interactive
Borders:                 --separator, --border-subtle, --border, --border-strong
Focus:                   --ring
Foreground:              --primary, --secondary, --ui-label, --on-solid
```

These read from the gray scale by default:

```css
:root {
  --ui-subtle: var(--gray-a2);
  --ui: var(--gray-a3);
  --interactive-subtle: var(--gray-a3);
  --interactive: var(--gray-a4);
  --interactive-strong: var(--gray-a5);
  --solid: var(--gray-11);
  --solid-interactive: var(--gray-10);
  --border-subtle: var(--gray-a6);
  --border: var(--gray-a7);
  --border-strong: var(--gray-a8);
  --ui-label: var(--gray-11);
  /* …etc */
}
```

### Naming convention (refinement on the interim ADR)

The interim ADR established "ordinal ladders + rest/interactive split."
Continued work surfaced a sharper underlying rule that absorbs both
patterns and resolves what to do when a family has more than two steps:

- **Bare name = the token to reach for by default.** Most call sites
  get the short name; specialised cases pay the suffix cost.
- **Capped family with a default** → adjective triad
  (`-subtle`, bare, `-strong`). Suffixes mark deviations from the
  default. Used where steps represent qualitatively different intents
  at the same role: `--ui-subtle/--ui`, `--interactive-subtle
/--interactive/--interactive-strong`, `--border-subtle/--border
/--border-strong`.
- **Elastic family** → ordinal. Used where elevation, weight, or
  other axes are intrinsically extensible:
  `--surface-1/--surface-2/--surface-N`. (No member of the elastic
  family currently exceeds 2; the ordinal pattern leaves room.)
- **Rest + single interaction weight pair** → bare + `-interactive`
  suffix: `--solid/--solid-interactive`.

The honest test for adjective vs ordinal: do the steps represent
_different intents_ or _different intensities of the same intent_?
Different intents → adjective triad. Different intensities → ordinal.

Borders use adjective because Radix's documented step roles (6 =
decorative line, 7 = ui element border, 8 = hovered/emphasised
border) are qualitatively distinct. Interactive uses adjective
because the bare-name-as-default property genuinely matters here —
step 4 is the typical hover weight; ordinal naming (`--interactive-1`
at step 3) would mislead users into treating the edge-case weight as
the default.

### Theme switching — inline retargeting, no role-binding layer

`[data-theme]` blocks retarget semantic tokens directly to the chosen
accent's scale, without an intermediate role-binding token like
`--gray-ui` or `--accent-ui`:

```css
[data-theme='accent'] {
  --ui-subtle: var(--blue-a2);
  --ui: var(--blue-a3);
  --interactive-subtle: var(--blue-a3);
  --interactive: var(--blue-a4);
  --interactive-strong: var(--blue-a5);
  --solid: var(--blue-9);
  --solid-interactive: var(--blue-10);
  --border-subtle: var(--blue-a6);
  --border: var(--blue-a7);
  --border-strong: var(--blue-a8);
  --ui-label: var(--blue-a11);
  /* …etc */
}
```

The `--gray-ui` / `--accent-ui` / etc. role-binding tokens currently
in `globals.css` retire as part of the migration. Adding a new themed
semantic token means: define it under `:root` reading from the gray
scale, add a line per `[data-theme]` block reading from that theme's
scale. No third definition step.

Not every semantic token belongs in `[data-theme]`. Chrome-level
surface tokens (`--background`, `--subtle`, `--surface-1`,
`--surface-2`, `--overlay`) stay neutral regardless of accent — they
appear under `:root` only and are absent from theme blocks
intentionally.

Dark mode is handled at the scale layer (`.dark { --gray-3: ...; }`)
per Radix's standard. Semantic tokens and `[data-theme]` blocks are
mode-agnostic — they read scale token names that self-swap.

### Step-parity is the default, not a rule

Most semantic tokens read the same step number across base and theme
blocks (`--ui` reads step 3 everywhere). Some do not, by design:
`--ui-label` reads step 11 in base but reads a different step (often
the alpha variant of step 11) in accent themes, because colored
accents at the deepest step oversaturate as label text.

These intentional step shifts are documented in TOKEN-SYSTEM.md, not
encoded in CSS. The CSS expresses what each token _is_; the docs
explain _why_.

### Semantic-first rule

Authors reach for semantic tokens first. When no semantic token fits,
they reach for the scale token directly _with intent_. Repeated
scale-direct reaches are the signal that a new semantic token should
be promoted.

The promotion decision is curator-held (a single human gatekeeper)
during the current phase. PRs that need a new tone use the scale token
in component code; the curator promotes to a semantic token in a
later batch when a real pattern has emerged. Enforcement of this rule
is convention only — no lint rule, no codemod tag — until component
count grows past easy PR review.

### Source-of-truth

`docs/conventions/TOKEN-SYSTEM.md` holds the spec for every token:
which palette and step it reads from in each context (base, each
`[data-theme]`), and the rationale for any step-shifts. Encoded as
tables per token domain so each token is one row, scannable and
diff-friendly.

CSS is the implementation. Agents and contributors are prompted to
read TOKEN-SYSTEM.md first and treat it as the contract; if CSS
disagrees with docs, the CSS is wrong.

No automated drift detector ships with this decision. Drift is a real
risk but bounded by the small token surface, the single curator, and
the table format (which makes "did this PR update the doc?" a fast
review question). The table-shaped spec is latent capability for a
future script if drift becomes a felt pain — addable without
restructuring the doc.

## Alternatives considered

### Keep the per-theme alias layer (status quo before this ADR)

Rejected. The alias layer added a definition tier without adding a
layer of meaning — every themed token had to be defined twice (base
value + `--accent-X` alias) and remapped a third time in each
`[data-theme]` block. The retargeting can be done directly under
`[data-theme]` reading from the scale, achieving the same end-result
with one fewer definition layer.

### Accent-as-role indirection (`--accent-N` binding under :root)

Rejected. This was a midpoint proposal: introduce a `--accent-1`
through `--accent-12` set of variables under `:root`, bound to a
specific palette (`--accent-3: var(--blue-3)`), and have semantic
tokens read from `--accent-N`. The idea was that switching the
app-level accent meant rebinding one set of 12 variables.

In Ora's current model, there is only ever one accent active at a
time at the app level, and themed components opt in per-component via
`data-theme="accent"`. The `--accent-N` indirection would carry no
runtime benefit (the rebinding still happens at the same place) and
would introduce a token tier without a real consumer. Inline
retargeting in `[data-theme]` blocks expresses the same intent more
directly.

### Pure scale exposure (no semantic layer)

Rejected. Components reading `bg-gray-a3` / `bg-blue-a3` directly
loses the semantic naming layer that makes intent legible at the read
site. `bg-ui` says "this is a ui surface"; `bg-gray-a3` says "this is
gray-3" and requires the reader to know that gray-3 is the ui-surface
step. Worse, it forces theme-awareness into every component (each one
would need to know which scale to read from per theme).

### Drift detection script with CSS-inline waivers

Rejected. Two reasons: (1) CSS files ship to end-user consumers via
the shadcn registry, so inline comments would land in their codebase
unless stripped at build time, adding tooling; (2) a hard
key-parity rule does not match reality (some semantic tokens
genuinely don't belong in `[data-theme]`), and waivers for every
neutral surface token would dilute the signal.

The docs-as-spec approach lets the spec express both expectations and
intentional exceptions without polluting consumer-owned CSS.

## Consequences

**Positive:**

- Semantic tokens have a principled foundation (Radix's step
  semantics) rather than hand-picked values per token.
- Adding a new themed semantic token = one definition under `:root` +
  one line per `[data-theme]` block. Half the surface area of the
  alias-layer approach.
- Alpha-modifier escape hatches (`bg-ui/50`) become symptoms to
  watch for — repeated reaches signal a missing semantic token.
- Scale tokens are an honest escape hatch when no semantic fits,
  rather than hidden alpha math.
- One less token tier (`--accent-ui` etc. retired) → less to learn,
  fewer places to update.

**Negative:**

- Drift risk between `:root` and `[data-theme]` blocks. Without an
  alias layer, the connection between "base `--ui`" and
  "accent `--ui`" is convention-enforced rather than structural. A
  later drift script can mitigate, but ships with this ADR as a
  deferred capability, not a built-in safeguard.
- TOKEN-SYSTEM.md becomes load-bearing — it's the source of truth
  for token spec, not just narrative. Drift between docs and CSS
  becomes a real bug class.
- Onus on the curator (single gatekeeper) to keep docs current with
  CSS, and to make semantic-promotion calls. Bottleneck risk if the
  curator's bandwidth shrinks.
- Migration cost: globals.css needs restructuring; TOKEN-SYSTEM.md
  needs rewriting; existing components keep working (they reference
  semantic tokens which still exist) but the underlying definitions
  shift wholesale.

## Followups

- **Phase 1 (additive prep, can ship anytime):** rename scale tokens
  in `colors.css` from Tailwind-style (`--gray-50`/`--gray-100`/...) to
  Radix step style (`--gray-1`..`--gray-11`, `--gray-a1`..`--gray-a11`).
  Drop `--gray-base` and the Radix step-1 floor; the `--background`
  semantic token holds that role instead. Verify Tailwind `@theme
inline` block + colors.css consumers are updated in lockstep so no
  utility class breaks.
- **Phase 2 (cut-over, one focused diff):** rewrite semantic tokens to
  read from scale directly, retire `--gray-ui` / `--accent-ui` / etc.
  role-binding variables, rewrite `[data-theme]` blocks to retarget
  inline against scale. Promote `--ui-subtle` (reads `--gray-a2` in
  base, `--blue-a2` under `[data-theme=accent]`) — the canonical
  example of an alpha-modifier escape hatch becoming a real semantic
  token. Apply the naming refinement: replace any
  `--interactive-1/--interactive-2` (interim ADR shape) with
  `--interactive-subtle/--interactive/--interactive-strong`; replace
  `--border-1/--border-2` with `--border-subtle/--border/--border-strong`.
- **Button as canary:** before sweeping other components, port Button
  to the new system and validate behaviour in light/dark, gray/accent
  contexts. Other components follow once Button confirms the system.
- **Migration is independent of the eager Entry-schema migration
  (ADR-0007).** They share no risk surface and should not be batched —
  coupling them lets either's iteration block the other.
- Rewrite `docs/conventions/TOKEN-SYSTEM.md` to use the table-per-
  domain spec shape. Each token = one row with base step, theme
  steps, notes for any step-shifts. Lands with Phase 2.
- Add prompt-level guidance for agents (likely in `AGENTS.md` or a
  token-focused convention doc) that says: read TOKEN-SYSTEM.md
  first when touching tokens; treat it as the spec; update the doc
  table in the same PR as any token change.
- Audit existing `bg-ui/50`-style alpha modifier usage after Phase 2.
  Each is a candidate for either a new semantic token (curator-
  promoted) or a documented scale-direct reach.
- Build a drift detection script if drift between docs and CSS
  becomes felt pain. The table format is designed to support this
  without restructuring.
