Context for working in the playground.

The playground serves the "see before you install" principle — users
explore components across a variety of scenarios before committing.

## Structure

Each component section uses the ComponentDisplay wrapper with two tabs:

- **Overview** — a grid showing all variant/theme combinations at a glance
- **Playground** — an interactive preview with controls for each
  configurable prop

## What to show

Derive scenarios from two sources:

1. The Base UI docs for the component — examples reveal the different
   states and configurations it can exist in
2. The requirements gathered from the user — variant landscape, themes,
   and component-specific props

Balance coverage with cognitive load. Show enough to give users a strong
sense of the component's versatility without overwhelming with redundant
or trivial variations.

## Reference

See the button or dropdown-menu playground sections as models for
structure, controls, and how to use the constants file.
