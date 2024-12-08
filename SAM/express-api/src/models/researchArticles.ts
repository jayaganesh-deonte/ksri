// {
//  "id": " "
//     "title": "MINING AND METALLURGY",
//     "subTitle": "A survey of Sanskrit literature would bring out the fact that the mining and metallurgical sciences were part of the social life in ancient India.",
//     "author": "Dr. K.S. Balasubramanian, Deputy Director, K.S.R.I. Institute, Chennai",
//     "link": "https://d30y75l38k1y9.cloudfront.net/upload/media/1 Mining and Metallurgy.pdf"
// }

// create model
export interface ResearchArticle {
  id: string;
  title: string;
  subTitle: string;
  author: string;
  link: string;
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
    typeof item.link === "string"
  );
}

export function validateResearchArticle(item: ResearchArticle): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.subTitle === "string" &&
    typeof item.author === "string" &&
    typeof item.link === "string"
  );
}

export function fromDynamoDB(item: ResearchArticleDDB): ResearchArticle {
  return {
    id: item.id,
    title: item.title,
    subTitle: item.subTitle,
    author: item.author,
    link: item.link,
  };
}

export function toDynamoDB(item: ResearchArticle): ResearchArticleDDB {
  return {
    PK: item.title,
    SK: item.id,
    entityType: "ENTITYTYPE#RESEARCHARTICLE",
    id: item.id,
    title: item.title,
    subTitle: item.subTitle,
    author: item.author,
    link: item.link,
  };
}
