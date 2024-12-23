// {
//     "name": "Dr.Robert C.Lester",
//     "university": "Yale University",
//     "subject": "Yoga in Visistadvaita"
// }

export interface ForeignScholar {
  id: string;
  name: string;
  university: string;
  subject: string;
  metadata?: { [key: string]: string };
}

export interface ForeignScholarDDB {
  PK: string;
  SK: string;
  entityType: string;
  name: string;
  university: string;
  subject: string;
  metadata?: { [key: string]: string };
}

export function toDynamoDB(scholar: ForeignScholar): ForeignScholarDDB {
  return {
    PK: scholar.name,
    SK: scholar.id,
    entityType: "ENTITYTYPE#FOREIGN_SCHOLAR",
    name: scholar.name,
    university: scholar.university,
    subject: scholar.subject,
    metadata: scholar.metadata,
  };
}

export function isForeignScholarDDB(item: any): item is ForeignScholarDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.name === "string" &&
    typeof item.university === "string" &&
    typeof item.subject === "string"
  );
}

export function fromDynamoDB(item: ForeignScholarDDB): ForeignScholar {
  return {
    id: item.SK,
    name: item.name,
    university: item.university,
    subject: item.subject,
    metadata: item.metadata,
  };
}

export function isForeignScholar(item: any): item is ForeignScholar {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.university === "string" &&
    typeof item.subject === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}

export function validateForeignScholar(
  scholar: Partial<ForeignScholar>
): boolean {
  return (
    typeof scholar.name === "string" &&
    typeof scholar.university === "string" &&
    typeof scholar.subject === "string" &&
    typeof scholar.id === "string" &&
    (scholar.metadata === undefined ||
      (typeof scholar.metadata === "object" &&
        Object.values(scholar.metadata).every((v) => typeof v === "string")))
  );
}
