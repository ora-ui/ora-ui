---
name: write-a-doc
description: Create well-structured documents for the CLAUDE.md hierarchy with proper placement, routing hints, and progressive disclosure. Use when user wants to create, write, or add a doc that will be referenced by CLAUDE.md or another doc in the hierarchy.
---

# Write-a-Doc

Produce markdown documents that work well within a CLAUDE.md hierarchy. This skill handles structure and placement — the invoking prompt provides the content.

## Core Principles

These govern every doc you produce. Internalize them; don't just follow mechanically.

**Earn every line.** Each line must change agent behavior. If removing a line wouldn't cause mistakes, cut it. A 30-line doc that's fully absorbed beats a 200-line doc that gets skimmed.

**Frame positively.** Tell the agent what TO DO, not what to avoid. Positive instructions generalize better and reduce ambiguity.

```
Bad:  "Don't commit without running tests."
Good: "Run `npm test` before every commit. Commit only when tests pass."
```

**Be concrete and verifiable.** A colleague with no context should be able to follow every instruction without guessing. If an instruction could mean two different things, rewrite it.

```
Bad:  "Follow good commit practices."
Good: "Write commit messages in conventional-commit format: `type(scope): description`"
```

**Explain the why — briefly.** When a rule isn't obvious, a short rationale helps the agent generalize to edge cases. Keep it to one sentence.

```
"Run tests before committing — a broken main branch blocks the whole team."
```

**Use progressive disclosure.** Don't inline everything. Point to deeper resources (other docs, skills, reference files) and say when to consult them. The doc is a routing layer, not an encyclopedia.

**Show, don't just tell.** Where a pattern has a right and wrong way, include a short example. One good example replaces a paragraph of explanation.

## Document Structure

Every doc produced by this skill follows this skeleton. Sections are optional — include only what's needed.

```markdown
# [Doc Title]

[1-2 sentence purpose statement: what this doc is for and when to consult it.]

## [Section]

[Content — instructions, patterns, examples as needed.]

## Routing

[Links to deeper docs or skills, with one-line descriptions of when to follow each.]
```

### Structure rules

1. **Purpose statement first.** The opening lines tell the agent whether this doc is relevant to the current task. Make it scannable.
2. **Flat over nested.** Prefer H2 sections. Use H3 sparingly. If you need H4, the doc is too deep — split into separate docs.
3. **Routing section at the end.** If this doc references other docs or skills, collect those references in a closing Routing section. Each entry gets a one-line description of when to follow the link.
4. **No redundancy with CLAUDE.md.** If something already lives in CLAUDE.md, don't repeat it. This doc extends the hierarchy, not duplicates it.

## Placement in the Hierarchy

Before writing, determine where the doc sits:

- **CLAUDE.md** — Always in context. Reserved for things the agent needs in every single prompt: project identity, build commands, critical style rules. Target: as few lines as possible.
- **Top-level docs** (referenced by CLAUDE.md) — Loaded on demand when routing hints match the current task. This is where most docs live. Examples: `docs/WORKFLOW.md`, `docs/ARCHITECTURE.md`, `docs/UI.md`.
- **Nested docs** (referenced by other docs) — For deep detail on a subtopic. Examples: `docs/api/REST_CONVENTIONS.md`, `docs/testing/E2E_GUIDE.md`.

When you create a doc, also produce a **routing hint** — a one-liner ready to paste into whatever parent doc will reference it.

**Example routing hint output:**

```markdown
For [task context], see [path/to/doc.md].
```

Real examples:
```markdown
For workflow and task lifecycle, see docs/WORKFLOW.md.
For UI component patterns and styling, see docs/UI.md.
For API endpoint conventions, see docs/api/REST_CONVENTIONS.md.
```

## Writing Process

1. **Gather requirements** — ask the user about:
   - What is this doc's purpose? What agent behavior should it change?
   - Where does it sit in the hierarchy? What references it?
   - What other docs or skills should it route to?
   - Any existing content, notes, or rough ideas to start from?
2. **Clarify placement.** Determine the doc's level (CLAUDE.md, top-level, or nested) and what parent will reference it.
3. **Draft lean.** Write the minimum viable version. It's easier to add than to cut.
4. **Self-check.** Review every line against "earn every line" — would removing this cause the agent to make mistakes? If not, cut it.
5. **Review with user** — present draft and ask:
   - Does this cover your use cases?
   - Anything missing or unclear?
   - Should any section be more or less detailed?
6. **Confirm routing hint placement.** Output the one-liner for the parent doc, then ask the user which parent file to add it to (unless they already specified one).

## Examples

### Good: Tight, actionable, progressive disclosure

```markdown
# Workflow

Default task lifecycle for this project.

## Task Lifecycle

1. Read the plan in `/plans` if one exists for this task.
2. Explore relevant files before writing code.
3. Implement in small, testable increments.
4. Run `npm test` before each commit.
5. Write commit messages in conventional-commit format.
6. After the final commit, update `progress.md` with what was done and what's next.

## Commits

Commit at logical milestones — after each feature, fix, or refactor. Run tests first.

Use the /git-commits skill for commit formatting and validation.

## Routing

For UI component work, see docs/UI.md.
For API changes, see docs/api/REST_CONVENTIONS.md.
For deployment, see docs/DEPLOY.md.
```

### Bad: Bloated, vague, redundant

```markdown
# Project Workflow Guide

## Introduction

This document describes the workflow that should be followed when working
on tasks in this project. It is important to follow these guidelines to
ensure consistency and quality across the codebase. Please read this
entire document carefully before beginning any work.

## General Principles

- Always write clean code
- Make sure to test your changes
- Don't forget to commit your work
- Be careful with the codebase
- Follow best practices at all times

## Detailed Workflow Steps

### Step 1: Understanding the Task
Before you begin working on a task, it's important that you fully
understand what needs to be done. Take time to read through any
related documentation, issues, or pull requests...

[continues for 200+ lines of vague guidance]
```

The bad example fails because: every line is either vague ("write clean code"), negative framing ("don't forget"), redundant with common sense, or over-explained. An agent reading this learns nothing actionable.
