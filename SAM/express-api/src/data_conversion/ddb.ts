import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

export const documentClient = DynamoDBDocument.from(new DynamoDBClient());

export const batchInsert = async (items) => {
  const chunks = [];
  const chunkSize = 25;
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    const params = {
      RequestItems: {
        ksri_admin_master_table: chunk.map((item) => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    };
    try {
      await documentClient.batchWrite(params);
    } catch (error) {
      console.log(error);
    }
  }
};

export const insertIntoDynamoDB = async (item: any) => {
  const params = {
    TableName: "ksri_admin_master_table",
    Item: item,
  };
  try {
    await documentClient.put(params);
  } catch (error) {
    console.log(error);
  }
};
