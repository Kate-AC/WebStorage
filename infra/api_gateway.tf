resource "aws_api_gateway_rest_api" "current" {
  name        = "WebStorageApiGateway"
  description = "This is used as backend for WebStorage."
}

resource "aws_api_gateway_deployment" "hoge" {
  rest_api_id = aws_api_gateway_rest_api.current.id
  stage_name = var.env
  stage_description = "timestamp = ${timestamp()}"

  depends_on = [
    aws_api_gateway_rest_api.current
  ]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "current" {
  deployment_id = aws_api_gateway_deployment.hoge.id
  rest_api_id   = aws_api_gateway_rest_api.current.id
  stage_name    = "test"
}

resource "aws_api_gateway_domain_name" "current" {
  domain_name              = "api.${var.domain}"
  regional_certificate_arn = aws_acm_certificate_validation.current.certificate_arn

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_base_path_mapping" "current" {
  depends_on  = [aws_api_gateway_deployment.hoge]
  api_id      = aws_api_gateway_rest_api.current.id
  stage_name  = aws_api_gateway_deployment.hoge.stage_name
  domain_name = aws_api_gateway_domain_name.current.domain_name
}

