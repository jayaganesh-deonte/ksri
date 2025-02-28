import * as crypto from "crypto";

interface InitOptions {
  working_key: string;
  merchant_id: string;
}

interface OrderParams {
  billing_name: string;
  billing_email: string;
  billing_tel: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_country: string;
  amount: string;
  currency: string;
  language: string;

  merchant_param1: string; // pan number
  merchant_param2?: string; //  aadhar number
  merchant_param3?: string; //passport number
  merchant_param4?: string; //passport expiry date

  order_id: string;
  merchant_id: string;
  redirect_url: string;
  cancel_url: string;
}

class ConfigureCCAvenue {
  private initOptions: InitOptions;

  constructor() {
    let initOptions: InitOptions = {
      working_key: process.env.WORKING_KEY || "",
      merchant_id: process.env.MERCHANT_ID || "",
    };
    this.initOptions = initOptions;
  }

  encrypt(plainText: string): string {
    if (!plainText || !this.initOptions.working_key)
      throw new Error("Missing required parameters");

    // Create MD5 hash of working key
    const key = crypto
      .createHash("md5")
      .update(this.initOptions.working_key)
      .digest();

    // Fixed IV as per CCAvenue
    const iv = Buffer.from("000102030405060708090a0b0c0d0e0f", "hex");

    // Create cipher
    const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
    cipher.setAutoPadding(true); // Ensure PKCS7 padding

    // Encrypt
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    return encrypted;
  }

  decrypt(encText: string): string {
    if (!encText || !this.initOptions.working_key)
      throw new Error("Missing required parameters");

    try {
      // Create MD5 hash of working key
      const key = crypto
        .createHash("md5")
        .update(this.initOptions.working_key)
        .digest();

      // Fixed IV as per CCAvenue
      const iv = Buffer.from("000102030405060708090a0b0c0d0e0f", "hex");

      // Create decipher
      const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
      decipher.setAutoPadding(true); // Ensure PKCS7 padding

      // Decrypt
      let decrypted = decipher.update(encText, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      console.error("Encrypted text:", encText);
      console.error(
        "Working key MD5:",
        crypto
          .createHash("md5")
          .update(this.initOptions.working_key)
          .digest("hex")
      );
      throw error;
    }
  }

  redirectResponseToJson(response: string): Record<string, string> {
    try {
      const decryptedResponse = this.decrypt(response);
      return decryptedResponse
        .split("&")
        .reduce<Record<string, string>>((acc, pair) => {
          if (pair) {
            let [key, value] = pair.split("=");
            if (key) acc[key] = value || "";
          }
          return acc;
        }, {});
    } catch (error) {
      console.error("Response parsing error:", error);
      throw error;
    }
  }

  getEncryptedOrder(orderParams: OrderParams): string {
    let data = `merchant_id=${this.initOptions.merchant_id}`;
    data += Object.entries(orderParams)
      .map(([key, value]) => `&${key}=${value}`)
      .join("");
    return this.encrypt(data);
  }
}

// export default ccavenueUtils;
export { ConfigureCCAvenue, OrderParams };
