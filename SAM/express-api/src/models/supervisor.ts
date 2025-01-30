// {
//     id: "",
//     name: ""
// }

// create model
export interface Supervisor {
  id: string;
  name: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
  orderId: string;
  noOfphdStudents?: string;
  vacancy?: string;
}
export interface SupervisorDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  name: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
  orderId: string;
  noOfphdStudents?: string;
  vacancy?: string;
}

export function validateSupervisorDDB(item: SupervisorDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string" &&
    typeof item.orderId === "string" &&
    (item.noOfphdStudents === undefined ||
      typeof item.noOfphdStudents === "string") &&
    (item.vacancy === undefined || typeof item.vacancy === "string")
  );
}

export function validateSupervisor(item: Supervisor): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string" &&
    typeof item.orderId === "string"
    // (item.noOfphdStudents === undefined ||
    //   typeof item.noOfphdStudents === "string") &&
    // (item.vacancy === undefined || typeof item.vacancy === "string")
  );
}

export function fromDynamoDB(item: SupervisorDDB): Supervisor {
  return {
    id: item.id,
    name: item.name,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
    orderId: item.orderId,
    noOfphdStudents: item.noOfphdStudents,
    vacancy: item.vacancy,
  };
}

export function toDynamoDB(item: Supervisor): SupervisorDDB {
  return {
    PK: "ENTITYTYPE#SUPERVISOR",
    SK: item.id,
    entityType: "ENTITYTYPE#SUPERVISOR",
    id: item.id,
    name: item.name,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
    orderId: item.orderId,
    noOfphdStudents: item.noOfphdStudents,
    vacancy: item.vacancy,
  };
}
