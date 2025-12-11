# Assignment - Ads API (Serverless, TypeScript, SAM)

A minimal Ads API that stores ads in DynamoDB, uploads optional images to S3, 
and publishes an SNS notification upon creation.
<!-- 
## Features
- Node.js + TypeScript Lambda
- POST /ads endpoint (protected)
- Cognito auth (mockable locally)
- DynamoDB storage
- S3 image upload
- SNS publish
- Structured logging
- Jest unit tests
- GitHub Actions CI
- IaC using AWS SAM -->

## Local Development

### 1. Install dependencies
npm install

### 2. Build
npm run build

### 3. Start API locally
sam local start-api

### 4. Invoke
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
