import { tryRequestEndpoint } from "@/utils/functions/fetch";

type LoginResponse = {
  access: string;
  refresh: string;
  name?: string;
  userType?: "Student" | "Teacher";
};

type LoginSuccess = {
  name: string;
} & (
  | {
      userType: "Student";
    //   courses: StudentCourse[];
    }
  | {
      userType: "Teacher";
    //   courses: TeacherCourseNoAssignment[];
    }
);
type LoginFailure =
  | {
      non_field_errors: string[];
    }
  | {
      email: string[];
    };

export const useUserStore = defineStore("userStore", () => {
  const router = useRouter();

  const isAuth = ref(false);
  const isDarkMode = ref(false);
  const showSideMenu = ref(true);
  const name = ref("");
  const userType = ref<"student" | "teacher">("student");

  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);

  async function refreshAccessToken() {
    if (!refreshToken.value) {
      console.warn("No refresh token available.");
      return false;
    }

    const { data, error } = await tryRequestEndpoint<{ access: string }>(
      "api/token/refresh/",
      "POST",
      { refresh: refreshToken.value }
    );

    if (error || !data) {
      console.error("Token refresh failed:", error);
      logout(); // optionally log the user out
      return false;
    }

    accessToken.value = data.access;
    isAuth.value = true;
    console.log("Access token refreshed.");
    return true;
  }

//   const studentCourses = ref<StudentCourse[]>([]);
//   const teacherCourses = ref<TeacherCourseNoAssignment[]>([]);
//   const studentCurrentCourse = ref<StudentCourse>();
//   const teacherCurrentCourse = ref<TeacherCourse>();

//   const currentQuestion = ref<StaticQuestionInterface | DynamicQuestionInterface>();

//   /** @example { [id]: Topic } */
//   const loadedTopics = ref<Record<number, TopicMapped>>({});
//   /** @example { [id]: TopicPath } */
//   const loadedTopicPaths = ref<Record<number, number[]>>({});
//   /** @example { [id]: QuestionInterface } */
//   const loadedQuestions = ref<Record<number, TopicQuestionInterface>>({});
//   /** how many questions are there in total total */
//   const totalQuestionCount = ref<number>(0);

//   function handleLoginData(data: LoginSuccess): void {
//     isAuth.value = true;
//     name.value = data.name;
//     userType.value = data.userType.toLowerCase() as "student" | "teacher";

//     if (data.userType === "Student") {
//       courseToDate(data.courses);
//       return void (studentCourses.value = data.courses);
//     }

//     teacherCourses.value = data.courses;
//   }

  async function init() {
    if (!refreshToken.value) {
      console.log("No refresh token found, user is not authenticated.");
      isAuth.value = false;
      return;
    }

    console.log("Refresh token found, validating session...");

    const refreshed = await refreshAccessToken();

    if (!refreshed) {
      console.warn("Failed to refresh token — logging out.");
      isAuth.value = false;
      await logout();
      return;
    }
  }

  async function login(email: string, password: string) {
    const { data, error } = await tryRequestEndpoint<LoginResponse | LoginFailure>("api/token/","POST",{ email, password },true);

    if (error) {
      console.error("Login error:", error);
      return { success: false, data: undefined, error };
    }

    console.log("Login response data:", data); // i still need this

    if ("access" in data) {
      accessToken.value = data.access;
      refreshToken.value = data.refresh;

      name.value = "Anon"; // data.name || "";
      userType.value = "student"; // data.userType ? data.userType.toLowerCase() as "student" | "teacher" : "student";

      isAuth.value = true;
      return { success: true, data };
    }

    return { success: false, data };
  }

  async function logout() {
    accessToken.value = null;
    refreshToken.value = null;
    isAuth.value = false;
    await router.push("/");
  }

  return {
    name,
    isAuth,
    userType,
    isDarkMode,
    showSideMenu,
    accessToken,
    refreshToken,
    init,
    refreshAccessToken,
    // studentCourses,
    // teacherCourses,
    // studentCurrentCourse,
    // teacherCurrentCourse,
    // currentQuestion,
    // loadedTopics,
    // loadedTopicPaths,
    // loadedQuestions,
    // totalQuestionCount,
    // init,
    login,
    logout
  }; 
}, 
{
  persist: {
    pick: ["accessToken", "refreshToken"],
  },
}
);
