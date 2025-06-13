<template>
  <div>
    <div v-if="!bookInfoFetched" class="d-flex justify-center ma-6">
      <!-- show loader -->
      <v-progress-circular
        size="100"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    <div v-else>
      <!-- display book details -->
      <!-- two cols, 1st col with image as carousel, 2nd col with book details, title, subtitle, price and then details -->
      <div v-if="bookNotFound" class="d-flex justify-center ma-6">
        <!-- 404 component -->
        <div class="d-flex flex-column justify-center align-center">
          <div class="text-h1 text-secondary">404</div>
          <div class="text-h4 text-secondary">Book Not Found</div>
          <div class="text-body-1 text-secondary">
            The book you are looking for does not exist.
          </div>
          <div class="d-flex justify-center ma-4">
            <v-btn
              rounded="pill"
              variant="outlined"
              color="primary"
              to="/ksri-publications/books/"
            >
              Back to Catalogue
            </v-btn>
          </div>
        </div>
      </div>
      <div class="ma-4" v-else>
        <div class="d-flex justify-center ma-4">
          <v-btn
            rounded="pill"
            variant="flat"
            color="primary"
            to="/ksri-publications/books/"
            v-if="!isAdditionalPublication"
          >
            Back to Catalogue
          </v-btn>
          <v-btn
            rounded="pill"
            variant="flat"
            color="primary"
            to="/ksri-publications/"
            v-else
          >
            Back to Publications
          </v-btn>
        </div>
        <v-row>
          <v-col cols="12" md="6" data-aos="fade-right">
            <v-carousel
              hide-delimiters
              hide-delimiter-background
              show-arrows-on-hover
            >
              <template v-if="bookInfo.imageUrls">
                <v-carousel-item
                  v-for="imageUrl in bookInfo.imageUrls"
                  :key="imageUrl"
                >
                  <v-img :src="getImageUrl(imageUrl)" fit></v-img>
                </v-carousel-item>
              </template>
              <template v-else>
                <v-carousel-item>
                  <v-img src="/img/ksri-logo.png" fit></v-img>
                </v-carousel-item>
              </template>
            </v-carousel>
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="d-flex flex-column justify-space-around"
          >
            <div>
              <div
                class="text-h5 text-secondary font-weight-bold"
                data-aos="fade-left"
                data-aos-delay="100"
              >
                {{ bookInfo.title }}
              </div>
              <div
                class="text-h6 font-weight-bold"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                {{ bookInfo.subtitle }}
              </div>
              <div
                class="text-h6 text-secondary font-weight-bold"
                data-aos="fade-left"
                data-aos-delay="300"
                v-if="
                  bookInfo.price &&
                  bookInfo.price != '' &&
                  bookInfo.price != '0' &&
                  bookInfo.price != '0.00'
                "
              >
                Price: {{ bookInfo.price }}
              </div>
              <!-- author -->
              <div
                class="text-h6 font-weight-bold"
                data-aos="fade-left"
                data-aos-delay="300"
                v-if="bookInfo.author"
              >
                Author:
                <span class="text-secondary">
                  {{ bookInfo.author }}
                </span>
              </div>
              <!-- year of publication -->
              <div
                class="text-h6 text-primary my-4 font-weight-bold"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                Year of Publication:
                <span class="text-secondary">
                  {{ getYearFromDate(bookInfo.yearOfPublication) }}
                </span>
              </div>

              <!-- Ebook details -->

              <div
                class="text-h6 text-primary my-4 font-weight-bold"
                data-aos="fade-left"
                data-aos-delay="300"
                v-if="bookInfo.isEbookAvailable == 'Yes'"
              >
                <div
                  v-if="
                    bookInfo.ebookPrice &&
                    bookInfo.ebookPrice != '' &&
                    bookInfo.ebookPrice != '0' &&
                    bookInfo.ebookPrice != '0.00'
                  "
                >
                  E-book Price:
                  <span class="text-secondary">
                    ₹{{ bookInfo.ebookPrice }}
                  </span>
                </div>

                <!-- button to preview ebook -->
                <div class="mt-2">
                  <!-- <v-btn
                    rounded="pill"
                    variant="flat"
                    color="primary"
                    :href="bookInfo.previewEbookUrl"
                    target="_blank"
                  >
                    Preview E-book
                  </v-btn> -->

                  <PreviewBookReader :bookInfo="bookInfo" />

                  <!-- buy ebook -->

                  <bookReader :book-info="bookInfo" />
                </div>
              </div>

              <div
                class="text-start pa-0 mt-5 text-danger"
                v-if="bookInfo.available != 'Yes'"
                data-aos-delay="400"
              >
                <v-chip color="error" label outlined rounded="pill">
                  Out of Stock
                </v-chip>
              </div>
            </div>
            <div
              class="text-body-1 font-weight-bold"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <!-- {{ bookInfo.details }} -->
              <div v-html="bookInfo.details"></div>
            </div>

            <!-- keywords -->
            <div>
              <div class="text-h6 text-primary font-weight-bold">Keywords:</div>
              <div class="text-body-1">{{ bookInfo.keywords }}</div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~/stores/UserStore";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import $toast from "~/utils/toast_notification";

