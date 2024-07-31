import type { MenuItem } from "@/layouts/default-layout/config/types";

const UserMainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "Dashboard",
        route: "/userdashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
];

export default UserMainMenuConfig;
