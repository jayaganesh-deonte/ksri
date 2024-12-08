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

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  displayImage: string;
  subtitle: string;
  description: string;
  mobile: string;
  mail: string;
  profile: string;
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
}

export function toDynamoDB(item: Faculty): FacultyDDB {
  return {
    PK: item.name,
    SK: item.id,
    entityType: "ENTITYTYPE#FACULTY",
    id: item.id,
    name: item.name,
    designation: item.designation,
    displayImage: item.displayImage,
    subtitle: item.subtitle,
    description: item.description,
    mobile: item.mobile,
    mail: item.mail,
    profile: item.profile,
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
    "profile" in item
  );
}

export function fromDynamoDB(item: FacultyDDB): Faculty {
  return {
    id: item.SK,
    name: item.name,
    designation: item.designation,
    displayImage: item.displayImage,
    subtitle: item.subtitle,
    description: item.description,
    mobile: item.mobile,
    mail: item.mail,
    profile: item.profile,
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
    "profile" in item
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
    typeof item.profile === "string"
  );
}

export function validateFaculty(item: Faculty): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.designation === "string" &&
    typeof item.displayImage === "string" &&
    typeof item.subtitle === "string" &&
    typeof item.description === "string" &&
    typeof item.mobile === "string" &&
    typeof item.mail === "string" &&
    typeof item.profile === "string"
  );
}
