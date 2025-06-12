import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { getS3ObjectCountAndTotalSize } from "./s3_summary";

const documentClient = DynamoDBDocument.from(new DynamoDBClient());

const DDB_TABLE_NAME = process.env.DDB_TABLE_NAME;

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

let dashboardData = [];

const query = async (entityType: any, filter: any) => {
  let params: any = {
    TableName: DDB_TABLE_NAME,
    //IndexName: "entityTypePK", // fd
    KeyConditionExpression: "PK = :entityTypePK",
    ExpressionAttributeValues: {
      ":entityTypePK": entityType,
    },
    Select: "COUNT",
  };

  if (filter) {
    // loop through the filter and add them to the params
    for (const element of filter) {
      params.FilterExpression = `#${element.key} = :${element.key}`;
      params.ExpressionAttributeNames = {
        [`#${element.key}`]: element.key,
      };
      params.ExpressionAttributeValues[`:${element.key}`] = element.value;
    }
  }

  let totalCount = 0;
  let lastEvaluatedKey = undefined;

  do {
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const data = await documentClient.query(params);
    totalCount += data.Count || 0;
    lastEvaluatedKey = data.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return totalCount;
};

const getEbookSoldCount = async () => {
  // PK and SK = ENTITYTYPE#PAYMENT#PURCHASE#EBOOK#CURRENT_ORDER_ID
  const params = {
    TableName: DDB_TABLE_NAME,
    KeyConditionExpression: "PK = :pk and SK = :sk",
    ExpressionAttributeValues: {
      ":pk": "ENTITYTYPE#PAYMENT#PURCHASE#EBOOK#CURRENT_ORDER_ID",
      ":sk": "ENTITYTYPE#PAYMENT#PURCHASE#EBOOK#CURRENT_ORDER_ID",
    },
  };

  const data = await documentClient.query(params);
  // returns one object with key orderId, return that
  const ebooksSoldCount =
    data.Items && data.Items.length > 0 ? data.Items[0].orderId : 0;

  return ebooksSoldCount;
};

const getDashboardStats = async () => {
  // query the database for the count of each entity type on GSI: entityTypePK

  for (const item of dashboardData) {
    const count = await query(item.entityType, item.filter);
    console.log(`Count for ${item.title}: ${count}`);
    if (count) {
      item.total = count;
    }
  }

  // get s3 stats
  const { objectCount, totalSizeBytes } = await getS3ObjectCountAndTotalSize(
    S3_BUCKET_NAME
  );

  // append s3 stats to the dashboardData
  dashboardData.push({
    title: "Total Media Files",
    total: objectCount,
    icon: "mdi-file",
    entityType: "",
    filter: [],
  });

  // convert bytes to GB and round to 2 decimal places
  const totalSizeGB =
    Math.round((totalSizeBytes / 1024 / 1024 / 1024) * 100) / 100;

  dashboardData.push({
    title: "Total Media Size (GB)",
    total: totalSizeGB,
    icon: "mdi-cloud-arrow-up",
    entityType: "",
    filter: [],
  });

  // get ebook sold count
  const ebookCount = await getEbookSoldCount();

  dashboardData.push({
    title: "Ebooks Sold",
    total: ebookCount,
    icon: "mdi-book-open-page-variant",
    entityType: "ENTITYTYPE#EBOOK",
  });

  // remove duplicate Ebooks Sold from dashboardData
  // if any two records have the same title, remove the one with the lower total
  dashboardData = dashboardData.filter(
    (item, index, self) =>
      index ===
      self.findIndex((t) => t.title === item.title && t.total >= item.total)
  );

  //   insert dashboardData into the ddb
  const params = {
    TableName: DDB_TABLE_NAME,
    Item: {
      PK: "ENTITYTYPE#DASHBOARD",
      SK: "ENTITYTYPE#DASHBOARD",
      entityType: "ENTITYTYPE#DASHBOARD",
      data: {
        dashboardData,
        updatedOn: new Date().toISOString(),
      },
    },
  };
  await documentClient.put(params);
};

// create lambda handler
export const handler = async () => {
  dashboardData = [
    {
      title: "Total Events",
      total: 0,
      icon: "mdi-calendar",
      entityType: "ENTITYTYPE#EVENT",
    },
    {
      // News
      title: "News",
      total: 0,
      icon: "mdi-newspaper",
      entityType: "ENTITYTYPE#NEWS",
    },
    {
      title: "Books Published",
      total: 0,
      icon: "mdi-book-open-page-variant",
      entityType: "ENTITYTYPE#BOOK",
    },
    // total ebooks
    {
      title: "Total Ebooks",
      total: 0,
      icon: "mdi-book-open-page-variant",
      entityType: "ENTITYTYPE#BOOK",
      filter: [
        {
          key: "isEbookAvailable",
          value: "Yes",
        },
      ],
    },
    {
      // Projects
      title: "On-Going Projects",
      total: 0,
      icon: "mdi-folder-open",
      entityType: "ENTITYTYPE#PROJECT",

      filter: [
        {
          key: "status",
          value: "On-Going",
        },
      ],
    },
    {
      title: "Completed Projects",
      total: 0,
      icon: "mdi-folder",
      entityType: "ENTITYTYPE#PROJECT",

      filter: [
        {
          key: "status",
          value: "Completed",
        },
      ],
    },
    // Research Articles
    {
      title: "Articles",
      total: 0,
      icon: "mdi-file-document",
      entityType: "ENTITYTYPE#RESEARCHARTICLE",
    },

    // phd students
    {
      title: "PhD Students",
      total: 0,
      icon: "mdi-account-school",
      entityType: "ENTITYTYPE#STUDENT",
      filter: [
        {
          key: "course",
          value: "Ph.D.",
        },
      ],
    },
    // Mphil Students
    {
      title: "MPhil Students",
      total: 0,
      icon: "mdi-account-school",
      entityType: "ENTITYTYPE#STUDENT",
      filter: [
        {
          key: "course",
          value: "M.Phil",
        },
      ],
    },

    // Users for the system
    {
      title: "System Users",
      total: 0,
      icon: "mdi-account",
      entityType: "ENTITYTYPE#USER",
    },
  ];
  await getDashboardStats();
};

handler();
