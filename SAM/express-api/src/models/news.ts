// {
//     "avatarImage": "https://d30y75l38k1y9.cloudfront.net/upload/20241018_164550.jpg",
//     "text": "The Pontiff of Uttaradi Mutt visited our institute on  17 October 2024 at 4 p.m. He evinced keen interest in our publications, library and reading some books and palm leaf manuscripts.",
//     "details_page": "https://www.ksri.in/ksri-news/530/the-pontiff-of-uttaradi-mutt--visited-ksri",
//     "heading": "The Pontiff of Uttaradi Mutt  visited KSRI",
//     "title": "The Pontiff of Uttaradi Mutt visited our institute on  17 October 2024 at 4 p.m. He evinced keen interest in our publications, library and reading some books and palm leaf manuscripts.",
//     "heading_image_url": "https://d30y75l38k1y9.cloudfront.net/upload/20241018_164550.jpg",
//     "images": [
//         "https://d30y75l38k1y9.cloudfront.net/upload/20241018_164550.jpg",
//         "https://d30y75l38k1y9.cloudfront.net/upload/20241018_164627.jpg",
//     ],
//     "id": "b7492fe067ade6e2f769cca291f5eb44659910436717dd5a21715c75d4a92875"
// }

// create model

export interface News {
  avatarImage: string[];
  text: string;
  // details_page: string;
  heading: string;
  title: string;
  heading_image_url: string[];
  images: string[];
  id: string;
  metadata?: { [key: string]: string };
}

export interface NewsDDB {
  PK: string;
  SK: string;
  entityType: string;
  avatarImage: string;
  text: string;
  // details_page: string;
  heading: string;
  title: string;
  heading_image_url: string;
  images: string[];
  id: string;
  metadata?: { [key: string]: string };
}

export const fromDynamoDB = (item: NewsDDB): News => {
  return {
    avatarImage: [item.avatarImage],
    text: item.text,
    // details_page: item.details_page,
    heading: item.heading,
    title: item.title,
    heading_image_url: [item.heading_image_url],
    images: item.images,
    id: item.id,
    metadata: item.metadata,
  };
};

export const toDynamoDB = (item: News): NewsDDB => {
  return {
    PK: item.heading.substring(0, 100),
    SK: item.id,
    entityType: "ENTITYTYPE#NEWS",
    avatarImage: item.avatarImage[0],
    text: item.text,
    // details_page: item.details_page,
    heading: item.heading,
    title: item.title,
    heading_image_url: item.heading_image_url[0],
    images: item.images,
    id: item.id,
    metadata: item.metadata,
  };
};

// validate News
export function validateNews(item: News): boolean {
  return (
    Array.isArray(item.avatarImage) &&
    typeof item.text === "string" &&
    // typeof item.details_page === "string" &&
    typeof item.heading === "string" &&
    typeof item.title === "string" &&
    Array.isArray(item.heading_image_url) &&
    Array.isArray(item.images) &&
    typeof item.id === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}

export function validateNewsDDB(item: NewsDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.avatarImage === "string" &&
    typeof item.text === "string" &&
    // typeof item.details_page === "string" &&
    typeof item.heading === "string" &&
    typeof item.title === "string" &&
    typeof item.heading_image_url === "string" &&
    Array.isArray(item.images) &&
    typeof item.id === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  ); // && validateNews(item) // Recursively validate the nested News object
}
