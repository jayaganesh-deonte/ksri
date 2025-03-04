import {
  uploadFileToDrive,
  listFilesInFolder,
  createFolder,
} from "./driveService";

/**
 * Returns the current financial year in the format "YYYY-YYYY"
 * Financial year is considered to start from April 1st and end on March 31st
 * @returns string representing the current financial year
 */
function getCurrentFinancialYear(): string {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-indexed (0 = January, 11 = December)
  const currentYear = today.getFullYear();

  // If current month is January to March (0-2), financial year started in previous calendar year
  // Otherwise financial year started in current calendar year
  const financialYearStart = currentMonth < 3 ? currentYear - 1 : currentYear;
  const financialYearEnd = financialYearStart + 1;

  return `${financialYearStart}-${financialYearEnd}`;
}

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

    const currentFRYear = getCurrentFinancialYear();

    const folderName = `FY-${currentFRYear}`;

    const parentFolderID = "1QBKEAi06NfwFrL752rP8r-CC-fbzkqM5";

    const listResult = await listFilesInFolder({
      // folderID: "1QBKEAi06NfwFrL752rP8r-CC-fbzkqM5",
      // pageSize: 100, // optional
      // orderBy: "name", // optional
      // ssmParameterName: "/google/drive",
      // region: "ap-south-1",
      folderID: parentFolderID,
      ssmParameterName: "/google/drive",
      region: "ap-south-1",
    });
    if (listResult.success) {
      const folders = listResult.files?.filter((f) => f.isFolder) || [];

      // check if folderName is present in folders
      let targetFolderId: string;
      const folder = folders.find((f) => f.name === folderName);
      if (folder) {
        console.log(`Folder ${folderName} found. ID: ${folder.id}`);
        targetFolderId = folder.id;
      } else {
        console.log(`Folder ${folderName} not found.`);
        //  create a folder
        const createFolderRes = await createFolder({
          folderName: folderName,
          parentFolderID: parentFolderID,
          ssmParameterName: "/google/drive",
          region: "ap-south-1",
        });
        console.log("createFolderRes", createFolderRes);
        targetFolderId = createFolderRes.folder?.id || "";
      }
      console.log("targetFolderId", targetFolderId);
    } else {
      console.error("Listing failed:", listResult.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
