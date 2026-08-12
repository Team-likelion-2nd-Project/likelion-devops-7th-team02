locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  iam_role_name   = "${var.project_name}-${var.environment}-external-dns-role"
  iam_policy_name = "${var.project_name}-${var.environment}-external-dns-policy"
}

# --- ExternalDNS IAM Policy --------------------------------------------------
resource "aws_iam_policy" "external_dns" {
  name        = local.iam_policy_name
  description = "Least-privilege IAM policy for Kubernetes ExternalDNS to manage team02-app.manoit.co.kr in Route53"

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "route53:ChangeResourceRecordSets"
        ]

        Resource = "arn:aws:route53:::hostedzone/${var.hosted_zone_id}"

        Condition = {
          "ForAllValues:StringEquals" = {
            "route53:ChangeResourceRecordSetsNormalizedRecordNames" = [
              "team02-app.manoit.co.kr"
            ]
          }
        }
      },
      {
        Effect = "Allow"

        Action = [
          "route53:ListResourceRecordSets",
          "route53:ListTagsForResources"
        ]

        Resource = "arn:aws:route53:::hostedzone/${var.hosted_zone_id}"
      },
      {
        Effect = "Allow"

        Action = [
          "route53:ListHostedZones"
        ]

        Resource = "*"
      }
    ]
  })

  tags = merge(local.common_tags, {
    Name = local.iam_policy_name
  })
}

# --- IAM Role with IRSA trust via existing EKS OIDC Provider ----------------
resource "aws_iam_role" "external_dns" {
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
          "${replace(var.oidc_issuer_url, "https://", "")}:sub" = "system:serviceaccount:external-dns:external-dns"
          "${replace(var.oidc_issuer_url, "https://", "")}:aud" = "sts.amazonaws.com"
        }
      }
    }]
  })

  tags = merge(local.common_tags, {
    Name = local.iam_role_name
  })
}

# --- Attach ExternalDNS Policy to dedicated Role -----------------------------
resource "aws_iam_role_policy_attachment" "external_dns" {
  role       = aws_iam_role.external_dns.name
  policy_arn = aws_iam_policy.external_dns.arn
}
