# Buddy Plugin

Buddy local plugin experiment.

현재 `codex-cli 0.118.0` 기준으로는 이 플러그인이 `/buddy` slash command로 TUI에 노출되지 않았다.

포함 내용:

- Buddy 상태 스크립트 `on|off|status|pet|roast|reset|help`
- local progression stored at `~/.codex/memories/buddy/state.json`
- lightweight `Write|Edit` post-hook reaction

Home-global install layout:

- `~/plugins/buddy`
- `~/.agents/plugins/marketplace.json`

The command and hook paths first look for `plugins/buddy` in the current project tree, then fall back to `~/plugins/buddy`.

이 디렉터리는 로컬 plugin/marketplace 형식 실험용 산출물 보관용이다.
