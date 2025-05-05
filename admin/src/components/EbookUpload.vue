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
      <Epubviewer :src="bookUrl" />
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
      <div class="pdf-container">
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

// Dialog states
const epubPreviewDialog = ref(false);
const pdfPreviewDialog = ref(false);
const currentFileName = ref("");
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
});

// Emits definition
const emit = defineEmits(["files-updated"]);

// Refs
const fileInput = ref(null);
const newFiles = ref([]);

const getDocumentUrl = (docuemnt) => {
  console.log("getDocumentUrl", docuemnt);
  return import.meta.env.VITE_IMAGE_CLOUDFRONT + docuemnt;
};

const getFileType = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  const typeMap = {
    // jpg: "image",
    // jpeg: "image",
    // png: "image",
    // gif: "image",
    pdf: "pdf",
    epub: "epub",
    default: "document",
  };
  return typeMap[extension] || typeMap.default;
};

// Initialize files from props
console.log("files", props.files);
console.log("files", props.files.length);
if (props.files.length > 0) {
  newFiles.value = [...props.files].map((file) => ({
    name: file.split("/").pop(),
    url: file,
    // pdf, document, audio
    type: getFileType(file.split("/").pop()),
  }));
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
  // select element using dynamic id
  const inputElement = document.getElementById(uniqueFileInputId.value);
  //   click input to select files
  inputElement.click();
  const files = inputElement.files;
  //   const files = e.target.files;

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
      // Generate S3 key with timestamp to prevent overwriting
      //   const timestamp = Date.now();
      const s3Key = `files/${ulid()}.${file.name.split(".").pop()}`;

      // Upload to S3
      const s3UploadFolder = props.isPreviewFile ? "preview" : "ebook";
      const uploadRes = await uploadToS3(file, s3Key, s3UploadFolder);

      if (uploadRes.$metadata.httpStatusCode === 200) {
        const cloudfront_domain = import.meta.env.VITE_IMAGE_CLOUDFRONT;
        const fileUrl = `${cloudfront_domain}/${s3Key}`;

        // Add to files array
        const newFile = {
          name: file.name,
          url: fileUrl,
        };
        newFiles.value.push(newFile);

        // for each newFiles
        for (let file of newFiles.value) {
          // remove cloudfront_domain from file.url
          file.url = file.url.replace(cloudfront_domain, "");
          console.log("file.url", file.url);
          // remove leading / from file.url
          file.url = file.url.replace(/^\//, "");

          // Log the updated files array
          console.log(
            "Updated files:",
            newFiles.value.map((f) => f.url)
          );
          emit(
            "files-updated",
            newFiles.value.map((f) => f.url)
          );
        }

        $toast.open({
          type: "success",
          position: "top-right",
          message: `${file.name} uploaded successfully`,
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
    }
  }

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Download file
const downloadFile = async (file) => {
  try {
    console.log("download file", file);

    const url = import.meta.env.VITE_IMAGE_CLOUDFRONT + file.url;

    // open url in new tab
    window.open(url, "_blank");
  } catch (error) {
    console.error("Download error:", error);
    $toast.open({
      type: "error",
      position: "top-right",
      message: `Error downloading ${file.name}`,
    });
  }
};

const previewFile = (file) => {
  const baseUrl = props.isPreviewFile
    ? import.meta.env.VITE_IMAGE_CLOUDFRONT
    : import.meta.env.VITE_EBOOK_CLOUDFRONT;
  const url = baseUrl + file.url;
  const extension = file.name.split(".").pop().toLowerCase();

  // Set current file name for dialog title
  currentFileName.value = file.name;

  console.log("previewFile", extension);

  if (extension === "epub") {
    epubPreviewDialog.value = true;
    bookUrl.value = url;
  } else if (extension === "pdf") {
    // Create PDF viewer URL with options to disable download/print
    // Using PDF.js viewer with parameters to hide toolbar and download button
    pdfViewerUrl.value = `${url}#toolbar=0`;
    // "https://docs.google.com/viewerng/viewer?url=${url}&embedded=true"
    pdfPreviewDialog.value = true;
  } else {
    $toast.open({
      type: "error",
      position: "top-right",
      message: `Preview not supported for ${file.name}`,
    });
  }
};

const onEpubDialogToggle = (val) => {
  if (!val && rendition) {
    rendition.destroy();
    rendition = null;
  }
};

const onPdfDialogToggle = (val) => {
  if (!val) {
    // Clean up if needed when closing PDF dialog
    pdfViewerUrl.value = null;
  }
};

// Delete file
const deleteFile = async (file) => {
  try {
    console.log("delete file", file);

    // Extract S3 key from URL
    const s3Key = file.url.split("/").slice(3).join("/");

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
