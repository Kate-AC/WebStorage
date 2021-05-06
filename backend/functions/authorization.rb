require "authorizer"
require "users_db"

def handler(event:, context:)
  authorizer = Authorizer.new(event["headers"])
  sessionId = authorizer.getSessionId

  if authorizer.auth(sessionId)
    return { statusCode: 200 }
  end

  { statusCode: 401 }
end

