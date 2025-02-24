# SAM Commands

sam init

sam deploy --config-env dev

sam build
cp -r express-api/fonts .aws-sam/build/expressAPI/
cd .aws-sam/build/expressAPI/
npm init -y
npm i pdfmake
cd ../../..

sam deploy --config-env prod
