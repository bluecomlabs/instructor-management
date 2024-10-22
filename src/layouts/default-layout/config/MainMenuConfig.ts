import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
  {
    heading: "대시보드",
    route: "/교육 관리",
    pages: [
      {
        heading: "전체 프로그램 현황",
        route: "/admin/AllProgramStatusList",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-Person-walking",
      },
      {
        heading: "교육 일정 프로그램 현황",
        route: "/admin/EduScheduleProgramStatusList",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-Person-walking",
      },
    ],
  },
  {
    heading: "프로그램 관리",
    route: "/resources",
    pages: [
      {
        heading: "프로그램 생성",
        route: "/admin/ProgramAdd",
        keenthemesIcon: "cube-2",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "프로그램 조회",
        route: "/admin/ProgramList",
        keenthemesIcon: "cube-2",
        bootstrapIcon: "bi-printer",
      }
    ],
  },
  {
    heading: "기관 신청 관리",
    route: "/resources",
    pages: [
      {
        heading: "기관별 신청 조회",
        route: "/admin/InstApplList",
        keenthemesIcon: "cube-2",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "신청 검토 및 확정",
        route: "/admin/ApplReviewList",
        keenthemesIcon: "cube-2",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "신청 상태 변경",
        route: "/admin/ApplStatusChange",
        keenthemesIcon: "cube-2",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "기관 수기 신청",
        route: "/admin/InstApplPassivity",
        keenthemesIcon: "cube-2",
        bootstrapIcon: "bi-printer",
      }
    ],
  },
  {
    heading: "강사 배정 관리",
    route: "/교육 관리",
    pages: [
      {
        heading: "강사 신청 목록 조회",
        route: "/admin/TeacherApplList",
        keenthemesIcon: "brifecase-tick",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "강사 배정 관리",
        route: "/admin/TeacherAlloList",
        keenthemesIcon: "brifecase-timer",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "강사 수기 배정",
        route: "/admin/TeacherAlloPassivity",
        keenthemesIcon: "brifecase-tick",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "강사 출강 일정 조회@",
        route: "/admin/TeacherAlloschedule",
        keenthemesIcon: "brifecase-tick",
        bootstrapIcon: "bi-printer",
      },
    ],
  },
  {
    heading: "보고서 관리",
    route: "/resources",
    pages: [
      {
        heading: "업무일지 관리",
        route: "/admin/TeacherReportList",
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-layers",
      },
      {
        heading: "교육일지 관리",
        route: "/admin/EducationalReportList",
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-layers",
      },
      {
        heading: "근무상황부 관리",
        route: "/admin/WorkSchedule",
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-layers",
      },
      {
        heading: "서명 확인",
        route: "/admin/SignCheck",
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-layers",
      },
    ],
  },
  {
    heading: "설정 및 사용자 관리",
    route: "/resources",
    pages: [
      {
        heading: "관리자 관리",
        route: "/admin/AdminList",
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-layers",
      },
      {
        heading: "기관 관리",
        route: "/admin/InstitutionList",
        keenthemesIcon: "book",
        bootstrapIcon: "bi-layers",
      },
      {
        heading: "강사 관리",
        route: "/admin/TeacherList",
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-layers",
      },
      {
        heading: "시스템 설정",
        route: "/admin/SystemSettings",
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-layers",
      }
    ],
  },
];

export default MainMenuConfig;
