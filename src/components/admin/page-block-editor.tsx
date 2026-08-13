"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockFields } from "@/components/admin/block-fields";
import { BlockPreview } from "@/components/admin/block-preview";
import {
  BLOCK_CATALOG,
  blockLabel,
  defaultBlockData,
  type BlockType,
} from "@/lib/cms/block-catalog";
import {
  createPageBlockAction,
  deletePageBlockAction,
  reorderPageBlocksAction,
  updatePageBlockAction,
} from "@/server/actions";

export type EditorBlock = {
  id: string;
  type: string;
  data: Record<string, unknown>;
  sortOrder: number;
  isVisible: boolean;
};

export function PageBlockEditor({
  pageId,
  pageTitle,
  pagePath,
  initialBlocks,
}: {
  pageId: string;
  pageTitle: string;
  pagePath: string;
  initialBlocks: EditorBlock[];
}) {
  const [blocks, setBlocks] = useState(
    () => [...initialBlocks].sort((a, b) => a.sortOrder - b.sortOrder),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const editingBlock = useMemo(
    () => blocks.find((block) => block.id === editingId) ?? null,
    [blocks, editingId],
  );

  function flash(message: string) {
    setStatus(message);
    setError(null);
    window.setTimeout(() => setStatus(null), 2000);
  }

  function fail(message: string) {
    setError(message);
    setStatus(null);
  }

  function openEdit(block: EditorBlock) {
    setEditingId(block.id);
    setDraft({ ...block.data });
  }

  function closeEdit() {
    setEditingId(null);
    setDraft(null);
  }

  function move(blockId: string, direction: -1 | 1) {
    const index = blocks.findIndex((block) => block.id === blockId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item!);
    const ordered = next.map((block, sortOrder) => ({ ...block, sortOrder }));
    setBlocks(ordered);
    startTransition(async () => {
      const result = await reorderPageBlocksAction({
        pageId,
        orderedIds: ordered.map((block) => block.id),
      });
      if (!result.ok) {
        setBlocks(blocks);
        fail(result.error.message);
        return;
      }
      flash("Порядок сохранён");
    });
  }

  function toggleVisible(block: EditorBlock) {
    const nextVisible = !block.isVisible;
    setBlocks((prev) =>
      prev.map((row) =>
        row.id === block.id ? { ...row, isVisible: nextVisible } : row,
      ),
    );
    startTransition(async () => {
      const result = await updatePageBlockAction(block.id, {
        isVisible: nextVisible,
      });
      if (!result.ok) {
        setBlocks((prev) =>
          prev.map((row) =>
            row.id === block.id ? { ...row, isVisible: block.isVisible } : row,
          ),
        );
        fail(result.error.message);
        return;
      }
      flash(nextVisible ? "Блок показан" : "Блок скрыт");
    });
  }

  function removeBlock(block: EditorBlock) {
    if (!window.confirm(`Удалить блок «${blockLabel(block.type)}»?`)) return;
    const previous = blocks;
    setBlocks((prev) => prev.filter((row) => row.id !== block.id));
    if (editingId === block.id) closeEdit();
    startTransition(async () => {
      const result = await deletePageBlockAction(block.id);
      if (!result.ok) {
        setBlocks(previous);
        fail(result.error.message);
        return;
      }
      flash("Блок удалён");
    });
  }

  function saveEdit() {
    if (!editingBlock || !draft) return;
    const payload = { type: editingBlock.type as BlockType, data: draft };
    startTransition(async () => {
      const result = await updatePageBlockAction(editingBlock.id, {
        type: editingBlock.type,
        data: draft,
      });
      if (!result.ok) {
        fail(result.error.message);
        return;
      }
      setBlocks((prev) =>
        prev.map((row) =>
          row.id === editingBlock.id ? { ...row, data: { ...draft } } : row,
        ),
      );
      closeEdit();
      flash("Блок сохранён");
      void payload;
    });
  }

  function addBlock(type: BlockType) {
    setShowPalette(false);
    startTransition(async () => {
      const result = await createPageBlockAction({
        pageId,
        type,
        data: defaultBlockData(type),
        isVisible: true,
      });
      if (!result.ok) {
        fail(result.error.message);
        return;
      }
      const created = result.data as EditorBlock;
      setBlocks((prev) => [...prev, created]);
      openEdit(created);
      flash("Блок добавлен");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            <Link href="/admin/pages" className="text-brick no-underline hover:underline">
              ← Все страницы
            </Link>
          </p>
          <h1 className="mt-2 font-serif text-2xl font-semibold text-ink">
            {pageTitle}
          </h1>
          <p className="mt-1 text-sm text-graphite">{pagePath}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href={pagePath} target="_blank" rel="noreferrer">
              Открыть на сайте
            </Link>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => setShowPalette((value) => !value)}
            disabled={pending}
          >
            <Plus className="size-4" />
            Добавить блок
          </Button>
        </div>
      </div>

      {(status || error) && (
        <p
          className={
            error
              ? "border border-brick bg-brick-tint px-3 py-2 text-sm text-brick"
              : "border border-line bg-surface px-3 py-2 text-sm text-graphite"
          }
          role="status"
        >
          {error ?? status}
        </p>
      )}

      {showPalette ? (
        <div className="border border-line bg-surface p-4">
          <p className="mb-3 text-sm font-medium text-ink">Выберите тип блока</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {BLOCK_CATALOG.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => addBlock(item.type)}
                className="border border-line px-3 py-3 text-left transition-colors hover:border-brick hover:bg-paper-muted"
              >
                <span className="block font-medium text-ink">{item.label}</span>
                <span className="mt-0.5 block text-sm text-muted">{item.hint}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {blocks.length === 0 ? (
        <div className="border border-dashed border-line px-6 py-12 text-center">
          <p className="text-graphite">На странице пока нет блоков.</p>
          <Button
            type="button"
            className="mt-4"
            onClick={() => setShowPalette(true)}
          >
            Добавить первый блок
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {blocks.map((block, index) => {
            const isEditing = editingId === block.id;
            return (
              <li
                key={block.id}
                className={`border bg-surface ${
                  block.isVisible ? "border-line" : "border-dashed border-line opacity-70"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
                  <span className="mr-auto text-sm font-medium text-ink">
                    {index + 1}. {blockLabel(block.type)}
                    {!block.isVisible ? (
                      <span className="ml-2 text-muted">(скрыт)</span>
                    ) : null}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Выше"
                    disabled={pending || index === 0}
                    onClick={() => move(block.id, -1)}
                  >
                    <ChevronUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Ниже"
                    disabled={pending || index === blocks.length - 1}
                    onClick={() => move(block.id, 1)}
                  >
                    <ChevronDown className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={block.isVisible ? "Скрыть" : "Показать"}
                    disabled={pending}
                    onClick={() => toggleVisible(block)}
                  >
                    {block.isVisible ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeOff className="size-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Редактировать"
                    onClick={() =>
                      isEditing ? closeEdit() : openEdit(block)
                    }
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Удалить"
                    disabled={pending}
                    onClick={() => removeBlock(block)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {!isEditing ? (
                  <div className="px-4 py-3">
                    <BlockPreview type={block.type} data={block.data} />
                  </div>
                ) : null}

                {isEditing && draft ? (
                  <div className="space-y-4 px-4 py-4">
                    <BlockFields
                      type={block.type}
                      data={draft}
                      onChange={setDraft}
                    />
                    <div className="border border-line bg-paper-muted px-4 py-3">
                      <p className="mb-2 text-xs uppercase tracking-[0.04em] text-muted">
                        Предпросмотр
                      </p>
                      <BlockPreview type={block.type} data={draft} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" onClick={saveEdit} disabled={pending}>
                        Сохранить блок
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={closeEdit}
                        disabled={pending}
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
