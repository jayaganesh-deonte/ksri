<!-- src/components/PaymentForm.vue -->

<template>
  <div class="d-flex align-center justify-center">
    <v-card
      class="ma-8"
      elevation="6"
      :width="`${$device.isMobile ? '' : '70%'}`"
    >
      <v-row>
        <!-- show logo in 1st col -->
        <v-col
          cols="12"
          sm="12"
          md="6"
          class="d-flex flex-column text-center align-center"
          v-if="!$device.isMobile"
        >
          <div class="ma-4 pa-4">
            <v-img
              src="/img/ksri_logo_bw.jpg"
              width="300"
              height="300"
              alt="logo"
              class="ma-4 pa-4 mx-auto"
            />
            <div class="pa-4">
              <div class="text-center text-h4 font-weight-bold">
                The Kuppuswami Sastri Research Institute
              </div>
              <div class="text-center text-h6">
                84, Thiru vi ka Road, Mylapore,
              </div>
              <div class="text-center text-h6">
                Chennai 600 004., Tamil Nadu, India
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-card class="pa-5" color="#FCFCFC">
            <v-card-title class="text-h5 font-weight-bold">
              Contribute Now
            </v-card-title>
            <v-card-text>
              <v-form ref="donationForm">
                <!-- Donor Type Selection -->
                <div class="form-field">
                  <div class="field-label">
                    Donor Type <span class="required-marker">*</span>
                  </div>
                  <div class="field-input">
                    <v-radio-group v-model="donorType" inline>
                      <v-radio
                        label="Indian Citizen Residing in India"
                        value="indian"
                      ></v-radio>
                      <v-radio
                        label="Indian Citizen residing abroad"
                        value="nri"
                      ></v-radio>
                    </v-radio-group>
                  </div>
                </div>

                <!-- Common form fields -->
                <div
                  class="form-field"
                  v-for="field in commonFormFields"
                  :key="field.key"
                >
                  <div class="field-label">
                    {{ field.label }}
                    <span v-if="field.required" class="required-marker">*</span>
                  </div>
                  <div class="field-input">
                    <v-text-field
                      v-if="
                        field.type !== 'textarea' &&
                        field.type !== 'checkbox' &&
                        field.type !== 'date' &&
                        field.key !== 'billing_tel' &&
                        field.key !== 'billing_country' &&
                        field.key !== 'billing_state'
                      "
                      density="compact"
                      v-model="orderDetails[field.key]"
                      variant="outlined"
                      :type="field.type || 'text'"
                      :min="field.min"
                      :rules="
                        field.rules || (field.required ? requiredRule : [])
                      "
                    ></v-text-field>

                    <!-- Special handling for country selection -->
                    <v-autocomplete
                      v-else-if="field.key === 'billing_country'"
                      density="compact"
                      v-model="selectedCountry"
                      :items="countries"
                      item-title="countryName"
                      item-value="countryName"
                      return-object
                      variant="outlined"
                      :rules="field.required ? requiredRule : []"
                      @update:model-value="updateRegions"
                    ></v-autocomplete>

                    <!-- Special handling for state/region selection -->
                    <v-autocomplete
                      v-else-if="field.key === 'billing_state'"
                      density="compact"
                      v-model="orderDetails.billing_state"
                      :items="availableRegions"
                      item-title="name"
                      item-value="name"
                      variant="outlined"
                      :rules="field.required ? requiredRule : []"
                      :disabled="!selectedCountry"
                    ></v-autocomplete>

                    <!-- Special handling for mobile number -->
                    <div v-else-if="field.key === 'billing_tel'" class="d-flex">
                      <v-select
                        density="compact"
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
                        density="compact"
                        v-model="mobileNumber"
                        variant="outlined"
                        placeholder="Mobile Number"
                        :rules="mobileRules"
                        type="number"
                        maxlength="10"
                        class="flex-grow-1"
                      ></v-text-field>
                    </div>

                    <v-textarea
                      v-else-if="field.type === 'textarea'"
                      density="compact"
                      v-model="orderDetails[field.key]"
                      variant="outlined"
                      :rules="field.required ? field.rules || requiredRule : []"
                      rows="3"
                    ></v-textarea>

                    <v-text-field
                      v-else-if="field.type === 'date'"
                      density="compact"
                      v-model="orderDetails[field.key]"
                      variant="outlined"
                      type="date"
                      :rules="field.required ? field.rules || requiredRule : []"
                    ></v-text-field>
                  </div>
                </div>

                <!-- PAN field (required for both Indian and NRI) -->
                <div class="form-field">
                  <div class="field-label">
                    PAN <span class="required-marker">*</span>
                  </div>
                  <div class="field-input">
                    <v-text-field
                      density="compact"
                      v-model="orderDetails.merchant_param1"
                      variant="outlined"
                      placeholder="PAN Number"
                      :rules="panRules"
                    ></v-text-field>
                  </div>
                  <div
                    v-if="donorType === 'nri'"
                    class="text-caption text-grey mt-1"
                  >
                    If NRI Citizen does not have PAN, fill as FFFPF9999F
                  </div>
                </div>

                <!-- Aadhaar (only for Indian citizens) -->
                <div v-if="donorType === 'indian'" class="form-field">
                  <div class="field-label">
                    Aadhaar No. <span class="required-marker">*</span>
                  </div>
                  <div class="field-input">
                    <v-text-field
                      density="compact"
                      v-model="displayedAadhaar"
                      variant="outlined"
                      placeholder="Aadhaar Number"
                      :rules="aadhaarRules"
                      type="password"
                      maxlength="12"
                    ></v-text-field>
                  </div>
                </div>

                <!-- NRI ID fields -->
                <div v-if="donorType === 'nri'">
                  <div class="form-field">
                    <div class="field-label">
                      Passport Number <span class="required-marker">*</span>
                    </div>
                    <div class="field-input">
                      <v-text-field
                        density="compact"
                        v-model="orderDetails.merchant_param3"
                        variant="outlined"
                        placeholder="Passport Number"
                        :rules="passportRules"
                      ></v-text-field>
                    </div>
                  </div>

                  <div class="form-field">
                    <div class="field-label">
                      Passport Expiry Date
                      <span class="required-marker">*</span>
                    </div>
                    <div class="field-input">
                      <v-text-field
                        density="compact"
                        v-model="orderDetails.merchant_param4"
                        variant="outlined"
                        type="date"
                        :rules="requiredRule"
                      ></v-text-field>
                    </div>
                  </div>
                </div>

                <!-- checkbox for declaration -->
                <div class="form-field mt-4">
                  <v-checkbox
                    v-model="orderDetails.agree"
                    :rules="[(v) => !!v || 'You must agree to continue!']"
                  >
                    <template v-slot:label>
                      <div>
                        Declaration <span class="required-marker">*</span>:
                        <span v-if="donorType === 'indian'">
                          I am an Indian Citizen, Residing in India.
                        </span>
                        <span v-else>
                          I am Residing Abroad holding valid Indian Passport
                          (Donations to be remitted only in INR).
                        </span>
                      </div>
                    </template>
                  </v-checkbox>
                </div>
              </v-form>

              <v-alert
                text=""
                title="Donations are exempt u/s 35(1)(iii) / 80GGAof Income Tax Act..1961
                vide notification No.102/2007 (F.No 203/68/2004/ ITA-II)"
                type="info"
                variant="tonal"
                class="mt-4"
              ></v-alert>

              <v-divider class="my-4"></v-divider>

              <v-card
                class="d-flex align-center justify-space-between pa-8"
                :class="`${$device.isMobile ? 'flex-column' : 'flex-row'}`"
                color="#F7F7F7"
                elevation="0"
              >
                <!-- add amount text box -->
                <div>
                  <v-card class="pa-4 ma-4" elevation="0" variant="outlined">
                    INR {{ orderDetails.amount }}</v-card
                  >
                </div>
                <div>
                  <v-btn
                    color="primary"
                    class="ma-4"
                    @click="openAlertDialog"
                    v-if="!isLoading"
                  >
                    Pay Now
                  </v-btn>
                  <v-btn color="primary" v-else>
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </v-btn>
                </div>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-alert color="primary" class="ma-2" variant="outlined">
        * Note: KSRI has not registered under the FCRA and hence cannot accept
        donations from persons who are not Indian Citizens.
      </v-alert>
    </v-card>
    <!-- add dialog box with note -->
    <v-dialog v-model="openDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">Note:</v-card-title>
        <v-card-text class="text-h6">
          Those wishing to donate towards Corpus Fund / Endowments kindly
          contact the Institute directly. This link is only for donations
          towards research purposes and related activities.
        </v-card-text>
        <div class="d-flex justify-center align-center">
          <vue-turnstile site-key="0x4AAAAAAA_f8DfogI0a5s5t" v-model="token" />
        </div>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="
              openDialog = false;
              token = '';
            "
          >
            Close</v-btn
          >
          <!-- proceed to pay -->
          <v-btn
            color="secondary"
            variant="outlined"
            @click="processPayment"
            :disabled="!token"
          >
            Proceed to Pay</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import VueTurnstile from "vue-turnstile";
