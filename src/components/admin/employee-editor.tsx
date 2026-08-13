"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormStatus } from "@/components/admin/form-status";
import { slugify } from "@/lib/slugify";
import {
  createEmployeeAction,
  deleteEmployeeAction,
  updateEmployeeAction,
  uploadStaffPhotoAction,
} from "@/server/actions";

type EmployeeFormData = {
  id?: string;
  slug: string;
  name: string;
  role: string;
  subjects: string[];
  phone: string | null;
  email: string | null;
  receptionHours: string | null;
  education: string | null;
  qualification: string | null;
  experienceYears: number | null;
  isLeadership: boolean;
  photoId: string | null;
  photoUrl?: string | null;
  sortOrder: number;
  status: "draft" | "published" | "archived";
};

export function EmployeeEditor({ initial }: { initial?: EmployeeFormData }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [role, setRole] = useState(initial?.role ?? "");
  const [subjectsText, setSubjectsText] = useState(
    (initial?.subjects ?? []).join(", "),
  );
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [receptionHours, setReceptionHours] = useState(
    initial?.receptionHours ?? "",
  );
  const [education, setEducation] = useState(initial?.education ?? "");
  const [qualification, setQualification] = useState(
    initial?.qualification ?? "",
  );
  const [experienceYears, setExperienceYears] = useState(
    initial?.experienceYears?.toString() ?? "",
  );
  const [isLeadership, setIsLeadership] = useState(
    initial?.isLeadership ?? false,
  );
  const [photoId, setPhotoId] = useState(initial?.photoId ?? "");
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder?.toString() ?? "0");
  const [status, setStatus] = useState<EmployeeFormData["status"]>(
    initial?.status ?? "published",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function uploadPhoto(file: File) {
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      setError(null);
      const result = await uploadStaffPhotoAction(formData);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setPhotoId(result.data.media.id);
      setPhotoUrl(result.data.media.url);
      setMessage("Фото загружено");
    });
  }

  function save(nextStatus?: EmployeeFormData["status"]) {
    const publishStatus = nextStatus ?? status;
    const payload = {
      slug: slug.trim(),
      name: name.trim(),
      role: role.trim(),
      subjects: subjectsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      phone: phone.trim() || null,
      email: email.trim() || null,
      receptionHours: receptionHours.trim() || null,
      education: education.trim() || null,
      qualification: qualification.trim() || null,
      experienceYears: experienceYears ? Number(experienceYears) : null,
      isLeadership,
      photoId: photoId || null,
      sortOrder: Number(sortOrder) || 0,
      status: publishStatus,
    };

    startTransition(async () => {
      setMessage(null);
      setError(null);
      const result = initial?.id
        ? await updateEmployeeAction(initial.id, payload)
        : await createEmployeeAction(payload);

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      setMessage(publishStatus === "published" ? "Опубликовано" : "Сохранено");
      if (!initial?.id) {
        router.replace(`/admin/employees/${result.data.id}`);
      } else {
        router.refresh();
      }
    });
  }

  function remove() {
    if (!initial?.id || !confirm("Удалить сотрудника?")) return;
    startTransition(async () => {
      const result = await deleteEmployeeAction(initial.id!);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      router.replace("/admin/employees");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <FormStatus status={message} error={error} />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="ФИО"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
        <Input
          label="URL (slug)"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          required
        />
      </div>

      <Input
        label="Должность"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />

      <Input
        label="Предметы"
        value={subjectsText}
        onChange={(e) => setSubjectsText(e.target.value)}
        hint="Через запятую"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Часы приёма"
          value={receptionHours}
          onChange={(e) => setReceptionHours(e.target.value)}
        />
        <Input
          label="Стаж (лет)"
          type="number"
          min={0}
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
        />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-sm font-medium text-ink">Образование</span>
        <textarea
          className="min-h-[72px] w-full rounded-[var(--radius-md)] border border-line bg-surface px-3 py-2 text-[15px]"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />
      </label>

      <Input
        label="Квалификация"
        value={qualification}
        onChange={(e) => setQualification(e.target.value)}
      />

      <div className="rounded-[var(--radius-md)] border border-line bg-paper-muted/40 p-4">
        <p className="font-sans text-sm font-medium text-ink">Фото</p>
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt=""
            className="mt-3 size-24 rounded-[var(--radius-sm)] object-cover"
          />
        ) : null}
        <Input
          type="file"
          className="mt-3"
          accept="image/jpeg,image/png,image/webp"
          disabled={pending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadPhoto(file);
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Порядок сортировки"
          type="number"
          min={0}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as EmployeeFormData["status"])}
        >
          <SelectTrigger label="Статус">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Черновик</SelectItem>
            <SelectItem value="published">Опубликовано</SelectItem>
            <SelectItem value="archived">В архиве</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <label className="flex items-center gap-2 text-[15px]">
        <input
          type="checkbox"
          checked={isLeadership}
          onChange={(e) => setIsLeadership(e.target.checked)}
          className="size-4 accent-brick"
        />
        Руководящий состав
      </label>

      <div className="flex flex-wrap gap-3 border-t border-line pt-6">
        <Button type="button" disabled={pending} onClick={() => save()}>
          Сохранить
        </Button>
        <Button
          type="button"
          variant="soft"
          disabled={pending}
          onClick={() => save("published")}
        >
          Опубликовать
        </Button>
        {initial?.id && slug ? (
          <Button type="button" variant="ghost" asChild>
            <a
              href={`/svedeniya/pedagogicheskiy-sostav/${slug}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Просмотр на сайте
            </a>
          </Button>
        ) : null}
        {initial?.id ? (
          <Button
            type="button"
            variant="ghost"
            className="ml-auto text-brick"
            disabled={pending}
            onClick={remove}
          >
            Удалить
          </Button>
        ) : null}
      </div>
    </div>
  );
}
