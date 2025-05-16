<template>
  <v-card class="" rounded="0">
    <!-- preview existing files -->
    <v-card
      class="pa-2 d-flex justify-space-between"
      elevation="0"
      color="secondary"
    >
      <div class="text-h6">{{ title }}</div>
      <!-- add button to upload new files -->
      <v-btn color="primary" class="ml-2" @click="triggerFileInput">
        <v-icon>mdi-plus</v-icon>
        Upload
      </v-btn>
      <!-- hidden input to select files with unique ID -->
      <input
        ref="fileInput"
        :id="uniqueFileInputId"
        type="file"
        multiple
        :accept="acceptedFileTypes"
        @change="uploadFiles"
        style="display: none"
      />
    </v-card>

    <!-- File list display -->
    <div class="ma-2">
      <v-card
        v-for="file in newFiles"
        :key="file.url"
        class="ma-2 pa-2 d-flex align-center justify-space-between"
        color="greenBg"
      >
        <!-- if type is audio -->
        <div v-if="file.type === 'audio'">
          <audio controls>
            <source :src="getDocumentUrl(file.url)" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
        <div
          v-else
          class="ma-2 pa-2 d-flex justify-space-between"
          style="width: 100%"
        >
          <div class="d-flex align-center pa-2">
            <!-- File type icon -->
            <v-icon :color="getFileTypeIcon(file.name).color" class="mr-2">
              {{ getFileTypeIcon(file.name).icon }}
            </v-icon>

            <!-- File name -->
            <span>{{ file.name }}</span>
            <v-chip
              v-if="file.encrypted"
              color="primary"
              size="small"
              class="ml-2"
            >
              Encrypted
            </v-chip>
          </div>

          <div>
            <!-- Preview button -->
            <v-btn
              icon
              @click="previewFile(file)"
              color="primary"
              class="mr-2"
              size="x-small"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>

            <!-- Delete button -->
            <v-btn icon @click="deleteFile(file)" color="error" size="x-small">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>
  </v-card>

  <!-- EPUB Preview Dialog -->
  <v-dialog
    v-model="epubPreviewDialog"
    @update:modelValue="onEpubDialogToggle"
    max-width="900px"
  >
    <v-card>
      <v-card-title class="text-h6 d-flex align-center justify-space-between">
        <div>{{ currentFileName || "Book Preview" }}</div>
        <v-btn icon variant="text">
          <v-icon @click="epubPreviewDialog = false">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <div v-if="isLoading" class="d-flex justify-center align-center pa-4">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        <span class="ml-2">Decrypting file...</span>
      </div>
      <Epubviewer v-else :src="bookUrl" />
    </v-card>
  </v-dialog>

  <!-- PDF Preview Dialog -->
  <v-dialog
    v-model="pdfPreviewDialog"
    @update:modelValue="onPdfDialogToggle"
    max-width="900px"
  >
    <v-card>
      <v-card-title class="text-h6 d-flex align-center justify-space-between">
        <div>{{ currentFileName || "PDF Preview" }}</div>
        <v-btn icon variant="text">
          <v-icon @click="pdfPreviewDialog = false">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <div v-if="isLoading" class="d-flex justify-center align-center pa-4">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        <span class="ml-2">Decrypting file...</span>
      </div>
      <div v-else class="pdf-container">
        <iframe
          :src="pdfViewerUrl"
          frameborder="0"
          width="100%"
          height="600px"
        ></iframe>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, inject, onMounted } from "vue";
import ePub from "epubjs";

import { ulid } from "ulidx";
import { uploadToS3, deleteFromS3 } from "@/services/s3";
import $toast from "@/utilities/toast_notification";

import {
  getCurrentUser,
  signInWithRedirect,
  fetchUserAttributes,
  fetchAuthSession,
} from "aws-amplify/auth";

// Dialog states
const epubPreviewDialog = ref(false);
const pdfPreviewDialog = ref(false);
const currentFileName = ref("");
const isLoading = ref(false);
let book = null;
let bookUrl = ref(null);
let pdfViewerUrl = ref(null);
let rendition = null;

// Generate a unique ID for the file input
const uniqueFileInputId = ref(`file-input-${ulid()}`);

