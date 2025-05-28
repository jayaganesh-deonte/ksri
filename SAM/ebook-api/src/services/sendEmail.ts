import axios from "axios";
import { getSSMParameter } from "./ssmParam";

let apiDetails: any;

interface EmailDataVariables {
  name: string;
  address: string;
  panNumber: string;
  amountInWords: string;
  paymentMethod: string;
  date: string;
  receiptLink: string;
  paymentRefId: string;
}

interface EmailRequest {
  transactionalId: string;
  email: string;
  dataVariables: EmailDataVariables;
}

export class EmailService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly transactionalId: string;

  private constructor(apiUrl: string, apiKey: string, transactionalId: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.transactionalId = transactionalId;
  }

  static async init(): Promise<EmailService> {
    if (!apiDetails) {
      const paramName = process.env.EMAIL_PARAM_NAME as string;

      console.log("Email param name:", paramName);

      const response = await getSSMParameter(paramName, true);
      if (!response) {
        throw new Error("API details not found in SSM parameter store");
      }
      apiDetails = JSON.parse(response);
    }

    return new EmailService(
      apiDetails.url,
      apiDetails.apiKey,
      apiDetails.transactionalId
    );
  }

  async sendEmail(
    email: string,
    emailDataVariables: EmailDataVariables
  ): Promise<any> {
    try {
      const request: EmailRequest = {
        transactionalId: this.transactionalId,
        email: email,
        dataVariables: emailDataVariables,
      };
      const response = await axios.post(this.apiUrl, request, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send email: ${error}`);
    }
  }
}
