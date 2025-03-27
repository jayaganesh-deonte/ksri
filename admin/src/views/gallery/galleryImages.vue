<template>
  <generic-crud
    entityName="Gallery Images"
    :apiEndpoint="apiEndpoint"
    :entityFields="galleryFields"
    :headers="galleryHeaders"
    :addIdToPayload="true"
  />
</template>

<script>
import axiosInstance from "@/axios";

export default {
  data() {
    return {
      galleryCollections: [],
      apiEndpoint: "/gallery",
      galleryHeaders: [
        {
          key: "description",
          title: "Description",
        },
        {
          key: "imageUrl",
          title: "Image",
          type: "image",
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
          // rules: [(v) => !!v || "Description is required"],
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
    const galleryCollectionUrl = "/gallery/collections";

    const response = await axiosInstance.get(galleryCollectionUrl);

    this.galleryCollections = response.data.map(
      (collection) => collection.name
    );
  },
};
</script>
