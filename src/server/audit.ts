import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs, users, type auditActionEnum } from "@/db/schema";
import type { SessionUser } from "@/server/auth";

type AuditAction = (typeof auditActionEnum.enumValues)[number];

async function resolveAuditUserId(user?: SessionUser | null) {
  if (!user?.id) return null;
  const [row] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);
  return row?.id ?? null;
}

export async function writeAudit(input: {
  user?: SessionUser | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  diff?: Record<string, unknown> | null;
}) {
  try {
    const h = await headers();
    const userId = await resolveAuditUserId(input.user);
    await db.insert(auditLogs).values({
      userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      diff: input.diff ?? null,
      ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip"),
      userAgent: h.get("user-agent"),
    });
  } catch (error) {
    console.error("Не удалось записать audit log", error);
  }
}

export function pickDiff(
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null,
) {
  return { before, after };
}
