<template>
  <v-card class="" rounded="0">
    <!-- preview existing images -->
    <v-card
      class="pa-2 d-flex justify-space-between"
      elevation="0"
      color="secondary"
    >
      <div class="text-h6">Images:</div>
      <!-- add button to upload new images -->
      <v-btn color="primary" class="ml-2" @click="uploadImages">
        <v-icon>mdi-plus</v-icon>
        Upload
      </v-btn>
      <!-- hidden input to select images -->
      <input
        type="file"
        id="imageUpload"
        multiple
        accept="image/*"
        @change="uploadImages"
        style="display: none"
      />
    </v-card>

    <div class="d-flex flex-wrap ma-2" v-if="images.length > 0">
      <v-card v-for="image in images" class="ma-2" :key="image" width="300">
        <v-img :src="image" alt="image" width="300">
          <div class="d-flex justify-end ma-2">
            <!-- icon to delete image -->
            <v-btn
              icon
              @click="deleteImage(image)"
              color="accentGreen"
              class="text-white"
            >
              <v-icon color="primary">mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-img>
      </v-card>
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";

import { uploadToS3, deleteFromS3 } from "@/services/s3";

import $toast from "@/utilities/toast_notification";

const swal = inject("$swal");

// add props to get existing images
const props = defineProps({
  images: Array,
});

let newImages = ref([]);

// merge existing images with new images
newImages.value = [...props.images];

// send event to parent component
const emit = defineEmits(["images-updated"]);

// upload images
const uploadImages = async (e) => {
  // select images from input
  // click input to select images
  const inputElement = document.getElementById("imageUpload");
  inputElement.click();

  const files = e.target.files;
  console.log(files);

  for (let i = 0; i < files.length; i++) {
    // upload to s3
    const s3Key = `images/${files[i].name}`;
    let uploadRes = await uploadToS3(files[i], s3Key);
    console.log(uploadRes);

    if (uploadRes.$metadata.httpStatusCode != 200) {
      console.log("Error uploading image");
      $toast.open({
        type: "error",
        position: "top-right",
        message: `Error uploading image`,
      });
    } else {
      const cloudfront_domain = import.meta.env.VITE_IMAGE_CLOUDFRONT;
      const image = `${cloudfront_domain}/${s3Key}`;
      newImages.value.push(image);

      // emit event to parent component
      emit("images-updated", newImages.value);
    }
  }
};

// delete image
const deleteImage = async (image) => {
  // delete from s3
  const s3Key = image.split("/").pop();
  const deleteRes = await deleteFromS3(s3Key);
  console.log(deleteRes);

  // remove from array
  newImages.value = newImages.value.filter((i) => i !== image);

  // emit event to parent component
  emit("images-updated", newImages.value);
};

// add
</script>
