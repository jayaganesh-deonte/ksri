<template>
  <div>
    <v-btn @click="downloadForm10BD" color="primary" :disabled="isDisabled">
      download form 10BD</v-btn
    >
  </div>
</template>

<script>
import $toast from "@/utilities/toast_notification";

export default {
  name: "DownloadForm10BD",
  props: {
    donationData: {
      type: Array,
      required: true,
      default: () => [],
    },
    isDisabled: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  data() {
    return {
      download: "download",
    };
  },
  methods: {
    // Function to escape CSV field to handle commas within data
    escapeCSVField(field) {
      // If the field contains commas, quotes, or newlines, wrap it in quotes
      if (
        field &&
        (field.includes(",") || field.includes('"') || field.includes("\n"))
      ) {
        // Double up any quotes within the field
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    },

    // Function to determine ID Code and Unique Identification Number
    getIdentification(donation) {
      // Check PAN first
      if (donation.panNumber && donation.panNumber.trim() !== "") {
        return {
          idCode: "Permanent Account Number",
          uniqueId: donation.panNumber,
        };
      }
      // Check Aadhar second
      else if (donation.aadharNumber && donation.aadharNumber.trim() !== "") {
        return {
          idCode: "Aadhar Card",
          uniqueId: donation.aadharNumber,
        };
      }
      // Check Passport third
      else if (
        donation.passportNumber &&
        donation.passportNumber.trim() !== ""
      ) {
        return {
          idCode: "Passport",
          uniqueId: donation.passportNumber,
        };
      }
      // Default to empty if none present
      else {
        return {
          idCode: "",
          uniqueId: "",
        };
      }
    },

    // Function to convert donation data to the required CSV format
    convertToCSV(data) {
      // Filter only COMPLETED payments
      const completedDonations = data.filter(
        (donation) => donation.paymentStatus === "COMPLETED"
      );

      // Sort by payment date (newest first)
      completedDonations.sort(
        (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
      );

      // Define the CSV header
      const header = [
        "Sl. No.",
        "Pre Acknowledgement Number",
        "ID Code",
        "Unique Identification Number",
        "Name of donor",
        "Donar Phone number",
        "Email Id",
        "Address of donor",
        "Mode of receipt",
        "Amount of donation (Indian rupees)",
      ]
        .map(this.escapeCSVField)
        .join(",");

      // Process each donation entry
      const rows = completedDonations.map((donation, index) => {
        // Format the full address
        const fullAddress = `${donation.address}, ${donation.city}, ${donation.state}, ${donation.zip}, ${donation.country}`;

        // Get identification details
        const identification = this.getIdentification(donation);

        // Create a row with the required fields
        const rowData = [
          index + 1, // Sl. No.
          donation.orderId, // Pre Acknowledgement Number
          identification.idCode, // ID Code based on available IDs
          identification.uniqueId, // Unique Identification Number based on available IDs
          donation.name,
          donation.phoneNumber,
          donation.email,
          fullAddress,
          donation.paymentMethod,
          donation.amount,
        ];

        // Escape each field to handle commas and return the joined row
        return rowData
          .map((field) => this.escapeCSVField(field.toString()))
          .join(",");
      });

      // Combine header and rows
      return header + "\n" + rows.join("\n");
    },
    downloadForm10BD() {
      try {
        //   console.log("this.donationData", JSON.stringify(this.donationData));
        const csvOutput = this.convertToCSV(this.donationData);
        // console.log(csvOutput);

        const blob = new Blob([csvOutput], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "form_10BD.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error in downloadForm10BD:", error);
        $toast.open({
          type: "error",
          position: "top-right",
          message:
            "Error in Downloading Form 10BD. Contact Administrator if error persists",
        });
      }
    },
  },
};
</script>
