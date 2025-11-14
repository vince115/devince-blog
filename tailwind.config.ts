import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"; // ✅ 用 ESM 匯入

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./content/**/*.{md,mdx}",
    ],
    theme: { extend: {} },
    plugins: [typography], // ✅ 不再使用 require()
};

export default config;
