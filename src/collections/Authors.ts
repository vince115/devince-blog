import type { CollectionConfig } from "payload";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: {
    useAsTitle: "name",
    group: "內容管理",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "名稱",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "識別碼",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "avatar",
      type: "upload",
      label: "頭像",
      relationTo: "media",
    },
    {
      name: "occupation",
      type: "text",
      label: "職稱",
    },
    {
      name: "company",
      type: "text",
      label: "公司",
    },
    {
      name: "bio",
      type: "textarea",
      label: "自我介紹",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
    },
    {
      name: "github",
      type: "text",
      label: "GitHub URL",
    },
    {
      name: "linkedin",
      type: "text",
      label: "LinkedIn URL",
    },
    {
      name: "x",
      type: "text",
      label: "X (Twitter) URL",
    },
    {
      name: "facebook",
      type: "text",
      label: "Facebook URL",
    },
    {
      name: "youtube",
      type: "text",
      label: "YouTube URL",
    },
    {
      name: "instagram",
      type: "text",
      label: "Instagram URL",
    },
    {
      name: "medium",
      type: "text",
      label: "Medium URL",
    },
  ],
};
