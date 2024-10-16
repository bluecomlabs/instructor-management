import type { MenuItem } from "@/layouts/default-layout/config/types";

const UserMainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "대시보드",
        route: "/user/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "강의관리",
    route: "/apps",
    pages: [
      {
        heading: "내 출강 리스트",
        route: "/user/MyEdu",
        keenthemesIcon: "questionnaire-tablet",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "교육 신청하기",
        route: "/user/EduAppl",
        keenthemesIcon: "add-item",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "교육 신청내역",
        route: "/user/MyApplEdu",
        keenthemesIcon: "notification-status",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "다가오는 교육",
        route: "/user/EduView",
        keenthemesIcon: "add-item",
        bootstrapIcon: "bi-app-indicator",
      },
      // {
      //   heading: "캘린더",
      //   route: "/apps/calendar",
      //   keenthemesIcon: "calendar-8",
      //   bootstrapIcon: "bi-calendar3-event",
      // },
    ],
  },
  {
    heading: "서류관리",
    route: "/resources",
    pages: [
      {
        heading: "업무일지",
        route: "/user/BusinessJournaLlist",
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "근무상황부",
        route: "/user/WorkSituation",
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-printer",
      },
      // {
      //   heading: "lists",
      //   route: "/user/lists",
      //   keenthemesIcon: "element-7",
      //   bootstrapIcon: "bi-layers",
      // },
    ],
  },
];

export default UserMainMenuConfig;
