"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormStatus } from "@/components/admin/form-status";
import {
  deleteApplicationAction,
  updateApplicationAction,
} from "@/server/actions";

type ApplicationData = {
  id: string;
  applicantName: string;
  classGrade: number;
  classLetter: string;
  phone: string;
  childName: string;
  status: "new" | "in_review" | "processed" | "rejected";
  adminNotes: string | null;
  createdAt: string;
};

const statusOptions = [
  { value: "new", label: "Новая" },
  { value: "in_review", label: "В работе" },
  { value: "processed", label: "Обработана" },
  { value: "rejected", label: "Отклонена" },
] as const;

function formatPhone(phone: string) {
  if (phone.length === 11 && phone.startsWith("7")) {
    return `+7 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9)}`;
  }
  return phone;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ApplicationEditor({ initial }: { initial: ApplicationData }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(initial.status);
  const [adminNotes, setAdminNotes] = useState(initial.adminNotes ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function save() {
    startTransition(async () => {
      setMessage(null);
      setError(null);
      const result = await updateApplicationAction(initial.id, {
        status,
        adminNotes: adminNotes.trim() || null,
      });
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setMessage("Сохранено");
      router.refresh();
    });
  }

  function remove() {
    if (!confirm("Удалить заявку?")) return;
    startTransition(async () => {
      const result = await deleteApplicationAction(initial.id);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      router.replace("/admin/applications");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <FormStatus status={message} error={error} />

      <dl className="grid gap-4 border border-line bg-surface p-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted">ФИО заявителя</dt>
          <dd className="mt-1 font-medium">{initial.applicantName}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">ФИО ребёнка</dt>
          <dd className="mt-1 font-medium">{initial.childName}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Класс</dt>
          <dd className="mt-1 font-medium">
            {initial.classGrade}
            {initial.classLetter}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Телефон</dt>
          <dd className="mt-1 font-medium">
            <a href={`tel:${initial.phone}`} className="text-brick no-underline hover:underline">
              {formatPhone(initial.phone)}
            </a>
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm text-muted">Получена</dt>
          <dd className="mt-1 text-graphite">{formatDate(initial.createdAt)}</dd>
        </div>
      </dl>

      <Select
        value={status}
        onValueChange={(v) => setStatus(v as ApplicationData["status"])}
      >
        <SelectTrigger label="Статус">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="block space-y-1.5">
        <span className="font-sans text-sm font-medium text-ink">
          Заметки администратора
        </span>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={4}
          className="w-full rounded-[var(--radius-md)] border border-line bg-surface px-3 py-2 font-sans text-[15px] text-ink focus-visible:border-brick focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brick"
          placeholder="Комментарий для коллег…"
        />
      </label>

      <div className="flex flex-wrap gap-3 border-t border-line pt-6">
        <Button type="button" disabled={pending} onClick={save}>
          Сохранить
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="ml-auto text-brick"
          disabled={pending}
          onClick={remove}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
}

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
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
