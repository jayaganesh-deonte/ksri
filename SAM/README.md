# SAM Commands

sam init

sam deploy --config-env dev

sam build
cp -r express-api/fonts .aws-sam/build/expressAPI/
cd .aws-sam/build/expressAPI/
npm init -y
npm i pdfmake
cd ../../..

cp -r express-api/fonts .aws-sam/build/paymentSuccessHandler/
cd .aws-sam/build/paymentSuccessHandler
npm init -y
npm i pdfmake
cd ../../..

sam deploy --config-env dev

sam deploy --config-env prod
sam deploy --config-env dev
