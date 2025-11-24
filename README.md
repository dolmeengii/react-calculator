# React 19 입력 반응성 최적화 실험

> 우아한테크코스 프리코스 오픈미션

## 목차
- [프로젝트 개요](#프로젝트-개요)
- [과제 목표](#과제-목표)
- [기능 목록](#기능-목록)
- [프로젝트 구조](#프로젝트-구조)
- [성능 측정 지표](#성능-측정-지표)
- [성능 측정 결과](#성능-측정-결과)
- [진행 중인 작업](#진행-중인-작업)
- [트러블 슈팅](#트러블-슈팅)
- [회고](#회고)

---

## 프로젝트 개요

### 프리코스 경험 요약
문자열 계산기 구현 과정에서 **입력 길이가 늘어날수록 연산 시간이 증가하는 특성**을 확인했으나, 콘솔 기반이라 **입력 중의 지연이 체감되지 않아** 문제로 크게 느껴지지 않았다. 하지만 연산 과정의 복잡성이 프로그램 반응 속도에 영향을 줄 수 있다는 점은 분명하다고 판단.

### 확장 가능성이 보였던 지점
- 웹 환경에서는 사용자가 **입력할 때마다 즉각적인 피드백**을 기대함
  - 콘솔에서는 무시되던 입력 지연(latency)이 웹에서는 명확한 UX 문제가 됨
- 문자열 계산기 로직을 웹으로 옮기면 다음과 같은 **프론트엔드 특유의 병목 현상**을 실험할 수 있는 구조가 됨
  - 렌더링
  - 재연산
  - 메인 스레드 점유

이에 따라 프리코스에서 진행했던 방식인 **작은 단위로 문제를 나누고 점진적으로 개선하는 방식**과도 자연스럽게 연결된다고 판단.

### '입력 반응성' 문제를 선택한 이유
- 입력 반응성은 웹 서비스의 **체감 성능과 신뢰도**를 결정하는 핵심 UX 요소라고 판단
- React 19의 Concurrent Features(Transition, Deferred Value 등)가 **실제 입력 패턴에서 어떤 개선을 만들어내는지** 실험할 수 있음
- 단순 기능 구현이 아니라 **"사용자가 느끼는 지연을 어떻게 줄일 수 있을까?"** 라는 관점에서 성능을 바라보고자 함
- 프리코스 경험(문자열 파싱, 예외 처리, 단위 로직 설계)을 **실무적인 성능 최적화 문제로 확장**시키기에 가장 자연스러운 주제라고 판단함

---

## 과제 목표

### 정량 목표 (Quantitative Goals)
| 항목 | 목표 |
|------|------|
| 300자 입력 시 | 입력 → 화면 업데이트까지의 반응 속도 X ms 이하 |
| 1000자 입력 시 | 기본 버전 대비 평균 입력 지연(Input Latency) **30% 이상 개선** |
| 반복 테스트 30회 기준 | 평균/중앙값(Median) 기준 일관된 성능 개선 확인 |
| Web Worker 적용 버전 | 메인 스레드 점유율 감소 수치화 (Performance API 기준) |

### 정성 목표 (Qualitative Goals)
- **React 19 Concurrent Rendering**
  - useTransition, useDeferredValue 등 실험을 통해 **입력 중 화면이 끊기지 않는 흐름**을 직접 체감하고 이해하기
- **Web Worker 기반 연산 분리 경험**
  - 긴 연산을 메인 스레드에서 분리했을 때 입력/렌더링 반응성이 어떻게 달라지는지 탐구
- **사용자 중심 성능 개선 관점 확립**
  - 단순 속도 개선이 아니라 "사용자가 느끼는 지연을 줄이기 위한 최적화"를 목표로 사고
- **측정 → 비교 → 분석 → 회고의 구조화된 개발 경험**
  - 성능 지표를 기반으로 개선 방향을 도출하고 데이터를 해석하는 과정을 통해 사고 확장

---

## 기능 목록

### 1) 문자열 계산 기능 (프리코스 로직 유지)
- 기존 프리코스에서 구현했던 문자열 파싱 및 계산 로직을 순수 함수 형태로 TypeScript 모듈화하여 사용

### 2) 실시간 입력 → 계산 결과 출력
- 사용자가 입력창에 수식을 입력하면 즉시 계산 결과가 반영되는 실시간 UI 흐름 구현
- onChange 입력 감지 → 계산 실행 → 결과 표시

### 3) 입력 지연 측정 기능 (Performance API)
- 입력 이벤트 발생 시점부터 화면 업데이트까지의 **Input Latency(ms)** 를 측정
- 성능 실험 및 최적화 결과 비교를 위해 측정 데이터를 JSON/콘솔로 저장

### 4) React 19 실험 분기 구성
동일한 기능을 여러 방식으로 구현하여 성능 차이를 비교하는 실험 구조 마련
- 기본 버전 (Baseline)
- useDeferredValue 적용 버전
- useTransition 적용 버전
- Debounce 적용 버전

### 5) Web Worker 기반 연산 분리
- 긴 수식 또는 반복 연산을 **메인 스레드에서 분리**하여 계산
- Worker 적용 전/후의 입력 지연 및 스레드 점유율 변화를 비교

---

## 프로젝트 구조

```
src/
├── components/
│   ├── Calculator.tsx           # 기본 계산기 컴포넌트
│   ├── CalculatorDebounce.tsx   # Debounce 적용 버전
│   ├── CalculatorDefferd.tsx    # useDeferredValue 적용 버전
│   ├── CalculatorTransition.tsx # useTransition 적용 버전
│   ├── BaselinePanel.tsx        # Baseline 성능 측정 UI
│   ├── DebouncePanel.tsx        # Debounce 성능 측정 UI
│   ├── DefferdPanel.tsx         # Deferred 성능 측정 UI
│   └── TransitionPanel.tsx      # Transition 성능 측정 UI
├── lib/
│   ├── calculate.ts             # 핵심 계산 로직
│   ├── parse.ts                 # 문자열 파싱 로직
│   ├── measure.ts               # Performance API 측정 유틸
│   ├── baseline.ts              # Baseline 성능 테스트
│   ├── debounceTest.ts          # Debounce 성능 테스트
│   ├── deferredTest.ts          # Deferred 성능 테스트
│   ├── transitionTest.ts        # Transition 성능 테스트
│   └── calc.test.ts             # 단위 테스트
├── workers/
│   └── calc.worker.ts           # Web Worker 구현
├── utils/
│   ├── debounce.ts              # Debounce 유틸 함수
│   └── useDebounce.ts           # Debounce 커스텀 훅
├── App.tsx
└── main.tsx
```

---

## 성능 측정 지표

### 측정 계획
기본 계산기 UI와 프리코스에서 사용한 로직을 연결한 상태에서 다음 항목을 측정하여 **Baseline**을 생성한다.
- Input Latency
- Render Duration
- Re-render Count
- Main Thread Usage

이후 Baseline 값을 기준으로 각 단계의 개선 효과를 비교한다.
- React Concurrent 기능 적용
- Debounce 적용
- Worker 적용

### 1) Input Latency (입력 지연, ms)
- 사용자가 키를 입력한 시점부터 화면에 업데이트가 반영되기까지 걸리는 시간
- 실제 UX 체감과 가장 밀접한 지표
- `performance.now()` 기반으로 측정

### 2) Render Duration (렌더링 시간, ms)
- React 컴포넌트가 다시 렌더링되는 데 소요된 시간
- React Profiler로 확인 가능
- Concurrent rendering 적용 전/후 비교에 사용

### 3) Re-render Count (재렌더링 횟수)
- 특정 입력 길이 또는 계산 과정에서 컴포넌트가 얼마나 자주 재렌더링 되었는지를 기록
- 상태 관리·렌더링 최적화 효과 확인용

### 4) Main Thread Usage (%)
- 메인 스레드가 연산 + 렌더링 때문에 얼마나 바쁘게 사용되고 있는지를 확인하는 지표
- Web Worker 적용 전/후를 비교하기 위한 핵심 지표
- DevTools Performance 탭에서 샘플링

### 5) Worker Offloading Effect (작업 분리 효과)
- Web Worker 적용 시 메인 스레드 점유율 감소폭 측정
- 체감 UX와 직접 연결되므로 "Worker 도입이 왜 필요한지" 설명할 근거가 됨

---

## 성능 측정 결과

### 1단계 - Baseline 성능 측정
| 입력 길이 | 실행 횟수 | 평균 연산 시간(ms) |
|-----------|-----------|-------------------|
| 10자 | 20 | 0.030 |
| 100자 | 20 | 0.025 |
| 300자 | 20 | 0.050 |
| 1000자 | 20 | 0.150 |

---

### 2단계 - Debounce 버전
**목적**: 입력할 때 너무 자주 계산하지 않도록 → 입력 반응성 개선

| 입력 길이 | 실행 횟수 | 평균 연산 시간(ms) |
|-----------|-----------|-------------------|
| 10자 | 20 | 0.160 |
| 100자 | 20 | 0.155 |
| 300자 | 20 | 0.210 |
| 1000자 | 20 | 0.380 |

**관찰 포인트**
- 연산 시간(ms)뿐만 아니라 입력 중 렌더링이 부드러워졌는가?
- 긴 입력에서 UI 멈춤이 줄었는가?
- Baseline 대비 사용자 경험이 좋아졌는가?

---

### 3단계 - useDeferredValue 버전 (React 19)
**목적**: UI는 즉시 반응하되, "비싼 계산"은 늦게 처리

| 입력 길이 | 실행 횟수 | 평균 연산 시간(ms) |
|-----------|-----------|-------------------|
| 10자 | 20 | 0.015 |
| 100자 | 20 | 0.140 |
| 300자 | 20 | 0.220 |
| 1000자 | 20 | 0.240 |

**결과 해석**
- duration(ms) 자체는 Baseline과 거의 차이가 없음
- 하지만 렌더링 우선순위가 바뀌기 때문에 **체감이 확 달라짐**
  - 입력 중 UI 렉 줄어듦
  - transition보다 덜 공격적이지만 안정적

---

### 4단계 - useTransition 버전 (React 19)
**목적**: "긴 작업"은 transition 내부로 보내서 UI 업데이트를 우선 처리

| 입력 길이 | 실행 횟수 | 평균 연산 시간(ms) |
|-----------|-----------|-------------------|
| 10자 | 20 | 0.020 |
| 100자 | 20 | 0.010 |
| 300자 | 20 | 0.080 |
| 1000자 | 20 | 0.145 |

**결과 해석**
- transition은 **렌더링 우선순위 조절**
- Baseline 대비 duration(ms)은 크게 달라지지 않음
- 대신 입력 중 UI 반응성이 확연히 부드러워짐
- 긴 입력 스트링 + 무거운 연산에서 효과 극대화

---

### 비교 분석

| 버전 | 10자 | 100자 | 300자 | 1000자 | 특징 |
|------|------|-------|-------|--------|------|
| **Baseline** | 0.030 | 0.025 | 0.050 | 0.150 | 기준값 |
| **Debounce** | 0.160 | 0.155 | 0.210 | 0.380 | 호출 빈도 감소, 체감 개선 |
| **Deferred** | 0.015 | 0.140 | 0.220 | 0.240 | 렌더링 우선순위 조정, CPU 분배 개선 |
| **Transition** | 0.020 | 0.010 | 0.080 | 0.145 | UI 우선 처리, 반응성 극대화 |

### 핵심 인사이트
- **Debounce** → 호출 빈도 감소로 체감 개선
- **Deferred** → 체감 + CPU 분배 개선
- **Transition** → 가장 공격적인 UI 우선 처리
- 두 React 19 기법은 duration(ms) 비교가 아닌 **UX 영향력 비교**로 평가해야 함

---

## 진행 중인 작업

### Web Worker 기반 메인 스레드 분리 실험
> 브랜치: `feat/ux-performance-#6`

React 19 Concurrent Features 실험 이후, 추가적으로 Web Worker를 활용한 UX 개선 실험을 진행 중이다.

**목표**
- 계산 로직을 메인 스레드에서 완전히 분리
- Baseline vs Worker 성능 비교 UI 구성
- 메인 스레드 점유율 감소 효과 측정

**진행 상황**
- [x] calc.worker.ts 구현 (메인 스레드 분리)
- [x] Worker 연동 UI 구성 (CalculatorWorker.tsx)
- [x] 타입 정의 및 에러 처리 추가
- [x] 계산 시간(duration) 측정 기능 추가
- [ ] Worker 적용 전/후 성능 측정 (추가 예정)
- [ ] Worker + React Concurrent 조합 실험 (추가 예정)

**구현 내용**
```typescript
// calc.worker.ts - 메인 스레드에서 분리된 계산
self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { input } = event.data;
  const startTime = performance.now();
  const result = calculate(input);
  const duration = performance.now() - startTime;
  self.postMessage({ result, duration });
};
```

> 해당 브랜치는 실험 단계로, 추후 성능 측정 완료 후 main에 병합 예정

---

## 트러블 슈팅

### 1. Vite + Vitest 타입 충돌 해결

**이슈**
```
TS2769: No overload matches this call.
test does not exist in type UserConfigExport

TS2307: Cannot find module '@vitejs/plugin-react'
```

**원인 분석**
1. Vite의 `defineConfig` 타입(UserConfig)에는 `test` 옵션이 존재하지 않음
2. `test` 옵션은 Vitest 전용 config에서만 인식함
3. TypeScript의 `"moduleResolution": "node"`는 Vite 플러그인의 타입 탐색 방식과 맞지 않음

**해결 과정**
```typescript
// defineConfig를 Vitest에서 import
import { defineConfig } from 'vitest/config';

// moduleResolution을 bundler로 변경
"moduleResolution": "bundler"
```

**배운 점**
- Vite config와 Vitest config는 타입 시스템이 다르다
- 최신 FE 환경에서는 `"moduleResolution": "bundler"`가 더 안전하다
- 환경 구성 요소 간의 역할을 이해하는 것이 FE 엔지니어링에 중요하다

---

### 2. Web Worker ES Module 이슈

**이슈**
```
Uncaught SyntaxError: Cannot use import statement outside a module
```
Worker 스크립트 로딩 단계에서 SyntaxError가 발생하여 Worker 자체가 실행 불가능한 상태

**원인 분석**
- Worker 파일이 ES Module로 인식되지 않고 "classic script"로 로드됨
- Worker 생성 시 `type: "module"` 옵션이 없어서 브라우저가 classic worker로 실행하려 함
- classic worker에서는 import 문법을 사용할 수 없음

**해결 과정**
```typescript
const worker = new Worker(
  new URL('../workers/calc.worker.ts', import.meta.url),
  { type: 'module' }  // ES Module Worker로 지정
);
```

**배운 점**
- Worker 파일에서 import 문법을 쓰려면 **반드시 ES Module Worker로 실행해야 한다**
- Vite 환경에서 Worker 생성할 때 `{ type: 'module' }`을 명시하지 않으면 Worker가 classic script로 실행됨
- Worker 초기화 오류는 React UI 코드의 `worker.onerror`로는 확인할 수 없고 **DevTools 콘솔에서 디버깅해야 함**

---

## 회고

### 프로젝트를 시작한 계기
기존 프리코스를 진행하며 **"웹으로 구현하면 어떤 식으로 작동할까?"** 하는 생각을 자주 했다. 이번 오픈 미션에서 실제로 이를 구현해볼 수 있는 기회를 얻었고, 웹 환경에서 부딪힐 수 있는 문제점들을 파악하고 성능 및 UI/UX 최적화를 경험해보고 싶었다.

### 잘한 점
- React 19의 Concurrent Features(useTransition, useDeferredValue)를 직접 실험하고 성능 차이를 측정해볼 수 있었다
- 코드를 수정하고 성능을 측정하는 과정이 어려웠지만, 끝까지 해내며 **측정 → 비교 → 분석**의 흐름을 경험했다
- 프리코스에서 구현한 문자열 계산기 로직을 웹 환경으로 확장하며, 프론트엔드 특유의 병목 현상을 이해할 수 있었다

### 아쉬운 점
- UX 최적화는 현재 수준에서 너무 어렵게 느껴졌다
- 계획했던 것보다 간단한 부분만 측정할 수 있었다
- Web Worker 실험은 기본 구현까지만 완료하고, 본격적인 성능 비교는 진행하지 못했다

### 다음에 개선하고 싶은 점
- **Lighthouse**를 활용한 종합적인 성능 진단
- **Web Worker** 실험을 완성하여 메인 스레드 점유율 감소 효과를 수치화
- 자동화된 벤치마크 시스템 구축으로 더 체계적인 성능 비교
- 실제 사용자 체감을 측정할 수 있는 UX 지표(INP, FID 등) 적용

---

## 기획 문서
[Notion 기획 문서](https://mindolmaengii.notion.site/4-2a9f98f55b4080c0a72be05698f5ed9a?source=copy_link)
