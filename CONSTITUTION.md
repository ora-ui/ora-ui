# Constitution

This document captures what Ora aims to be. It is not about implementation
details — those belong in [Principles](docs/PRINCIPLES.md) and
[Conventions](docs/conventions/INDEX.md). This is about the vision, the
audience, and the gap Ora exists to fill.

## Vision

We want to see a web that is more accessible, more usable, and more
thoughtfully designed. We want to see more care put into products — not
just in how they look, but in how they work.

Too many tools focus on form at the expense of function. They optimize
for visual polish while ignoring the hard problems: accessibility, focus
management, internationalization, error handling, keyboard navigation.
These are the cross-cutting concerns that make products actually work for
real people in real contexts.

Ora exists to close this gap.

## What Ora Is

Ora is a library of styled primitives and patterns for building products
that prioritize accessibility and usability.

We go beyond components. Primitives (buttons, inputs) are the foundation,
but they are not the goal. The goal is to help teams build complete,
functional interfaces — from the input field up to the full page — with
accessibility and usability embedded at every layer.

### The Layer Model

Ora provides building blocks at multiple levels of composition:

- **Primitives** — Atoms like button, input, checkbox. Styled wrappers
  around accessible Base UI primitives.
- **Blocks** — Molecules like input with label, button group, provider
  button list. Small compositions of primitives.
- **Sections** — Organisms like an auth form, a settings panel, a contact
  form. Functional units that solve a specific UX problem.
- **Pages** — Full views like a sign-up page or a settings page. The
  highest level Ora ships.

Flows (multi-page sequences like a complete sign-up flow) are implicit.
Ora makes pages composable and easy to wire into flows, but the
orchestration — routing, state persistence, business logic — lives in
your codebase.

### Cross-Cutting Concerns

These are not features to ship. They are design principles — the things
we think about when composing any pattern at any layer:

- **Accessibility** — WCAG 2.1 AA is the bar. Focus management, ARIA
  attributes, keyboard navigation, screen reader support.
- **Reduced motion** — Respected at the primitive level. Animations are
  opt-in, not opt-out.
- **Internationalization** — Considered in design (RTL layouts, text
  expansion, cultural expectations). Concrete features come as the
  project matures.
- **Error handling** — Clear, accessible error states.
- **Loading states** — Predictable feedback during async operations.

As Ora matures and knowledge grows, some of these will become concrete
features. For now, they are embedded in how we design.

## Who Ora Is For

Ora is for builders who want to ship products that work well — not just
products that look acceptable.

Specifically:

- **Solo developers** building side projects or MVPs who want accessible
  defaults without researching every ARIA pattern.
- **Indie developers** who care about craft but don't have time to build
  everything from scratch.
- **Early-stage teams** who want to move fast without accumulating
  accessibility or usability debt.

If you want a component library that just gives you styled buttons, there
are plenty of options. If you want patterns that encode real design
thinking about how products should work, Ora is for you.

## How Ora Is Different

Most component libraries stop at primitives — here's a button, here's an
input, good luck composing them. The burden of making them work together
accessibly falls on you.

Ora provides opinionated compositions — patterns at the section and page
level that encode decisions about accessibility, usability, and UX. These
are not black boxes. You own the code. But you start from a foundation
that has already thought through the hard problems.

The value is not just the code. It is the knowledge behind the code —
the rationale for why patterns are built a certain way. Over time, this
knowledge grows through documentation, articles, and community learning.

## Distribution

Ora is distributed through the shadcn registry. You can install patterns
via CLI or copy-paste. Either way, you own the code and can modify it
freely. Documentation provides best practices and rationale for
customization.

## Open Source

Ora is open source. The project is currently in early development,
building the foundation. Community governance will follow as the project
matures.

Contributions are welcome. For bug fixes, open a PR. For new features or
patterns, start a discussion first to ensure alignment with the vision.
See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## First Focus: Forms

The first major effort is Ora Forms — a collection of form patterns that
showcase Ora's approach across different contexts:

- Authentication flows (sign-up, sign-in)
- Contact forms
- Settings pages (notifications, preferences)
- Other common form patterns

Forms are the connective tissue of most products. They exercise the full
range of interactive components (input, checkbox, radio, switch, button)
and require careful attention to validation, error states, and
accessibility. Getting forms right proves the model.
