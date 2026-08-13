# DevFlow Monitoring

DevFlow 애플리케이션과 Kubernetes 환경의 상태를 모니터링하기 위해 Prometheus와 Grafana를 구성합니다.

2차 프로젝트에서는 Helm을 사용하지 않고 Kubernetes Manifest 기반으로 Prometheus와 Grafana를 구성합니다.  
Application 및 Monitoring 관련 Kubernetes Manifest는 Infra 담당자가 작성 및 테스트 중이며, Manifest가 저장소에 공유된 이후 실제 EKS 환경에서 모니터링 구성 및 검증을 진행합니다.

---

## 구성 요소

DevFlow Monitoring은 다음 구성요소를 사용합니다.

- Prometheus
- Grafana
- kube-state-metrics
- node-exporter
- Spring Boot Actuator
- Micrometer Prometheus Registry

Backend에는 Spring Boot Actuator와 Micrometer Prometheus Registry가 적용되어 있으며 Prometheus가 애플리케이션 메트릭을 수집할 수 있도록 구성되어 있습니다.

---

## Backend Metrics Endpoint

Backend Application은 다음 Endpoint를 통해 Prometheus Metrics를 제공합니다.

```text
/actuator/prometheus
```

Backend의 Spring Security 설정에서는 다음 Endpoint에 인증 없이 접근할 수 있도록 설정되어 있습니다.

```text
/actuator/health/**
/actuator/prometheus
```

따라서 Backend가 Kubernetes 환경에 정상적으로 배포된 이후 Prometheus가 `/actuator/prometheus` Endpoint를 통해 애플리케이션 메트릭을 수집할 수 있습니다.

---

## 모니터링 구조

전체적인 Application Monitoring 흐름은 다음과 같습니다.

```text
Backend Application
        │
        │ /actuator/prometheus
        ▼
    Prometheus
        │
        ▼
      Grafana
        │
        ▼
DevFlow Dashboard
```

Kubernetes 환경에서는 애플리케이션 메트릭뿐만 아니라 Kubernetes 리소스 및 Node 상태도 함께 수집합니다.

```text
EKS
 │
 ├── Application Metrics
 │     └── Spring Boot Actuator
 │
 ├── Kubernetes Resource Metrics
 │     └── kube-state-metrics
 │
 └── Node Metrics
       └── node-exporter
```

---

## 주요 모니터링 항목

### Application Metrics

- HTTP Request Rate
- HTTP Error Rate
- HTTP Response Time
- JVM Memory Usage
- Process CPU Usage
- HikariCP Connection Pool

### Kubernetes Metrics

- Pod CPU Usage
- Pod Memory Usage
- Pod Restart Count
- Deployment Replica Count
- Pod Status
- Node Resource Usage

---

## Prometheus 검증

Monitoring Kubernetes Manifest가 저장소에 반영된 이후 EKS 환경에 Manifest를 적용합니다.

먼저 Monitoring Namespace의 Pod와 Service 상태를 확인합니다.

```bash
kubectl get pods -n monitoring
kubectl get services -n monitoring
```

Prometheus Pod가 정상적으로 실행되는지 확인한 후 Prometheus Target에서 Backend Application이 정상적으로 수집되고 있는지 확인합니다.

Backend Metrics Endpoint:

```text
/actuator/prometheus
```

주요 확인 사항은 다음과 같습니다.

- Prometheus Pod 정상 실행
- Backend Target 상태 `UP`
- `/actuator/prometheus` 접근 가능
- Spring Boot Application Metrics 수집
- Kubernetes Metrics 수집
- Node Metrics 수집

---

## Grafana 검증

Grafana Pod가 정상적으로 실행되는지 확인합니다.

```bash
kubectl get pods -n monitoring
```

Grafana 접속 후 Prometheus가 Data Source로 정상 연결되어 있는지 확인합니다.

Grafana Dashboard에서는 다음 항목을 우선적으로 구성합니다.

- Backend HTTP Request
- Backend HTTP Error Rate
- Backend Response Time
- JVM Memory Usage
- Process CPU Usage
- Pod CPU Usage
- Pod Memory Usage
- Pod Restart Count
- Deployment Replica 상태

Dashboard 구성이 완료되면 Grafana에서 Dashboard JSON을 Export하여 저장소에 보관합니다.

```text
monitoring/grafana/dashboards/devflow-backend.json
```

---

## CI/CD 연계

