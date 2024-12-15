// Regular Project model for application use
export interface Project {
  id: string;
  title: string;
  subTitle: string; // Made required since all project types have it
  completedYear?: string; // Optional as only completed projects have years
  status: "Completed" | "On-Going" | "Future Projects"; // Using literal types for status
  metadata?: { [key: string]: string };
}

// DynamoDB specific model
export interface ProjectDDB {
  PK: string; // Will be constructed from title
  SK: string; // Will be constructed from status
  entityType: string;
  id: string;
  title: string;
  subTitle: string;
  completedYear?: string;
  status: string;
  metadata?: { [key: string]: string };
}

// Convert DynamoDB record to application model
export function fromDynamoDB(item: ProjectDDB): Project {
  return {
    id: item.id,
    title: item.title,
    subTitle: item.subTitle,
    completedYear: item.completedYear,
    status: item.status as Project["status"],
    metadata: item.metadata,
  };
}

// Convert application model to DynamoDB record
export function toDynamoDB(project: Project): ProjectDDB {
  // Create a URL-friendly version of the title for the PK

  return {
    PK: project.status,
    SK: project.id,
    entityType: "ENTITYTYPE#PROJECT",
    id: project.id,
    title: project.title,
    subTitle: project.subTitle,
    completedYear: project.completedYear,
    status: project.status,
    metadata: project.metadata,
  };
}

// Type guard to check if an object is a valid ProjectDDB
export function isProjectDDB(item: any): item is ProjectDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.subTitle === "string" &&
    typeof item.status === "string" &&
    (typeof item.completedYear === "undefined" ||
      typeof item.completedYear === "string") &&
    (typeof item.metadata === "undefined" ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string")))
  );
}

// Helper function to validate project data
export function validateProject(project: Partial<Project>): project is Project {
  if (!project.id || !project.title || !project.status || !project.subTitle) {
    return false;
  }

  // Additional validation based on status
  if (project.status === "Completed" && !project.completedYear) {
    return false;
  }

  return true;
}
