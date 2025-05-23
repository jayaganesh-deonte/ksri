// Regular Milestone model for application use
export interface Milestone {
  id: string;
  year: number;
  title: string;
  subTitle: string;
  description: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}

// DynamoDB specific model
export interface MilestoneDDB {
  PK: string; // Will be constructed from title or other identifiers
  SK: string; // Will be constructed from year
  id: string;
  entityType: string;
  year: number;
  title: string;
  subTitle: string;
  description: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}

// Convert DynamoDB record to application model
export function fromDynamoDB(item: MilestoneDDB): Milestone {
  return {
    id: item.id,
    year: item.year,
    title: item.title,
    subTitle: item.subTitle,
    description: item.description,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
  };
}

// Convert application model to DynamoDB record
export function toDynamoDB(milestone: Milestone): MilestoneDDB {
  // Create a URL-friendly version of the title for the PK
  const pk = milestone.title;
  // .toLowerCase()
  // .replace(/[^a-z0-9]+/g, "-")
  // .replace(/(^-|-$)/g, "");

  return {
    PK: "ENTITYTYPE#MILESTONE",
    SK: milestone.id,
    id: milestone.id,
    entityType: "ENTITYTYPE#MILESTONE",
    year: milestone.year,
    title: milestone.title,
    subTitle: milestone.subTitle,
    description: milestone.description,
    metadata: milestone.metadata,
    itemPublishStatus: milestone.itemPublishStatus,
  };
}

// Type guard to check if an object is a valid MilestoneDDB
export function isMilestoneDDB(item: any): item is MilestoneDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.year === "number" &&
    typeof item.title === "string" &&
    typeof item.subTitle === "string" &&
    typeof item.description === "string" &&
    (typeof item.metadata === "undefined" ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string" &&
    typeof item.id === "string"
  );
}
