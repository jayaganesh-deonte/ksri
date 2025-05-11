import { CognitoJwtVerifier } from "aws-jwt-verify";

const getUserDetails = async (token: string) => {
  try {
    const REGION = process.env.AWS_REGION ?? "";
    const USER_POOL_ID = process.env.USER_POOL_ID ?? "";
    const CLIENT_ID = process.env.CLIENT_ID ?? "";
    const ALLOWED_URL = process.env.ALLOWED_URL ?? "";

    console.log("user pool id", USER_POOL_ID);

    console.log("token", token);

    // Verifier that expects valid access tokens:
    const verifier = CognitoJwtVerifier.create({
      userPoolId: USER_POOL_ID,
      tokenUse: "id",
      clientId: CLIENT_ID,
    });

    const payload = await verifier.verify(token, {
      tokenUse: "id",
      clientId: CLIENT_ID,
    });

    return payload;
  } catch (error) {
    console.error("Token not valid:", error);
    return null;
  }
};

export { getUserDetails };