// Props definition
const props = defineProps({
  files: {
    type: Array,
    default: () => [],
    // This can now accept either string paths or objects with metadata
  },
  // Optional configuration for file types and limits
  allowedFileTypes: {
    type: Array,
    default: () => [".pdf", ".epub"],
  },
  maxFileSize: {
    type: Number,
    default: 10 * 1024 * 1024, // 10MB default
  },
  title: {
    type: String,
    default: "Ebooks",
  },
  isPreviewFile: {
    type: Boolean,
    default: false,
  },
  // Add encrypt files prop
  encryptFiles: {
    type: Boolean,
    default: false,
  },
});

// Emits definition
const emit = defineEmits(["files-updated"]);

// Refs
const fileInput = ref(null);
const newFiles = ref([]);

// Encryption key (hardcoded for now - should be securely retrieved in production)
const ENCRYPTION_PASSPHRASE = "your-secret-encryption-key-2023";

// Function to derive a properly sized encryption key using PBKDF2
const getCryptoKey = async () => {
  // Convert the passphrase to an ArrayBuffer
  const encoder = new TextEncoder();
  const passphraseData = encoder.encode(ENCRYPTION_PASSPHRASE);

  // First, create a key from the passphrase
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passphraseData,
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  // Use PBKDF2 to derive a 256-bit key suitable for AES-GCM
  // Using a fixed salt for simplicity (in production, this should be unique per user)
  const salt = new TextEncoder().encode("fixed-salt-value-12345");

  // Derive the actual encryption key
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

// Function to encrypt a file
const encryptFile = async (file) => {
  try {
    // Generate a random IV (Initialization Vector)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Get the key
    const key = await getCryptoKey();

    // Read the file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Encrypt the file
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      fileBuffer
    );

    // Create a new ArrayBuffer that contains IV + encrypted data
    const resultBuffer = new ArrayBuffer(iv.length + encryptedData.byteLength);
    const resultView = new Uint8Array(resultBuffer);

    // Copy IV to the beginning
    resultView.set(iv, 0);

    // Copy encrypted data after IV
    resultView.set(new Uint8Array(encryptedData), iv.length);

    // Create a new Blob with the encrypted data
    return new Blob([resultBuffer], { type: file.type });
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt file");
  }
};

// Function to decrypt data
const decryptData = async (encryptedData) => {
  try {
    // Extract the IV (first 12 bytes)
    const iv = encryptedData.slice(0, 12);

    // Extract the encrypted data (everything after the IV)
    const encrypted = encryptedData.slice(12);

    // Get the key
    const key = await getCryptoKey();

    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
      },
      key,
      encrypted
    );

    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt file");
  }
};

const getDocumentUrl = (document) => {
  return import.meta.env.VITE_IMAGE_CLOUDFRONT + document;
};

const getFileType = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  const typeMap = {
    pdf: "pdf",
    epub: "epub",
    default: "document",
  };
  return typeMap[extension] || typeMap.default;
};

// Initialize files from props
if (props.files.length > 0) {
  newFiles.value = [...props.files].map((file) => {
    // Check if this is a full object or just a string URL
    if (typeof file === "string") {
      const filename = file.split("/").pop();
      return {
        name: filename,
        url: file,
        type: getFileType(filename),
        encrypted: file.includes(".encrypted."),
      };
    } else {
      // If it's already an object with metadata
      return {
        name: file.url.split("/").pop(),
        url: file.url,
        type: getFileType(file.url.split("/").pop()),
        encrypted: file.encrypted || file.url.includes(".encrypted."),
        s3Key: file.s3Key,
        s3Folder: file.s3Folder,
      };
    }
  });
}

// Computed property for accepted file types
const acceptedFileTypes = computed(() => props.allowedFileTypes.join(","));

// Trigger file input dialog
const triggerFileInput = () => {
  fileInput.value.click();
};

// Get file type icon and color
const getFileTypeIcon = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  const iconMap = {
    pdf: { icon: "mdi-file-pdf", color: "red" },
    epub: { icon: "mdi-book-open-variant", color: "green" },
    default: { icon: "mdi-file", color: "grey" },
  };
  return iconMap[extension] || iconMap.default;
};

