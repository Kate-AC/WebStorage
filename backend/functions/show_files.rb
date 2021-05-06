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

  files  = FilesDb.new.getAllByUserId(authorizer.getAuthorizedUser["GoogleId"])
  { statusCode: 200, body: files["items"] }
end

