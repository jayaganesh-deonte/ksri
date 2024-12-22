// create user in cognito
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  AdminRemoveUserFromGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

interface CreateUserParams {
  name: string;
  email: string;
  group: string;
  userPoolId: string;
}

export const getUserFromCognito = async (params: {
  name: string;
  userPoolId: string;
}) => {
  const { name, userPoolId } = params;

  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });

  try {
    const getUserCommand = new AdminGetUserCommand({
      UserPoolId: userPoolId,
      Username: name,
    });

    const getUserResponse = await client.send(getUserCommand);

    console.log("getUserResponse", getUserResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User fetched successfully",
        user: getUserResponse.UserAttributes,
      }),
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error fetching user",
        error: error,
      }),
    };
  }
};

export const createUserInCognito = async (params: CreateUserParams) => {
  const { name, email, group, userPoolId } = params;

  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });

  try {
    // check if user exists in cognito
    const userExists = await getUserFromCognito({ name, userPoolId });

    console.log("userExists", userExists);

    if (userExists.statusCode === 200) {
      // update user group
      const updateUserGroupRes = await updateUserGroup({
        name,
        group,
        userPoolId,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "User updated successfully",
          userId: userExists.body,
        }),
      };
    }

    // Create user in Cognito
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: name,
      TemporaryPassword: "Ksri@123",
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

    console.log("createUserResponse", createUserResponse);

    // Add user to group
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: name,
      GroupName: group,
    });

    let gropRes = await client.send(addToGroupCommand);
    console.log("gropRes", gropRes);

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
  name: string;
  group: string;
  userPoolId: string;
}) => {
  const { name, group, userPoolId } = params;

  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });

  try {
    // remove user from all existing groups
    const listGroupsForUserCommand = new AdminListGroupsForUserCommand({
      UserPoolId: userPoolId,
      Username: name,
    });
    const listGroupsForUserResponse = await client.send(
      listGroupsForUserCommand
    );
    console.log("listGroupsForUserResponse", listGroupsForUserResponse);

    for (const group of listGroupsForUserResponse.Groups ?? []) {
      const removeFromGroupCommand = new AdminRemoveUserFromGroupCommand({
        UserPoolId: userPoolId,
        Username: name,
        GroupName: group.GroupName,
      });

      await client.send(removeFromGroupCommand);
    }

    // Add user to new group
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: name,
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
  name: string;
  userPoolId: string;
}) => {
  const { name, userPoolId } = params;

  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });

  try {
    // Delete user from Cognito
    const deleteUserCommand = new AdminDeleteUserCommand({
      UserPoolId: userPoolId,
      Username: name,
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
