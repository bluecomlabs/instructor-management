import type { MenuItem } from "@/layouts/default-layout/config/types";

const ClientMainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "Dashboard",
        route: "/clientdashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
];

export default ClientMainMenuConfig;
