# Codex Buddy Plugin

April Fools 스타일의 Buddy를 Codex용으로 실험한 독립 저장소다.

## 현재 상태

이 저장소는 `codex-cli 0.118.0` 기준으로 로컬 플러그인 slash command 실험 결과를 보존한다.

- Buddy 파일은 홈 전역 경로에 설치 가능하다.
- 로컬 상태 저장과 보조 스크립트는 정상 동작한다.
- 하지만 현재 공개 Codex CLI에서는 사용자 로컬 플러그인이 `/buddy`처럼 프롬프트 slash command 목록에 등록되지 않았다.

즉, 이 저장소는 "Claude Code 같은 설치형 `/buddy` 명령"을 현재 Codex 공개 사용자 경로에서 재현하지 못한 상태를 문서화한다.

## 포함 기능

- Buddy 상태 스크립트 `on|off|status|pet|roast|reset|help`
- 로컬 상태 저장: `~/.codex/memories/buddy/state.json`
- `Write|Edit` 이후 가벼운 자동 반응 훅
- 프로젝트 로컬 경로와 홈 전역 경로를 모두 지원하는 실행 경로 탐색

## 설치

```bash
git clone <this-repo-url>
cd codex-buddy-plugin
./scripts/install.sh
```

설치 결과:

- 플러그인: `~/plugins/buddy`
- 마켓플레이스 등록: `~/.agents/plugins/marketplace.json`

설치가 곧 `/buddy` 활성화를 의미하지는 않는다. 현재 공개 Codex CLI에서는 이 로컬 플러그인이 slash command로 노출되지 않았다.

## 제거

```bash
./scripts/uninstall.sh
```

## 수동 확인

```bash
node ~/plugins/buddy/scripts/buddy-state.js status
node ~/plugins/buddy/scripts/buddy-state.js on
node ~/plugins/buddy/scripts/buddy-state.js roast
```

또는 셸에서 별도 alias/function을 잡아 `buddy on`처럼 사용할 수 있다.

## 저장소 구조

- `plugins/buddy`: 실제 Codex 플러그인 파일
- `.agents/plugins/marketplace.json`: repo-local 테스트용 marketplace 예시
- `scripts/install.py`: 홈 전역 설치 스크립트
- `scripts/uninstall.py`: 홈 전역 제거 스크립트

## 참고

이번 실험에서 확인한 내용:

- Codex app-server schema에는 `plugin/list`, `plugin/read`, `plugin/install` API가 존재한다.
- home-scoped marketplace 개념도 schema 상에는 존재한다.
- 그러나 `codex-cli 0.118.0`의 실제 TUI에서는 사용자 로컬 플러그인 `commands/*.md`가 `/buddy`로 등록되지 않았다.

따라서 현재 공개 사용자 경로에서 가능한 것은 "설치형 보조 스크립트/셸 커맨드" 수준이며, "프롬프트창에 노출되는 진짜 `/buddy` slash command"는 보류 상태다.
