"use server";

import { revalidatePath, revalidateTag } from "next/cache";
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
import * as crud from "@/server/crud";
import { toErrorResponse, unauthorized, badRequest } from "@/server/errors";
import { loginSchema } from "@/server/validation";
import { uploadDocumentFile, uploadStaffPhoto } from "@/server/upload";

function ok<T>(data: T) {
  return { ok: true as const, data };
}

function fail(error: unknown) {
  const { error: payload, status } = toErrorResponse(error);
  return { ok: false as const, error: payload, status };
}

function revalidatePublic() {
  revalidateTag("cms", "max");
  revalidatePath("/", "layout");
}

export async function loginAction(input: unknown) {
  try {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      return fail(badRequest("Ошибка валидации", parsed.error.flatten()));
    }
    const user = await findActiveUserByEmail(parsed.data.email);
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
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
    return ok({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (error) {
    return fail(error);
  }
}

export async function logoutAction() {
  try {
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
    return ok({ success: true });
  } catch (error) {
    return fail(error);
  }
}

export async function meAction() {
  try {
    const session = await requireSession();
    return ok(session);
  } catch (error) {
    return fail(error);
  }
}

async function wrap<T>(fn: () => Promise<T>) {
  try {
    const data = await fn();
    revalidatePublic();
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}

export async function listUsersAction(input?: unknown) {
  return wrap(() => crud.listUsers(input));
}
export async function getUserAction(id: string) {
  return wrap(() => crud.getUser(id));
}
export async function createUserAction(input: unknown) {
  return wrap(() => crud.createUser(input));
}
export async function updateUserAction(id: string, input: unknown) {
  return wrap(() => crud.updateUser(id, input));
}
export async function deleteUserAction(id: string) {
  return wrap(() => crud.deleteUser(id));
}

export async function listCategoriesAction(input?: unknown) {
  return wrap(() => crud.listCategories(input));
}
export async function getCategoryAction(id: string) {
  return wrap(() => crud.getCategory(id));
}
export async function createCategoryAction(input: unknown) {
  return wrap(() => crud.createCategory(input));
}
export async function updateCategoryAction(id: string, input: unknown) {
  return wrap(() => crud.updateCategory(id, input));
}
export async function deleteCategoryAction(id: string) {
  return wrap(() => crud.deleteCategory(id));
}

export async function listMediaAction(input?: unknown) {
  return wrap(() => crud.listMedia(input));
}
export async function getMediaAction(id: string) {
  return wrap(() => crud.getMedia(id));
}
export async function createMediaAction(input: unknown) {
  return wrap(() => crud.createMedia(input));
}
export async function updateMediaAction(id: string, input: unknown) {
  return wrap(() => crud.updateMedia(id, input));
}
export async function deleteMediaAction(id: string) {
  return wrap(() => crud.deleteMedia(id));
}

export async function listPagesAction(input?: unknown) {
  return wrap(() => crud.listPages(input));
}
export async function getPageAction(id: string) {
  return wrap(() => crud.getPage(id));
}
export async function createPageAction(input: unknown) {
  return wrap(() => crud.createPage(input));
}
export async function updatePageAction(id: string, input: unknown) {
  return wrap(() => crud.updatePage(id, input));
}
export async function deletePageAction(id: string) {
  return wrap(() => crud.deletePage(id));
}

export async function listPageBlocksAction(input?: unknown) {
  return wrap(() => crud.listPageBlocks(input));
}
export async function getPageBlockAction(id: string) {
  return wrap(() => crud.getPageBlock(id));
}
export async function createPageBlockAction(input: unknown) {
  return wrap(() => crud.createPageBlock(input));
}
export async function updatePageBlockAction(id: string, input: unknown) {
  return wrap(() => crud.updatePageBlock(id, input));
}
export async function deletePageBlockAction(id: string) {
  return wrap(() => crud.deletePageBlock(id));
}
export async function reorderPageBlocksAction(input: unknown) {
  return wrap(() => crud.reorderPageBlocks(input));
}

export async function listNewsAction(input?: unknown) {
  return wrap(() => crud.listNewsAdmin(input));
}
export async function getNewsAction(id: string) {
  return wrap(() => crud.getNewsAdmin(id));
}
export async function createNewsAction(input: unknown) {
  return wrap(() => crud.createNews(input));
}
export async function updateNewsAction(id: string, input: unknown) {
  return wrap(() => crud.updateNews(id, input));
}
export async function deleteNewsAction(id: string) {
  return wrap(() => crud.deleteNews(id));
}

export async function listDocumentsAction(input?: unknown) {
  return wrap(() => crud.listDocumentsAdmin(input));
}
export async function getDocumentAction(id: string) {
  return wrap(() => crud.getDocumentAdmin(id));
}
export async function createDocumentAction(input: unknown) {
  return wrap(() => crud.createDocument(input));
}
export async function updateDocumentAction(id: string, input: unknown) {
  return wrap(() => crud.updateDocument(id, input));
}
export async function deleteDocumentAction(id: string) {
  return wrap(() => crud.deleteDocument(id));
}

export async function listEmployeesAction(input?: unknown) {
  return wrap(() => crud.listEmployeesAdmin(input));
}
export async function getEmployeeAction(id: string) {
  return wrap(() => crud.getEmployeeAdmin(id));
}
export async function createEmployeeAction(input: unknown) {
  return wrap(() => crud.createEmployee(input));
}
export async function updateEmployeeAction(id: string, input: unknown) {
  return wrap(() => crud.updateEmployee(id, input));
}
export async function deleteEmployeeAction(id: string) {
  return wrap(() => crud.deleteEmployee(id));
}

export async function listMenuItemsAction(input?: unknown) {
  return wrap(() => crud.listMenuItemsAdmin(input));
}
export async function getMenuItemAction(id: string) {
  return wrap(() => crud.getMenuItem(id));
}
export async function createMenuItemAction(input: unknown) {
  return wrap(() => crud.createMenuItem(input));
}
export async function updateMenuItemAction(id: string, input: unknown) {
  return wrap(() => crud.updateMenuItem(id, input));
}
export async function deleteMenuItemAction(id: string) {
  return wrap(() => crud.deleteMenuItem(id));
}

export async function listSettingsAction(input?: unknown) {
  return wrap(() => crud.listSettingsAdmin(input));
}
export async function getSettingAction(id: string) {
  return wrap(() => crud.getSetting(id));
}
export async function createSettingAction(input: unknown) {
  return wrap(() => crud.createSetting(input));
}
export async function updateSettingAction(id: string, input: unknown) {
  return wrap(() => crud.updateSetting(id, input));
}
export async function deleteSettingAction(id: string) {
  return wrap(() => crud.deleteSetting(id));
}

export async function listRedirectsAction(input?: unknown) {
  return wrap(() => crud.listRedirectsAdmin(input));
}
export async function getRedirectAction(id: string) {
  return wrap(() => crud.getRedirect(id));
}
export async function createRedirectAction(input: unknown) {
  return wrap(() => crud.createRedirect(input));
}
export async function updateRedirectAction(id: string, input: unknown) {
  return wrap(() => crud.updateRedirect(id, input));
}
export async function deleteRedirectAction(id: string) {
  return wrap(() => crud.deleteRedirect(id));
}

export async function listAuditLogsAction(input?: unknown) {
  return wrap(() => crud.listAuditLogs(input));
}
export async function getAuditLogAction(id: string) {
  return wrap(() => crud.getAuditLog(id));
}

export async function uploadDocumentAction(formData: FormData) {
  try {
    const data = await uploadDocumentFile(formData);
    revalidatePublic();
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}

export async function uploadStaffPhotoAction(formData: FormData) {
  try {
    const data = await uploadStaffPhoto(formData);
    revalidatePublic();
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}
