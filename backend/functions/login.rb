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

  expiredTime = (Time.now + 3600 * 24 * 7).to_i
p env[:login_to_redirect_url].gsub(/https?:\/\/(.+)\//, "\\1")

  if env[:front_url].match("localhost").nil?
    return {
      statusCode: 302,
      isBase64Encoded: false,
      body: "login",
      headers: {
        "Set-Cookie" => "#{sessionName}=#{sessionId};Path=\/;Expires=#{expiredTime};Domain=#{env[:front_url].gsub(/https?:\/\/(.+)\//, "\\1")};",
        "Location" => env[:login_to_redirect_url]
      }
    }
  end

  {
    statusCode: 302,
    isBase64Encoded: false,
    body: "login",
    headers: {
      "Set-Cookie" => "#{sessionName}=#{sessionId};Path=\/;Expires=#{expiredTime};",
      "Location" => env[:login_to_redirect_url]
    }
  }
end
