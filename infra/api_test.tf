module "test" {
  source           = "./api"
  controller       = "test"
  method           = "handler"
  http_method      = "GET"
  role             = aws_iam_role.iam_for_lambda.arn
  env              = var.env
  policy           = aws_iam_role_policy_attachment.lambda_logs
  log              = aws_cloudwatch_log_group.lambda_filestorage
  rest_api_arn     = aws_api_gateway_rest_api.current.execution_arn
  rest_api_id      = aws_api_gateway_rest_api.current.id
  root_resource_id = aws_api_gateway_rest_api.current.root_resource_id
}

#resource "aws_api_gateway_method_response" "test" {
#  rest_api_id = aws_api_gateway_rest_api.current.id
#  resource_id = module.oauth_google_callback.lambda_function_resource_id
#  http_method = "GET"
#  status_code = 302

#  response_parameters = {
#    "method.response.header.Location" = true
#  }
#}

