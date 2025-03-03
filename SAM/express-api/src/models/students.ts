// {
//   "id": "",
//     "name": "A.R.Panduranga Rao",
//     "course": "Ph.D.",
//     "areaOfStudy": "Critical study of Nyaya vivarana of Ananda Tirtha",
//     "supervisor": "Dr. S.S. Janaki",
//     "status": "Completed" || "Ongoing",
// }

// crete model
export interface Student {
  id: string;
  name: string;
  course: string;
  areaOfStudy: string;
  supervisor: string;
  status: string;
  startedYear: string;
  completedYear?: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}

export interface StudentDDB {
  PK: string;
  SK: string;
  entityType: string;
  name: string;
  course: string;
  areaOfStudy: string;
  supervisor: string;
  status: string;
  startedYear: string;
  completedYear?: string;
  metadata?: { [key: string]: string };
  itemPublishStatus: string;
}

export function toDynamoDB(student: Student): StudentDDB {
  return {
    PK: "ENTITYTYPE#STUDENT",
    SK: student.id,
    entityType: "ENTITYTYPE#STUDENT",
    name: student.name,
    course: student.course,
    areaOfStudy: student.areaOfStudy,
    supervisor: student.supervisor,
    status: student.status,
    startedYear: student.startedYear,
    completedYear: student.completedYear,
    metadata: student.metadata,
    itemPublishStatus: student.itemPublishStatus,
  };
}

export function isStudentDDB(item: any): item is StudentDDB {
  return (
    typeof item === "object" &&
    typeof item.PK === "string" &&
    typeof item.SK === "string" &&
    typeof item.entityType === "string" &&
    typeof item.name === "string" &&
    typeof item.course === "string" &&
    typeof item.areaOfStudy === "string" &&
    typeof item.supervisor === "string" &&
    typeof item.status === "string" &&
    typeof item.startedYear === "string" &&
    (typeof item.completedYear === "undefined" ||
      typeof item.completedYear === "string") &&
    (item.metadata === undefined ||
      (typeof item.metadata === "object" &&
        Object.values(item.metadata).every((v) => typeof v === "string"))) &&
    typeof item.itemPublishStatus === "string"
  );
}

export function fromDynamoDB(item: StudentDDB): Student {
  return {
    id: item.SK,
    name: item.name,
    course: item.course,
    areaOfStudy: item.areaOfStudy,
    supervisor: item.supervisor,
    status: item.status,
    startedYear: item.startedYear,
    completedYear: item.completedYear,
    metadata: item.metadata,
    itemPublishStatus: item.itemPublishStatus,
  };
}

export function validateStudent(student: Partial<Student>): boolean {
  return (
    typeof student.name === "string" &&
    typeof student.course === "string" &&
    typeof student.areaOfStudy === "string" &&
    typeof student.supervisor === "string" &&
    typeof student.status === "string" &&
    typeof student.startedYear === "string" &&
    (typeof student.completedYear === "undefined" ||
      typeof student.completedYear === "string") &&
    typeof student.id === "string" &&
    (typeof student.metadata === "undefined" ||
      (typeof student.metadata === "object" &&
        Object.values(student.metadata).every((v) => typeof v === "string"))) &&
    typeof student.itemPublishStatus === "string"
  );
}
