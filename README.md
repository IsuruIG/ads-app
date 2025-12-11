# Assignment - Ads API (Serverless, TypeScript, SAM)

A minimal Ads API that stores ads in DynamoDB, uploads optional images to S3,
and publishes an SNS notification upon creation.

## Technologies used/utilized

- Node.js (TypeScript)
- AWS Serverless (SAM)
- Docker
- LocalStack [https://www.localstack.cloud]
- Jest

## Local Testing

## Prerequisites

- Must have Node 20+ installed locally.
- Must have latest version of Docker [https://www.docker.com/get-started/] installed locally.
- Must have latest version of AWS SAM CLI [https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html] installed locally.

### 1. Clone the project

Repository - https://github.com/IsuruIG/ads-app

### 2. Install dependencies

npm install

### 3. Start API locally

npm run sam:local

### 4. Run/Test

curl -X POST http://127.0.0.1:3000/ads \
 -H "Authorization: fake" \
 -d '{"title":"Test","price":100}'

# BELOW STEPS ARE CURRENTLY NOT SUPPORTED.

## Cognito (Mocked)

Locally, API Gateway authorizer is replaced with `AWS_IAM`,
so any request works.  
For deployment, replace `Auth` config in template.yaml with a Cognito User Pool Authorizer.

## Deployment

sam build
sam deploy --guided
