import { google, drive_v3 } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

// Types for service account credentials
interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

// Types for upload result
interface UploadResult {
  success: boolean;
  file?: {
    id: string;
    name: string;
    webViewLink: string;
    mimeType: string;
    createdTime: string;
    size: string | null;
  };
  message?: string;
  error?: string;
  details?: any;
}

// Props for the upload function
interface UploadProps {
  filePath: string;
  folderID?: string | null;
  ssmParameterName: string;
  region?: string;
}

/**
 * Fetches service account credentials from AWS SSM Parameter Store
 */
async function getCredentialsFromSSM(
  parameterName: string,
  region: string = "us-east-1"
): Promise<ServiceAccountCredentials> {
  try {
    const ssmClient = new SSMClient({ region });
    const command = new GetParameterCommand({
      Name: parameterName,
      WithDecryption: true,
    });

    const response = await ssmClient.send(command);

    if (!response.Parameter || !response.Parameter.Value) {
      throw new Error(`Parameter ${parameterName} not found or empty`);
    }

    return JSON.parse(response.Parameter.Value) as ServiceAccountCredentials;
  } catch (error) {
    console.error("Error fetching credentials from SSM:", error);
    throw error;
  }
}

/**
 * Authenticates with Google Drive using service account credentials
 */
function authenticateWithCredentials(credentials: ServiceAccountCredentials) {
  try {
    // Create a JWT auth client using the service account credentials
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ["https://www.googleapis.com/auth/drive"],
      null
    );

    return auth;
  } catch (error) {
    console.error(
      "Authentication error:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

/**
 * Determines MIME type based on file extension
 */
function getMimeType(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase();

  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx":
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".txt": "text/plain",
    ".csv": "text/csv",
    ".json": "application/json",
    ".zip": "application/zip",
  };

  return mimeTypes[extension] || "application/octet-stream";
}

/**
 * Uploads a file to Google Drive
 */
async function uploadFileToDrive(props: UploadProps): Promise<UploadResult> {
  try {
    // Get credentials from SSM
    const credentials = await getCredentialsFromSSM(
      props.ssmParameterName,
      props.region
    );

    // Authenticate
    const auth = authenticateWithCredentials(credentials);

    // Create a Drive client
    const drive = google.drive({ version: "v3", auth });

    // Verify file exists
    if (!fs.existsSync(props.filePath)) {
      throw new Error(`File does not exist: ${props.filePath}`);
    }

    // Get file metadata
    const fileName = path.basename(props.filePath);
    const fileContent = fs.createReadStream(props.filePath);
    const mimeType = getMimeType(fileName);

    // Set up file metadata
    const fileMetadata: drive_v3.Schema$File = {
      name: fileName,
    };

    // If folder ID is provided, set it as the parent
    if (props.folderID) {
      fileMetadata.parents = [props.folderID];
    }

    // Upload file to Drive
    const media = {
      mimeType,
      body: fileContent,
    };

    console.log(`Uploading ${fileName} to Google Drive...`);

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id,name,webViewLink,mimeType,createdTime,size",
    });

    const result: UploadResult = {
      success: true,
      file: {
        id: response.data.id || "",
        name: response.data.name || "",
        webViewLink: response.data.webViewLink || "",
        mimeType: response.data.mimeType || "",
        createdTime: response.data.createdTime || "",
        size: response.data.size || null,
      },
      message: `File uploaded successfully! File ID: ${response.data.id}`,
    };

    // Log in JSON format
    console.log(JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    const errorResponse: UploadResult = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details:
        error instanceof Error && "response" in error
          ? (error as any).response?.data
          : null,
    };

    console.error(JSON.stringify(errorResponse, null, 2));
    return errorResponse;
  }
}

/**
 * Lists files and folders inside a Google Drive folder
 */
/**
 * Lists files and folders inside a Google Drive folder
 */
interface ListFilesProps {
  folderID: string;
  pageSize?: number;
  orderBy?: string;
  pageToken?: string;
  ssmParameterName: string;
  region?: string;
}

interface FileItem {
  id: string;
  name: string;
  mimeType: string;
  isFolder: boolean;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
}

interface ListFilesResult {
  success: boolean;
  files?: FileItem[];
  nextPageToken?: string;
  error?: string;
  details?: any;
}

// function listFilesInFolder(props: ListFilesProps): any {
//   console.log("test");
//   // try {
//   //   // Get credentials from SSM
//   //   const credentials = await getCredentialsFromSSM(
//   //     props.ssmParameterName,
//   //     props.region
//   //   );

//   //   // Authenticate
//   //   const auth = authenticateWithCredentials(credentials);

//   //   // Create a Drive client
//   //   const drive = google.drive({ version: "v3", auth });

//   //   console.log(`Listing files in folder ID: ${props.folderID}...`);
//   // } catch (error) {
//   //   const errorResponse: ListFilesResult = {
//   //     success: false,
//   //     error: error instanceof Error ? error.message : String(error),
//   //     details:
//   //       error instanceof Error && "response" in error
//   //         ? (error as any).response?.data
//   //         : null,
//   //   };

//   //   console.error(JSON.stringify(errorResponse, null, 2));
//   //   return errorResponse;
//   // }
// }

const listAll = () => {
  console.log("listFilesInFolder");
};

export { uploadFileToDrive, listAll };
// Example of how to use the functions when importing:
/*
import { uploadFileToDrive, listFilesInFolder } from './gdrive-utils';

async function main() {
  try {
    // Example: Upload a file
    const uploadResult = await uploadFileToDrive({
      filePath: './path/to/file.pdf',
      folderID: 'optional-google-drive-folder-id',
      ssmParameterName: '/myapp/google-drive-credentials',
      region: 'us-east-1'
    });
    
    if (uploadResult.success) {
      console.log('Upload successful:', uploadResult.file?.webViewLink);
    } else {
      console.error('Upload failed:', uploadResult.error);
    }
    
    // Example: List files in a folder
    const listResult = await listFilesInFolder({
      folderID: 'google-drive-folder-id',
      pageSize: 100,  // optional
      orderBy: 'name', // optional
      ssmParameterName: '/myapp/google-drive-credentials',
      region: 'us-east-1'
    });
    
    if (listResult.success) {
      console.log('Files found:', listResult.files?.length);
      
      // Print folders first, then files
      const folders = listResult.files?.filter(f => f.isFolder) || [];
      const files = listResult.files?.filter(f => !f.isFolder) || [];
      
      console.log('Folders:');
      folders.forEach(folder => {
        console.log(`- ${folder.name} (ID: ${folder.id})`);
      });
      
      console.log('Files:');
      files.forEach(file => {
        console.log(`- ${file.name} (ID: ${file.id})`);
      });
      
      // If there are more files (pagination)
      if (listResult.nextPageToken) {
        console.log('More files available. Use nextPageToken for the next page.');
      }
    } else {
      console.error('Listing failed:', listResult.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
*/
