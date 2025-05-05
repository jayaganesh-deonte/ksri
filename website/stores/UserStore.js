import { defineStore } from "pinia";

export const userStore = defineStore("userStore", {
    state: () => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
    }),
    getters: {
        getUser: (state) => state.user,
        getIsAuthenticated: (state) => state.isAuthenticated,
        getIsLoading: (state) => state.isLoading,
    },
    actions: {
        setUser(user) {
            this.user = user;
            this.isAuthenticated = true;
        },
        signOut() {
            this.user = null;
            this.isAuthenticated = false;
        },
        setIsLoading(isLoading) {
            this.isLoading = isLoading;
        },
    },
});