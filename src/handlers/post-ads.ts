import crypto from "crypto";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { putAd } from "../services/DynamoDBService";
import { uploadImage } from "../services/S3Service";
import { publishAdCreated } from "../services/SNSService";
import { logger } from "../utils/logger";

export const postAdsHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const requestId = event.requestContext.requestId;
  logger.info({ requestId, message: "Received request", body: event.body });

  try {
    if (!event.body) {
      return { statusCode: 400, body: "Missing body" };
    }

    const { title, price, imageBase64 } = JSON.parse(event.body);

    if (!title || typeof price !== "number") {
      return { statusCode: 400, body: "Invalid input" };
    }

    const id = crypto.randomUUID();
    let imageUrl: string | undefined = undefined;

    // * Optional Image Upload
    if (imageBase64) {
      logger.info({ requestId, message: "Uploading image…" });
      imageUrl = await uploadImage(id, imageBase64);
    }

    logger.info({ requestId, message: "Writing item to DynamoDB" });
    await putAd({ id, title, price, imageUrl });

    logger.info({ requestId, message: "Publishing SNS message" });
    await publishAdCreated({ id, title, price, imageUrl });

    return {
      statusCode: 201,
      body: JSON.stringify({ id, title, price, imageUrl }),
    };
  } catch (err: any) {
    logger.error({ requestId, message: "Error processing request", err });
    return { statusCode: 500, body: "Internal server error" };
  }
};
