#!/bin/bash

funcs=("login" "oauth_google_callback" "authorization")

for func in ${funcs[@]}; do
  aws lambda update-function-configuration --function-name $func --environment Variables={\
BACKEND_URL="https://u2q24vtiua.execute-api.ap-northeast-1.amazonaws.com/test"\,\
DYNAMODB_ACCESS_KEY_ID=""\,\
DYNAMODB_ENDPOINT=""\,\
DYNAMODB_SECRET_ACCESS_KEY=""\,\
LOGIN_TO_REDIRECT_URL="https://public-production-filestorage.s3.ap-northeast-1.amazonaws.com/"\,\
REGION="northeast-1"\,\
S3_ACCESS_KEY="1"\,\
S3_BUCKET_NAME="2"\,\
S3_ENDPOINT="3"\,\
S3_SECRET_KEY="4"\,\
S3_URL="5"\,\
SESSION_NAME="production-webstorage-session"\
}
done
