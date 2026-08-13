import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import {
  categories,
  documents,
  employees,
  media,
  menuItems,
  news,
  pageBlocks,
  pages,
  redirects,
  settings,
  users,
} from "./schema";
import { school } from "../data/school";
import { news as newsItems } from "../data/news";
import { staff } from "../data/staff";
import { documents as documentItems } from "../data/documents";
import {
  achievements,
  clubs,
  educationLevels,
  foodInfo,
  holidays,
  profiles,
  vacantPlaces,
  workingPrograms,
} from "../data/education";
import { faq, governanceBodies, territories } from "../data/content";
import { mainNav, pedagogamNav, roditelyamNav, svedeniyaNav } from "../data/navigation";
import { sourceRedirects } from "../data/migration-gaps";
import { existsSync, statSync } from "node:fs";
import path from "node:path";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL не задан");
}

const sql = postgres(url, { max: 1 });
const db = drizzle(sql);

type Block = {
  type: string;
  data: Record<string, unknown>;
};

type PageSeed = {
  path: string;
  slug: string;
  title: string;
  description?: string;
  layout: "default" | "svedeniya" | "roditelyam" | "pedagogam";
  template?:
    | "page"
    | "hub"
    | "homepage"
    | "news_index"
    | "documents_index"
    | "employees_index"
    | "contacts";
  blocks?: Block[];
};

function prose(...paragraphs: string[]): Block {
  return { type: "prose", data: { paragraphs } };
}

function heading(text: string, anchor?: string): Block {
  return { type: "heading", data: { text, level: 2, ...(anchor ? { anchor } : {}) } };
}

function table(columns: string[], rows: string[][]): Block {
  return { type: "table", data: { columns, rows } };
}

function alert(title: string, body: string): Block {
  return { type: "alert", data: { variant: "info", title, body } };
}

function links(items: { label: string; href: string }[]): Block {
  return { type: "link_list", data: { items } };
}

function defs(items: { term: string; definition: string }[]): Block {
  return { type: "definition_list", data: { items } };
}

function docs(categorySlug?: string, slugs?: string[]): Block {
  return { type: "documents", data: { categorySlug, slugs } };
}

function accordion(items: { question: string; answer: string[] }[]): Block {
  return { type: "accordion", data: { items } };
}

