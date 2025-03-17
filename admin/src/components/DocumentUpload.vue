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
      <!-- hidden input to select files -->
      <input
        ref="fileInput"
        id="fileInput"
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
            <!-- Download button -->
            <v-btn
              icon
              @click="downloadFile(file)"
              color="primary"
              class="mr-2"
              size="x-small"
            >
              <v-icon>mdi-download</v-icon>
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
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { uploadToS3, deleteFromS3 } from "@/services/s3";
import $toast from "@/utilities/toast_notification";

// Props definition
const props = defineProps({
  files: {
    type: Array,
    default: () => [],
  },
  // Optional configuration for file types and limits
  allowedFileTypes: {
    type: Array,
    default: () => [
      "image/*",
      ".pdf",
      ".doc",
      ".docx",
      ".txt",
      ".mp3",
      ".wav",
      ".m4a",
    ],
  },
  maxFileSize: {
    type: Number,
    default: 10 * 1024 * 1024, // 10MB default
  },
  title: {
    type: String,
    default: "Files",
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
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    pdf: "pdf",
    doc: "document",
    docx: "document",
    txt: "document",
    default: "document",
    mp3: "audio",
    wav: "audio",
    m4a: "audio",
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
    jpg: { icon: "mdi-file-image", color: "blue" },
    jpeg: { icon: "mdi-file-image", color: "blue" },
    png: { icon: "mdi-file-image", color: "blue" },
    gif: { icon: "mdi-file-image", color: "blue" },
    pdf: { icon: "mdi-file-pdf", color: "red" },
    doc: { icon: "mdi-file-word", color: "blue" },
    docx: { icon: "mdi-file-word", color: "blue" },
    txt: { icon: "mdi-file-document", color: "grey" },
    default: { icon: "mdi-file", color: "grey" },
  };
  return iconMap[extension] || iconMap.default;
};

// Upload files
const uploadFiles = async (e) => {
  // select element using id fileInput
  const inputElement = document.getElementById("fileInput");
  //   click  input to select files
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
      const s3Key = `files/${file.name}`;

      // Upload to S3
      const uploadRes = await uploadToS3(file, s3Key);

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

// Delete file
const deleteFile = async (file) => {
  try {
    // Extract S3 key from URL
    const s3Key = file.url.split("/").slice(3).join("/");

    // Delete from S3
    const deleteRes = await deleteFromS3(s3Key);

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
</style>
