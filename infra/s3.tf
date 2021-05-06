resource "aws_s3_bucket" "public" {
  bucket = "public-${var.env}-filestorage"
  acl    = "public-read"

  cors_rule {
    allowed_origins = ["*"]
    allowed_methods = ["GET", "POST", "PUT"]
    allowed_headers = ["*"]
    max_age_seconds = 300
  }

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  tags = {
    Name = var.env
  }
}

resource "aws_s3_bucket_policy" "public" {
  bucket = aws_s3_bucket.public.id
  policy = data.aws_iam_policy_document.public.json
}

data "aws_iam_policy_document" "public" {
  statement {
    effect    = "Allow"
    actions   = ["s3:GetObject", "s3:ListBucket"]
    resources = [
      "arn:aws:s3:::${aws_s3_bucket.public.id}",
      "arn:aws:s3:::${aws_s3_bucket.public.id}/*"
    ]

    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

