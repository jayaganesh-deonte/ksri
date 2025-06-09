import { convertAmountToWords } from "../../services/convertAmountToWords";

export interface Payment {
  paymentType: string;
  amount: number;
  amountInWords?: string;
  paymentDate: string;
  paymentStatus: string;
  name: string;
  orderId: string;
  email: string;
  phoneNumber: string;
  paymentRefId: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
  paymentMethod: string;
  bookName: string;
  bookId?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentDDB {
  PK: string;
  SK: string;
  entityType: string;
  paymentType: string;
  amount: number;
  amountInWords: string;
  paymentDate: string;
  paymentStatus: string;
  name: string;
  orderId: string;
  email: string;
  phoneNumber: string;
  paymentRefId: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
  paymentMethod: string;
  bookName: string;
  bookId?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export function validatePaymentDDB(item: PaymentDDB): boolean {
  return (
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.paymentType === "string" &&
    typeof item.amount === "number" &&
    typeof item.paymentDate === "string" &&
    typeof item.paymentStatus === "string" &&
    typeof item.name === "string" &&
    typeof item.orderId === "string" &&
    typeof item.email === "string" &&
    typeof item.phoneNumber === "string" &&
    typeof item.paymentRefId === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string" &&
    typeof item.paymentMethod === "string" &&
    typeof item.address === "string" &&
    typeof item.city === "string" &&
    typeof item.state === "string" &&
    typeof item.zip === "string" &&
    typeof item.country === "string"
  );
}

export function toDynamoDB(item: Payment): PaymentDDB {
  return {
    PK: `ENTITYTYPE#PAYMENT#PURCHASE#EBOOK`,
    SK: item.paymentRefId,
    entityType: `ENTITYTYPE#PAYMENT#PURCHASE#EBOOK`,
    paymentType: item.paymentType,
    amount: item.amount,
    amountInWords: convertAmountToWords(item.amount),
    paymentDate: item.paymentDate,
    paymentStatus: item.paymentStatus,
    name: item.name,
    orderId: item.orderId,
    email: item.email,
    phoneNumber: item.phoneNumber,
    paymentRefId: item.paymentRefId,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
    paymentMethod: item.paymentMethod,
    bookName: item.bookName,
    bookId: item.bookId,
    passportNumber: item.passportNumber,
    passportExpiryDate: item.passportExpiryDate,
    address: item.address,
    city: item.city,
    state: item.state,
    zip: item.zip,
    country: item.country,
  };
}

export function fromDynamoDB(item: PaymentDDB): Payment {
  return {
    paymentType: item.paymentType,
    amount: item.amount,
    amountInWords: item.amountInWords,
    paymentDate: item.paymentDate,
    paymentStatus: item.paymentStatus,
    name: item.name,
    orderId: item.orderId,
    email: item.email,
    phoneNumber: item.phoneNumber,
    paymentRefId: item.paymentRefId,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
    paymentMethod: item.paymentMethod,
    bookName: item.bookName,
    bookId: item.bookId,
    passportNumber: item.passportNumber,
    passportExpiryDate: item.passportExpiryDate,
    address: item.address,
    city: item.city,
    state: item.state,
    zip: item.zip,
    country: item.country,
  };
}

export function validatePayment(item: Payment): boolean {
  return (
    typeof item.paymentType === "string" &&
    typeof item.amount === "string" &&
    typeof item.paymentDate === "string" &&
    typeof item.paymentStatus === "string" &&
    typeof item.name === "string" &&
    // typeof item.orderId === "string" &&
    typeof item.email === "string" &&
    typeof item.phoneNumber === "string" &&
    typeof item.paymentRefId === "string" &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string" &&
    typeof item.paymentMethod === "string" &&
    typeof item.bookName === "string" &&
    typeof item.address === "string" &&
    typeof item.city === "string" &&
    typeof item.state === "string" &&
    typeof item.zip === "string" &&
    typeof item.country === "string"
  );
}
