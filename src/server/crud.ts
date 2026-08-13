import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import type { AnyPgTable } from "drizzle-orm/pg-core";
import { db } from "@/db";
import {
  auditLogs,
  categories,
  documents,
  employees,
  media,
  menuItems,
  news,
  pageBlocks,
  pages,
  redirects,
  settings,
  users,
} from "@/db/schema";
import {
  type UserRole,
  hashPassword,
  requireRole,
} from "@/server/auth";
import { pickDiff, writeAudit } from "@/server/audit";
import {
  badRequest,
  conflict,
  forbidden,
  isForeignKeyViolation,
  isUniqueViolation,
  notFound,
} from "@/server/errors";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  documentCreateSchema,
  documentUpdateSchema,
  employeeCreateSchema,
  employeeUpdateSchema,
  mediaCreateSchema,
  mediaUpdateSchema,
  menuItemCreateSchema,
  menuItemUpdateSchema,
  newsCreateSchema,
  newsUpdateSchema,
  pageBlockCreateSchema,
  pageBlockUpdateSchema,
  pageBlocksReorderSchema,
  pageCreateSchema,
  pageUpdateSchema,
  paginationSchema,
  redirectCreateSchema,
  redirectUpdateSchema,
  settingCreateSchema,
  settingUpdateSchema,
  userCreateSchema,
  userUpdateSchema,
} from "@/server/validation";
import { z, type ZodType } from "zod";

function parse<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw badRequest("Ошибка валидации", result.error.flatten());
  }
  return result.data;
}

function now() {
  return new Date();
}

async function wrapDb<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw conflict("Запись с таким уникальным значением уже существует");
    }
    if (isForeignKeyViolation(error)) {
      throw badRequest("Ссылка на несуществующую запись");
    }
    throw error;
  }
}

function withoutSecret<T extends { passwordHash?: string }>(row: T) {
  const { passwordHash: _ignored, ...rest } = row;
  return rest;
}

async function requireWrite(min: UserRole) {
  return requireRole(min);
}

export async function listUsers(input: unknown) {
  await requireRole("admin");
  const { page, perPage, q } = parse(paginationSchema, input ?? {});
  const where = q
    ? or(ilike(users.email, `%${q}%`), ilike(users.name, `%${q}%`))
    : undefined;
  const [items, [total]] = await Promise.all([
    db
      .select()
      .from(users)
      .where(where)
      .orderBy(asc(users.name))
      .limit(perPage)
      .offset((page - 1) * perPage),
    db.select({ value: count() }).from(users).where(where),
  ]);
  return {
    items: items.map(withoutSecret),
    page,
    perPage,
    total: total.value,
  };
}

export async function getUser(id: string) {
  await requireRole("admin");
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!row) throw notFound("Пользователь не найден");
  return withoutSecret(row);
}

export async function createUser(input: unknown) {
  const actor = await requireWrite("admin");
  const data = parse(userCreateSchema, input);
  const row = await wrapDb(async () => {
    const [created] = await db
      .insert(users)
      .values({
        email: data.email,
        passwordHash: await hashPassword(data.password),
        name: data.name,
        role: data.role,
        isActive: data.isActive,
      })
      .returning();
    return created;
  });
  await writeAudit({
    user: actor,
    action: "create",
    entityType: "users",
    entityId: row.id,
    diff: pickDiff(null, { email: row.email, role: row.role }),
  });
  return withoutSecret(row);
}

