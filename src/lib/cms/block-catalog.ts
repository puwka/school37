export const BLOCK_TYPES = [
  "heading",
  "text",
  "image",
  "gallery",
  "cta",
  "news",
  "documents",
  "employees",
  "accordion",
  "tabs",
  "table",
  "links",
  "contacts",
  "html",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

/** Старые типы из сида — читаются и рендерятся, в палитре не показываем */
export const LEGACY_BLOCK_TYPES = [
  "prose",
  "link_list",
  "alert",
  "definition_list",
  "facts",
] as const;

export type AnyBlockType = BlockType | (typeof LEGACY_BLOCK_TYPES)[number];

export type BlockMeta = {
  type: BlockType;
  label: string;
  hint: string;
};

export const BLOCK_CATALOG: BlockMeta[] = [
  { type: "heading", label: "Заголовок", hint: "Подзаголовок раздела" },
  { type: "text", label: "Текст", hint: "Обычные абзацы" },
  { type: "image", label: "Картинка", hint: "Одно изображение" },
  { type: "gallery", label: "Галерея", hint: "Несколько фото" },
  { type: "cta", label: "Кнопка", hint: "Призыв к действию" },
  { type: "news", label: "Новости", hint: "Лента новостей" },
  { type: "documents", label: "Документы", hint: "Список документов" },
  { type: "employees", label: "Сотрудники", hint: "Педагоги / руководство" },
  { type: "accordion", label: "Аккордеон", hint: "Вопрос — ответ" },
  { type: "tabs", label: "Вкладки", hint: "Несколько вкладок" },
  { type: "table", label: "Таблица", hint: "Строки и столбцы" },
  { type: "links", label: "Ссылки", hint: "Список ссылок" },
  { type: "contacts", label: "Контакты", hint: "Адрес, телефон, почта" },
  { type: "html", label: "HTML", hint: "Свой код (осторожно)" },
];

export function blockLabel(type: string): string {
  const found = BLOCK_CATALOG.find((item) => item.type === type);
  if (found) return found.label;
  const legacy: Record<string, string> = {
    prose: "Текст",
    link_list: "Ссылки",
    alert: "Уведомление",
    definition_list: "Определения",
    facts: "Факты",
  };
  return legacy[type] ?? type;
}

export function defaultBlockData(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "heading":
      return { text: "Новый заголовок", level: 2 };
    case "text":
      return { paragraphs: ["Введите текст абзаца."] };
    case "image":
      return { src: "", alt: "", caption: "" };
    case "gallery":
      return { items: [{ src: "", alt: "" }] };
    case "cta":
      return {
        title: "Заголовок кнопки",
        body: "Краткое пояснение",
        buttonLabel: "Подробнее",
        href: "/",
      };
    case "news":
      return { limit: 5, kind: "all" };
    case "documents":
      return { categorySlug: "", slugs: [] };
    case "employees":
      return { mode: "all", limit: 12 };
    case "accordion":
      return {
        items: [{ question: "Вопрос", answer: ["Ответ на вопрос."] }],
      };
    case "tabs":
      return {
        items: [
          { label: "Вкладка 1", paragraphs: ["Содержимое первой вкладки."] },
          { label: "Вкладка 2", paragraphs: ["Содержимое второй вкладки."] },
        ],
      };
    case "table":
      return {
        columns: ["Столбец 1", "Столбец 2"],
        rows: [["Значение", "Значение"]],
      };
    case "links":
      return { items: [{ label: "Ссылка", href: "/" }] };
    case "contacts":
      return {
        showAddress: true,
        showPhone: true,
        showEmail: true,
        showHours: true,
        note: "",
      };
    case "html":
      return { html: "<p>Свой HTML</p>" };
    default:
      return {};
  }
}

/** Нормализация старых типов к каноническим для редактора */
export function normalizeBlockType(type: string): string {
  if (type === "prose") return "text";
  if (type === "link_list") return "links";
  return type;
}
