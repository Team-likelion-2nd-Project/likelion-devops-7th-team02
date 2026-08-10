locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  eks_cluster_name_tag = var.eks_cluster_name != "" ? var.eks_cluster_name : var.project_name
}

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-vpc"
  })
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-igw"
  })
}

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-nat-eip"
  })
}

resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-nat"
  })

  depends_on = [aws_internet_gateway.main]
}

resource "aws_subnet" "public" {
  count = length(var.azs)

  cidr_block        = var.public_subnet_cidrs[count.index]
  availability_zone = var.azs[count.index]
  vpc_id            = aws_vpc.main.id

  map_public_ip_on_launch = true

  tags = merge(local.common_tags, {
    Name                                                  = "${var.project_name}-${var.environment}-public-${count.index + 1}-${var.azs[count.index]}"
    "kubernetes.io/role/elb"                              = "1"
    "kubernetes.io/cluster/${local.eks_cluster_name_tag}" = "owned"
  })
}

resource "aws_subnet" "private_app" {
  count = length(var.azs)

  cidr_block        = var.private_app_subnet_cidrs[count.index]
  availability_zone = var.azs[count.index]
  vpc_id            = aws_vpc.main.id

  tags = merge(local.common_tags, {
    Name                                                  = "${var.project_name}-${var.environment}-private-app-${count.index + 1}-${var.azs[count.index]}"
    "kubernetes.io/role/internal-elb"                     = "1"
    "kubernetes.io/cluster/${local.eks_cluster_name_tag}" = "owned"
  })
}

resource "aws_subnet" "private_db" {
  count = length(var.azs)

  cidr_block        = var.private_db_subnet_cidrs[count.index]
  availability_zone = var.azs[count.index]
  vpc_id            = aws_vpc.main.id

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-private-db-${count.index + 1}-${var.azs[count.index]}"
  })
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-route-public"
  })
}

resource "aws_route_table" "private_app" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-route-private-app"
  })
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public[0].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public[1].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private_app_a" {
  subnet_id      = aws_subnet.private_app[0].id
  route_table_id = aws_route_table.private_app.id
}

resource "aws_route_table_association" "private_app_b" {
  subnet_id      = aws_subnet.private_app[1].id
  route_table_id = aws_route_table.private_app.id
}
