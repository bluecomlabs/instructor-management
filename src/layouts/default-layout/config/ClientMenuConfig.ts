import type { MenuItem } from "@/layouts/default-layout/config/types";

const ClientMainMenuConfig: Array<MenuItem> = [
  {
    heading: "대시보드",
    route: "/교육 관리",
    pages: [
      {
        heading: "전체 프로그램 현황",
        route: "/client/Dashboard",
        keenthemesIcon: "calendar",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "교육 일정 및 진행 상황",
        route: "/client/allProgram",
        keenthemesIcon: "questionnaire-tablet",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "프로그램 관리",
    route: "/apps",
    pages: [
      {
        heading: "프로그램 목록 조회",
        route: "/client/programList",
        keenthemesIcon: "questionnaire-tablet",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "교육 신청 관리",
    route: "/apps",
    pages: [
      {
        heading: "기관별 신청 조회",
        route: "/client/appliList",
        keenthemesIcon: "questionnaire-tablet",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "강사 배정 관리",
    route: "/apps",
    pages: [
      {
        heading: "강사 신청 목록 조회",
        route: "/client/instApplList",
        keenthemesIcon: "questionnaire-tablet",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "강사 출강 일정 조회",
        route: "/client/instAttenSchedule",
        keenthemesIcon: "questionnaire-tablet",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "보고서 조회",
    route: "/apps",
    pages: [
      {
        heading: "업무일지",
        route: "/client/BusinessJournalLlist",
        keenthemesIcon: "questionnaire-tablet",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "교육일지",
        route: "/client/EducationalReportList",
        keenthemesIcon: "questionnaire-tablet",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "근무상황부",
        route: "/client/WorkSituation",
        keenthemesIcon: "questionnaire-tablet",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "서명",
    route: "/apps",
    pages: [
      {
        heading: "서명 리스트",
        route: "/client/SignList",
        keenthemesIcon: "questionnaire-tablet",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "내 서명 관리",
        route: "/client/MySign",
        keenthemesIcon: "questionnaire-tablet",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
];

export default ClientMainMenuConfig;
