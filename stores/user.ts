import { tryRequestEndpoint } from "@/utils/functions/fetch";

type LoginResponse = {
  access: string;
  refresh: string;
};

type UserInfo = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: number; 
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

  async function handleLoginData() {
    const { data, error } = await tryRequestEndpoint<UserInfo>("users/get-user","GET");

    if (error || !data) {
      console.error("Failed to fetch user info:", error);
      return { success: false, data: undefined, error };
    }

    isAuth.value = true;
    if (!data.first_name && !data.last_name) {
      name.value = data.email;
    } else {
      name.value = `${data.first_name} ${data.last_name}`.trim();
    }

    if (data.user_type) {
      userType.value = "teacher"
    } else {
      userType.value = "student"
    } 

    return { success: true, data };
  }

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

    await handleLoginData();
  }

  async function login(email: string, password: string) {
    const { data, error } = await tryRequestEndpoint<LoginResponse | LoginFailure>("api/token/","POST",{ email, password },true);

    if (error) {
      console.error("Login error:", error);
      return { success: false, data: undefined, error };
    }

    if ("access" in data) {
      accessToken.value = data.access;
      refreshToken.value = data.refresh;

      await handleLoginData();

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
    paths: ["accessToken", "refreshToken"],
  },
}
);