export async function updateUser(id: string, input: unknown) {
  const actor = await requireWrite("admin");
  const data = parse(userUpdateSchema, input);
  const [before] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!before) throw notFound("Пользователь не найден");
  if (before.role === "admin" && data.role && data.role !== "admin") {
    const [admins] = await db
      .select({ value: count() })
      .from(users)
      .where(and(eq(users.role, "admin"), eq(users.isActive, true)));
    if (admins.value <= 1) {
      throw conflict("Нельзя снять роль с последнего администратора");
    }
  }
  const patch: Partial<typeof users.$inferInsert> = { updatedAt: now() };
  if (data.email) patch.email = data.email;
  if (data.name) patch.name = data.name;
  if (data.role) patch.role = data.role;
  if (data.isActive !== undefined) patch.isActive = data.isActive;
  if (data.password) patch.passwordHash = await hashPassword(data.password);
  const [row] = await wrapDb(() =>
    db.update(users).set(patch).where(eq(users.id, id)).returning(),
  );
  await writeAudit({
    user: actor,
    action: "update",
    entityType: "users",
    entityId: id,
    diff: pickDiff(
      { email: before.email, role: before.role, isActive: before.isActive },
      { email: row.email, role: row.role, isActive: row.isActive },
    ),
  });
  return withoutSecret(row);
}

export async function deleteUser(id: string) {
  const actor = await requireWrite("admin");
  if (actor.id === id) throw forbidden("Нельзя удалить собственную учётную запись");
  const [before] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!before) throw notFound("Пользователь не найден");
  if (before.role === "admin") {
    const [admins] = await db
      .select({ value: count() })
      .from(users)
      .where(and(eq(users.role, "admin"), eq(users.isActive, true)));
    if (admins.value <= 1) throw conflict("Нельзя удалить последнего администратора");
  }
  await db.delete(users).where(eq(users.id, id));
  await writeAudit({
    user: actor,
    action: "delete",
    entityType: "users",
    entityId: id,
    diff: pickDiff({ email: before.email }, null),
  });
  return { id };
}

async function listTable<TTable extends AnyPgTable>(options: {
  table: TTable;
  searchable?: string[];
  orderBy: ReturnType<typeof asc> | ReturnType<typeof desc>;
  input: unknown;
  minRole?: UserRole;
}) {
  await requireRole(options.minRole ?? "viewer");
  const { page, perPage, q } = parse(paginationSchema, options.input ?? {});
  const table = options.table as unknown as Record<string, unknown>;
  let where;
  if (q && options.searchable?.length) {
    const parts = options.searchable
      .map((key) => table[key])
      .filter(Boolean)
      .map((col) => ilike(col as Parameters<typeof ilike>[0], `%${q}%`));
    where = or(...parts);
  }
  const [items, [total]] = await Promise.all([
    db
      .select()
      .from(options.table as never)
      .where(where)
      .orderBy(options.orderBy)
      .limit(perPage)
      .offset((page - 1) * perPage),
    db.select({ value: count() }).from(options.table as never).where(where),
  ]);
  return { items, page, perPage, total: (total as { value: number }).value };
}

export async function listCategories(input: unknown) {
  return listTable({
    table: categories,
    searchable: ["name", "slug"],
    orderBy: asc(categories.sortOrder),
    input,
  });
}

export async function getCategory(id: string) {
  await requireRole("viewer");
  const [row] = await db.select().from(categories).where(eq(categories.id, id));
  if (!row) throw notFound("Категория не найдена");
  return row;
}

export async function createCategory(input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(categoryCreateSchema, input);
  const [row] = await wrapDb(() => db.insert(categories).values(data).returning());
  await writeAudit({
    user: actor,
    action: "create",
    entityType: "categories",
    entityId: row.id,
  });
  return row;
}

export async function updateCategory(id: string, input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(categoryUpdateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .update(categories)
      .set({ ...data, updatedAt: now() })
      .where(eq(categories.id, id))
      .returning(),
  );
  if (!row) throw notFound("Категория не найдена");
  await writeAudit({
    user: actor,
    action: "update",
    entityType: "categories",
    entityId: id,
  });
  return row;
}

export async function deleteCategory(id: string) {
  const actor = await requireWrite("editor");
  const [row] = await db.delete(categories).where(eq(categories.id, id)).returning();
  if (!row) throw notFound("Категория не найдена");
  await writeAudit({
    user: actor,
    action: "delete",
    entityType: "categories",
    entityId: id,
  });
  return { id };
}

