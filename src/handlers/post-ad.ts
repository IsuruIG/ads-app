import { v4 as uuid } from "uuid";
import { APIGatewayProxyHandler } from "aws-lambda";
import { ddb, sns, uploadImage } from "../services/AWSServices";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PublishCommand } from "@aws-sdk/client-sns";
import { logger } from "../utils/logger";
import { CreateAdInput, AdRecord } from "../types";

const TABLE = process.env.ADS_TABLE!;
const BUCKET = process.env.IMAGE_BUCKET!;
const TOPIC_ARN = process.env.SNS_TOPIC_ARN!;

export const createAd: APIGatewayProxyHandler = async (event) => {
  const requestId = event.requestContext.requestId || uuid();
  const log = logger(requestId);

  try {
    log.info("Body", event.body);
    const body = JSON.parse(event.body || "{}") as CreateAdInput;

    if (!body.title || !body.price)
      return { statusCode: 400, body: "title and price required" };

    const id = uuid();

    let imageUrl: string | undefined = undefined;

    // * Optional image upload.
    if (body.imageBase64) {
      try {
        log.info("Uploading image...");
        const key = `${id}.jpg`;
        imageUrl = await uploadImage(BUCKET, key, body.imageBase64);
        log.info("Successfully uploaded image.");
      } catch (err) {
        log.error("Failed to upload image.", err);
      }
    }

    const record: AdRecord = {
      id,
      title: body.title,
      price: body.price,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    log.info("Ad to be created", record);

    const addToDbPromise = ddb.send(
      new PutItemCommand({
        TableName: TABLE,
        Item: {
          id: { S: record.id },
          title: { S: record.title },
          price: { N: record.price.toString() },
          imageUrl: { S: record.imageUrl ?? "" },
          createdAt: { S: record.createdAt },
        },
      })
    );

    const sendNotificationPromise = sns.send(
      new PublishCommand({
        TopicArn: TOPIC_ARN,
        Message: JSON.stringify(record),
      })
    );

    await Promise.all([addToDbPromise /* sendNotificationPromise */]);

    log.info("Successfully created an ad.");

    return {
      statusCode: 201,
      body: JSON.stringify(record),
    };
  } catch (err: any) {
    log.error("Failed to create ad", err);

    return {
      statusCode: 500,
      body: "Internal error",
    };
  }
};
