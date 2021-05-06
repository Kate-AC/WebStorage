variable "controller" {}
variable "method" {}
variable "http_method" {}
variable "role" {}
variable "env" {}
variable "policy" {}
variable "log" {}
variable "rest_api_arn" {}
variable "rest_api_id" {}
variable "root_resource_id" {}
variable "dir" {
  default = ""
}

data "archive_file" "function_source" {
  type        = "zip"
  source_dir  = "../backend/functions"
  output_path = "./zip/${var.controller}.zip"
}

resource "aws_lambda_function" "current" {
  function_name = var.controller
  handler       = "${var.dir}${var.controller}.${var.method}"
  role          = var.role
  runtime       = "ruby2.7"
  memory_size   = 1024
  timeout       = 60
  reserved_concurrent_executions = 10

  filename         = data.archive_file.function_source.output_path
  source_code_hash = data.archive_file.function_source.output_base64sha256

  environment {
    variables = {
      ENV = var.env
    }
  }

  depends_on = [
    var.policy,
    var.log
  ]
}

resource "aws_lambda_permission" "current" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.current.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.rest_api_arn}/*/*/*"
}

resource "aws_api_gateway_resource" "current" {
  rest_api_id = var.rest_api_id
  parent_id   = var.root_resource_id
  path_part   = var.controller
}

resource "aws_api_gateway_method" "current" {
  rest_api_id   = var.rest_api_id
  resource_id   = aws_api_gateway_resource.current.id
  http_method   = var.http_method
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "current" {
  rest_api_id             = var.rest_api_id
  resource_id             = aws_api_gateway_resource.current.id
  http_method             = var.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.current.invoke_arn
}

#resource "aws_lambda_permission" "trigger" {
#  statement_id  = "AllowExecutionFromCloudwatch"
#  action        = "lambda:InvokeFunction"
#  function_name = aws_lambda_function.current.function_name
#  principal     = "events.amazonaws.com"
#  source_arn    = aws_cloudwatch_event_rule.current.arn
#}

#resource "aws_cloudwatch_event_rule" "current" {
#  name                = "${var.controller}_${var.method}_function_every_minutes"
#  description         = "Lambdaを起こしておく"
#  schedule_expression = "cron(*/1 * * * ? *)"
#}

#resource "aws_cloudwatch_event_target" "current" {
#  rule      = aws_cloudwatch_event_rule.current.name
#  target_id = "${var.controller}_${var.method}"
#  arn       = aws_lambda_function.current.arn
#}

output lambda_function_resource_id {
  value = aws_api_gateway_resource.current.id
}

output function_arn {
  value = aws_lambda_function.current.arn
}
