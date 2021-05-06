require "json"
require "authorizer"
require "env"
require "net/http"
require "uri"
require "users_db"
require "authorizer"

def handler(event:, context:)
  code = event["queryStringParameters"]["code"]

  response = Net::HTTP.post_form(
    URI.parse("https://accounts.google.com/o/oauth2/token"),
    {
      code:          code.gsub("%2F", "/"),
      client_id:     "66867006406-l402tptfk2jvk5epf7vh028pbr981smv.apps.googleusercontent.com",
      client_secret: "QgttnUDTiikugh7kXMe97Z0e",
      redirect_uri:  "#{env[:backend_url]}/oauth_google_callback",
      grant_type:    "authorization_code"
    }
  )

  results = JSON.parse(response.body)

  apiResponse = Net::HTTP.get(
    URI.parse("https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=#{results['id_token']}")
  )

  apiResults = JSON.parse(apiResponse)
  users = UsersDb.new
  user = users.getByGoogleId(apiResults["user_id"])

  sessionName, sessionId, expiredTime = Authorizer.createSession
  originalSessionId, _ = Authorizer.parseSessionId(sessionId)

  if user.nil?
    users.create({
      GoogleId: apiResults["user_id"],
      Email: apiResults["email"],
      SessionId: originalSessionId,
      Capacity: "102400000",
    })
  else
    users.update(apiResults["user_id"], {
      SessionId: originalSessionId
    })
  end

  {
    statusCode: 302,
    body: "login",
    headers: {
      "Location" => "#{env[:backend_url]}/login?session_id=#{sessionId}",
      "Set-Cookie" => "#{sessionName}=#{sessionId};Path=\/;Expires=#{expiredTime};"
    }
  }
end