GitLab CI/CD에서는 Kubernetes 배포 이후 애플리케이션 상태를 검증할 수 있도록 다음 작업을 구성합니다.

```text
Build
  ↓
Test
  ↓
Docker Image Build
  ↓
GitLab Container Registry Push
  ↓
AWS / EKS Verify
  ↓
Kubernetes Deploy
  ↓
Rollout Check
  ↓
Health Check
```

현재 다음 스크립트가 준비되어 있습니다.

```text
scripts/
├── deploy.sh
├── health-check.sh
└── rollback.sh
```

각 스크립트의 역할은 다음과 같습니다.

### deploy.sh

- EKS kubeconfig 설정
- Kubernetes Manifest 적용
- Frontend / Backend 이미지 업데이트
- Commit SHA 기반 Docker Image 배포
- Frontend / Backend Rollout 상태 확인

### health-check.sh

- Deployment 상태 확인
- Pod 상태 확인
- Service 상태 확인
- Frontend / Backend Rollout 확인
- Backend Readiness Endpoint 확인
- Backend Liveness Endpoint 확인

### rollback.sh

- Deployment Rollout History 확인
- Frontend / Backend 이전 Revision 복구
- Rollback 상태 확인
- Rollback 이후 Image 및 Pod 상태 확인

---

## 현재 진행 상태

현재까지 다음 작업이 완료되었습니다.

- GitLab Runner 구성
- Docker Executor 구성
- Docker Socket Mount 구성
- Frontend Build 검증
- Backend Build 검증
- Backend Test 검증
- Frontend Docker Image Build 및 Registry Push
- Backend Docker Image Build 및 Registry Push
- Commit SHA 기반 Image Tag 적용
- AWS IAM 인증 검증
- GitLab Runner에서 EKS 접근 검증
- kubectl 접근 검증
- Kubernetes Deploy Job 구성
- Health Check Job 구성
- Rollback Job 구성
- `deploy.sh` 작성
- `health-check.sh` 작성
- `rollback.sh` 작성
- Backend Actuator 구성 확인
- Micrometer Prometheus Registry 구성 확인
- `/actuator/prometheus` 접근 설정 확인

현재 GitLab Container Registry에 다음 이미지가 Push된 상태입니다.

```text
Frontend
team02-gitlab.manoit.co.kr:5050/root/devflow/frontend:ad0087fe

Backend
team02-gitlab.manoit.co.kr:5050/root/devflow/backend:ad0087fe
```

---

## 현재 대기 사항

Application 및 Monitoring Kubernetes Manifest는 Infra 담당자가 작성하여 테스트 중입니다.

현재 해당 YAML 파일이 저장소에 공유되지 않았기 때문에 다음 작업은 아직 실제 환경에서 수행하지 않았습니다.

- Kubernetes Manifest 실제 적용
- GitLab CI/CD를 통한 실제 EKS Deploy 검증
- Frontend / Backend Rollout 실제 검증
- Health Check Job 실제 검증
- Rollback Job 실제 검증
- Prometheus 실제 배포 및 Target 확인
- Backend Metrics 수집 확인
- Grafana 실제 배포 및 Data Source 연결
- Grafana Dashboard 구성

따라서 현재 단계는 **CI/CD 및 Monitoring 연계를 위한 코드와 스크립트 준비는 완료되었으며, Infra Kubernetes Manifest 공유 후 실제 EKS 환경 검증을 진행하기 위한 대기 상태**입니다.

---

## 향후 작업

Infra 담당자의 Kubernetes Manifest 테스트 및 공유가 완료되면 다음 순서로 작업합니다.

1. Kubernetes Manifest 구조 확인
2. Namespace / Deployment / Container / Service 이름 정합성 확인
3. Registry Image 및 ImagePullSecret 설정 확인
4. `deploy.sh`와 Kubernetes Manifest 경로 정합성 확인
5. GitLab `deploy-dev` Job 실행
6. Frontend / Backend Pod 및 Rollout 상태 확인
7. `health-check-dev` 실행
8. Backend Readiness / Liveness 확인
9. `rollback-dev`를 통한 Rollback 검증
10. Prometheus Pod 및 Service 확인
11. Prometheus Backend Target 확인
12. `/actuator/prometheus` Metrics 수집 확인
13. Grafana Prometheus Data Source 연결 확인
14. DevFlow Grafana Dashboard 구성
15. Dashboard JSON Export 및 저장소 반영
16. Pipeline Webhook 구성
17. CI/CD 운영 문서 및 장애 대응 문서 작성

