locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  acm_certificate_name = "${var.project_name}-${var.environment}-application-acm-${replace(var.domain_name, ".", "-")}"
}

# --- ACM Certificate (DNS validation) in ap-northeast-1 -----------------------
resource "aws_acm_certificate" "this" {
  domain_name               = var.domain_name
  subject_alternative_names = []
  validation_method         = "DNS"
  lifecycle {
    create_before_destroy = true
  }

  tags = merge(local.common_tags, {
    Name    = local.acm_certificate_name
    Domain  = var.domain_name
    Purpose = "Application HTTPS team02-app.manoit.co.kr used by ALB Controller Ingress"
  })
}

# --- DNS validation records for each domain_validation_options entry ----------
resource "aws_route53_record" "validation" {
  for_each = {
    for option in aws_acm_certificate.this.domain_validation_options : option.domain_name => {
      name   = option.resource_record_name
      type   = option.resource_record_type
      record = option.resource_record_value
    }
  }

  zone_id = var.hosted_zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = var.route53_record_ttl
  records = [each.value.record]

  # Only the application validation CNAME is created here. The GitLab A-record
  # (aws_route53_record.gitlab in main.tf) and its ALIAS are left untouched, and
  # no existing record set identifier / name collision occurs because ACM DNS
  # validation uses a unique _acme-challenge.<domain> subdomain by definition.
}

# --- Certificate validation ----------------------------------------------------
resource "aws_acm_certificate_validation" "this" {
  certificate_arn = aws_acm_certificate.this.arn

  # Validate against the CNAME records created above. This completes once the DNS
  # provider answers with a matching TXT/CNAME record for _acme-challenge.<domain>.
  validation_record_fqdns = [for r in aws_route53_record.validation : r.fqdn]
}
