import { defineStore } from "pinia";

export const appStore = defineStore("app", {
  state: () => ({
    isHomeDialogContentPresent: true,
    homeDialogContent: {
      title: "Update",
      description:
        "KSRI Payment Gateway: Our Kuppuswami Sastri Research Institute has now got its own Payment Gateway!",
      buttonText: "Visit Website",
      buttonLink: "/contribute",
    },
    dainandini: {
      audioFile:
        "https://d30y75l38k1y9.cloudfront.net/upload/media/mk-dainandini-2-11-24.mp3",
      sanskritLine1: "अनार्यमार्यवृत्तेन सत्येनानृतवादितम्।",
      sanskritLine2: "रिपुमप्युपकारेण वशीकुर्वन्ति साधव:॥",
      description:
        "Good people win over the bad souls by their good conduct; untruthful with truth and even the enemies by favouring them.",
    },
    marqueeTexts: [
      {
        name: "Know about our upcoming events",
        link: "/events",
      },
      {
        name: "Click here Contribute Now!!!",
        link: "/contribute",
      },
    ],
  }),
  getters: {
    getHomeDialogContent: (state) => state.homeDialogContent,
    getDainandini: (state) => state.dainandini,
  },
  actions: {},
});
