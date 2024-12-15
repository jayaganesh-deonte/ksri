// {
//  id
//     name: "Know about our upcoming events",
//     link: "/events",
//   }

export interface MarqueeText {
  id: string;
  name: string;
  link: string;
  metadata?: { [key: string]: string };
}

export interface MarqueeTextDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  name: string;
  link: string;
  metadata?: { [key: string]: string };
}

export function validateMarqueeText(item: MarqueeText): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.link === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}

// fromDynamoDB

export function fromDynamoDB(item: MarqueeTextDDB): MarqueeText {
  return {
    id: item.id,
    name: item.name,
    link: item.link,
    metadata: item.metadata,
  };
}

// toDynamoDB

export function toDynamoDB(item: MarqueeText): MarqueeTextDDB {
  return {
    PK: item.name,
    SK: item.id,
    entityType: "ENTITYTYPE#MARQUEETEXT",
    id: item.id,
    name: item.name,
    link: item.link,
    metadata: item.metadata,
  };
}
