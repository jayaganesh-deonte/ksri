export interface BookMark {
  userEmail: string;
  bookId: String;
  bookMarks: Object;
}

export interface BookMarkDDB {
  PK: string;
  SK: string;
  entityType: string;
  userEmail: string;
  bookId: String;
  bookMarks: Object;
}

export function validateBookMarkDDB(item: BookMarkDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.userEmail === "string" &&
    typeof item.bookId === "string"
  );
}

export function validateBookMark(item: BookMark): boolean {
  return typeof item.userEmail === "string" && typeof item.bookId === "string";
}

export function toDynamoDB(BookMark: BookMark): BookMarkDDB {
  return {
    PK: `ENTITYTYPE#BOOKMARK`,
    SK: `BOOKMARK#${BookMark.userEmail}#${BookMark.bookId}`,
    entityType: "ENTITYTYPE#BOOKMARK",
    userEmail: BookMark.userEmail,
    bookId: BookMark.bookId,
    bookMarks: BookMark.bookMarks,
  };
}

export function fromDynamoDB(BookMarkDDB: BookMarkDDB): BookMark {
  return {
    userEmail: BookMarkDDB.userEmail,
    bookId: BookMarkDDB.bookId,
    bookMarks: BookMarkDDB.bookMarks,
  };
}