export async function listMedia(input: unknown) {
  return listTable({
    table: media,
    searchable: ["filename", "originalName", "alt"],
    orderBy: desc(media.createdAt),
    input,
  });
}

export async function getMedia(id: string) {
  await requireRole("viewer");
  const [row] = await db.select().from(media).where(eq(media.id, id));
  if (!row) throw notFound("Файл не найден");
  return row;
}

export async function createMedia(input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(mediaCreateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .insert(media)
      .values({ ...data, uploadedById: actor.id })
      .returning(),
  );
  await writeAudit({
    user: actor,
    action: "create",
    entityType: "media",
    entityId: row.id,
  });
  return row;
}

export async function updateMedia(id: string, input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(mediaUpdateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .update(media)
      .set({ ...data, updatedAt: now() })
      .where(eq(media.id, id))
      .returning(),
  );
  if (!row) throw notFound("Файл не найден");
  await writeAudit({
    user: actor,
    action: "update",
    entityType: "media",
    entityId: id,
  });
  return row;
}

export async function deleteMedia(id: string) {
  const actor = await requireWrite("editor");
  const [row] = await db.delete(media).where(eq(media.id, id)).returning();
  if (!row) throw notFound("Файл не найден");
  await writeAudit({
    user: actor,
    action: "delete",
    entityType: "media",
    entityId: id,
  });
  return { id };
}

export async function listPages(input: unknown) {
  return listTable({
    table: pages,
    searchable: ["title", "path", "slug"],
    orderBy: asc(pages.path),
    input,
  });
}

export async function getPage(id: string) {
  await requireRole("viewer");
  const [row] = await db.select().from(pages).where(eq(pages.id, id));
  if (!row) throw notFound("Страница не найдена");
  const blocks = await db
    .select()
    .from(pageBlocks)
    .where(eq(pageBlocks.pageId, id))
    .orderBy(asc(pageBlocks.sortOrder));
  return { ...row, blocks };
}

export async function createPage(input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(pageCreateSchema, input);
  const { blocks, ...pageData } = data;
  const publishedAt =
    pageData.status === "published" ? (pageData.publishedAt ?? now()) : pageData.publishedAt;
  const row = await wrapDb(() =>
    db.transaction(async (tx) => {
      const [page] = await tx
        .insert(pages)
        .values({
          ...pageData,
          publishedAt,
          createdById: actor.id,
          updatedById: actor.id,
        })
        .returning();
      if (blocks?.length) {
        await tx.insert(pageBlocks).values(
          blocks.map((block, index) => ({
            pageId: page.id,
            type: block.type,
            data: block.data,
            sortOrder: block.sortOrder ?? index,
            isVisible: block.isVisible ?? true,
          })),
        );
      }
      return page;
    }),
  );
  await writeAudit({
    user: actor,
    action: pageData.status === "published" ? "publish" : "create",
    entityType: "pages",
    entityId: row.id,
  });
  return getPage(row.id);
}

export async function updatePage(id: string, input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(pageUpdateSchema, input);
  const { blocks, ...pageData } = data;
  const [before] = await db.select().from(pages).where(eq(pages.id, id));
  if (!before) throw notFound("Страница не найдена");
  const publishedAt =
    pageData.status === "published" && !pageData.publishedAt && !before.publishedAt
      ? now()
      : pageData.publishedAt;
  await wrapDb(() =>
    db.transaction(async (tx) => {
      await tx
        .update(pages)
        .set({ ...pageData, publishedAt, updatedById: actor.id, updatedAt: now() })
        .where(eq(pages.id, id));
      if (blocks) {
        await tx.delete(pageBlocks).where(eq(pageBlocks.pageId, id));
        if (blocks.length) {
          await tx.insert(pageBlocks).values(
            blocks.map((block, index) => ({
              pageId: id,
              type: block.type,
              data: block.data,
              sortOrder: block.sortOrder ?? index,
              isVisible: block.isVisible ?? true,
            })),
          );
        }
      }
    }),
  );
  await writeAudit({
    user: actor,
    action: pageData.status === "published" ? "publish" : "update",
    entityType: "pages",
    entityId: id,
  });
  return getPage(id);
}

