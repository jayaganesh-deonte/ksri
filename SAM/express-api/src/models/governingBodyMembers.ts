// {
//     "id": "",
//     "name": "Dr. R.K. Raghavan",
//     "subtitle": "(Former Director, Central Bureau of Investigation, New Delhi and Former High commissioner of India to the Republic of Cyprus)"
//     "designation": "Director, Central Bureau of Investigation, New Delhi",
// }

// create model

export interface GoverningBodyMember {
  id: string;
  name: string;
  subtitle: string;
  designation: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
  orderid: string;
  designationStatus: "Present" | "Past";
  startYear?: string;
  endYear?: string;
}

// DynamoDB specific model
export interface GoverningBodyMemberDDB {
  PK: string;
  SK: string;
  entityType: string;
  name: string;
  subtitle: string;
  designation: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
  orderid: string;
  designationStatus: "Present" | "Past";
  startYear?: string;
  endYear?: string;
}

// Type guard to check if an object is a valid GoverningBodyMemberDDB
export function isGoverningBodyMemberDDB(
  item: any
): item is GoverningBodyMemberDDB {
  return (
    (typeof item === "object" &&
      typeof item.PK === "string" &&
      typeof item.SK === "string" &&
      typeof item.entityType === "string" &&
      typeof item.name === "string" &&
      typeof item.subtitle === "string" &&
      typeof item.designation === "string" &&
      (item.metadata === undefined ||
        (typeof item.metadata === "object" &&
          Object.values(item.metadata).every((v) => typeof v === "string"))) &&
      typeof item.itemPublishStatus === "string" &&
      typeof item.orderid === "string" &&
      item.designationStatus === "Present") ||
    (item.designationStatus === "Past" &&
      (typeof item.startYear === undefined ||
        typeof item.startYear === "string") &&
      (typeof item.endYear === undefined || typeof item.endYear === "string"))
  );
}

// Type guard to check if an object is a valid GoverningBodyMember
export function isGoverningBodyMember(item: any): item is GoverningBodyMember {
  return (
    (typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.name === "string" &&
      typeof item.subtitle === "string" &&
      typeof item.designation === "string" &&
      (item.metadata === undefined ||
        (typeof item.metadata === "object" &&
          Object.values(item.metadata).every((v) => typeof v === "string"))) &&
      typeof item.itemPublishStatus === "string" &&
      typeof item.orderid === "string" &&
      item.designationStatus === "Present") ||
    (item.designationStatus === "Past" &&
      (typeof item.endYear === undefined || typeof item.endYear === "string"))
  );
}

// Convert GoverningBodyMember to GoverningBodyMemberDDB
export function toDynamoDB(item: GoverningBodyMember): GoverningBodyMemberDDB {
  return {
    PK: "ENTITYTYPE#GOVERNINGBODYMEMBER",
    SK: item.id,
    entityType: "ENTITYTYPE#GOVERNINGBODYMEMBER",
    name: item.name,
    subtitle: item.subtitle,
    designation: item.designation,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
    orderid: item.orderid,
    designationStatus: item.designationStatus,
    startYear: item.startYear,
    endYear: item.endYear,
  };
}

// Convert GoverningBodyMemberDDB to GoverningBodyMember
export function fromDynamoDB(
  item: GoverningBodyMemberDDB
): GoverningBodyMember {
  return {
    id: item.SK,
    name: item.name,
    subtitle: item.subtitle,
    designation: item.designation,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
    orderid: item.orderid,
    designationStatus: item.designationStatus,
    startYear: item.startYear,
    endYear: item.endYear,
  };
}

// Validate GoverningBodyMember
export function validateGoverningBodyMember(
  item: GoverningBodyMember
): boolean {
  return (
    (typeof item.id === "string" &&
      typeof item.name === "string" &&
      typeof item.subtitle === "string" &&
      typeof item.designation === "string" &&
      (item.metadata === undefined ||
        (typeof item.metadata === "object" &&
          Object.values(item.metadata).every((v) => typeof v === "string"))) &&
      typeof item.itemPublishStatus === "string" &&
      typeof item.orderid === "string" &&
      item.designationStatus === "Present") ||
    (item.designationStatus === "Past" &&
      (typeof item.endYear === undefined || typeof item.endYear === "string") &&
      (typeof item.startYear === undefined ||
        typeof item.startYear === "string"))
  );
}
