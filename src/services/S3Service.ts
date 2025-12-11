import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({});

export const uploadImage = async (
  id: string,
  base64: string
): Promise<string> => {
  const bucket = process.env.S3_IMAGES_BUCKET!;
  const buffer = Buffer.from(base64, "base64");

  const key = `ads/${id}.jpg`;

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
