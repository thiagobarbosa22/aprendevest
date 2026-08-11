export { getDatabase, isDatabaseConfigured } from "./client";
export {
  createExamDraft,
  createSubjectDraft,
  getPublishedExam,
  getPublishedSubject,
  listEditorialExams,
  listPublishedExams,
  listPublishedSubjects,
  publishExam,
  transitionExamStatus,
} from "./catalog/repository";
export {
  completeProfile,
  createDatabaseSession,
  createStudent,
  deleteAllUserSessions,
  deleteDatabaseSession,
  findActiveUserByEmail,
  findSession,
  getUserPrivacyExport,
  requestUserDeletion,
  type ActiveUser,
} from "./identity/repository";
export * as schema from "./schema";
export { databaseHealth } from "./system/database-health";
