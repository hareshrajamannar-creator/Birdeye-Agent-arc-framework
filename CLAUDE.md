# Birdeye Agent Arc Framework — Rules for Claude

These rules are **non-negotiable**. Read and apply all of them before touching any file.

---

## 1. Shell is frozen

The following files must **never be modified**:

| Component | Path |
|---|---|
| `AppShell` | `src/components/AppShell/AppShell.jsx` |
| `PrimaryRailNav` | `src/components/Organisms/Nav/PrimaryRailNav/PrimaryRailNav.jsx` |
| `SecondaryRailNav` | `src/components/Organisms/Nav/SecondaryRailNav/SecondaryRailNav.jsx` |
| `AppHeader` | `src/components/Molecules/AppHeader/AppHeader.jsx` |

All feature work goes **inside module views only** — components that live beneath the shell's `{children}` slot. If a change seems to require editing a shell file, stop and re-examine the approach.

---

## 2. Component library is @birdeye/elemental

- **Never install a new UI library.**
- **Never write a component from scratch** if `@birdeye/elemental` already provides it.
- Always check the elemental package first: atoms, molecules, and organisms are importable from `@birdeye/elemental/core/...`.

---

## 3. Nodes come from `src/components/Modules/Nodes/` only

Never build a new node type. Use only the existing wrappers located in this directory:

| Wrapper | Path |
|---|---|
| `StartNode` / `AgentDetailsNode` | `src/components/Modules/Nodes/AgentDetailsNode/` |
| `EndNode` | `src/components/Modules/Nodes/EndNode/` |
| `EntityTrigger` | `src/components/Modules/Nodes/TriggerNode/EntityTriggerNode/` |
| `ScheduleTrigger` | `src/components/Modules/Nodes/TriggerNode/ScheduleTriggerNode/` |
| `EntityTask` | `src/components/Modules/Nodes/TaskNode/EntityTaskNode/` |
| `LLMTask` | `src/components/Modules/Nodes/TaskNode/CustomTaskNode/` |
| `Branch` | `src/components/Modules/Nodes/ControlNode/BranchNode/` |
| `Loop` | `src/components/Modules/Nodes/ControlNode/LoopNode/` |
| `Delay` | `src/components/Modules/Nodes/ControlNode/DelayNode/` |
| `Parallel` | `src/components/Modules/Nodes/ControlNode/ParallelNode/` |

---

## 4. Content must always fill the full available area

- **No `max-width`** constraints on any view.
- **No centered columns** or narrow content wells.
- **No constrained layouts** (e.g. `margin: 0 auto`, fixed-width wrappers).
- Views must expand to fill 100% of the space granted by `AppShell`'s `<main>` content area.

---

## 5. Every unbuilt screen shows EmptyStates

If a screen or section has no data or has not yet been built, render the appropriate variant from:

```
src/components/Patterns/EmptyStates/EmptyStates.jsx
```

**Never leave a blank white area.** A bare `<div />` or `null` return where content is expected is a violation of this rule.

---

## 6. Styling uses CSS modules only

- **No inline `style={{ }}` with hex values** or any raw color/spacing literals.
- All styles must live in a co-located `.module.css` file and be applied via `styles.className`.
- Design tokens (colors, spacing, typography) must come from the elemental token system or CSS custom properties — never hard-coded inline.

---

## 7. Icons use Material Symbols only

Always use the Material Symbols icon font:

```jsx
<span className="material-symbols-outlined">icon_name</span>
```

- Do not import SVG icons ad hoc.
- Do not use any other icon library (Heroicons, FontAwesome, etc.).
- Icon names come from the [Material Symbols catalog](https://fonts.google.com/icons).

---

## 8. Commit and push after every completed step

After completing each discrete step of work, commit to `main` and push:

```bash
git add <changed files>
git commit -m "<type>: <short description>"
git push origin main
```

Remote: `https://github.com/hareshrajamannar-creator/Birdeye-Agent-arc-framework.git`

Commit message types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`.
