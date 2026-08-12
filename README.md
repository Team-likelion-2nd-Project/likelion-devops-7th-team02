# DevFlow

> **협업이 처음이신가요?** 이슈 생성부터 PR 머지까지 전 과정은 [협업 가이드](./docs/GUIDE.md)를 먼저 읽어주세요.

![Team](https://img.shields.io/badge/Team-team--02-151515?style=for-the-badge)
![React](https://img.shields.io/badge/React-151515?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-151515?style=for-the-badge\&logo=springboot\&logoColor=6DB33F)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-151515?style=for-the-badge\&logo=postgresql\&logoColor=4169E1)
![Docker](https://img.shields.io/badge/Docker-151515?style=for-the-badge\&logo=docker\&logoColor=2496ED)
![Kubernetes](https://img.shields.io/badge/Kubernetes-151515?style=for-the-badge\&logo=kubernetes\&logoColor=326CE5)
![AWS](https://img.shields.io/badge/AWS-151515?style=for-the-badge\&logo=amazonwebservices\&logoColor=FF9900)
![Terraform](https://img.shields.io/badge/Terraform-151515?style=for-the-badge\&logo=terraform\&logoColor=844FBA)
![GitLab](https://img.shields.io/badge/GitLab-151515?style=for-the-badge\&logo=gitlab\&logoColor=FC6D26)
![Prometheus](https://img.shields.io/badge/Prometheus-151515?style=for-the-badge\&logo=prometheus\&logoColor=E6522C)
![Grafana](https://img.shields.io/badge/Grafana-151515?style=for-the-badge\&logo=grafana\&logoColor=F46800)

> **프로젝트 관리와 DevOps 운영 상태를 하나의 흐름으로 연결하는 통합 프로젝트 관리 시스템**

**DevFlow**는 프로젝트와 업무(Task)를 관리하면서, 애플리케이션의 빌드·배포·운영 상태까지 함께 관리할 수 있도록 설계한 DevOps 통합 프로젝트 관리 시스템입니다.

단순한 Jira 형태의 업무 관리 서비스 구현에 그치지 않고, AWS와 Kubernetes 기반 인프라 위에서 GitLab CI/CD, Prometheus, Grafana를 연결하여 개발부터 배포, 모니터링까지 이어지는 전체 DevOps 흐름을 구성하는 것을 목표로 합니다.

* **배포 주소:** 추후 추가
* **시연 영상:** 추후 추가
* **문서 최종 정리일:** `2026-08-12`
* **구현 기준일:** `2026-08-12`

---

## 팀 구성

| 이름 | 역할 | 담당 | GitHub |
|------|------|------|--------|
| 김석현 | 팀장 / Backend | Spring Boot API, 인증/인가, PostgreSQL 연동, Project/Task 도메인 | [@alberione1110](https://github.com/alberione1110) |
| 이주원 | Frontend | React 기반 UI, API 연동, 프로젝트 및 업무 관리 화면 | [@ssac-JW](https://github.com/ssac-JW) |
| 김민호 | AWS / Kubernetes | AWS 인프라, Terraform, VPC, EKS, RDS, Kubernetes 리소스 | [@KimMinHo-02](https://github.com/KimMinHo-02) |
| 최윤재 | CI/CD / Monitoring | GitLab, GitLab Runner, CI/CD Pipeline, Prometheus, Grafana | [@cheesemango1](https://github.com/cheesemango1) |

> 역할은 주요 담당 영역을 기준으로 구분하며, 실제 개발 및 통합 과정에서는 영역 간 협업을 통해 진행합니다.

---

## 빠른 심사 흐름 (5분)

> 심사위원·멘토가 5분 안에 핵심 기능과 DevOps 구성을 확인할 수 있는 흐름입니다.

1. 배포된 DevFlow 서비스에 접속합니다.
2. 테스트 계정으로 로그인합니다.
3. 새로운 프로젝트를 생성합니다.
4. 프로젝트에 팀원을 등록합니다.
5. 프로젝트 내 업무(Task)를 생성하고 담당자와 상태를 설정합니다.
6. GitLab CI/CD Pipeline을 통해 애플리케이션의 Build / Test / Deploy 과정을 확인합니다.
7. Kubernetes 환경에 배포된 Frontend / Backend 상태를 확인합니다.
8. Prometheus / Grafana를 통해 애플리케이션 및 Kubernetes 모니터링 상태를 확인합니다.

---

## Core Design

> DevFlow가 기능 구현뿐 아니라 DevOps 프로젝트로서 의도적으로 선택한 설계 원칙입니다.

* **Application과 DevOps의 통합** — 프로젝트 관리 애플리케이션과 실제 배포·운영 환경을 하나의 프로젝트 안에서 구성합니다.
* **Infrastructure as Code** — AWS 인프라는 Terraform을 활용해 코드 기반으로 관리하고 재현 가능한 환경을 지향합니다.
* **Container First** — Frontend와 Backend를 Docker Image로 구성하고 Kubernetes 환경에서 실행합니다.
* **CI/CD Automation** — 코드 변경부터 Build, Test, Image Build, Deploy까지 가능한 범위에서 자동화합니다.
* **Observability** — Spring Boot Actuator, Prometheus, Grafana를 활용하여 애플리케이션과 Kubernetes 상태를 관측합니다.
* **Availability & Scalability** — Liveness Probe, Readiness Probe, HPA를 활용하여 장애 감지 및 트래픽 변화 대응 구조를 구성합니다.

---

## Architecture

![아키텍처](./docs/images/architecture.png)

```text
                              Internet
                                 |
                              Route 53
                                 |
                                 v
                                ALB
                                 |
                    +------------+------------+
                    |                         |
                    v                         v
             Frontend Pods              Backend Pods
             Amazon EKS                 Amazon EKS
                                              |
                                              v
                                      PostgreSQL / RDS


Developer
    |
    v
GitHub Repository
    |
    v
Self-managed GitLab
    |
    v
GitLab Runner
    |
    +--> Build
    |
    +--> Test
    |
    +--> Docker Image Build
    |
    +--> Container Registry Push
    |
    v
Amazon EKS
    |
    v
Kubernetes Deployment
    |
    +--> Liveness Probe
    |
    +--> Readiness Probe
    |
    +--> HPA
    |
    v
Prometheus
    |
    v
Grafana
```

> 위 아키텍처는 현재 설계 기준이며, 실제 구현 및 통합 과정에서 일부 구성은 변경될 수 있습니다.

| 영역                | 기술                                               |
| ----------------- | ------------------------------------------------ |
| Frontend          | React, Vite                                      |
| Backend           | Java 21, Spring Boot, Gradle, Spring Data JPA    |
| Database          | PostgreSQL                                       |
| Authentication    | Spring Security, JWT                             |
| API Documentation | Swagger / OpenAPI                                |
| Container         | Docker                                           |
| Infra             | AWS, Terraform                                   |
| Orchestration     | Kubernetes, Amazon EKS                           |
| CI/CD             | Self-managed GitLab, GitLab Runner, GitLab CI/CD |
| Monitoring        | Prometheus, Grafana                              |
| Metrics           | Spring Boot Actuator, Metrics Server             |
| Auto Scaling      | Kubernetes HPA                                   |

---

## 주요 기능

| 기능         | 설명                                | 로그인 필요 |
| ---------- | --------------------------------- | ------ |
| 회원가입       | 새로운 사용자 계정을 생성합니다.                | X      |
| 로그인        | 사용자 인증 후 JWT Access Token을 발급합니다. | X      |
| 내 정보 조회    | 로그인한 사용자의 정보를 조회합니다.              | O      |
| 프로젝트 생성    | 새로운 프로젝트를 생성합니다.                  | O      |
| 프로젝트 조회    | 사용자가 참여 중인 프로젝트를 조회합니다.           | O      |
| 프로젝트 팀원 관리 | 프로젝트에 참여할 팀원을 등록하고 조회합니다.         | O      |
| 업무 생성      | 프로젝트 내 새로운 업무(Task)를 생성합니다.       | O      |
| 업무 조회      | 프로젝트별 업무 목록과 상세 정보를 조회합니다.        | O      |
| 업무 상태 변경   | 업무의 진행 상태를 변경합니다.                 | O      |
| 업무 담당자 지정  | 프로젝트 팀원 중 업무 담당자를 지정합니다.          | O      |

주요 화면은 로그인, 프로젝트 목록, 프로젝트 상세, 업무 관리 화면을 중심으로 구성합니다.

API 상세 경로와 요청/응답 구조는 **GitHub Wiki > API 명세서**를 기준으로 관리합니다.

---

## Documentation

상세 설계 및 프로젝트 문서는 **GitHub Wiki**에서 관리합니다.

| 카테고리             | 문서                                      |
| ---------------- | --------------------------------------- |
| **Start Here**   | 프로젝트 개요 · 기능 요구사항 · 비기능 요구사항            |
| **Application**  | API 명세서 · ERD · 프로젝트 구조                 |
| **Architecture** | 시스템 아키텍처 · AWS 인프라 아키텍처 · Kubernetes 구성 |
| **DevOps**       | CI/CD 파이프라인 · 모니터링 구성                   |
| **Development**  | 개발 환경 · Git 브랜치 전략                      |
| **Operations**   | 배포 가이드 · 트러블슈팅                          |

---

## 범위 경계

> 현재 2차 프로젝트에서 제공하는 기능과 이후 고도화 범위를 구분합니다.

**현재 제공 및 구현 대상:**

* 회원가입 / 로그인
* JWT 기반 인증 및 인가
* 프로젝트 생성 및 조회
* 프로젝트 팀원 등록 및 조회
* 업무(Task) 생성 및 관리
* 업무 담당자 및 상태 관리
* PostgreSQL 기반 데이터 저장
* Docker 기반 애플리케이션 컨테이너화
* Terraform 기반 AWS 인프라 구성
* Amazon EKS 기반 Kubernetes 배포
* GitLab 기반 CI/CD Pipeline
* Prometheus / Grafana 기반 모니터링
* Health Check / Liveness / Readiness Probe
* Kubernetes HPA

**현재 미제공 또는 3차 프로젝트 예정:**

* CI/CD Pipeline 상태의 DevFlow 화면 내 시각화
* 배포 이력 조회
* Kubernetes Pod / Deployment 상태의 서비스 내 시각화
* 모니터링 데이터를 프로젝트 화면에 직접 연계
* 프로젝트 및 업무 검색 / 필터 / 페이지네이션 고도화
* 운영 및 장애 대응 기능 고도화

**배포 단계:** `dev` → **`demo` (2차 프로젝트 목표)** → `prod` (추후 검토)

---

## 보안과 개인정보 경계

이 저장소는 공개 저장소를 기준으로 관리합니다. 다음 정보는 저장소에 포함하지 않습니다.

* AWS Access Key / Secret Access Key
* GitLab Access Token
* JWT Secret Key
* 실제 Database 계정 및 비밀번호
* `.env` 실제 값
* 인증서 및 Private Key
* 실제 사용자 개인정보
* 운영 DB 접속 정보
* 외부에서 직접 접근할 필요가 없는 내부 인프라 정보

환경별 비밀값은 환경변수 및 GitLab CI/CD Variable을 통해 관리합니다.

비밀값이 Git 이력에 포함된 경우 단순히 커밋을 되돌리는 것으로 처리하지 않고, 해당 Credential을 즉시 폐기하고 재발급합니다.

---

## 로컬 실행

**사전 요구사항**

* Java 21
* Node.js
* Docker
* Docker Compose
* Git

### Backend

macOS / Linux

```bash
cd backend
./gradlew bootRun
```

Windows PowerShell

```powershell
cd backend
.\gradlew.bat bootRun
```

Docker Compose를 이용해 PostgreSQL을 실행하는 경우:

```bash
docker compose up -d
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### 기본 접속 주소

* Backend: `http://localhost:8080`
* Swagger: `http://localhost:8080/swagger-ui/index.html`
* Frontend: Vite 실행 시 출력되는 Local URL

### 검증

Backend — macOS / Linux

```bash
cd backend
./gradlew test
./gradlew build
```

Backend — Windows PowerShell

```powershell
cd backend
.\gradlew.bat test
.\gradlew.bat build
```

Frontend

```bash
cd frontend
npm install
npm run build
```

---

## 기여 방법

기능 개발은 GitHub Issue와 Pull Request를 기준으로 진행합니다.

```text
Issue 생성
    ↓
Feature Branch 생성
    ↓
기능 개발
    ↓
Local Test
    ↓
Commit / Push
    ↓
Pull Request
    ↓
Code Review
    ↓
Merge
    ↓
CI/CD 및 배포 상태 확인
```

* **규칙 요약** — [CONTRIBUTING.md](./CONTRIBUTING.md)
* **실행 방법 상세** — [협업 가이드](./docs/GUIDE.md)

---

## License

프로젝트 라이선스는 최종 배포 전 확정할 예정입니다.
