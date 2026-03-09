---
name: tasks
description: Use when given a task or working through a list of tasks. Ensures proper branch hygiene and commits after each task.
---

# Tasks

## Before starting

Check current branch with `git branch --show-current`.

If on `main`, prompt user to create a feature branch. Suggest a name based on the task (e.g. `feat/add-capture-view`, `fix/synthesis-error`).

Only proceed on `main` if user explicitly confirms.

## After completing each task

1. Commit changes using `/git-commits` skill
2. Update `progress.txt`:
  - Move completed items from "Remaining" to "Completed" with `[x]`
  - Add specific sub-items under the phase if granularity helps
  - Update "In Progress" section if starting next task

Never batch commits across multiple tasks.

