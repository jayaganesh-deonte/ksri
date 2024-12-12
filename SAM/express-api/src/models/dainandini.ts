// {
//  id: "",
//     audioFile:
//       "https://d30y75l38k1y9.cloudfront.net/upload/media/mk-dainandini-2-11-24.mp3",
//     sanskritLine1: "अनार्यमार्यवृत्तेन सत्येनानृतवादितम्।",
//     sanskritLine2: "रिपुमप्युपकारेण वशीकुर्वन्ति साधव:॥",
//     description:
//       "Good people win over the bad souls by their good conduct; untruthful with truth and even the enemies by favouring them.",
//   }

// create model

export interface Dainandini {
  id: string;
  audioFile: string[];
  sanskritLine1: string;
  sanskritLine2: string;
  description: string;
}

export interface DainandiniDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  audioFile: string;
  sanskritLine1: string;
  sanskritLine2: string;
  description: string;
}

// from dynamodb

export function fromDynamoDB(item: DainandiniDDB): Dainandini {
  return {
    id: item.id,
    audioFile: [item.audioFile],
    sanskritLine1: item.sanskritLine1,
    sanskritLine2: item.sanskritLine2,
    description: item.description,
  };
}

export function toDynamoDB(item: Dainandini): DainandiniDDB {
  return {
    PK: item.id,
    SK: item.id,
    entityType: "ENTITYTYPE#DAINANDINI",
    id: item.id,
    audioFile: item.audioFile[0],
    sanskritLine1: item.sanskritLine1,
    sanskritLine2: item.sanskritLine2,
    description: item.description,
  };
}

// validate Dynandini

export function validateDainandini(dainandini: Dainandini): boolean {
  return (
    typeof dainandini.id === "string" &&
    Array.isArray(dainandini.audioFile) &&
    typeof dainandini.sanskritLine1 === "string" &&
    typeof dainandini.sanskritLine2 === "string" &&
    typeof dainandini.description === "string"
  );
}
