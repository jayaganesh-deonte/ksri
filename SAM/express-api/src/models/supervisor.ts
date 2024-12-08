// {
//     id: "",
//     name: ""
// }

// create model
export interface Supervisor {
  id: string;
  name: string;
}
export interface SupervisorDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  name: string;
}

export function validateSupervisorDDB(item: SupervisorDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.id === "string" &&
    typeof item.name === "string"
  );
}

export function validateSupervisor(item: Supervisor): boolean {
  return typeof item.id === "string" && typeof item.name === "string";
}

export function fromDynamoDB(item: SupervisorDDB): Supervisor {
  return {
    id: item.id,
    name: item.name,
  };
}

export function toDynamoDB(item: Supervisor): SupervisorDDB {
  return {
    PK: item.name,
    SK: item.id,
    entityType: "ENTITYTYPE#SUPERVISOR",
    id: item.id,
    name: item.name,
  };
}
