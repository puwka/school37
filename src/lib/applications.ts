export function applicationStatusLabel(status: string) {
  if (status === "new") return "Новая";
  if (status === "in_review") return "В работе";
  if (status === "processed") return "Обработана";
  if (status === "rejected") return "Отклонена";
  return status;
}

export function formatApplicationClass(grade: number, letter: string) {
  return `${grade}${letter}`;
}

export function formatApplicationDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Samara",
  }).format(date);
}
