import { PaymentDDB } from "../models/payments/payment";
import { documentClient } from "../db_services/dynamodbClient";

export const handler = async (event: any) => {
  console.log("event", event);
  for (const record of event.Records) {
    const eventBridgeMessage = JSON.parse(record.body);
    // console.log("eventBridgeMessage", eventBridgeMessage);
    // console.log("detail", eventBridgeMessage.detail);
    const payment: PaymentDDB = eventBridgeMessage.detail.payment;

    const PK = payment.PK;
    const SK = payment.SK;

    // get item from ddb and check status in DDB
    const params = {
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        PK: PK,
        SK: SK,
      },
    };
    console.log("params", params);
    const result = await documentClient.get(params);
    const paymentDDB = result.Item as PaymentDDB;
    // console.log("paymentDDB", paymentDDB);

    // if payment status is still PENDING, then set it as TIMEOUT
    if (paymentDDB.orderId == "PENDING") {
      const updateParams = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
          PK: PK,
          SK: SK,
        },
        UpdateExpression:
          "SET orderId = :orderId, paymentStatus = :paymentStatus",
        ExpressionAttributeValues: {
          ":orderId": "TIMEOUT",
          ":paymentStatus": "TIMEOUT",
        },
        ReturnValues: "ALL_NEW" as const,
      };
      console.log("updateParams", updateParams);
      const updateResult = await documentClient.update(updateParams);
      console.log("updateResult", updateResult);
    }
  }
};
