import { EmailService, EmailDataVariables } from "./services/sendEmail";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

export const documentClient = DynamoDBDocument.from(new DynamoDBClient());

export const handler = async (event: any) => {
  console.log("event", event);

  const emailService = await EmailService.init("ebookNotification");

  const payment = event.detail.payment;

  const BASE_URL = process.env.BASE_URL || "http://ksri.in/";

  const emailDataVariables: EmailDataVariables = {
    customerName: payment.name,
    bookName: payment.bookName,
    bookLink: BASE_URL + "ebooks/books/" + payment.bookId,
    receiptLink:
      BASE_URL +
      "public/receipt/ebook?emailId=" +
      payment.email +
      "&paymentRefId=" +
      payment.paymentRefId,
    // paymentRefId: payment.orderId,
  };

  const emailResponse = await emailService.sendEmail(
    payment.email,
    emailDataVariables
  );

  console.log("Email response:", emailResponse);

  const emailServiceToKSRI = await EmailService.init("ebookNotificationToKSRI");
  const emailResponseToKSRI = await emailServiceToKSRI.sendEmail(
    process.env.KSRI_EMAIL,
    emailDataVariables
  );

  console.log("Email response:", emailResponseToKSRI);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "hello world",
    }),
  };
};
