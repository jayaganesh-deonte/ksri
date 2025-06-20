import pdfmake from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";

import path from "path";
import fs from "fs";
import { Payment } from "../models/payments/ebookPayment";

// Define font files
const fonts = {
  Roboto: {
    normal: path.join(__dirname, "fonts/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "fonts/Roboto-Bold.ttf"),
  },
  // Use system fonts as fallback
  Tinos: {
    normal: path.join(__dirname, "fonts/Tinos-Regular.ttf"),
    bold: path.join(__dirname, "fonts/Tinos-Bold.ttf"),
  },
};

const printer = new pdfmake(fonts);

const capitalizeFirstLetter = (str: string) => {
  // split by space and capitalize first letter of each word
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Function to generate ebook purchase receipt PDF
const generateEbookReceiptPDF = async (data: Payment) => {
  const paymentDate = new Date(data.paymentDate);
  const paymentDateFormatted = `${paymentDate.getDate()}-${
    paymentDate.getMonth() + 1
  }-${paymentDate.getFullYear()}`;

  const receiptData = { ...data, paymentDate: paymentDateFormatted };

  // Read the logo file as base64
  // Assuming the logo is in the assets folder relative to this file
  const logoPath = path.join(__dirname, "fonts/ksri_logo_bw.jpg");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");

  console.log("Generating ebook receipt PDF with data:", receiptData);

  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    content: [
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                stack: [
                  // Header section with contact info
                  {
                    columns: [
                      {
                        text: "E-mail: ksrinst@gmail.com",
                        width: "*",
                        fontSize: 11,
                        alignment: "left",
                      },
                      {
                        text: "Phone: 044-24985320",
                        width: "auto",
                        fontSize: 11,
                        alignment: "right",
                      },
                    ],
                    margin: [0, 0, 0, 10],
                  },
                  // Logo and Institute Name in columns
                  {
                    columns: [
                      {
                        // Logo on the left
                        image: `data:image/png;base64,${logoBase64}`,
                        width: 65,
                        alignment: "center",
                      },
                      {
                        // Institute details stack on the right
                        stack: [
                          {
                            text: "THE KUPPUSWAMI SASTRI RESEARCH INSTITUTE",
                            style: "header",
                            alignment: "center",
                            margin: [0, 15, 0, 0],
                          },
                          {
                            text: "(Regd. S.No. 32/1944-45 dated 24-2-1945)",
                            alignment: "center",
                            fontSize: 11,
                            margin: [0, 5, 0, 0],
                          },
                          {
                            text: "84, Thiru Vi. Ka. Road, Mylapore, Chennai - 600 004.",
                            alignment: "center",
                            fontSize: 11,
                            margin: [0, 5, 0, 0],
                          },
                          {
                            text: "PAN: AAATT0629E",
                            width: 140,
                            fontSize: 11,
                            alignment: "center",
                          },
                        ],
                        width: "*",
                      },
                    ],
                    margin: [0, 0, 0, 15],
                  },
                  // Receipt heading
                  {
                    text: "PURCHASE RECEIPT",
                    fontSize: 14,
                    bold: true,
                    alignment: "center",
                    margin: [0, 0, 0, 15],
                  },
                  // Order number and date in same line
                  {
                    columns: [
                      {
                        text: [
                          { text: "Order No: ", fontSize: 11 },
                          {
                            text: receiptData.orderId,
                            fontSize: 11,
                            bold: true,
                          },
                        ],
                        width: "*",
                        alignment: "left",
                      },
                      {
                        text: [
                          { text: "Date: ", fontSize: 11 },
                          { text: receiptData.paymentDate, fontSize: 11 },
                        ],
                        width: "*",
                        alignment: "right",
                      },
                    ],
                    margin: [0, 0, 0, 20],
                  },
                  // Customer details
                  {
                    text: [
                      { text: "Customer: ", fontSize: 11, bold: true },
                      {
                        text: capitalizeFirstLetter(receiptData.name),
                        fontSize: 11,
                        bold: true,
                      },
                      // add identification in brackets
                      // {
                      //   text: receiptData.panNumber
                      //     ? ` (PAN: ${receiptData.panNumber})`
                      //     : receiptData.aadharNumber
                      //     ? ` (Aadhar: ${receiptData.aadharNumber})`
                      //     : receiptData.passportNumber
                      //     ? ` (Passport: ${receiptData.passportNumber})`
                      //     : "",
                      //   fontSize: 11,
                      // },
                    ],
                    margin: [0, 10, 0, 10],
                  },
                  {
                    text: [
                      { text: "Address: ", fontSize: 11, bold: true },
                      {
                        text:
                          capitalizeFirstLetter(receiptData.address) +
                          ", " +
                          capitalizeFirstLetter(receiptData.city) +
                          ", " +
                          capitalizeFirstLetter(receiptData.state) +
                          ", " +
                          capitalizeFirstLetter(receiptData.country),
                        fontSize: 11,
                      },
                    ],
                    margin: [0, 0, 0, 15],
                  },
                  // Purchase details
                  {
                    text: [
                      { text: "Book Name: ", fontSize: 11, bold: true },
                      {
                        text: receiptData.bookName,
                        fontSize: 11,
                        font: "Tinos",
                      },
                    ],
                    margin: [0, 0, 0, 10],
                  },
                  {
                    text: [
                      { text: "Amount Paid: ", fontSize: 11 },
                      {
                        text:
                          capitalizeFirstLetter(
                            receiptData.amountInWords || ""
                          ) + " Only",
                        fontSize: 11,
                        bold: true,
                      },
                      { text: " by ", fontSize: 11 },
                      {
                        text: receiptData.paymentMethod,
                        fontSize: 11,
                      },
                    ],
                    margin: [0, 0, 0, 10],
                  },
                  // Transaction details
                  {
                    text: [
                      {
                        text:
                          receiptData.paymentMethod !== "Cash"
                            ? "Transaction ID: " + receiptData.paymentRefId
                            : "",
                        fontSize: 11,
                      },
                    ],
                    margin: [0, 0, 0, 10],
                  },
                  // Amount box and signature section
                  {
                    columns: [
                      {
                        table: {
                          widths: ["auto"],
                          body: [
                            [
                              {
                                text: [
                                  { text: "Total: Rs. ", fontSize: 11 },
                                  {
                                    text: receiptData.amount,
                                    fontSize: 11,
                                    bold: true,
                                  },
                                ],
                                alignment: "center",
                                margin: [4, 4, 4, 4],
                              },
                            ],
                          ],
                        },
                        width: "auto",
                      },
                      {
                        text: "Authorized Signature",
                        alignment: "right",
                        fontSize: 11,
                        width: "*",
                        margin: [0, 5, 0, 0],
                      },
                    ],
                    margin: [0, 20, 0, 20],
                  },
                  // Footer note
                  {
                    text: "* This is a computer generated receipt for your ebook purchase. Thank you for your purchase!",
                    fontSize: 10,
                    alignment: "center",
                    margin: [0, 10, 0, 0],
                  },
                ],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: function () {
            return 0.5;
          },
          vLineWidth: function () {
            return 0.5;
          },
          paddingLeft: function () {
            return 10;
          },
          paddingRight: function () {
            return 10;
          },
          paddingTop: function () {
            return 10;
          },
          paddingBottom: function () {
            return 10;
          },
        },
      },
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
      },
    },
  };

  return new Promise((resolve, reject) => {
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];
    pdfDoc.on("data", (chunk: Buffer) => chunks.push(chunk));
    pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
    pdfDoc.on("error", (err: Error) => reject(err));
    pdfDoc.end();
  });
};

export { generateEbookReceiptPDF };
