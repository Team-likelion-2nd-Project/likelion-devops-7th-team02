locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  iam_role_name   = "${var.project_name}-${var.environment}-aws-load-balancer-controller-role"
  iam_policy_name = "${var.project_name}-${var.environment}-aws-load-balancer-controller-policy"
}

# --- AWS Load Balancer Controller IAM Policy (official v2.14.1) ------------
resource "aws_iam_policy" "alb_controller" {
  name        = local.iam_policy_name
  description = "IAM policy for AWS Load Balancer Controller (v2.14.1, official upstream policy)"

  policy = file("${path.module}/iam_policy.json")

  tags = merge(local.common_tags, { Name = local.iam_policy_name })
}

# --- IAM Role with IRSA trust via existing EKS OIDC Provider ---------------
resource "aws_iam_role" "alb_controller" {
  name = local.iam_role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Principal = {
        Federated = var.oidc_provider_arn
      }

      Action = "sts:AssumeRoleWithWebIdentity"

      Condition = {
        StringEquals = {
          "${replace(var.oidc_issuer_url, "https://", "")}:sub" = "system:serviceaccount:kube-system:aws-load-balancer-controller"
          "${replace(var.oidc_issuer_url, "https://", "")}:aud" = "sts.amazonaws.com"
        }
      }
    }]
  })

  tags = merge(local.common_tags, { Name = local.iam_role_name })
}

# --- Attach the official IAM Policy to the Role ----------------------------
resource "aws_iam_role_policy_attachment" "alb_controller" {
  role       = aws_iam_role.alb_controller.name
  policy_arn = aws_iam_policy.alb_controller.arn
}
