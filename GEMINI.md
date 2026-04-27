# 🎡 사다리 타기 게임 (BSU_laddergame) 작업 기록

이 문서는 프로젝트의 초기 설정부터 UI 개선, 배포 오류 해결까지의 모든 작업 과정을 기록합니다.

## 📋 프로젝트 개요
- **기술 스택**: React, TypeScript, Vite, CSS3, SVG
- **주요 기능**: 참여 인원 조절(2~12명), 플레이어 이름 및 당첨 항목 편집, 무작위 사다리 생성, 경로 애니메이션, 결과 요약 표시

## 🛠 작업 히스토리

### 1. 초기 개발 및 로직 구현
- `ladderLogic.ts`: 무작위 가로 막대 생성 알고리즘 (`generateLadder`) 및 경로 계산 알고리즘 (`calculatePath`) 구현.
- `App.tsx`: SVG 기반의 사다리 렌더링 및 클릭 인터랙션 구현.

### 2. 빌드 및 배포 환경 최적화
- **TypeScript 설정**: 빌드 시 `tsc` 오류 해결을 위해 `tsconfig.json` 및 `tsconfig.node.json` 추가.
- **Vite 설정**: GitHub Pages 배포를 위한 `base: '/BSU_laddergame/'` 경로 설정.
- **GitHub Actions 최신화**: 
    - Node.js 20 지원 중단 경고에 대응하여 모든 Actions 버전을 `v4`로 업데이트.
    - `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` 환경 변수 적용.
    - 배포 권한(`contents: write`) 명시적 부여.

### 3. 주요 트러블슈팅: MIME 타입 오류 (main.tsx:1)
- **증상**: 배포된 사이트에서 `.tsx` 파일을 모듈로 불러오려다 `application/octet-stream` MIME 타입 오류 발생.
- **원인**: GitHub Pages가 빌드 결과물(`dist`)이 아닌 소스 코드(`main`) 브랜치를 참조하고 있었음.
- **해결**: 
    - `gh-pages` 브랜치를 생성하고 빌드된 정적 파일만 배포하도록 수정.
    - GitHub Settings에서 배포 브랜치를 `gh-pages`로 변경하도록 가이드.
    - `gh-pages -f` 명령어를 통한 강제 배포로 레퍼런스 잠금 오류 해결.

### 4. UI/UX 개선 및 레이아웃 수정
- **시작 화면 분리**: 게임 초기 진입 시 설정 카드(인원/이름 입력)를 먼저 표시하고, 버튼 클릭 시 사다리 생성.
- **결과 칸 잘림 현상 해결**: 
    - `result-grid` 시스템 도입으로 다양한 인원수에서도 결과 카드가 유연하게 배치되도록 수정.
    - SVG 하단 여백 및 컨테이너 높이 조절.
- **애니메이션 동기화**: 사다리 타기 경로 애니메이션이 끝난 후 결과 텍스트가 나타나도록 지연 시간(`setTimeout`) 적용.

## 🚀 실행 방법
- **개발 모드**: `npm run dev`
- **빌드**: `npm run build`
- **배포**: `npm run deploy` (또는 `main` 브랜치 푸시 시 자동 배포)

## 📌 향후 과제
- 모바일 환경에서의 터치 인터랙션 최적화.
- 결과 공유(이미지 저장 또는 링크 복사) 기능 추가.
- 사운드 효과 및 배경음악 삽입.
