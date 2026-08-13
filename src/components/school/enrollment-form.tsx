"use client";

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
import { submitApplicationAction } from "@/server/actions";

const classLetters = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З"];

export function EnrollmentForm() {
  const [pending, startTransition] = useTransition();
  const [applicantName, setApplicantName] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [classLetter, setClassLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [childName, setChildName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const form = event.currentTarget;
    const website = (form.elements.namedItem("website") as HTMLInputElement)?.value;

    startTransition(async () => {
      const result = await submitApplicationAction({
        applicantName,
        classGrade,
        classLetter,
        phone,
        childName,
        website,
      });

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      setApplicantName("");
      setClassGrade("");
      setClassLetter("");
      setPhone("");
      setChildName("");
      setMessage("Заявка отправлена. Мы свяжемся с вами по указанному телефону.");
      form.reset();
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5">
      {message ? (
        <p className="rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3 text-[15px] text-graphite" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-[var(--radius-md)] border border-brick bg-brick-tint px-4 py-3 text-sm text-brick" role="alert">
          {error}
        </p>
      ) : null}

      <Input
        label="ФИО"
        value={applicantName}
        onChange={(e) => setApplicantName(e.target.value)}
        autoComplete="name"
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select value={classGrade} onValueChange={setClassGrade} required>
          <SelectTrigger label="Класс">
            <SelectValue placeholder="Выберите класс" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 11 }, (_, i) => i + 1).map((grade) => (
              <SelectItem key={grade} value={String(grade)}>
                {grade} класс
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={classLetter} onValueChange={setClassLetter} required>
          <SelectTrigger label="Буква">
            <SelectValue placeholder="Буква" />
          </SelectTrigger>
          <SelectContent>
            {classLetters.map((letter) => (
              <SelectItem key={letter} value={letter}>
                {letter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Input
        label="Номер телефона"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        autoComplete="tel"
        placeholder="+7 (3537) 000-000"
        required
      />

      <Input
        label="ФИО ребёнка"
        value={childName}
        onChange={(e) => setChildName(e.target.value)}
        required
      />

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <Button type="submit" disabled={pending || !classGrade || !classLetter}>
        {pending ? "Отправляем…" : "Отправить заявку"}
      </Button>
    </form>
  );
}
