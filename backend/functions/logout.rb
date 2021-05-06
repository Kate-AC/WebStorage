require 'json'

def handler(event:, context:)
  { statusCode: '200', body: JSON.generate('logout') }
end
