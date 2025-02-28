// https://nuxt.com/docs/api/configuration/nuxt-config
import { siteSeoInfo } from "./site-seo-info";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  devServer: {
    port: 8080,
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  runtimeConfig: {
    WORKING_KEY: process.env.WORKING_KEY,
    ACCESS_CODE: process.env.ACCESS_CODE,
    MERCHANT_ID: process.env.MERCHANT_ID,
    CC_AVENUE_DOMAIN: process.env.CC_AVENUE_DOMAIN,
    REDIRECT_URL: process.env.REDIRECT_URL,
    public: {
      API_URL: "https://preview.ksri.in/public",
      // API_URL: "http://localhost:3001/public",
      CONTACT_US_URL:
        "https://k6k5z57jue2xojyecp4dvmab640dxzeb.lambda-url.ap-south-1.on.aws/",
      ASSET_DOMAIN: "https://d3dx8df9hmf5nm.cloudfront.net/",
      WORKING_KEY: process.env.WORKING_KEY,
      ACCESS_CODE: process.env.ACCESS_CODE,
      MERCHANT_ID: process.env.MERCHANT_ID,
      CC_AVENUE_DOMAIN: process.env.CC_AVENUE_DOMAIN,
      REDIRECT_URL: process.env.REDIRECT_URL,
    },
  },
  modules: [
    "@nuxt/image",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "@nuxtjs/device",
    "nuxt-aos",
    "vue3-carousel-nuxt",
    "@nuxt/fonts",
    "@pinia/nuxt",
    "nuxt-marquee",
    "@nuxt/content",
    "nuxt-gtag",
  ],
  gtag: {
    id: "G-RSDND7PK45",
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: siteSeoInfo.title,
      meta: [
        {
          name: "description",
          content: siteSeoInfo.description,
        },
        {
          name: "og:title",
          content: siteSeoInfo.ogTitle,
        },
        {
          name: "og:description",
          content: siteSeoInfo.ogDescription,
        },
        {
          name: "og:image",
          content: siteSeoInfo.ogImage,
        },
        {
          name: "og:url",
          content: siteSeoInfo.ogUrl,
        },
      ],
    },
  },
  site: {
    url: siteSeoInfo.ogUrl,
    name: siteSeoInfo.title,
  },
  robots: {
    UserAgent: "*",
    Disallow: "",
  },
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  },
  aos: {
    // Global settings:
    // disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    // startEvent: "DOMContentLoaded", // name of the event dispatched on the document, that AOS should initialize on
    // initClassName: "aos-init", // class applied after initialization
    // animatedClassName: "aos-animate", // class applied on animation
    // useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    // disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    // debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    // throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
    // // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    // // offset: 120, // offset (in px) from the original trigger point
    // delay: 1500, // values from 0 to 3000, with step 50ms
    duration: 500, // values from 0 to 3000, with step 50ms
    // easing: "ease", // default easing for AOS animations
    // once: false, // whether animation should happen only once - while scrolling down
    // mirror: false, // whether elements should animate out while scrolling past them
    // anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
  },
});
