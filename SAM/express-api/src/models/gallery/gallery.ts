// {
//     "imageUrl": "https://d30y75l38k1y9.cloudfront.net/upload/1-J4t.jpg",
//     "description": "Golden Jubilee Inauguration  - 1994"
// }

export interface GalleryImage {
  id: string;
  imageUrl: [string];
  description: string;
  collection: string;
  metadata?: { [key: string]: any };
}

export interface GalleryImageDDB {
  PK: string;
  SK: string;
  entityType: string;
  imageUrl: string;
  description: string;
  collection: string;
  metadata?: { [key: string]: any };
}

export function isGalleryImageDDB(item: any): item is GalleryImageDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.imageUrl === "string" &&
    typeof item.description === "string" &&
    typeof item.collection === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object")
  );
}

export function isGalleryImage(item: any): item is GalleryImage {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    Array.isArray(item.imageUrl) &&
    typeof item.description === "string" &&
    typeof item.description === "string" &&
    typeof item.collection === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object")
  );
}

export function validateGalleryImageDDB(item: GalleryImageDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.imageUrl === "string" &&
    typeof item.description === "string" &&
    typeof item.collection === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object")
  );
}

export function toDynamoDB(item: GalleryImage): GalleryImageDDB {
  return {
    PK: item.collection,
    SK: item.id,
    entityType: "ENTITYTYPE#GALLERY#IMAGE",
    imageUrl: item.imageUrl[0],
    description: item.description,
    collection: item.collection,
    metadata: item.metadata,
  };
}

export function fromDynamoDB(item: GalleryImageDDB): GalleryImage {
  return {
    id: item.SK,
    imageUrl: [item.imageUrl],
    description: item.description,
    collection: item.collection,
    metadata: item.metadata,
  };
}

export function validateGalleryImage(item: GalleryImage): boolean {
  return (
    typeof item.id === "string" &&
    Array.isArray(item.imageUrl) &&
    typeof item.description === "string" &&
    typeof item.collection === "string" &&
    (item.metadata === undefined || typeof item.metadata === "object")
  );
}
