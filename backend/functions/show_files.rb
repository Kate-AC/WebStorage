require 'json'
require 'base64'
require 's3'
require "time"
require 'dynamodb'
require "files_db"
require "authorizer"
require "env"

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
    return {
      statusCode: 400,
      body: "",
      headers: {
        "Access-Control-Allow-Origin": env[:login_to_redirect_url],
        "Access-Control-Allow-Credentials": true
      }
    }
  end

  files  = FilesDb.new.getAllByUserId(authorizer.getAuthorizedUser["GoogleId"])

  {
    statusCode: 200,
    body: files["items"].to_json,
    headers: {
      "Access-Control-Allow-Origin": env[:login_to_redirect_url],
      "Access-Control-Allow-Credentials": true
    }
  }
end

