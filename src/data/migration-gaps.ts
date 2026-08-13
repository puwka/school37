/**
 * Пробелы переноса с https://sh37-orsk-r56.gosweb.gosuslugi.ru/
 * Только факты: что уже в CMS и что требует ручной догрузки из школы / админки Госвеба.
 */
export type MigrationGap = {
  area: string;
  status: "done" | "partial" | "manual";
  note: string;
};

export const migrationGaps: MigrationGap[] = [
  {
    area: "Реквизиты и контакты",
    status: "done",
    note: "ИНН, КПП, ОГРН, адрес, телефон, email, учредитель, режим — перенесены в settings/school.",
  },
  {
    area: "Структура «Сведения об ОО»",
    status: "done",
    note: "Разделы меню и страницы CMS соответствуют обязательной структуре; пустые на исходнике (структура/органы, часть подразделов) оставлены с пометкой к заполнению через редактор блоков.",
  },
  {
    area: "Документы (файлы)",
    status: "partial",
    note: "На исходнике в UI «Найдено: 131», в HTML доступно ~47+ файлов; в CMS загружено 25 ключевых PDF/DOCX в /uploads/documents. Остальные — вручную из админки Госвеба или с диска школы.",
  },
  {
    area: "Положение об организации питания",
    status: "manual",
    note: "Файл на исходнике есть в разделе питания; точное имя в выгрузке неоднозначно — загрузите PDF в админке и привяжите к карточке документа.",
  },
  {
    area: "Публичный доклад / самообследование",
    status: "manual",
    note: "В прежнем каталоге была запись без файла на исходнике в доступном HTML — нужна актуальная версия от школы.",
  },
  {
    area: "Рабочие программы предметов",
    status: "manual",
    note: "На /obrazovanie/ десятки файлов Rabochaya_programma_*.docx — структура раздела есть, массовую загрузку выполнить вручную.",
  },
  {
    area: "Новости",
    status: "partial",
    note: "3 новости + мероприятия с исходника перенесены в CMS. Тела части новостей на Госвебе почти пустые (только заголовок) — текст сохранён по доступным формулировкам сайта.",
  },
  {
    area: "Педагогический состав",
    status: "partial",
    note: "ФИО/должности с сайта и раздела «Наш коллектив» в CMS; фото скачаны для 10 карточек с официального листинга. Полный штат с личными делами (образование, стаж) — только у директора и части руководства на исходнике.",
  },
  {
    area: "Изображения",
    status: "partial",
    note: "Фото мероприятий и 10 фото сотрудников в /uploads. Отдельного качественного фото здания школы на исходнике почти нет — hero нужно добавить вручную.",
  },
  {
    area: "Расписание уроков",
    status: "manual",
    note: "Страница /glavnoe/raspisanie/ на исходнике; актуальные таблицы — от школы каждый период.",
  },
  {
    area: "Соцсети",
    status: "manual",
    note: "На исходнике шаблонные ссылки vk.com / ok.ru без конкретной группы школы — не подставлялись вымышленные URL.",
  },
  {
    area: "Плейсхолдеры Госвеба",
    status: "manual",
    note: "Разделы «Официально», часть «Стипендии», пустые «Документы не выбраны» — на исходнике без контента; в CMS структура есть, тексты не выдумывались.",
  },
];

export const sourceBaseUrl = "https://sh37-orsk-r56.gosweb.gosuslugi.ru";

/** Редиректы со старых путей Госвеба на новую IA */
export const sourceRedirects: { from: string; to: string }[] = [
  { from: "/svedeniya-ob-obrazovatelnoy-organizatsii/", to: "/svedeniya/" },
  {
    from: "/svedeniya-ob-obrazovatelnoy-organizatsii/osnovnye-svedeniya/",
    to: "/svedeniya/osnovnye-svedeniya/",
  },
  {
    from: "/svedeniya-ob-obrazovatelnoy-organizatsii/dokumenty/",
    to: "/svedeniya/dokumenty/",
  },
  {
    from: "/svedeniya-ob-obrazovatelnoy-organizatsii/obrazovanie/",
    to: "/svedeniya/obrazovanie/",
  },
  {
    from: "/svedeniya-ob-obrazovatelnoy-organizatsii/rukovodstvo/",
    to: "/svedeniya/rukovodstvo/",
  },
  {
    from: "/svedeniya-ob-obrazovatelnoy-organizatsii/pedagogicheskiy-sostav/",
    to: "/svedeniya/pedagogicheskiy-sostav/",
  },
  {
    from: "/svedeniya-ob-obrazovatelnoy-organizatsii/organizatsiya-pitaniya/",
    to: "/svedeniya/pitanie/",
  },
  {
    from: "/svedeniya-ob-obrazovatelnoy-organizatsii/finansovo-hozyaystvennaya-deyatelnost/",
    to: "/svedeniya/finansy/",
  },
  { from: "/glavnoe/kontakty/", to: "/kontakty/" },
  { from: "/glavnoe/raspisanie/", to: "/roditelyam/raspisanie/" },
  { from: "/glavnoe/sout/", to: "/svedeniya/sout/" },
  { from: "/nasha-shkola/o-shkole/", to: "/o-shkole/" },
  { from: "/nasha-shkola/administratsiya/", to: "/svedeniya/rukovodstvo/" },
  {
    from: "/nasha-shkola/nash-kollektiv/",
    to: "/svedeniya/pedagogicheskiy-sostav/",
  },
  { from: "/roditelyam-i-uchenikam/novosti/", to: "/novosti/" },
  { from: "/policy/", to: "/policy/" },
];
