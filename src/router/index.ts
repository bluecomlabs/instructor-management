import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";

const routes: Array<RouteRecordRaw> = [

  {
    path: "/",
    redirect: "/user/sign-in",
  },
  // 사용자 로그인
  {
    path: "/user",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "sign-in",
        name: "user-sign-in",
        component: () =>
          import("@/views/teacher/login/SignIn.vue"),
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
      // middleware: "auth",
    },
    children: [
      // 대시보드
      {
        path: "dashboard",
        name: "user-dashboard",
        component: () => import("@/views/teacher/dashborad/UserDashboard.vue"),
        meta: {
          pageTitle: "대시보드",
          breadcrumbs: ["대시보드"],
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
      // 출강 일정
      {
        path: "MyEdu",
        name: "user-MyEdu",
        component: () => import("@/views/teacher/lectureSchedule/MyEdu.vue"),
        meta: {
          pageTitle: "출강 일정",
          breadcrumbs: ["출강 일정", "내 출강 리스트"],
        },
      },
      {
        path: "MyEduDetails",
        name: "user-MyEduDetails",
        component: () => import("@/views/teacher/lectureSchedule/MyEduDetails.vue"),
        meta: {
          pageTitle: "출강 일정",
          breadcrumbs: ["출강 일정", "내 출강 리스트 상세보기"],
        },
      },
      // 출강 신청
      {
        path: "EduView",
        name: "user-EduView",
        component: () => import("@/views/teacher/lectureSchedule/EduView.vue"),
        meta: {
          pageTitle: "출강 신청",
          breadcrumbs: ["출강 신청", "오픈 예정 교육"],
        },
      },
      {
        path: "EduViewDetails",
        name: "user-EduViewDetails",
        component: () => import("@/views/teacher/lectureSchedule/EduViewDetails.vue"),
        meta: {
          pageTitle: "출강 신청",
          breadcrumbs: ["출강 신청", "오픈 예정 교육 상세보기"],
        },
      },
      {
        path: "EduAppl",
        name: "user-EduAppl",
        component: () => import("@/views/teacher/lectureSchedule/EduAppl.vue"),
        meta: {
          pageTitle: "출강 신청",
          breadcrumbs: ["출강 신청", "출강 신청"],
        },
      },
      {
        path: "EduApplDetails",
        name: "user-EduApplDetails",
        component: () => import("@/views/teacher/lectureSchedule/EduApplDetails.vue"),
        meta: {
          pageTitle: "출강 신청",
          breadcrumbs: ["출강 신청", "출강 신청 상세보기"],
        },
      },
      {
        path: "MyApplEdu",
        name: "user-MyApplEdu",
        component: () => import("@/views/teacher/lectureSchedule/MyApplEdu.vue"),
        meta: {
          pageTitle: "출강 신청",
          breadcrumbs: ["출강 신청", "출강 신청 내역"],
        },
      },
      {
        path: "MyApplEduDetails",
        name: "user-MyApplEduDetails",
        component: () => import("@/views/teacher/lectureSchedule/MyApplEduDetails.vue"),
        meta: {
          pageTitle: "출강 신청",
          breadcrumbs: ["출강 신청", "출강 신청 내역 상세보기"],
        },
      },
      {
        path: "MyApplEduList",
        name: "user-MyApplEduList",
        component: () => import("@/views/teacher/lectureSchedule/MyApplEduList.vue"),
        meta: {
          pageTitle: "출강 협의",
          breadcrumbs: ["출강 신청", "출강 협의"],
        },
      },
      {
        path: "MyApplEduListDetails",
        name: "user-MyApplEduListDetails",
        component: () => import("@/views/teacher/lectureSchedule/MyApplEduListDetails.vue"),
        meta: {
          pageTitle: "출강 협의",
          breadcrumbs: ["출강 신청", "출강 협의 상세보기"],
        },
      },
      // 보고서 제출
      {
        path: "SubmissionEdu",
        name: "user-SubmissionEdu",
        component: () => import("@/views/teacher/reportSubmit/SubmissionEdu.vue"),
        meta: {
          pageTitle: "보고서 제출",
          breadcrumbs: ["보고서 제출", "교육별 제출 현황"],
        },
      },
      {
        path: "BusinessJournalLlist",
        name: "user-BusinessJournalLlist",
        component: () => import("@/views/teacher/reportSubmit/BusinessJournalLlist.vue"),
        meta: {
          pageTitle: "보고서 제출",
          breadcrumbs: ["보고서 제출", "업무 일지"],
        },
      },
      {
        path: "EducationalReportList",
        name: "user-EducationalReportList",
        component: () => import("@/views/teacher/reportSubmit/EducationalReportList.vue"),
        meta: {
          pageTitle: "보고서 제출",
          breadcrumbs: ["보고서 제출", "교육 일지"],
        },
      },
      {
        path: "WorkSituation",
        name: "user-WorkSituation",
        component: () => import("@/views/teacher/reportSubmit/WorkSituation.vue"),
        meta: {
          pageTitle: "보고서 제출",
          breadcrumbs: ["보고서 제출", "근무상황부"],
        },
      },
      // 서명
      {
        path: "SignList",
        name: "user-SignList",
        component: () => import("@/views/teacher/sign/SignList.vue"),
        meta: {
          pageTitle: "서명",
          breadcrumbs: ["서명", "서명 리스트"],
        },
      },
      {
        path: "MySign",
        name: "user-MySign",
        component: () => import("@/views/teacher/sign/MySign.vue"),
        meta: {
          pageTitle: "서명",
          breadcrumbs: ["서명", "내 서명 관리"],
        },
      },
      // 10월 22일 이전 작업페이지(정리예정)
      {
        path: "UserAttendanceAdd",
        name: "user-UserAttendanceAdd",
        component: () => import("@/views/apps/subscriptions/UserAttendanceAdd.vue"),
        meta: {
          pageTitle: "교육일지",
          breadcrumbs: ["배정 정보 관리", "교육일지"],
        },
      },
      {
        path: "EditWorkSituation",
        name: "user-EditWorkSituation",
        component: () => import("@/views/apps/user/EditWorkSituation.vue"),
        meta: {
          pageTitle: "출석부",
          breadcrumbs: ["강의관리", "출석부 수정"],
        },
      },
      {
        path: "Attendance",
        name: "user-Attendance",
        component: () => import("@/views/apps/subscriptions/Attendance.vue"),
        meta: {
          pageTitle: "출석부",
          breadcrumbs: ["강의관리", "출석부"],
        },
      },
      {
        path: "EditAttendance",
        name: "user-EditAttendance",
        component: () => import("@/views/apps/subscriptions/EditAttendance.vue"),
        meta: {
          pageTitle: "출석부",
          breadcrumbs: ["강의관리", "출석부 수정"],
        },
      },
      {
        path: "EducationJournal",
        name: "user-EducationJournal",
        component: () => import("@/views/apps/user/EducationJournal.vue"),
        meta: {
          pageTitle: "교육일지",
          breadcrumbs: ["강의관리", "교육일지"],
        },
      },
      {
        path: "EditEducationJournal",
        name: "user-EditEducationJournal",
        component: () => import("@/views/apps/subscriptions/EditEducationJournal.vue"),
        meta: {
          pageTitle: "교육일지",
          breadcrumbs: ["강의관리", "교육일지 수정"],
        },
      },
      {
        path: "syllabus",
        name: "user-syllabus",
        component: () => import("@/views/apps/subscriptions/syllabus.vue"),
        meta: {
          pageTitle: "강의확인서",
          breadcrumbs: ["강의관리", "강의확인서"],
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
        path: "EducationalList",
        name: "user-EducationalList",
        component: () => import("@/views/admin/userSettings/SchoolList.vue"),
        meta: {
          pageTitle: "교육기관 관리",
          breadcrumbs: ["교육기관 관리", "교육기관 조회"],
        },
      },
      {
        path: "ProgramList",
        name: "user-ProgramList",
        component: () => import("@/views/admin/program/ProgramList.vue"),
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
      // {
      //   path: "lists",
      //   name: "user-lists",
      //   component: () => import("@/views/apps/subscriptions/Lists.vue"),
      //   meta: {
      //     pageTitle: "강사관리",
      //     breadcrumbs: ["교육 리소스 관리", "강사관리"],
      //   },
      // },
      // {
      //   path: "WorkSituation",
      //   name: "user-WorkSituation",
      //   component: () => import("@/views/apps/subscriptions/WorkSituation.vue"),
      //   meta: {
      //     pageTitle: "근무상황부",
      //     breadcrumbs: ["서류관리", "근무상황부"],
      //   },
      // },
      {
        path: "BusinessJournal",
        name: "user-BusinessJournal",
        component: () => import("@/views/apps/subscriptions/BusinessJournal.vue"),
        meta: {
          pageTitle: "업무일지",
          breadcrumbs: ["서류관리", "업무일지"],
        },
      },
      {
        path: "BusinessJournalAdd",
        name: "user-BusinessJournalAdd",
        component: () => import("@/views/teacher/reportSubmit/BusinessJournalAdd.vue"),
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
          import("@/views/admin/login/admin-SignIn.vue"),
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
      // middleware: "auth",
    },
    children: [
      // 대시보드
      {
        path: "AllProgramStatusList",
        name: "admin-AllProgramStatusList",
        component: () => import("@/views/admin/dashboard/AllProgramStatusList.vue"),
        meta: {
          pageTitle: "전체 프로그램 현황",
          breadcrumbs: ["전체 프로그램 현황"],
        },
      },
      {
        path: "EduScheduleProgramStatusList",
        name: "admin-EduScheduleProgramStatusList",
        component: () => import("@/views/admin/dashboard/EduScheduleProgramStatusList.vue"),
        meta: {
          pageTitle: "교육 일정 프로그램 현황",
          breadcrumbs: ["교육 일정 프로그램 현황"],
        },
      },
      // 프로그램 관리
      {
        path: "ProgramList",
        name: "admin-ProgramList",
        component: () => import("@/views/admin/program/ProgramList.vue"),
        meta: {
          pageTitle: "프로그램 관리",
          breadcrumbs: ["프로그램 관리", "프로그램 조회"],
        },
      },
      {
        path: "ProgramAdd",
        name: "admin-ProgramAdd",
        component: () => import("@/views/admin/program/ProgramAdd.vue"),
        meta: {
          pageTitle: "프로그램 관리",
          breadcrumbs: ["프로그램 관리", "프로그램 생성"],
        },
      },
      {
        path: "ProgramDetails",
        name: "admin-ProgramDetails",
        component: () => import("@/views/admin/program/ProgramDetails.vue"),
        meta: {
          pageTitle: "프로그램 관리",
          breadcrumbs: ["프로그램 관리", "프로그램 상세보기"],
        },
      },
      {
        path: "ProgramEdit",
        name: "admin-ProgramEdit",
        component: () => import("@/views/admin/program/ProgramEdit.vue"),
        meta: {
          pageTitle: "프로그램 관리",
          breadcrumbs: ["프로그램 관리", "프로그램 수정"],
        },
      },
      // 교육 관리
      // {
      //   path: "InstApplList",
      //   name: "admin-InstApplList",
      //   component: () => import("@/views/admin/instAppl/InstApplList.vue"),
      //   meta: {
      //     pageTitle: "교육 관리",
      //     breadcrumbs: ["교육 관리", "기관별 신청 조회"],
      //   },
      // },
      {
        path: "ApplReviewList",
        name: "admin-ApplReviewList",
        component: () => import("@/views/admin/instAppl/ApplReviewList.vue"),
        meta: {
          pageTitle: "신청 조회 및 확정",
          breadcrumbs: ["교육 관리", "신청 조회 및 확정"],
        },
      },
      {
        path: "ApplReviewDetails",
        name: "admin-ApplReviewDetails",
        component: () => import("@/views/admin/instAppl/ApplReviewDetails.vue"),
        meta: {
          pageTitle: "신청 조회 및 확정 상세보기",
          breadcrumbs: ["교육 관리", "신청 조회 및 확정", "신청 조회 및 확정 상세보기"],
        },
      },
      {
        path: "ApplReviewEdit",
        name: "admin-ApplReviewEdit",
        component: () => import("@/views/admin/instAppl/ApplReviewEdit.vue"),
        meta: {
          pageTitle: "신청 조회 및 확정 상세보기",
          breadcrumbs: ["교육 관리", "신청 조회 및 확정", "신청 조회 및 확정 수정"],
        },
      },
      {
        path: "ApplStatusChange",
        name: "admin-ApplStatusChange",
        component: () => import("@/views/admin/instAppl/ApplStatusChange.vue"),
        meta: {
          pageTitle: "교육 관리",
          breadcrumbs: ["교육 관리", "신청 상태 변경"],
        },
      },
      {
        path: "InstApplPassivity",
        name: "admin-InstApplPassivity",
        component: () => import("@/views/admin/instAppl/ApplReviewAdd.vue"),
        meta: {
          pageTitle: "교육 관리",
          breadcrumbs: ["교육 관리", "교육 신청"],
        },
      },
      // 강사 배정 관리
      {
        path: "TeacherApplList",
        name: "admin-TeacherApplList",
        component: () => import("@/views/admin/teacherAllo/TeacherApplList.vue"),
        meta: {
          pageTitle: "강사 배정 관리",
          breadcrumbs: ["강사 배정 관리", "강사 신청 목록 조회"],
        },
      },
      {
        path: "TeacherAlloList",
        name: "admin-TeacherAlloList",
        component: () => import("@/views/admin/teacherAllo/TeacherAlloList.vue"),
        meta: {
          pageTitle: "강사 배정 관리",
          breadcrumbs: ["강사 배정 관리", "강사 배정 관리"],
        },
      },
      {
        path: "TeacherAlloPassivity",
        name: "admin-TeacherAlloPassivity",
        component: () => import("@/views/admin/teacherAllo/TeacherAlloPassivity.vue"),
        meta: {
          pageTitle: "강사 배정 관리",
          breadcrumbs: ["강사 배정 관리", "강사 수기 배정"],
        },
      },
      {
        path: "TeacherAlloschedule",
        name: "admin-TeacherAlloschedule",
        component: () => import("@/views/admin/teacherAllo/TeacherAlloschedule.vue"),
        meta: {
          pageTitle: "출강정보 목록",
          breadcrumbs: ["강사 배정 관리", "출강정보 목록"],
        },
      },
      {
        path: "TeacherAlloPassivityDetails",
        name: "admin-TeacherAlloPassivityDetails",
        component: () => import("@/views/admin/teacherAllo/TeacherAlloPassivityDetails.vue"),
        meta: {
          pageTitle: "출강정보 상세조회",
          breadcrumbs: ["강사 배정 관리", "출강정보 상세조회"],
        },
      },
      {
        path: "TeacherAlloPassivityEdit",
        name: "admin-TeacherAlloPassivityEdit",
        component: () => import("@/views/admin/teacherAllo/TeacherAlloPassivityEdit.vue"),
        meta: {
          pageTitle: "출강정보 상세조회",
          breadcrumbs: ["강사 배정 관리", "출강정보 강사 수동변경"],
        },
      },
      
      // 보고서 관리
      {
        path: "TeacherReportList",
        name: "admin-TeacherReportList",
        component: () => import("@/views/admin/report/TeacherReportList.vue"),
        meta: {
          pageTitle: "보고서 관리",
          breadcrumbs: ["보고서 관리", "강사 업무 일지"],
        },
      },
      {
        path: "EducationalReportList",
        name: "admin-EducationalReportList",
        component: () => import("@/views/admin/report/EducationalReportList.vue"),
        meta: {
          pageTitle: "보고서 관리",
          breadcrumbs: ["보고서 관리", "교육일지 일지"],
        },
      },
      {
        path: "WorkSchedule",
        name: "admin-WorkSchedule",
        component: () => import("@/views/admin/report/WorkSchedule.vue"),
        meta: {
          pageTitle: "근무상황부",
          breadcrumbs: ["보고서 관리", "강사관리"],
        },
      },
      {
        path: "SignCheck",
        name: "admin-SignCheck",
        component: () => import("@/views/admin/report/SignCheck.vue"),
        meta: {
          pageTitle: "보고서 관리",
          breadcrumbs: ["보고서 관리", "서명 확인"],
        },
      },
      // 설정 및 사용자 관리
      // 설정 및 사용자 관리 - 관리자 관련
      {
        path: "adminList",
        name: "admin-adminList",
        component: () => import("@/views/admin/userSettings/AdminList.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "관리자 관리"],
        },
      },
      // 설정 및 사용자 관리 - 기관 관련
      
      {
        path: "CouresDetails",
        name: "admin-CouresDetails",
        component: () => import("@/views/admin/Coures/CouresDetails.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "기관 상세보기"],
        },
      },
      {
        path: "CouresEdit",
        name: "admin-CouresEdit",
        component: () => import("@/views/admin/Coures/CouresEdit.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "기관 수정"],
        },
      },
      {
        path: "CouresAdd",
        name: "admin-CouresAdd",
        component: () => import("@/views/admin/Coures/CouresAdd.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "기관 생성"],
        },
      },
      {
        path: "CouresList",
        name: "admin-CouresList",
        component: () => import("@/views/admin/Coures/CouresList.vue"),
        meta: {
          pageTitle: "교육기관 조회",
          breadcrumbs: ["교육기관 관리", "교육기관 조회"],
        },
      },
      {
        path: "SchoolList",
        name: "admin-SchoolList",
        component: () => import("@/views/admin/userSettings/SchoolList.vue"),
        meta: {
          pageTitle: "교육기관 조회",
          breadcrumbs: ["교육기관 관리", "교육기관 조회"],
        },
      },
      {
        path: "SchoolType",
        name: "admin-SchoolType",
        component: () => import("@/views/admin/userSettings/SchoolType.vue"),
        meta: {
          pageTitle: "교육기관 관리",
          breadcrumbs: ["교육기관 관리", "교육기관 타입 설정"],
        },
      },
      {
        path: "EducationType",
        name: "admin-EducationType",
        component: () => import("@/views/admin/userSettings/EducationType.vue"),
        meta: {
          pageTitle: "교육기관 관리",
          breadcrumbs: ["교육 관리", "교육 타입 설정"],
        },
      },
      {
        path: "AllowanceType",
        name: "admin-AllowanceType",
        component: () => import("@/views/admin/userSettings/AllowanceType.vue"),
        meta: {
          pageTitle: "교육기관 관리",
          breadcrumbs: ["교육 관리", "교육 타입 설정"],
        },
      },
      {
        path: "NoticeList",
        name: "admin-NoticeList",
        component: () => import("@/views/admin/userSettings/NoticeList.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "공지사항 관리"],
        },
      },
      {
        path: "NoticeDetails",
        name: "admin-NoticeDetails",
        component: () => import("@/views/admin/userSettings/NoticeDetails.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "공지사항 상세보기"],
        },
      },
      {
        path: "SchoolDetails",
        name: "admin-SchoolDetails",
        component: () => import("@/views/admin/userSettings/SchoolDetails.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "기관 상세보기"],
        },
      },
      {
        path: "SchoolEdit",
        name: "admin-SchoolEdit",
        component: () => import("@/views/admin/userSettings/SchoolEdit.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "기관 수정"],
        },
      },
      {
        path: "SchoolAdd",
        name: "admin-SchoolAdd",
        component: () => import("@/views/admin/userSettings/SchoolAdd.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "기관 생성"],
        },
      },
      // 설정 및 사용자 관리 - 강사 관련
      {
        path: "TeacherAdd",
        name: "admin-TeacherAdd",
        component: () => import("@/views/admin/userSettings/TeacherAdd.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "강사 생성"],
        },
      },
      {
        path: "TeacherDetails",
        name: "admin-TeacherDetails",
        component: () => import("@/views/admin/userSettings/TeacherDetails.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "강사 상세정보"],
        },
      },
      {
        path: "TeacherEdit",
        name: "admin-TeacherEdit",
        component: () => import("@/views/admin/userSettings/TeacherEdit.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "강사 수정"],
        },
      },
      {
        path: "TeacherList",
        name: "admin-TeacherList",
        component: () => import("@/views/admin/userSettings/TeacherList.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "강사 관리"],
        },
      },
      // 설정 및 사용자 관리 - 시스템 설정 관련
      {
        path: "SystemSettings",
        name: "admin-SystemSettings",
        component: () => import("@/views/admin/userSettings/SystemSettings.vue"),
        meta: {
          pageTitle: "설정 및 사용자 관리",
          breadcrumbs: ["설정 및 사용자 관리", "시스템 설정"],
        },
      },
      // 10월 22일 이전 작업페이지(정리예정)
      {
        path: "EducationList",
        name: "admin-EducationList",
        component: () => import("@/views/apps/customers/EducationList.vue"),
        meta: {
          pageTitle: "보고서 관리",
          breadcrumbs: ["보고서 관리", "교육 목록"],
        },
      },
      {
        path: "AdminAttendance",
        name: "admin-AdminAttendance",
        component: () => import("@/views/apps/subscriptions/AdminAttendance.vue"),
        meta: {
          pageTitle: "교육일지",
          breadcrumbs: ["배정 정보 관리", "교육일지"],
        },
      },
      {
        path: "AdminAttendanceEdit",
        name: "admin-AdminAttendanceEdit",
        component: () => import("@/views/apps/subscriptions/AdminAttendanceEdit.vue"),
        meta: {
          pageTitle: "교육일지",
          breadcrumbs: ["배정 정보 관리", "교육일지"],
        },
      },
      {
        path: "EditEducationJournal",
        name: "admin-EditEducationJournal",
        component: () => import("@/views/apps/subscriptions/EditEducationJournal.vue"),
        meta: {
          pageTitle: "교육일지",
          breadcrumbs: ["배정 정보 관리", "교육일지"],
        },
      },
      {
        path: "EducationJournal",
        name: "admin-EducationJournal",
        component: () => import("@/views/apps/subscriptions/EducationJournal.vue"),
        meta: {
          pageTitle: "교육일지",
          breadcrumbs: ["배정 정보 관리", "교육일지"],
        },
      },
      {
        path: "syllabus",
        name: "admin-syllabus",
        component: () => import("@/views/apps/subscriptions/syllabus.vue"),
        meta: {
          pageTitle: "강의확인서",
          breadcrumbs: ["배정 정보 관리", "강의확인서"],
        },
      },
      {
        path: "adminsyllabus",
        name: "admin-adminsyllabus",
        component: () => import("@/views/apps/subscriptions/adminsyllabus.vue"),
        meta: {
          pageTitle: "강의계획서",
          breadcrumbs: ["배정 정보 관리", "강의계획서"],
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
        component: () => import("@/views/apps/subscriptions/Lists.vue"),
        meta: {
          pageTitle: "강사관리",
          breadcrumbs: ["강사 정보 관리", "강사관리"],
        },
      },
      {
        path: "WorkSituation",
        name: "admin-WorkSituation",
        component: () => import("@/views/apps/subscriptions/WorkSituation.vue"),
        meta: {
          pageTitle: "근무상황부",
          breadcrumbs: ["강사 정보 관리", "근무상황부"],
        },
      },
      {
        path: "BusinessJournal",
        name: "admin-BusinessJournal",
        component: () => import("@/views/apps/subscriptions/BusinessJournal.vue"),
        meta: {
          pageTitle: "업무일지",
          breadcrumbs: ["강사 정보 관리", "업무일지"],
        },
      },
      {
        path: "BusinessJournalList",
        name: "admin-BusinessJournalList",
        component: () => import("@/views/apps/subscriptions/BusinessJournallist.vue"),
        meta: {
          pageTitle: "업무일지",
          breadcrumbs: ["강사 정보 관리", "업무일지"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
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

  {
    path: "/client",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "sign-in",
        name: "client-sign-in",
        component: () =>
          import("@/views/client/login/client-SignIn.vue"),
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
    path: "/client",
    redirect: "/client/dashborad",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      // middleware: "auth",
    },
    children: [
      // 대시보드
      {
        path: "dashboard",
        name: "client-dashboard",
        component: () => import("@/views/client/dashborad/appSchedule.vue"),
        meta: {
          pageTitle: "대시보드",
          breadcrumbs: ["대시보드"],
        },
      },
      // 전체 프로그램 현황
      {
        path: "allProgram",
        name: "client-allProgram",
        component: () => import("@/views/client/dashborad/allProgram.vue"),
        meta: {
          pageTitle: "대시보드",
          breadcrumbs: ["대시보드"],
        },
      },
      // 교육 일정 및 진행 상황
      {
        path: "appSchedule",
        name: "client-appSchedule",
        component: () => import("@/views/client/dashborad/appSchedule.vue"),
        meta: {
          pageTitle: "대시보드",
          breadcrumbs: ["대시보드"],
        },
      },
      // 프로그램 목록 조회
      {
        path: "programList",
        name: "client-programList",
        component: () => import("@/views/client/programMana/programList.vue"),
        meta: {
          pageTitle: "대시보드",
          breadcrumbs: ["대시보드"],
        },
      },
      {
        path: "programDetails",
        name: "client-programDetails",
        component: () => import("@/views/client/programMana/programDetails.vue"),
        meta: {
          pageTitle: "대시보드",
          breadcrumbs: ["대시보드"],
        },
      },
      // 기관별 신청 조회
      {
        path: "appliList",
        name: "client-appliList",
        component: () => import("@/views/client/appliMana/appliList.vue"),
        meta: {
          pageTitle: "대시보드",
          breadcrumbs: ["대시보드"],
        },
      },
      {
        path: "appliDetails",
        name: "client-appliDetails",
        component: () => import("@/views/client/appliMana/appliDetails.vue"),
        meta: {
          pageTitle: "대시보드",
          breadcrumbs: ["대시보드"],
        },
      },
      // 강사 신청 목록 조회
      {
        path: "instApplList",
        name: "client-instApplList",
        component: () => import("@/views/client/alloMana/instApplList.vue"),
        meta: {
          pageTitle: "대시보드",
          breadcrumbs: ["대시보드"],
        },
      },
      // 강사 출강 일정 조회
      {
        path: "instAttenSchedule",
        name: "client-instAttenSchedule",
        component: () => import("@/views/client/alloMana/instAttenSchedule.vue"),
        meta: {
          pageTitle: "대시보드",
          breadcrumbs: ["대시보드"],
        },
      },
      {
        path: "BusinessJournalLlist",
        name: "client-BusinessJournalLlist",
        component: () => import("@/views/client/reportSubmit/BusinessJournalLlist.vue"),
        meta: {
          pageTitle: "보고서 제출",
          breadcrumbs: ["보고서 제출", "업무 일지"],
        },
      },
      {
        path: "EducationalReportList",
        name: "client-EducationalReportList",
        component: () => import("@/views/client/reportSubmit/EducationalReportList.vue"),
        meta: {
          pageTitle: "보고서 제출",
          breadcrumbs: ["보고서 제출", "교육 일지"],
        },
      },
      {
        path: "WorkSituation",
        name: "client-WorkSituation",
        component: () => import("@/views/client/reportSubmit/WorkSituation.vue"),
        meta: {
          pageTitle: "보고서 제출",
          breadcrumbs: ["보고서 제출", "근무상황부"],
        },
      },
      // 서명
      {
        path: "SignList",
        name: "client-SignList",
        component: () => import("@/views/client/sign/SignList.vue"),
        meta: {
          pageTitle: "서명",
          breadcrumbs: ["서명", "서명 리스트"],
        },
      },
      {
        path: "MySign",
        name: "client-MySign",
        component: () => import("@/views/client/sign/MySign.vue"),
        meta: {
          pageTitle: "서명",
          breadcrumbs: ["서명", "내 서명 관리"],
        },
      },
      {
        path: "MyProfile",
        name: "client-MyProfile",
        component: () => import("@/views/apps/customers/MyProfile.vue"),
        meta: {
          pageTitle: "마이페이지",
          breadcrumbs: ["마이페이지"],
        },
      },
      // // 출강 일정
      // {
      //   path: "MyEdu",
      //   name: "user-MyEdu",
      //   component: () => import("@/views/teacher/lectureSchedule/MyEdu.vue"),
      //   meta: {
      //     pageTitle: "출강 일정",
      //     breadcrumbs: ["출강 일정", "내 출강 리스트"],
      //   },
      // },
      // // 출강 신청
      // {
      //   path: "EduView",
      //   name: "user-EduView",
      //   component: () => import("@/views/teacher/lectureSchedule/EduView.vue"),
      //   meta: {
      //     pageTitle: "출강 신청",
      //     breadcrumbs: ["출강 신청", "오픈 예정 교육"],
      //   },
      // },
      // {
      //   path: "EduAppl",
      //   name: "user-EduAppl",
      //   component: () => import("@/views/teacher/lectureSchedule/EduAppl.vue"),
      //   meta: {
      //     pageTitle: "출강 신청",
      //     breadcrumbs: ["출강 신청", "출강 신청"],
      //   },
      // },
      // {
      //   path: "MyApplEdu",
      //   name: "user-MyApplEdu",
      //   component: () => import("@/views/apps/user/MyApplEdu.vue"),
      //   meta: {
      //     pageTitle: "출강 신청",
      //     breadcrumbs: ["출강 신청", "출강 신청 내역"],
      //   },
      // },
      // // 보고서 제출
      // {
      //   path: "SubmissionEdu",
      //   name: "user-SubmissionEdu",
      //   component: () => import("@/views/teacher/reportSubmit/SubmissionEdu.vue"),
      //   meta: {
      //     pageTitle: "보고서 제출",
      //     breadcrumbs: ["보고서 제출", "교육별 제출 현황"],
      //   },
      // },
      // {
      //   path: "BusinessJournalLlist",
      //   name: "user-BusinessJournalLlist",
      //   component: () => import("@/views/teacher/reportSubmit/BusinessJournalLlist.vue"),
      //   meta: {
      //     pageTitle: "보고서 제출",
      //     breadcrumbs: ["보고서 제출", "업무 일지"],
      //   },
      // },
      // {
      //   path: "EducationalReportList",
      //   name: "user-EducationalReportList",
      //   component: () => import("@/views/teacher/reportSubmit/EducationalReportList.vue"),
      //   meta: {
      //     pageTitle: "보고서 제출",
      //     breadcrumbs: ["보고서 제출", "교육 일지"],
      //   },
      // },
      // {
      //   path: "WorkSituation",
      //   name: "user-WorkSituation",
      //   component: () => import("@/views/teacher/reportSubmit/WorkSituation.vue"),
      //   meta: {
      //     pageTitle: "보고서 제출",
      //     breadcrumbs: ["보고서 제출", "근무상황부"],
      //   },
      // },
      // // 서명
      // {
      //   path: "SignList",
      //   name: "user-SignList",
      //   component: () => import("@/views/teacher/sign/SignList.vue"),
      //   meta: {
      //     pageTitle: "서명",
      //     breadcrumbs: ["서명", "서명 리스트"],
      //   },
      // },
      // {
      //   path: "MySign",
      //   name: "user-MySign",
      //   component: () => import("@/views/teacher/sign/MySign.vue"),
      //   meta: {
      //     pageTitle: "서명",
      //     breadcrumbs: ["서명", "내 서명 관리"],
      //   },
      // },
      
    ],
  },


];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
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
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;
  configStore.resetLayoutConfig();
  authStore.verifyAuth();
  
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
