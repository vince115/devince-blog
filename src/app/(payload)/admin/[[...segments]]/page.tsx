import type { Metadata } from "next";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import config from "../../../../payload.config.ts";
import { importMap } from "../importMap.js";

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params: await params, searchParams: await searchParams });

const Page = async ({ params, searchParams }: Args) =>
  RootPage({ config, params: await params, searchParams: await searchParams, importMap });

export default Page;
