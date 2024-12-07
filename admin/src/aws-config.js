const awsmobile = {
  aws_project_region: import.meta.env.VITE_APP_AWS_REGION,
  aws_cognito_identity_pool_id: import.meta.env.VITE_APP_IDENTITY_POOL_ID,
  aws_cognito_region: import.meta.env.VITE_APP_AWS_REGION,
  aws_user_pools_id: import.meta.env.VITE_APP_USER_POOL_ID,
  aws_user_pools_web_client_id: import.meta.env.VITE_APP_APP_CLIENT_ID,
  oauth: {
    domain: import.meta.env.VITE_APP_COGNITO_DOMAIN,
    scope: [
      "phone",
      "email",
      "openid",
      "profile",
      "aws.cognito.signin.user.admin",
    ],
    redirectSignIn: import.meta.env.VITE_APP_REDIRECT_SIGN_IN_URL,
    redirectSignOut: import.meta.env.VITE_APP_REDIRECT_SIGN_OUT_URL,
    responseType: "code",
  },
};

export default awsmobile;
