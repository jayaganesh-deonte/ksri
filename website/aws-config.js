const awsmobile = {
  aws_project_region: "ap-south-1",
  aws_cognito_identity_pool_id: "ap-south-1:1546056d-7d05-4e85-8c13-82218956b9b6",
  aws_cognito_region: "ap-south-1",
  aws_user_pools_id: "ap-south-1_IoPrq435N",
  aws_user_pools_web_client_id: "hbf6b20anr1hminjre813pomn",
  oauth: {
    domain: "ksri-prod-website.auth.ap-south-1.amazoncognito.com",
    scope: [
      "phone",
      "email",
      "openid",
      "profile",
      "aws.cognito.signin.user.admin",
    ],
    redirectSignIn: "http://localhost:8080/",
    redirectSignOut: "http://localhost:8080/",
    responseType: "code",
  },
};

export default awsmobile;
