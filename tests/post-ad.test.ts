import { Context } from "aws-lambda";
import { createAd } from "../src/handlers/post-ad";

jest.mock("../src/services/AWSServices", () => ({
  ddb: { send: jest.fn().mockResolvedValue({}) },
  sns: { send: jest.fn().mockResolvedValue({}) },
  uploadImage: jest.fn().mockResolvedValue("s3://bucket/key.jpg"),
}));

const _ = {} as Context;
const cb = () => {};

describe("test createAd", () => {
  it("creates an ad successfully", async () => {
    const event: any = {
      body: JSON.stringify({ title: "Bike", price: 100 }),
      requestContext: { requestId: "test-1" },
    };

    const result = await createAd(event, _, cb);

    expect(result?.statusCode).toBe(201);
    const body = JSON.parse(result?.body!);
    expect(body.title).toBe("Bike");
  });
});
