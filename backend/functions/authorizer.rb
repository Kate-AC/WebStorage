require 'base64'
require "cgi"
require "cgi/session"
require "env"
require "users_db"

class Authorizer
  def initialize(headers = {})
    @headers = headers
  end

  def auth(sessionId)
    return false if sessionId.nil?

    id, time = Authorizer.parseSessionId(sessionId)

    return false if time < Time.now.to_i

    @user = UsersDb.new.getBySessionId(id)

    return false if @user.nil?

    true
  rescue => e
    false
  end

  def getAuthorizedUser()
    @user
  end

  def self.createSession()
    baseId = CGI::Session.new(CGI.new, { new_session: true }).session_id
    expiredTime = (Time.now + 3600 * 24 * 7).to_i
    baseId = baseId + "=" + (expiredTime).to_s
    sessionId = Base64.encode64(baseId).gsub("==", "").gsub("\n", "")

    return env[:session_name], sessionId, expiredTime
  end

  def self.parseSessionId(sessionId)
    decoded = Base64.decode64(sessionId + "==")
    divided = decoded.split("=")

    return divided[0], divided[1].to_i
  end

  def getSessionId()
    session = getCookies.find { |cookie| cookie.include?(env[:session_name]) }

    return if session.nil?

    session.gsub("#{env[:session_name]}=", "")
  end

  def getCookies()
    return [] if @headers.nil?

    return [] unless @headers.has_key?("Cookie")

    @headers["Cookie"].split(";")
  end
end

