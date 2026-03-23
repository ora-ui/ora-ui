# Component Notes Guide

A component notes file lives in `notes/components/<component-name>.md`. Its purpose is to capture context that cannot be recovered from git history — decisions, uncertainties, and things worth watching as the component evolves.

---

## What belongs here vs in commits

**Commits explain what changed and why.** Notes explain what was debated, ruled out, or left open. If the reasoning behind a decision is obvious from the commit message or diff, it does not need to be here.

Ask before adding anything: _"Could someone recover this context from the commit log?"_ If yes, skip it.

---

## Sections

### Status

One or two sentences on where the component stands. Is it stable, in progress, blocked? What is still unresolved?

### Key Decisions

Decisions that required real deliberation and whose reasoning cannot be extracted from commit messages. These are the non-obvious calls — trade-offs made, alternatives rejected, constraints that shaped the design.

Keep entries short. One sentence for the decision, one for why. If a decision has an obvious explanation, leave it out.

### Open Questions

Things that are actively undecided. Each entry should state the question clearly and, if relevant, the options being considered. Remove entries once resolved — move the outcome to Key Decisions if it warrants recording.

### TODOs

Concrete, actionable items that are pending. Use checkboxes. Keep these specific — vague tasks belong in issues or a backlog, not here.

### Known Issues

Real problems with no clear resolution yet. These are bugs, edge cases, or breakages that have been observed and are not yet fixed. If you know the fix, it should be a TODO, not a known issue.

### Considerations

Things worth keeping an eye on that are not yet problems. Patterns that might cause friction later, design choices that could conflict with future components, or areas that may need revisiting as the system grows. Not urgent, not broken — just noted.

---

## What does not belong here

- Implementation details already readable from the code
- Decisions that are self-evident from the component's structure
- Historical notes about what was tried and reverted (that is what commit history is for)
- Anything that belongs in the component's inline code comments
