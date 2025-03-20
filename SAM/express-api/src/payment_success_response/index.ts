import { generateReceiptPDF } from "../services/donationReceipt";
import {
  uploadFileToDrive,
  listFilesInFolder,
  createFolder,
  getCurrentFinancialYear,
} from "../services/driveService";

import { Payment } from "../models/payments/payment";

import * as fs from "fs";

export const handler = async (event: any) => {
  console.log("event", event);
  // generate pdf receipt
  const payment: Payment = event.detail.payment;
  const pdfBuffer = await generateReceiptPDF(payment);
  // save pdfBuffer as pdf to local tmp
  fs.writeFileSync(`/tmp/receipt-${payment.orderId}.pdf`, pdfBuffer as Buffer);

  // get folder name
  const currentFRYear = getCurrentFinancialYear();

  const folderName = `FY-${currentFRYear}`;

  const parentFolderID = process.env.FOLDER_ID;

  if (!parentFolderID) {
    throw new Error("FOLDER_ID not set");
  }

  const listResult = await listFilesInFolder({
    folderID: parentFolderID,
    ssmParameterName: "/google/drive",
    region: "ap-south-1",
  });
  let targetFolderId: string;

  if (listResult.success) {
    const folders = listResult.files?.filter((f) => f.isFolder) || [];

    // check if folderName is present in folders
    const folder = folders.find((f) => f.name === folderName);
    if (folder) {
      // console.log(`Folder ${folderName} found. ID: ${folder.id}`);
      targetFolderId = folder.id;
    } else {
      console.log(`Folder ${folderName} not found.`);
      //  create a folder
      const createFolderRes = await createFolder({
        folderName: folderName,
        parentFolderID: parentFolderID,
        ssmParameterName: "/google/drive",
        region: "ap-south-1",
      });

      console.log("createFolderRes", createFolderRes);
      targetFolderId = createFolderRes.folder?.id || "";
    }
    console.log("targetFolderId", targetFolderId);
  } else {
    targetFolderId = parentFolderID;
    console.error("Listing failed:", listResult.error);
  }

  //upload to gdrive
  const result = await uploadFileToDrive({
    filePath: `/tmp/receipt-${payment.orderId}.pdf`,
    folderID: targetFolderId,
    ssmParameterName: "/google/drive",
    region: "ap-south-1",
  });
};
