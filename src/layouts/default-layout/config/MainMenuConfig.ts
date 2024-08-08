import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "대시보드",
        route: "/admin/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-Person-walking",
      },
    ],
  },
  {
    heading: "배정 정보 관리",
    route: "/교육 관리",
    pages: [
      {
        heading: "출강정보 목록",
        route: "/admin/completeList",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "배정 신청 및 결과",
        route: "/admin/Assignment",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "교육 정보 관리",
    route: "/resources",
    pages: [
      {
        heading: "교육 프로그램 관리",
        route: "/admin/ProgramDetails",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "교육 기관 관리",
        route: "/admin/EducationalDetails",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-printer",
      }
    ],
  },
  {
    heading: "강사 정보 관리",
    route: "/resources",
    pages: [
      {
        heading: "강사 정보 목록",
        route: "/admin/lists",
        keenthemesIcon: "element-7",
        bootstrapIcon: "bi-layers",
      },
      {
        heading: "강사 근무상황부",
        route: "/admin/work",
        keenthemesIcon: "element-7",
        bootstrapIcon: "bi-layers",
      },
      {
        heading: "강사 업무일지",
        route: "/admin/Business",
        keenthemesIcon: "element-7",
        bootstrapIcon: "bi-layers",
      },
    ],
  },
];

export default MainMenuConfig;
