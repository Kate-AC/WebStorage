require 'dynamodb'

class UsersDb
  def create(params)
    Dynamodb.new.getClient.put_item(
      table_name: "Users",
      item: params
    )
  end

  def getByGoogleId(googleId)
    Dynamodb.new.getClient.get_item(
      table_name: "Users",
      key: {
        GoogleId: googleId.to_s
      }
    ).item
  end

  def getBySessionId(sessionId)
    Dynamodb.new.getClient.query(
      table_name: "Users",
      index_name: "IndexSessionId",
      key_condition_expression: "SessionId = :s",
      expression_attribute_values: {
        ":s": sessionId
      }
    ).items[0]
  end

  def update(googleId, params)
    query = []
    placeholder = {}

    params.each do |key, value|
      query.push("#{key.to_s} = :#{key.to_s}")
      placeholder[":#{key.to_s}"] = value
    end

    p query
    p placeholder

    Dynamodb.new.getClient.update_item(
      table_name: "Users",
      key: {
        GoogleId: googleId.to_s
      },
      update_expression: "SET " +  query.join(","),
      expression_attribute_values: placeholder,
      return_values: 'UPDATED_NEW'
    )
  end
end

