// {
//     name: "",
//     metadata?: { [key: string]: string }
// }

export interface Collection {
  name: string;
  metadata?: { [key: string]: string };
}

export interface CollectionDDB {
  PK: string;
  SK: string;
  entityType: string;
  name: string;
  metadata?: { [key: string]: string };
}

export function isCollectionDDB(item: any): item is CollectionDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.name === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object")
  );
}

export function validateCollectionDDB(item: CollectionDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.name === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object")
  );
}

export function validateCollection(item: Collection): boolean {
  return (
    typeof item.name === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object")
  );
}

export function toDynamoDB(item: Collection): CollectionDDB {
  return {
    PK: item.name,
    SK: item.name,
    entityType: "ENTITYTYPE#GALLERY#COLLECTION",
    name: item.name,
    ...(item.metadata && { metadata: item.metadata }),
  };
}

export function fromDynamoDB(item: CollectionDDB): Collection {
  return {
    name: item.name,
    ...(item.metadata && { metadata: item.metadata }),
  };
}
