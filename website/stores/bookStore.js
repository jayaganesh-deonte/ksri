// import { defineStore } from "pinia";

// export const bookStore = defineStore("book", {
//   state: () => ({
//     books: [],
//     samskritaAcademyPublicationBooks: [],
//   }),
//   actions: {
//     // load book info from json file
//     async loadBooks() {
//       if (
//         this.books.length > 0 &&
//         this.samskritaAcademyPublicationBooks.length > 0
//       ) {
//         return;
//       }
//       console.log("loading books");
//       const data = await queryContent("publications", "books").findOne();
//       this.books = data.body;

//       // load samskrita academy publication books
//       const samskritaAcademyPublicationBooks = await queryContent(
//         "publications",
//         "samskritaacademypublications"
//       ).findOne();

//       this.samskritaAcademyPublicationBooks =
//         samskritaAcademyPublicationBooks.body;
//     },
//     getBookById(id) {
//       // find book from book & samskritaAcademyPublicationBooks list if not found return null
//       const book = this.books.find((book) => book.id === id);
//       if (book) {
//         return book;
//       }
//       const samskritaAcademyPublicationBook =
//         this.samskritaAcademyPublicationBooks.find((book) => book.id === id);
//       if (samskritaAcademyPublicationBook) {
//         return samskritaAcademyPublicationBook;
//       }
//       return null;
//     },
//   },
// });
