export { getDatabase } from "./client";
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
