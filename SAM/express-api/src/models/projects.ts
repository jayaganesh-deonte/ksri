// Regular Project model for application use
export interface Project {
  id: string;
  title: string;
  subTitle: string; // Made required since all project types have it
  startYear?: string; // Optional start year for all projects
  completedYear?: string; // Optional as only completed projects have years
  status: "Completed" | "On-Going" | "Future Projects"; // Using literal types for status
  metadata?: { [key: string]: string };
  sponsor?: string; // Optional sponsor field for projects
}

// DynamoDB specific model
export interface ProjectDDB {
  PK: string; // Will be constructed from title
  SK: string; // Will be constructed from status
  entityType: string;
  id: string;
  title: string;
  subTitle: string;
  startYear?: string;
  completedYear?: string;
  status: string;
  metadata?: { [key: string]: string };
  sponsor?: string;
}

// Convert DynamoDB record to application model
export function fromDynamoDB(item: ProjectDDB): Project {
  return {
    id: item.id,
    title: item.title,
    subTitle: item.subTitle,
    startYear: item.startYear,
    completedYear: item.completedYear,
    status: item.status as Project["status"],
    metadata: item.metadata,
    sponsor: item.sponsor,
  };
}

// Convert application model to DynamoDB record
export function toDynamoDB(project: Project): ProjectDDB {
  // Create a URL-friendly version of the title for the PK
  console.log("project toDynamoDB", project);

  return {
    PK: project.status,
    SK: project.id,
    entityType: "ENTITYTYPE#PROJECT",
    id: project.id,
    title: project.title,
    subTitle: project.subTitle,
    startYear: project.startYear,
    completedYear: project.completedYear,
    status: project.status,
    metadata: project.metadata,
    sponsor: project.sponsor,
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
    (typeof item.startYear === "undefined" ||
      typeof item.startYear === "string") &&
    (typeof item.completedYear === "undefined" ||
      typeof item.completedYear === "string") &&
    (typeof item.metadata === "undefined" ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    (typeof item.sponsor === "undefined" || typeof item.sponsor === "string")
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
