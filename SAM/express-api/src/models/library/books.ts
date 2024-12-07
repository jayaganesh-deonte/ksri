// {
//  "id"
//     "Accession No": 37621,
//     "Book Title": "",
//     "Author": "-",
//     "Editor": "-",
//     "Publisher": "-",
//     "Remarks": "-"
// }

//  create model
export interface Book {
  id: string;
  title: string;
  accessionNo: string;
  author: string;
  editor: string;
  publisher: string;
  remarks: string;
}

// DynamoDB specific model
export interface BookDDB {
  PK: string;
  SK: string;
  entityType: string;
  title: string;
  accessionNo: string;
  author: string;
  editor: string;
  publisher: string;
  remarks: string;
}

export function toDynamoDB(item: Book): BookDDB {
  return {
    PK: item.title,
    SK: item.id,
    entityType: "ENTITYTYPE#BOOK",
    title: item.title,
    accessionNo: item.accessionNo,
    author: item.author,
    editor: item.editor,
    publisher: item.publisher,
    remarks: item.remarks,
  };
}

export function fromDynamoDB(item: BookDDB): Book {
  return {
    id: item.SK,
    title: item.title,
    accessionNo: item.accessionNo,
    author: item.author,
    editor: item.editor,
    publisher: item.publisher,
    remarks: item.remarks,
  };
}

export function isBookDDB(item: any): item is BookDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.title === "string" &&
    typeof item.accessionNo === "string" &&
    typeof item.author === "string" &&
    typeof item.editor === "string" &&
    typeof item.publisher === "string" &&
    typeof item.remarks === "string"
  );
}

export function isBook(item: any): item is Book {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.accessionNo === "string" &&
    typeof item.author === "string" &&
    typeof item.editor === "string" &&
    typeof item.publisher === "string" &&
    typeof item.remarks === "string"
  );
}

export function validateBook(item: Book): boolean {
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.accessionNo === "string" &&
    typeof item.author === "string" &&
    typeof item.editor === "string" &&
    typeof item.publisher === "string" &&
    typeof item.remarks === "string"
  );
}
