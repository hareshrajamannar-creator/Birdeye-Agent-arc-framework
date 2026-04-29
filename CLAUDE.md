# Birdeye Agent Arc Framework — Rules for Claude

These rules are **non-negotiable**. Read every section before touching any file.
Violating any rule — even partially — breaks the product for real users.

---

## BEFORE YOU WRITE A SINGLE LINE OF CODE

1. Read every file you are about to change. Do not assume content.
2. Identify what is already working. Do not touch it.
3. Make only the changes described in the prompt. Nothing more.
4. After changes, verify that previously working features still work.
5. Commit and push after every discrete completed step.

---

## 1. Shell is frozen — NEVER MODIFY THESE FILES

| Component | Path |
|---|---|
| `AppShell` | `src/components/AppShell/AppShell.jsx` |
| `PrimaryRailNav` | `src/components/Organisms/Nav/PrimaryRailNav/PrimaryRailNav.jsx` |
| `SecondaryRailNav` | `src/components/Organisms/Nav/SecondaryRailNav/SecondaryRailNav.jsx` |
| `AppHeader` | `src/components/Molecules/AppHeader/AppHeader.jsx` |

All feature work goes inside module views only — components that live beneath
the shell's `{children}` slot. If a change seems to require editing a shell file,
stop and re-examine the approach.

---

## 2. Component library is @birdeye/elemental

- **Never install a new UI library.**
- **Never write a component from scratch** if `@birdeye/elemental` already provides it.
- Always check the elemental package first: atoms, molecules, and organisms are
  importable from `@birdeye/elemental/core/...`.
- Exception: Firebase, React Router, and @xyflow/react are already installed and approved.

---

## 3. Nodes come from `src/components/Modules/Nodes/` only

Never build a new node type. Use only the existing wrappers:

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

- No `max-width` constraints on any view.
- No centered columns or narrow content wells.
- No constrained layouts (`margin: 0 auto`, fixed-width wrappers).
- Views must expand to fill 100% of the space granted by AppShell's `<main>`.

---

## 5. Every unbuilt screen shows EmptyStates

If a screen or section has no data or has not yet been built, render the
appropriate variant from `src/components/Patterns/EmptyStates/EmptyStates.jsx`.

Never leave a blank white area. A bare `<div />` or `null` return is a violation.

---

## 6. Styling — CSS Modules only, zero exceptions

- **No inline `style={{ }}` with hex values** or any raw color/spacing literals.
- All styles must live in a co-located `.module.css` file applied via `styles.className`.
- Design tokens come from the elemental token system or CSS custom properties — never hardcoded.
- **No dashed or dotted lines anywhere** — not on edges, not on borders, not on
  focus/hover/active states. No `strokeDasharray`, `border-style: dashed`,
  `border-style: dotted`, or `outline: dashed` anywhere in the codebase.

---

## 7. Icons — Material Symbols only

```jsx
<span className="material-symbols-outlined">icon_name</span>
```

- Do not import SVG icons ad hoc.
- Do not use Heroicons, FontAwesome, or any other icon library.
- Icon names come from https://fonts.google.com/icons

---

## 8. State persistence — the most important rule in this project

**Every field change a user makes must be saved into `nodeDetails` in
`AgentBuilder.jsx` immediately and durably.**

### The pattern that must be followed everywhere:

Every RHS body component (EntityTaskBody, LLMTaskBody, EntityTriggerBody,
BranchBody, etc.) receives two props:

```js
initialValues={nodeDetails[selectedNodeId] ?? {}}
onFieldChange={(field, value) => handleNodeFieldChange(selectedNodeId, field, value)}
```

Every `useState` inside a body component must:
1. Initialise from `initialValues`: `useState(initialValues.fieldName ?? '')`
2. Call `onFieldChange('fieldName', newValue)` on every change

`handleNodeFieldChange` in AgentBuilder.jsx merges into nodeDetails:

```js
const handleNodeFieldChange = useCallback((nodeId, field, value) => {
  setNodeDetails((prev) => ({
    ...prev,
    [nodeId]: { ...(prev[nodeId] ?? {}), [field]: value },
  }));
}, []);
```

The RHS panel must use `key={selectedNodeId}` so switching nodes forces
a clean re-initialisation from the new node's saved data.

### What this means in practice:
- User types in a field → it saves to nodeDetails
- User clicks away to another node → comes back → field still shows their value
- User refreshes → Firebase restores the full nodeDetails object
- Nothing resets unless the user explicitly creates a new agent

