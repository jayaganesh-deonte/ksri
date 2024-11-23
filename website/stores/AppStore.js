import { defineStore } from "pinia";

export const appStore = defineStore("app", {
  state: () => ({
    dainandini: {
      audioFile:
        "https://d30y75l38k1y9.cloudfront.net/upload/media/mk-dainandini-2-11-24.mp3",
      sanskritLine1: "अनार्यमार्यवृत्तेन सत्येनानृतवादितम्।",
      sanskritLine2: "रिपुमप्युपकारेण वशीकुर्वन्ति साधव:॥",
      description:
        "Good people win over the bad souls by their good conduct; untruthful with truth and even the enemies by favouring them.",
    },
  }),
  getters: {
    getDainandini: (state) => state.dainandini,
  },
  actions: {},
});