import $toast from "~/utils/toast_notification";
import countriesData from "./country.json"; // Import the countries data JSON file

export default {
  data() {
    return {
      token: "",
      donorType: "indian", // Default value - indian or nri
      openDialog: false,
      isLoading: false,
      // For mobile number input
      countryCode: { code: "+91", country: "India" },
      mobileNumber: "",
      displayedAadhaar: "", // For displaying masked Aadhaar

      // Countries and regions data
      countries: [], // Will be populated from the JSON file
      selectedCountry: null, // Selected country object
      availableRegions: [], // Populated based on selected country

      // Rules for form validation
      amountRule: [
        (v) => !!v || "Amount is required",
        (v) => v > 0 || "Amount must be greater than 0",
      ],
      requiredRule: [(v) => !!v || "Field is required"],
      emailRule: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      panRules: [
        (v) => !!v || "PAN is required",
        (v) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v) || "Invalid PAN format",
      ],
      aadhaarRules: [
        (v) => !v || /^\d{12}$/.test(v) || "Aadhaar must be 12 digits",
      ],
      mobileRules: [
        (v) => !!v || "Mobile number is required",
        (v) => /^\d{10}$/.test(v) || "Mobile number must be 10 digits",
      ],
      passportRules: [
        (v) => !!v || "Passport number is required",
        (v) =>
          /^[A-Z][0-9]{7}$/.test(v) ||
          "Invalid passport format (e.g., A1234567)",
      ],
      countryCodes: [
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
      ],
      commonFormFields: [
        {
          key: "billing_name",
          label: "Name",
          required: true,
          placeholder: "Name",
        },

        {
          key: "billing_address",
          label: "Address",
          required: true,
          placeholder: "Address",
        },
        {
          key: "billing_city",
          label: "City",
          required: true,
          placeholder: "City",
        },
        {
          key: "billing_country",
          label: "Country",
          required: true,
          placeholder: "Select Country",
        },
        {
          key: "billing_state",
          label: "State/Province",
          required: true,
          placeholder: "Select State/Province",
        },
        {
          key: "billing_zip",
          label: "Pincode/Zip Code",
          required: true,
          placeholder: "Pincode/Zip Code",
        },
        {
          key: "billing_email",
          label: "Email",
          required: true,
          placeholder: "Please enter email",
          rules: [
            (v) => !!v || "E-mail is required",
            (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
          ],
        },
        {
          key: "billing_tel",
          label: "Mobile Number",
          required: true,
          placeholder: "Please enter mobile number",
        },
        {
          key: "amount",
          label: "Amount",
          required: true,
          type: "number",
          min: 1,
          rules: [
            (v) => !!v || "Amount is required",
            (v) => v > 0 || "Amount must be greater than 0",
          ],
          placeholder: "Amount",
        },
      ],
      orderDetails: {
        billing_name: "",
        billing_email: "",
        billing_tel: "",
        billing_address: "",
        billing_city: "",
        billing_state: "",
        billing_zip: "",
        billing_country: "",
        amount: 0,
        currency: "INR",
        language: "EN",
        merchant_param1: "", // PAN Number
        merchant_param2: "", // Aadhaar number
        merchant_param3: "", // Passport number
        merchant_param4: "", // Passport expiry date
        order_id: "",
        agree: false,
      },
    };
  },
  components: { VueTurnstile },
  computed: {
    // Calculated full phone number with country code
    fullPhoneNumber() {
      return this.countryCode.code + this.mobileNumber;
    },
  },
  methods: {
    // Load countries data from JSON file
    loadCountriesData() {
      this.countries = countriesData;

      // Set India as the default country if it exists
      const india = this.countries.find(
        (country) => country.countryName === "India"
      );
      if (india) {
        this.selectedCountry = india;
        this.updateRegions();
      }
    },

    // Update regions based on selected country
    updateRegions() {
      if (this.selectedCountry && this.selectedCountry.regions) {
        this.availableRegions = this.selectedCountry.regions;
        // Reset the state value when changing country
        this.orderDetails.billing_state = "";
        // Set the country name in the order details
        this.orderDetails.billing_country = this.selectedCountry.countryName;

        // Update phone country code based on selected country
        this.updateCountryCode();
      } else {
        this.availableRegions = [];
      }
    },

    // Update country code based on selected country
    updateCountryCode() {
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

      if (
        this.selectedCountry &&
        countryMap[this.selectedCountry.countryName]
      ) {
        const code = countryMap[this.selectedCountry.countryName];
        this.countryCode =
          this.countryCodes.find((c) => c.code === code) || this.countryCode;
      }
    },

    validateIndianID() {
      // For Indian citizens, at least one of PAN or Aadhaar must be provided
      if (this.donorType === "indian") {
        const hasPAN = !!this.orderDetails.merchant_param1;
        const hasAadhaar = !!this.orderDetails.merchant_param2;

        if (!hasPAN && !hasAadhaar) {
          return "Either PAN or Aadhaar is required";
        }
      }
      return true;
    },

    // Handle Aadhaar masking immediately on input
    handleAadhaarInput(event) {
      // Store the raw value in merchant_param2
      const value = event.target.value.replace(/\D/g, "");
      this.orderDetails.merchant_param2 = value;

      // Create masked version (show only last 4 digits)
      if (value.length > 4) {
        this.displayedAadhaar = "X".repeat(value.length - 4) + value.slice(-4);
      } else {
        this.displayedAadhaar = value;
      }
    },

    async openAlertDialog() {
      // Validate form
      const { valid } = await this.$refs.donationForm.validate();
      console.log("Form validation result:", valid);

      if (!valid) {
        // show notification
        $toast.error("Please fill all mandatory fields", {
          timeout: 5000,
          position: "top-right",
        });
        return;
      }

      // Set the full phone number in the order details
      this.orderDetails.billing_tel = this.fullPhoneNumber;

      // Additional validation for donor type specific fields
      if (this.donorType === "indian") {
        const hasPAN = !!this.orderDetails.merchant_param1;
        const hasAadhaar = !!this.orderDetails.merchant_param2;

        if (!hasPAN && !hasAadhaar) {
          alert("Either PAN or Aadhaar is required for Indian citizens");
          return;
        }
      } else if (this.donorType === "nri") {
        const hasPAN = !!this.orderDetails.merchant_param1;
        const hasPassport = !!this.orderDetails.merchant_param3;
        const hasExpiry = !!this.orderDetails.merchant_param4;

        if (!hasPAN) {
          alert("PAN is required for NRI citizens");
          return;
        }

        if (!hasPassport || !hasExpiry) {
          alert("Both Passport Number and Expiry Date are required for NRIs");
          return;
        }
      }

      this.openDialog = true;
    },
    async processPayment() {
      const runtimeConfig = useRuntimeConfig();
      try {
        // validate the form again to be sure
        const { valid } = await this.$refs.donationForm.validate();
        console.log("Form validation result:", valid);
        if (!valid) {
          return;
        }

        this.isLoading = true;
        const API_URL = runtimeConfig.public.API_URL;

        // Clear irrelevant fields based on donor type
        if (this.donorType === "indian") {
          this.orderDetails.merchant_param3 = "";
          this.orderDetails.merchant_param4 = "";
        }

        // For NRIs, PAN is required but Aadhaar should be empty
        if (this.donorType === "nri") {
          this.orderDetails.merchant_param2 = "";
        }

        // generate uuid for order_id
        this.orderDetails.order_id = uuidv4();

        // init payment by sending order details to the /payments/initiatePayment
        const response = await axios.post(
          `${API_URL}/payments/initiatePayment`,
          this.orderDetails,
          {
            headers: {
              Authorization: this.token,
            },
          }
        );
        console.log("Payment initiated:", response.data);

        // get encryptedUrl from the response
        const paymentUrl = response.data.paymentUrl;
        // Redirect to the payment gateway
        window.location.href = paymentUrl;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error("Error encrypting order data:", error);
      }
    },
  },
  watch: {
    // Watch for donor type changes
    donorType(newValue) {
      if (newValue === "indian") {
        this.orderDetails.merchant_param3 = "";
        this.orderDetails.merchant_param4 = "";
      } else if (newValue === "nri") {
        this.orderDetails.merchant_param2 = "";
        this.displayedAadhaar = "";
      }
    },

    // Watch for Aadhaar input changes
    displayedAadhaar(value) {
      // Store the raw value in merchant_param2, removing any non-digit characters
      const digitsOnly = value.replace(/\D/g, "");
      this.orderDetails.merchant_param2 = digitsOnly;
    },
  },
  mounted() {
    // Initialize with empty mobile number
    this.mobileNumber = "";

    // console.log("Country", countriesData);

    // Load countries data
    this.loadCountriesData();

    // Initialize Aadhaar field for input masking
    this.$watch("displayedAadhaar", function (value) {
      // Handle Aadhaar input changes for masking logic if needed
    });
  },
};
</script>

<style scoped>
.v-container {
  max-width: 500px;
}
.required-marker {
  color: red;
  margin-left: 2px;
}
.form-field {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}
.field-label {
  font-weight: 500;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}
.field-input {
  width: 100%;
}
.country-code-select {
  min-width: 100px;
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
