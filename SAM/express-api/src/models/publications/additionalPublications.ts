// {id, name, orderId}

export interface AdditionalPublication {
  id: string;
  name: string;
  orderId: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}

export interface AdditionalPublicationDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  name: string;
  orderId: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}

// toDynamoDB
export function toDynamoDB(
  additionalPublication: AdditionalPublication
): AdditionalPublicationDDB {
  return {
    PK: "ENTITYTYPE#ADDITIONALPUBLICATION",
    SK: additionalPublication.id,
    entityType: "ENTITYTYPE#ADDITIONALPUBLICATION",
    id: additionalPublication.id,
    name: additionalPublication.name,
    orderId: additionalPublication.orderId,
    metadata: additionalPublication.metadata,
    itemPublishStatus: additionalPublication.itemPublishStatus,
  };
}

// fromDynamoDB
export function fromDynamoDB(
  additionalPublication: AdditionalPublicationDDB
): AdditionalPublication {
  return {
    id: additionalPublication.id,
    name: additionalPublication.name,
    orderId: additionalPublication.orderId,
    metadata: additionalPublication.metadata,
    itemPublishStatus: additionalPublication.itemPublishStatus,
  };
}

// validate
export function validateAdditionalPublication(
  additionalPublication: AdditionalPublication
): boolean {
  return (
    typeof additionalPublication.id === "string" &&
    typeof additionalPublication.name === "string" &&
    typeof additionalPublication.orderId === "string" &&
    (additionalPublication.metadata === undefined ||
      (typeof additionalPublication.metadata === "object" &&
        Object.values(additionalPublication.metadata).every(
          (v) => typeof v === "string"
        ))) &&
    typeof additionalPublication.itemPublishStatus === "string"
  );
}

export function validateAdditionalPublicationDDB(
  additionalPublication: AdditionalPublicationDDB
): boolean {
  return (
    typeof additionalPublication.PK === "string" &&
    typeof additionalPublication.SK === "string" &&
    typeof additionalPublication.entityType === "string" &&
    typeof additionalPublication.id === "string" &&
    typeof additionalPublication.name === "string" &&
    typeof additionalPublication.orderId === "string" &&
    (additionalPublication.metadata === undefined ||
      (typeof additionalPublication.metadata === "object" &&
        Object.values(additionalPublication.metadata).every(
          (v) => typeof v === "string"
        ))) &&
    typeof additionalPublication.itemPublishStatus === "string"
  );
}
