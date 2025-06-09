<template>
  <div>
    <v-container v-if="store.isAuthenticated">
      <v-card class="pa-4">
        <v-card-title class="text-h5 mb-4">User Profile</v-card-title>

        <!-- Loading overlay -->
        <v-overlay v-if="store.profileLoading" contained absolute>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-overlay>

        <!-- User Information Section -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="userProfile.name"
              label="Full Name"
              variant="outlined"
              density="comfortable"
              :rules="[(v) => !!v || 'Full Name is required']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="store.userEmail"
              label="Email"
              readonly
              variant="outlined"
              density="comfortable"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Address Information Section -->
        <v-card-subtitle class="text-subtitle-1 pt-4 pb-2"
          >Address Information</v-card-subtitle
        >
        <v-form ref="form" v-model="formValid">
          <v-row>
            <v-col cols="12" md="6">
              <!-- Phone number with country code -->
              <div class="d-flex">
                <v-select
                  density="comfortable"
                  variant="outlined"
                  v-model="countryCode"
                  :items="countryCodes"
                  item-title="code"
                  item-value="code"
                  return-object
                  class="country-code-select"
                  style="width: 120px; margin-right: 8px"
                ></v-select>
                <v-text-field
                  density="comfortable"
                  v-model="mobileNumber"
                  label="Phone Number"
                  variant="outlined"
                  :rules="mobileRules"
                  type="number"
                  maxlength="10"
                  class="flex-grow-1"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="userProfile.address"
                label="Street Address"
                :rules="[(v) => !!v || 'Address is required']"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="userProfile.city"
                label="City"
                :rules="[(v) => !!v || 'City is required']"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                density="comfortable"
                v-model="userProfile.state"
                :items="availableRegions"
                item-title="name"
                item-value="name"
                label="State/Province"
                variant="outlined"
                :rules="[(v) => !!v || 'State is required']"
                :disabled="!selectedCountry"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="userProfile.zip"
                label="ZIP/Postal Code"
                :rules="[(v) => !!v || 'ZIP code is required']"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                density="comfortable"
                v-model="selectedCountry"
                :items="countries"
                item-title="countryName"
                item-value="countryName"
                return-object
                label="Country"
                variant="outlined"
                :rules="[(v) => !!v || 'Country is required']"
                @update:model-value="updateRegions"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <div class="d-flex justify-end mt-4">
            <v-btn
              color="primary"
              @click="saveProfile"
              :loading="saving"
              :disabled="!formValid"
            >
              Save Profile
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from "vue";
import $toast from "~/utils/toast_notification";
import countriesData from "~/components/country.json";

definePageMeta({
  middleware: ["authenticated"],
});

import { userStore } from "~/stores/UserStore";
const store = userStore();

const formValid = ref(false);
const form = ref(null);
const saving = ref(false);

// Phone number related data
const countryCode = ref({ code: "+91", country: "India" });
const mobileNumber = ref("");
const mobileRules = [
  (v) => !!v || "Mobile number is required",
  (v) => /^\d{10}$/.test(v) || "Mobile number must be 10 digits",
];

// Countries and regions data
const countries = ref([]);
const selectedCountry = ref(null);
const availableRegions = ref([]);

// Country codes list
const countryCodes = ref([
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+65", country: "Singapore" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+60", country: "Malaysia" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
]);

// Define the user profile with the required API structure
const userProfile = reactive({
  phoneNumber: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
});

// Fetch user profile and load country data on component mount
onMounted(async () => {
  loadCountriesData();
  await initializeUserProfile();

  const isAddressIsAvailable = await store.checkIfAddressIsAvailable();

  console.log("isAddressIsAvailable user profile", isAddressIsAvailable);

  // check if in local storage redirect key is present
  if (isAddressIsAvailable) {
    // get previous page url from history
    const previousPage = window.history.state.back;
    console.log("previousPage", previousPage);

    // if previous page contains login then navigate to /
    if (previousPage && previousPage.includes("/login")) {
      window.location.href = "/";
    }

    const redirect = localStorage.getItem("redirect");
    console.log("redirect", redirect);
    if (redirect) {
      localStorage.removeItem("redirect");
      localStorage.removeItem("redirectedFrom");
      window.location.href = redirect;
    }

    const redirectedFrom = localStorage.getItem("redirectedFrom");
    console.log("redirectedFrom", redirectedFrom);

    if (redirectedFrom == "/login") {
      localStorage.removeItem("redirect");
      localStorage.removeItem("redirectedFrom");
      window.location.href = "/";
    }
  }
});

