// {
//     "id": "",
//     "Title": "Analytic Tendency in Tamil",
//     "Author": "Varadarajan, M.",
//     "Jounal": "Annals of Oriental Research",
//     "Volume #": "XIII",
//     "Year": 1957,
//     "Remarks": "-"
// }

//  create model
export interface Article {
  id: string;
  title: string;
  author: string;
  journal: string;
  volume: string;
  year: number;
  remarks: string;
}

// DynamoDB specific model
export interface ArticleDDB {
  PK: string;
  SK: string;
  entityType: string;
  title: string;
  author: string;
  journal: string;
  volume: string;
  year: number;
  remarks: string;
}

export function toDynamoDB(item: Article): ArticleDDB {
  return {
    PK: item.title,
    SK: item.id,
    entityType: "ENTITYTYPE#ARTICLE",
    title: item.title,
    author: item.author,
    journal: item.journal,
    volume: item.volume,
    year: item.year,
    remarks: item.remarks,
  };
}

export function fromDynamoDB(item: ArticleDDB): Article {
  return {
    id: item.SK,
    title: item.title,
    author: item.author,
    journal: item.journal,
    volume: item.volume,
    year: item.year,
    remarks: item.remarks,
  };
}

export function isArticleDDB(item: any): item is ArticleDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.title === "string" &&
    typeof item.author === "string" &&
    typeof item.journal === "string" &&
    typeof item.volume === "string" &&
    typeof item.year === "number" &&
    typeof item.remarks === "string"
  );
}

export function isArticle(item: any): item is Article {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.author === "string" &&
    typeof item.journal === "string" &&
    typeof item.volume === "string" &&
    typeof item.year === "number" &&
    typeof item.remarks === "string"
  );
}

export function validateArticle(item: Article): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.author === "string" &&
    typeof item.journal === "string" &&
    typeof item.volume === "string" &&
    typeof item.year === "number" &&
    typeof item.remarks === "string"
  );
}
