#!/bin/sh
set -eu

NAMESPACE="devflow"
CLUSTER_NAME="${EKS_CLUSTER_NAME:-devflow-dev-eks}"
AWS_REGION="${AWS_REGION:-ap-northeast-1}"

FRONTEND_IMAGE="$CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHORT_SHA"
BACKEND_IMAGE="$CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHORT_SHA"

echo "=== Configure EKS ==="

aws eks update-kubeconfig \
  --region "$AWS_REGION" \
  --name "$CLUSTER_NAME"

echo "=== Apply Kubernetes manifests ==="

kubectl apply -f k8s/namespace.yaml

kubectl apply -f k8s/frontend/serviceaccount.yaml
kubectl apply -f k8s/frontend/configmap.yaml
kubectl apply -f k8s/frontend/service.yaml
kubectl apply -f k8s/frontend/deployment.yaml

kubectl apply -f k8s/backend/serviceaccount.yaml
kubectl apply -f k8s/backend/configmap.yaml
kubectl apply -f k8s/backend/service.yaml
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/hpa.yaml

echo "=== Update Frontend Image ==="

kubectl set image deployment/frontend \
  frontend="$FRONTEND_IMAGE" \
  -n "$NAMESPACE"

echo "=== Update Backend Image ==="

kubectl set image deployment/backend \
  backend="$BACKEND_IMAGE" \
  -n "$NAMESPACE"

echo "=== Check Frontend Rollout ==="

kubectl rollout status deployment/frontend \
  -n "$NAMESPACE" \
  --timeout=180s

echo "=== Check Backend Rollout ==="

kubectl rollout status deployment/backend \
  -n "$NAMESPACE" \
  --timeout=180s

echo "=== Current Pods ==="

kubectl get pods -n "$NAMESPACE"

echo "=== Deployment completed successfully ==="
