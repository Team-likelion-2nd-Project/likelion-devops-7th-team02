variable "project_name" {
  description = "Project name"
  type        = string
  default     = "devflow"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}
variable "gitlab_instance_type" {
  description = "Gitlab Instance type"
  type        = string
  default     = "t3.large"
}

variable "gitlab_ami_id" {
  description = "Gitlab ami id"
  type        = string
  default     = "ami-05f4eb3328c0dabc5"
}

variable "gitlab_hostname" {
  description = "Gitlab external hostname"
  type        = string
  default     = "team02-gitlab.manoit.co.kr"
}

variable "db_name" {
  description = "DB name"
  type        = string
  default     = "deflow_db"
}

variable "db_username" {
  description = "DB UserName"
  type        = string
  default     = "dbadmin"
}

variable "db_instance" {
  description = "DB instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "db_storage" {
  description = "DB Storage"
  type        = number
  default     = 50
}

variable "db_multiaz" {
  description = "DB MultiAz"
  type        = bool
  default     = false
}

variable "db_password" {
  description = "Database password (sensitive)"
  type        = string
  sensitive   = true
}

variable "kubernetes_version" {
  description = "Kubernetes Vesion"
  type        = string
  default     = "1.36"
}

variable "node_instance_type" {
  description = "Node Instance Type"
  type        = string
  default     = "t3.medium"
}

variable "certificate_arn" {
  description = "ACM arn"
  type        = string
  sensitive   = true
}
