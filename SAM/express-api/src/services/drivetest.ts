import { uploadFileToDrive, listAll } from "./driveService";

async function main() {
  try {
    // const result = await uploadFileToDrive({
    //   filePath: "./test1.txt",
    //   folderID: "1QBKEAi06NfwFrL752rP8r-CC-fbzkqM5",
    //   ssmParameterName: "/google/drive",
    //   region: "ap-south-1",
    // });
    // if (result.success) {
    //   console.log("Upload successful:", result.file?.webViewLink);
    // } else {
    //   console.error("Upload failed:", result.error);
    // }
    listAll();
    // const listResult = await listFilesInFolder({
    //   // folderID: "1QBKEAi06NfwFrL752rP8r-CC-fbzkqM5",
    //   // pageSize: 100, // optional
    //   // orderBy: "name", // optional
    //   // ssmParameterName: "/google/drive",
    //   // region: "ap-south-1",
    //   folderID: "1QBKEAi06NfwFrL752rP8r-CC-fbzkqM5",
    //   ssmParameterName: "/google/drive",
    //   region: "ap-south-1",
    // });
    // if (listResult.success) {
    //   console.log("Files found:", listResult.files?.length);
    //   // Print folders first, then files
    //   const folders = listResult.files?.filter((f) => f.isFolder) || [];
    //   const files = listResult.files?.filter((f) => !f.isFolder) || [];
    //   console.log("Folders:");
    //   folders.forEach((folder) => {
    //     console.log(`- ${folder.name} (ID: ${folder.id})`);
    //   });
    //   console.log("Files:");
    //   files.forEach((file) => {
    //     console.log(`- ${file.name} (ID: ${file.id})`);
    //   });
    //   // If there are more files (pagination)
    //   if (listResult.nextPageToken) {
    //     console.log(
    //       "More files available. Use nextPageToken for the next page."
    //     );
    //   }
    // } else {
    //   console.error("Listing failed:", listResult.error);
    // }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