export async function deletePage(id: string) {
  const actor = await requireWrite("editor");
  const [row] = await db.delete(pages).where(eq(pages.id, id)).returning();
  if (!row) throw notFound("Страница не найдена");
  await writeAudit({
    user: actor,
    action: "delete",
    entityType: "pages",
    entityId: id,
  });
  return { id };
}

const pageBlockListSchema = paginationSchema.extend({
  pageId: z.string().uuid().optional(),
});

export async function listPageBlocks(input: unknown) {
  await requireRole("viewer");
  const parsed = parse(pageBlockListSchema, input ?? {});
  const where = parsed.pageId ? eq(pageBlocks.pageId, parsed.pageId) : undefined;
  const [items, [total]] = await Promise.all([
    db
      .select()
      .from(pageBlocks)
      .where(where)
      .orderBy(asc(pageBlocks.sortOrder))
      .limit(parsed.perPage)
      .offset((parsed.page - 1) * parsed.perPage),
    db.select({ value: count() }).from(pageBlocks).where(where),
  ]);
  return { items, page: parsed.page, perPage: parsed.perPage, total: total.value };
}

export async function getPageBlock(id: string) {
  await requireRole("viewer");
  const [row] = await db.select().from(pageBlocks).where(eq(pageBlocks.id, id));
  if (!row) throw notFound("Блок не найден");
  return row;
}

export async function createPageBlock(input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(pageBlockCreateSchema, input);
  const [max] = await db
    .select({ value: pageBlocks.sortOrder })
    .from(pageBlocks)
    .where(eq(pageBlocks.pageId, data.pageId))
    .orderBy(desc(pageBlocks.sortOrder))
    .limit(1);
  const sortOrder =
    typeof data.sortOrder === "number" ? data.sortOrder : (max?.value ?? -1) + 1;
  const [row] = await wrapDb(() =>
    db
      .insert(pageBlocks)
      .values({ ...data, sortOrder })
      .returning(),
  );
  await writeAudit({
    user: actor,
    action: "create",
    entityType: "page_blocks",
    entityId: row.id,
  });
  return row;
}

export async function updatePageBlock(id: string, input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(pageBlockUpdateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .update(pageBlocks)
      .set({ ...data, updatedAt: now() })
      .where(eq(pageBlocks.id, id))
      .returning(),
  );
  if (!row) throw notFound("Блок не найден");
  await writeAudit({
    user: actor,
    action: "update",
    entityType: "page_blocks",
    entityId: id,
  });
  return row;
}

export async function deletePageBlock(id: string) {
  const actor = await requireWrite("editor");
  const [row] = await db.delete(pageBlocks).where(eq(pageBlocks.id, id)).returning();
  if (!row) throw notFound("Блок не найден");
  await writeAudit({
    user: actor,
    action: "delete",
    entityType: "page_blocks",
    entityId: id,
  });
  return { id };
}

export async function reorderPageBlocks(input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(pageBlocksReorderSchema, input);
  const existing = await db
    .select({ id: pageBlocks.id })
    .from(pageBlocks)
    .where(eq(pageBlocks.pageId, data.pageId));
  const existingIds = new Set(existing.map((row) => row.id));
  if (
    data.orderedIds.length !== existingIds.size ||
    data.orderedIds.some((id) => !existingIds.has(id))
  ) {
    throw badRequest("Список блоков не совпадает со страницей");
  }
  await wrapDb(() =>
    db.transaction(async (tx) => {
      for (let index = 0; index < data.orderedIds.length; index += 1) {
        await tx
          .update(pageBlocks)
          .set({ sortOrder: index, updatedAt: now() })
          .where(eq(pageBlocks.id, data.orderedIds[index]!));
      }
    }),
  );
  await writeAudit({
    user: actor,
    action: "update",
    entityType: "pages",
    entityId: data.pageId,
    diff: { reordered: true },
  });
  return getPage(data.pageId);
}

