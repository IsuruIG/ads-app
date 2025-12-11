import { createAd } from "../src/handlers/post-ad";

jest.mock("../src/aws", () => ({
  ddb: { send: jest.fn().mockResolvedValue({}) },
  sns: { send: jest.fn().mockResolvedValue({}) },
  uploadImage: jest.fn().mockResolvedValue("s3://bucket/key.jpg"),
}));

describe("test createAd", () => {
  it("creates an ad successfully", async () => {
    const event = {
      body: JSON.stringify({ title: "Test", price: 100 }),
      requestContext: { requestId: "abc" },
    };

    const result = await createAd(event);

    expect(result?.statusCode).toBe(201);
    const body = JSON.parse(result?.body!);
    expect(body.title).toBe("Test");
  });
});
