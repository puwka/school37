import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { CmsError, toErrorResponse } from "@/server/errors";
import { loginSchema } from "@/server/validation";
import {
  clearSessionCookie,
  findActiveUserByEmail,
  getSession,
  requireSession,
  setSessionCookie,
  touchLastLogin,
  verifyPassword,
} from "@/server/auth";
import { writeAudit } from "@/server/audit";
import { unauthorized } from "@/server/errors";
import * as crud from "@/server/crud";

export async function jsonOk(data: unknown, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export async function jsonError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "BAD_REQUEST",
          message: "Ошибка валидации",
          details: error.flatten(),
        },
      },
      { status: 400 },
    );
  }
  const mapped = toErrorResponse(error);
  return NextResponse.json(
    { ok: false, error: mapped.error },
    { status: mapped.status },
  );
}

export async function handleLogin(body: unknown) {
  const parsed = loginSchema.parse(body);
  const user = await findActiveUserByEmail(parsed.email);
  if (!user || !(await verifyPassword(parsed.password, user.passwordHash))) {
    throw unauthorized("Неверный email или пароль");
  }
  await setSessionCookie({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  await touchLastLogin(user.id);
  await writeAudit({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    action: "login",
    entityType: "users",
    entityId: user.id,
  });
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function handleLogout() {
  const session = await getSession();
  await clearSessionCookie();
  if (session) {
    await writeAudit({
      user: session,
      action: "logout",
      entityType: "users",
      entityId: session.id,
    });
  }
  return { success: true };
}

export async function handleMe() {
  return requireSession();
}

type Resource = {
  list: (input: unknown) => Promise<unknown>;
  get: (id: string) => Promise<unknown>;
  create?: (input: unknown) => Promise<unknown>;
  update?: (id: string, input: unknown) => Promise<unknown>;
  remove?: (id: string) => Promise<unknown>;
};

export const resources: Record<string, Resource> = {
  users: {
    list: crud.listUsers,
    get: crud.getUser,
    create: crud.createUser,
    update: crud.updateUser,
    remove: crud.deleteUser,
  },
  pages: {
    list: crud.listPages,
    get: crud.getPage,
    create: crud.createPage,
    update: crud.updatePage,
    remove: crud.deletePage,
  },
  page_blocks: {
    list: crud.listPageBlocks,
    get: crud.getPageBlock,
    create: crud.createPageBlock,
    update: crud.updatePageBlock,
    remove: crud.deletePageBlock,
  },
  news: {
    list: crud.listNewsAdmin,
    get: crud.getNewsAdmin,
    create: crud.createNews,
    update: crud.updateNews,
    remove: crud.deleteNews,
  },
  documents: {
    list: crud.listDocumentsAdmin,
    get: crud.getDocumentAdmin,
    create: crud.createDocument,
    update: crud.updateDocument,
    remove: crud.deleteDocument,
  },
  employees: {
    list: crud.listEmployeesAdmin,
    get: crud.getEmployeeAdmin,
    create: crud.createEmployee,
    update: crud.updateEmployee,
    remove: crud.deleteEmployee,
  },
  menu_items: {
    list: crud.listMenuItemsAdmin,
    get: crud.getMenuItem,
    create: crud.createMenuItem,
    update: crud.updateMenuItem,
    remove: crud.deleteMenuItem,
  },
  categories: {
    list: crud.listCategories,
    get: crud.getCategory,
    create: crud.createCategory,
    update: crud.updateCategory,
    remove: crud.deleteCategory,
  },
  media: {
    list: crud.listMedia,
    get: crud.getMedia,
    create: crud.createMedia,
    update: crud.updateMedia,
    remove: crud.deleteMedia,
  },
  settings: {
    list: crud.listSettingsAdmin,
    get: crud.getSetting,
    create: crud.createSetting,
    update: crud.updateSetting,
    remove: crud.deleteSetting,
  },
  redirects: {
    list: crud.listRedirectsAdmin,
    get: crud.getRedirect,
    create: crud.createRedirect,
    update: crud.updateRedirect,
    remove: crud.deleteRedirect,
  },
  audit_logs: {
    list: crud.listAuditLogs,
    get: crud.getAuditLog,
  },
};

export function getResource(entity: string) {
  const resource = resources[entity];
  if (!resource) {
    throw new CmsError("Неизвестный ресурс", 404, "NOT_FOUND");
  }
  return resource;
}
