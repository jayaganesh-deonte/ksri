// Import required AWS SDK clients and commands
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

// Function to create and configure S3 client with credentials from Amplify auth session
const getS3Client = async () => {
  try {
    // Get current authenticated user
    const user = await getCurrentUser();

    // Get auth session with credentials
    const { credentials } = await fetchAuthSession();

    // Configure S3 client with credentials from auth session
    const s3Client = new S3Client({
      region: import.meta.env.VITE_APP_AWS_REGION, // Replace with your region
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
      },
    });

    return s3Client;
  } catch (err) {
    console.error("Error creating S3 client:", err);
    throw err;
  }
};

// Function to upload file to S3
const uploadToS3 = async (file, key, objectType) => {
  try {
    const s3Client = await getS3Client();

    //  if objectType is provided and is ebook then set Bucket name to VITE_EBOOK_BUCKET_NAME else VITE_S3_BUCKET_NAME
    const bucketName = objectType === "ebook" ? import.meta.env.VITE_EBOOK_BUCKET_NAME : import.meta.env.VITE_S3_BUCKET_NAME;

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);

    return response;
  } catch (err) {
    console.error("Error uploading file to S3:", err);
    throw err;
  }
};

// delete file from S3
const deleteFromS3 = async (key) => {
  try {
    const s3Client = await getS3Client();

    const params = {
      Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    const response = await s3Client.send(command);

    return response;
  } catch (err) {
    console.error("Error deleting file from S3:", err);
    throw err;
  }
};

export { getS3Client, uploadToS3, deleteFromS3 };
