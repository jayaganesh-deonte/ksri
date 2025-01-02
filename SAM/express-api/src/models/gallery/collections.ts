// {
//     name: "",
//     metadata?: { [key: string]: string }
// }

export interface Collection {
  name: string;
  id: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}

export interface CollectionDDB {
  PK: string;
  SK: string;
  entityType: string;
  name: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}

export function isCollectionDDB(item: any): item is CollectionDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.name === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object") &&
    typeof item.itemPublishStatus === "string"
  );
}

export function validateCollectionDDB(item: CollectionDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.name === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object") &&
    typeof item.itemPublishStatus === "string"
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
    PK: "ENTITYTYPE#GALLERY#COLLECTION",
    SK: item.id,
    entityType: "ENTITYTYPE#GALLERY#COLLECTION",
    name: item.name,
    ...(item.metadata && { metadata: item.metadata }),
    itemPublishStatus: "PUBLISHED",
  };
}

export function fromDynamoDB(item: CollectionDDB): Collection {
  return {
    name: item.name,
    id: item.SK,
    ...(item.metadata && { metadata: item.metadata }),
    itemPublishStatus: item.itemPublishStatus,
  };
}
