# 기여 가이드 (Contributing Guide)

이 문서는 레포지토리 내 브랜치 네이밍, 커밋 메시지, PR 규칙 등 팀 컨벤션을 정의합니다.

---

## 브랜치 네이밍

```
<type>/<간략한-설명>
```

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능/문서 추가 | `feat/user-auth-prd` |
| `docs` | 기존 문서 수정/보완 | `docs/onboarding-guide` |
| `fix` | 오탈자, 오류 수정 | `fix/checkout-flow-typo` |
| `chore` | 폴더 구조, 템플릿 등 관리 작업 | `chore/add-meeting-template` |

- 소문자 + 하이픈(`-`) 사용
- 공백, 언더스코어 사용 금지

---

## 커밋 메시지

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다.

```
<type>: <제목>

[선택] 본문 - 변경 이유, 배경 설명
[선택] 관련 이슈: #123
```

| 타입 | 설명 |
|------|------|
| `feat` | 새 기능/문서 추가 |
| `docs` | 문서 수정 |
| `fix` | 버그/오류 수정 |
| `chore` | 빌드, 설정, 폴더 관리 |
| `refactor` | 기능 변경 없는 구조 개선 |

**예시**
```
feat: 결제 플로우 PRD 초안 작성

사용자 결제 경험 개선을 위한 신규 플로우 정의.
관련 이슈: #42
```

---

## PR 규칙

1. **제목**: 커밋 메시지와 동일한 형식 (`feat: ...`)
2. **브랜치**: `main` 또는 `develop`으로 머지
3. **리뷰어**: 반드시 1명 이상 지정
4. **머지 방식**: Squash merge 권장 (커밋 히스토리 정리)
5. **본인 PR 머지 금지**: 리뷰 완료 후 리뷰어가 머지 or 승인 후 본인 머지

---

## 파일 네이밍

| 항목 | 규칙 | 예시 |
|------|------|------|
| 파일명 | kebab-case | `user-auth-prd.md` |
| 폴더명 | 소문자 + 하이픈 | `meeting-notes/` |
| 날짜 포함 시 | `YYYY-MM-DD-제목` | `2026-04-10-sprint-review.md` |
