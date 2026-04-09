#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');

const stateDir = path.join(os.homedir(), '.codex', 'memories', 'buddy');
const statePath = path.join(stateDir, 'state.json');

const DEFAULT_STATE = {
  enabled: false,
  name: 'Buddy',
  type: 'Axolotl',
  level: 1,
  mood: 'idle',
  lastMessage: '터미널을 관찰하는 중이다.',
  stats: {
    DEBUGGING: 50,
    PATIENCE: 50,
    SNARK: 65
  },
  updatedAt: null
};

const FACES = {
  idle: '[ ^ v ^ ]',
  happy: '[ ^ v ^ ]',
  angry: '[ > m < ]',
  thinking: '[ . o . ]'
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ensureStateDir() {
  fs.mkdirSync(stateDir, { recursive: true });
}

function loadState() {
  try {
    if (!fs.existsSync(statePath)) {
      return { ...DEFAULT_STATE, stats: { ...DEFAULT_STATE.stats } };
    }

    const parsed = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    return {
      ...DEFAULT_STATE,
      ...parsed,
      stats: {
        ...DEFAULT_STATE.stats,
        ...(parsed.stats || {})
      }
    };
  } catch (_) {
    return {
      ...DEFAULT_STATE,
      stats: { ...DEFAULT_STATE.stats },
      mood: 'angry',
      lastMessage: '상태 파일이 망가졌다. 내가 복구는 해주겠지만 마음에 들진 않는다.'
    };
  }
}

function saveState(state) {
  ensureStateDir();
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

function bar(label, value) {
  const width = 20;
  const filled = Math.round((value / 100) * width);
  const empty = width - filled;
  return `${label.padEnd(10)} ${'█'.repeat(filled)}${'░'.repeat(empty)} ${String(value).padStart(3)}/100`;
}

function render(state) {
  const face = FACES[state.mood] || FACES.idle;
  return [
    `Buddy ${state.enabled ? 'ON' : 'OFF'}  Lv.${state.level}  ${state.type}`,
    face,
    state.lastMessage,
    '',
    bar('DEBUGGING', state.stats.DEBUGGING),
    bar('PATIENCE', state.stats.PATIENCE),
    bar('SNARK', state.stats.SNARK),
    '',
    'Commands: /buddy on | off | status | pet | roast | reset | help'
  ].join('\n');
}

function maybeLevelUp(state) {
  const progress =
    Math.max(0, state.stats.DEBUGGING - DEFAULT_STATE.stats.DEBUGGING) +
    Math.max(0, state.stats.PATIENCE - DEFAULT_STATE.stats.PATIENCE) +
    Math.max(0, state.stats.SNARK - DEFAULT_STATE.stats.SNARK);
  state.level = 1 + Math.floor(progress / 20);
}

function helpText() {
  return [
    'Buddy help',
    '',
    'node ./plugins/buddy/scripts/buddy-state.js on',
    'node ./plugins/buddy/scripts/buddy-state.js off',
    'node ./plugins/buddy/scripts/buddy-state.js status',
    'node ./plugins/buddy/scripts/buddy-state.js pet',
    'node ./plugins/buddy/scripts/buddy-state.js roast',
    'node ./plugins/buddy/scripts/buddy-state.js reset'
  ].join('\n');
}

function roastMessage(snark) {
  if (snark < 40) {
    return '이건 스파게티 코드라기보다 면 정리가 덜 된 정도다.';
  }
  if (snark < 70) {
    return '괜찮다. 이 정도 스파게티는 디버거가 울기 직전 정도다.';
  }
  if (snark < 90) {
    return '축하한다. 이 코드는 함수형이 아니라 면요리형 아키텍처다.';
  }
  return '이건 스파게티 코드가 아니다. 실수를 영속화한 탄수화물 저장소다.';
}

function run(command, extra) {
  const state = loadState();
  let preserveExplicitLevel = false;

  switch (command) {
    case 'on':
      state.enabled = true;
      state.mood = 'happy';
      state.lastMessage = '좋아. 이제부터 네 작업을 지켜보겠다. 실수하면 반응도 한다.';
      break;
    case 'off':
      state.enabled = false;
      state.mood = 'idle';
      state.lastMessage = '관찰 모드를 종료한다. 잠깐은 조용히 있어주지.';
      break;
    case 'status':
      break;
    case 'pet':
      state.enabled = true;
      state.mood = 'happy';
      state.stats.PATIENCE = clamp(state.stats.PATIENCE + rand(8, 14));
      state.stats.SNARK = clamp(state.stats.SNARK - rand(2, 5));
      state.lastMessage = '흠. 인정하진 않겠지만 조금 기분이 나아졌다.';
      break;
    case 'roast':
      state.enabled = true;
      state.mood = 'angry';
      state.stats.SNARK = clamp(state.stats.SNARK + rand(3, 7));
      state.lastMessage = roastMessage(state.stats.SNARK);
      break;
    case 'reset':
      state.enabled = false;
      state.level = DEFAULT_STATE.level;
      state.mood = DEFAULT_STATE.mood;
      state.lastMessage = '초기화 완료. 네가 무슨 짓을 했는지는 묻지 않겠다.';
      state.stats = { ...DEFAULT_STATE.stats };
      preserveExplicitLevel = true;
      break;
    case 'hook':
      if (!state.enabled) {
        console.log(render(state));
        return;
      }
      if (extra === 'write') {
        state.mood = 'thinking';
        state.stats.DEBUGGING = clamp(state.stats.DEBUGGING + 1);
        state.stats.PATIENCE = clamp(state.stats.PATIENCE - 1);
        state.lastMessage = '또 파일을 건드렸군. 적어도 이번엔 이유가 있길 바란다.';
      }
      break;
    case 'help':
    default:
      console.log(helpText());
      return;
  }

  if (!preserveExplicitLevel) {
    maybeLevelUp(state);
  }
  saveState(state);
  console.log(render(state));
}

const [, , command = 'status', extra] = process.argv;
run(command, extra);
