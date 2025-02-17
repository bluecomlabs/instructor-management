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
      },
      // {
      //   heading: "교육 일정 프로그램 현황",
      //   route: "/admin/EduScheduleProgramStatusList",
      //   keenthemesIcon: "element-11",
      //   bootstrapIcon: "bi-Person-walking",
      // },
    ],
  },
  {
    heading: "프로그램 관리",
    route: "/resources",
    pages: [
      {
        heading: "프로그램 조회",
        route: "/admin/ProgramList",
        keenthemesIcon: "some-files",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "프로그램 생성",
        route: "/admin/ProgramAdd",
        keenthemesIcon: "add-files",
        bootstrapIcon: "bi-printer",
      }
    ],
  },
  {
    heading: "교육 관리",
    route: "/resources",
    pages: [
      {
        heading: "교육 조회",
        route: "/admin/CouresList",
        keenthemesIcon: "ranking",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "교육 생성",
        route: "/admin/CouresAdd",
        keenthemesIcon: "ranking",
        bootstrapIcon: "bi-printer",
      },
    ],
  },
  {
    heading: "교육기관 관리",
    route: "/resources",
    pages: [
      {
        heading: "교육기관 조회",
        route: "/admin/SchoolList",
        keenthemesIcon: "ranking",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "교육기관 생성",
        route: "/admin/SchoolAdd",
        keenthemesIcon: "ranking",
        bootstrapIcon: "bi-printer",
      },
    ],
  },
  {
    heading: "교육 관리",
    route: "/resources",
    pages: [
      // {
      //   heading: "기관별 신청 조회",
      //   route: "/admin/InstApplList",
      //   keenthemesIcon: "cheque",
      //   bootstrapIcon: "bi-printer",
      // },
      {
        heading: "신청 조회 및 확정",
        route: "/admin/ApplReviewList",
        keenthemesIcon: "eye",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "교육 상태 변경",
        route: "/admin/ApplStatusChange",
        keenthemesIcon: "note-2",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "교육 신청",
        route: "/admin/InstApplPassivity",
        keenthemesIcon: "notepad-edit",
        bootstrapIcon: "bi-printer",
      }
    ],
  },
  {
    heading: "강사 배정 관리",
    route: "/교육 관리",
    pages: [
      {
        heading: "신청 조회 및 배정",
        route: "/admin/TeacherApplList",
        keenthemesIcon: "archive-tick",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "배정 결과 및 상태 관리",
        route: "/admin/TeacherAlloList",
        keenthemesIcon: "calendar-tick",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "교육별 조회",
        route: "/admin/TeacherAlloPassivity",
        keenthemesIcon: "calendar-edit",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "강사 출강 일정 조회",
        route: "/admin/TeacherAlloschedule",
        keenthemesIcon: "calendar",
        bootstrapIcon: "bi-printer",
      },
    ],
  },
  // {
  //   heading: "보고서 관리",
  //   route: "/resources",
  //   pages: [
  //     {
  //       heading: "업무일지 관리",
  //       route: "/admin/TeacherReportList",
  //       keenthemesIcon: "notepad",
  //       bootstrapIcon: "bi-layers",
  //     },
  //     {
  //       heading: "교육일지 관리",
  //       route: "/admin/EducationalReportList",
  //       keenthemesIcon: "people",
  //       bootstrapIcon: "bi-layers",
  //     },
  //     {
  //       heading: "근무상황부 관리",
  //       route: "/admin/WorkSchedule",
  //       keenthemesIcon: "calendar-2",
  //       bootstrapIcon: "bi-layers",
  //     },
  //     {
  //       heading: "서명 확인",
  //       route: "/admin/SignCheck",
  //       keenthemesIcon: "brush",
  //       bootstrapIcon: "bi-layers",
  //     },
  //   ],
  // },
  {
    heading: "설정 및 사용자 관리",
    route: "/resources",
    pages: [
      {
        heading: "교육기관 타입 설정",
        route: "/admin/SchoolType",
        keenthemesIcon: "ranking",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "교육 타입 설정",
        route: "/admin/EducationType",
        keenthemesIcon: "ranking",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "수당 타입 설정",
        route: "/admin/AllowanceType",
        keenthemesIcon: "ranking",
        bootstrapIcon: "bi-printer",
      },
      // {
      //   heading: "관리자 관리",
      //   route: "/admin/AdminList",
      //   keenthemesIcon: "user",
      //   bootstrapIcon: "bi-layers",
      // },
      {
        heading: "공지사항 관리",
        route: "/admin/NoticeList",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-buildings",
      },
      // {
      //   heading: "기관 관리",
      //   route: "/admin/SchoolList",
      //   keenthemesIcon: "abstract-38",
      //   bootstrapIcon: "bi-buildings",
      // },
      {
        heading: "강사 관리",
        route: "/admin/TeacherList",
        keenthemesIcon: "teacher",
        bootstrapIcon: "bi-layers",
      },
      // {
      //   heading: "시스템 이력 조회",
      //   route: "/admin/SystemSettings",
      //   keenthemesIcon: "setting-2",
      //   bootstrapIcon: "bi-layers",
      // }
    ],
  },
];

export default MainMenuConfig;
