import { z } from "zod";

export const uuidSchema = z.string().uuid("Некорректный идентификатор");

export const slugSchema = z
  .string()
  .min(1)
  .max(191)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Слаг: строчные латиница, цифры и дефис");

export const pathSchema = z
  .string()
  .min(1)
  .max(512)
  .regex(/^\/(?:[a-z0-9-]+\/)*$/, "Путь должен начинаться и заканчиваться /");

export const emailSchema = z
  .string()
  .trim()
  .email("Некорректный email")
  .max(255)
  .transform((v) => v.toLowerCase());

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().max(200).optional(),
});

export const contentStatusSchema = z.enum(["draft", "published", "archived"]);
export const userRoleSchema = z.enum(["admin", "editor", "viewer"]);
export const categoryTypeSchema = z.enum(["news", "document", "page", "general"]);
export const newsKindSchema = z.enum(["news", "announcement", "event", "federal"]);
export const pageLayoutSchema = z.enum([
  "default",
  "svedeniya",
  "roditelyam",
  "pedagogam",
]);
export const pageTemplateSchema = z.enum([
  "page",
  "hub",
  "homepage",
  "news_index",
  "documents_index",
  "employees_index",
  "contacts",
]);
export const menuLocationSchema = z.enum([
  "header",
  "footer_official",
  "footer_more",
  "svedeniya",
  "roditelyam",
  "pedagogam",
  "quick",
]);

export const blockTypeSchema = z.enum([
  "heading",
  "text",
  "image",
  "gallery",
  "cta",
  "news",
  "documents",
  "employees",
  "accordion",
  "tabs",
  "table",
  "links",
  "contacts",
  "html",
  // legacy
  "prose",
  "link_list",
  "alert",
  "definition_list",
  "facts",
]);

const paragraphsSchema = z.object({
  paragraphs: z.array(z.string().min(1)).min(1),
});

const linksItemsSchema = z.object({
  items: z.array(
    z.object({
      label: z.string().min(1),
      href: z.string().min(1),
      external: z.boolean().optional(),
    }),
  ),
});

const blockDataByType: Record<string, z.ZodType> = {
  heading: z.object({
    text: z.string().min(1),
    level: z.union([z.literal(2), z.literal(3)]).default(2),
    anchor: z.string().max(128).optional(),
  }),
  text: paragraphsSchema,
  prose: paragraphsSchema,
  image: z.object({
    src: z.string(),
    alt: z.string().optional().default(""),
    caption: z.string().optional().default(""),
  }),
  gallery: z.object({
    items: z.array(
      z.object({
        src: z.string(),
        alt: z.string().optional().default(""),
      }),
    ),
  }),
  cta: z.object({
    title: z.string().min(1),
    body: z.string().optional().default(""),
    buttonLabel: z.string().min(1),
    href: z.string().min(1),
  }),
  news: z.object({
    limit: z.number().int().min(1).max(50).default(5),
    kind: z
      .enum(["all", "news", "announcement", "event", "federal"])
      .default("all"),
  }),
  documents: z.object({
    categorySlug: z.string().optional(),
    slugs: z.array(z.string()).optional(),
  }),
  employees: z.object({
    mode: z.enum(["all", "leadership", "teachers"]).default("all"),
    limit: z.number().int().min(1).max(100).default(12),
  }),
  accordion: z.object({
    items: z.array(
      z.object({
        question: z.string().min(1),
        answer: z.array(z.string().min(1)).min(1),
      }),
    ),
  }),
  tabs: z.object({
    items: z.array(
      z.object({
        label: z.string().min(1),
        paragraphs: z.array(z.string().min(1)).min(1),
      }),
    ),
  }),
  table: z.object({
    columns: z.array(z.string().min(1)).min(1),
    rows: z.array(z.array(z.string())),
  }),
  links: linksItemsSchema,
  link_list: linksItemsSchema,
  contacts: z.object({
    showAddress: z.boolean().default(true),
    showPhone: z.boolean().default(true),
    showEmail: z.boolean().default(true),
    showHours: z.boolean().default(true),
    note: z.string().optional().default(""),
  }),
  html: z.object({
    html: z.string(),
  }),
  alert: z.object({
    variant: z.enum(["info", "warning", "success", "danger"]).default("info"),
    title: z.string().optional(),
    body: z.string().min(1),
  }),
  definition_list: z.object({
    items: z.array(
      z.object({ term: z.string().min(1), definition: z.string().min(1) }),
    ),
  }),
  facts: z.object({
    items: z.array(
      z.object({ label: z.string().min(1), value: z.string().min(1) }),
    ),
  }),
};

