import { createAd } from "../src/handlers/AdsHandler";
import * as ddb from "../src/services/DynamoDBService";
import * as s3 from "../src/services/S3Service";
import * as sns from "../src/services/SNSService";

jest.mock("../src/services/ddb");
jest.mock("../src/services/s3");
jest.mock("../src/services/sns");

describe("createAd", () => {
  it("creates an ad without image", async () => {
    const event: any = {
      body: JSON.stringify({ title: "Bike", price: 100 }),
      requestContext: { requestId: "test-1" },
    };

    const res = await createAd(event);

    expect(res.statusCode).toBe(201);
    expect(ddb.putAd).toHaveBeenCalled();
    expect(sns.publishAdCreated).toHaveBeenCalled();
  });
});
