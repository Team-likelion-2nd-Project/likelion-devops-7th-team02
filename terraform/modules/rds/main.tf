locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  db_instance_identifier = "${var.project_name}-${var.environment}-db"
  db_subnet_group_name   = "${var.project_name}-${var.environment}-db-subnet-group"
}

resource "aws_db_subnet_group" "rds" {
  name       = local.db_subnet_group_name
  subnet_ids = var.subnet_ids

  tags = merge(local.common_tags, {
    Name = local.db_subnet_group_name
  })
}

resource "aws_db_instance" "rds" {
  identifier          = local.db_instance_identifier
  engine              = var.engine
  engine_version      = var.engine_version
  instance_class      = var.instance_class
  allocated_storage   = var.allocated_storage
  db_name             = var.db_name
  username            = var.db_username
  password            = var.db_password
  skip_final_snapshot = true

  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [var.security_group_id]

  multi_az                = var.multi_az
  publicly_accessible     = false
  storage_encrypted       = true
  backup_retention_period = 7

  tags = merge(local.common_tags, {
    Name = local.db_instance_identifier
  })
}

output "endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.rds.endpoint
}

output "port" {
  description = "RDS port"
  value       = aws_db_instance.rds.port
}

output "database_name" {
  description = "RDS database name"
  value       = aws_db_instance.rds.db_name
}

output "db_subnet_group_name" {
  description = "RDS DB subnet group name"
  value       = aws_db_subnet_group.rds.name
}
