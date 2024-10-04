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
        route: "/admin/completelist",
        keenthemesIcon: "brifecase-tick",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "배정 신청 및 결과",
        route: "/admin/assignment",
        keenthemesIcon: "brifecase-timer",
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
        route: "/admin/programlist",
        keenthemesIcon: "cube-2",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "교육 기관 관리",
        route: "/admin/educationaldetails",
        keenthemesIcon: "book",
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
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-layers",
      },
      {
        heading: "강사 근무상황부",
        route: "/admin/work",
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-layers",
      },
      {
        heading: "강사 업무일지",
        route: "/admin/business",
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-layers",
      },
    ],
  },
];

export default MainMenuConfig;
