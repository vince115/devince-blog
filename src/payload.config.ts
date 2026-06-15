import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { Posts } from "./collections/Posts.ts";
import { Projects } from "./collections/Projects.ts";
import { Authors } from "./collections/Authors.ts";
import { Media } from "./collections/Media.ts";
import { Users } from "./collections/Users.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  sharp,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "- devince Blog CMS",
    },
    importMap: {
      baseDir: path.resolve(dirname, "app/(payload)/admin"),
    },
    components: {
      views: {
        login: {
          Component: "@/components/admin/CustomLogin#CustomLogin",
        },
      },
    },
  },

  collections: [Posts, Projects, Authors, Media, Users],

  // 全域預設編輯器（Lexical，但我們主要用 textarea 存 MDX）
  editor: lexicalEditor({}),

  secret: process.env.PAYLOAD_SECRET || "please-set-payload-secret-in-env",

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  // Supabase PostgreSQL（Session mode，支援長連線）
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
    },
  }),

  // Supabase Storage（S3 相容）
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
          generateFileURL: ({ filename }) => {
            const bucket = process.env.SUPABASE_STORAGE_BUCKET || "blog-media";
            const endpoint = process.env.SUPABASE_STORAGE_ENDPOINT || "";
            // Supabase public URL 格式
            return `${endpoint}/object/public/${bucket}/media/${filename}`;
          },
        },
      },
      bucket: process.env.SUPABASE_STORAGE_BUCKET || "blog-media",
      config: {
        credentials: {
          accessKeyId: process.env.SUPABASE_STORAGE_KEY || "",
          secretAccessKey: process.env.SUPABASE_STORAGE_SECRET || "",
        },
        region: process.env.SUPABASE_STORAGE_REGION || "ap-southeast-1",
        endpoint: process.env.SUPABASE_S3_ENDPOINT || "",
        forcePathStyle: true, // Supabase Storage 需要 path style
      },
    }),
  ],

  cors: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],
});
