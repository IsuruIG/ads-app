// // Create clients and set shared const values outside of the handler.

// // Create a DocumentClient that represents the query to add an item
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
// import { logger } from "../utils/logger";

// const client = new DynamoDBClient({});
// const ddbDocClient = DynamoDBDocumentClient.from(client);

// // Get the DynamoDB table name from environment variables
// const tableName = process.env.SAMPLE_TABLE;

// /**
//  * A simple example includes a HTTP post method to add one item to a DynamoDB table.
//  */
// export const postAdsHandler = async (event) => {
//   const requestId = event.requestContext.requestId;

//   logger.info(event);
//   logger.info({ requestId, message: "Received request", body: event.body });

//   if (event.httpMethod !== "POST") {
//     throw new Error(
//       `postMethod only accepts POST method, you tried: ${event.httpMethod} method.`
//     );
//   }

//   const { title, price, imageBase64 } = JSON.parse(event.body);

//   const id = crypto.randomUUID();
//   let imageUrl: string | undefined = undefined;

//   const params = {
//     TableName: tableName,
//     Item: { id: id, title },
//   };

//   try {
//     logger.info({ requestId, message: "Writing item to DynamoDB..." });
//     await putAd({ id, title, price, imageUrl });
//     logger.info({
//       requestId,
//       message: "Successfully added item to DynamoDB.",
//       data,
//     });

//     // * Optional Image Upload
//     // if (imageBase64) {
//     //   logger.info({ requestId, message: "Uploading image…" });
//     //   imageUrl = await uploadImage(id, imageBase64);
//     // }

//     logger.info({ requestId, message: "Publishing SNS message" });
//     // * Add code to publish SNS
//   } catch (err) {
//     logger.error({ requestId, message: "Error processing request", err });
//   }

//   const response = {
//     statusCode: 200,
//     body: JSON.stringify(body),
//   };

//   // All log statements are written to CloudWatch
//   console.info(
//     `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
//   );
//   return response;
// };

import crypto from "crypto";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { putAd } from "../services/DynamoDBService";
import { uploadImage } from "../services/S3Service";
import { publishAdCreated } from "../services/SNSService";
import { logger } from "../utils/logger";

export const postAdsHandler = async (event: APIGatewayProxyEvent, _: any): Promise<APIGatewayProxyResult>  => {
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
