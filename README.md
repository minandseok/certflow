# CertFlow

자격증 공부 기록을 GitHub 잔디 그래프처럼 시각화하여 관리하는 웹 애플리케이션

> 💻 이 프로젝트는 [Cursor](https://cursor.sh)로 제작되었습니다.

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [프로젝트 구조](#프로젝트-구조)
- [데이터 형식](#데이터-형식)
- [기능 상세](#기능-상세)
- [SEO 및 접근성](#seo-및-접근성)
- [업데이트 내역](#업데이트-내역)

## ✨ 주요 기능

- **GitHub 스타일 캘린더**: 공부한 날짜를 잔디 그래프처럼 시각화
- **회원별 기록 관리**: 각 회원의 공부 기록을 개별적으로 확인
- **월별 기록 표시**: 전체 회원의 공부 기록을 월별로 정리하여 표시
- **반응형 디자인**: 모바일과 데스크톱 환경 모두 지원
- **상세 정보 제공**: 날짜별 자격증명, 공부 범위 등 상세 정보 제공

## 🛠 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Geist Sans, Geist Mono

## 🚀 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm, yarn, pnpm 또는 bun

### 설치 및 실행

1. **저장소 클론**
```bash
git clone <repository-url>
cd certflow
```

2. **의존성 설치**
```bash
npm install
```

3. **개발 서버 실행**
```bash
npm run dev
```

4. **브라우저에서 열기**
```
http://localhost:3000
```

## 📁 프로젝트 구조

```
certflow/
├── app/
│   ├── api/
│   │   └── study-data/      # API 라우트
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 메인 페이지
│   ├── robots.ts            # SEO: robots.txt
│   ├── sitemap.ts           # SEO: sitemap.xml
│   └── manifest.ts          # PWA 매니페스트
├── components/
│   └── StudyCalendar.tsx    # 메인 캘린더 컴포넌트
├── data/
│   └── studyRecords.json    # 공부 기록 데이터
├── lib/
│   └── dataService.ts       # 데이터 서비스
└── utils/
    ├── dateUtils.ts         # 날짜 유틸리티
    └── calendarUtils.ts     # 캘린더 유틸리티
```

## 📊 데이터 형식

`data/studyRecords.json` 파일 형식:

```json
{
  "members": ["홍길동", "김철수", "이영희"],
  "records": [
    {
      "date": "2026-01-15",
      "memberName": "홍길동",
      "certificate": "정보처리기사",
      "studyRange": "1장 ~ 3장"
    }
  ]
}
```

## 🎯 기능 상세

### 회원별 공부 기록
- 회원 선택 시 해당 회원의 공부 기록만 캘린더에 표시
- 연도별로 기록 확인 가능 (2026-2027년)
- 전체 공부 일수 자동 계산

### 전체 월별 공부기록
- 모든 회원의 공부 기록을 월별로 정리
- 년도 및 월 필터링 기능
- 테이블 형태로 상세 정보 제공

### 반응형 지원
- **데스크톱**: 마우스 호버로 상세 정보 확인
- **모바일**: 날짜 클릭으로 상세 정보 확인

## 🔍 SEO 및 접근성

- 메타데이터 최적화
- Open Graph 태그
- 구조화된 데이터 (JSON-LD)
- ARIA 레이블 및 시맨틱 HTML
- robots.txt 및 sitemap.xml 자동 생성

## 📝 업데이트 내역

### 주요 기능
- ✅ GitHub 잔디 그래프 스타일 캘린더 구현
- ✅ 회원별 공부 기록 관리
- ✅ 전체 월별 공부 기록 표시
- ✅ 반응형 디자인 (모바일/데스크톱)
- ✅ 모바일 클릭 인터랙션 지원
- ✅ SEO 최적화 (메타데이터, Open Graph, 구조화된 데이터)
- ✅ 접근성 개선 (ARIA 레이블, 시맨틱 HTML)
- ✅ PWA 지원 (매니페스트)

### 기술적 개선
- ✅ TypeScript 타입 안정성
- ✅ 코드 최적화 및 리팩토링
- ✅ 상수 분리 및 재사용성 향상
- ✅ robots.txt 및 sitemap.xml 자동 생성

## 📦 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
npm run start
```

### Vercel 배포

[Vercel](https://vercel.com)에서 Next.js 앱을 쉽게 배포할 수 있습니다.

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참고하세요.

## 📄 라이선스

이 프로젝트는 개인 사용 목적으로 제작되었습니다.
