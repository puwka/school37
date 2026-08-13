import type { NavItem } from "@/components/layout/site-header";
import type { SidebarItem } from "@/components/layout/sidebar-nav";

export const mainNav: NavItem[] = [
  {
    label: "О школе",
    href: "/o-shkole/",
    children: [
      { label: "История", href: "/o-shkole/istoriya/" },
      { label: "Руководство", href: "/svedeniya/rukovodstvo/" },
      { label: "Педагогический состав", href: "/svedeniya/pedagogicheskiy-sostav/" },
      { label: "Образовательные программы", href: "/svedeniya/obrazovanie/" },
      { label: "Достижения", href: "/o-shkole/dostizheniya/" },
      { label: "Профили 10–11", href: "/o-shkole/profili/" },
    ],
  },
  {
    label: "Сведения об ОО",
    href: "/svedeniya/",
    children: [
      { label: "Основные сведения", href: "/svedeniya/osnovnye-svedeniya/" },
      { label: "Документы", href: "/svedeniya/dokumenty/" },
      { label: "Образование", href: "/svedeniya/obrazovanie/" },
      { label: "Руководство", href: "/svedeniya/rukovodstvo/" },
      { label: "Педагогический состав", href: "/svedeniya/pedagogicheskiy-sostav/" },
      { label: "Организация питания", href: "/svedeniya/pitanie/" },
      { label: "НОКО", href: "/svedeniya/noko/" },
    ],
  },
  {
    label: "Родителям",
    href: "/roditelyam/",
    children: [
      { label: "Поступление", href: "/roditelyam/priem/" },
      { label: "Заявка в школу", href: "/roditelyam/zayavka/" },
      { label: "Расписание", href: "/roditelyam/raspisanie/" },
      { label: "Каникулы", href: "/roditelyam/kanikuly/" },
      { label: "Питание", href: "/svedeniya/pitanie/" },
      { label: "Учебники", href: "/roditelyam/uchebniki/" },
      { label: "Кружки и секции", href: "/roditelyam/kruzhki/" },
      { label: "Лагерь", href: "/roditelyam/lager/" },
      { label: "ОВЗ", href: "/roditelyam/ovz/" },
      { label: "ГИА и ЕГЭ", href: "/roditelyam/gia/" },
      { label: "Сервисы", href: "/roditelyam/servisy/" },
    ],
  },
  {
    label: "Педагогам",
    href: "/pedagogam/",
    children: [
      { label: "Электронный журнал", href: "/pedagogam/zhurnal/" },
      { label: "Аттестация", href: "/pedagogam/attestatsiya/" },
      { label: "Повышение квалификации", href: "/pedagogam/kvalifikatsiya/" },
      { label: "Профсоюз", href: "/pedagogam/profsoyuz/" },
      { label: "Вакансии", href: "/pedagogam/vakansii/" },
    ],
  },
  { label: "Документы", href: "/svedeniya/dokumenty/" },
  { label: "Новости", href: "/novosti/" },
  { label: "Контакты", href: "/kontakty/" },
];

export const svedeniyaNav: SidebarItem[] = [
  { label: "Основные сведения", href: "/svedeniya/osnovnye-svedeniya/" },
  {
    label: "Структура и органы управления",
    href: "/svedeniya/struktura/",
    children: [
      { label: "Педагогический совет", href: "/svedeniya/struktura/pedsovet/" },
      { label: "Методический совет", href: "/svedeniya/struktura/metodicheskiy-sovet/" },
      { label: "Родительский совет", href: "/svedeniya/struktura/roditelskiy-sovet/" },
    ],
  },
  { label: "Документы", href: "/svedeniya/dokumenty/" },
  { label: "Образование", href: "/svedeniya/obrazovanie/" },
  { label: "Образовательные стандарты", href: "/svedeniya/standarty/" },
  { label: "Руководство", href: "/svedeniya/rukovodstvo/" },
  { label: "Педагогический состав", href: "/svedeniya/pedagogicheskiy-sostav/" },
  { label: "МТО и доступная среда", href: "/svedeniya/mto/" },
  { label: "Стипендии и меры поддержки", href: "/svedeniya/stipendii/" },
  { label: "Платные образовательные услуги", href: "/svedeniya/platnye-uslugi/" },
  { label: "Финансово-хозяйственная деятельность", href: "/svedeniya/finansy/" },
  { label: "Вакантные места", href: "/svedeniya/vakantnye-mesta/" },
  { label: "Международное сотрудничество", href: "/svedeniya/mezhdunarodnoe/" },
  { label: "Организация питания", href: "/svedeniya/pitanie/" },
  {
    label: "Независимая оценка качества",
    href: "/svedeniya/noko/",
    children: [
      { label: "Подготовка обучающихся", href: "/svedeniya/noko/podgotovka/" },
      { label: "Условия образовательной деятельности", href: "/svedeniya/noko/usloviya/" },
    ],
  },
  { label: "СОУТ", href: "/svedeniya/sout/" },
];

export const pedagogamNav: SidebarItem[] = [
  { label: "Электронный журнал", href: "/pedagogam/zhurnal/" },
  { label: "Аттестация", href: "/pedagogam/attestatsiya/" },
  { label: "Повышение квалификации", href: "/pedagogam/kvalifikatsiya/" },
  { label: "Профсоюз", href: "/pedagogam/profsoyuz/" },
  { label: "Вакансии", href: "/pedagogam/vakansii/" },
];

export const roditelyamNav: SidebarItem[] = [
  { label: "Поступление", href: "/roditelyam/priem/" },
  { label: "Заявка в школу", href: "/roditelyam/zayavka/" },
  { label: "Расписание", href: "/roditelyam/raspisanie/" },
  { label: "Каникулы", href: "/roditelyam/kanikuly/" },
  { label: "Питание", href: "/svedeniya/pitanie/" },
  { label: "Учебники", href: "/roditelyam/uchebniki/" },
  { label: "Кружки и секции", href: "/roditelyam/kruzhki/" },
  { label: "Спортклуб", href: "/roditelyam/sportklub/" },
  { label: "Театр", href: "/roditelyam/teatr/" },
  { label: "Лагерь", href: "/roditelyam/lager/" },
  { label: "ОВЗ", href: "/roditelyam/ovz/" },
  { label: "Олимпиады", href: "/roditelyam/olimpiady/" },
  { label: "ГИА и ЕГЭ", href: "/roditelyam/gia/" },
  { label: "Сервисы", href: "/roditelyam/servisy/" },
];

export const quickActions = [
  { label: "Поступление", href: "/roditelyam/priem/" },
  { label: "Заявка в школу", href: "/roditelyam/zayavka/" },
  { label: "Расписание", href: "/roditelyam/raspisanie/" },
  { label: "Питание", href: "/svedeniya/pitanie/" },
  { label: "Документы", href: "/svedeniya/dokumenty/" },
  {
    label: "Запись на Госуслугах",
    href: "https://www.gosuslugi.ru/600412/1/form/",
  },
] as const;

export const footerColumns = {
  official: [
    { label: "Сведения об ОО", href: "/svedeniya/" },
    { label: "Документы", href: "/svedeniya/dokumenty/" },
    { label: "Питание", href: "/svedeniya/pitanie/" },
    { label: "Вакантные места", href: "/svedeniya/vakantnye-mesta/" },
  ],
  more: [
    { label: "Педагогам", href: "/pedagogam/" },
    { label: "Вакансии", href: "/pedagogam/vakansii/" },
    { label: "СОУТ", href: "/svedeniya/sout/" },
    { label: "Политика ПДн", href: "/policy/" },
  ],
} as const;
