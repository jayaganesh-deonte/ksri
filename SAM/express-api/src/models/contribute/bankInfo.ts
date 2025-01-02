// {
//  "id": "",
//     "name": "THE KUPPUSWAMI SASTRI RESEARCH INSTITUTE.",
//     "bankName": "Union Bank of India, Mylapore Branch.",
//     "accountNo.": "395702010007408.",
//     "IFSC CODE": "UBIN0539571.",
//     "MICR NO.": "600026009"
// }

export interface BankInfo {
  id: string;
  name: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
  micr: string;
  itemPublishStatus: string;
}

export interface BankInfoDDB {
  PK: string;
  SK: string;
  entityType: string;
  name: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
  micr: string;
  itemPublishStatus: string;
}

export function isBankInfoDDB(item: any): item is BankInfoDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.name === "string" &&
    typeof item.bankName === "string" &&
    typeof item.accountNo === "string" &&
    typeof item.ifsc === "string" &&
    typeof item.micr === "string" &&
    typeof item.itemPublishStatus === "string"
  );
}

export function toDynamoDB(item: BankInfo): BankInfoDDB {
  return {
    PK: "ENTITYTYPE#BANKINFO",
    SK: item.id,
    entityType: "ENTITYTYPE#BANKINFO",
    name: item.name,
    bankName: item.bankName,
    accountNo: item.accountNo,
    ifsc: item.ifsc,
    micr: item.micr,
    itemPublishStatus: item.itemPublishStatus,
  };
}

export function fromDynamoDB(item: BankInfoDDB): BankInfo {
  return {
    id: item.SK,
    name: item.name,
    bankName: item.bankName,
    accountNo: item.accountNo,
    ifsc: item.ifsc,
    micr: item.micr,
    itemPublishStatus: item.itemPublishStatus,
  };
}

export function isBankInfo(item: any): item is BankInfo {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.bankName === "string" &&
    typeof item.accountNo === "string" &&
    typeof item.ifsc === "string" &&
    typeof item.micr === "string" &&
    typeof item.itemPublishStatus === "string"
  );
}
