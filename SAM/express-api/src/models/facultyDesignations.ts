export type FacultyType = "ACADEMIC" | "NON ACADEMIC";

// {id,orderId, name}
export interface FacultyDesignation {
  id: string;
  orderId: string;
  name: string;
  type: FacultyType;
  metadata?: { [key: string]: string };
}

export interface FacultyDesignationDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  orderId: string;
  name: string;
  type: FacultyType;
  metadata?: { [key: string]: string };
}

export function validateFacultyDesignationDDB(
  item: FacultyDesignationDDB
): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.id === "string" &&
    typeof item.orderId === "string" &&
    typeof item.name === "string" &&
    (item.type === "ACADEMIC" || item.type === "NON ACADEMIC") &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}

export function validateFacultyDesignation(item: FacultyDesignation): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.orderId === "string" &&
    typeof item.name === "string" &&
    (item.type === "ACADEMIC" || item.type === "NON ACADEMIC") &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}

export function toDynamoDB(item: FacultyDesignation): FacultyDesignationDDB {
  return {
    PK: item.name,
    SK: item.id,
    entityType: "ENTITYTYPE#FACULTYDESIGNATION",
    id: item.id,
    orderId: item.orderId,
    name: item.name,
    type: item.type,
    metadata: item.metadata,
  };
}

export function fromDynamoDB(item: FacultyDesignationDDB): FacultyDesignation {
  return {
    id: item.id,
    orderId: item.orderId,
    name: item.name,
    type: item.type,
    metadata: item.metadata,
  };
}
