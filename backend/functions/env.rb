def env
  {
    session_name: ENV["SESSION_NAME"],
    region: ENV["REGION"],
    s3_access_key: ENV["S3_ACCESS_KEY"],
    s3_secret_key: ENV["S3_SECRET_KEY"],
    s3_endpoint: ENV["S3_ENDPOINT"],
    s3_bucket_name: ENV["S3_BUCKET_NAME"],
    dynamodb_access_key_id: ENV["DYNAMODB_ACCESS_KEY_ID"],
    dynamodb_secret_access_key: ENV["DYNAMODB_SECRET_ACCESS_KEY"],
    dynamodb_endpoint: ENV["DYNAMODB_ENDPOINT"],
    login_to_redirect_url: ENV["LOGIN_TO_REDIRECT_URL"],
    backend_url: ENV["BACKEND_URL"],
    front_url: ENV["FRONT_URL"],
    s3_url: ENV["S3_URL"]
  }
end

