import { relations } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "editor",
  "viewer",
]);

export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "published",
  "archived",
]);

export const categoryTypeEnum = pgEnum("category_type", [
  "news",
  "document",
  "page",
  "general",
]);

export const newsKindEnum = pgEnum("news_kind", [
  "news",
  "announcement",
  "event",
  "federal",
]);

export const pageLayoutEnum = pgEnum("page_layout", [
  "default",
  "svedeniya",
  "roditelyam",
  "pedagogam",
]);

export const pageTemplateEnum = pgEnum("page_template", [
  "page",
  "hub",
  "homepage",
  "news_index",
  "documents_index",
  "employees_index",
  "contacts",
]);

export const menuLocationEnum = pgEnum("menu_location", [
  "header",
  "footer_official",
  "footer_more",
  "svedeniya",
  "roditelyam",
  "pedagogam",
  "quick",
]);

export const auditActionEnum = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
  "publish",
  "login",
  "logout",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    role: userRoleEnum("role").notNull().default("editor"),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("users_email_idx").on(t.email),
    index("users_role_idx").on(t.role),
  ],
);

export const media = pgTable(
  "media",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    filename: varchar("filename", { length: 255 }).notNull(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 127 }).notNull(),
    sizeBytes: integer("size_bytes").notNull().default(0),
    width: integer("width"),
    height: integer("height"),
    storagePath: text("storage_path").notNull(),
    url: text("url").notNull(),
    alt: varchar("alt", { length: 500 }),
    uploadedById: uuid("uploaded_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    index("media_mime_idx").on(t.mimeType),
    index("media_uploaded_by_idx").on(t.uploadedById),
  ],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 191 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    type: categoryTypeEnum("type").notNull().default("general"),
    description: text("description"),
    parentId: uuid("parent_id"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("categories_type_slug_idx").on(t.type, t.slug),
    index("categories_parent_idx").on(t.parentId),
    foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
      name: "categories_parent_fk",
    }).onDelete("set null"),
  ],
);

export const pages = pgTable(
  "pages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    path: varchar("path", { length: 512 }).notNull(),
    slug: varchar("slug", { length: 191 }).notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    layout: pageLayoutEnum("layout").notNull().default("default"),
    template: pageTemplateEnum("template").notNull().default("page"),
    status: contentStatusEnum("status").notNull().default("draft"),
    parentId: uuid("parent_id"),
    coverId: uuid("cover_id").references(() => media.id, {
      onDelete: "set null",
    }),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: varchar("seo_description", { length: 500 }),
    sortOrder: integer("sort_order").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdById: uuid("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    updatedById: uuid("updated_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("pages_path_idx").on(t.path),
    index("pages_status_idx").on(t.status),
    index("pages_parent_idx").on(t.parentId),
    index("pages_slug_idx").on(t.slug),
    foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
      name: "pages_parent_fk",
    }).onDelete("set null"),
  ],
);

export const pageBlocks = pgTable(
  "page_blocks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 64 }).notNull(),
    data: jsonb("data").$type<Record<string, unknown>>().notNull().default({}),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    ...timestamps,
  },
  (t) => [
    index("page_blocks_page_idx").on(t.pageId),
    index("page_blocks_page_sort_idx").on(t.pageId, t.sortOrder),
  ],
);

export const news = pgTable(
  "news",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 191 }).notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    excerpt: text("excerpt").notNull(),
    body: jsonb("body").$type<string[]>().notNull().default([]),
    kind: newsKindEnum("kind").notNull().default("news"),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    coverId: uuid("cover_id").references(() => media.id, {
      onDelete: "set null",
    }),
    isUrgent: boolean("is_urgent").notNull().default(false),
    status: contentStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdById: uuid("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    updatedById: uuid("updated_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("news_slug_idx").on(t.slug),
    index("news_status_published_idx").on(t.status, t.publishedAt),
    index("news_kind_idx").on(t.kind),
    index("news_category_idx").on(t.categoryId),
  ],
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 191 }).notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    fileId: uuid("file_id").references(() => media.id, {
      onDelete: "set null",
    }),
    documentDate: varchar("document_date", { length: 64 }),
    sizeLabel: varchar("size_label", { length: 32 }),
    isSigned: boolean("is_signed").notNull().default(false),
    status: contentStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdById: uuid("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    updatedById: uuid("updated_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("documents_slug_idx").on(t.slug),
    index("documents_category_idx").on(t.categoryId),
    index("documents_status_idx").on(t.status),
  ],
);

export const employees = pgTable(
  "employees",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 191 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    role: varchar("role", { length: 500 }).notNull(),
    subjects: jsonb("subjects").$type<string[]>().notNull().default([]),
    phone: varchar("phone", { length: 64 }),
    email: varchar("email", { length: 255 }),
    receptionHours: varchar("reception_hours", { length: 128 }),
    education: text("education"),
    qualification: text("qualification"),
    experienceYears: integer("experience_years"),
    professionalExperienceYears: integer("professional_experience_years"),
    development: jsonb("development").$type<string[]>().notNull().default([]),
    programs: jsonb("programs").$type<string[]>().notNull().default([]),
    isLeadership: boolean("is_leadership").notNull().default(false),
    photoId: uuid("photo_id").references(() => media.id, {
      onDelete: "set null",
    }),
    sortOrder: integer("sort_order").notNull().default(0),
    status: contentStatusEnum("status").notNull().default("published"),
    createdById: uuid("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    updatedById: uuid("updated_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("employees_slug_idx").on(t.slug),
    index("employees_leadership_idx").on(t.isLeadership),
    index("employees_status_idx").on(t.status),
  ],
);

