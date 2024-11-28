import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "../ksri.scss";
import "../ksri-animate.scss";

const myCustomTheme = {
  dark: false,
  colors: {
    background: "#fff",
    surface: "#FFFFFF",
    primary: "#09341C",
    secondary: "#BF641F",
    accent: "#F0F5F0",
    darkGreen: "#091F13",
    accentGreen: "#abbe88",
    greenBg: "#F0F5F0",
    whiteBg: "#FAFBFA",
    gold: "#e8be5e",
    active: "#7A7369",
    accentRed: "8A2A00",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
  variables: {
    "border-color": "#000000",
    "border-opacity": 0.12,
    "high-emphasis-opacity": 0.87,
    "medium-emphasis-opacity": 0.6,
    "disabled-opacity": 0.38,
    "idle-opacity": 0.04,
    "hover-opacity": 0.04,
    "focus-opacity": 0.12,
    "selected-opacity": 0.08,
    "activated-opacity": 0.12,
    "pressed-opacity": 0.12,
    "dragged-opacity": 0.08,
    "theme-kbd": "#212529",
    "theme-on-kbd": "#FFFFFF",
    "theme-code": "#F5F5F5",
    "theme-on-code": "#000000",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "myCustomTheme",
      themes: {
        myCustomTheme,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
