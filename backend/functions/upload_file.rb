require 'json'
require 'base64'
require 's3'
require "time"
require 'dynamodb'
require "files_db"
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

  if s3.existByKey?(fileKey)
    file = s3.getByKey(fileKey)
    data = file.body.read
    data.concat body["contents"]
  else
    data = body["contents"]
  end

  s3.putByKey(fileKey, data)

  uploadedFile = {}
  if body["terminus"]
    googleId = authorizer.getAuthorizedUser["GoogleId"]

    FilesDb.new.create({
      FileKey: body["fileKey"],
      UserId: googleId,
      Attributes: {
        FileName: body["fileName"],
        Extension: body["extension"],
        CreatedAt: Time.now
      }.to_json
    })

    uploadedFile = FilesDb.new.getByUserIdAndFileKey(googleId, body["fileKey"])
    p uploadedFile
  end

  { statusCode: 200, body: uploadedFile }
end

