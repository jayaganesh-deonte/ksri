// {
//     "name": "Sri T.S. Krishna Murthy",
//     "startYear": 2015,
//     "endYear": 2020.
//     "designation": "Director, Central Bureau of Investigation, New Delhi",
//     "id"
// }

// create model

export interface GoverningBodyMemberPast {
  name: string;
  startYear: string;
  endYear: string;
  designation: string;
  id: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}

export interface GoverningBodyMemberPastDDB {
  PK: string;
  SK: string;
  entityType: string;
  name: string;
  startYear: string;
  endYear: string;
  designation: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}

export function isGoverningBodyMemberPastDDB(
  item: any
): item is GoverningBodyMemberPastDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.name === "string" &&
    typeof item.startYear === "string" &&
    typeof item.endYear === "string" &&
    typeof item.designation === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string"
  );
}

export function isGoverningBodyMemberPast(
  item: any
): item is GoverningBodyMemberPast {
  return (
    typeof item === "object" &&
    typeof item.name === "string" &&
    typeof item.startYear === "string" &&
    typeof item.endYear === "string" &&
    typeof item.designation === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string"
  );
}

export function validateGoverningBodyMemberPast(
  item: GoverningBodyMemberPast
): boolean {
  return (
    typeof item.name === "string" &&
    typeof item.startYear === "string" &&
    typeof item.endYear === "string" &&
    typeof item.designation === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string"
  );
}

export function validateGoverningBodyMemberPastDDB(
  item: GoverningBodyMemberPastDDB
): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.name === "string" &&
    typeof item.startYear === "string" &&
    typeof item.endYear === "string" &&
    typeof item.designation === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string"
  );
}

export function toDynamoDB(
  item: GoverningBodyMemberPast
): GoverningBodyMemberPastDDB {
  return {
    PK: "ENTITYTYPE#GOVERNINGBODYMEMBERPAST",
    SK: item.id,
    entityType: "ENTITYTYPE#GOVERNINGBODYMEMBERPAST",
    name: item.name,
    startYear: item.startYear,
    endYear: item.endYear,
    designation: item.designation,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
  };
}
export function fromDynamoDB(
  item: GoverningBodyMemberPastDDB
): GoverningBodyMemberPast {
  return {
    name: item.name,
    startYear: item.startYear,
    endYear: item.endYear,
    designation: item.designation,
    id: item.SK,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
  };
}
