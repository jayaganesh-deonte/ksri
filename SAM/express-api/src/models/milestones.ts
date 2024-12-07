// Regular Milestone model for application use
export interface Milestone {
  year: number;
  title: string;
  description: string;
}

// DynamoDB specific model
export interface MilestoneDDB {
  PK: string; // Will be constructed from title or other identifiers
  SK: string; // Will be constructed from year
  entityType: string;
  year: number;
  title: string;
  description: string;
}

// Convert DynamoDB record to application model
export function fromDynamoDB(item: MilestoneDDB): Milestone {
  return {
    year: item.year,
    title: item.title,
    description: item.description,
  };
}

// Convert application model to DynamoDB record
export function toDynamoDB(milestone: Milestone): MilestoneDDB {
  // Create a URL-friendly version of the title for the PK
  const pk = milestone.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    PK: pk,
    SK: `MILESTONE#${milestone.year}`,
    entityType: "ENTITYTYPE#MILESTONE",
    year: milestone.year,
    title: milestone.title,
    description: milestone.description,
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
    typeof item.description === "string"
  );
}
