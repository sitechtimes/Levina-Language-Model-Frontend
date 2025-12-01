export interface CreateCourse {
  id: number;
  joinCode: string;
  subject: number;
}

// https://nuxt.com/docs/guide/directory-structure/composables#how-files-are-scanned
export * from "./types/subjects";
export * from "./types/assignments";
export * from "./types/courses";
