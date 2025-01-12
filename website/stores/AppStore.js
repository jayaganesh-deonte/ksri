import axios from "axios";
import { defineStore } from "pinia";

export const appStore = defineStore("app", {
  state: () => ({
    isHomeDialogContentPresent: false,
    homeDialogContent: {
      // title: "Update",
      // description:
      //   "KSRI Payment Gateway: Our Kuppuswami Sastri Research Institute has now got its own Payment Gateway!",
      // buttonText: "Visit Website",
      // buttonLink: "/contribute",
    },
    dainandini: {
      audioFile: getAssetUrl("upload/media/mk-dainandini-2-11-24.mp3"),
      sanskritLine1: "अनार्यमार्यवृत्तेन सत्येनानृतवादितम्।",
      sanskritLine2: "रिपुमप्युपकारेण वशीकुर्वन्ति साधव:॥",
      description:
        "Good people win over the bad souls by their good conduct; untruthful with truth and even the enemies by favouring them.",
    },
    marqueeTexts: [
      // {
      //   name: "Know about our upcoming events",
      //   link: "/events",
      // },
    ],
  }),
  getters: {
    getHomeDialogContent: (state) => state.homeDialogContent,
    getDainandini: (state) => state.dainandini,
  },
  actions: {
    // get dainandini from api
    async getDainandiniFromApi() {
      const runtimeConfig = useRuntimeConfig();

      try {
        // make axios get request
        const response = await axios.get(
          `${runtimeConfig.public.API_URL}/dainandini`
        );

        this.dainandini = response.data[0];

        console.log("dainandini store", this.dainandini);
      } catch (error) {
        console.log("error", error);
      }
    },

    // get home dialog content from api
    async getHomeDialogContentFromApi() {
      const runtimeConfig = useRuntimeConfig();

      try {
        // make axios get request
        const response = await axios.get(
          `${runtimeConfig.public.API_URL}/homedialog`
        );

        // if data is present set  isHomeDialogContentPresent to true
        if (response.data.length > 0) {
          this.homeDialogContent = response.data[0];

          console.log("home dialog content store", this.homeDialogContent);
          this.isHomeDialogContentPresent = true;
        }
      } catch (error) {
        console.log("error", error);
      }
    },
    //  get getMarqueeTextsFromApi
    async getMarqueeTextsFromApi() {
      const runtimeConfig = useRuntimeConfig();

      try {
        // make axios get request
        const response = await axios.get(
          `${runtimeConfig.public.API_URL}/marqueetexts`
        );

        this.marqueeTexts = response.data;

        console.log("marquee texts store", this.marqueeTexts);
      } catch (error) {
        console.log("error", error);
      }
    },

    // get all data from api
    async getAllDataFromApi() {
      console.log("get all data from api");
      const runtimeConfig = useRuntimeConfig();

      console.log("API", runtimeConfig.public.API_URL);
      // make all api calls
      await Promise.all([
        this.getDainandiniFromApi(),
        this.getHomeDialogContentFromApi(),
        this.getMarqueeTextsFromApi(),
      ]);
    },
  },
});
