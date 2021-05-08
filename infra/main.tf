variable "env" {
  default     = "production"
  description = "Environment name."
}

variable "domain" {
  default = "experiment-lab.link"
}

provider "aws" {
  region = "ap-northeast-1"
}

