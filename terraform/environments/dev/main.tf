module "network" {
  source = "../../modules/network"

  vpc_cidr                 = "10.0.0.0/16"
  azs                      = ["ap-northeast-1a", "ap-northeast-1c"]
  public_subnet_cidrs      = ["10.0.1.0/24", "10.0.2.0/24"]
  private_app_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24"]
  private_db_subnet_cidrs  = ["10.0.20.0/24", "10.0.21.0/24"]
  project_name             = var.project_name
  environment              = var.environment
  eks_cluster_name         = "${var.project_name}-${var.environment}"
}

module "security" {
  source = "../../modules/security"

  project_name               = var.project_name
  environment                = var.environment
  vpc_id                     = module.network.vpc_id
  eks_node_security_group_id = ""
}

module "gitlab" {
  source = "../../modules/gitlab"

  project_name      = var.project_name
  environment       = var.environment
  instance_type     = var.gitlab_instance_type
  ami_id            = var.gitlab_ami_id
  vpc_id            = module.network.vpc_id
  subnet_id         = module.network.public_subnet_ids[0]
  security_group_id = module.security.gitlab_security_group_id
  gitlab_hostname   = var.gitlab_hostname
}

module "rds" {
  source = "../../modules/rds"

  project_name      = var.project_name
  environment       = var.environment
  db_name           = var.db_name
  db_username       = var.db_username
  db_password       = var.db_password
  instance_class    = var.db_instance
  allocated_storage = var.db_storage
  vpc_id            = module.network.vpc_id
  subnet_ids        = module.network.private_db_subnet_ids
  security_group_id = module.security.rds_security_group_id
  multi_az          = var.db_multiaz
}

module "eks" {
  source = "../../modules/eks"

  project_name               = var.project_name
  environment                = var.environment
  private_app_subnet_ids     = module.network.private_app_subnet_ids
  eks_node_security_group_id = module.security.eks_node_security_group_id
  gitlab_security_group_id   = module.security.gitlab_security_group_id
  gitlab_runner_role_arn     = module.gitlab.iam_role_arn
  kubernetes_version         = var.kubernetes_version
  node_instance_type         = var.node_instance_type
  node_min_size              = 2
  node_desired_size          = 2
  node_max_size              = 4
}

resource "aws_iam_role_policy" "gitlab_eks_describe" {
  name = "gitlab-eks-describe"
  role = module.gitlab.iam_role_name

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "eks:DescribeCluster"
        ]

        Resource = module.eks.cluster_arn
      }
    ]
  })
}
