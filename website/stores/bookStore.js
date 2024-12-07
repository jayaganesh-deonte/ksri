import { defineStore, acceptHMRUpdate } from "pinia";

export const bookStore = async () => {
  // create inner store
  const innerStore = defineStore("book", {
    state: () => ({
      books: [],
    }),
    actions: {
      // load book info from json file
      async loadBooks() {
        if (this.books.length > 0) {
          return;
        }
        console.log("loading books");
        const data = await queryContent("publications", "books").findOne();
        this.books = data.body;
      },
      getBookById(id) {
        // find book from book list if not found return null
        const book = this.books.find((book) => book.id === id);
        if (book) {
          return book;
        }
        return null;
      },
    },
  });

  const s = innerStore();

  // init load books
  await s.loadBooks();

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(innerStore, import.meta.hot));
  }
  return s;
};
