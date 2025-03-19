// {
//     "id": "",
//     "orderId": "",
//     "image": []
// }

// crete model
export interface SlideShow {
  id: string;
  orderId: string;
  image: string[];
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
  titleText: string;
  descriptionText: string;
  buttonText1: string;
  buttonText1Route: string;
  buttonText2: string;
  buttonText2Route: string;
}

export function isSlideShow(item: any): item is SlideShow {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.orderId === "string" &&
    Array.isArray(item.image) &&
    item.image.every((image: any) => typeof image === "string") &&
    typeof item.titleText === "string" &&
    typeof item.descriptionText === "string" &&
    typeof item.buttonText1 === "string" &&
    typeof item.buttonText1Route === "string" &&
    typeof item.buttonText2 === "string" &&
    typeof item.buttonText2Route === "string"
  );
}

export interface SlideShowDDB {
  PK: string;
  SK: string;
  entityType: string;
  id: string;
  orderId: string;
  image: string[];
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
  titleText: string;
  descriptionText: string;
  buttonText1: string;
  buttonText1Route: string;
  buttonText2: string;
  buttonText2Route: string;
}

export function toDynamoDB(slideShow: SlideShow): SlideShowDDB {
  return {
    PK: "ENTITYTYPE#SLIDESHOW",
    SK: slideShow.id,
    entityType: "ENTITYTYPE#SLIDESHOW",
    orderId: slideShow.orderId,
    image: slideShow.image,
    id: slideShow.id,
    metadata: slideShow.metadata,
    itemPublishStatus: slideShow.itemPublishStatus,
    titleText: slideShow.titleText,
    descriptionText: slideShow.descriptionText,
    buttonText1: slideShow.buttonText1,
    buttonText1Route: slideShow.buttonText1Route,
    buttonText2: slideShow.buttonText2,
    buttonText2Route: slideShow.buttonText2Route,
  };
}

export function fromDynamoDB(item: SlideShowDDB): SlideShow {
  return {
    id: item.SK,
    orderId: item.orderId,
    image: item.image,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
    titleText: item.titleText,
    descriptionText: item.descriptionText,
    buttonText1: item.buttonText1,
    buttonText1Route: item.buttonText1Route,
    buttonText2: item.buttonText2,
    buttonText2Route: item.buttonText2Route,
  };
}

export function validateSlideShow(slideShow: Partial<SlideShow>): boolean {
  return (
    typeof slideShow.id === "string" &&
    typeof slideShow.orderId === "string" &&
    Array.isArray(slideShow.image) &&
    slideShow.image.every((image: any) => typeof image === "string") &&
    typeof slideShow.titleText === "string" &&
    typeof slideShow.descriptionText === "string" &&
    typeof slideShow.buttonText1 === "string" &&
    typeof slideShow.buttonText1Route === "string" &&
    typeof slideShow.buttonText2 === "string" &&
    typeof slideShow.buttonText2Route === "string"
  );
}

export function validateSlideShowDDB(
  slideShow: Partial<SlideShowDDB>
): boolean {
  return (
    typeof slideShow.PK === "string" &&
    typeof slideShow.SK === "string" &&
    typeof slideShow.entityType === "string" &&
    typeof slideShow.orderId === "string" &&
    Array.isArray(slideShow.image) &&
    slideShow.image.every((image: any) => typeof image === "string") &&
    typeof slideShow.titleText === "string" &&
    typeof slideShow.descriptionText === "string" &&
    typeof slideShow.buttonText1 === "string" &&
    typeof slideShow.buttonText1Route === "string" &&
    typeof slideShow.buttonText2 === "string" &&
    typeof slideShow.buttonText2Route === "string"
  );
}
