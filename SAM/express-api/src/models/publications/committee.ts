// {
//     "id": 1,
//     "name": "Dr.K. Srinivasan",
//     "designation": "Research Committee" |  "Editorial Committee",
//     "metadata": { "key": "value" } // optional
// }

// create model
export interface CommitteeMember {
  id: string;
  name: string;
  designation: "Research Committee" | "Editorial Committee";
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}

export interface CommitteeMemberDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  name: string;
  designation: "Research Committee" | "Editorial Committee";
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}

// validate the committee member
export function validateCommitteeMember(item: CommitteeMember): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    (item.designation === "Research Committee" ||
      item.designation === "Editorial Committee") &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string"
  );
}

// to Dbb
export function toDynamoDB(item: CommitteeMember): CommitteeMemberDDB {
  return {
    PK: "ENTITYTYPE#PUBLICATION#COMMITTEEMEMBER",
    SK: item.id,
    entityType: "ENTITYTYPE#PUBLICATION#COMMITTEEMEMBER",
    id: item.id,
    name: item.name,
    designation: item.designation,
    ...(item.metadata && { metadata: item.metadata }),
    itemPublishStatus: item.itemPublishStatus,
  };
}

// from Dbb
export function fromDynamoDB(item: CommitteeMemberDDB): CommitteeMember {
  return {
    id: item.SK,
    name: item.name,
    designation: item.designation,
    ...(item.metadata && { metadata: item.metadata }),
    itemPublishStatus: item.itemPublishStatus,
  };
}

export function isCommitteeMember(item: any): item is CommitteeMember {
  return (
    typeof item === "object" &&
    typeof item.id === "number" &&
    typeof item.name === "string" &&
    (item.designation === "Research Committee" ||
      item.designation === "Editorial Committee") &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string"
  );
}

export function isCommitteeMemberDDB(item: any): item is CommitteeMemberDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    (item.designation === "Research Committee" ||
      item.designation === "Editorial Committee") &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string"
  );
}
