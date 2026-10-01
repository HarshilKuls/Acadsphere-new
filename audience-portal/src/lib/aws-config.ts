import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { TextractClient } from "@aws-sdk/client-textract";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";

const credentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  ? {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      ...(process.env.AWS_SESSION_TOKEN ? { sessionToken: process.env.AWS_SESSION_TOKEN } : {}),
    }
  : undefined;

export const bedrockClient = new BedrockRuntimeClient({
  region,
  ...(credentials ? { credentials } : {}),
});

export const textractClient = new TextractClient({
  region,
  ...(credentials ? { credentials } : {}),
});

export const s3Client = new S3Client({
  region,
  ...(credentials ? { credentials } : {}),
});

export const dynamoClient = new DynamoDBClient({
  region,
  ...(credentials ? { credentials } : {}),
});

export const isAWSConfigured = (): boolean => {
  return Boolean(
    (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
    process.env.AWS_EXECUTION_ENV // True when running inside AWS Lambda / EC2 / ECS
  );
};
