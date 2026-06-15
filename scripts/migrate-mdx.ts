/**
 * MDX → Payload/Supabase 遷移腳本
 *
 * 使用方式:
 *   1. 複製 .env.example 為 .env.local 並填入 Supabase 設定
 *   2. 確保已執行 `npm run payload generate:types` 產生 payload-types.ts
 *   3. 執行: npm run migrate
 *
 * 功能:
 *   - 讀取 content/posts/*.mdx → 寫入 Payload posts collection
 *   - 讀取 content/projects/*.mdx → 寫入 Payload projects collection
 *   - 讀取 content/authors/*.mdx → 寫入 Payload authors collection
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// 載入環境變數
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

// ── Frontmatter 解析 ────────────────────────────────────────

interface Frontmatter {
  title?: string;
  date?: string;
  description?: string;
  tags?: string[];
  cover?: string;
  slug?: string;
  name?: string;
  avatar?: string;
  occupation?: string;
  company?: string;
  email?: string;
  github?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  medium?: string;
  linkedin?: string;
  x?: string;
  image?: string;
  url?: string;
  externalUrl?: string;
  [key: string]: unknown;
}

function parseFrontmatter(raw: string): { frontmatter: Frontmatter; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: raw };

  const yamlLines = match[1].split("\n");
  const frontmatter: Frontmatter = {};

  for (const line of yamlLines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    // 移除引號
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // 解析陣列：[a, b, c]
    if (value.startsWith("[") && value.endsWith("]")) {
      frontmatter[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
    } else {
      frontmatter[key] = value || undefined;
    }
  }

  return { frontmatter, content: match[2].trim() };
}

// ── Payload REST API 呼叫 ─────────────────────────────────────

const API_URL = process.env.PAYLOAD_API_URL || "http://localhost:3000/api";
let authToken = "";

async function login(): Promise<void> {
  console.log("🔐 登入 Payload CMS...");

  const email = process.env.MIGRATE_EMAIL || "admin@example.com";
  const password = process.env.MIGRATE_PASSWORD || "";

  if (!password) {
    throw new Error("請在 .env.local 設定 MIGRATE_EMAIL 和 MIGRATE_PASSWORD（管理員帳號）");
  }

  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`登入失敗: ${res.status} ${text}`);
  }

  const data = await res.json();
  authToken = data.token;
  console.log("✅ 登入成功");
}

async function createDoc(collection: string, data: object): Promise<{ id: number | string }> {
  const res = await fetch(`${API_URL}/${collection}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`建立 ${collection} 失敗: ${res.status} ${text}`);
  }

  return res.json();
}

async function checkExists(collection: string, slug: string): Promise<boolean> {
  const res = await fetch(
    `${API_URL}/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
    {
      headers: { Authorization: `JWT ${authToken}` },
    }
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data.totalDocs > 0;
}

// ── 遷移 Posts ──────────────────────────────────────────────

async function migratePosts(): Promise<void> {
  const postsDir = path.join(process.cwd(), "content", "posts");
  if (!fs.existsSync(postsDir)) {
    console.log("⚠️  content/posts 目錄不存在，跳過");
    return;
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));
  console.log(`\n📝 找到 ${files.length} 篇 blog posts`);

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { frontmatter, content } = parseFrontmatter(raw);

    const exists = await checkExists("posts", slug);
    if (exists) {
      console.log(`  ⏭️  跳過（已存在）: ${slug}`);
      continue;
    }

    try {
      const doc = await createDoc("posts", {
        title: frontmatter.title || slug,
        slug,
        date: frontmatter.date || new Date().toISOString(),
        description: frontmatter.description || "",
        tags: (frontmatter.tags as string[] || []).map((t) => ({ value: t })),
        content,
        status: "published",
      });
      console.log(`  ✅ 已建立: ${frontmatter.title || slug} (id: ${doc.id})`);
    } catch (err) {
      console.error(`  ❌ 失敗: ${slug}`, err instanceof Error ? err.message : err);
    }
  }
}

// ── 遷移 Projects ────────────────────────────────────────────

async function migrateProjects(): Promise<void> {
  const projectsDir = path.join(process.cwd(), "content", "projects");
  if (!fs.existsSync(projectsDir)) {
    console.log("⚠️  content/projects 目錄不存在，跳過");
    return;
  }

  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));
  console.log(`\n🚀 找到 ${files.length} 個 projects`);

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(projectsDir, file), "utf-8");
    const { frontmatter, content } = parseFrontmatter(raw);

    const exists = await checkExists("projects", slug);
    if (exists) {
      console.log(`  ⏭️  跳過（已存在）: ${slug}`);
      continue;
    }

    try {
      const doc = await createDoc("projects", {
        title: frontmatter.title || slug,
        slug,
        date: frontmatter.date || new Date().toISOString(),
        description: frontmatter.description || "",
        tags: (frontmatter.tags as string[] || []).map((t) => ({ value: t })),
        url: frontmatter.url || "",
        externalUrl: frontmatter.externalUrl || "",
        content,
        status: "published",
      });
      console.log(`  ✅ 已建立: ${frontmatter.title || slug} (id: ${doc.id})`);
    } catch (err) {
      console.error(`  ❌ 失敗: ${slug}`, err instanceof Error ? err.message : err);
    }
  }
}

// ── 遷移 Authors ─────────────────────────────────────────────

async function migrateAuthors(): Promise<void> {
  const authorsDir = path.join(process.cwd(), "content", "authors");
  if (!fs.existsSync(authorsDir)) {
    console.log("⚠️  content/authors 目錄不存在，跳過");
    return;
  }

  const files = fs.readdirSync(authorsDir).filter((f) => f.endsWith(".mdx"));
  console.log(`\n👤 找到 ${files.length} 個 authors`);

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(authorsDir, file), "utf-8");
    const { frontmatter } = parseFrontmatter(raw);

    const exists = await checkExists("authors", slug);
    if (exists) {
      console.log(`  ⏭️  跳過（已存在）: ${slug}`);
      continue;
    }

    try {
      const doc = await createDoc("authors", {
        name: frontmatter.name || slug,
        slug,
        occupation: frontmatter.occupation || "",
        company: frontmatter.company || "",
        email: frontmatter.email || "",
        github: frontmatter.github || "",
        linkedin: frontmatter.linkedin || "",
        x: frontmatter.x || "",
        facebook: frontmatter.facebook || "",
        youtube: frontmatter.youtube || "",
        instagram: frontmatter.instagram || "",
        medium: frontmatter.medium || "",
      });
      console.log(`  ✅ 已建立: ${frontmatter.name || slug} (id: ${doc.id})`);
    } catch (err) {
      console.error(`  ❌ 失敗: ${slug}`, err instanceof Error ? err.message : err);
    }
  }
}

// ── 主程式 ───────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("🚀 開始 MDX → Payload 遷移\n");
  console.log(`API URL: ${API_URL}`);

  await login();
  await migratePosts();
  await migrateProjects();
  await migrateAuthors();

  console.log("\n🎉 遷移完成！");
  console.log("請前往 http://localhost:3000/admin 確認資料");
}

main().catch((err) => {
  console.error("❌ 遷移失敗:", err);
  process.exit(1);
});
