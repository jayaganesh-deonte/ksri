// Regular Project model for application use

// publication status => . Published
// . Inprint
// .Unpublished

export interface Project {
  id: string;
  title: string;
  subTitle: string; // Made required since all project types have it
  description?: string;
  startYear?: string; // Optional start year for all projects
  completedYear?: string; // Optional as only completed projects have years
  status: "Completed" | "On-Going" | "Future Projects"; // Using literal types for status
  metadata?: { [key: string]: string };
  sponsor?: string; // Optional sponsor field for projects
  keywords: string;
  projectSeries?: string;
  projectSubSeries?: string;
  publicationStatus: "Published" | "Inprint" | "Unpublished";
  projectInvestigator: string;
  coProjectInvestigators: string;
  itemPublishStatus: string;
}

// DynamoDB specific model
export interface ProjectDDB {
  PK: string; // Will be constructed from title
  SK: string; // Will be constructed from status
  entityType: string;
  id: string;
  title: string;
  subTitle: string;
  description?: string;
  startYear?: string;
  completedYear?: string;
  status: string;
  metadata?: { [key: string]: string };
  sponsor?: string;
  keywords: string;
  projectSeries?: string;
  projectSubSeries?: string;
  publicationStatus: "Published" | "Inprint" | "Unpublished";
  projectInvestigator: string;
  coProjectInvestigators: string;
  itemPublishStatus: string;
}

// Convert DynamoDB record to application model
export function fromDynamoDB(item: ProjectDDB): Project {
  return {
    id: item.id,
    title: item.title,
    subTitle: item.subTitle,
    description: item.description,
    startYear: item.startYear,
    completedYear: item.completedYear,
    status: item.status as Project["status"],
    metadata: item.metadata,
    sponsor: item.sponsor,
    keywords: item.keywords,
    projectSeries: item.projectSeries,
    projectSubSeries: item.projectSubSeries,
    publicationStatus: item.publicationStatus,
    projectInvestigator: item.projectInvestigator,
    coProjectInvestigators: item.coProjectInvestigators,
    itemPublishStatus: item.itemPublishStatus,
  };
}

// Convert application model to DynamoDB record
export function toDynamoDB(project: Project): ProjectDDB {
  // Create a URL-friendly version of the title for the PK
  // console.log("project toDynamoDB", project);

  return {
    PK: "ENTITYTYPE#PROJECT",
    SK: project.id,
    entityType: "ENTITYTYPE#PROJECT",
    id: project.id,
    title: project.title,
    subTitle: project.subTitle,
    description: project.description,
    startYear: project.startYear,
    completedYear: project.completedYear,
    status: project.status,
    metadata: project.metadata,
    sponsor: project.sponsor,
    keywords: project.keywords,
    projectSeries: project.projectSeries,
    projectSubSeries: project.projectSubSeries,
    publicationStatus: project.publicationStatus,
    projectInvestigator: project.projectInvestigator,
    coProjectInvestigators: project.coProjectInvestigators,
    itemPublishStatus: project.itemPublishStatus,
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
    (typeof item.description === "undefined" ||
      typeof item.description === "string") &&
    typeof item.status === "string" &&
    (typeof item.startYear === "undefined" ||
      typeof item.startYear === "string") &&
    (typeof item.completedYear === "undefined" ||
      typeof item.completedYear === "string") &&
    (typeof item.metadata === "undefined" ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    (typeof item.sponsor === "undefined" || typeof item.sponsor === "string") &&
    typeof item.keywords === "string" &&
    (typeof item.projectSeries === "undefined" ||
      typeof item.projectSeries === "string") &&
    (typeof item.projectSubSeries === "undefined" ||
      typeof item.projectSubSeries === "string") &&
    typeof item.publicationStatus === "string" &&
    typeof item.projectInvestigator === "string" &&
    typeof item.coProjectInvestigators === "string" &&
    typeof item.itemPublishStatus === "string"
  );
}

// Helper function to validate project data
export function validateProject(project: Partial<Project>): project is Project {
  if (!project.id || !project.title || !project.status || !project.subTitle) {
    return false;
  }

  // // Additional validation based on status
  // if (project.status === "Completed" && !project.completedYear) {
  //   return false;
  // }

  return true;
}
