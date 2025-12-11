import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const putAd = async ({
  id,
  title,
  price,
  imageUrl,
}: {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
}) => {
  await client.send(
    new PutItemCommand({
      TableName: process.env.DDB_ADS_TABLE!,
      Item: {
        id: { S: id },
        title: { S: title },
        price: { N: price.toString() },
        imageUrl: imageUrl ? { S: imageUrl } : { NULL: true },
      },
    })
  );
};
