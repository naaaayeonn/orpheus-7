# 🚀 ORPHEUS-7 : Space Mission Control

> **Prototype Pollution과 SSRF(Server-Side Request Forgery)를 활용한 웹해킹 CTF 문제 제작 프로젝트**

---

# 📖 프로젝트 소개

ORPHEUS-7은 우주 관제 시스템(Mission Control System)을 배경으로 하는 웹해킹 CTF 문제이다.

플레이어는 일반 관제 요원 계정으로 로그인하여 위성 관리 시스템을 분석하고, 웹 서비스에 존재하는 취약점을 이용해 내부 관제 서버(Mission Core)에 접근한 후 비밀 위성 **ORPHEUS-7**의 정보를 획득하는 것이 목표이다.

---

# 🎯 프로젝트 목표

* Node.js(Express)를 이용한 웹 서비스 개발
* Prototype Pollution 취약점 구현
* SSRF(Server-Side Request Forgery) 취약점 구현
* 취약점 체인(Attack Chain)을 활용한 CTF 문제 제작
* Docker 기반 문제 배포 환경 구축

---

# 🌌 시나리오

민간 우주기업 **AstraLink**는 여러 위성과 탐사선을 관리하는 **Mission Control System**을 운영하고 있다.

최근 관제망에 등록되지 않은 위성 **ORPHEUS-7**의 신호가 감지되었지만, 해당 정보는 일반 관제 요원에게 공개되지 않는다.

플레이어는 시스템을 분석하여 내부 관제 서버에 접근하고, ORPHEUS-7의 숨겨진 정보를 획득해야 한다.

---

# 🛰️ 주요 기능

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
* Internal Command API

---

# 🔓 취약점 구성

## 1. Prototype Pollution

Communication Settings 기능에서 사용자의 설정 정보를 병합하는 과정에서 Prototype Pollution이 발생한다.

예상 구조

```javascript
merge(userSettings, req.body);
```

---

## 2. SSRF

Telemetry 기능은 사용자가 입력한 Endpoint를 서버가 대신 요청하는 구조이다.

예상 구조

```javascript
fetch(endpoint);
```

이를 이용하여 내부 Mission Core 서버에 접근할 수 있다.

---

# ⚔️ 예상 공격 흐름

```text
Login
      │
      ▼
Communication Settings
      │
      ▼
Prototype Pollution
      │
      ▼
Telemetry Monitor
      │
      ▼
SSRF
      │
      ▼
Internal Mission Core
      │
      ▼
ORPHEUS-7
      │
      ▼
FLAG
```

---

# 🛠️ 개발 환경

### Backend

* Node.js
* Express

### Frontend

* HTML
* CSS
* JavaScript

### Deployment

* Docker

### Analysis

* Burp Suite
* Chrome DevTools

---

# 📂 프로젝트 구조(예정)

```text
orpheus-7/
│
├── app.js
├── routes/
│   ├── auth.js
│   ├── satellite.js
│   ├── telemetry.js
│   └── settings.js
│
├── controllers/
│
├── utils/
│   └── merge.js
│
├── models/
│
├── views/
│
├── public/
│
├── docker/
│
└── README.md
```

---

# 📅 개발 일정

## Week 1

* 프로젝트 기획
* UI 설계
* 프로젝트 구조 설계
* 로그인 구현
* 위성 목록 구현
* Dashboard 구현

---

## Week 2

* Communication Settings 구현
* Prototype Pollution 취약점 구현
* Telemetry 기능 구현
* SSRF 취약점 구현

---

## Week 3

* Internal Mission Core 구축
* 공격 흐름 설계
* Flag 배치
* 난이도 조정
* UI 개선

---

## Week 4

* Docker 환경 구축
* 테스트
* Write-up 작성
* 발표 자료 제작
* 최종 배포

---

# 🎯 최종 목표

* 웹해킹 CTF 문제 1개 제작
* Docker 기반 배포 환경 구축
* Write-up 작성
* GitHub Repository 공개
* 실제 CTF 환경과 유사한 문제 구현

---

# 📚 참고 자료

* PortSwigger Web Security Academy
* Dreamhack Wargame
* OWASP Top 10
* HackTricks

