#!/bin/bash

funcs=("authorization" "show_files" "operate_files" "upload_file" "download_file" "login" "oauth_google_callback")

path=`pwd`

rm -fR ${path}/zip/*

for func in ${funcs[@]}; do
  zip -j ${path}/zip/${func}.zip ${path}/../backend/functions/*
  sleep 1
  aws lambda update-function-code --function-name $func --zip-file fileb://${path}/zip/${func}.zip --publish
  sleep 1
  aws lambda update-function-configuration --function-name $func --environment Variables={\
BACKEND_URL="https://api.experiment-lab.link"\,\
LOGIN_TO_REDIRECT_URL="https://experiment-lab.link/"\,\
REGION="northeast-1"\,\
S3_BUCKET_NAME="public-production-filestorage"\,\
SESSION_NAME="production-webstorage-session"\
}
done
