// {id, name, orderId}

export interface AdditionalPublication {
  id: string;
  name: string;
  orderId: string;
  metadata?: { [key: string]: string };
}

export interface AdditionalPublicationDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  name: string;
  orderId: string;
  metadata?: { [key: string]: string };
}

// toDynamoDB
export function toDynamoDB(
  additionalPublication: AdditionalPublication
): AdditionalPublicationDDB {
  return {
    PK: additionalPublication.name,
    SK: additionalPublication.id,
    entityType: "ENTITYTYPE#ADDITIONALPUBLICATION",
    id: additionalPublication.id,
    name: additionalPublication.name,
    orderId: additionalPublication.orderId,
    metadata: additionalPublication.metadata,
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
        )))
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
        )))
  );
}
