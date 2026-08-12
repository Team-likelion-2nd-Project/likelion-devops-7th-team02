locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  instance_name_tag = "${var.project_name}-${var.environment}-${var.instance_name}"
}

resource "aws_iam_role" "gitlab" {
  name = "${local.instance_name_tag}-iam-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_instance_profile" "gitlab" {
  name = "${local.instance_name_tag}-instance-profile"
  role = aws_iam_role.gitlab.name
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.gitlab.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_instance" "gitlab" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [var.security_group_id]
  iam_instance_profile        = aws_iam_instance_profile.gitlab.name
  user_data_replace_on_change = false
  user_data = templatefile("${path.module}/user_data.sh.tpl",
    {
      gitlab_hostname = var.gitlab_hostname
  })


  root_block_device {
    volume_size = var.root_volume_size
    volume_type = var.root_volume_type
    encrypted   = true
  }

  tags = merge(local.common_tags, {
    Name = local.instance_name_tag
  })
}

output "instance_id" {
  description = "GitLab EC2 Instance ID"
  value       = aws_instance.gitlab.id
}

output "private_ip" {
  description = "GitLab EC2 Private IP"
  value       = aws_instance.gitlab.private_ip
}

output "public_ip" {
  description = "GitLab EC2 Public IP"
  value       = aws_instance.gitlab.public_ip
}
