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
      subCollections: {},
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
        {
          key: "subCollection",
          title: "Sub Collection",
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
        {
          key: "subCollection",
          label: "Sub Collection",
          type: "auto-complete-function",
          itemFunction: (item) => {
            console.log("itemFunction", item);
            // check if collection is selected
            if (item.collection) {
              // check if subCollections exist
              if (this.subCollections[item.collection]) {
                return this.subCollections[item.collection];
              } else {
                return [];
              }
            } else {
              return [];
            }
          },
        },
      ];
    },
  },
  methods: {
    subCollectionName(collectionName) {
      return this.subCollections[collectionName];
    },
  },
  async mounted() {
    const galleryCollectionUrl = "/gallery/collections";

    const response = await axiosInstance.get(galleryCollectionUrl);

    this.galleryCollections = response.data.map(
      (collection) => collection.name
    );

    // update subCollections
    response.data.forEach((collection) => {
      console.log(collection);
      // check if subCollections exist
      if (collection.subCollections) {
        // check if subCollections is an array
        console.log("sub", collection.subCollections);

        this.subCollections[collection.name] = collection.subCollections.map(
          (subCollection) => subCollection.name
        );
      } else {
        this.subCollections[collection.name] = [];
      }
    });

    console.log(this.subCollections);
  },
};
</script>
