// {
//     "id": "",
//     "title": "Dr.M. Narasimhachari Endowment",
//     "initiatedBy": "Instituted by Family members, friends & Students",
//     "topic": "A lecture is organised every year on Sanskrit Literature"
// }

//  create model

export interface Endownment {
  id: string;
  title: string;
  initiatedBy: string;
  topic: string;
  orderId: string;
  metadata?: { [key: string]: any };
  itemPublishStatus: string;
}

export interface EndownmentDDB {
  PK: string;
  SK: string;
  entityType: string;
  title: string;
  initiatedBy: string;
  topic: string;
  orderId: string;
  metadata?: { [key: string]: any };
  itemPublishStatus: string;
}

export function isEndownmentDDB(item: any): item is EndownmentDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.title === "string" &&
    typeof item.initiatedBy === "string" &&
    typeof item.topic === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object") &&
    typeof item.itemPublishStatus === "string"
  );
}

export function isEndownment(item: any): item is Endownment {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.initiatedBy === "string" &&
    typeof item.topic === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object") &&
    typeof item.itemPublishStatus === "string"
  );
}

export function fromDynamoDB(item: EndownmentDDB): Endownment {
  return {
    id: item.SK,
    title: item.title,
    initiatedBy: item.initiatedBy,
    topic: item.topic,
    orderId: item.orderId,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
  };
}

export function validateEndownment(endownment: Partial<Endownment>): boolean {
  return (
    typeof endownment.title === "string" &&
    typeof endownment.initiatedBy === "string" &&
    typeof endownment.topic === "string" &&
    typeof endownment.id === "string" &&
    (endownment.metadata === undefined ||
      typeof endownment.metadata === "object") &&
    typeof endownment.itemPublishStatus === "string"
  );
}

export function toDynamoDB(item: Endownment): EndownmentDDB {
  return {
    PK: "ENTITYTYPE#ENDOWNMENT",
    SK: item.id,
    entityType: "ENTITYTYPE#ENDOWNMENT",
    title: item.title,
    initiatedBy: item.initiatedBy,
    topic: item.topic,
    orderId: item.orderId,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
  };
}
