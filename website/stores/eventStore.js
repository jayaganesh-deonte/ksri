import { defineStore, acceptHMRUpdate } from "pinia";

export const eventStore = async () => {
  // create inner store
  const innerStore = defineStore("events", {
    state: () => ({
      events: [],
      categories: [
        // "Upcoming",
        // "Seminars",
        // "Endowment Lectures",
        // "Workshop",
        // "Viva",
        // "Events",
        // "All",
      ],
    }),
    actions: {
      // load events
      async loadEvents() {
        if (this.events.length == 0) {
          console.log("loading events");
          const data = await queryContent("events", "events").findOne();
          this.events = data.body;
        }
      },
      async loadCategories() {
        if (this.categories.length == 0) {
          try {
            console.log("loading categories");
            const data = await queryContent("events", "categories").findOne();
            this.categories = data.body;
          } catch (error) {
            console.error("error in loadCategories", error);
          }
        }
      },
      getEventById(id) {
        const event = this.events.find((event) => event.id === id);
        if (event) {
          return event;
        }
        return null;
      },
      getEventPagination(eventId) {
        // based on eventId from events array get below info
        let displayNextButton = false;
        let displayPreviousButton = false;

        let nextEventId = "";
        let previousEventId = "";

        // get index of eventId in events array
        const index = this.events.findIndex((event) => event.id === eventId);
        if (index > 0) {
          displayPreviousButton = true;
          previousEventId = this.events[index - 1].id;
        }
        if (index < this.events.length - 1) {
          displayNextButton = true;
          nextEventId = this.events[index + 1].id;
        }

        return {
          displayNextButton,
          displayPreviousButton,
          nextEventId,
          previousEventId,
        };
      },
    },
  });

  const s = innerStore();

  // init load books
  await s.loadEvents();
  await s.loadCategories();

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(innerStore, import.meta.hot));
  }
  return s;
};
