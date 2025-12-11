# Assignment - Ads API (Serverless, TypeScript, SAM)

A minimal Ads API that stores ads in DynamoDB, uploads optional images to S3, 
and publishes an SNS notification upon creation.

## Local Development

## Prerequisites

-  Must have Node 20+ installed locally.
-  Must have latest AWS SAM CLI [https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html] installed locally.

### 1. Install dependencies
npm install

### 2. Build
npm run build

### 3. Start API locally
sam local start-api

### 4. Run
curl -X POST http://127.0.0.1:3000/ads \
  -H "Authorization: fake" \
  -d '{"title":"Test","price":100}'

## Cognito (Mocked)
Locally, API Gateway authorizer is replaced with `AWS_IAM`, 
so any request works.  
For deployment, replace `Auth` config in template.yaml with a Cognito User Pool Authorizer.

## Deployment
sam build
sam deploy --guided
