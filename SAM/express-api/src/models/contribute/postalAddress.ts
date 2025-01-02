// [
//     {
//  id
//         "instituteName": "The Kuppuswami Sastri Research Institute",
//         "address": "84, Thiru vi ka Road, Mylapore, Chennai 600 004.",
//         "email": "ksrinst@gmail.com",
//         "phone": "044-24985320"
//     }
// ]

export interface PostalAddress {
  id: string;
  instituteName: string;
  address: string;
  email: string;
  phone: string;
  itemPublishStatus: string;
}

export interface PostalAddressDDB {
  PK: string;
  SK: string;
  entityType: string;
  instituteName: string;
  address: string;
  email: string;
  phone: string;
  itemPublishStatus: string;
}

export function isPostalAddressDDB(item: any): item is PostalAddressDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.instituteName === "string" &&
    typeof item.address === "string" &&
    typeof item.email === "string" &&
    typeof item.phone === "string" &&
    typeof item.itemPublishStatus === "string"
  );
}

export function isPostalAddress(item: any): item is PostalAddress {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.instituteName === "string" &&
    typeof item.address === "string" &&
    typeof item.email === "string" &&
    typeof item.phone === "string" &&
    typeof item.itemPublishStatus === "string"
  );
}

// from DynamoDB
export function fromDynamoDB(item: PostalAddressDDB): PostalAddress {
  return {
    id: item.SK,
    instituteName: item.instituteName,
    address: item.address,
    email: item.email,
    phone: item.phone,
    itemPublishStatus: item.itemPublishStatus,
  };
}

// to DynamoDB
export function toDynamoDB(item: PostalAddress): PostalAddressDDB {
  return {
    PK: "ENTITYTYPE#POSTALADDRESS",
    SK: item.id,
    entityType: "ENTITYTYPE#POSTALADDRESS",
    instituteName: item.instituteName,
    address: item.address,
    email: item.email,
    phone: item.phone,
    itemPublishStatus: item.itemPublishStatus,
  };
}
