export class CmsError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "CmsError";
  }
}

export function badRequest(message: string, details?: unknown) {
  return new CmsError(message, 400, "BAD_REQUEST", details);
}

export function unauthorized(message = "Нужна авторизация") {
  return new CmsError(message, 401, "UNAUTHORIZED");
}

export function forbidden(message = "Недостаточно прав") {
  return new CmsError(message, 403, "FORBIDDEN");
}

export function notFound(message = "Запись не найдена") {
  return new CmsError(message, 404, "NOT_FOUND");
}

export function conflict(message: string) {
  return new CmsError(message, 409, "CONFLICT");
}

export function tooMany(message = "Слишком много запросов") {
  return new CmsError(message, 429, "RATE_LIMITED");
}

export function toErrorResponse(error: unknown) {
  if (error instanceof CmsError) {
    return {
      ok: false as const,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      status: error.status,
    };
  }

  console.error(error);
  return {
    ok: false as const,
    error: {
      code: "INTERNAL",
      message: "Внутренняя ошибка сервера",
    },
    status: 500,
  };
}

export function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "23505"
  );
}

export function isForeignKeyViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "23503"
  );
}
