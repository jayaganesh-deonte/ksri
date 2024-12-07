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
// import awsconfig from "./aws-exports";
import awsconfig from "./aws-config";

Amplify.configure(awsconfig);

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
