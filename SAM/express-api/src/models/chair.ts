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
    typeof item.orderId === "string"
  );
}

export function validateChair(item: Chair): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.chairName === "string" &&
    typeof item.areaOfSpecialization === "string" &&
    typeof item.name === "string" &&
    typeof item.subTitle === "string" &&
    typeof item.orderId === "string"
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
  };
}
