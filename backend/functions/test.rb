require "json"
require "aws-sdk"
require "authorizer"
require "env"
require "users_db"

def handler(event:, context:)
  {
    statusCode: 302,
    body: "",
    headers: {
      Location: "https://google.co.jp"
    }
  }
end
