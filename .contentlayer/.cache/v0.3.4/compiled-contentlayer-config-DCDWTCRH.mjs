// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import { transformerMetaHighlight } from "@shikijs/transformers";
import { visit } from "unist-util-visit";
function rehypeFixClassName() {
  return (tree) => {
    visit(tree, "element", (node) => {
      const props = node.properties;
      if (props && "class" in props) {
        props.className = props.class;
        delete props.class;
      }
    });
  };
}
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    description: { type: "string" },
    tags: { type: "list", of: { type: "string" } },
    cover: { type: "string" }
    // ✅ 新增這行
  },
  computedFields: {
    slug: { type: "string", resolve: (d) => d._raw.sourceFileName.replace(/\.mdx?$/, "") },
    url: { type: "string", resolve: (d) => `/blog/${d._raw.sourceFileName.replace(/\.mdx?$/, "")}` }
  }
}));
var Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/**/*.mdx`,
  // ✅ 改成 .mdx，統一規格
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    description: { type: "string" },
    tags: { type: "list", of: { type: "string" } },
    image: { type: "string" },
    url: { type: "string" },
    externalUrl: { type: "string" },
    // 可用來記錄外部連結
    cover: { type: "string" }
    // ✅ 新增這行
  },
  computedFields: {
    slug: { type: "string", resolve: (d) => d._raw.sourceFileName.replace(/\.mdx?$/, "") },
    url: { type: "string", resolve: (d) => `/projects/${d._raw.sourceFileName.replace(/\.mdx?$/, "")}` }
  }
}));
var Author = defineDocumentType(() => ({
  name: "Author",
  filePathPattern: `authors/*.mdx`,
  // ✅ 這行改對了
  contentType: "mdx",
  // ✅ 要支援 <br /> 等標籤
  fields: {
    name: { type: "string", required: true },
    avatar: { type: "string" },
    occupation: { type: "string" },
    company: { type: "string" },
    email: { type: "string" },
    github: { type: "string" },
    facebook: { type: "string" },
    youtube: { type: "string" },
    instagram: { type: "string" },
    medium: { type: "string" },
    linkedin: { type: "string" },
    x: { type: "string" }
  },
  computedFields: {
    // ✅ 注意這裡也要改成 .mdx
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, "")
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Post, Author, Project],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      //rehypeRaw,
      [
        rehypeShiki,
        {
          themes: {
            light: "github-light",
            dark: "one-dark-pro"
          },
          transformers: [transformerMetaHighlight()]
        }
      ],
      rehypeFixClassName
      // ✅ 這行要放外面，獨立 plugin
    ]
  }
});
export {
  Author,
  Post,
  Project,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-DCDWTCRH.mjs.map
