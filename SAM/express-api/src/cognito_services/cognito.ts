// create user in cognito
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

interface CreateUserParams {
  name: string;
  email: string;
  group: string;
  userPoolId: string;
}

export const createUserInCognito = async (params: CreateUserParams) => {
  const { name, email, group, userPoolId } = params;

  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });

  try {
    // Create user in Cognito
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "name",
          Value: name,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
      MessageAction: "SUPPRESS", // Prevents sending welcome email
    });

    const createUserResponse = await client.send(createUserCommand);

    // Add user to group
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: email,
      GroupName: group,
    });

    await client.send(addToGroupCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User created successfully",
        userId: createUserResponse.User?.Username,
      }),
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating user",
        error: error,
      }),
    };
  }
};

// update user group remove existing group and add new group

export const updateUserGroup = async (params: {
  email: string;
  group: string;
  userPoolId: string;
}) => {
  const { email, group, userPoolId } = params;

  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });

  try {
    // Remove user from existing group
    const removeGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: email,
      GroupName: "read-only",
    });

    await client.send(removeGroupCommand);

    // Add user to new group
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: email,
      GroupName: group,
    });

    await client.send(addToGroupCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User group updated successfully",
      }),
    };
  } catch (error) {
    console.error("Error updating user group:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error updating user group",
        error: error,
      }),
    };
  }
};

// delete user from cognito

export const deleteUserFromCognito = async (params: {
  email: string;
  userPoolId: string;
}) => {
  const { email, userPoolId } = params;

  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });

  try {
    // Delete user from Cognito
    const deleteUserCommand = new AdminDeleteUserCommand({
      UserPoolId: userPoolId,
      Username: email,
    });

    await client.send(deleteUserCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User deleted successfully",
      }),
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error deleting user",
        error: error,
      }),
    };
  }
};
