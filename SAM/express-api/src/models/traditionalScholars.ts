// Regular TraditionalScholar model for application use
export interface TraditionalScholar {
  id: string;
  name: string;
  year?: string; // Optional year
  description: string;
  type?: string;
  metadata?: { [key: string]: string };
}

// DynamoDB specific model
export interface TraditionalScholarDDB {
  PK: string; // Will be constructed from name
  SK: string; // Consistent identifier
  entityType: string;
  id: string;
  name: string;
  year?: string;
  description: string;
  type?: string;
  metadata?: { [key: string]: string };
}

// Convert DynamoDB record to application model
export function fromDynamoDB(item: TraditionalScholarDDB): TraditionalScholar {
  return {
    id: item.id,
    name: item.name,
    year: item.year,
    description: item.description,
    type: item.type,
    metadata: item.metadata,
  };
}

// Convert application model to DynamoDB record
export function toDynamoDB(scholar: TraditionalScholar): TraditionalScholarDDB {
  return {
    PK: scholar.name,
    SK: scholar.id,
    entityType: "ENTITYTYPE#TRADITIONAL_SCHOLAR",
    id: scholar.id,
    name: scholar.name,
    year: scholar.year,
    description: scholar.description,
    type: scholar.type,
    metadata: scholar.metadata,
  };
}

// Type guard to check if an object is a valid TraditionalScholarDDB
export function isTraditionalScholarDDB(
  item: any
): item is TraditionalScholarDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.description === "string" &&
    typeof item.type === "string" &&
    (typeof item.metadata === "undefined" ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}

// Helper function to validate scholar data
export function validateTraditionalScholar(
  scholar: Partial<TraditionalScholar>
): scholar is TraditionalScholar {
  if (!scholar.id || !scholar.name || !scholar.description) {
    return false;
  }

  return true;
}
