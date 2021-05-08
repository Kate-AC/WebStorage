#!/bin/bash

funcs=("authorization" "show_files" "operate_files" "upload_file" "download_file" "login" "oauth_google_callback" "authorization")

for func in ${funcs[@]}; do
  aws lambda update-function-configuration --function-name $func --environment Variables={\
BACKEND_URL="https://api.experiment-lab.link"\,\
DYNAMODB_ACCESS_KEY_ID=""\,\
DYNAMODB_ENDPOINT=""\,\
DYNAMODB_SECRET_ACCESS_KEY=""\,\
LOGIN_TO_REDIRECT_URL="https://experiment-lab.link/"\,\
REGION="northeast-1"\,\
S3_ACCESS_KEY=""\,\
S3_BUCKET_NAME="public-production-filestorage"\,\
S3_ENDPOINT=""\,\
S3_SECRET_KEY=""\,\
S3_URL=""\,\
SESSION_NAME="production-webstorage-session"\
}
done
