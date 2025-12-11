import { APIGatewayProxyEvent } from "aws-lambda";
import { postAdsHandler } from "../../../src/handlers/post-ads";
import * as ddb from "../../../src/services/DynamoDBService";
import * as s3 from "../../../src/services/S3Service";
import * as sns from "../../../src/services/SNSService";

jest.mock("../../../src/services/DynamoDBService");
jest.mock("../../../src/services/S3Service");
jest.mock("../../../src/services/SNSService");

// * This includes all tests for postAdsHandler().
describe("Test postAdsHandler", () => {
  it("creates an ad without image", async () => {
    const event = {
      body: JSON.stringify({ title: "Bike", price: 100 }),
      requestContext: { requestId: "test-1" },
    } as APIGatewayProxyEvent;

    const res = await postAdsHandler(event);

    expect(res?.statusCode).toBe(201);
    expect(ddb.putAd).toHaveBeenCalled();
    expect(sns.publishAdCreated).toHaveBeenCalled();
  });
});
