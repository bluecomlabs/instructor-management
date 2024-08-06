import type { MenuItem } from "@/layouts/default-layout/config/types";

const UserMainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/user/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "apps",
    route: "/apps",
    pages: [
      {
        heading: "completeList",
        route: "/user/completeList",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "calendarApp",
        route: "/apps/calendar",
        keenthemesIcon: "calendar-8",
        bootstrapIcon: "bi-calendar3-event",
      },
    ],
  },
  {
    heading: "resources",
    route: "/resources",
    pages: [
      // {
      //   heading: "ResearchNote",
      //   route: "/apps/customers/getting-started",
      //   keenthemesIcon: "abstract-38",
      //   bootstrapIcon: "bi-printer",
      // },
      {
        heading: "programdetails",
        route: "/user/ProgramDetails",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "educationaldetails",
        route: "/user/EducationalDetails",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "lists",
        route: "/user/lists",
        keenthemesIcon: "element-7",
        bootstrapIcon: "bi-layers",
      },
    ],
  },
];

export default UserMainMenuConfig;
