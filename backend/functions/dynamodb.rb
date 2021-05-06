require "aws-sdk"
require "env"

class Dynamodb
  def getCredentials
    return Aws::Credentials.new(
      env[:dynamodb_access_key_id],
      env[:dynamodb_secret_access_key]
    )
  end

  def getClient
    if env[:dynamodb_endpoint].length == 0
      return Aws::DynamoDB::Client.new
    end

    Aws::DynamoDB::Client.new(
      endpoint: env[:dynamodb_endpoint],
      region: env[:region],
      credentials: getCredentials,
      stub_responses: false
    )
  end
end