export async function listNewsAdmin(input: unknown) {
  return listTable({
    table: news,
    searchable: ["title", "slug", "excerpt"],
    orderBy: desc(news.publishedAt),
    input,
  });
}

export async function getNewsAdmin(id: string) {
  await requireRole("viewer");
  const [row] = await db.select().from(news).where(eq(news.id, id));
  if (!row) throw notFound("Новость не найдена");
  return row;
}

export async function createNews(input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(newsCreateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .insert(news)
      .values({
        ...data,
        publishedAt:
          data.status === "published" ? (data.publishedAt ?? now()) : data.publishedAt,
        createdById: actor.id,
        updatedById: actor.id,
      })
      .returning(),
  );
  await writeAudit({
    user: actor,
    action: data.status === "published" ? "publish" : "create",
    entityType: "news",
    entityId: row.id,
  });
  return row;
}

export async function updateNews(id: string, input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(newsUpdateSchema, input);
  const [before] = await db.select().from(news).where(eq(news.id, id));
  if (!before) throw notFound("Новость не найдена");
  const [row] = await wrapDb(() =>
    db
      .update(news)
      .set({
        ...data,
        publishedAt:
          data.status === "published" && !before.publishedAt
            ? (data.publishedAt ?? now())
            : data.publishedAt,
        updatedById: actor.id,
        updatedAt: now(),
      })
      .where(eq(news.id, id))
      .returning(),
  );
  await writeAudit({
    user: actor,
    action: data.status === "published" ? "publish" : "update",
    entityType: "news",
    entityId: id,
  });
  return row;
}

export async function deleteNews(id: string) {
  const actor = await requireWrite("editor");
  const [row] = await db.delete(news).where(eq(news.id, id)).returning();
  if (!row) throw notFound("Новость не найдена");
  await writeAudit({
    user: actor,
    action: "delete",
    entityType: "news",
    entityId: id,
  });
  return { id };
}

export async function listDocumentsAdmin(input: unknown) {
  return listTable({
    table: documents,
    searchable: ["title", "slug"],
    orderBy: desc(documents.updatedAt),
    input,
  });
}

export async function getDocumentAdmin(id: string) {
  await requireRole("viewer");
  const [row] = await db.select().from(documents).where(eq(documents.id, id));
  if (!row) throw notFound("Документ не найден");
  return row;
}

export async function createDocument(input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(documentCreateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .insert(documents)
      .values({
        ...data,
        publishedAt:
          data.status === "published" ? (data.publishedAt ?? now()) : data.publishedAt,
        createdById: actor.id,
        updatedById: actor.id,
      })
      .returning(),
  );
  await writeAudit({
    user: actor,
    action: "create",
    entityType: "documents",
    entityId: row.id,
  });
  return row;
}

export async function updateDocument(id: string, input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(documentUpdateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .update(documents)
      .set({ ...data, updatedById: actor.id, updatedAt: now() })
      .where(eq(documents.id, id))
      .returning(),
  );
  if (!row) throw notFound("Документ не найден");
  await writeAudit({
    user: actor,
    action: "update",
    entityType: "documents",
    entityId: id,
  });
  return row;
}

export async function deleteDocument(id: string) {
  const actor = await requireWrite("editor");
  const [row] = await db.delete(documents).where(eq(documents.id, id)).returning();
  if (!row) throw notFound("Документ не найден");
  await writeAudit({
    user: actor,
    action: "delete",
    entityType: "documents",
    entityId: id,
  });
  return { id };
}

export async function listEmployeesAdmin(input: unknown) {
  return listTable({
    table: employees,
    searchable: ["name", "role", "slug"],
    orderBy: asc(employees.sortOrder),
    input,
  });
}