// definePageMeta({
//   middleware: ["authenticated"],
// });

const additionalPublicationsData = await queryContent(
  "publications",
  "additionalpublications"
).findOne();
const additionalPublications = additionalPublicationsData.body;
console.log("additionalPublications", additionalPublications);

let isAdditionalPublication = ref(false);

let additionalPublicationBooks = {};

// for additionalPublications query content
for (const element of additionalPublications) {
  const additionalPublication = element;

  const publicationNameForFile = additionalPublication
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

  // query content
  const additionalPublicationBooksData = await queryContent(
    "publications",
    publicationNameForFile
  ).findOne();

  additionalPublicationBooks[additionalPublication] =
    additionalPublicationBooksData.body;
}

const booksData = await queryContent("publications", "books").findOne();

const ksriBooks = booksData.body;

additionalPublicationBooks["KSRI"] = ksriBooks;

// let books = reactive([...ksriBooks, ...samskritaAcademyPublications]);

let books = reactive([]);

for (const [publication, publicationBooks] of Object.entries(
  additionalPublicationBooks
)) {
  books.push(...publicationBooks);
}

onMounted(async () => {
  getBookInfo();
});

// get book id from route
const route = useRoute();

const bookInfoFetched = ref(false);

const bookNotFound = ref(false);

const bookInfo = reactive({
  title: "",
  subtitle: "",
  price: "",
  imageUrls: "",
  details: "",
  id: "",
  available: "",
  publication: "",
  yearOfPublication: "",
});
const getBookById = (id) => {
  // find book from book & samskritaAcademyPublicationBooks list if not found return null
  const book = books.find((book) => book.id === id);
  if (book) {
    return book;
  }
  return null;
};
// Assuming getBookById, route, bookNotFound, bookInfo, bookInfoFetched, isAdditionalPublication are defined elsewhere as in your original code.
// import { useHead, useSeoMeta } from '#imports'; // Or however Nuxt 3 handles auto-imports for these

