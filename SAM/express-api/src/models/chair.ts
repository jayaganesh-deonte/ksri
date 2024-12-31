// chairname: Brahmasri Anna Subramaniam Chair

// area of specialization: Veda-Vedanta Studies

// name: Dr. K. Srinivasan
// subTitle: Former Principal &Head, Dept. of Sanskrit RKM Vivekananda College, Chennai

export interface Chair {
  id: string;
  chairName: string;
  areaOfSpecialization: string;
  name: string;
  subTitle: string;
  orderId: string;
  displayImage?: [string];
  metadata?: { [key: string]: string };
}

export interface ChairDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  chairName: string;
  areaOfSpecialization: string;
  name: string;
  subTitle: string;
  orderId: string;
  displayImage?: string;
  metadata?: { [key: string]: string };
}

export function validateChairDDB(item: ChairDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.id === "string" &&
    typeof item.chairName === "string" &&
    typeof item.areaOfSpecialization === "string" &&
    typeof item.name === "string" &&
    typeof item.subTitle === "string" &&
    typeof item.orderId === "string" &&
    typeof item.displayImage === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}

export function validateChair(item: Chair): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.chairName === "string" &&
    typeof item.areaOfSpecialization === "string" &&
    typeof item.name === "string" &&
    typeof item.subTitle === "string" &&
    typeof item.orderId === "string" &&
    // Array.isArray(item.displayImage) &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}

export function toDynamoDB(item: Chair): ChairDDB {
  return {
    PK: item.name,
    SK: item.id,
    entityType: "ENTITYTYPE#CHAIR",
    id: item.id,
    chairName: item.chairName,
    areaOfSpecialization: item.areaOfSpecialization,
    name: item.name,
    subTitle: item.subTitle,
    orderId: item.orderId,
    displayImage: item.displayImage ? item.displayImage[0] : "",
    metadata: item.metadata,
  };
}

export function fromDynamoDB(item: ChairDDB): Chair {
  return {
    id: item.id,
    chairName: item.chairName,
    areaOfSpecialization: item.areaOfSpecialization,
    name: item.name,
    subTitle: item.subTitle,
    orderId: item.orderId,
    displayImage: item.displayImage ? [item.displayImage] : undefined,
    metadata: item.metadata,
  };
}
