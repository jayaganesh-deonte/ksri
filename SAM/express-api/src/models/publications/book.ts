// {
//     "title": "THE JOURNAL OF ORIENTAL RESEARCH MADRAS (Vols. LXXXVII) 2023",
//     "subtitle": "The Kuppuswami Sastri Research Institute, Chennai 4 | 2015 | pp 228",
//     "price": "250",
//     "imageUrls": [
//         "https://d30y75l38k1y9.cloudfront.net/upload/the-journal-of-oriental-research-madras-2015-uRk.jpg"
//     ],
//     "details": null,
//     "id": "7682d76aaf06a6c5f319a561a4c6cce0660abe5c3ce57869fba0a80791d56e08"
//     "publication": "",
//   "available": true
// }

export interface Book {
  title: string;
  subtitle?: string;
  price?: string;
  imageUrls?: string[];
  details?: string;
  id: string;
  publication: string;
  available: string;
  metadata?: { [key: string]: any };
}

export interface BookDDB {
  PK: string;
  SK: string;
  entityType: string;
  title: string;
  subtitle?: string;
  price?: string;
  imageUrls?: string[];
  details?: string;
  id?: string;
  publication: string;
  available: string;
  metadata?: { [key: string]: any };
}

export function validateBook(item: Book): boolean {
  return (
    typeof item.title === "string" &&
    typeof item.subtitle === "string" &&
    typeof item.price === "string" &&
    Array.isArray(item.imageUrls) &&
    typeof item.details === "string" &&
    typeof item.id === "string" &&
    typeof item.publication === "string" &&
    typeof item.available === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object")
  );
}

export function toDynamoDB(item: Book): BookDDB {
  return {
    PK: item.publication,
    SK: item.id,
    entityType: "ENTITYTYPE#BOOK",
    title: item.title,
    subtitle: item.subtitle,
    price: item.price,
    imageUrls: item.imageUrls,
    details: item.details,
    id: item.id,
    publication: item.publication,
    available: item.available,
    metadata: item.metadata,
  };
}

export function fromDynamoDB(item: BookDDB): Book {
  return {
    title: item.title,
    subtitle: item.subtitle,
    price: item.price,
    imageUrls: item.imageUrls,
    details: item.details,
    id: item.SK,
    publication: item.publication,
    available: item.available,
    metadata: item.metadata,
  };
}

export function isBook(item: any): item is BookDDB {
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
    typeof item.publication === "string" &&
    typeof item.available === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object")
  );
}

export function isBookDDB(item: any): item is BookDDB {
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
    typeof item.publication === "string" &&
    typeof item.available === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object")
  );
}

// validate the book
export function validateBookDDB(item: BookDDB): boolean {
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
    typeof item.publication === "string" &&
    typeof item.available === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object")
  );
}
