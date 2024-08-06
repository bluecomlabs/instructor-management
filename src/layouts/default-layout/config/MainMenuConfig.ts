import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/admin/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "myprofile",
        route: "/admin/MyProfile",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-printer",
      },
    ],
  },
  {
    heading: "apps",
    route: "/apps",
    pages: [
      {
        heading: "completeList",
        route: "/admin/completeList",
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
        route: "/admin/ProgramDetails",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "educationaldetails",
        route: "/admin/EducationalDetails",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "widgetsLists",
        route: "/crafted/widgets/lists",
        keenthemesIcon: "element-7",
        bootstrapIcon: "bi-layers",
      },
    ],
  },
];

export default MainMenuConfig;
