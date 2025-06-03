<template>
  <div class="d-flex justify-center align-center ma-auto my-4">
    <authenticator
      :services="services"
      v-if="!getIsAuthenticated"
      :initial-state="'signIn'"
      :login-mechanisms="['email']"
    >
      <template v-slot:sign-up-fields>
        <authenticator-sign-up-form-fields />
      </template>
      <template v-slot:sign-up-footer>
        <div class="password-rules">
          <p>Password must:</p>
          <ul>
            <li>Be at least 8 characters long</li>
            <li>Contain at least one uppercase letter</li>
            <li>Contain at least one lowercase letter</li>
            <li>Contain at least one number</li>
            <li>Contain at least one special character</li>
          </ul>
        </div>
      </template>
    </authenticator>
  </div>
</template>

<script setup>
import {
  Authenticator,
  useAuthenticator,
  AuthenticatorSignUpFormFields,
} from "@aws-amplify/ui-vue";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import "@aws-amplify/ui-vue/styles.css";
import { storeToRefs } from "pinia";
import { watch, nextTick, onMounted } from "vue";
import $toast from "~/utils/toast_notification";

const auth = useAuthenticator();

// Fixed: Only include attributes that are properly configured in Cognito
// Since your Cognito is configured to use email as username, we don't need separate username field
const signUpAttributes = ["email"];

// Services for validation
const services = {
  validateCustomSignUp: (formData) => {
    // Password validation logic
    if (formData.password.length < 8) {
      return {
        password: "Password must be at least 8 characters",
      };
    }

    // Check for required complexity
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      formData.password
    );

    const validationErrors = {};

    if (!hasUpperCase) {
      validationErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!hasLowerCase) {
      validationErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!hasNumbers) {
      validationErrors.password = "Password must contain at least one number";
    } else if (!hasSpecialChar) {
      validationErrors.password =
        "Password must contain at least one special character";
    }

    // Check if passwords match
    if (formData.password !== formData.confirm_password) {
      validationErrors.confirm_password = "Passwords do not match";
    }

    return validationErrors;
  },
};

// Fixed: Align form fields with Cognito configuration
const formFields = {
  signUp: {
    // Remove separate username field since Cognito uses email as username
    email: {
      order: 1,
      label: "Email Address",
      placeholder: "Enter your email address",
      isRequired: true,
      autocomplete: "email",
    },
    password: {
      order: 2,
      label: "Password",
      placeholder: "Create a password",
      isRequired: true,
      autocomplete: "new-password",
      minLength: 8,
    },
    confirm_password: {
      order: 3,
      label: "Confirm Password",
      placeholder: "Confirm your password",
      isRequired: true,
      autocomplete: "new-password",
    },
  },
  signIn: {
    email: {
      label: "Email Address",
      placeholder: "Enter your email",
      isRequired: true,
      autocomplete: "email",
    },
    password: {
      label: "Password",
      placeholder: "Enter your password",
      isRequired: true,
      autocomplete: "current-password",
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
    console.log("isAddressAvailable login", isAddressAvailable);
    navigateTo("/user");
    // if (!isAddressAvailable) {
    //   localStorage.setItem("redirectedFrom", "/login");
    //   navigateTo("/user");
    // } else {
    //   // get redirect from localstorage
    //   const redirect = localStorage.getItem("redirect");
    //   if (redirect) {
    //     localStorage.removeItem("redirect");
    //     navigateTo(redirect);
    //   } else {
    //     navigateTo("/");
    //   }
    // }
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
      // toast
      $toast.success("Logged In successfully", {
        timeout: 2000,
        position: "top-right",
      });
      // Small delay to ensure auth is fully established
      await nextTick();
      await handleAuthenticatedNavigation();
    }
  }
);

// // Alternative: Watch your store's authentication state
// watch(
//   () => getIsAuthenticated.value,
//   async (isAuth) => {
//     console.log("Store isAuthenticated changed:", isAuth);
//     if (isAuth) {
//       await nextTick();
//       await handleAuthenticatedNavigation();
//     }
//   }
// );

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

:deep(.password-rules) {
  margin-top: 20px;
  font-size: 14px;
  color: #545b64;
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
}

:deep(.password-rules ul) {
  padding-left: 20px;
  margin-top: 5px;
}

:deep(.password-rules li) {
  margin-bottom: 3px;
}

:deep(.amplify-alert--error) {
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
