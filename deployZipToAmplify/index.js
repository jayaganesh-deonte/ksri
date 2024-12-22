// Import required AWS SDK modules
const {
  AmplifyClient,
  StartDeploymentCommand,
  GetJobCommand,
} = require("@aws-sdk/client-amplify");

const client = new AmplifyClient();

// upload the zip file to S3
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client();

const {
  CloudFrontClient,
  CreateInvalidationCommand,
  GetInvalidationCommand,
} = require("@aws-sdk/client-cloudfront");

const S3_NAME = process.env.WEBSITE_S3_NAME || "ksri-website-zip";
const appId = process.env.APP_ID || "djs0bgez0rna3";
const branchName = process.env.BRANCH_NAME || "prod";
const distributionId = process.env.DISTRIBUTION_ID || "E1L197RUHFCEFU";

const uploadZipToS3 = async (zipFilePath) => {
  try {
    const bucketName = S3_NAME;
    const key = "website.zip";

    const fileStream = require("fs").createReadStream(zipFilePath);

    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
    });

    const data = await s3Client.send(putObjectCommand);
    console.log("Successfully uploaded zip to S3:", data);
    return data;
  } catch (err) {
    console.error("Error uploading zip to S3:", err);
    throw err;
  }
};

const checkJobStatus = async (appId, branchName, jobId) => {
  const command = new GetJobCommand({
    appId,
    branchName,
    jobId,
  });

  const response = await client.send(command);
  console.log("Job status:", response);
  return response;
};

async function publishZipToAmplify(appId, branchName, zipFilePath) {
  // Initialize Amplify client
  const client = new AmplifyClient();

  // Upload the zip file to S3
  const s3Res = await uploadZipToS3(zipFilePath);
  console.log("S3 response:", s3Res);

  // Create StartDeploymentCommand
  const command = new StartDeploymentCommand({
    appId,
    branchName,
    sourceUrlType: "ZIP",
    sourceUrl: `s3://${S3_NAME}/website.zip`,
  });

  // Send StartDeploymentCommand to Amplify
  const response = await client.send(command);

  // get jobId
  const jobId = response.jobSummary.jobId;
  console.log("Deployment started with jobId:", jobId);

  // check job status
  // wait for 5 seconds
  let jobStatus;
  do {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    jobStatus = await checkJobStatus(appId, branchName, jobId);
    console.log("Job status:", jobStatus);
  } while (
    jobStatus.job.summary.status !== "SUCCEED" &&
    jobStatus.job.summary.status !== "FAILED"
  );

  if (jobStatus.job.summary.status === "SUCCEED") {
    console.log("Deployment succeeded");
    return true;
  } else {
    console.log("Deployment failed");
    return false;
  }
}

const checkInvalidationStatus = async (distributionId, invalidationId) => {
  const cloudfront = new CloudFrontClient();

  const command = new GetInvalidationCommand({
    DistributionId: distributionId,
    Id: invalidationId,
  });

  const response = await cloudfront.send(command);
  console.log("Invalidation status:", response);
  return response;
};

const invalidateCloudFront = async (distributionId) => {
  const cloudfront = new CloudFrontClient();

  const command = new CreateInvalidationCommand({
    DistributionId: distributionId,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: 1,
        Items: ["/*"],
      },
    },
  });

  const response = await cloudfront.send(command);
  console.log("Invalidation response:", response);

  // get invalidationId
  const invalidationId = response.Invalidation.Id;

  // check invalidation status
  // wait for 5 seconds
  let invalidationStatus;
  do {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    invalidationStatus = await checkInvalidationStatus(
      distributionId,
      invalidationId
    );
    console.log("Invalidation status:", invalidationStatus);
  } while (
    invalidationStatus.Invalidation.Status !== "Completed" &&
    invalidationStatus.Invalidation.Status !== "FAILED"
  );
};

const main = async () => {
  const zipFilePath = "./website.zip";
  const response = await publishZipToAmplify(appId, branchName, zipFilePath);
  console.log("Published successfully:", response);

  const invalidationRes = await invalidateCloudFront(distributionId);
  console.log("Invalidation response:", invalidationRes);
};

main();
