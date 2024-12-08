// {
//     "id": 1,
//     "name": "Dr.K. Srinivasan",
//     "designation": "Research Committee" |  "Editorial Committee",
// }

// create model
export interface CommitteeMember {
  id: string;
  name: string;
  designation: "Research Committee" | "Editorial Committee";
}

export interface CommitteeMemberDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  name: string;
  designation: "Research Committee" | "Editorial Committee";
}

// validate the committee member
export function validateCommitteeMember(item: CommitteeMember): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    (item.designation === "Research Committee" ||
      item.designation === "Editorial Committee")
  );
}

// to Dbb
export function toDynamoDB(item: CommitteeMember): CommitteeMemberDDB {
  return {
    PK: item.name,
    SK: item.id,
    entityType: "ENTITYTYPE#PUBLICATION#COMMITTEEMEMBER",
    id: item.id,
    name: item.name,
    designation: item.designation,
  };
}

// from Dbb
export function fromDynamoDB(item: CommitteeMemberDDB): CommitteeMember {
  return {
    id: item.SK,
    name: item.name,
    designation: item.designation,
  };
}

export function isCommitteeMember(item: any): item is CommitteeMember {
  return (
    typeof item === "object" &&
    typeof item.id === "number" &&
    typeof item.name === "string" &&
    (item.designation === "Research Committee" ||
      item.designation === "Editorial Committee")
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
      item.designation === "Editorial Committee")
  );
}
