import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger();
const sesClient = new SESClient();

const FROM_EMAIL = process.env.FROM_EMAIL;
const TO_EMAIL = process.env.TO_EMAIL;

export const handler = async (event: any) => {
  try {
    logger.info("Incoming request", { event: event, component: "contact_us" });

    // Parse event body
    const body = JSON.parse(event.body);

    // Extract details
    const { Name, Email, Mobile, message, category } = body;

    // Construct the email content
    const emailSubject =
      "New Contact Request - The Kuppuswami Sastri Research Institute - From " +
      Name;

    const emailBody = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Visitor Details</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #083421;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #083421; padding: 50px; width: 100%;">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600px" style="background-color: #ffffff; padding: 40px; border-radius: 0px; text-align: left;">
            <tr>
              <td>
                <h1 style="font-size: 18px; text-decoration: underline; color: #083421;">The Kuppuswami Sastri Research Institute</h1>
                <p><span style="font-weight: bold;">Visitor type:</span> ${category.join(
                  ", "
                )}</p>
                <p><span style="font-weight: bold;">Mobile:</span> ${Mobile}</p>
                <p><span style="font-weight: bold;">Name:</span> ${Name}</p>
                <p>
                  <span style="font-weight: bold;">Email:</span>
                  <a href="mailto:${Email}" style="color: blue; text-decoration: none;">${Email}</a>
                </p>
                <p><span style="font-weight: bold;">Message:</span></p>
                <p>${message.replace(/\n/g, "<br />")}</p>
                <hr style="border-top: 1px solid #083421; margin: 15px 0;" />

                <p style="font-size: 14px; color: #333;">
                  Copyright © The Kuppuswami Sastri Research Institute All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    // Validate email environment variables
    if (!FROM_EMAIL || !TO_EMAIL) {
      throw new Error(
        "Missing FROM_EMAIL or TO_EMAIL in environment variables"
      );
    }

    // Send email via AWS SES
    const params = {
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [TO_EMAIL] },
      Message: {
        Subject: { Data: emailSubject },
        Body: { Html: { Data: emailBody } },
      },
    };

    const sesResponse = await sesClient.send(new SendEmailCommand(params));

    logger.info("Email sent", { sesResponse });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    logger.error("Error sending email", { error });

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to send email",
        error: (error as any).message,
      }),
    };
  }
};
