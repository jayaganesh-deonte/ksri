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
      getNewsPagination(newsId) {
        // based on newsId from news array get below info
        let displayNextButton = false;
        let displayPreviousButton = false;

        let nextNewsId = "";
        let previousNewsId = "";

        // get index of newsId in news array
        const index = this.news.findIndex((n) => n.id === newsId);
        if (index > 0) {
          displayPreviousButton = true;
          previousNewsId = this.news[index - 1].id;
        }
        if (index < this.news.length - 1) {
          displayNextButton = true;
          nextNewsId = this.news[index + 1].id;
        }

        return {
          displayNextButton,
          displayPreviousButton,
          nextNewsId,
          previousNewsId,
        };
      },
    },
  });

  const s = innerStore();

  // init load news
  await s.loadNews();
  return s;
};