export async function getEmployeeAdmin(id: string) {
  await requireRole("viewer");
  const [row] = await db.select().from(employees).where(eq(employees.id, id));
  if (!row) throw notFound("Сотрудник не найден");
  return row;
}

export async function createEmployee(input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(employeeCreateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .insert(employees)
      .values({
        ...data,
        email: data.email || null,
        createdById: actor.id,
        updatedById: actor.id,
      })
      .returning(),
  );
  await writeAudit({
    user: actor,
    action: "create",
    entityType: "employees",
    entityId: row.id,
  });
  return row;
}

export async function updateEmployee(id: string, input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(employeeUpdateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .update(employees)
      .set({
        ...data,
        email: data.email === "" ? null : data.email,
        updatedById: actor.id,
        updatedAt: now(),
      })
      .where(eq(employees.id, id))
      .returning(),
  );
  if (!row) throw notFound("Сотрудник не найден");
  await writeAudit({
    user: actor,
    action: "update",
    entityType: "employees",
    entityId: id,
  });
  return row;
}

export async function deleteEmployee(id: string) {
  const actor = await requireWrite("editor");
  const [row] = await db.delete(employees).where(eq(employees.id, id)).returning();
  if (!row) throw notFound("Сотрудник не найден");
  await writeAudit({
    user: actor,
    action: "delete",
    entityType: "employees",
    entityId: id,
  });
  return { id };
}

export async function listMenuItemsAdmin(input: unknown) {
  await requireRole("viewer");
  const parsed = parse(
    paginationSchema.extend({
      location: z
        .enum([
          "header",
          "footer_official",
          "footer_more",
          "svedeniya",
          "roditelyam",
          "pedagogam",
          "quick",
        ])
        .optional(),
    }),
    input ?? {},
  );
  const where = parsed.location
    ? eq(menuItems.location, parsed.location)
    : undefined;
  const [items, [total]] = await Promise.all([
    db
      .select()
      .from(menuItems)
      .where(where)
      .orderBy(asc(menuItems.location), asc(menuItems.sortOrder))
      .limit(parsed.perPage)
      .offset((parsed.page - 1) * parsed.perPage),
    db.select({ value: count() }).from(menuItems).where(where),
  ]);
  return { items, page: parsed.page, perPage: parsed.perPage, total: total.value };
}

export async function getMenuItem(id: string) {
  await requireRole("viewer");
  const [row] = await db.select().from(menuItems).where(eq(menuItems.id, id));
  if (!row) throw notFound("Пункт меню не найден");
  return row;
}

export async function createMenuItem(input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(menuItemCreateSchema, input);
  const [row] = await wrapDb(() => db.insert(menuItems).values(data).returning());
  await writeAudit({
    user: actor,
    action: "create",
    entityType: "menu_items",
    entityId: row.id,
  });
  return row;
}

export async function updateMenuItem(id: string, input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(menuItemUpdateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .update(menuItems)
      .set({ ...data, updatedAt: now() })
      .where(eq(menuItems.id, id))
      .returning(),
  );
  if (!row) throw notFound("Пункт меню не найден");
  await writeAudit({
    user: actor,
    action: "update",
    entityType: "menu_items",
    entityId: id,
  });
  return row;
}

export async function deleteMenuItem(id: string) {
  const actor = await requireWrite("editor");
  const [row] = await db.delete(menuItems).where(eq(menuItems.id, id)).returning();
  if (!row) throw notFound("Пункт меню не найден");
  await writeAudit({
    user: actor,
    action: "delete",
    entityType: "menu_items",
    entityId: id,
  });
  return { id };
}

export async function listSettingsAdmin(input: unknown) {
  return listTable({
    table: settings,
    searchable: ["key", "group", "description"],
    orderBy: asc(settings.key),
    input,
  });
}

export async function getSetting(id: string) {
  await requireRole("viewer");
  const [row] = await db.select().from(settings).where(eq(settings.id, id));
  if (!row) throw notFound("Настройка не найдена");
  return row;
}

