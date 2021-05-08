require "authorizer"
require "users_db"

def handler(event:, context:)
  authorizer = Authorizer.new(event["headers"])
  sessionId = authorizer.getSessionId

  if authorizer.auth(sessionId)
    return { 
      statusCode: 200,
      body: "",
      headers: {
        "Access-Control-Allow-Origin": "https://experiment-lab.link",
        "Access-Control-Allow-Credentials": true
      }
    }
  end

  { statusCode: 401 }
end

