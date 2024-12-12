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
    const galleryCollectionUrl =
      import.meta.env.VITE_API_URL + "/gallery/collections";

    const response = await axios.get(galleryCollectionUrl);

    this.galleryCollections = response.data.map(
      (collection) => collection.name
    );
  },
};
</script>
