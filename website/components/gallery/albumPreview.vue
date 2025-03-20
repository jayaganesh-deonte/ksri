<template>
  <v-card class="ma-2" :width="$device.isMobile ? '' : '40vw'" color="whiteBg">
    <!-- Album Title -->
    <div class="text-h6 font-weight-bold text-primary ma-2">
      {{ albumName }}
    </div>

    <!-- Image Grid -->
    <v-card-text>
      <v-container class="pa-0">
        <v-row no-gutters>
          <v-col cols="6" v-for="image in images" :key="image.id">
            <v-img
              :src="getImageUrl(image.imageUrl[0])"
              :alt="image.description"
              height="120"
              class="ma-1"
              cover
            ></v-img>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <!-- Optional Actions -->
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="text" color="primary" @click="$emit('view-album')">
        View Album
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "AlbumPreview",
  props: {
    albumName: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
      validator: (value) => {
        // Ensure exactly 4 images are provided
        return value.length === 4;
      },
    },
  },
  emits: ["view-album"],
  methods: {
    getImageUrl(url) {
      const runtimeConfig = useRuntimeConfig();
      return runtimeConfig.public.ASSET_DOMAIN + url;
    },
  },
};
</script>
