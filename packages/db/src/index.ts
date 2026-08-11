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
  addContentNote,
  createLessonDraft,
  getContentProgress,
  getPublishedLesson,
  listContentNotes,
  listContentEditorOptions,
  listEditorialContent,
  listPublishedLessons,
  publishContent,
  saveContentProgress,
  transitionContentStatus,
} from "./content/repository";
export {
  demoQuestions,
  listErrors,
  listPublishedQuestions,
  submitQuestionAttempt,
} from "./assessment/repository";
export {
  demoPaper,
  getPaperQuestions,
  getPublishedPaper,
  listPublishedPapers,
  startExamRun,
  updateExamRun,
} from "./exam-paper/repository";
export {
  completeStudyTask,
  createStudyPlan,
  getActiveStudyPlan,
  getPerformance,
  gradeReview,
  listDiagnosticTopics,
  listDueReviews,
} from "./study-plan/repository";
export {
  getSimulationQuestions,
  listSimulationHistory,
  startSimulation,
  updateSimulation,
} from "./simulation/repository";
export {
  deleteUserEssay,
  demoEssayTheme,
  isFeatureEnabled,
  listPublishedEssayThemes,
  listFeatureStatuses,
  listUserEssays,
  saveEssaySubmission,
  type FeatureKey,
} from "./expansion/repository";
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
