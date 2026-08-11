output "vpc_id" {
  description = "VPC ID"
  value       = module.network.vpc_id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = module.network.public_subnet_ids
}

output "private_app_subnet_ids" {
  description = "List of private application subnet IDs"
  value       = module.network.private_app_subnet_ids
}

output "private_db_subnet_ids" {
  description = "List of private database subnet IDs"
  value       = module.network.private_db_subnet_ids
}

output "alb_security_group_id" {
  description = "ALB Security Group ID"
  value       = module.security.alb_security_group_id
}

output "gitlab_security_group_id" {
  description = "GitLab Security Group ID"
  value       = module.security.gitlab_security_group_id
}

output "eks_node_security_group_id" {
  description = "EKS Node Security Group ID"
  value       = module.security.eks_node_security_group_id
}

output "rds_security_group_id" {
  description = "RDS Security Group ID"
  value       = module.security.rds_security_group_id
}

output "gitlab_instance_id" {
  description = "GitLab EC2 Instance ID"
  value       = module.gitlab.instance_id
}

output "gitlab_private_ip" {
  description = "GitLab EC2 Private IP"
  value       = module.gitlab.private_ip
}

output "gitlab_public_ip" {
  description = "GitLab EC2 Public IP"
  value       = module.gitlab.public_ip
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = module.rds.endpoint
}

output "rds_port" {
  description = "RDS port"
  value       = module.rds.port
}

output "db_subnet_group_name" {
  description = "RDS DB subnet group name"
  value       = module.rds.db_subnet_group_name
}

# --- EKS -----------------------------------------------------------------
output "eks_cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "eks_cluster_arn" {
  description = "EKS cluster ARN"
  value       = module.eks.cluster_arn
}

output "eks_cluster_endpoint" {
  description = "EKS cluster API endpoint (private + public)"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_version" {
  description = "Kubernetes version in use on the EKS cluster"
  value       = module.eks.cluster_version
}

output "eks_cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster control plane (created by EKS)"
  value       = module.eks.cluster_security_group_id
}

output "eks_cluster_role_arn" {
  description = "IAM role ARN for the EKS cluster"
  value       = module.eks.cluster_iam_role_arn
}

output "eks_node_role_arn" {
  description = "IAM role ARN for managed node group EC2 instances"
  value       = module.eks.node_role_arn
}

output "eks_vpc_cni_role_arn" {
  description = "Dedicated IAM role ARN used by kube-system/aws-node (VPC CNI)"
  value       = module.eks.vpc_cni_role_arn
}

output "eks_oidc_provider_arn" {
  description = "ARN of the EKS OIDC provider for service-account-level IAM integration"
  value       = module.eks.oidc_provider_arn
}

output "eks_oidc_provider_url" {
  description = "URL of the EKS OIDC provider"
  value       = module.eks.oidc_provider_url
}

output "eks_node_group_name" {
  description = "EKS managed node group name"
  value       = module.eks.node_group_name
}

output "eks_launch_template_id" {
  description = "Launch template ID used by the managed node group (enforces DevFlow EKS Node SG)"
  value       = module.eks.launch_template_id
}
