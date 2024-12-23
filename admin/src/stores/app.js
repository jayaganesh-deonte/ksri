// Utilities
// import logger from "@/utilities/logger";
import { defineStore } from "pinia";
import axios from "axios";
import { getUserIdToken } from "@/services/auth";

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
      if (groups.includes("ksri_super_admin_group")) {
        this.isSuperAdmin = true;
      } else if (groups.includes("ksri_admin_group")) {
        this.isAdmin = true;
      } else {
        this.isReadOnlyUser = true;
      }
    },
    async getDeploymentStatus() {
      const apiEndpoint = import.meta.env.VITE_API_URL + "/deploy/status";
      // /deploy/status
      const idToken = getUserIdToken();
      const response = await axios.get(apiEndpoint, {
        headers: {
          Authorization: `${idToken}`,
        },
      });
      console.log(response);
      if (response.status == 200) {
        this.deploymentStatus = response.data;
        if (this.deploymentStatus.status == "IN_PROGRESS") {
          this.isDeploymentInProgress = true;
        } else {
          this.isDeploymentInProgress = false;
          // this.interval = 180000;
        }
      }
    },
    async checkDeploymentStatus() {
      const apiEndpoint = import.meta.env.VITE_API_URL + "/deploy/pending";

      const idToken = getUserIdToken();
      const response = await axios.get(apiEndpoint, {
        headers: {
          Authorization: `${idToken}`,
        },
      });
      console.log(response);
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

      const apiEndpoint = import.meta.env.VITE_API_URL + "/deploy";
      const idToken = getUserIdToken();

      this.isDeploymentInProgress = true;

      const response = await axios.post(
        apiEndpoint,
        {
          metadata: {
            created_at: new Date().toISOString(),
            created_by: this.user.name,
            updated_at: new Date().toISOString(),
            updated_by: this.user.name,
          },
        },
        {
          headers: {
            Authorization: `${idToken}`,
          },
        }
      );
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
  },
});
