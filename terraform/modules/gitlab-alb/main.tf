# GitLab ALB 모듈: GitLab 웹(443)과 Container Registry(5050)를 HTTPS 로 노출
# Application 용 ALB 는 Ingress + LBC 가 만들며 이 모듈과 무관하다.

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  alb_name = "${var.project_name}-${var.environment}-gitlab-alb"
}

resource "aws_lb" "gitlab" {
  name               = local.alb_name
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.subnet_ids

  enable_deletion_protection = false

  tags = merge(local.common_tags, {
    Name = local.alb_name
  })
}

# GitLab 웹 UI 대상 그룹 (로그인 페이지로 health check)
resource "aws_lb_target_group" "gitlab_web" {
  name     = "${local.alb_name}-web"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/users/sign_in"
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 30
    matcher             = "200-399"
  }

  tags = merge(local.common_tags, {
    Name = "${local.alb_name}-web-tg"
  })
}

# Container Registry 대상 그룹 (/v2/ 는 인증 전이라 401 도 정상으로 본다)
resource "aws_lb_target_group" "gitlab_registry" {
  name     = "${local.alb_name}-registry"
  port     = 5050
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/v2/"
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 30
    matcher             = "200,401"
  }

  tags = merge(local.common_tags, {
    Name = "${local.alb_name}-registry-tg"
  })
}

# GitLab EC2 를 각 대상 그룹에 등록
resource "aws_lb_target_group_attachment" "gitlab_web" {
  target_group_arn = aws_lb_target_group.gitlab_web.arn
  target_id        = var.gitlab_instance_id
  port             = 80
}

resource "aws_lb_target_group_attachment" "gitlab_registry" {
  target_group_arn = aws_lb_target_group.gitlab_registry.arn
  target_id        = var.gitlab_instance_id
  port             = 5050
}


# HTTP(80) -> HTTPS(443) 리다이렉트
resource "aws_lb_listener" "http_redirect" {
  load_balancer_arn = aws_lb.gitlab.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# HTTPS 443: GitLab 웹
resource "aws_lb_listener" "https_web" {

  load_balancer_arn = aws_lb.gitlab.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.gitlab_web.arn
  }
}

# HTTPS 5050: Container Registry (docker login/push/pull)
resource "aws_lb_listener" "https_registry" {

  load_balancer_arn = aws_lb.gitlab.arn
  port              = 5050
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.gitlab_registry.arn
  }
}

# Route53 A(ALIAS) 레코드 생성에 사용된다.
output "alb_dns_name" {
  description = "GitLab ALB DNS name"
  value       = aws_lb.gitlab.dns_name
}

output "alb_zone_id" {
  description = "GitLab ALB Zone ID"
  value       = aws_lb.gitlab.zone_id
}
