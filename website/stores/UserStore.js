import { defineStore } from "pinia";
import {
    getCurrentUser,
    signInWithRedirect,
    fetchUserAttributes,
    fetchAuthSession,
} from "aws-amplify/auth";
import axios from "axios";
import $toast from "~/utils/toast_notification";
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { HttpRequest } from '@aws-sdk/protocol-http';

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
        async getToken() {
            const { idToken } = (await fetchAuthSession()).tokens || {};
            return idToken;
        },
        async invokeLambdaAPI(method, path, data = null) {
            // Get Cognito credentials from current session
            const session = await fetchAuthSession();

            // Extract credentials from the session
            const credentials = {
                accessKeyId: session.credentials.accessKeyId,
                secretAccessKey: session.credentials.secretAccessKey,
                sessionToken: session.credentials.sessionToken
            };

            const runtimeConfig = useRuntimeConfig();

            // Lambda function URL and CloudFront configuration
            const region = runtimeConfig.public.REGION;
            const lambdaUrlDomain = runtimeConfig.public.LAMBDA_URL_DOMAIN;
            const cloudfrontDomain = runtimeConfig.public.CLOUDFRONT_DOMAIN; // Add this to your runtimeConfig

            // Create URL for signing - use Lambda URL domain
            const signingUrl = new URL(`https://${lambdaUrlDomain}/e-v1${path}`);

            // Prepare request for signing - using Lambda URL hostname
            const request = new HttpRequest({
                hostname: signingUrl.hostname,
                path: signingUrl.pathname + signingUrl.search,
                method,
                headers: {
                    'Content-Type': data ? 'application/json' : undefined,
                    host: signingUrl.hostname, // This is important - must be Lambda URL host for signing

                },
                body: data ? JSON.stringify(data) : undefined,
            });

            // Create SigV4 signer
            const signer = new SignatureV4({
                credentials,
                region,
                service: 'lambda',
                sha256: Sha256,
            });

            // Sign the request
            const signedRequest = await signer.sign(request);

            // set url protocol to http if cloudfrontdomain is localhost
            let urlProtocol = "https"

            if (cloudfrontDomain.includes("localhost")) {
                urlProtocol = "http"
            }

            // Convert signed request to axios format and send to CloudFront
            const axiosConfig = {
                method,
                url: `${urlProtocol}://${cloudfrontDomain}/e-v1${path}`, // Send to CloudFront domain
                headers: {
                    ...signedRequest.headers,
                    // Optionally add x-forwarded-host header if needed for your setup
                    'x-forwarded-host': cloudfrontDomain,
                    // add cognito idToken
                    "x-Amz-id-Token": session.tokens?.idToken
                },
                data: data || undefined,
            };

            try {
                const response = await axios(axiosConfig);
                return response;
            } catch (error) {
                console.error('Error calling Lambda function URL via CloudFront:', error);
                throw error;
            }
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

                const response = await this.invokeLambdaAPI(
                    'GET',
                    `/userProfile/${this.userEmail}`
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
                // invokeLambdaAPI

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

                const response = await this.invokeLambdaAPI(
                    'POST',
                    `/userProfile`,
                    userProfileData
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
        },
        async checkIfBookIsBought(bookId) {
            const runtimeConfig = useRuntimeConfig();

            if (!this.isAuthenticated) {
                // $toast.error(
                //     "Please login to check your purchase status"

                // )

                return {
                    "bought": false
                };
            }

            // get email
            const email = this.userEmail;


            try {

                const response = await this.invokeLambdaAPI(
                    'GET',
                    `/ebook/${email}/${bookId}`,
                );


                if (response.status === 200) {
                    return response.data;
                } else {
                    console.error("Error fetching book purchase status:", response.status);
                    return {
                        "bought": false
                    };
                }
            } catch (error) {
                console.error("Error fetching book purchase status:", error);
                return {
                    "bought": false
                };
            }




        },
        async saveBookMarks(bookId, bookmarks) {
            const path = `/bookMark/${bookId}`

            try {
                const response = await this.invokeLambdaAPI(
                    "POST",
                    path,
                    bookmarks,
                )

                console.log("bookmark response", response)


            }
            catch (e) {
                console.error("Error fetching book purchase status:", error);

            }

        },

        async getBookMarks(bookId) {
            try {
                const response = await this.invokeLambdaAPI(
                    "GET",
                    `/bookMark/${bookId}`,
                )

                if (response.status == 200) {
                    console.log("response: ", response.data)

                    return response.data.bookMarks;
                } else if (response.status == 404) {
                    console.log("no bookmarks")
                }
                else {
                    // error toast
                    $toast.error(
                        "There was some error in fetching bookmarks. try again later",
                        {
                            timeout: 5000,
                            position: "top-right",
                        }
                    )
                }


            }
            catch (e) {
                console.error("Error fetching book purchase status:", error);

            }
        }
    },
});