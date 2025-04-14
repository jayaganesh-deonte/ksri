import { writeFileSync } from "fs";

import { DynamoDBClient, ScanInput } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

export const documentClient = DynamoDBDocument.from(new DynamoDBClient());

const TABLE_NAME = "ksri_admin_master_table";

const TARGET_TABLE_NAME = "ksri_admin_master_table";

const exportTable = async () => {
  // scan dynamodb table and export to json file
  let params: ScanInput = {
    TableName: TABLE_NAME,
  };
  const scanResults: any = [];
  let items;

  do {
    items = await documentClient.scan(params);
    if (items.Items) {
      items.Items.forEach((item) => scanResults.push(item));
      params.ExclusiveStartKey = items.LastEvaluatedKey;
    }
  } while (typeof items.LastEvaluatedKey !== "undefined");

  const jsonData = JSON.stringify(scanResults, null, 2);
  writeFileSync("./tables.json", jsonData);
};

const importTableFromJSON = async (tableName: string, jsonFileName: string) => {
  const jsonData = require(`./${jsonFileName}`);

  // split jsonData into chunks of 25
  const chunks = [];
  const chunkSize = 25;

  for (let i = 0; i < jsonData.length; i += chunkSize) {
    chunks.push(jsonData.slice(i, i + chunkSize));
  }

  // insert each chunk into dynamodb table
  for (let i = 0; i < chunks.length; i++) {
    const params = {
      RequestItems: {
        [tableName]: chunks[i].map((item: any) => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    };

    await documentClient.batchWrite(params);
  }
};

const main = async () => {
  // await exportTable();
  await importTableFromJSON(TARGET_TABLE_NAME, "tables.json");
};

main();
