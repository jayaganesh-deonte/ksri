import { Request, Response, Router } from "express";
import { documentClient } from "../db_services/dynamodbClient";

import {
  getParameter,
  triggerGithubWorkflow,
} from "../github_actions/trigger_workflow";

export const deployRoute = Router();

const PROJECTS_TABLE = process.env.DDB_TABLE_NAME ?? "ksri_admin_master_table";

// Deploy Website
deployRoute.post("/deploy", async (req: Request, res: Response) => {
  try {
    // check if deployment is already in progress
    const deploymentStatus = await getDeploymentStatus();

    if (deploymentStatus.status === "IN_PROGRESS") {
      throw new Error("Deployment is already in progress");
    }

    // update updateDeploymentHistory
    const metadata = req.body;
    await updateDeploymentHistory(metadata);
    await updatePendingDeployment("SUCCESS");

    const github_pat = await getParameter("/deonte/github/action/pat");
    const owner = "jayaganesh-deonte";
    const repo = "ksri";
    const workflowId = "deploy_website.yml";
    const ref = "main";

    if (!github_pat) {
      throw new Error("Error in publishing website");
    }

    await triggerGithubWorkflow(github_pat, owner, repo, workflowId, ref);

    res.status(200).json({ message: "Deployment triggered successfully" });
  } catch (error) {
    console.error("Error triggering deployment:", error);
    res.status(500).json({
      error: "Failed to trigger deployment",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

const updateDeploymentHistory = async (metadata: any) => {
  // update DDB with deployment status
  // get current timestamp
  const timestamp = new Date().toISOString();

  const item = {
    PK: "ENTITYTYPE#DEPLOYMENT",
    SK: "ENTITYTYPE#DEPLOYMENT",
    entityType: "ENTITYTYPE#DEPLOYMENT",
    timestamp: timestamp,
    status: "IN_PROGRESS",
    metadata: metadata,
  };
  await documentClient.put({
    TableName: PROJECTS_TABLE,
    Item: item,
  });

  // TTL as 60 days from now in epoch time
  const ttl = Math.floor(new Date().getTime() / 1000) + 60 * 24 * 60 * 60;

  // store deployment history in DDB
  const deploymentHistoryItem = {
    PK: "ENTITYTYPE#DEPLOYMENT_HISTORY",
    SK: `DEPLOYMENT#${timestamp}`,
    entityType: "ENTITYTYPE#DEPLOYMENT_HISTORY",
    timestamp: timestamp,
    metadata: metadata,
    ttl: ttl,
  };
  await documentClient.put({
    TableName: PROJECTS_TABLE,
    Item: deploymentHistoryItem,
  });
};

const getDeploymentStatus = async () => {
  const params = {
    TableName: PROJECTS_TABLE,
    Key: {
      PK: "ENTITYTYPE#DEPLOYMENT",
      SK: "ENTITYTYPE#DEPLOYMENT",
    },
  };

  const result = await documentClient.get(params);
  const item = result.Item || {};
  let response = {
    status: item.status,
    metadata: item.metadata,
    timestamp: item.timestamp,
  };
  return response;
};

// Get Deployment Status
deployRoute.get("/deploy/status", async (req: Request, res: Response) => {
  try {
    let response = await getDeploymentStatus();
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting deployment status:", error);
    res.status(500).json({
      error: "Failed to get deployment status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get Deployment History

deployRoute.get("/deploy/history", async (req: Request, res: Response) => {
  try {
    const params = {
      TableName: PROJECTS_TABLE,
      KeyConditionExpression: "entityType = :entityType",
      ExpressionAttributeValues: {
        ":entityType": "ENTITYTYPE#DEPLOYMENT_HISTORY",
      },
      IndexName: "entityTypeSK",
      ScanIndexForward: false,
    };

    const result = await documentClient.query(params);
    const items = result.Items || [];
    let response = items.map((item) => ({
      timestamp: item.timestamp,
      metadata: item.metadata,
    }));
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting deployment history:", error);
    res.status(500).json({
      error: "Failed to get deployment history",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

const updatePendingDeployment = async (status: string) => {
  const item = {
    PK: "ENTITYTYPE#DEPLOYMENT#PENDING",
    SK: "ENTITYTYPE#DEPLOYMENT#PENDING",
    entityType: "ENTITYTYPE#DEPLOYMENT#PENDING",
    timestamp: new Date().toISOString(),
    status: status,
  };
  await documentClient.put({
    TableName: PROJECTS_TABLE,
    Item: item,
  });
};

// POST: pending changes available to deploy
deployRoute.post("/deploy/pending", async (req: Request, res: Response) => {
  try {
    //  If deployment is already in progress, return error
    const deploymentStatus = await getDeploymentStatus();

    if (deploymentStatus.status === "IN_PROGRESS") {
      throw new Error("Deployment is already in progress");
    }

    await updatePendingDeployment("PENDING");
    res.status(200).json({ message: "Pending changes available to deploy" });
  } catch (error) {
    console.error("Error triggering deployment:", error);
    res.status(500).json({
      error: "Failed to trigger deployment",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET: pending changes available to deploy
deployRoute.get("/deploy/pending", async (req: Request, res: Response) => {
  try {
    const params = {
      TableName: PROJECTS_TABLE,
      Key: {
        PK: "ENTITYTYPE#DEPLOYMENT#PENDING",
        SK: "ENTITYTYPE#DEPLOYMENT#PENDING",
      },
    };
    const result = await documentClient.get(params);
    const item = result.Item || {};
    let response = {
      status: item.status,
      timestamp: item.timestamp,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting pending changes:", error);
    res.status(500).json({
      error: "Failed to get pending changes",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
