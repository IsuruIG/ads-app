import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({});

export const publishAdCreated = async (ad: any) => {
  await sns.send(
    new PublishCommand({
      TopicArn: process.env.TOPIC_ARN!,
      Message: JSON.stringify(ad),
    })
  );
};
