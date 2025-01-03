// {
//  "id": " "
//     "title": "MINING AND METALLURGY",
//     "subTitle": "A survey of Sanskrit literature would bring out the fact that the mining and metallurgical sciences were part of the social life in ancient India.",
//     "author": "Dr. K.S. Balasubramanian, Deputy Director, K.S.R.I. Institute, Chennai",
//     "link": "upload/media/1 Mining and Metallurgy.pdf"
// }

// create model
export interface ResearchArticle {
  id: string;
  title: string;
  subTitle: string;
  author: string;
  link: string[];
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}
export interface ResearchArticleDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  title: string;
  subTitle: string;
  author: string;
  link: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}

export function validateResearchArticleDDB(item: ResearchArticleDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.subTitle === "string" &&
    typeof item.author === "string" &&
    typeof item.link === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string"
  );
}

export function validateResearchArticle(item: ResearchArticle): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.subTitle === "string" &&
    typeof item.author === "string" &&
    Array.isArray(item.link) &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string"
  );
}

export function fromDynamoDB(item: ResearchArticleDDB): ResearchArticle {
  return {
    id: item.id,
    title: item.title,
    subTitle: item.subTitle,
    author: item.author,
    link: [item.link],
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
  };
}

export function toDynamoDB(item: ResearchArticle): ResearchArticleDDB {
  return {
    PK: "ENTITYTYPE#RESEARCHARTICLE",
    SK: item.id,
    entityType: "ENTITYTYPE#RESEARCHARTICLE",
    id: item.id,
    title: item.title,
    subTitle: item.subTitle,
    author: item.author,
    link: item.link[0],
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
  };
}
