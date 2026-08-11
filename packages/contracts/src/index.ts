export {
  apiErrorResponseSchema,
  healthResponseSchema,
  type ApiErrorResponse,
  type HealthResponse,
} from "./system";
export {
  loginSchema,
  onboardingSchema,
  registrationSchema,
  userRoleSchema,
  type LoginInput,
  type OnboardingInput,
  type RegistrationInput,
  type UserRole,
} from "./identity";
export {
  examDraftSchema,
  subjectDraftSchema,
  type ExamDraftInput,
  type SubjectDraftInput,
} from "./catalog";
export {
  contentBlockSchema,
  contentNoteSchema,
  contentProgressSchema,
  lessonDraftSchema,
  type ContentBlock,
  type ContentNoteInput,
  type ContentProgressInput,
  type LessonDraftInput,
} from "./content";
export {
  errorClassificationSchema,
  questionAttemptSchema,
  type QuestionAttemptInput,
} from "./assessment";
export { examRunUpdateSchema, type ExamRunUpdateInput } from "./exam-paper";
export {
  simulationStartSchema,
  simulationUpdateSchema,
  type SimulationStartInput,
  type SimulationUpdateInput,
} from "./simulation";
export { essayDraftSchema, type EssayDraftInput } from "./essay";
