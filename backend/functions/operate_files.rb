require 'json'
require 's3'
require "files_db"
require "authorizer"
require "env"

def handler(event:, context:)
  if "OPTIONS" == event["httpMethod"]
    return {
      statusCode: 200,
      body: "",
      headers: {
        "Access-Control-Allow-Origin": env[:front_url],
        "Access-Control-Allow-Credentials": true
      }
    }
  end
  authorizer = Authorizer.new(event["headers"])
  sessionId = authorizer.getSessionId

  if !authorizer.auth(sessionId)
    return { statusCode: 400 }
  end

  body = JSON.parse(event["body"])
  order = body["order"]
  fileKeys = body["fileKeys"]
  googleId = authorizer.getAuthorizedUser["GoogleId"]

  fileKeys.each do |fileKey|
    FilesDb.new.deleteByUserIdAndFileKey(googleId, fileKey)
    s3 = S3.new

    if s3.existByKey?(fileKey)
      s3.deleteByKey(fileKey)
    end
  end
  results = { fileKeys: fileKeys }

  {
    statusCode: 200,
    body: results.to_json,
    headers: {
      "Access-Control-Allow-Origin": env[:front_url],
      "Access-Control-Allow-Credentials": true
    }
  }
end

