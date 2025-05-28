<template>
  <div class="d-flex justify-center align-center ma-auto my-4">
    <authenticator
      :form-fields="formFields"
      :signup-attributes="signUpAttributes"
      v-if="!getIsAuthenticated"
    >
    </authenticator>
  </div>
</template>

<script setup>
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import "@aws-amplify/ui-vue/styles.css";

const auth = useAuthenticator();

// Important: Define the signup attributes for Cognito
const signUpAttributes = ["email", "phone_number", "address", "custom:city"];

const formFields = {
  signUp: {
    username: {
      order: 1,
      label: "Username",
      placeholder: "Enter your username",
      isRequired: true,
      autocomplete: "username",
    },
    email: {
      order: 1,
      label: "Email Address",
      placeholder: "Enter your email address",
      isRequired: true,
      autocomplete: "email",
    },
    password: {
      order: 5,
      label: "Password",
      placeholder: "Create a password",
      isRequired: true,
      autocomplete: "new-password",
    },
    confirm_password: {
      order: 6,
      label: "Confirm Password",
      placeholder: "Confirm your password",
      isRequired: true,
      autocomplete: "new-password",
    },
  },
  signIn: {
    username: {
      label: "Email Address",
      placeholder: "Enter your email",
      isRequired: true,
    },
  },
};

import { userStore } from "~/stores/UserStore";

const store = userStore();
const { getIsAuthenticated } = storeToRefs(store);

// Navigate based on user status
const handleAuthenticatedNavigation = async () => {
  try {
    const isAddressAvailable = await store.checkIfAddressIsAvailable();
    if (!isAddressAvailable) {
      navigateTo("/user");
    } else {
      // get redirect from localstorage
      const redirect = localStorage.getItem("redirect");
      if (redirect) {
        localStorage.removeItem("redirect");
        navigateTo(redirect);
      } else {
        navigateTo("/");
      }
    }
  } catch (error) {
    console.error("Navigation error:", error);
    // Fallback navigation
    navigateTo("/");
  }
};

// Watch auth status changes
watch(
  () => auth.authStatus,
  async (newStatus) => {
    console.log("auth.authStatus", newStatus);
    if (newStatus === "authenticated") {
      // Small delay to ensure auth is fully established
      await nextTick();
      await handleAuthenticatedNavigation();
    }
  }
);

// Alternative: Watch your store's authentication state
watch(
  () => getIsAuthenticated.value,
  async (isAuth) => {
    console.log("Store isAuthenticated changed:", isAuth);
    if (isAuth) {
      await nextTick();
      await handleAuthenticatedNavigation();
    }
  }
);

onMounted(async () => {
  // Check if already authenticated on mount
  if (getIsAuthenticated.value) {
    await handleAuthenticatedNavigation();
  }
});
</script>

<style scoped>
/* Ensure proper styling */
:deep(.amplify-authenticator) {
  width: 100%;
  max-width: 400px;
}

:deep(.amplify-tabs-item[data-value="Sign up"]) {
  /* Ensure sign up tab is visible */
}
</style>
