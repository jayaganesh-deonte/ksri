<template>
  <generic-crud
    entityName="Gallery"
    :apiEndpoint="apiEndpoint"
    :entityFields="galleryFields"
    :headers="galleryHeaders"
    :addIdToPayload="true"
  />
</template>

<script>
import { getUserIdToken } from "@/services/auth";

import axios from "axios";
export default {
  data() {
    return {
      galleryCollections: [],
      apiEndpoint: import.meta.env.VITE_API_URL + "/gallery",
      galleryHeaders: [
        {
          key: "description",
          title: "Description",
        },
        {
          key: "collection",
          title: "Collection",
        },
        { key: "actions", title: "Actions" },
      ],
    };
  },
  computed: {
    galleryFields() {
      return [
        {
          key: "imageUrl",
          label: "Image",
          type: "image",
          rules: [(v) => !!v || "Image is required"],
        },
        {
          key: "description",
          label: "Description",
          type: "text",
          rules: [(v) => !!v || "Description is required"],
        },
        {
          key: "itemPublishStatus",
          label: "Publish Status",
          type: "auto-complete",
          rules: [(v) => !!v || "Publish Status is required"],
          items: ["PUBLISHED", "DRAFT"],
        },
        {
          key: "collection",
          label: "Collection",
          type: "auto-complete",
          items: this.galleryCollections,
          rules: [(v) => !!v || "Collection is required"],
        },
      ];
    },
  },
  async mounted() {
    const idToken = await getUserIdToken();

    const galleryCollectionUrl =
      import.meta.env.VITE_API_URL + "/gallery/collections";

    const response = await axios.get(galleryCollectionUrl, {
      headers: {
        Authorization: `${idToken}`,
      },
    });

    this.galleryCollections = response.data.map(
      (collection) => collection.name
    );
  },
};
</script>