const getBookInfo = async () => {
  const bookId = route.params.id; // It's good practice to get it once
  const book = getBookById(bookId);

  if (book == null) {
    bookNotFound.value = true;
  } else {
    bookInfo.title = book.title;
    bookInfo.subtitle = book.subtitle;
    bookInfo.price = book.price; // Ensure this is a number
    bookInfo.imageUrls = book.imageUrls;
    bookInfo.details = book.details;
    bookInfo.id = book.id; // This seems to be your internal ID
    bookInfo.available = book.available;
    bookInfo.isEbookAvailable = book.isEbookAvailable;
    bookInfo.ebookPrice = book.ebookPrice;
    bookInfo.previewEbookUrl = book.previewEbookUrl;
    bookInfo.ebookUrl = book.ebookUrl;
    bookInfo.keywords = book.keywords;

    bookInfo.publication = book.publication; // Publisher name
    bookInfo.author = book.author; // Author name
    bookInfo.yearOfPublication = book.yearOfPublication; // Ensure YYYY or YYYY-MM-DD

    // --- Enhancements for Structured Data ---
    // Attempt to construct a canonical URL for the book page. Adjust this to your actual URL structure.
    // Option 1: If your book object has a direct URL property
    const canonicalUrl =
      book.url || `http:/ksri.in/ksri-publications/books/${book.id}`; // Fallback, replace with your actual domain and path

    // A more descriptive text for the book.
    // Prioritize a dedicated description field if available, then details, then subtitle.
    const bookDescription =
      book.details + " " + book.subtitle + " " + book.keywords;

    const bookSchemaData = {
      "@context": "https://schema.org",
      "@type": "Book",
      "@id": canonicalUrl, // Unique ID for the book, often its URL
      url: canonicalUrl, // Canonical URL of the book page
      name: book.title,
      description: bookDescription, // Use a more comprehensive description
      author: {
        "@type": "Person", // Or "Organization" if the author is an org
        name: book.author,
        // Optionally, add a URL for the author if you have author pages
        // "url": `https://yourwebsite.com/authors/${book.author.toLowerCase().replace(/\s+/g, '-')}`
      },
      publisher: {
        "@type": "Organization",
        name: book.publication,
        // Optionally, add a URL for the publisher if you have publisher pages
        // "url": `https://yourwebsite.com/publishers/${book.publication.toLowerCase().replace(/\s+/g, '-')}`
      },
      datePublished: book.yearOfPublication, // Ensure YYYY or YYYY-MM-DD format
      image:
        book.imageUrls && book.imageUrls.length > 0
          ? book.imageUrls[0] // Ensure this is an absolute URL
          : null,
      isbn: book.isbn || null, // **Highly Recommended: Add ISBN if available**
      offers: {
        "@type": "Offer",
        url: canonicalUrl, // URL for this specific offer, usually the book page itself
        price: String(book.price), // Price should be a string or number. Google often prefers string. Ensure it's just the number.
        priceCurrency: "INR",
        availability: book.available
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        // If you have a specific seller, you can add:
        // "seller": {
        //   "@type": "Organization",
        //   "name": "Your Bookstore Name"
        // }
      },
      // Optionally, if your book has editions:
      // "bookEdition": "Hardcover", // or "Paperback", "Ebook", etc.
      // "numberOfPages": book.numberOfPages || null,
      // "inLanguage": book.language || "en", // e.g., "en" for English
    };

    // Remove null/undefined values from schema to keep it clean
    Object.keys(bookSchemaData).forEach((key) => {
      if (bookSchemaData[key] === null || bookSchemaData[key] === undefined) {
        delete bookSchemaData[key];
      }
      if (
        typeof bookSchemaData[key] === "object" &&
        bookSchemaData[key] !== null
      ) {
        Object.keys(bookSchemaData[key]).forEach((subKey) => {
          if (
            bookSchemaData[key][subKey] === null ||
            bookSchemaData[key][subKey] === undefined
          ) {
            delete bookSchemaData[key][subKey];
          }
        });
        if (
          Object.keys(bookSchemaData[key]).length === 1 &&
          bookSchemaData[key]["@type"]
        ) {
          // Remove empty typed objects
          if (key === "author" || key === "publisher" || key === "offers") {
            // only if name/price is missing for these critical ones
            if (!bookSchemaData[key].name && !bookSchemaData[key].price) {
              delete bookSchemaData[key];
            }
          }
        }
      }
    });

    useHead({
      title: book.title, // Set the page title here as well if not done by useSeoMeta effectively
      script: [
        {
          hid: "schema-org-book", // Unique ID for this script tag
          type: "application/ld+json",
          innerHTML: JSON.stringify(bookSchemaData),
        },
      ],
      // You might also want to add canonical link directly in useHead if not handled elsewhere
      link: [
        {
          rel: "canonical",
          href: canonicalUrl,
        },
      ],
    });

    useSeoMeta({
      title: book.title,
      description: bookDescription, // Use the same enhanced description
      ogTitle: book.title,
      ogDescription: bookDescription,
      ogImage:
        book.imageUrls && book.imageUrls.length > 0 ? book.imageUrls[0] : null, // Ensure absolute URL
      ogUrl: canonicalUrl,
      twitterTitle: book.title,
      twitterDescription: bookDescription,
      twitterImage:
        book.imageUrls && book.imageUrls.length > 0 ? book.imageUrls[0] : null, // Ensure absolute URL
      twitterCard: "summary_large_image",
    });
  }

  bookInfoFetched.value = true;
  isAdditionalPublication.value = bookInfo.publication !== "KSRI"; // Assuming bookInfo.publication is set
};

const buyEbook = async (bookInfo) => {
  try {
    console.log("buyEbook", bookInfo);

    const store = userStore();

    // generate order id

    // checkIfAddressIsAvailable
    const isAddressAvailable = await store.checkIfAddressIsAvailable();

    if (!isAddressAvailable) {
      // show toast asking to update address

      $toast.error("Address details are not updated", {
        timeout: 5000,
        position: "top-right",
      });

      // navigate to /user profile page
      setTimeout(() => {
        window.location.href = "/user";
      }, 2000);

      return;
    }

    const orderParams = {
      billing_name: store.contactDetails.name,
      billing_email: store.userEmail,
      billing_tel: store.contactDetails.phoneNumber,
      billing_address: store.contactDetails.address,
      billing_city: store.contactDetails.city,
      billing_state: store.contactDetails.state,
      billing_zip: store.contactDetails.zipCode,
      billing_country: store.contactDetails.country,
      amount: bookInfo.ebookPrice,
      currency: "INR",
      language: "en",

      merchant_param1: bookInfo.id,
      merchant_param2: bookInfo.title,
      merchant_param3: "",
      merchant_param4: "",

      order_id: uuidv4(),
    };

    const response = await store.invokeLambdaAPI(
      "POST",
      `/purchase/api/payments/initiatePayment`,
      orderParams
    );

    console.log("response", response);
    console.log("Payment initiated:", response.data);
    // get encryptedUrl from the response
    const paymentUrl = response.data.paymentUrl;

    console.log("paymentUrl", paymentUrl);
    // Redirect to the payment gateway
    window.location.href = paymentUrl;
    // open in new tab

    // window.open(paymentUrl, "_blank");
  } catch (error) {
    console.error("Error initiating payment:", error);
    // Handle error (e.g., show an error message to the user)
  }
};

const getImageUrl = (url) => {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.public.ASSET_DOMAIN + url;
};
</script>
