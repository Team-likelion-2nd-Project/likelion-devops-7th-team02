output "iam_role_arn" {
  description = "IAM role ARN attached to the GitLab EC2 instance and used by GitLab Runner for EKS authentication"
  value       = aws_iam_role.gitlab.arn
}

output "iam_role_name" {
  description = "IAM role name attached to the GitLab EC2 instance"
  value       = aws_iam_role.gitlab.name
}

output "instance_profile_name" {
  description = "IAM instance profile name attached to the GitLab EC2 instance"
  value       = aws_iam_instance_profile.gitlab.name
}
