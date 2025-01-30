// Example User object structure
// {
//  id: ""
//     "name":"",
//     "email": "",
//     "phoneNumber": "",
//     "group": "",
//     "displayImage": []
// }

// create model

// Valid group values are: admin, super-admin, read-only
type UserGroup = "admin" | "super_admin" | "read_only";

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  group: UserGroup;
  displayImage: string[];
  metadata?: { [key: string]: string };
}

export interface UserDDB {
  PK: string;
  SK: string;
  name: string;
  email: string;
  phoneNumber: string;
  group: UserGroup;
  displayImage: string;
  metadata?: { [key: string]: string };
}

// toDynamoDB

export function toDynamoDB(item: User): UserDDB {
  return {
    PK: "ENTITYTYPE#USER",
    SK: item.id,
    name: item.name,
    email: item.email,
    phoneNumber: item.phoneNumber,
    group: item.group,
    displayImage: item.displayImage[0],
    metadata: item.metadata,
  };
}

// fromDynamoDB

export function fromDynamoDB(item: UserDDB): User {
  return {
    id: item.SK,
    name: item.name,
    email: item.email,
    phoneNumber: item.phoneNumber,
    group: item.group,
    displayImage: [item.displayImage],
    metadata: item.metadata,
  };
}

// validateUser

export function validateUser(item: User): boolean {
  const validGroups: UserGroup[] = ["admin", "super_admin", "read_only"];
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.email === "string" &&
    // typeof item.phoneNumber === "string" &&
    validGroups.includes(item.group) &&
    // Array.isArray(item.displayImage) &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}