export async function createSetting(input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(settingCreateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .insert(settings)
      .values({ ...data, updatedById: actor.id })
      .returning(),
  );
  await writeAudit({
    user: actor,
    action: "create",
    entityType: "settings",
    entityId: row.id,
  });
  return row;
}

export async function updateSetting(id: string, input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(settingUpdateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .update(settings)
      .set({ ...data, updatedById: actor.id, updatedAt: now() })
      .where(eq(settings.id, id))
      .returning(),
  );
  if (!row) throw notFound("Настройка не найдена");
  await writeAudit({
    user: actor,
    action: "update",
    entityType: "settings",
    entityId: id,
  });
  return row;
}

export async function deleteSetting(id: string) {
  const actor = await requireWrite("admin");
  const [row] = await db.delete(settings).where(eq(settings.id, id)).returning();
  if (!row) throw notFound("Настройка не найдена");
  await writeAudit({
    user: actor,
    action: "delete",
    entityType: "settings",
    entityId: id,
  });
  return { id };
}

export async function listRedirectsAdmin(input: unknown) {
  return listTable({
    table: redirects,
    searchable: ["fromPath", "toPath"],
    orderBy: asc(redirects.fromPath),
    input,
  });
}

export async function getRedirect(id: string) {
  await requireRole("viewer");
  const [row] = await db.select().from(redirects).where(eq(redirects.id, id));
  if (!row) throw notFound("Редирект не найден");
  return row;
}

export async function createRedirect(input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(redirectCreateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .insert(redirects)
      .values({ ...data, createdById: actor.id })
      .returning(),
  );
  await writeAudit({
    user: actor,
    action: "create",
    entityType: "redirects",
    entityId: row.id,
  });
  return row;
}

export async function updateRedirect(id: string, input: unknown) {
  const actor = await requireWrite("editor");
  const data = parse(redirectUpdateSchema, input);
  const [row] = await wrapDb(() =>
    db
      .update(redirects)
      .set({ ...data, updatedAt: now() })
      .where(eq(redirects.id, id))
      .returning(),
  );
  if (!row) throw notFound("Редирект не найден");
  await writeAudit({
    user: actor,
    action: "update",
    entityType: "redirects",
    entityId: id,
  });
  return row;
}

export async function deleteRedirect(id: string) {
  const actor = await requireWrite("editor");
  const [row] = await db.delete(redirects).where(eq(redirects.id, id)).returning();
  if (!row) throw notFound("Редирект не найден");
  await writeAudit({
    user: actor,
    action: "delete",
    entityType: "redirects",
    entityId: id,
  });
  return { id };
}

export async function listAuditLogs(input: unknown) {
  await requireRole("admin");
  const parsed = parse(
    paginationSchema.extend({
      entityType: z.string().max(64).optional(),
      action: z
        .enum(["create", "update", "delete", "publish", "login", "logout"])
        .optional(),
    }),
    input ?? {},
  );
  const filters = [];
  if (parsed.entityType) filters.push(eq(auditLogs.entityType, parsed.entityType));
  if (parsed.action) filters.push(eq(auditLogs.action, parsed.action));
  const where = filters.length ? and(...filters) : undefined;
  const [items, [total]] = await Promise.all([
    db
      .select()
      .from(auditLogs)
      .where(where)
      .orderBy(desc(auditLogs.createdAt))
      .limit(parsed.perPage)
      .offset((parsed.page - 1) * parsed.perPage),
    db.select({ value: count() }).from(auditLogs).where(where),
  ]);
  return { items, page: parsed.page, perPage: parsed.perPage, total: total.value };
}

export async function getAuditLog(id: string) {
  await requireRole("admin");
  const [row] = await db.select().from(auditLogs).where(eq(auditLogs.id, id));
  if (!row) throw notFound("Запись журнала не найдена");
  return row;
}
