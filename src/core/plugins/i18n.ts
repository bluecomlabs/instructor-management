import EducationalDetails from "@/views/admin/userSettings/InstitutionDetails.vue";
import { createI18n } from "vue-i18n";

const messages = {
  ko: {
    // dashboard: "대시보드",
    // craft: "교육관리",
    // pages: "신청 가능한 교육",
    // profile: "마이페이지",
    // apps: "교육 관리",
    // resources: "교육 리소스 관리",
    // lists: "강사관리",
    // ResearchNote: "업무일지",
    // customersListing: "신청 가능한 교육",
    // programdetails : "교육프로그램 관리",
    // customerDetails: "마이페이지",
    // calendarApp: "교육 배정 현황",
    // myprofile : "마이페이지",
    // completeList : "강사 출강관리",
    // educationaldetails : "교육기관 관리",
  },
};

const i18n = createI18n({
  legacy: false,
  locale: "ko",
  globalInjection: true,
  messages,
});

export default i18n;
