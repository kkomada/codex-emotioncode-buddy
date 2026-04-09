# Buddy Plugin

Local Codex Buddy plugin with:

- `/buddy on|off|status|pet|roast|reset|help`
- local progression stored at `~/.codex/memories/buddy/state.json`
- lightweight `Write|Edit` post-hook reaction

Home-global install layout:

- `~/plugins/buddy`
- `~/.agents/plugins/marketplace.json`

The command and hook paths first look for `plugins/buddy` in the current project tree, then fall back to `~/plugins/buddy`.
