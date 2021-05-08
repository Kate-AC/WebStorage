require 'json'
require 's3'
require "authorizer"

def handler(event:, context:)
  if "OPTIONS" == event["httpMethod"]
    return {
      statusCode: 200,
      body: "",
      headers: {
        "Access-Control-Allow-Origin": "https://experiment-lab.link",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Content-Type": "application/octet-stream",
        "Access-Control-Allow-Content-Disposition": "attachment;"
      }
    }
  end

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
      "Access-Control-Allow-Origin": "https://experiment-lab.link",
      "Access-Control-Allow-Credentials": true
    },
    body: body
  }
end

