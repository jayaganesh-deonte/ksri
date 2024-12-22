import axios from "axios";

import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient();

export const getParameter = async (name: string) => {
  const command = new GetParameterCommand({
    Name: name,
    WithDecryption: true,
  });
  const response = await ssmClient.send(command);
  return response.Parameter?.Value;
};

export const triggerGithubWorkflow = async (
  githubPat: string,
  owner: string,
  repo: string,
  workflowId: string,
  ref: string = "main"
) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`;

  const response = await axios.post(
    url,
    {
      ref: ref,
    },
    {
      headers: {
        Authorization: `token ${githubPat}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (response.status === 204) {
    console.log("Workflow triggered successfully");
    return true;
  } else {
    console.error("Failed to trigger workflow", response.data);
    return false;
  }
};
