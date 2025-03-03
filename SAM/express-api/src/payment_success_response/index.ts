import { generateReceiptPDF } from "../services/donationReceipt";
import { uploadFileToDrive } from "../services/driveService";

import { Payment } from "../models/payments/payment";

import * as fs from "fs";

export const handler = async (event: any) => {
  console.log("event", event);
  // generate pdf receipt
  const payment: Payment = event.detail.payment;
  const pdfBuffer = await generateReceiptPDF(payment);
  // save pdfBuffer as pdf to local tmp
  fs.writeFileSync(`/tmp/receipt-${payment.orderId}.pdf`, pdfBuffer as Buffer);

  //upload to gdrive
  const result = await uploadFileToDrive({
    filePath: `/tmp/receipt-${payment.orderId}.pdf`,
    folderID: process.env.FOLDER_ID,
    ssmParameterName: "/google/drive",
    region: "ap-south-1",
  });
};
