# Codex Buddy Plugin

April Fools 스타일의 Buddy를 Codex용 로컬 플러그인으로 배포하는 독립 저장소다.

## 포함 기능

- `/buddy on|off|status|pet|roast|reset|help`
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

## 저장소 구조

- `plugins/buddy`: 실제 Codex 플러그인 파일
- `.agents/plugins/marketplace.json`: repo-local 테스트용 marketplace 예시
- `scripts/install.py`: 홈 전역 설치 스크립트
- `scripts/uninstall.py`: 홈 전역 제거 스크립트

## 참고

현재 구현은 플러그인 기반 MVP다. Codex 본체의 전용 패널/TUI 렌더링을 직접 추가하는 구조는 아니며, slash command + local state + hook 반응 중심으로 동작한다.
