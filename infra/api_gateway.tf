resource "aws_api_gateway_rest_api" "current" {
  name        = "WebStorageApiGateway"
  description = "This is used as backend for WebStorage."
}

resource "aws_api_gateway_deployment" "this" {
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
  deployment_id = aws_api_gateway_deployment.this.id
  rest_api_id   = aws_api_gateway_rest_api.current.id
  stage_name    = "test"
}

