require "aws-sdk-s3"
require "env"
require "files_db"

class S3
  def getCredentials
    Aws::Credentials.new(
      env[:s3_access_key],
      env[:s3_secret_key]
    )
  end

  def getClient
    if env[:s3_endpoint].nil?
      return Aws::S3::Client.new
    end

    Aws::S3::Client.new(
      credentials: getCredentials,
      region: env[:region],
      endpoint: env[:s3_endpoint],
      force_path_style: true
    )
  end

  def getResource
    if env[:s3_endpoint].nil?
      return Aws::S3::Resource.new.bucket(env[:s3_bucket_name])
    end

    Aws::S3::Resource.new(
      credentials: getCredentials,
      region: env[:region],
      endpoint: env[:s3_endpoint],
      force_path_style: true
    ).bucket(env[:s3_bucket_name])
  end

  def getObjectByKey(key)
    Aws::S3::Object.new(
      key: key,
      bucket_name: env[:s3_bucket_name],
      client: getClient
    )
  end

  def existByKey?(key)
    getResource.object(key).exists?
  end

  def getByKey(key)
    getClient.get_object(
      bucket: env[:s3_bucket_name],
      key: key
    )
  end

  def deleteByKey(key)
    getClient.delete_object(
      bucket: env[:s3_bucket_name],
      key: key
    )
  end

  def getUrlByKey(key)
    presigner = Aws::S3::Presigner.new({
      client: getClient
    })

    if env[:s3_endpoint].nil?
      return presigner.presigned_url(
        :get_object,
        bucket: env[:s3_bucket_name],
        key: key,
        expires_in: 300
      )
    end

    presigner.presigned_url(
      :get_object,
      bucket: env[:s3_bucket_name],
      key: key,
      expires_in: 300
    ).gsub!(env[:s3_endpoint], env[:s3_url])
  end

  def getPresignedUrl(params)
    getObjectByKey(params[:fileKey]).presigned_url(
      :get,
      expires_in: 3600,
      response_content_disposition: "attachment; filename=#{params[:fileName]}"
    )
  end

  def putByKey(key, data)
    getClient.put_object(
      bucket: env[:s3_bucket_name],
      key: key,
      body: data
    )
  end
end
