require "authorizer"
require "users_db"
require "env"

def handler(event:, context:)
  authorizer = Authorizer.new(event["headers"])
  sessionId = authorizer.getSessionId

  p env[:front_url]

  if authorizer.auth(sessionId)
    return { 
      statusCode: 200,
      body: "",
      headers: {
        "Access-Control-Allow-Origin": env[:front_url],
        "Access-Control-Allow-Credentials": true
      }
    }
  end

  { statusCode: 401 }
end

