export type EventCategory =
  | "Upcoming"
  | "Seminars"
  | "Endowment Lectures"
  | "Workshop"
  | "Viva"
  | "Events"
  | "All";

export interface Event {
  title: string;
  subtitle: string;
  description: string;
  category: EventCategory[];
  venue: string;
  date: string;
  images: string[];
  id: string;
}

export interface EventDDB extends Event {
  PK: string;
  SK: string;
  entityType: string;
}

export function isEvent(item: any): item is Event {
  return (
    typeof item === "object" &&
    typeof item.title === "string" &&
    typeof item.subtitle === "string" &&
    typeof item.description === "string" &&
    Array.isArray(item.category) &&
    typeof item.venue === "string" &&
    typeof item.date === "string" &&
    Array.isArray(item.images) &&
    typeof item.id === "string"
  );
}

export function isEventDDB(item: any): item is EventDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.title === "string" &&
    typeof item.subtitle === "string" &&
    typeof item.description === "string" &&
    Array.isArray(item.category) &&
    typeof item.venue === "string" &&
    typeof item.date === "string" &&
    Array.isArray(item.images) &&
    typeof item.id === "string"
  );
}

export function validateEvent(event: Partial<Event>): boolean {
  return (
    typeof event.title === "string" &&
    typeof event.subtitle === "string" &&
    typeof event.description === "string" &&
    Array.isArray(event.category) &&
    typeof event.venue === "string" &&
    typeof event.date === "string" &&
    Array.isArray(event.images) &&
    typeof event.id === "string"
  );
}

export function fromDynamoDB(item: EventDDB): Event {
  return {
    title: item.title,
    subtitle: item.subtitle,
    description: item.description,
    category: item.category,
    venue: item.venue,
    date: item.date,
    images: item.images,
    id: item.id,
  };
}

export function toDynamoDB(item: Event): EventDDB {
  return {
    PK: item.title,
    SK: item.id,
    entityType: "ENTITYTYPE#EVENT",
    title: item.title,
    subtitle: item.subtitle,
    description: item.description,
    category: item.category,
    venue: item.venue,
    date: item.date,
    images: item.images,
    id: item.id,
  };
}
