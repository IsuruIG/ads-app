import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const ddb = new DynamoDBClient({
  endpoint: process.env.DDB_ENDPOINT,
});
export const sns = new SNSClient({
  endpoint: process.env.SNS_ENDPOINT,
});
export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
});

export const uploadImage = async (
  bucket: string,
  key: string,
  base64: string
) => {
  const buffer = Buffer.from(base64, "base64");

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    })
  );

  return `s3://${bucket}/${key}`;
};
