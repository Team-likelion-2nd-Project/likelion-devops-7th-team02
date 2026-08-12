variable "project_name" {
  description = "Project name used for resource naming and tagging"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g. dev)"
  type        = string
}

variable "oidc_provider_arn" {
  description = "ARN of the existing EKS OIDC provider to use for IRSA trust policy"
  type        = string
}

variable "oidc_issuer_url" {
  description = "OIDC issuer URL of the EKS cluster (https://oidc.eks.<region>.amazonaws.com/id/<id>)"
  type        = string
}
