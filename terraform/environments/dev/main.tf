module "network" {
  source = "../../modules/network"

  vpc_cidr                 = "10.0.0.0/16"
  azs                      = ["eu-west-2a", "eu-west-2c"]
  public_subnet_cidrs      = ["10.0.1.0/24", "10.0.2.0/24"]
  private_app_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24"]
  private_db_subnet_cidrs  = ["10.0.20.0/24", "10.0.21.0/24"]
  project_name             = var.project_name
  environment              = var.environment
  eks_cluster_name         = "${var.project_name}-${var.environment}"
}
