export type DocumentCategory =
  | "Основные"
  | "Локальные акты"
  | "Образование"
  | "Питание"
  | "Лагерь"
  | "ФХД"
  | "СОУТ"
  | "Отчёты";

export type DocumentItem = {
  slug: string;
  title: string;
  category: DocumentCategory;
  date?: string;
  sizeLabel?: string;
  signed?: boolean;
  /** Локальный путь после переноса с gosweb */
  href?: string;
  /** Исходный URL на сайте Госвеба (для сверки) */
  sourceUrl?: string;
};

const U = "/uploads/documents";
const S = "https://sh37-orsk-r56.gosweb.gosuslugi.ru";

export const documents: DocumentItem[] = [
  {
    slug: "ustav",
    title: "Устав образовательной организации МОАУ «СОШ №37 г. Орска»",
    category: "Основные",
    date: "01.02.2016",
    sizeLabel: "1,2 МБ",
    signed: true,
    href: `${U}/ustav.pdf`,
    sourceUrl: `${S}/netcat_files/32/315/Ustav.pdf`,
  },
  {
    slug: "litsenziya",
    title: "Лицензия на осуществление образовательной деятельности (с приложением)",
    category: "Основные",
    date: "19.02.2015",
    sizeLabel: "1,6 МБ",
    href: `${U}/litsenziya.pdf`,
    sourceUrl: `${S}/netcat_files/67/1085/litsenziya_s_prilozheniem.pdf`,
  },
  {
    slug: "akkreditatsiya",
    title: "Свидетельство о государственной аккредитации",
    category: "Основные",
    date: "03.09.2013",
    sizeLabel: "918 КБ",
    href: `${U}/akkreditatsiya.pdf`,
    sourceUrl: `${S}/netcat_files/67/1085/akkreditatsiya.pdf`,
  },
  {
    slug: "reestr-vyiska",
    title: "Реестровая выписка (лицензия)",
    category: "Основные",
    sizeLabel: "73 КБ",
    href: `${U}/reestr-vyiska.pdf`,
    sourceUrl: `${S}/netcat_files/67/1085/Reestrovaya_vypiska.pdf`,
  },
  {
    slug: "pvr-obuchayuschihsya",
    title: "Правила внутреннего распорядка обучающихся",
    category: "Локальные акты",
    sizeLabel: "8 КБ",
    href: `${U}/pvr-obuchayuschihsya.pdf`,
    sourceUrl: `${S}/netcat_files/32/315/test_file_1.pdf`,
  },
  {
    slug: "pvtr",
    title: "Правила внутреннего трудового распорядка",
    category: "Локальные акты",
    sizeLabel: "8 КБ",
    href: `${U}/pvtr.pdf`,
    sourceUrl: `${S}/netcat_files/32/315/test_file_16.pdf`,
  },
  {
    slug: "kollektivnyy-dogovor",
    title: "Коллективный договор МОАУ «СОШ №37 г. Орска»",
    category: "Локальные акты",
    sizeLabel: "705 КБ",
    href: `${U}/kollektivnyy-dogovor.pdf`,
    sourceUrl: `${S}/netcat_files/32/315/kol_dogovor.pdf`,
  },
  {
    slug: "perechen-uchebnikov-2025-26",
    title: "Перечень учебников, используемых в 2025–2026 учебном году",
    category: "Образование",
    date: "2025",
    sizeLabel: "25 КБ",
    href: `${U}/perechen-uchebnikov-2025-26.docx`,
    sourceUrl: `${S}/netcat_files/115/2947/Perechen_uchebnikov_2025_26g..docx`,
  },
  {
    slug: "oop-noo",
    title: "Основная образовательная программа НОО",
    category: "Образование",
    sizeLabel: "783 КБ",
    href: `${U}/oop-noo.docx`,
  },
  {
    slug: "oop-ooo",
    title: "Основная образовательная программа ООО",
    category: "Образование",
    sizeLabel: "158 КБ",
    href: `${U}/oop-ooo.doc`,
  },
  {
    slug: "oop-soo",
    title: "Основная образовательная программа СОО",
    category: "Образование",
    sizeLabel: "1,8 МБ",
    href: `${U}/oop-soo.docx`,
  },
  {
    slug: "uchebnyy-plan-noo-2025-26",
    title: "Учебный план НОО (1–4 классы) на 2025–2026 уч. г.",
    category: "Образование",
    date: "2025",
    sizeLabel: "93 КБ",
    href: `${U}/uchebnyy-plan-noo.docx`,
  },
  {
    slug: "kalendarnyy-grafik-2025-26",
    title: "Календарный учебный график на 2025–2026 уч. г.",
    category: "Образование",
    date: "2025",
    sizeLabel: "45 КБ",
    href: `${U}/kalendarnyy-grafik.docx`,
  },
  {
    slug: "programma-vospitaniya",
    title: "Программа воспитательной работы",
    category: "Образование",
    sizeLabel: "552 КБ",
    href: `${U}/programma-vospitaniya.pdf`,
    sourceUrl: `${S}/netcat_files/178/2913/Programma_vospit.raboty.pdf`,
  },
  {
    slug: "mikrorayony-postanovlenie-2026",
    title: "Постановление о закреплении микрорайонов (2026)",
    category: "Образование",
    date: "2026",
    sizeLabel: "159 КБ",
    href: `${U}/mikrorayony-2026.pdf`,
    sourceUrl: `${S}/netcat_files/userfiles/Postanovlenie_o_zakreplenii_mikrorayonov_-_2026.pdf`,
  },
  {
    slug: "mikrorayony-prilozhenie-2026",
    title: "Приложение: микрорайоны (2026)",
    category: "Образование",
    date: "2026",
    sizeLabel: "1,5 МБ",
    href: `${U}/prilozhenie-mikrorayony-2026.pdf`,
    sourceUrl: `${S}/netcat_files/userfiles/Prilozhenie_Mikrorayony_-_2026.pdf`,
  },
  {
    slug: "anketa-pitanie",
    title: "Анкета для школьников и родителей по питанию",
    category: "Питание",
    sizeLabel: "212 КБ",
    href: `${U}/anketa-pitanie.pdf`,
    sourceUrl: `${S}/netcat_files/49/2830/Anketa_dlya_shkolnikov_i_roditeley_po_pitaniyu_6_.pdf`,
  },
  {
    slug: "buklet-zdorovoe-pitanie",
    title: "Буклет «Здоровое питание»",
    category: "Питание",
    sizeLabel: "1,1 МБ",
    href: `${U}/buklet-zdorovoe-pitanie.pdf`,
    sourceUrl: `${S}/netcat_files/49/2839/Buklet_Zdorovoe_pitanie.pdf`,
  },
  {
    slug: "programma-lagerya-2026",
    title: "Программа лагеря СОШ №37 г. Орска",
    category: "Лагерь",
    date: "2026",
    sizeLabel: "977 КБ",
    href: `${U}/programma-lagerya-2026.doc`,
    sourceUrl: `${S}/netcat_files/178/2913/Programma_lagerya_sayt_2026SOSh_37_kopiya.doc`,
  },
  {
    slug: "pfhd",
    title: "План финансово-хозяйственной деятельности",
    category: "ФХД",
    sizeLabel: "2 МБ",
    href: `${U}/pfhd.pdf`,
    sourceUrl: `${S}/netcat_files/35/347/PFHD.pdf`,
  },
  {
    slug: "dohody-rashody-2024",
    title: "Доходы и расходы за 2024 г.",
    category: "ФХД",
    date: "2024",
    sizeLabel: "12 КБ",
    href: `${U}/dohody-rashody-2024.docx`,
    sourceUrl: `${S}/netcat_files/35/353/Dohody_i_rashody_za_2024.docx`,
  },
  {
    slug: "uchetnaya-politika",
    title: "Учётная политика для целей налогообложения",
    category: "ФХД",
    sizeLabel: "684 КБ",
    href: `${U}/uchetnaya-politika.pdf`,
    sourceUrl: `${S}/netcat_files/35/2945/Uchetnaya_politika_dlya_tseley_nalogooblazheniya.pdf`,
  },
  {
    slug: "sout-zaklyuchenie",
    title: "Заключение эксперта по результатам СОУТ",
    category: "СОУТ",
    sizeLabel: "655 КБ",
    href: `${U}/sout-zaklyuchenie.pdf`,
  },
  {
    slug: "sout-identifikaciya",
    title:
      "Заключение эксперта по результатам идентификации потенциально вредных и опасных производственных факторов",
    category: "СОУТ",
    sizeLabel: "771 КБ",
    href: `${U}/sout-identifikaciya.pdf`,
  },
  {
    slug: "sout-meropriyatiya",
    title: "Перечень рекомендуемых мероприятий по улучшению условий труда",
    category: "СОУТ",
    sizeLabel: "237 КБ",
    href: `${U}/sout-meropriyatiya.pdf`,
  },
];

export const documentCategories: DocumentCategory[] = [
  "Основные",
  "Локальные акты",
  "Образование",
  "Питание",
  "Лагерь",
  "ФХД",
  "СОУТ",
  "Отчёты",
];

export function getDocumentsByCategory(category?: DocumentCategory | "Все") {
  if (!category || category === "Все") return documents;
  return documents.filter((doc) => doc.category === category);
}
