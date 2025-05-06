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
                <div>
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

                  <EpubPreview
                    buttonText="Preview Book"
                    epubUrl="https://d3dx8df9hmf5nm.cloudfront.net/files/01JTCRZD5YA20AEGQHHRP7NNDK.epub"
                  />

                  <!-- buy ebook -->
                  <v-btn
                    rounded="pill"
                    variant="flat"
                    color="secondary"
                    @click="buyEbook(bookInfo)"
                    class="mt-1"
                  >
                    Buy E-book
                  </v-btn>
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
// get books
const getBookInfo = async () => {
  const book = getBookById(route.params.id);

  if (book == null) {
    bookNotFound.value = true;
  } else {
    bookInfo.title = book.title;
    bookInfo.subtitle = book.subtitle;
    bookInfo.price = book.price;
    bookInfo.imageUrls = book.imageUrls;
    bookInfo.details = book.details;
    bookInfo.id = book.id;
    bookInfo.available = book.available;
    bookInfo.publication = book.publication;
    bookInfo.author = book.author;
    bookInfo.yearOfPublication = book.yearOfPublication;
    bookInfo.isEbookAvailable = book.isEbookAvailable;
    bookInfo.ebookPrice = book.ebookPrice;
    bookInfo.previewEbookUrl = book.previewEbookUrl;
    bookInfo.ebookUrl = book.ebookUrl;
  }
  bookInfoFetched.value = true;

  // set isAdditionalPublication value
  isAdditionalPublication.value = bookInfo.publication != "KSRI";

  useSeoMeta({
    title: book.title,
    description: book.subtitle,
    ogTitle: book.title,
    ogDescription: book.subtitle,
    twitterTitle: book.title,
    twitterDescription: book.subtitle,
  });
};

const buyEbook = async (bookInfo) => {
  try {
    console.log("buyEbook", bookInfo);

    const store = userStore();

    // generate order id

    console.log("store.user", store.user);

    const orderParams = {
      billing_name: store.user.username,
      billing_email: store.user.email,
      billing_tel: "",
      billing_address: "",
      billing_city: "",
      billing_state: "",
      billing_zip: "",
      billing_country: "",
      amount: bookInfo.ebookPrice,
      currency: "INR",
      language: "en",

      merchant_param1: bookInfo.id,
      merchant_param2: bookInfo.title,
      merchant_param3: "",
      merchant_param4: "",

      order_id: uuidv4(),
    };

    const runtimeConfig = useRuntimeConfig();

    const API_URL = runtimeConfig.public.PURCHASE_API_URL;

    const response = await axios.post(
      `${API_URL}/purchase/api/payments/initiatePayment`,
      orderParams,
      {
        headers: {
          Authorization: "",
        },
      }
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
