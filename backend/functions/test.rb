require "json"
require "aws-sdk"
require "authorizer"
require "env"
require "users_db"

def handler(event:, context:)
  if "OPTIONS" == event["httpMethod"]
    return {
      statusCode: 200,
      body: "",
      headers: {
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Origin": env[:front_url],
        "Access-Control-Allow-Credentials": true
      }
    }
  end

  {
    statusCode: 200,
    body: "",
    headers: {
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Access-Control-Allow-Origin": env[:front_url],
      "Access-Control-Allow-Credentials": true
    }
  }
end
