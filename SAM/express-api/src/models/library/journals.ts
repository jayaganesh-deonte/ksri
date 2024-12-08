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
  PublicationYear: number;
  Volume: number;
  JournalVolumeNumber: string;
}

//  create model
export interface Journal {
  id: string;
  JournalAccNo: number;
  JournalName: string;
  Nationality: string;
  subTable: SubJournal[];
}

//  create model
export interface JournalDDB {
  PK: string;
  SK: string;
  entityType: string;
  JournalAccNo: number;
  JournalName: string;
  Nationality: string;
  subTable: SubJournal[];
}

// Type guard to check if an object is a valid JournalDDB
export function isJournalDDB(item: any): item is JournalDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.JournalAccNo === "number" &&
    typeof item.JournalName === "string" &&
    typeof item.Nationality === "string" &&
    Array.isArray(item.subTable)
  );
}

// Type guard to check if an object is a valid Journal
export function isJournal(item: any): item is Journal {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.JournalAccNo === "number" &&
    typeof item.JournalName === "string" &&
    typeof item.Nationality === "string" &&
    Array.isArray(item.subTable)
  );
}

// Type guard to check if an object is a valid SubJournal
export function isSubJournal(item: any): item is SubJournal {
  return (
    typeof item === "object" &&
    typeof item.JournalVolumeNumber === "string" &&
    typeof item.PublicationYear === "number" &&
    typeof item.Volume === "number" &&
    typeof item.JournalVolumeNumber === "string"
  );
}

// toDynamoDB
export function toJournalDDB(item: Journal): JournalDDB {
  return {
    PK: item.JournalName,
    SK: item.id,
    entityType: "ENTITYTYPE#JOURNAL",
    JournalAccNo: item.JournalAccNo,
    JournalName: item.JournalName,
    Nationality: item.Nationality,
    subTable: item.subTable,
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
  };
}

// validate Journal

export function validateJournal(item: Journal): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.JournalAccNo === "number" &&
    typeof item.JournalName === "string" &&
    typeof item.Nationality === "string" &&
    Array.isArray(item.subTable)
  );
}
