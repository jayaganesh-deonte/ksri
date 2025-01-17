/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

import { PDFPlugin } from "vue3-pdfmake";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

import { Amplify } from "aws-amplify";

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import ToastPlugin from "vue-toast-notification";
// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';
import "vue-toast-notification/dist/theme-bootstrap.css";

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import { getWebInstrumentations, initializeFaro } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

// import awsconfig from "./aws-exports";
import awsconfig from "./aws-config";

Amplify.configure(awsconfig);

initializeFaro({
  url: "https://faro-collector-prod-ap-south-1.grafana.net/collect/b42066fce843aa2cd5d17ea4250eb0f4",
  app: {
    name: "ksri admin",
    version: "1.0.0",
    environment: "production",
  },
  sessionTracking: {
    samplingRate: 1,
    persistent: true,
  },
  instrumentations: [
    // Mandatory, omits default instrumentations otherwise.
    ...getWebInstrumentations(),

    // Tracing package to get end-to-end visibility for HTTP requests.
    new TracingInstrumentation(),
  ],
});
const app = createApp(App);

registerPlugins(app);

app.use(VueSweetalert2);
app.use(ToastPlugin);
app.use(PDFPlugin);

app.component("QuillEditor", QuillEditor);

app.mount("#app");
