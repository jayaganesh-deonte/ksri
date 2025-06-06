// from ssm param get api key and pass it to the constructor
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient();

async function getSSMParameter(
  paramName: string,
  withDecryption: boolean = false
): Promise<string | undefined> {
  try {
    const command = new GetParameterCommand({
      Name: paramName,
      WithDecryption: withDecryption, // Set to true if the parameter is encrypted
    });

    const response = await ssmClient.send(command);
    return response.Parameter?.Value;
  } catch (error) {
    console.error("Error fetching SSM parameter:", error);
    return undefined;
  }
}

export { getSSMParameter };
