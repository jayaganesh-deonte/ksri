export interface HomeDialog {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  metadata?: { [key: string]: string };
}

export interface HomeDialogDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  metadata?: { [key: string]: string };
}

export function validateHomeDialog(homeDialog: HomeDialog): boolean {
  return (
    typeof homeDialog.id === "string" &&
    typeof homeDialog.title === "string" &&
    typeof homeDialog.description === "string" &&
    typeof homeDialog.buttonText === "string" &&
    typeof homeDialog.buttonLink === "string" &&
    (homeDialog.metadata === undefined ||
      (typeof homeDialog.metadata === "object" &&
        Object.values(homeDialog.metadata).every((v) => typeof v === "string")))
  );
}

// fromDynamoDB
export function fromDynamoDB(homeDialogDDB: HomeDialogDDB): HomeDialog {
  return {
    id: homeDialogDDB.id,
    title: homeDialogDDB.title,
    description: homeDialogDDB.description,
    buttonText: homeDialogDDB.buttonText,
    buttonLink: homeDialogDDB.buttonLink,
    metadata: homeDialogDDB.metadata,
  };
}

// toDynamoDB
export function toDynamoDB(homeDialog: HomeDialog): HomeDialogDDB {
  return {
    PK: homeDialog.id,
    SK: homeDialog.id,
    entityType: "ENTITYTYPE#HOMEDIALOG",
    id: homeDialog.id,
    title: homeDialog.title,
    description: homeDialog.description,
    buttonText: homeDialog.buttonText,
    buttonLink: homeDialog.buttonLink,
    metadata: homeDialog.metadata,
  };
}
