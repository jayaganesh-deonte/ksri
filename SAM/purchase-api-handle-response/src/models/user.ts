export interface User {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface UserDDB {
  PK: string;
  SK: string;
  entityType: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export function validateUserDDB(item: UserDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.name === "string" &&
    typeof item.email === "string" &&
    typeof item.phoneNumber === "string" &&
    typeof item.address === "string" &&
    typeof item.city === "string" &&
    typeof item.state === "string" &&
    typeof item.zip === "string" &&
    typeof item.country === "string"
  );
}

export function validateUser(item: User): boolean {
  return (
    typeof item.name === "string" &&
    typeof item.email === "string" &&
    typeof item.phoneNumber === "string" &&
    typeof item.address === "string" &&
    typeof item.city === "string" &&
    typeof item.state === "string" &&
    typeof item.zip === "string" &&
    typeof item.country === "string"
  );
}

export function toDynamoDB(user: User): UserDDB {
  return {
    PK: `USER#${user.email}`,
    SK: `USER#${user.email}`,
    entityType: "USER",
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: user.address,
    city: user.city,
    state: user.state,
    zip: user.zip,
    country: user.country,
  };
}

export function fromDynamoDB(userDDB: UserDDB): User {
  return {
    name: userDDB.name,
    email: userDDB.email,
    phoneNumber: userDDB.phoneNumber,
    address: userDDB.address,
    city: userDDB.city,
    state: userDDB.state,
    zip: userDDB.zip,
    country: userDDB.country,
  };
}
