// {
//     "imageUrl": "https://d30y75l38k1y9.cloudfront.net/upload/1-J4t.jpg",
//     "description": "Golden Jubilee Inauguration  - 1994"
// }

export interface GalleryImage {
  imageUrl: string;
  description: string;
  collection: string;
}

export interface GalleryImageDDB {
  PK: string;
  SK: string;
  entityType: string;
  imageUrl: string;
  description: string;
  collection: string;
}

export function isGalleryImageDDB(item: any): item is GalleryImageDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.imageUrl === "string" &&
    typeof item.description === "string" &&
    typeof item.collection === "string"
  );
}

export function isGalleryImage(item: any): item is GalleryImage {
  return (
    typeof item === "object" &&
    typeof item.imageUrl === "string" &&
    typeof item.description === "string" &&
    typeof item.collection === "string"
  );
}

export function validateGalleryImageDDB(item: GalleryImageDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.imageUrl === "string" &&
    typeof item.description === "string" &&
    typeof item.collection === "string"
  );
}

export function toDynamoDB(item: GalleryImage): GalleryImageDDB {
  return {
    PK: item.collection,
    SK: item.imageUrl,
    entityType: "ENTITYTYPE#GALLERY#IMAGE",
    imageUrl: item.imageUrl,
    description: item.description,
    collection: item.collection,
  };
}

export function fromDynamoDB(item: GalleryImageDDB): GalleryImage {
  return {
    imageUrl: item.imageUrl,
    description: item.description,
    collection: item.collection,
  };
}

export function validateGalleryImage(item: GalleryImage): boolean {
  return (
    typeof item.imageUrl === "string" &&
    typeof item.description === "string" &&
    typeof item.collection === "string"
  );
}
