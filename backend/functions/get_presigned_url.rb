require "json"
require "s3"
require "authorizer"
require "env"
require "files_db"

def handler(event:, context:)
  if "OPTIONS" == event["httpMethod"]
    return {
      statusCode: 200,
      body: "",
      headers: {
        "Access-Control-Allow-Origin": env[:login_to_redirect_url],
        "Access-Control-Allow-Credentials": true
      }
    }
  end

  authorizer = Authorizer.new(event["headers"])
  sessionId = authorizer.getSessionId

  if !authorizer.auth(sessionId)
    return { statusCode: 400 }
  end

  user = authorizer.getAuthorizedUser

  body = JSON.parse(event["body"])
  fileKey = body["fileKey"]

  file = FilesDb.new.getByUserIdAndFileKey(user["GoogleId"], fileKey)
  attributes = JSON.parse(file["Attributes"])

  presignedUrl = S3.new.getPresignedUrl({
    fileKey: file["FileKey"],
    fileName: attributes["FileName"]
  })

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": env[:login_to_redirect_url],
      "Access-Control-Allow-Credentials": true
    },
    body: presignedUrl
  }
end

