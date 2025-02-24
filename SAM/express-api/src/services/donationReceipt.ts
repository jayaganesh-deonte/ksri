import pdfmake from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";

import path from "path";
import { Payment } from "../models/payments/payment";

// Define font files
const fonts = {
  Roboto: {
    normal: path.resolve("./fonts/Roboto-Regular.ttf"),
    bold: path.resolve("./fonts/Roboto-Bold.ttf"),
  },
};

const printer = new pdfmake(fonts);

// Function to generate receipt PDF
const generateReceiptPDF = async (data: Payment) => {
  const paymentDate = new Date(data.paymentDate);
  const paymentDateFormatted = `${paymentDate.getDate()}-${
    paymentDate.getMonth() + 1
  }-${paymentDate.getFullYear()}`;

  const receiptData = { ...data, paymentDate: paymentDateFormatted };

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
                  // Header section
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
                  {
                    text: "THE KUPPUSWAMI SASTRI RESEARCH INSTITUTE",
                    style: "header",
                    alignment: "center",
                    margin: [0, 0, 0, 5],
                  },
                  {
                    text: "(Regd. S.No. 32/1944-45 dated 24-2-1945)",
                    alignment: "center",
                    fontSize: 11,
                    margin: [0, 0, 0, 5],
                  },
                  {
                    text: "84, Thiru Vi. Ka. Road, Mylapore, Chennai - 600 004.",
                    alignment: "center",
                    fontSize: 11,
                    margin: [0, 0, 0, 5],
                  },
                  {
                    text: "www.ksri.in",
                    alignment: "center",
                    fontSize: 11,
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
                        text: "  " + receiptData.name + "  ",
                        fontSize: 11,
                        decoration: "underline",
                      },
                    ],
                    margin: [0, 0, 0, 15],
                  },
                  {
                    text: [
                      { text: "Address: ", fontSize: 11 },
                      {
                        text: "  " + receiptData.address + "  ",
                        fontSize: 11,
                        decoration: "underline",
                      },
                    ],
                    margin: [0, 0, 0, 15],
                  },
                  {
                    text: [
                      { text: "Rupees ", fontSize: 11 },
                      {
                        text: "  " + receiptData.amountInWords + " Only  ",
                        fontSize: 11,
                        decoration: "underline",
                      },
                      { text: " by ", fontSize: 11 },
                      {
                        text: receiptData.paymentMethod,
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
                                    text: "  " + receiptData.amount + "  ",
                                    fontSize: 11,
                                    decoration: "underline",
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

// const main = async () => {
//   const data = { "paymentType": "Donation", "amount": "999", "amountInWords": "Nine Hundred And Ninety Nine Rupees", "paymentDate": "2025-02-24", "paymentStatus": "COMPLETED", "name": "Jaya Ganesh", "orderId": 1, "email": "jayaganesh111999@gmail.com", "phoneNumber": "9585894742", "paymentRefId": "24022025", "metadata": { "updated_by": "demo", "created_at": "2025-02-24T03:42:11.868Z", "updated_at": "2025-02-24T03:42:11.868Z", "created_by": "demo" }, "itemPublishStatus": "PUBLISHED", "paymentMethod": "UPI", "address": "Flat T1, Mithun SKy Garden, Sri Balaji Nagar, Santhosapuram, Medavakkam", "city": "Chennai", "state": "Tamil Nadu", "zip": "600073", "country": "India" }
//   const pdfBuffer = await generateReceiptPDF(data);
//   fs.writeFileSync("receipt.pdf", pdfBuffer);
// };

export { generateReceiptPDF };
