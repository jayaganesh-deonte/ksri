// {
//  "id ": 1,
//     "Journal Acc No": 1,
//     "Journal Name": "JOURNAL OF ASIATIQUE",
//     "Nationality": "FOREIGN",
//     "subTable": [
//         {
//             "Journal Volume #": 1,
//             "Publication Year": 1949,
//             "Volume": 237,
//             "Journal Volume Number": "1,2"
//         }
//     ]
// },

//  Create Model
// subJournal

//  create model
export interface SubJournal {
  "JournalVolumeNumber#": string;
  PublicationYear: string;
  Volume: string;
  JournalVolumeNumber: string;
}

//  create model
export interface Journal {
  id: string;
  JournalAccNo: string;
  JournalName: string;
  Nationality: string;
  subTable: SubJournal[];
  metadata?: { [key: string]: any };
  itemPublishStatus: string;
}

//  create model
export interface JournalDDB {
  PK: string;
  SK: string;
  entityType: string;
  JournalAccNo: string;
  JournalName: string;
  Nationality: string;
  subTable: SubJournal[];
  metadata?: { [key: string]: any };
  itemPublishStatus: string;
}

// Type guard to check if an object is a valid JournalDDB
export function isJournalDDB(item: any): item is JournalDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.JournalAccNo === "string" &&
    typeof item.JournalName === "string" &&
    typeof item.Nationality === "string" &&
    Array.isArray(item.subTable) &&
    (item.metadata === undefined || typeof item.metadata === "object") &&
    typeof item.itemPublishStatus === "string"
  );
}

// Type guard to check if an object is a valid Journal
export function isJournal(item: any): item is Journal {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.JournalAccNo === "string" &&
    typeof item.JournalName === "string" &&
    typeof item.Nationality === "string" &&
    Array.isArray(item.subTable) &&
    (item.metadata === undefined || typeof item.metadata === "object") &&
    typeof item.itemPublishStatus === "string"
  );
}

// Type guard to check if an object is a valid SubJournal
export function isSubJournal(item: any): item is SubJournal {
  return (
    typeof item === "object" &&
    typeof item.JournalVolumeNumber === "string" &&
    typeof item.PublicationYear === "string" &&
    typeof item.Volume === "string" &&
    typeof item.JournalVolumeNumber === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object") &&
    typeof item.itemPublishStatus === "string"
  );
}

// toDynamoDB
export function toJournalDDB(item: Journal): JournalDDB {
  return {
    PK: "ENTITYTYPE#JOURNAL",
    SK: item.id,
    entityType: "ENTITYTYPE#JOURNAL",
    JournalAccNo: item.JournalAccNo,
    JournalName: item.JournalName,
    Nationality: item.Nationality,
    subTable: item.subTable,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
  };
}

//  fromDynamoDB
export function fromJournalDDB(item: JournalDDB): Journal {
  return {
    id: item.SK,
    JournalAccNo: item.JournalAccNo,
    JournalName: item.JournalName,
    Nationality: item.Nationality,
    subTable: item.subTable,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
  };
}

export function toDynamoDB(item: Journal): JournalDDB {
  return {
    PK: item.JournalName,
    SK: item.id.toString(),
    entityType: "Journal",
    JournalAccNo: item.JournalAccNo,
    JournalName: item.JournalName,
    Nationality: item.Nationality,
    subTable: item.subTable,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
  };
}

// validate Journal
export function validateJournal(item: Journal): boolean {
  return (
    "id" in item &&
    "JournalAccNo" in item &&
    "JournalName" in item &&
    "Nationality" in item &&
    "subTable" in item &&
    (!("metadata" in item) || typeof item.metadata === "object")
  );
}
