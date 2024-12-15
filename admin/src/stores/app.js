// Utilities
// import logger from "@/utilities/logger";
import { defineStore } from "pinia";

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
  },
  getters: {
    isEditDisabledForUser() {
      return this.isReadOnlyUser;
    },
  },
});
