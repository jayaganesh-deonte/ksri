<template>
  <v-card width="50vw" elevation="0" class="d-flex pa-4">
    <v-text-field
      v-model="formattedStartDate"
      label="Start Date"
      readonly
      @click="startDialog = true"
      variant="outlined"
      density="compact"
      class=""
      hide-details
    ></v-text-field>

    <v-dialog v-model="startDialog" max-width="400px">
      <v-card>
        <v-card-title>Select Start Date</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-date-picker
            v-model="startDate"
            @update:model-value="updateStartDate"
            :max="new Date().toISOString().split('T')[0]"
          ></v-date-picker>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="startDialog = false"
            >Cancel</v-btn
          >
          <v-btn text color="primary" @click="confirmStartDate">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-text-field
      v-model="formattedEndDate"
      label="End Date"
      readonly
      @click="endDialog = true"
      variant="outlined"
      density="compact"
      class="mx-4"
      hide-details
    ></v-text-field>

    <v-dialog v-model="endDialog" max-width="400px">
      <v-card>
        <v-card-title>Select End Date</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-date-picker
            v-model="endDate"
            @update:model-value="updateEndDate"
            :min="startDate"
            :max="new Date().toISOString().split('T')[0]"
          ></v-date-picker>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="endDialog = false">Cancel</v-btn>
          <v-btn text color="primary" @click="confirmEndDate">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data() {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    return {
      startDialog: false,
      endDialog: false,
      startDate: oneYearAgo, // Set default start date here
      endDate: today,
      formattedStartDate: this.formatDateForDisplay(oneYearAgo),
      formattedEndDate: this.formatDateForDisplay(today),
    };
  },
  //   on mounted emit event with default date range
  mounted() {
    this.emitDateRange();
  },
  methods: {
    updateStartDate() {
      // This is called when a date is selected in the picker
      console.log("Start Date selected:", this.startDate);
      // reset end date if start date is changed
      if (new Date(this.startDate) > new Date(this.endDate)) {
        this.endDate = this.startDate;
        this.formattedEndDate = this.formatDateForDisplay(
          new Date(this.endDate)
        );
      }
    },
    updateEndDate() {
      // This is called when a date is selected in the picker
      console.log("End Date selected:", this.endDate);
    },
    confirmStartDate() {
      // Format the date for display
      this.formattedStartDate = this.formatDateForDisplay(
        new Date(this.startDate)
      );
      this.startDialog = false;
      this.emitDateRange();
    },
    confirmEndDate() {
      // Format the date for display
      this.formattedEndDate = this.formatDateForDisplay(new Date(this.endDate));
      this.endDialog = false;
      this.emitDateRange();
    },
    emitDateRange() {
      const dateRange = {
        start: this.formatDateForPicker(new Date(this.startDate)),
        end: this.formatDateForPicker(new Date(this.endDate)),
      };
      console.log("Emitting dateRange:", dateRange);
      this.$emit("update:dates", dateRange);
    },
    formatDateForDisplay(date) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    },
    formatDateForPicker(date) {
      // Format date as YYYY-MM-DD using local date values to prevent timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
