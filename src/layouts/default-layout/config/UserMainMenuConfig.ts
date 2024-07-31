import type { MenuItem } from "@/layouts/default-layout/config/types";

const UserMainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/userdashboard",
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
        heading: "ResearchNote",
        route: "/apps/customers/getting-started",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "customersListing",
        route: "/apps/customers/customers-listing",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "customerDetails",
        route: "/apps/customers/customer-details",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-printer",
      },
      {
        heading: "widgetsLists",
        route: "/crafted/widgets/lists",
        keenthemesIcon: "element-7",
        bootstrapIcon: "bi-layers",
      },
      {
        heading: "calendarApp",
        route: "/apps/calendar",
        keenthemesIcon: "calendar-8",
        bootstrapIcon: "bi-calendar3-event",
      },
    ],
  },
];

export default UserMainMenuConfig;
