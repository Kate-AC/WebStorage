require 'json'
require 's3'
require "authorizer"

def handler(event:, context:)
  authorizer = Authorizer.new(event["headers"])
  sessionId = authorizer.getSessionId

  if !authorizer.auth(sessionId)
    return { statusCode: 400 }
  end

  body = JSON.parse(event["body"])
  fileKey = body["fileKey"]

  s3 = S3.new
  p fileKey
  unless s3.existByKey?(fileKey)
    return
  end

  file = s3.getByKey(fileKey)
  body = file.body.read

  return {
    statusCode: 200,
    headers: {
      "Content-Type" => "application/octet-stream",
      "Content-Disposition" => "attachment;",
    },
    body: body
  }
end

