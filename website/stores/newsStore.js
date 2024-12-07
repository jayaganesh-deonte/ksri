import { defineStore } from "pinia";

export const newsStore = async () => {
  const innerStore = defineStore("news", {
    state: () => ({
      news: [],
    }),
    actions: {
      async loadNews() {
        if (this.news.length > 0) {
          return;
        }
        console.log("loading news");
        const data = await queryContent("news").findOne();
        this.news = data.body;
      },
      getNewsById(id) {
        const news = this.news.filter((n) => n.id === id);
        if (news.length > 0) {
          return news[0];
        } else {
          return null;
        }
      },
    },
  });

  const s = innerStore();

  // init load news
  await s.loadNews();
  return s;
};