export const menuItems = pgTable(
  "menu_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    location: menuLocationEnum("location").notNull(),
    parentId: uuid("parent_id"),
    label: varchar("label", { length: 255 }).notNull(),
    href: varchar("href", { length: 1024 }).notNull(),
    pageId: uuid("page_id").references(() => pages.id, {
      onDelete: "set null",
    }),
    sortOrder: integer("sort_order").notNull().default(0),
    isExternal: boolean("is_external").notNull().default(false),
    isVisible: boolean("is_visible").notNull().default(true),
    openInNewTab: boolean("open_in_new_tab").notNull().default(false),
    ...timestamps,
  },
  (t) => [
    index("menu_items_location_idx").on(t.location, t.sortOrder),
    index("menu_items_parent_idx").on(t.parentId),
    foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
      name: "menu_items_parent_fk",
    }).onDelete("set null"),
  ],
);

export const settings = pgTable(
  "settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 191 }).notNull(),
    value: jsonb("value").$type<unknown>().notNull(),
    group: varchar("group", { length: 64 }).notNull().default("general"),
    description: text("description"),
    updatedById: uuid("updated_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("settings_key_idx").on(t.key),
    index("settings_group_idx").on(t.group),
  ],
);

export const redirects = pgTable(
  "redirects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fromPath: varchar("from_path", { length: 512 }).notNull(),
    toPath: varchar("to_path", { length: 1024 }).notNull(),
    statusCode: integer("status_code").notNull().default(301),
    isActive: boolean("is_active").notNull().default(true),
    note: text("note"),
    createdById: uuid("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("redirects_from_path_idx").on(t.fromPath),
    index("redirects_active_idx").on(t.isActive),
  ],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: auditActionEnum("action").notNull(),
    entityType: varchar("entity_type", { length: 64 }).notNull(),
    entityId: uuid("entity_id"),
    diff: jsonb("diff").$type<Record<string, unknown>>(),
    ip: varchar("ip", { length: 64 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("audit_logs_entity_idx").on(t.entityType, t.entityId),
    index("audit_logs_user_idx").on(t.userId),
    index("audit_logs_created_idx").on(t.createdAt),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  media: many(media),
  pagesCreated: many(pages, { relationName: "pages_created_by" }),
  newsCreated: many(news),
  documentsCreated: many(documents),
  employeesCreated: many(employees),
  auditLogs: many(auditLogs),
}));

export const mediaRelations = relations(media, ({ one, many }) => ({
  uploadedBy: one(users, {
    fields: [media.uploadedById],
    references: [users.id],
  }),
  pages: many(pages),
  news: many(news),
  documents: many(documents),
  employees: many(employees),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_parent",
  }),
  children: many(categories, { relationName: "category_parent" }),
  news: many(news),
  documents: many(documents),
}));

export const pagesRelations = relations(pages, ({ one, many }) => ({
  parent: one(pages, {
    fields: [pages.parentId],
    references: [pages.id],
    relationName: "page_parent",
  }),
  children: many(pages, { relationName: "page_parent" }),
  cover: one(media, { fields: [pages.coverId], references: [media.id] }),
  createdBy: one(users, {
    fields: [pages.createdById],
    references: [users.id],
    relationName: "pages_created_by",
  }),
  blocks: many(pageBlocks),
  menuItems: many(menuItems),
}));

export const pageBlocksRelations = relations(pageBlocks, ({ one }) => ({
  page: one(pages, {
    fields: [pageBlocks.pageId],
    references: [pages.id],
  }),
}));

export const newsRelations = relations(news, ({ one }) => ({
  category: one(categories, {
    fields: [news.categoryId],
    references: [categories.id],
  }),
  cover: one(media, { fields: [news.coverId], references: [media.id] }),
  createdBy: one(users, {
    fields: [news.createdById],
    references: [users.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  category: one(categories, {
    fields: [documents.categoryId],
    references: [categories.id],
  }),
  file: one(media, { fields: [documents.fileId], references: [media.id] }),
  createdBy: one(users, {
    fields: [documents.createdById],
    references: [users.id],
  }),
}));

export const employeesRelations = relations(employees, ({ one }) => ({
  photo: one(media, {
    fields: [employees.photoId],
    references: [media.id],
  }),
  createdBy: one(users, {
    fields: [employees.createdById],
    references: [users.id],
  }),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  parent: one(menuItems, {
    fields: [menuItems.parentId],
    references: [menuItems.id],
    relationName: "menu_parent",
  }),
  children: many(menuItems, { relationName: "menu_parent" }),
  page: one(pages, {
    fields: [menuItems.pageId],
    references: [pages.id],
  }),
}));

export const settingsRelations = relations(settings, ({ one }) => ({
  updatedBy: one(users, {
    fields: [settings.updatedById],
    references: [users.id],
  }),
}));

export const redirectsRelations = relations(redirects, ({ one }) => ({
  createdBy: one(users, {
    fields: [redirects.createdById],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type PageBlock = typeof pageBlocks.$inferSelect;
export type News = typeof news.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Media = typeof media.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type Redirect = typeof redirects.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