const pageSeeds: PageSeed[] = [
  {
    path: "/",
    slug: "glavnaya",
    title: school.shortName,
    description: school.fullName,
    layout: "default",
    template: "homepage",
  },
  {
    path: "/o-shkole/",
    slug: "o-shkole",
    title: "О школе",
    description: school.motto,
    layout: "default",
    blocks: [
      prose(...school.aboutShort),
      heading("История в датах"),
      table(
        ["Год", "Событие"],
        school.timeline.map((item) => [item.year, item.text]),
      ),
      links([
        { label: "История школы", href: "/o-shkole/istoriya/" },
        { label: "Достижения", href: "/o-shkole/dostizheniya/" },
        { label: "Профили 10–11", href: "/o-shkole/profili/" },
        { label: "Руководство", href: "/svedeniya/rukovodstvo/" },
      ]),
    ],
  },
  {
    path: "/o-shkole/istoriya/",
    slug: "istoriya",
    title: "История школы",
    layout: "default",
    blocks: [
      prose(
        `МОАУ «СОШ №37 г. Орска» основана ${school.founded}. Первая линейка прошла 1 сентября в трёхэтажном здании на 640 мест.`,
        "В 1996 году открыт пристрой: бассейн, библиотека, актовый зал и новые классы.",
        "Сегодня школа работает в две смены, обучение очное; при необходимости организовано обучение на дому. Директор — Ожерельева Елена Геннадьевна.",
      ),
      table(
        ["Год", "Событие"],
        school.timeline.map((item) => [item.year, item.text]),
      ),
    ],
  },
  {
    path: "/o-shkole/dostizheniya/",
    slug: "dostizheniya",
    title: "Достижения",
    layout: "default",
    blocks: [
      table(
        ["Показатель", "Значение"],
        achievements.stats.map((item) => [item.label, item.value]),
      ),
      prose(...achievements.notes),
    ],
  },
  {
    path: "/o-shkole/profili/",
    slug: "profili",
    title: "Профили 10–11",
    layout: "default",
    template: "hub",
    blocks: [
      prose(
        "На уровне среднего общего образования школа реализует профили: история, математика, русский язык.",
      ),
      links(
        profiles.map((item) => ({
          label: item.title,
          href: `/o-shkole/profili/${item.slug}/`,
        })),
      ),
    ],
  },
  ...profiles.map(
    (item): PageSeed => ({
      path: `/o-shkole/profili/${item.slug}/`,
      slug: item.slug,
      title: item.title,
      description: item.description,
      layout: "default",
      blocks: [prose(item.description)],
    }),
  ),
  {
    path: "/kontakty/",
    slug: "kontakty",
    title: "Контакты",
    layout: "default",
    template: "contacts",
    blocks: [
      defs([
        { term: "Адрес", definition: school.address.full },
        { term: "Телефон", definition: school.phone },
        { term: "Email", definition: school.email },
        { term: "Режим работы", definition: school.workHours },
        { term: "Как добраться", definition: school.howToGet },
      ]),
      heading("Вопросы и ответы"),
      accordion(faq.map((item) => ({ question: item.question, answer: [...item.answer] }))),
    ],
  },
  {
    path: "/novosti/",
    slug: "novosti",
    title: "Новости",
    layout: "default",
    template: "news_index",
  },
  {
    path: "/svedeniya/",
    slug: "svedeniya",
    title: "Сведения об образовательной организации",
    description:
      "Обязательные сведения об образовательной организации в соответствии с приказом Рособрнадзора №1493.",
    layout: "svedeniya",
    template: "hub",
  },
  {
    path: "/svedeniya/osnovnye-svedeniya/",
    slug: "osnovnye-svedeniya",
    title: "Основные сведения",
    layout: "svedeniya",
    blocks: [
      heading("Официальные данные"),
      defs([
        { term: "Полное наименование", definition: school.fullName },
        { term: "Сокращённое наименование", definition: school.shortName },
        { term: "Дата основания", definition: school.foundedAlt },
        { term: "Руководитель", definition: school.director.name },
      ]),
      heading("Реквизиты"),
      table(
        ["Показатель", "Значение"],
        [
          ["Юридический адрес", school.address.full],
          ["ИНН", school.requisites.inn],
          ["КПП", school.requisites.kpp],
          ["ОГРН", school.requisites.ogrn],
          ["ОКПО", school.requisites.okpo],
          ["ОКОГУ", school.requisites.okogu],
          ["ОКОПФ", school.requisites.okopf],
          ["ОКТМО", school.requisites.oktmo],
          ["ОКАТО", school.requisites.okato],
          ["Расчётный счёт", school.requisites.account],
          ["БИК", school.requisites.bik],
          ["Получатель", school.requisites.bankRecipient],
        ],
      ),
    ],
  },
  {
    path: "/svedeniya/dokumenty/",
    slug: "dokumenty",
    title: "Документы",
    description: `Официальные документы ${school.shortName}.`,
    layout: "svedeniya",
    template: "documents_index",
  },
  {
    path: "/svedeniya/obrazovanie/",
    slug: "obrazovanie",
    title: "Образование",
    layout: "svedeniya",
    blocks: [
      prose(
        `Образовательная деятельность осуществляется на государственном языке Российской Федерации. Лицензия: ${school.license.number}, ${school.license.series}. Свидетельство о государственной аккредитации: ${school.accreditation.number}, ${school.accreditation.series}.`,
      ),
      table(
        ["Уровень", "Классы", "Форма", "Срок"],
        educationLevels.map((row) => [row.level, row.grades, row.form, row.years]),
      ),
      heading("Основная образовательная программа НОО (1–4)", "noo"),
      prose(`Форма обучения — очная, учебная неделя — 5 дней. Рабочие программы: ${workingPrograms.noo.join(", ")}.`),
      heading("Основная образовательная программа ООО (5–9)", "ooo"),
      prose(`Рабочие программы: ${workingPrograms.ooo.join(", ")}.`),
      heading("Основная образовательная программа СОО (10–11)", "soo"),
      prose(
        "Профили: история, математика, русский язык.",
        `Рабочие программы: ${workingPrograms.soo.join(", ")}.`,
      ),
    ],
  },
  {
    path: "/svedeniya/standarty/",
    slug: "standarty",
    title: "Образовательные стандарты и требования",
    layout: "svedeniya",
    blocks: [
      prose(
        `Образовательная деятельность в ${school.shortName} осуществляется в соответствии с федеральными государственными образовательными стандартами начального, основного и среднего общего образования.`,
      ),
      docs("obrazovanie"),
    ],
  },
  {
    path: "/svedeniya/rukovodstvo/",
    slug: "rukovodstvo",
    title: "Руководство",
    layout: "svedeniya",
    template: "employees_index",
  },
  {
    path: "/svedeniya/pedagogicheskiy-sostav/",
    slug: "pedagogicheskiy-sostav",
    title: "Педагогический состав",
    layout: "svedeniya",
    template: "employees_index",
  },
  {
    path: "/svedeniya/struktura/",
    slug: "struktura",
    title: "Структура и органы управления образовательной организацией",
    layout: "svedeniya",
    blocks: [
      prose(
        "Цели и задачи образования коллектив школы реализует через структуру органов коллегиального управления. В высшие органы входят представители обучающихся (кроме Наблюдательного совета), родителей и педагогов в равном количестве.",
      ),
      defs(governanceBodies.map((item) => ({ term: item.name, definition: item.description }))),
      links([
        { label: "Педагогический совет", href: "/svedeniya/struktura/pedsovet/" },
        { label: "Методический совет", href: "/svedeniya/struktura/metodicheskiy-sovet/" },
        { label: "Родительский совет", href: "/svedeniya/struktura/roditelskiy-sovet/" },
        { label: "Руководство школы", href: "/svedeniya/rukovodstvo/" },
      ]),
    ],
  },
  {
    path: "/svedeniya/struktura/pedsovet/",
    slug: "pedsovet",
    title: "Педагогический совет",
    layout: "svedeniya",
    blocks: [
      prose(
        "В состав Педагогического совета входят директор образовательной организации (как правило, председатель), его заместители, педагогические работники; по мере необходимости — председатель родительского комитета и председатель Совета школы.",
        "Педагогический совет работает по плану, являющемуся частью плана работы школы. Заседания созываются не реже четырёх раз в течение учебного года. Решения принимаются большинством голосов при наличии не менее 2/3 членов.",
      ),
    ],
  },
  {
    path: "/svedeniya/struktura/metodicheskiy-sovet/",
    slug: "metodicheskiy-sovet",
    title: "Методический совет",
    layout: "svedeniya",
    blocks: [
      prose(
        "Методический совет МОАУ «СОШ №37 г. Орска» — коллективный профессиональный орган, объединяющий руководителей школьных методических объединений и заместителя директора по учебно-воспитательной работе.",
        "В течение учебного года проводится четыре заседания методического совета.",
      ),
    ],
  },
  {
    path: "/svedeniya/struktura/roditelskiy-sovet/",
    slug: "roditelskiy-sovet",
    title: "Родительский совет",
    description: "Общешкольный родительский комитет МОАУ «СОШ № 37 г. Орска»",
    layout: "svedeniya",
    blocks: [
      prose(
        "Общешкольный родительский комитет — один из органов соуправления наряду с администрацией школы, ученическими и учительскими общественными организациями. Председатель — Ю.Х. Латыпов.",
        "Задачи комитета: укрепление связи семьи и школы, привлечение родителей к жизни учреждения, психолого-педагогическое просвещение, помощь в совершенствовании материально-технической базы.",
      ),
    ],
  },
  {
    path: "/svedeniya/mto/",
    slug: "mto",
    title: "МТО и доступная среда",
    layout: "svedeniya",
    blocks: [
      prose(
        "Здание школы — трёхэтажное, рассчитано на 640 мест. В 1996 году открыт пристрой: бассейн, библиотека, актовый зал и новые классы. Школа участвует в программе «Доступная среда».",
      ),
    ],
  },
  {
    path: "/svedeniya/stipendii/",
    slug: "stipendii",
    title: "Стипендии и иные виды материальной поддержки",
    layout: "svedeniya",
    blocks: [
      prose(
        "В общеобразовательной организации стипендии обучающимся не устанавливаются. Меры социальной поддержки, связанные с организацией питания, описаны на странице «Организация питания».",
      ),
    ],
  },
  {
    path: "/svedeniya/platnye-uslugi/",
    slug: "platnye-uslugi",
    title: "Платные образовательные услуги",
    layout: "svedeniya",
    blocks: [
      prose(
        "Информация о платных образовательных услугах публикуется в реестре документов по мере утверждения локальных актов.",
      ),
      defs([
        { term: "Получатель", definition: school.requisites.bankRecipient },
        { term: "Расчётный счёт", definition: school.requisites.account },
        { term: "БИК", definition: school.requisites.bik },
        { term: "Назначение платежа", definition: school.requisites.paymentPurpose },
      ]),
    ],
  },
  {
    path: "/svedeniya/finansy/",
    slug: "finansy",
    title: "Финансово-хозяйственная деятельность",
    layout: "svedeniya",
    blocks: [
      prose(
        `План финансово-хозяйственной деятельности и иные документы ФХД публикуются в реестре. Учредитель — ${school.founder.name}.`,
      ),
      docs("fhd"),
    ],
  },
  {
    path: "/svedeniya/vakantnye-mesta/",
    slug: "vakantnye-mesta",
    title: "Вакантные места для приёма (перевода) обучающихся",
    layout: "svedeniya",
    blocks: [
      table(
        ["Класс", "План", "Вакантно"],
        vacantPlaces.map((row) => [row.grade, String(row.plan), String(row.vacant)]),
      ),
    ],
  },
  {
    path: "/svedeniya/mezhdunarodnoe/",
    slug: "mezhdunarodnoe",
    title: "Международное сотрудничество",
    layout: "svedeniya",
    blocks: [
      prose(
        `На момент публикации сведений о договорах международного сотрудничества у ${school.shortName} нет.`,
      ),
    ],
  },
  {
    path: "/svedeniya/pitanie/",
    slug: "pitanie",
    title: "Организация питания в образовательной организации",
    layout: "svedeniya",
    blocks: [
      prose(
        `В МОАУ «СОШ №37 г. Орска» организовано горячее питание учащихся с 1 по 11 класс. Школу обслуживает ${foodInfo.operator}.`,
        ...foodInfo.notes,
      ),
      heading("Стоимость питания в 2025–2026 учебном году"),
      table(
        ["Вид", "Стоимость"],
        [
          ["Завтрак", foodInfo.breakfast],
          ["Обед", foodInfo.lunch],
          ["Завтрак 5–11 кл. (родительская плата)", foodInfo.breakfastParent511],
          ["Обед 5–11 кл. (родительская плата)", foodInfo.lunchParent511],
          ["ОВЗ 1–11 кл.", foodInfo.ovz],
        ],
      ),
      heading("Пример графика питания"),
      table(
        ["Время", "Классы"],
        foodInfo.scheduleSample.map((row) => [row.time, row.classes]),
      ),
    ],
  },
  {
    path: "/svedeniya/noko/",
    slug: "noko",
    title: "Независимая оценка качества образования",
    layout: "svedeniya",
    template: "hub",
    blocks: [
      links([
        {
          label: "Подготовка обучающихся",
          href: "/svedeniya/noko/podgotovka/",
        },
        {
          label: "Условия образовательной деятельности",
          href: "/svedeniya/noko/usloviya/",
        },
      ]),
    ],
  },
  {
    path: "/svedeniya/noko/podgotovka/",
    slug: "podgotovka",
    title: "Независимая оценка качества подготовки обучающихся",
    layout: "svedeniya",
    blocks: [docs("otchety")],
  },
  {
    path: "/svedeniya/noko/usloviya/",
    slug: "usloviya",
    title: "Независимая оценка качества условий образовательной деятельности",
    layout: "svedeniya",
    blocks: [
      prose(
        `Материалы независимой оценки качества условий осуществления образовательной деятельности в ${school.shortName} публикуются после официального размещения результатов.`,
      ),
    ],
  },
  {
    path: "/svedeniya/sout/",
    slug: "sout",
    title: "Специальная оценка условий труда",
    layout: "svedeniya",
    blocks: [docs("sout")],
  },
  {
    path: "/roditelyam/",
    slug: "roditelyam",
    title: "Родителям",
    layout: "roditelyam",
    template: "hub",
  },
  {
    path: "/roditelyam/priem/",
    slug: "priem",
    title: "Поступление",
    layout: "roditelyam",
    blocks: [
      prose(
        "Зачисление в первые классы начинается с достижения возраста шести лет и шести месяцев при отсутствии противопоказаний по состоянию здоровья, но не позже восьми лет. Заявление можно подать через Госуслуги или лично в школу.",
      ),
      heading("Закреплённая территория"),
      table(
        ["Улица / район", "Дома"],
        territories.map((row) => [row.street, row.houses]),
      ),
    ],
  },
  {
    path: "/roditelyam/raspisanie/",
    slug: "raspisanie",
    title: "Расписание",
    layout: "roditelyam",
    blocks: [
      prose(
        `Учебная неделя — ${school.weekDays}. Уроки начинаются в ${school.lessonsStart}. Продолжительность урока — ${school.lessonDuration}. Обучение организовано в ${school.shifts}.`,
      ),
      alert(
        "Актуальное расписание классов",
        "Подробное расписание уроков по классам на исходном сайте не было заполнено. Актуальные звонки сообщают классные руководители.",
      ),
    ],
  },
  {
    path: "/roditelyam/kanikuly/",
    slug: "kanikuly",
    title: "Каникулы",
    layout: "roditelyam",
    blocks: [
      table(
        ["Каникулы", "Период", "Дней"],
        holidays.map((row) => [row.type, row.period, String(row.days)]),
      ),
    ],
  },
  {
    path: "/roditelyam/uchebniki/",
    slug: "uchebniki",
    title: "Учебники",
    layout: "roditelyam",
    blocks: [docs(undefined, ["perechen-uchebnikov-2025-26"])],
  },
  {
    path: "/roditelyam/kruzhki/",
    slug: "kruzhki",
    title: "Кружки и секции",
    layout: "roditelyam",
    template: "hub",
    blocks: [
      links(
        clubs.map((club) => ({
          label: `${club.title} (${club.grades})`,
          href: `/roditelyam/kruzhki/${club.slug}/`,
        })),
      ),
    ],
  },
  ...clubs.map(
    (club): PageSeed => ({
      path: `/roditelyam/kruzhki/${club.slug}/`,
      slug: club.slug,
      title: club.title,
      description: club.description,
      layout: "roditelyam",
      blocks: [
        prose(club.description, `Классы: ${club.grades}. Статус: ${club.status}. Направление: ${club.direction}.`),
      ],
    }),
  ),
  {
    path: "/roditelyam/sportklub/",
    slug: "sportklub",
    title: "Спортклуб",
    layout: "roditelyam",
    blocks: [
      prose(
        "В школе действует спортивный зал и бассейн (пристрой 1996 года). Спортивные секции публикуются в разделе «Кружки и секции».",
      ),
    ],
  },
  {
    path: "/roditelyam/teatr/",
    slug: "teatr",
    title: "Театр",
    layout: "roditelyam",
    blocks: [
      prose(
        "В школе есть актовый зал. Афиши спектаклей публикуются в новостях по мере появления мероприятий.",
      ),
    ],
  },
  {
    path: "/roditelyam/lager/",
    slug: "lager",
    title: "Лагерь",
    description: "Школьный лагерь «Дорогою добра».",
    layout: "roditelyam",
    blocks: [
      prose(
        "В каникулярный период при школе работает лагерь «Дорогою добра». Программа и режим работы публикуются в документах раздела.",
      ),
      docs("lager"),
    ],
  },
  {
    path: "/roditelyam/ovz/",
    slug: "ovz",
    title: "Обучение детей с ограниченными возможностями здоровья",
    layout: "roditelyam",
    blocks: [
      prose(
        "Школа участвует в программе «Доступная среда». При необходимости организовано обучение на дому. Для обучающихся с ОВЗ по адаптированной программе по заключению ПМПК предусмотрено льготное питание.",
      ),
    ],
  },
  {
    path: "/roditelyam/olimpiady/",
    slug: "olimpiady",
    title: "Олимпиады",
    layout: "roditelyam",
    blocks: [prose(...achievements.notes)],
  },
  {
    path: "/roditelyam/gia/",
    slug: "gia",
    title: "ГИА и ЕГЭ",
    layout: "roditelyam",
    blocks: [
      prose(
        "Государственная итоговая аттестация проводится в формах ОГЭ (9 класс) и ЕГЭ (11 класс). Актуальные расписания публикуются в новостях и реестре документов.",
      ),
    ],
  },
  {
    path: "/roditelyam/servisy/",
    slug: "servisy",
    title: "Сервисы",
    layout: "roditelyam",
    blocks: [
      links([
        { label: "Запись в школу на Госуслугах", href: school.enrollmentUrl },
        { label: "Сообщить о проблеме (ПОС)", href: school.gosuslugiProblemUrl },
        { label: "Поступление и территория", href: "/roditelyam/priem/" },
      ]),
      heading("Вопросы и ответы"),
      accordion(faq.map((item) => ({ question: item.question, answer: [...item.answer] }))),
    ],
  },
  {
    path: "/pedagogam/",
    slug: "pedagogam",
    title: "Педагогам",
    layout: "pedagogam",
    template: "hub",
  },
  {
    path: "/pedagogam/zhurnal/",
    slug: "zhurnal",
    title: "Электронный журнал",
    layout: "pedagogam",
    blocks: [
      prose(
        "Доступ к электронному журналу предоставляется педагогическим работникам и законным представителям обучающихся по учётным данным, выдаваемым администрацией школы.",
      ),
    ],
  },
  {
    path: "/pedagogam/attestatsiya/",
    slug: "attestatsiya",
    title: "Аттестация",
    layout: "pedagogam",
    blocks: [
      prose(
        "Аттестация педагогических работников проводится в порядке, установленном законодательством об образовании.",
      ),
    ],
  },
  {
    path: "/pedagogam/kvalifikatsiya/",
    slug: "kvalifikatsiya",
    title: "Повышение квалификации",
    layout: "pedagogam",
    blocks: [
      prose(
        "Методический совет и школьные методические объединения координируют повышение квалификации педагогических работников.",
      ),
    ],
  },
  {
    path: "/pedagogam/profsoyuz/",
    slug: "profsoyuz",
    title: "Профсоюз",
    layout: "pedagogam",
    blocks: [
      prose(
        "В школе действует профсоюзный комитет. Председатель — А.И. Павленко. Коллективный договор размещён в реестре документов.",
      ),
    ],
  },
  {
    path: "/pedagogam/vakansii/",
    slug: "vakansii",
    title: "Вакансии",
    layout: "pedagogam",
    blocks: [
      prose(
        `Актуальные вакансии публикуются по мере открытия ставок. Резюме направляйте на ${school.email} или по телефону ${school.phone}.`,
      ),
    ],
  },
  {
    path: "/policy/",
    slug: "policy",
    title: "Политика в отношении обработки персональных данных",
    layout: "default",
    blocks: [
      prose(
        `${school.fullName} обрабатывает персональные данные в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».`,
        `Оператор: ${school.shortName}. Адрес: ${school.address.full}. Телефон: ${school.phone}. Email: ${school.email}.`,
      ),
    ],
  },
];

