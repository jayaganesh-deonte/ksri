import pdfmake from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";

import path from "path";
import fs from "fs";
import { Payment } from "../models/payments/payment";

// Define font files
const fonts = {
  Roboto: {
    normal: path.join(__dirname, "fonts/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "fonts/Roboto-Bold.ttf"),
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

// Function to generate receipt PDF
const generateReceiptPDF = async (data: Payment) => {
  const paymentDate = new Date(data.paymentDate);
  const paymentDateFormatted = `${paymentDate.getDate()}-${
    paymentDate.getMonth() + 1
  }-${paymentDate.getFullYear()}`;

  const receiptData = { ...data, paymentDate: paymentDateFormatted };

  // Read the logo file as base64
  // Assuming the logo is in the assets folder relative to this file
  const logoPath = path.join(__dirname, "fonts/ksri_logo_bw.jpg");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");

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
                        text: "Phone: 2498 5320",
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
                        width: 80,
                        alignment: "center",
                      },
                      {
                        // Institute details stack on the right
                        stack: [
                          {
                            text: "THE KUPPUSWAMI SASTRI RESEARCH INSTITUTE",
                            style: "header",
                            alignment: "center",
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
                            text: "www.ksri.in",
                            alignment: "center",
                            fontSize: 11,
                            margin: [0, 5, 0, 0],
                          },

                          {
                            text: "PAN: AAATT0629E",
                            alignment: "center",
                            fontSize: 11,
                            margin: [0, 5, 0, 0],
                          },
                        ],
                        width: "*",
                      },
                    ],
                    margin: [0, 0, 0, 15],
                  },
                  // Receipt heading
                  {
                    text: "RECEIPT",
                    alignment: "center",
                    fontSize: 14,
                    bold: true,
                    margin: [0, 0, 0, 15],
                  },
                  // Receipt number and date
                  {
                    columns: [
                      {
                        text: [
                          { text: "No. ", fontSize: 11 },
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
                          {
                            text: receiptData.paymentDate,
                            fontSize: 11,
                          },
                        ],
                        width: "auto",
                        alignment: "right",
                      },
                    ],
                    margin: [0, 0, 0, 20],
                  },
                  // Content section
                  {
                    text: [
                      { text: "Received with thanks from ", fontSize: 11 },
                      {
                        text:
                          " Mr./Ms./Mrs." +
                          capitalizeFirstLetter(receiptData.name) +
                          " ",
                        fontSize: 11,
                        bold: true,
                      },
                      // add pan in brackets
                      {
                        text: receiptData.panNumber
                          ? ` (PAN: ${receiptData.panNumber}) `
                          : receiptData.aadharNumber
                          ? ` (Aadhar: ${receiptData.aadharNumber}) `
                          : receiptData.passportNumber
                          ? ` (Passport: ${receiptData.passportNumber}) `
                          : "",
                        fontSize: 11,
                      },
                    ],
                    margin: [0, 0, 0, 15],
                  },
                  {
                    text: [
                      { text: "Address: ", fontSize: 11, bold: true },
                      {
                        text:
                          " " +
                          capitalizeFirstLetter(receiptData.address) +
                          ", " +
                          capitalizeFirstLetter(receiptData.city) +
                          ", " +
                          capitalizeFirstLetter(receiptData.state) +
                          ", " +
                          capitalizeFirstLetter(receiptData.country) +
                          " ",
                        fontSize: 11,
                      },
                    ],
                    margin: [0, 0, 0, 15],
                  },
                  // {
                  //   text: [
                  //     { text: "PAN: ", fontSize: 11, bold: true },
                  //     {
                  //       text: receiptData.panNumber,
                  //       fontSize: 11,
                  //     },
                  //   ],
                  //   margin: [0, 0, 0, 15],
                  // },
                  {
                    text: [
                      { text: "Rupees", fontSize: 11 },
                      {
                        text:
                          " " +
                          capitalizeFirstLetter(
                            receiptData.amountInWords || ""
                          ) +
                          " Only ",
                        fontSize: 11,
                        bold: true,
                      },
                      { text: "by ", fontSize: 11 },
                      {
                        text: receiptData.paymentMethod,
                        fontSize: 11,
                      },
                      {
                        text:
                          receiptData.paymentMethod !== "Cash"
                            ? " with Transaction ID: "
                            : "",
                        fontSize: 11,
                      },
                      {
                        text:
                          receiptData.paymentMethod !== "Cash"
                            ? receiptData.paymentRefId
                            : "",
                        fontSize: 11,
                      },
                      { text: " Towards ", fontSize: 11 },
                      {
                        text: "donation for Research Activities.",
                        fontSize: 11,
                      },
                    ],
                    margin: [0, 0, 0, 15],
                  },
                  // Amount box and Secretary in same line
                  {
                    columns: [
                      {
                        table: {
                          widths: ["auto"],
                          body: [
                            [
                              {
                                text: [
                                  { text: "Rs. ", fontSize: 11 },
                                  {
                                    text: " " + receiptData.amount + " ",
                                    fontSize: 11,
                                    bold: true,
                                  },
                                ],
                                alignment: "left",
                                margin: [4, 4, 4, 4],
                              },
                            ],
                          ],
                        },
                        width: "auto",
                      },
                      {
                        text: "Secretary",
                        alignment: "right",
                        fontSize: 11,
                        width: "*",
                        margin: [0, 5, 0, 0],
                      },
                    ],
                    margin: [0, 20, 0, 20],
                  },
                  // Tax exemption notice at bottom
                  {
                    table: {
                      widths: ["*"],
                      body: [
                        [
                          {
                            text: "Donations are exempt 100% U/S 35(1) (iii) and U/S 80GGA of I.T.Act. 1961 Vide Notification No. 102 / 2007 (F. No. 203 / 68 / 2004 / ITA-II)",
                            fontSize: 10,
                            alignment: "center",
                            margin: [2, 2, 2, 2],
                          },
                        ],
                      ],
                    },
                  },
                  {
                    text: "* In the case of online payment, No signature is required for the  automatically generated e-receipt.",
                    fontSize: 10,
                    alignment: "center",
                    margin: [2, 2, 2, 2],
                  },
                  // {
                  //   table: {
                  //     widths: ["*"],
                  //     body: [
                  //       [
                  //         {
                  //           text: "In the case of online payment, No signature is required for the  automatically generated e-receipt.",
                  //           fontSize: 10,
                  //           alignment: "center",
                  //           margin: [2, 2, 2, 2],
                  //         },
                  //       ],
                  //     ],
                  //   },
                  // },
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

export { generateReceiptPDF };