// Upload files
const uploadFiles = async (e) => {
  // Select element using dynamic id
  const inputElement = document.getElementById(uniqueFileInputId.value);
  const files = inputElement.files;

  for (let file of files) {
    // Validate file size
    if (file.size > props.maxFileSize) {
      $toast.open({
        type: "error",
        position: "top-right",
        message: `File ${file.name} exceeds maximum size limit of ${
          props.maxFileSize / (1024 * 1024)
        }MB`,
      });
      continue;
    }

    // Validate file type
    const isAllowedType = props.allowedFileTypes.some(
      (type) =>
        type === "*" ||
        file.type.match(type.replace("*", "")) ||
        type.includes(`.${file.name.split(".").pop()}`)
    );

    if (!isAllowedType) {
      $toast.open({
        type: "error",
        position: "top-right",
        message: `File type ${file.name} is not allowed`,
      });
      continue;
    }

    try {
      // Create a unique filename
      const fileExt = file.name.split(".").pop();
      let uploadFile = file;
      let isFileEncrypted = false;
      let fileName = file.name;

      // Encrypt the file if encryption is enabled
      if (props.encryptFiles) {
        isLoading.value = true;
        $toast.open({
          type: "info",
          position: "top-right",
          message: `Encrypting ${file.name}...`,
        });

        try {
          uploadFile = await encryptFile(file);
          fileName = `${file.name.replace(
            `.${fileExt}`,
            ""
          )}.encrypted.${fileExt}`;
          isFileEncrypted = true;
        } catch (error) {
          $toast.open({
            type: "error",
            position: "top-right",
            message: `Failed to encrypt ${file.name}`,
          });
          isLoading.value = false;
          continue;
        }
      }

      // Generate S3 key
      const s3Key = `files/${ulid()}.${fileExt}`;

      // Upload to S3
      const s3UploadFolder = props.isPreviewFile ? "preview" : "ebook";
      const uploadRes = await uploadToS3(uploadFile, s3Key, s3UploadFolder);

      if (uploadRes.$metadata.httpStatusCode === 200) {
        let fileUrl = "";

        // For encrypted files, store S3 path (will use signed URLs for access)
        // For non-encrypted files, use CloudFront
        if (isFileEncrypted) {
          // Store S3 path for encrypted files (will generate signed URLs on demand)
          // Use CloudFront for non-encrypted files
          const cloudfront_domain = import.meta.env.VITE_EBOOK_CLOUDFRONT;
          fileUrl = `${cloudfront_domain}${s3Key}`;
        } else {
          // Use CloudFront for non-encrypted files
          const cloudfront_domain = import.meta.env.VITE_IMAGE_CLOUDFRONT;
          fileUrl = `${cloudfront_domain}${s3Key}`;
        }

        // Add to files array
        const newFile = {
          name: fileName,
          url: fileUrl,
          type: getFileType(fileName),
          encrypted: isFileEncrypted,
          s3Key: s3Key,
          s3Folder: s3UploadFolder,
        };
        newFiles.value.push(newFile);

        // Update URLs for non-encrypted files to store relative paths
        for (let file of newFiles.value) {
          if (!file.encrypted && !file.url.startsWith("s3://")) {
            const cloudfront_domain = import.meta.env.VITE_IMAGE_CLOUDFRONT;
            file.url = file.url.replace(cloudfront_domain, "");
            file.url = file.url.replace(/^\//, "");
          }
        }

        // Emit updated files
        emit(
          "files-updated",
          newFiles.value.map((f) => ({
            url: f.url,
            encrypted: f.encrypted,
            s3Key: f.s3Key,
            s3Folder: f.s3Folder,
          }))
        );

        $toast.open({
          type: "success",
          position: "top-right",
          message: `${file.name} uploaded successfully${
            isFileEncrypted ? " (encrypted)" : ""
          }`,
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
      $toast.open({
        type: "error",
        position: "top-right",
        message: `Error uploading ${file.name}`,
      });
    } finally {
      isLoading.value = false;
    }
  }

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Function to get S3 signed URL for encrypted files
const getS3SignedUrl = async (s3Key, s3Folder) => {
  try {
    const authRes = await fetchAuthSession();
    return "";
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw new Error("Failed to get secure access to file");
  }
};

// Preview file
const previewFile = async (file) => {
  // Set current file name for dialog title
  currentFileName.value = file.name;
  const extension = file.name.split(".").pop().toLowerCase();
  isLoading.value = true;

  try {
    let url;
    // Check if file is encrypted
    const isEncrypted = file.encrypted || file.name.includes(".encrypted.");

    if (isEncrypted) {
      // For encrypted files, get S3 signed URL
      if (file.url.startsWith("s3://")) {
        // Parse S3 path
        const s3Path = file.url.replace("s3://", "").split("/");
        const s3Folder = s3Path[0];
        const s3Key = s3Path.slice(1).join("/");

        // Get signed URL for S3 object
        url = await getS3SignedUrl(
          file.s3Key || s3Key,
          file.s3Folder || s3Folder
        );
      } else {
        // If we already have a URL (maybe from CloudFront anyway)
        const baseUrl = props.isPreviewFile
          ? import.meta.env.VITE_IMAGE_CLOUDFRONT
          : import.meta.env.VITE_EBOOK_CLOUDFRONT;
        url = file.url;
      }

      // Fetch the encrypted file
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }

      // Get file as ArrayBuffer
      const encryptedData = await response.arrayBuffer();

      // Decrypt the file
      const decryptedData = await decryptData(encryptedData);

      // Create Object URL for the decrypted content
      const decryptedBlob = new Blob([decryptedData], {
        type: extension === "pdf" ? "application/pdf" : "application/epub+zip",
      });
      const decryptedUrl = URL.createObjectURL(decryptedBlob);

      if (extension === "epub" || file.name.includes(".epub")) {
        epubPreviewDialog.value = true;
        bookUrl.value = decryptedUrl;
      } else if (extension === "pdf" || file.name.includes(".pdf")) {
        pdfViewerUrl.value = `${decryptedUrl}#toolbar=0`;
        pdfPreviewDialog.value = true;
      }
    } else {
      // Handle non-encrypted files normally via CloudFront
      const baseUrl = props.isPreviewFile
        ? import.meta.env.VITE_IMAGE_CLOUDFRONT
        : import.meta.env.VITE_EBOOK_CLOUDFRONT;
      url = baseUrl + file.url;

      if (extension === "epub" || file.name.includes(".epub")) {
        epubPreviewDialog.value = true;
        bookUrl.value = url;
      } else if (extension === "pdf" || file.name.includes(".pdf")) {
        pdfViewerUrl.value = `${url}#toolbar=0`;
        pdfPreviewDialog.value = true;
      } else {
        $toast.open({
          type: "error",
          position: "top-right",
          message: `Preview not supported for ${file.name}`,
        });
      }
    }
  } catch (error) {
    console.error("Preview error:", error);
    $toast.open({
      type: "error",
      position: "top-right",
      message: `Error previewing file: ${error.message}`,
    });
  } finally {
    isLoading.value = false;
  }
};

const onEpubDialogToggle = (val) => {
  if (!val) {
    if (rendition) {
      rendition.destroy();
      rendition = null;
    }

    // Revoke object URL if needed
    if (bookUrl.value && bookUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(bookUrl.value);
      bookUrl.value = null;
    }
  }
};

const onPdfDialogToggle = (val) => {
  if (!val) {
    // Revoke object URL if needed
    if (pdfViewerUrl.value && pdfViewerUrl.value.startsWith("blob:")) {
      const blobUrl = pdfViewerUrl.value.split("#")[0];
      URL.revokeObjectURL(blobUrl);
      pdfViewerUrl.value = null;
    }
  }
};

// Delete file
const deleteFile = async (file) => {
  try {
    // Delete from S3
    const s3UploadFolder = props.isPreviewFile ? "preview" : "ebook";
    const deleteRes = await deleteFromS3(file.name, s3UploadFolder);

    // Remove from files array
    newFiles.value = newFiles.value.filter((f) => f.url !== file.url);

    // Emit updated files
    emit(
      "files-updated",
      newFiles.value.map((f) => f.url)
    );

    $toast.open({
      type: "success",
      position: "top-right",
      message: `${file.name} deleted successfully`,
    });
  } catch (error) {
    console.error("Delete error:", error);
    $toast.open({
      type: "error",
      position: "top-right",
      message: `Error deleting ${file.name}`,
    });
  }
};
</script>

<style scoped>
/* Optional: Add some styling to improve file list appearance */
.v-card {
  transition: background-color 0.3s ease;
}
.v-card:hover {
  background-color: #f5f5f5;
}

#epub-viewer {
  height: 500px;
  width: 100%;
  border: 1px solid #ccc;
  overflow: auto;
}

.pdf-container {
  width: 100%;
  height: 600px;
  overflow: hidden;
  border-radius: 4px;
}

/* Hide PDF.js toolbar elements (if they leak through) */
:deep(.toolbarButton#download),
:deep(.toolbarButton#print) {
  display: none !important;
}
</style>
