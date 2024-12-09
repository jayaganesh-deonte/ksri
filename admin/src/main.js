/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

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

// import awsconfig from "./aws-exports";
import awsconfig from "./aws-config";

Amplify.configure(awsconfig);

const app = createApp(App);

registerPlugins(app);

app.use(VueSweetalert2);
app.use(ToastPlugin);

app.mount("#app");
