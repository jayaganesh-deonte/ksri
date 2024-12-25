// {id, name}
export interface ProjectSeries {
  id: string;
  orderId: string;
  name: string;
  metadata?: { [key: string]: string };
}

export interface ProjectSeriesDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  orderId: string;
  name: string;
  metadata?: { [key: string]: string };
}

export function isProjectSeriesDDB(item: any): item is ProjectSeriesDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.id === "string" &&
    typeof item.orderId === "string" &&
    typeof item.name === "string" &&
    (typeof item.metadata === "undefined" ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}

export function validateProjectSeriesDDB(item: ProjectSeriesDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.id === "string" &&
    typeof item.orderId === "string" &&
    typeof item.name === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}

export function isProjectSeries(item: any): item is ProjectSeries {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.orderId === "string" &&
    typeof item.name === "string" &&
    (typeof item.metadata === "undefined" ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}

export function validateProjectSeries(item: ProjectSeries): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.orderId === "string" &&
    typeof item.name === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}

// toDynamoDB function for ProjectSeries
export function toDynamoDB(projectSeries: ProjectSeries): ProjectSeriesDDB {
  return {
    PK: projectSeries.name,
    SK: projectSeries.id,
    orderId: projectSeries.orderId,
    entityType: "ENTITYTYPE#PROJECTSERIES",
    id: projectSeries.id,
    name: projectSeries.name,
    metadata: projectSeries.metadata,
  };
}

// fromDynamoDB function for ProjectSeries
export function fromDynamoDB(item: ProjectSeriesDDB): ProjectSeries {
  return {
    id: item.id,
    orderId: item.orderId,
    name: item.name,
    metadata: item.metadata,
  };
}
