# ADR-0008: Token architecture (scale foundation, semantic API, inline theme retargeting)

## Status

Proposed — 2026-06-08

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

Restructure tokens into two layers, with theme switching happening at
the semantic-token site via inline retargeting under `[data-theme]`.

### Layer 1 — Scale (foundation)

Concrete color scales using Radix's step semantics:

- **Gray**: track Radix's gray scales directly (`--gray-1` through
  `--gray-12`, plus alpha variants `--gray-a1`..`--gray-a12`).
- **Accent palettes** (blue, indigo, etc.): custom values authored
  via Radix's color generator, holding the same step semantics as
  the Radix scales. This preserves brand identity while keeping the
  step contract.

Scale tokens are intentionally exposed — components and consumers can
reach for them when no semantic token fits, as a documented escape
hatch (see "Semantic-first rule" below).

### Layer 2 — Semantic (API)

Semantic tokens (`--ui`, `--hover`, `--fill`, `--line-ui`, etc.)
defined once under `:root`, reading from the gray scale by default:

```css
:root {
  --ui: var(--gray-a3);
  --hover: var(--gray-a4);
  --active: var(--gray-a5);
  --fill: var(--gray-12);
  --ui-label: var(--gray-12);
}
```

These are the consumer-facing API. Components should reach for these
first when authoring styles.

### Theme switching — inline retargeting, no alias layer

`[data-theme]` blocks retarget semantic tokens directly to the chosen
accent's scale, without an intermediate alias:

```css
[data-theme='accent'] {
  --ui: var(--blue-a3);
  --hover: var(--blue-a4);
  --active: var(--blue-a5);
  --fill: var(--blue-9);
  --ui-label: var(--blue-a11);
}
```

The `--accent-ui` / `--accent-hover` / `--accent-fill` alias-layer
tokens are retired. Adding a new themed semantic token means: define
it under `:root` reading from the gray scale, add a line per
`[data-theme]` block reading from that theme's scale. No third
definition step.

Not every semantic token belongs in `[data-theme]`. Chrome-level
surface tokens (`--background`, `--surface`, `--overlay`) stay neutral
regardless of accent — they appear under `:root` only and are absent
from theme blocks intentionally.

### Step-parity is the default, not a rule

Most semantic tokens read the same step number across base and theme
blocks (`--ui` reads step 3 everywhere). Some do not, by design:
`--ui-label` reads step 12 in base but step 11 in accent themes,
because colored accents at step 12 oversaturate as label text.

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

- **Phase 1 (additive prep, can ship anytime):** introduce scale tokens
  in `globals.css` alongside the existing semantic + role-binding
  setup. No behavior change; lets value choices be spot-checked in
  isolation.
- **Phase 2 (cut-over, one focused diff):** rewrite semantic tokens to
  read from scale, retire the `--gray-ui` / `--accent-ui` / etc.
  role-binding variables, rewrite `[data-theme]` blocks to retarget
  inline. Phase 2 also promotes `--ui-subtle` (reads `--gray-a2` in
  base, accent-2 under `[data-theme=accent]`) — the canonical example
  of an alpha-modifier escape hatch becoming a real semantic token.
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
- **Scale source:** all scale values are custom-authored in Ora's
  codebase. The Radix color generator is used as a sketching tool;
  its output is vendored into Ora's `colors.css` as Ora's values, not
  imported from `@radix-ui/colors`. Keeps full control over the
  scale and avoids a runtime dependency.
