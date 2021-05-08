require 'dynamodb'

class FilesDb
  def create(params)
    Dynamodb.new.getClient.put_item(
      table_name: "Files",
      item: {
        FileKey: params[:FileKey],
        UserId: params[:UserId].to_s,
        Attributes: params[:Attributes],
      }
    )
  end

  def getAllByUserId(userId)
    Dynamodb.new.getClient.scan(
      table_name: "Files",
      filter_expression: "UserId = :UserId",
      expression_attribute_values: {
        ":UserId": userId.to_s
      }
    )
  end

  def getByUserIdAndFileKey(userId, fileKey)
    result = Dynamodb.new.getClient.get_item(
      table_name: "Files",
      key: {
        UserId: userId.to_s,
        FileKey: fileKey
      }
    )
    result["item"]
  end

  def deleteByUserIdAndFileKey(userId, fileKey)
    Dynamodb.new.getClient.delete_item(
      table_name: "Files",
      key: {
        UserId: userId.to_s,
        FileKey: fileKey
      }
    )
  end
end

