module "show_files" {
  source           = "./api"
  controller       = "show_files"
  method           = "handler"
  http_method      = "POST"
  role             = aws_iam_role.iam_for_lambda.arn
  env              = var.env
  policy           = aws_iam_role_policy_attachment.lambda_logs
  log              = aws_cloudwatch_log_group.lambda_filestorage
  rest_api_arn     = aws_api_gateway_rest_api.current.execution_arn
  rest_api_id      = aws_api_gateway_rest_api.current.id
  root_resource_id = aws_api_gateway_rest_api.current.root_resource_id
}

