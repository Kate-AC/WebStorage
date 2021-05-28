require "json"
require "aws-sdk"
require "authorizer"
require "env"
require "users_db"

def handler(event:, context:)
  sessionId = event["queryStringParameters"]["session_id"]

  if !Authorizer.new.auth(sessionId)
    return {
      statusCode: 400,
      isBase64Encoded: false
    }
  end

  sessionName = env[:session_name]
  _, expiredTime = Authorizer.parseSessionId(sessionId)

  {
    statusCode: 302,
    isBase64Encoded: false,
    body: "login",
    headers: {
      "Set-Cookie" => "#{sessionName}=#{sessionId};Path=\/;Expires=#{expiredTime};Domain=#{env[:backend_url].gsub(/https?:\/\/(.+)\//, "\\1")};",
      "Location" => env[:login_to_redirect_url]
    }
  }
end
