// src/lib/tags.ts
export const toTagSlug = (name: string) =>
    name.trim().toLowerCase().replace(/\s+/g, "-");

export const fromTagSlug = (slug: string) =>
    slug.replace(/-/g, " ");

export function collectTagCounts(tagsList: string[][]) {
    const map = new Map<string, number>();
    for (const tags of tagsList) {
        for (const t of tags ?? []) {
            const key = t.trim();
            if (!key) continue;
            map.set(key, (map.get(key) ?? 0) + 1);
        }
    }
    // 依照次數多到少，再依字母排序
    return [...map.entries()].sort((a, b) =>
        b[1] - a[1] || a[0].localeCompare(b[0], "en")
    );
}
