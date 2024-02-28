import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/kws2100-publishing-a-map-application-ABergli/",
  plugins: [react()],

  server: {
    headers: {
      "Permissions-Policy": "interest-cohort=()",
    },
  },
});
