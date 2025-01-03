// {
//     "id": 1,
//     "name": "Dr.K. Srinivasan",
//     "designation": "Research Committee" |  "Editorial Committee",
//     "metadata": { "key": "value" } // optional
// }

// create model
export interface AdvisoryBoard {
  id: string;
  name: string;
  subTitle: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
  orderId: string;
}

export interface AdvisoryMembetDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  name: string;
  subTitle: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
  orderId: string;
}

// validate the committee member
export function validateCommitteeMember(item: AdvisoryBoard): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.subTitle == "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string" &&
    typeof item.orderId === "string"
  );
}

// to Dbb
export function toDynamoDB(item: AdvisoryBoard): AdvisoryMembetDDB {
  return {
    PK: "ENTITYTYPE#ADVISORY_BOARD",
    SK: item.id,
    entityType: "ENTITYTYPE#ADVISORY_BOARD",
    id: item.id,
    name: item.name,
    subTitle: item.subTitle,
    ...(item.metadata && { metadata: item.metadata }),
    itemPublishStatus: item.itemPublishStatus,
    orderId: item.orderId,
  };
}

// from Dbb
export function fromDynamoDB(item: AdvisoryMembetDDB): AdvisoryBoard {
  return {
    id: item.SK,
    name: item.name,
    subTitle: item.subTitle,
    ...(item.metadata && { metadata: item.metadata }),
    itemPublishStatus: item.itemPublishStatus,
    orderId: item.orderId,
  };
}

export function isCommitteeMember(item: any): item is AdvisoryBoard {
  return (
    typeof item === "object" &&
    typeof item.id === "number" &&
    typeof item.name === "string" &&
    typeof item.subTitle == "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string" &&
    typeof item.orderId === "string"
  );
}

export function isCommitteeMemberDDB(item: any): item is AdvisoryMembetDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.subTitle == "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string" &&
    typeof item.orderId === "string"
  );
}
