variable "env" {
  default     = "production"
  description = "Environment name."
}

provider "aws" {
  region = "ap-northeast-1"
}

