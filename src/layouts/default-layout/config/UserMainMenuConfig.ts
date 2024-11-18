import type { MenuItem } from "@/layouts/default-layout/config/types";

const UserMainMenuConfig: Array<MenuItem> = [
  {
    heading: "대시보드",
    route: "/교육 관리",
    pages: [
      {
        heading: "캘린더",
        route: "/user/Dashboard",
        keenthemesIcon: "calendar",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "출강 일정",
    route: "/apps",
    pages: [
      {
        heading: "내 출강 리스트",
        route: "/user/MyEdu",
        keenthemesIcon: "questionnaire-tablet",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "출강 신청",
    route: "/resources",
    pages: [
      {
        heading: "오픈 예정 교육",
        route: "/user/EduView",
        keenthemesIcon: "brifecase-timer",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "출강 신청",
        route: "/user/EduAppl",
        keenthemesIcon: "click",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "출강 신청 내역",
        route: "/user/MyApplEdu",
        keenthemesIcon: "clipboard",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "출강 협의",
        route: "/user/MyApplEduList",
        keenthemesIcon: "clipboard",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "보고서 제출",
    route: "/resources",
    pages: [
      {
        heading: "교육별 제출 현황",
        route: "/user/SubmissionEdu",
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "업무일지",
        route: "/user/BusinessJournalLlist",
        keenthemesIcon: "notepad",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "교육 일지",
        route: "/user/EducationalReportList",
        keenthemesIcon: "people",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "근무상황부",
        route: "/user/WorkSituation",
        keenthemesIcon: "calendar-2",
        bootstrapIcon: "bi-printer",
      },
    ],
  },
  {
    heading: "서명",
    route: "/resources",
    pages: [
      {
        heading: "서명 리스트",
        route: "/user/SignList",
        keenthemesIcon: "tablet-text-up",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "내 서명 관리",
        route: "/user/MySign",
        keenthemesIcon: "brush",
        bootstrapIcon: "bi-printer",
      },
    ],
  },
];

export default UserMainMenuConfig;
