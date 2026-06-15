import React from "react";
import { RootLayout } from "@payloadcms/next/layouts";
import { handleServerFunctions } from "./actions";
import "@payloadcms/next/css";
import "./tailwind-admin.css";
import config from "../../payload.config.ts";
import { importMap } from "./admin/importMap.js";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <RootLayout config={config} importMap={importMap} serverFunction={handleServerFunctions}>
    {children}
  </RootLayout>
);

export default Layout;
