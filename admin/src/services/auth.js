import { fetchAuthSession } from "aws-amplify/auth";

// get user id token
export const getUserIdToken = async () => {
  try {
    const { tokens } = await fetchAuthSession();
    return tokens.idToken.toString();
  } catch (err) {
    console.error("Error getting user ID token:", err);
    throw err;
  }
};
