// {
//     "title": "THE JOURNAL OF ORIENTAL RESEARCH MADRAS (Vols. LXXXVII) 2023",
//     "subtitle": "The Kuppuswami Sastri Research Institute, Chennai 4 | 2015 | pp 228",
//     "price": "250",
//     "imageUrls": [
//         "upload/the-journal-of-oriental-research-madras-2015-uRk.jpg"
//     ],
//     "details": null,
//     "id": "7682d76aaf06a6c5f319a561a4c6cce0660abe5c3ce57869fba0a80791d56e08"
//     "publication": "",
//     "available": true,
//     "copies": 0,
//     "author": "",
//     "yearOfPublication": ""
// }

export interface Journal {
  title: string;
  subtitle?: string;
  price?: string;
  imageUrls?: string[];
  details?: string;
  id: string;
  //publication: string;
  keywords: string;
  available: string;
  copies: string;
  metadata?: { [key: string]: any };
  //author: string;
  yearOfPublication: string;
  itemPublishStatus: string;
}

export interface JournalDDB {
  PK: string;
  SK: string;
  entityType: string;
  title: string;
  subtitle?: string;
  price?: string;
  imageUrls?: string[];
  details?: string;
  id?: string;
  //publication: string;
  keywords: string;
  available: string;
  copies: string;
  metadata?: { [key: string]: any };
  //author: string;
  yearOfPublication: string;
  itemPublishStatus: string;
}

export function validateJournal(item: Journal): boolean {
  return (
    typeof item.title === "string" &&
    // typeof item.subtitle === "string" &&
    // typeof item.price === "string" &&
    // Array.isArray(item.imageUrls) &&
    typeof item.details === "string" &&
    typeof item.id === "string" &&
    // typeof item.publication === "string" &&
    // typeof item.keywords === "string" &&
    // typeof item.available === "string" &&
    // typeof item.copies === "string" &&
    // typeof item.author === "string" &&
    typeof item.yearOfPublication === "string"
    // (item.metadata === undefined || typeof item.metadata === "object") &&
    // typeof item.itemPublishStatus === "string"
  );
}

export function toDynamoDB(item: Journal): JournalDDB {
  return {
    PK: "ENTITYTYPE#PUBLICATION#JOURNAL",
    SK: item.id,
    entityType: "ENTITYTYPE#PUBLICATION#JOURNAL",
    title: item.title,
    subtitle: item.subtitle,
    price: item.price,
    imageUrls: item.imageUrls,
    details: item.details,
    id: item.id,
    //publication: "KSRI",
    keywords: item.keywords,
    available: item.available,
    copies: item.copies,
    metadata: item.metadata,
    //author: item.author,
    yearOfPublication: item.yearOfPublication,
    itemPublishStatus: item.itemPublishStatus,
  };
}

export function fromDynamoDB(item: JournalDDB): Journal {
  return {
    title: item.title,
    subtitle: item.subtitle,
    price: item.price,
    imageUrls: item.imageUrls,
    details: item.details,
    id: item.SK,
    //publication: item.publication,
    keywords: item.keywords,
    available: item.available,
    copies: item.copies,
    metadata: item.metadata,
    //author: item.author,
    yearOfPublication: item.yearOfPublication,
    itemPublishStatus: item.itemPublishStatus,
  };
}

export function isJournal(item: any): item is JournalDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.title === "string" &&
    typeof item.subtitle === "string" &&
    typeof item.price === "string" &&
    Array.isArray(item.imageUrls) &&
    typeof item.details === "string" &&
    typeof item.id === "string" &&
    // typeof item.publication === "string" &&
    typeof item.keywords === "string" &&
    typeof item.available === "string" &&
    // typeof item.copies === "number" &&
    typeof item.author === "string" &&
    typeof item.yearOfPublication === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object") &&
    typeof item.itemPublishStatus === "string"
  );
}

export function isJournalDDB(item: any): item is JournalDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.title === "string" &&
    typeof item.subtitle === "string" &&
    typeof item.price === "string" &&
    Array.isArray(item.imageUrls) &&
    typeof item.details === "string" &&
    typeof item.id === "string" &&
    // typeof item.publication === "string" &&
    typeof item.keywords === "string" &&
    typeof item.available === "string" &&
    // typeof item.copies === "number" &&
    typeof item.author === "string" &&
    typeof item.yearOfPublication === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object") &&
    typeof item.itemPublishStatus === "string"
  );
}

// validate the book
export function validateJournalDDB(item: JournalDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.title === "string" &&
    typeof item.subtitle === "string" &&
    typeof item.price === "string" &&
    Array.isArray(item.imageUrls) &&
    typeof item.details === "string" &&
    typeof item.id === "string" &&
    // typeof item.publication === "string" &&
    typeof item.keywords === "string" &&
    typeof item.available === "string" &&
    // typeof item.copies === "number" &&
    // typeof item.author === "string" &&
    typeof item.yearOfPublication === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object") &&
    typeof item.itemPublishStatus === "string"
  );
}
