// {
//     name: ""
// }

export interface Collection {
  name: string;
}

export interface CollectionDDB {
  PK: string;
  SK: string;
  entityType: string;
  name: string;
}

export function isCollectionDDB(item: any): item is CollectionDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.name === "string"
  );
}

export function validateCollectionDDB(item: CollectionDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.name === "string"
  );
}

export function validateCollection(item: Collection): boolean {
  return typeof item.name === "string";
}

export function toDynamoDB(item: Collection): CollectionDDB {
  return {
    PK: item.name,
    SK: item.name,
    entityType: "ENTITYTYPE#GALLERY#COLLECTION",
    name: item.name,
  };
}

export function fromDynamoDB(item: CollectionDDB): Collection {
  return {
    name: item.name,
  };
}