export const pageBlockInputSchema = z
  .object({
    type: blockTypeSchema,
    data: z.record(z.string(), z.unknown()),
    sortOrder: z.number().int().min(0).default(0),
    isVisible: z.boolean().default(true),
  })
  .superRefine((value, ctx) => {
    const schema = blockDataByType[value.type];
    if (!schema) return;
    const parsed = schema.safeParse(value.data);
    if (!parsed.success) {
      ctx.addIssue({
        code: "custom",
        message: "Некорректные данные блока",
        path: ["data"],
      });
    }
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Введите пароль"),
});

export const userCreateSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Пароль не короче 8 символов").max(128),
  name: z.string().trim().min(1).max(255),
  role: userRoleSchema.default("editor"),
  isActive: z.boolean().default(true),
});

export const userUpdateSchema = z.object({
  email: emailSchema.optional(),
  password: z.string().min(8).max(128).optional(),
  name: z.string().trim().min(1).max(255).optional(),
  role: userRoleSchema.optional(),
  isActive: z.boolean().optional(),
});

export const categoryCreateSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1).max(255),
  type: categoryTypeSchema.default("general"),
  description: z.string().max(2000).optional().nullable(),
  parentId: uuidSchema.optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export const mediaCreateSchema = z.object({
  filename: z.string().min(1).max(255),
  originalName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(127),
  sizeBytes: z.number().int().min(0).default(0),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  storagePath: z.string().min(1),
  url: z.string().min(1),
  alt: z.string().max(500).optional().nullable(),
});

export const mediaUpdateSchema = mediaCreateSchema.partial();

export const pageCreateSchema = z.object({
  path: pathSchema,
  slug: slugSchema,
  title: z.string().trim().min(1).max(500),
  description: z.string().max(5000).optional().nullable(),
  layout: pageLayoutSchema.default("default"),
  template: pageTemplateSchema.default("page"),
  status: contentStatusSchema.default("draft"),
  parentId: uuidSchema.optional().nullable(),
  coverId: uuidSchema.optional().nullable(),
  seoTitle: z.string().max(255).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  publishedAt: z.coerce.date().optional().nullable(),
  blocks: z.array(pageBlockInputSchema).optional(),
});

export const pageUpdateSchema = pageCreateSchema.partial();

export const pageBlockCreateSchema = z
  .object({
    pageId: uuidSchema,
    type: blockTypeSchema,
    data: z.record(z.string(), z.unknown()),
    sortOrder: z.number().int().min(0).optional(),
    isVisible: z.boolean().default(true),
  })
  .superRefine((value, ctx) => {
    const schema = blockDataByType[value.type];
    if (!schema) return;
    const parsed = schema.safeParse(value.data);
    if (!parsed.success) {
      ctx.addIssue({
        code: "custom",
        message: "Некорректные данные блока",
        path: ["data"],
      });
    }
  });

export const pageBlockUpdateSchema = z
  .object({
    type: blockTypeSchema.optional(),
    data: z.record(z.string(), z.unknown()).optional(),
    sortOrder: z.number().int().min(0).optional(),
    isVisible: z.boolean().optional(),
    pageId: uuidSchema.optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.type || value.data === undefined) return;
    const schema = blockDataByType[value.type];
    if (!schema) return;
    const parsed = schema.safeParse(value.data);
    if (!parsed.success) {
      ctx.addIssue({
        code: "custom",
        message: "Некорректные данные блока",
        path: ["data"],
      });
    }
  });

