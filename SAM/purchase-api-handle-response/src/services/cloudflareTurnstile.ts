import axios from "axios";
import { Request } from "express";
import { getSSMParameter } from "./ssmParam";

interface CloudflareConfig {
  url: string;
  secretKey: string;
}
let cloudflareConfig: CloudflareConfig = {
  url: "",
  secretKey: "",
};

const validateCloudflareTurnstileToken = async (req: Request) => {
  try {
    console.log("req", req);

    // if secretKey is not set, get it from SSM
    if (!cloudflareConfig.secretKey) {
      const ssmRes = await getSSMParameter(
        process.env.CLOUDFLARE_SECRET_KEY || "",
        true
      );
      if (!ssmRes) {
        throw new Error("Failed to get secret key from SSM");
      }
      cloudflareConfig = JSON.parse(ssmRes);
    }

    // get authorization header
    const authorization = req.headers.authorization;

    const CLOUDFLARE_SECRET_KEY = process.env.CLOUDFLARE_SECRET_KEY;
    if (!CLOUDFLARE_SECRET_KEY) {
      throw new Error("CLOUDFLARE_SECRET_KEY is not set");
    }

    //   axios POST
    const response = await axios.post(cloudflareConfig.url, {
      secret: cloudflareConfig.secretKey,
      response: authorization,
    });

    console.log("response", response);

    if (response.status == 200) {
      console.log("response.data", response.data);
      const { data } = response;

      if (data.success == true) {
        return true;
      }
      return false;
    }
    return false;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

export { validateCloudflareTurnstileToken };

/*
const main = async () => {
  const res = await validateCloudflareTurnstileToken("test");
  console.log("res", res);
};
*/
