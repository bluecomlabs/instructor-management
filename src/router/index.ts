import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";

const routes: Array<RouteRecordRaw> = [
  // 사용자 로그인
  {
    path: "/user",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "sign-in",
        name: "user-sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
        meta: {
          pageTitle: "Sign Up",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
    ],
  },
  {
    path: "/user",
    redirect: "/user/sign-in",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "dashboard",
        name: "user-dashboard",
        component: () => import("@/views/UserDashboard.vue"),
        meta: {
          pageTitle: "배정완료 목록",
          breadcrumbs: ["배정완료 목록"],
        },
      },
      {
        path: "MyProfile",
        name: "user-MyProfile",
        component: () => import("@/views/apps/customers/MyProfile.vue"),
        meta: {
          pageTitle: "마이페이지",
          breadcrumbs: ["마이페이지"],
        },
      },{
        path: "CompleteList",
        name: "user-CompleteList",
        component: () => import("@/views/apps/customers/CompleteList.vue"),
        meta: {
          pageTitle: "배정완료 목록",
          breadcrumbs: ["교육 관리", "배정완료 목록"],
        },
      },
      {
        path: "Attendance",
        name: "user-Attendance",
        component: () => import("@/views/apps/subscriptions/Attendance.vue"),
        meta: {
          pageTitle: "출석부",
          breadcrumbs: ["배정완료 목록", "출석부"],
        },
      },
      {
        path: "EducationJournal",
        name: "user-EducationJournal",
        component: () => import("@/views/apps/subscriptions/EducationJournal.vue"),
        meta: {
          pageTitle: "교육일지",
          breadcrumbs: ["배정완료 목록", "교육일지"],
        },
      },
      {
        path: "syllabus",
        name: "user-syllabus",
        component: () => import("@/views/apps/subscriptions/syllabus.vue"),
        meta: {
          pageTitle: "강의확인서",
          breadcrumbs: ["배정완료 목록", "강의확인서"],
        },
      },
      {
        path: "adminsyllabus",
        name: "user-adminsyllabus",
        component: () => import("@/views/apps/subscriptions/adminsyllabus.vue"),
        meta: {
          pageTitle: "강의계획서",
          breadcrumbs: ["배정완료 목록", "강의계획서"],
        },
      },
      {
        path: "EducationalDetails",
        name: "user-EducationalDetails",
        component: () => import("@/views/apps/customers/EducationalDetails.vue"),
        meta: {
          pageTitle: "교육기관 관리",
          breadcrumbs: ["교육 리소스 관리", "교육기관 관리"],
        },
      },
      {
        path: "ProgramDetails",
        name: "user-ProgramDetails",
        component: () => import("@/views/apps/customers/ProgramDetails.vue"),
        meta: {
          pageTitle: "교육 프로그램 관리",
          breadcrumbs: ["교육 리소스 관리", "교육 프로그램 관리"],
        },
      },
      {
        path: "MyProfile",
        name: "user-MyProfile",
        component: () => import("@/views/apps/customers/MyProfile.vue"),
        meta: {
          pageTitle: "마이페이지",
          breadcrumbs: ["마이페이지"],
        },
      },
      {
        path: "/apps/calendar",
        name: "apps-calendar",
        component: () => import("@/views/apps/Calendar.vue"),
        meta: {
          pageTitle: "캘린더",
          breadcrumbs: ["캘린더"],
        },
      },
      {
        path: "lists",
        name: "user-lists",
        component: () => import("@/views/crafted/widgets/Lists.vue"),
        meta: {
          pageTitle: "강사관리",
          breadcrumbs: ["교육 리소스 관리", "강사관리"],
        },
      },
      {
        path: "WorkSituation",
        name: "user-WorkSituation",
        component: () => import("@/views/apps/subscriptions/WorkSituation.vue"),
        meta: {
          pageTitle: "근무상황부",
          breadcrumbs: ["강사 관리", "근무상황부"],
        },
      },
      {
        path: "BusinessJournal",
        name: "user-BusinessJournal",
        component: () => import("@/views/apps/subscriptions/BusinessJournal.vue"),
        meta: {
          pageTitle: "업무일지",
          breadcrumbs: ["강사 관리", "업무일지"],
        },
      },
      
    ],
  },

  // 관리자 로그인
  {
    path: "/admin",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "sign-in",
        name: "admin-sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/admin-SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
        meta: {
          pageTitle: "Sign Up",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
    ],
  },
  
  // 관리자 페이지
  {
    path: "/admin",
    redirect: "/admin/dashboard",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "dashboard",
        name: "admin-dashboard",
        component: () => import("@/views/AdminDashboard.vue"),
        meta: {
          pageTitle: "대시보드",
          breadcrumbs: ["대시보드"],
        },
      },
      {
        path: "/builder",
        name: "builder",
        component: () => import("@/views/LayoutBuilder.vue"),
        meta: {
          pageTitle: "Layout Builder",
          breadcrumbs: ["Layout"],
        },
      },
      {
        path: "CompleteList",
        name: "admin-CompleteList",
        component: () => import("@/views/apps/customers/CompleteList.vue"),
        meta: {
          pageTitle: "배정완료 목록",
          breadcrumbs: ["교육 관리", "배정완료 목록"],
        },
      },
      {
        path: "Attendance",
        name: "admin-Attendance",
        component: () => import("@/views/apps/subscriptions/Attendance.vue"),
        meta: {
          pageTitle: "출석부",
          breadcrumbs: ["배정완료 목록", "출석부"],
        },
      },
      {
        path: "EducationJournal",
        name: "admin-EducationJournal",
        component: () => import("@/views/apps/subscriptions/EducationJournal.vue"),
        meta: {
          pageTitle: "교육일지",
          breadcrumbs: ["배정완료 목록", "교육일지"],
        },
      },
      {
        path: "syllabus",
        name: "admin-syllabus",
        component: () => import("@/views/apps/subscriptions/syllabus.vue"),
        meta: {
          pageTitle: "강의확인서",
          breadcrumbs: ["배정완료 목록", "강의확인서"],
        },
      },
      {
        path: "adminsyllabus",
        name: "admin-adminsyllabus",
        component: () => import("@/views/apps/subscriptions/adminsyllabus.vue"),
        meta: {
          pageTitle: "강의계획서",
          breadcrumbs: ["배정완료 목록", "강의계획서"],
        },
      },
      {
        path: "EducationalDetails",
        name: "admin-EducationalDetails",
        component: () => import("@/views/apps/customers/EducationalDetails.vue"),
        meta: {
          pageTitle: "교육기관 관리",
          breadcrumbs: ["교육 리소스 관리", "교육기관 관리"],
        },
      },
      {
        path: "ProgramDetails",
        name: "admin-ProgramDetails",
        component: () => import("@/views/apps/customers/ProgramDetails.vue"),
        meta: {
          pageTitle: "교육 프로그램 관리",
          breadcrumbs: ["교육 리소스 관리", "교육 프로그램 관리"],
        },
      },
      {
        path: "MyProfile",
        name: "admin-MyProfile",
        component: () => import("@/views/apps/customers/MyProfile.vue"),
        meta: {
          pageTitle: "마이페이지",
          breadcrumbs: ["마이페이지"],
        },
      },
      {
        path: "/apps/calendar",
        name: "apps-calendar",
        component: () => import("@/views/apps/Calendar.vue"),
        meta: {
          pageTitle: "캘린더",
          breadcrumbs: ["캘린더"],
        },
      },
      {
        path: "lists",
        name: "admin-lists",
        component: () => import("@/views/crafted/widgets/Lists.vue"),
        meta: {
          pageTitle: "강사관리",
          breadcrumbs: ["교육 리소스 관리", "강사관리"],
        },
      },
      {
        path: "WorkSituation",
        name: "admin-WorkSituation",
        component: () => import("@/views/apps/subscriptions/WorkSituation.vue"),
        meta: {
          pageTitle: "근무상황부",
          breadcrumbs: ["강사 관리", "근무상황부"],
        },
      },
      {
        path: "BusinessJournal",
        name: "admin-BusinessJournal",
        component: () => import("@/views/apps/subscriptions/BusinessJournal.vue"),
        meta: {
          pageTitle: "업무일지",
          breadcrumbs: ["강사 관리", "업무일지"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    // If the route has a hash, scroll to the section with the specified ID; otherwise, scroll toc the top of the page.
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    } else {
      return {
        top: 0,
        left: 0,
        behavior: "smooth",
      };
    }
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // current page view title
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  configStore.resetLayoutConfig();

  // verify auth token before each page change
  authStore.verifyAuth();

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (authStore.isAuthenticated) {
      next();
    } else {
      next({ name: "sign-in" });
    }
  } else {
    next();
  }
});

export default router;
