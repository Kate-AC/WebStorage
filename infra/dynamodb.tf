resource "aws_dynamodb_table" "users" {
  name             = "Users"
  read_capacity    = 1
  write_capacity   = 1
  hash_key         = "GoogleId"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "GoogleId"
    type = "S"
  }

  attribute {
    name = "Email"
    type = "S"
  }

  attribute {
    name = "SessionId"
    type = "S"
  }

  attribute {
    name = "Capacity"
    type = "S"
  }

  global_secondary_index {
    name            = "IndexSessionId"
    hash_key        = "SessionId"
    write_capacity  = 10
    read_capacity   = 10
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "EmailAndCapacity"
    hash_key        = "Email"
    range_key       = "Capacity"
    write_capacity  = 10
    read_capacity   = 10
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "files" {
  name             = "Files"
  read_capacity    = 1
  write_capacity   = 1
  hash_key         = "FileKey"
  range_key        = "UserId"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "FileKey"
    type = "S"
  }

  attribute {
    name = "UserId"
    type = "S"
  }

  attribute {
    name = "Attributes"
    type = "S"
  }

  global_secondary_index {
    name            = "AttributesAndUserId"
    hash_key        = "Attributes"
    range_key       = "UserId"
    write_capacity  = 10
    read_capacity   = 10
    projection_type = "ALL"
  }
}

