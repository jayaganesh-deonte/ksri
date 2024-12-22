// {
//     "id": "",
//     "name": "Dr.V.Kameswari",
//     "designation": "Former Director",
//     "displayImage": "https://d30y75l38k1y9.cloudfront.net/upload/faculty/dr-v-kameswari.jpg",
//     "subtitle": "Areas of Specialisation: Sahitya, Language and Literature, Scientific literature",
//     "description": "More than 35 years of teaching and research experience.\nGuided many Research Scholars to work on ancient sciences and varied fields of their interest.",
//     "mobile": "",
//     "mail": "",
//     "profile": "https://d30y75l38k1y9.cloudfront.net/upload/media/Dr.V.Kameswari CV.docx"
// }

// create model

export type FacultyType = "ACADEMIC" | "NON ACADEMIC";

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  displayImage: [string];
  subtitle: string;
  description: string;
  mobile: string;
  mail: string;
  profile: [string];
  type: FacultyType;
  metadata?: { [key: string]: string };
  orderId?: string;
}

export interface FacultyDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  name: string;
  designation: string;
  displayImage: string;
  subtitle: string;
  description: string;
  mobile: string;
  mail: string;
  profile: string;
  type: FacultyType;
  metadata?: { [key: string]: string };
  orderId?: string;
}

export function toDynamoDB(item: Faculty): FacultyDDB {
  return {
    PK: item.name,
    SK: item.id,
    entityType: "ENTITYTYPE#FACULTY",
    id: item.id,
    name: item.name,
    designation: item.designation,
    displayImage: item.displayImage[0],
    subtitle: item.subtitle,
    description: item.description,
    mobile: item.mobile,
    mail: item.mail,
    profile: item.profile[0],
    type: item.type,
    metadata: item.metadata,
    orderId: item.orderId,
  };
}

export function isFacultyDDB(item: any): item is FacultyDDB {
  return (
    typeof item === "object" &&
    item !== null &&
    "PK" in item &&
    "SK" in item &&
    "entityType" in item &&
    "id" in item &&
    "name" in item &&
    "designation" in item &&
    "displayImage" in item &&
    "subtitle" in item &&
    "description" in item &&
    "mobile" in item &&
    "mail" in item &&
    "profile" in item &&
    "type" in item &&
    "metadata" in item &&
    "orderId" in item
  );
}

export function fromDynamoDB(item: FacultyDDB): Faculty {
  return {
    id: item.SK,
    name: item.name,
    designation: item.designation,
    displayImage: [item.displayImage],
    subtitle: item.subtitle,
    description: item.description,
    mobile: item.mobile,
    mail: item.mail,
    profile: [item.profile],
    type: item.type,
    metadata: item.metadata,
    orderId: item.orderId,
  };
}

export function isFaculty(item: any): item is Faculty {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    "name" in item &&
    "designation" in item &&
    "displayImage" in item &&
    "subtitle" in item &&
    "description" in item &&
    "mobile" in item &&
    "mail" in item &&
    "profile" in item &&
    "type" in item &&
    "metadata" in item &&
    "orderId" in item
  );
}

export function validateFacultyDDB(item: FacultyDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.designation === "string" &&
    typeof item.displayImage === "string" &&
    typeof item.subtitle === "string" &&
    typeof item.description === "string" &&
    typeof item.mobile === "string" &&
    typeof item.mail === "string" &&
    typeof item.profile === "string" &&
    (item.type === "ACADEMIC" || item.type === "NON ACADEMIC") &&
    typeof item.metadata === "object" &&
    (item.orderId === undefined || typeof item.orderId === "string")
  );
}

export function validateFaculty(item: Faculty): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.designation === "string" &&
    Array.isArray(item.displayImage) &&
    item.displayImage.every((image: any) => typeof image === "string") &&
    // typeof item.displayImage  &&
    typeof item.subtitle === "string" &&
    typeof item.description === "string" &&
    typeof item.mobile === "string" &&
    typeof item.mail === "string" &&
    Array.isArray(item.profile) &&
    item.profile.every((profile: any) => typeof profile === "string") &&
    (item.type === "ACADEMIC" || item.type === "NON ACADEMIC") &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    (item.orderId === undefined || typeof item.orderId === "string")
  );
}
