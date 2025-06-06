import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "../ksri.scss";
import "../ksri-animate.scss";

import { Amplify } from "aws-amplify";

const myCustomTheme = {
  dark: false,
  colors: {
    background: "#fff",
    surface: "#FFFFFF",
    primary: "#09341C",
    secondary: "#BF641F",
    floatginButtonGreen: "#F0F5F0",
    accent: "#F0F5F0",
    darkGreen: "#091F13",
    accentGreen: "#abbe88",
    pageBackground: "#c9dfcb",
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



const awsconfig = {
  aws_project_region: "ap-south-1",
  aws_cognito_identity_pool_id: "ap-south-1:6e0bcba1-da71-4b4b-ade8-7b3714cd5d43",
  aws_cognito_region: "ap-south-1",
  aws_user_pools_id: "ap-south-1_9X5anLVhL",
  aws_user_pools_web_client_id: "7hqj8g8m525v9p0itf9hnaf08t",
  oauth: {
    domain: "ksri-prod-website.auth.ap-south-1.amazoncognito.com",
    scope: [
      "phone",
      "email",
      "openid",
      "profile",
      "aws.cognito.signin.user.admin",
    ],
    redirectSignIn: "https://preview.ksri.in/",
    redirectSignOut: "https://preview.ksri.in/",
    responseType: "code",
  },
};

// const awsconfig = {
//   aws_project_region: "ap-south-1",
//   aws_cognito_identity_pool_id: "ap-south-1:6e0bcba1-da71-4b4b-ade8-7b3714cd5d43",
//   aws_cognito_region: "ap-south-1",
//   aws_user_pools_id: "ap-south-1_9X5anLVhL",
//   aws_user_pools_web_client_id: "2iluhbeefse6k71haooc4ejm95",
//   oauth: {
//     domain: "ksri-prod-website.auth.ap-south-1.amazoncognito.com",
//     scope: [
//       "phone",
//       "email",
//       "openid",
//       "profile",
//       "aws.cognito.signin.user.admin",
//     ],
//     redirectSignIn: "http://localhost:8080/",
//     redirectSignOut: "http://localhost:8080/",
//     responseType: "code",
//   },
// };

Amplify.configure(awsconfig);

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
