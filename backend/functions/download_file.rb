require 'json'
require 's3'
require "authorizer"
require "env"

def handler(event:, context:)
  if "OPTIONS" == event["httpMethod"]
    return {
      statusCode: 200,
      body: "",
      headers: {
        "Access-Control-Allow-Origin": env[:login_to_redirect_url],
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
  unless s3.existByKey?(fileKey)
    return
  end

  user = authorizer.getAuthorizedUser

  file = FilesDb.new.getByUserIdAndFileKey(user["GoogleId"], fileKey)
  attributes = JSON.parse(file["Attributes"])

  presignedUrl = S3.new.getPresignedUrl({
    fileKey: file["FileKey"],
    fileName: attributes["FileName"]
  })

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment;",
      "Access-Control-Allow-Origin": env[:login_to_redirect_url],
      "Access-Control-Allow-Credentials": true
    },
    body: presignedUrl
  }
end

