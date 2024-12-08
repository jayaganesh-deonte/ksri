// {
//  id
//     name: "Know about our upcoming events",
//     link: "/events",
//   }

export interface MarqueeText {
  id: string;
  name: string;
  link: string;
}

export interface MarqueeTextDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  name: string;
  link: string;
}

export function validateMarqueeText(item: MarqueeText): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.link === "string"
  );
}

// fromDynamoDB

export function fromDynamoDB(item: MarqueeTextDDB): MarqueeText {
  return {
    id: item.id,
    name: item.name,
    link: item.link,
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
  };
}
