// Utilities
// import logger from "@/utilities/logger";
import { defineStore } from "pinia";
import axiosInstance from "@/axios";

export const useAppStore = defineStore("app", {
  state: () => ({
    //text field rules
    rules: {
      required: (value) => !!value || "Required.",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      },
    },

    user: {},

    // user role
    isSuperAdmin: false,
    isAdmin: false,
    isReadOnlyUser: false,

    navDrawer: true,
    isLoading: false,

    // deployment status
    deploymentStatus: {},
    isDeploymentPending: false,
    isDeploymentInProgress: false,

    // interval to check deployment status
    // interval: 180000,
    interval: 90000,
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setUserRole(groups) {
      if (groups.includes("super_admin")) {
        this.isSuperAdmin = true;
      } else if (groups.includes("admin")) {
        this.isAdmin = true;
      } else {
        this.isReadOnlyUser = true;
      }
    },
    async getDeploymentStatus() {
      const apiEndpoint = "/deploy/status";
      // /deploy/status
      const response = await axiosInstance.get(apiEndpoint);
      if (response.status == 200) {
        this.deploymentStatus = response.data;
        // if deploymentStatus contains status key
        if (!Object.keys(this.deploymentStatus).includes("status")) {
          this.isDeploymentPending = false;
          this.isDeploymentInProgress = false;
          return;
        }

        if (this.deploymentStatus.status == "IN_PROGRESS") {
          this.isDeploymentInProgress = true;
        } else {
          this.isDeploymentInProgress = false;
          // this.interval = 180000;
        }
      }
    },
    async checkDeploymentStatus() {
      const apiEndpoint = "/deploy/pending";

      const response = await axiosInstance.get(apiEndpoint);
      if (response.status == 200) {
        this.deploymentStatus = response.data;
        if (this.deploymentStatus.status == "PENDING") {
          this.isDeploymentPending = true;
        }
      }
    },
    async deploy() {
      if (this.isEditDisabledForUser) {
        return;
      }

      // this.interval = 60000;

      const apiEndpoint = "/deploy";

      this.isDeploymentInProgress = true;

      const response = await axiosInstance.post(apiEndpoint, {
        metadata: {
          created_at: new Date().toISOString(),
          created_by: this.user.name,
          updated_at: new Date().toISOString(),
          updated_by: this.user.name,
        },
      });
      console.log(response);
      if (response.status == 200) {
        this.isDeploymentPending = true;
      }
    },
  },
  getters: {
    isEditDisabledForUser() {
      // return this.isReadOnlyUser;
      // if is deploy status is in progress, disable edit
      if (this.isDeploymentInProgress) {
        return true;
      }
      if (this.isReadOnlyUser) {
        return true;
      }
    },
    isDeleteDisabledForUser() {
      if (this.isDeploymentInProgress) {
        return true;
      }
      if (this.isSuperAdmin) {
        return false;
      }
      return true;
    },
  },
});