// Initialize user profile - fetches from API if needed and sets up the form
async function initializeUserProfile() {
  // Fetch the user profile from the store
  await store.fetchUserProfile();

  // Update the local reactive object with fetched data from store
  if (store.contactDetails) {
    // Copy contact details from store
    userProfile.address = store.contactDetails.address || "";
    userProfile.city = store.contactDetails.city || "";
    userProfile.state = store.contactDetails.state || "";
    userProfile.zip = store.contactDetails.zip || "";
    userProfile.country = store.contactDetails.country || "";
    userProfile.name = store.contactDetails.name || "";

    // Handle phone number with country code if it exists
    if (store.contactDetails.phoneNumber) {
      // split with - to separate country code and number
      const [code, number] = store.contactDetails.phoneNumber.split("-");
      mobileNumber.value = number || "";
      countryCode.value =
        countryCodes.value.find((c) => c.code === code) || countryCode.value;
    }

    // Handle country and region selection if country exists in data
    if (store.contactDetails.country) {
      const country = countries.value.find(
        (c) => c.countryName === store.contactDetails.country
      );
      if (country) {
        selectedCountry.value = country;
        updateRegions();

        // If state exists in data, make sure it's in the available regions
        if (store.contactDetails.state) {
          const stateExists = availableRegions.value.some(
            (region) => region.name === store.contactDetails.state
          );
          if (!stateExists) {
            // If state doesn't exist in regions, we keep the value but should inform user
            console.warn(
              `State "${store.contactDetails.state}" not found in ${store.contactDetails.country} regions`
            );
          }
        }
      }
    }
  }
}

// Load countries data from JSON file
function loadCountriesData() {
  countries.value = countriesData;

  // Set a default country if available (e.g., India)
  const india = countries.value.find(
    (country) => country.countryName === "India"
  );
  if (india && !selectedCountry.value) {
    selectedCountry.value = india;
    updateRegions();
  }
}

// Update regions based on selected country
function updateRegions() {
  if (selectedCountry.value && selectedCountry.value.regions) {
    availableRegions.value = selectedCountry.value.regions;
    // Set the country name in the user profile
    userProfile.country = selectedCountry.value.countryName;

    // Update phone country code based on selected country
    updateCountryCode();
  } else {
    availableRegions.value = [];
  }
}

// watch for changes in selected country
watch(selectedCountry, (newVal, oldValue) => {
  if (newVal && oldValue != null) {
    // reset region value
    userProfile.state = null;
  }
});

// Update country code based on selected country
function updateCountryCode() {
  const countryMap = {
    India: "+91",
    "United States": "+1",
    "United Kingdom": "+44",
    Australia: "+61",
    Singapore: "+65",
    "United Arab Emirates": "+971",
    "Saudi Arabia": "+966",
    Malaysia: "+60",
    Germany: "+49",
    France: "+33",
  };

  if (selectedCountry.value && countryMap[selectedCountry.value.countryName]) {
    const code = countryMap[selectedCountry.value.countryName];
    countryCode.value =
      countryCodes.value.find((c) => c.code === code) || countryCode.value;
  }
}

// Computed property for full phone number
const fullPhoneNumber = computed(() => {
  return countryCode.value.code + "-" + mobileNumber.value;
});

// Save the user profile to the API using the store
async function saveProfile() {
  if (!form.value.validate()) {
    $toast.error("Please fill all the required fields", {
      timeout: 5000,
      position: "top-right",
    });
    return;
  }

  try {
    saving.value = true;

    // Set the full phone number with country code in the profile data
    userProfile.phoneNumber = fullPhoneNumber.value;

    // Ensure country is set from selectedCountry
    if (selectedCountry.value) {
      userProfile.country = selectedCountry.value.countryName;
    }

    // Use the store to save the profile
    const result = await store.saveUserProfile({
      ...userProfile,
    });

    if (result.success) {
      $toast.success(result.message, {
        timeout: 5000,
        position: "top-right",
      });
      // wait for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // check if in local storage redirect key is present
      if (process.client) {
        const redirect = localStorage.getItem("redirect");
        if (redirect) {
          localStorage.removeItem("redirect");
          window.location.href = redirect;
        } else {
          window.location.href = "/";
        }
      }
    } else {
      $toast.error(result.message, {
        timeout: 5000,
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Error in save profile flow:", error);
    $toast.error("An unexpected error occurred", {
      timeout: 5000,
      position: "top-right",
    });
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.country-code-select {
  min-width: 100px;
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
