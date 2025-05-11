import { defineStore } from "pinia";
import axios from "axios";

export const userStore = defineStore("userStore", {
    state: () => ({
        user: null,
        userName: null,
        userEmail: null,
        isAuthenticated: false,
        isLoading: false,
        contactDetails: {
            phoneNumber: null,
            address: null,
            city: null,
            state: null,
            zip: null,
            country: null,
        },
        profileLoading: false,
    }),
    getters: {
        getUser: (state) => state.user,
        getIsAuthenticated: (state) => state.isAuthenticated,
        getIsLoading: (state) => state.isLoading,
        isProfileLoading: (state) => state.profileLoading,
    },
    actions: {
        setUser(user) {
            this.user = user;
            this.isAuthenticated = true;
        },
        signOut() {
            this.user = null;
            this.isAuthenticated = false;
            // Clear contact details when signing out
            this.clearContactDetails();
        },
        setIsLoading(isLoading) {
            this.isLoading = isLoading;
        },
        getToken() {
            return "token";
        },
        async checkIfAddressIsAvailable() {


            if (this.contactDetails.address && this.contactDetails.city && this.contactDetails.state && this.contactDetails.zip && this.contactDetails.country) {
                return true;
            } else {
                // fetch the address from the API
                await this.fetchUserProfile();

                // Check if the address is available
                if (this.contactDetails.address && this.contactDetails.city && this.contactDetails.state && this.contactDetails.zip && this.contactDetails.country) {
                    return true;
                }

                return false;
            }
        },
        clearContactDetails() {
            this.contactDetails = {
                phoneNumber: null,
                address: null,
                city: null,
                state: null,
                zip: null,
                country: null,
            };
        },
        // New action to fetch user profile
        async fetchUserProfile() {
            if (!this.userEmail) {
                console.error("Cannot fetch profile: User email is not available");
                return false;
            }

            try {
                this.profileLoading = true;
                const runtimeConfig = useRuntimeConfig();

                const response = await axios.get(
                    `${runtimeConfig.public.PURCHASE_API_URL}/userProfile/${this.userEmail}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.getToken(),
                        },
                    }
                );

                if (response.status === 200) {
                    const data = response.data;

                    // Update contactDetails with fetched data
                    this.contactDetails = {
                        phoneNumber: data.phoneNumber || null,
                        address: data.address || null,
                        city: data.city || null,
                        state: data.state || null,
                        zip: data.zip || null,
                        country: data.country || null,
                    };

                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error fetching user profile:", error);
                return false;
            } finally {
                this.profileLoading = false;
            }
        },
        // New action to save user profile
        async saveUserProfile(profileData) {
            if (!this.userEmail) {
                console.error("Cannot save profile: User email is not available");
                return { success: false, message: "User email is not available" };
            }

            try {
                this.profileLoading = true;
                const runtimeConfig = useRuntimeConfig();

                const userProfileData = {
                    ...profileData,
                    email: this.userEmail,
                    name: this.userName,
                };

                const response = await axios.post(
                    `${runtimeConfig.public.PURCHASE_API_URL}/userProfile`,
                    userProfileData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.getToken(),
                        },
                    }
                );

                if (response.status === 200) {
                    // Update contactDetails with saved data
                    this.contactDetails = {
                        phoneNumber: profileData.phoneNumber || null,
                        address: profileData.address || null,
                        city: profileData.city || null,
                        state: profileData.state || null,
                        zip: profileData.zip || null,
                        country: profileData.country || null,
                    };

                    return { success: true, message: "Profile updated successfully" };
                }

                return {
                    success: false,
                    message: response.data?.message || "Failed to update profile"
                };
            } catch (error) {
                console.error("Error saving user profile:", error);
                return {
                    success: false,
                    message: "Unable to connect to the server"
                };
            } finally {
                this.profileLoading = false;
            }
        }
    },
});