**If you find a field that does not follow this pattern, fix it — even if the
prompt did not ask you to. A field that loses its value is a broken feature.**

---

## 9. Firebase — shared real-time database

All agents are stored in Firebase Firestore. Never use localStorage for agent data.

Config is in `src/firebase.js`. Service functions are in `src/services/agentService.js`.

```js
// Save / update
saveAgent(agentId, { agentId, agentName, nodeList, nodeDetails })

// Delete
deleteAgent(agentId)

// Real-time list (call in useEffect, return unsubscribe)
subscribeToAgents((agents) => setAgents(agents))
```

Auto-save rule: any time `agentName`, `nodeList`, or `nodeDetails` changes,
debounce 1.5 seconds and call `saveAgent`. This ensures no work is ever lost.

When creating a new agent, reset all state to blank defaults and generate a
fresh `agentId`. Never carry over state from the previous agent.

---

## 10. Do not break things that are already working

Before making any change, read the file. Identify what is currently working.
Only change what the prompt explicitly asks for.

Common ways things break — avoid all of these:
- Rewriting a whole component when only one section needed to change
- Changing import paths without verifying the new path exists
- Removing a prop that other components depend on
- Overriding CSS classes that are shared across multiple components
- Adding a `key` prop incorrectly causing unintended remounts
- Changing the shape of `nodeDetails` without updating all readers
- Touching `buildFlow()` logic without tracing all downstream effects
- Adding a new useEffect that fires on every render due to a missing
  or incorrect dependency array

If a change you are about to make could affect a working feature, call it out
explicitly before proceeding and confirm the approach is safe.

---

## 11. Do not repeat the same mistakes

The following issues have been fixed multiple times. Never reintroduce them:

- **Dashed lines on canvas edges or node borders** — zero dashes, all solid
- **RHS fields resetting on node switch** — always read from nodeDetails
- **Mode bar / toolbar row between header and canvas** — it was removed, keep it gone
- **ScheduleBased trigger** — never modify its logic or UI
- **Custom Conditions component** — EntityTriggerBody and BranchBody share the
  same `src/components/Molecules/Conditions/Conditions.jsx`. Never create a
  second version of this component
- **handleDropNode flowType mapping** — label='Delay' maps to flowType='delay',
  label='Loop' to 'loop', label='Parallel' to 'parallel'. Never map these to 'task'
- **AgentsTable.css** — this file must exist at
  `src/components/Organisms/DataViews/AgentsTable/AgentsTable.css`. Never delete it
- **Zoom bar z-index** — React Flow controls must sit below the drawer overlay.
  `.react-flow__controls { z-index: 4; }` Drawer overlay is z-index 10+

---

## 12. Commit and push after every completed step

```bash
git add <changed files>
git commit -m "<type>: <short description>"
git push origin main
```

Remote: `https://github.com/hareshrajamannar-creator/Birdeye-Agent-arc-framework.git`

Commit types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`

---

## 13. Architecture reference

```
AgentBuilder.jsx          — orchestrator: nodeList, nodeDetails, selectedNodeId,
                            agentId, agentName, handleNodeFieldChange,
                            handleAddBranchPath, buildFlow, Firebase auto-save

FlowCanvas.jsx            — React Flow canvas, custom node/edge types,
                            nodesDraggable, zoom controls

RHS.jsx                   — right-hand side panel, receives selectedNode +
                            bodyProps (initialValues + onFieldChange)

Body components           — EntityTaskBody, LLMTaskBody, EntityTriggerBody,
                            BranchBody — all receive initialValues + onFieldChange

Conditions.jsx            — shared conditions row component used by both
                            EntityTriggerBody and BranchBody — single source of truth

CustomToolBuilder.jsx     — side drawer for building custom tools, opened from
                            EntityTaskBody Add button directly (no intermediate drawer)

CustomToolViewer.jsx      — view/edit drawer for a saved custom tool

agentService.js           — Firebase Firestore: saveAgent, deleteAgent,
                            subscribeToAgents

firebase.js               — Firebase app initialisation and db export
```

**Data flow:**
User input → body component `onFieldChange` → `handleNodeFieldChange` →
`setNodeDetails` → Firebase auto-save (debounced 1.5s) → Firestore → all
connected clients update via `subscribeToAgents`
