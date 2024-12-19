// {id,orderId, name}
export interface FacultyDesignation {
  id: string;
  orderId: string;
  name: string;
}

export interface FacultyDesignationDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  orderId: string;
  name: string;
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
    typeof item.name === "string"
  );
}

export function validateFacultyDesignation(item: FacultyDesignation): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.orderId === "string" &&
    typeof item.name === "string"
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
  };
}

export function fromDynamoDB(item: FacultyDesignationDDB): FacultyDesignation {
  return {
    id: item.id,
    orderId: item.orderId,
    name: item.name,
  };
}
