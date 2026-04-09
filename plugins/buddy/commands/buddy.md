---
description: Control the local Buddy companion, including activation, status, petting, roasting, and reset.
---

# /buddy

Manage the local Buddy companion for Codex. Buddy is a lightweight plugin-backed April Fools style companion with local progression and ASCII state rendering.

## Preflight

1. Confirm `node` is available on PATH.
2. Treat the first argument after `/buddy` as the subcommand.
3. If no subcommand is provided, default to `status`.
4. Resolve the Buddy script from the current project tree first, then from `~/plugins/buddy`.

## Plan

1. Normalize the requested subcommand.
2. Resolve the Buddy state script path.
3. Run the script with the matching subcommand.
4. Return the script output verbatim in a fenced `text` block.

This command is local-only and non-destructive aside from updating Buddy's local state file.

## Commands

Supported forms:

- `/buddy`
- `/buddy on`
- `/buddy off`
- `/buddy status`
- `/buddy pet`
- `/buddy roast`
- `/buddy reset`
- `/buddy help`

Execution rule:

```bash
ROOT="$PWD"; while [ "$ROOT" != "/" ] && [ ! -f "$ROOT/plugins/buddy/scripts/buddy-state.js" ]; do ROOT="$(dirname "$ROOT")"; done; SCRIPT="$ROOT/plugins/buddy/scripts/buddy-state.js"; if [ ! -f "$SCRIPT" ] && [ -f "$HOME/plugins/buddy/scripts/buddy-state.js" ]; then SCRIPT="$HOME/plugins/buddy/scripts/buddy-state.js"; fi; node "$SCRIPT" <subcommand>
```

Subcommand mapping:

- no args -> `status`
- `on` -> enable Buddy
- `off` -> disable Buddy
- `status` -> show current Buddy panel
- `pet` -> raise PATIENCE and soften mood
- `roast` -> print a spaghetti-code roast based on SNARK
- `reset` -> reset Buddy progression to defaults
- `help` -> show command help

If the user asks for something outside this set, run:

```bash
ROOT="$PWD"; while [ "$ROOT" != "/" ] && [ ! -f "$ROOT/plugins/buddy/scripts/buddy-state.js" ]; do ROOT="$(dirname "$ROOT")"; done; SCRIPT="$ROOT/plugins/buddy/scripts/buddy-state.js"; if [ ! -f "$SCRIPT" ] && [ -f "$HOME/plugins/buddy/scripts/buddy-state.js" ]; then SCRIPT="$HOME/plugins/buddy/scripts/buddy-state.js"; fi; node "$SCRIPT" help
```

and explain that the current Buddy MVP supports command-driven interaction only.

## Verification

1. Check that the script exits successfully.
2. If the command mutates state (`on`, `off`, `pet`, `roast`, `reset`), trust the script output as the source of truth.
3. If the script fails, report the command, stderr, and the likely fix path.

## Summary

Present:

```text
Buddy command: <subcommand>
Status: success | failed
```

Then include the rendered Buddy output verbatim.

## Next Steps

- Suggest `/buddy on` if Buddy is disabled.
- Suggest `/buddy status` after a mutating command.
- Suggest `/buddy roast` when the user wants the full April Fools tone.