export const pageBlocksReorderSchema = z.object({
  pageId: uuidSchema,
  orderedIds: z.array(uuidSchema).min(1),
});export const newsCreateSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1).max(500),
  excerpt: z.string().trim().min(1),
  body: z.array(z.string().min(1)).default([]),
  kind: newsKindSchema.default("news"),
  categoryId: uuidSchema.optional().nullable(),
  coverId: uuidSchema.optional().nullable(),
  isUrgent: z.boolean().default(false),
  status: contentStatusSchema.default("draft"),
  publishedAt: z.coerce.date().optional().nullable(),
});

export const newsUpdateSchema = newsCreateSchema.partial();

export const documentCreateSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1).max(500),
  categoryId: uuidSchema.optional().nullable(),
  fileId: uuidSchema.optional().nullable(),
  documentDate: z.string().max(64).optional().nullable(),
  sizeLabel: z.string().max(32).optional().nullable(),
  isSigned: z.boolean().default(false),
  status: contentStatusSchema.default("draft"),
  publishedAt: z.coerce.date().optional().nullable(),
});

export const documentUpdateSchema = documentCreateSchema.partial();

export const employeeCreateSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1).max(255),
  role: z.string().trim().min(1).max(500),
  subjects: z.array(z.string()).default([]),
  phone: z.string().max(64).optional().nullable(),
  email: z.string().email().max(255).optional().nullable().or(z.literal("")),
  receptionHours: z.string().max(128).optional().nullable(),
  education: z.string().optional().nullable(),
  qualification: z.string().optional().nullable(),
  experienceYears: z.number().int().min(0).max(80).optional().nullable(),
  professionalExperienceYears: z
    .number()
    .int()
    .min(0)
    .max(80)
    .optional()
    .nullable(),
  development: z.array(z.string()).default([]),
  programs: z.array(z.string()).default([]),
  isLeadership: z.boolean().default(false),
  photoId: uuidSchema.optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  status: contentStatusSchema.default("published"),
});

export const employeeUpdateSchema = employeeCreateSchema.partial();

export const menuItemCreateSchema = z.object({
  location: menuLocationSchema,
  parentId: uuidSchema.optional().nullable(),
  label: z.string().trim().min(1).max(255),
  href: z.string().min(1).max(1024),
  pageId: uuidSchema.optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isExternal: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  openInNewTab: z.boolean().default(false),
});

export const menuItemUpdateSchema = menuItemCreateSchema.partial();

export const settingCreateSchema = z.object({
  key: z
    .string()
    .min(1)
    .max(191)
    .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/, "Ключ настройки некорректен"),
  value: z.unknown(),
  group: z.string().min(1).max(64).default("general"),
  description: z.string().max(2000).optional().nullable(),
});

export const settingUpdateSchema = settingCreateSchema.partial();

export const redirectCreateSchema = z.object({
  fromPath: z.string().min(1).max(512),
  toPath: z.string().min(1).max(1024),
  statusCode: z.union([z.literal(301), z.literal(302), z.literal(307), z.literal(308)]).default(301),
  isActive: z.boolean().default(true),
  note: z.string().max(1000).optional().nullable(),
});

export const redirectUpdateSchema = redirectCreateSchema.partial();

export const auditListSchema = paginationSchema.extend({
  entityType: z.string().max(64).optional(),
  action: z.enum(["create", "update", "delete", "publish", "login", "logout"]).optional(),
});

const phoneSchema = z
  .string()
  .trim()
  .min(10, "Укажите номер телефона")
  .max(32)
  .regex(/^[\d\s+()-]+$/, "Некорректный номер телефона");

export const applicationStatusSchema = z.enum([
  "new",
  "in_review",
  "processed",
  "rejected",
]);

export const applicationSubmitSchema = z.object({
  applicantName: z.string().trim().min(2, "Укажите ФИО").max(255),
  classGrade: z.coerce.number().int().min(1).max(11),
  classLetter: z
    .string()
    .trim()
    .min(1, "Укажите букву класса")
    .max(8)
    .transform((v) => v.toUpperCase()),
  phone: phoneSchema,
  childName: z.string().trim().min(2, "Укажите ФИО ребёнка").max(255),
  website: z.string().max(0).optional(),
});

export const applicationUpdateSchema = z.object({
  status: applicationStatusSchema,
  adminNotes: z.string().max(5000).optional().nullable(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