async function seed() {
  console.log("Очистка таблиц…");
  await sql`truncate table
    audit_logs, redirects, settings, menu_items, page_blocks, pages,
    documents, news, employees, media, categories, users
    restart identity cascade`;

  const email = (process.env.CMS_ADMIN_EMAIL ?? "admin@school37.local").toLowerCase();
  const password = process.env.CMS_ADMIN_PASSWORD ?? "changeme";
  const [admin] = await db
    .insert(users)
    .values({
      email,
      passwordHash: await bcrypt.hash(password, 12),
      name: "Администратор",
      role: "admin",
    })
    .returning();

  const newsCats = await db
    .insert(categories)
    .values([
      { slug: "novost", name: "Новость", type: "news", sortOrder: 1 },
      { slug: "obyavlenie", name: "Объявление", type: "news", sortOrder: 2 },
      { slug: "meropriyatie", name: "Мероприятие", type: "news", sortOrder: 3 },
    ])
    .returning();

  const docCats = await db
    .insert(categories)
    .values([
      { slug: "osnovnye", name: "Основные", type: "document", sortOrder: 1 },
      { slug: "lokalnye-akty", name: "Локальные акты", type: "document", sortOrder: 2 },
      { slug: "obrazovanie", name: "Образование", type: "document", sortOrder: 3 },
      { slug: "pitanie", name: "Питание", type: "document", sortOrder: 4 },
      { slug: "lager", name: "Лагерь", type: "document", sortOrder: 5 },
      { slug: "fhd", name: "ФХД", type: "document", sortOrder: 6 },
      { slug: "sout", name: "СОУТ", type: "document", sortOrder: 7 },
      { slug: "otchety", name: "Отчёты", type: "document", sortOrder: 8 },
    ])
    .returning();

  const newsCatByName = Object.fromEntries(newsCats.map((c) => [c.name, c.id]));
  const docCatByName = Object.fromEntries(docCats.map((c) => [c.name, c.id]));

  const publicRoot = path.join(process.cwd(), "public");

  async function ensureMedia(urlPath: string, originalName: string, mimeType: string) {
    const abs = path.join(publicRoot, urlPath.replace(/^\//, ""));
    if (!existsSync(abs)) return null;
    const sizeBytes = statSync(abs).size;
    const filename = path.basename(abs);
    const [row] = await db
      .insert(media)
      .values({
        filename,
        originalName,
        mimeType,
        sizeBytes,
        storagePath: urlPath,
        url: urlPath,
        uploadedById: admin.id,
      })
      .returning();
    return row;
  }

  const mimeByExt: Record<string, string> = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
  };

  const documentFileIds = new Map<string, string>();
  for (const item of documentItems) {
    if (!item.href) continue;
    const ext = path.extname(item.href).toLowerCase();
    const row = await ensureMedia(
      item.href,
      path.basename(item.href),
      mimeByExt[ext] ?? "application/octet-stream",
    );
    if (row) documentFileIds.set(item.slug, row.id);
  }

  const employeePhotoIds = new Map<string, string>();
  for (const person of staff) {
    if (!person.photoSrc) continue;
    const row = await ensureMedia(
      person.photoSrc,
      path.basename(person.photoSrc),
      "image/jpeg",
    );
    if (row) employeePhotoIds.set(person.slug, row.id);
  }

  // Event / school images from source homepage
  for (const img of [
    "/uploads/images/event-moy-dodyr.jpg",
    "/uploads/images/event-zozh.jpg",
    "/uploads/images/event-vitaminka.jpg",
    "/uploads/images/event-vypuskniki.jpg",
    "/uploads/images/mto-avgust.jpg",
  ]) {
    await ensureMedia(img, path.basename(img), "image/jpeg");
  }

  await db.insert(news).values(
    newsItems.map((item) => ({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      body: [...item.body],
      kind: item.type,
      categoryId: newsCatByName[item.category] ?? newsCats[0].id,
      isUrgent: Boolean(item.urgent),
      status: "published" as const,
      publishedAt: new Date(`${item.date}T12:00:00+03:00`),
      createdById: admin.id,
      updatedById: admin.id,
    })),
  );

  await db.insert(documents).values(
    documentItems.map((item) => ({
      slug: item.slug,
      title: item.title,
      categoryId: docCatByName[item.category] ?? docCats[0].id,
      fileId: documentFileIds.get(item.slug) ?? null,
      documentDate: item.date,
      sizeLabel: item.sizeLabel,
      isSigned: Boolean(item.signed),
      status: "published" as const,
      publishedAt: new Date(),
      createdById: admin.id,
      updatedById: admin.id,
    })),
  );

  await db.insert(employees).values(
    staff.map((person, index) => ({
      slug: person.slug,
      name: person.name,
      role: person.role,
      subjects: person.subjects ? [...person.subjects] : [],
      phone: person.phone,
      email: person.email,
      receptionHours: person.receptionHours,
      education: person.education,
      qualification: person.qualification,
      experienceYears: person.experienceYears,
      professionalExperienceYears: person.professionalExperienceYears,
      development: person.development ? [...person.development] : [],
      programs: person.programs ? [...person.programs] : [],
      isLeadership: Boolean(person.isLeadership),
      photoId: employeePhotoIds.get(person.slug) ?? null,
      sortOrder: index,
      status: "published" as const,
      createdById: admin.id,
      updatedById: admin.id,
    })),
  );

  await db.insert(settings).values([
    {
      key: "school",
      group: "school",
      description: "Карточка образовательной организации",
      value: school,
      updatedById: admin.id,
    },
    {
      key: "education.levels",
      group: "education",
      value: educationLevels,
      updatedById: admin.id,
    },
    {
      key: "education.food",
      group: "education",
      value: foodInfo,
      updatedById: admin.id,
    },
    {
      key: "education.holidays",
      group: "education",
      value: holidays,
      updatedById: admin.id,
    },
    {
      key: "education.vacantPlaces",
      group: "education",
      value: vacantPlaces,
      updatedById: admin.id,
    },
    {
      key: "content.territories",
      group: "content",
      value: territories,
      updatedById: admin.id,
    },
    {
      key: "content.faq",
      group: "content",
      value: faq,
      updatedById: admin.id,
    },
  ]);

  const insertedPages = [];
  for (const page of pageSeeds) {
    const [row] = await db
      .insert(pages)
      .values({
        path: page.path,
        slug: page.slug,
        title: page.title,
        description: page.description,
        layout: page.layout,
        template: page.template ?? "page",
        status: "published",
        publishedAt: new Date(),
        createdById: admin.id,
        updatedById: admin.id,
      })
      .returning();
    insertedPages.push(row);
    if (page.blocks?.length) {
      await db.insert(pageBlocks).values(
        page.blocks.map((block, index) => ({
          pageId: row.id,
          type: block.type,
          data: block.data,
          sortOrder: index,
        })),
      );
    }
  }

  const pageByPath = Object.fromEntries(insertedPages.map((p) => [p.path, p.id]));

  async function insertMenu(
    location: typeof menuItems.$inferInsert.location,
    items: { label: string; href: string; children?: { label: string; href: string }[] }[],
  ) {
    for (const [index, item] of items.entries()) {
      const [parent] = await db
        .insert(menuItems)
        .values({
          location,
          label: item.label,
          href: item.href,
          pageId: pageByPath[item.href] ?? null,
          sortOrder: index,
          isExternal: item.href.startsWith("http"),
          openInNewTab: item.href.startsWith("http"),
        })
        .returning();
      for (const [childIndex, child] of (item.children ?? []).entries()) {
        await db.insert(menuItems).values({
          location,
          parentId: parent.id,
          label: child.label,
          href: child.href,
          pageId: pageByPath[child.href] ?? null,
          sortOrder: childIndex,
          isExternal: child.href.startsWith("http"),
        });
      }
    }
  }

  await insertMenu("header", mainNav);
  await insertMenu("svedeniya", svedeniyaNav);
  await insertMenu("roditelyam", roditelyamNav);
  await insertMenu("pedagogam", pedagogamNav);
  await insertMenu("quick", [
    { label: "Поступление", href: "/roditelyam/priem/" },
    { label: "Расписание", href: "/roditelyam/raspisanie/" },
    { label: "Питание", href: "/svedeniya/pitanie/" },
    { label: "Документы", href: "/svedeniya/dokumenty/" },
    { label: "Запись на Госуслугах", href: school.enrollmentUrl },
  ]);
  await insertMenu("footer_official", [
    { label: "Сведения об ОО", href: "/svedeniya/" },
    { label: "Документы", href: "/svedeniya/dokumenty/" },
    { label: "Питание", href: "/svedeniya/pitanie/" },
    { label: "Вакантные места", href: "/svedeniya/vakantnye-mesta/" },
  ]);
  await insertMenu("footer_more", [
    { label: "Педагогам", href: "/pedagogam/" },
    { label: "Вакансии", href: "/pedagogam/vakansii/" },
    { label: "СОУТ", href: "/svedeniya/sout/" },
    { label: "Политика ПДн", href: "/policy/" },
  ]);

  await db.insert(redirects).values(
    sourceRedirects.map((item) => ({
      fromPath: item.from,
      toPath: item.to,
      createdById: admin.id,
      note: "Перенос с GosWeb",
    })),
  );

  console.log(`Готово. Администратор: ${email}`);
  await sql.end({ timeout: 5 });
}

export { seed as runSeed };

const isDirectRun =
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").endsWith("src/db/seed.ts");

if (isDirectRun) {
  seed().catch(async (error) => {
    console.error(error);
    await sql.end({ timeout: 5 });
    process.exit(1);
  });
}
