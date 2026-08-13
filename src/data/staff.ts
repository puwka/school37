export type StaffMember = {
  slug: string;
  name: string;
  role: string;
  subjects?: string[];
  phone?: string;
  email?: string;
  receptionHours?: string;
  education?: string;
  qualification?: string;
  experienceYears?: number;
  professionalExperienceYears?: number;
  development?: string[];
  programs?: string[];
  isLeadership?: boolean;
  /** Локальное фото после переноса с gosweb */
  photoSrc?: string;
};

export const staff: StaffMember[] = [
  {
    slug: "ozherelyeva-elena-gennadevna",
    name: "Ожерельева Елена Геннадьевна",
    role: "Директор школы",
    phone: "+7 (3537) 373-550",
    email: "schkool-370rs.k@yandex.ru",
    receptionHours: "14:00–15:30",
    education: "Высшее педагогическое",
    qualification: "соответствие занимаемой должности, декабрь 2025 г.",
    experienceYears: 35,
    professionalExperienceYears: 32,
    development: [
      "ФГБОУ ВПО «ОГУ», программа «Менеджмент в образовании»",
      "ГАОУ ВО города Москвы «МГПУ», «Принятие управленческих решений на тренажёре „Эффективный руководитель образовательной организации“»",
    ],
    programs: ["ООП НОО", "ООП ООО", "ООП СОО"],
    isLeadership: true,
    photoSrc: "/uploads/staff/person-2.jpg",
  },
  {
    slug: "solovyh-natalya-vitalevna",
    name: "Соловых Наталья Витальевна",
    role: "Заместитель директора · учитель иностранного языка",
    subjects: ["Иностранный язык"],
    phone: "8 (3537) 373-550",
    education: "Высшее профессиональное",
    qualification: "Высшая категория",
    experienceYears: 33,
    development: [
      "«Современные информационно-коммуникационные и цифровые технологии…», 24 ч., Санкт-Петербург, 17.09.2024",
      "«Внедрение Федеральной адаптированной образовательной программы основного общего образования для обучающихся с ОВЗ…», 72 ч., 19.12.2024",
    ],
    programs: ["ООП НОО", "ООП ООО", "ООП СОО"],
    isLeadership: true,
    photoSrc: "/uploads/staff/person-17.jpg",
  },
  {
    slug: "pugacheva-valentina-aleksandrovna",
    name: "Пугачева Валентина Александровна",
    role: "Заместитель директора по АХЧ",
    isLeadership: true,
    photoSrc: "/uploads/staff/person-22.jpg",
  },
  {
    slug: "chernik-oksana-viktorovna",
    name: "Черник Оксана Викторовна",
    role: "Учитель информатики",
    subjects: ["Информатика"],
    photoSrc: "/uploads/staff/person-18.jpg",
  },
  {
    slug: "pavlenko-anna-iosiofna",
    name: "Павленко Анна Иосиофна",
    role: "Учитель изобразительного искусства, труда",
    subjects: ["Изобразительное искусство", "Труд"],
    photoSrc: "/uploads/staff/person-19.jpg",
  },
  {
    slug: "michkidyaeva-nadezhda-vladimirovna",
    name: "Мичкидяева Надежда Владимировна",
    role: "Учитель математики",
    subjects: ["Алгебра", "Математика"],
    photoSrc: "/uploads/staff/person-3.jpg",
  },
  {
    slug: "brysyakina-irina-yurevna",
    name: "Брысякина Ирина Юрьевна",
    role: "Учитель иностранного языка",
    subjects: ["Иностранный язык"],
    photoSrc: "/uploads/staff/person-20.jpg",
  },
  {
    slug: "kurushkina-elena-viktorovna",
    name: "Курушкина Елена Викторовна",
    role: "Учитель русского языка и литературы",
    subjects: ["Русский язык", "Литература"],
    photoSrc: "/uploads/staff/person-4.jpg",
  },
  {
    slug: "lelikova-larisa-anatolevna",
    name: "Леликова Лариса Анатольевна",
    role: "Учитель географии",
    subjects: ["География", "История России. Всеобщая история", "Обществознание"],
    photoSrc: "/uploads/staff/person-21.jpg",
  },
  {
    slug: "safonova-marina-gennadevna",
    name: "Сафонова Марина Геннадьевна",
    role: "Учитель начальной школы",
    subjects: [
      "Русский язык",
      "Литературное чтение",
      "Математика",
      "Изобразительное искусство",
      "Музыка",
      "Труд",
      "Физическая культура",
      "ОДНКНР",
    ],
    photoSrc: "/uploads/staff/person-6.jpg",
  },
  {
    slug: "solovyh-tatyana-pavlovna",
    name: "Соловых Татьяна Павловна",
    role: "Учитель русского языка и литературы",
    subjects: ["Русский язык", "Литература"],
  },
  {
    slug: "statsenkova-natalya-stanislavovna",
    name: "Стаценкова Наталья Станиславовна",
    role: "Учитель физики",
    subjects: ["Физика"],
  },
  {
    slug: "lyuboslavova-irina-anatolevna",
    name: "Любославова Ирина Анатольевна",
    role: "Учитель русского языка и литературы",
    subjects: ["Русский язык", "Литература"],
  },
  {
    slug: "goroshko-elena-aleksandrovna",
    name: "Горошко Елена Александровна",
    role: "Учитель иностранного языка",
    subjects: ["Иностранный язык"],
  },
  {
    slug: "dmitrieva-natalya-nikolaevna",
    name: "Дмитриева Наталья Николаевна",
    role: "Учитель истории и обществознания",
    subjects: ["История", "Обществознание"],
  },
  {
    slug: "zemlyakova-oksana-vasilevna",
    name: "Землякова Оксана Васильевна",
    role: "Учитель физической культуры",
    subjects: ["Физическая культура"],
  },
  {
    slug: "matveychuk-oksana-sergeevna",
    name: "Матвейчук Оксана Сергеевна",
    role: "Учитель физической культуры",
    subjects: ["Физическая культура"],
  },
  {
    slug: "seliverstova-olga-valerevna",
    name: "Селиверстова Ольга Валерьевна",
    role: "Учитель начальной школы",
    subjects: [
      "Русский язык",
      "Литературное чтение",
      "Математика",
      "Изобразительное искусство",
      "Труд",
      "Физическая культура",
    ],
  },
  {
    slug: "makarova-svetlana-nikodimovna",
    name: "Макарова Светлана Никодимовна",
    role: "Учитель начальной школы",
    subjects: [
      "Русский язык",
      "Литературное чтение",
      "Математика",
      "Изобразительное искусство",
      "Музыка",
      "Труд",
      "Физическая культура",
    ],
  },
  {
    slug: "barmotina-anastasiya-sergeevna",
    name: "Бармотина Анастасия Сергеевна",
    role: "Учитель начальной школы",
    subjects: [
      "Русский язык",
      "Литературное чтение",
      "Математика",
      "Труд",
      "Физическая культура",
    ],
  },
  {
    slug: "balabanova-irina-viktorovna",
    name: "Балабанова Ирина Викторовна",
    role: "Учитель начальной школы · классный руководитель 1а",
    subjects: [
      "Русский язык",
      "Литературное чтение",
      "Математика",
      "Изобразительное искусство",
      "Труд",
      "Физическая культура",
    ],
  },
  {
    slug: "bezborodova-elena-viktorovna",
    name: "Безбородова Елена Викторовна",
    role: "Учитель начальной школы",
    subjects: [
      "Русский язык",
      "Литературное чтение",
      "Математика",
      "Изобразительное искусство",
      "Музыка",
      "Труд",
      "Физическая культура",
    ],
  },
  {
    slug: "grechuhina-irina-nikolaevna",
    name: "Гречухина Ирина Николаевна",
    role: "Учитель начальной школы",
    subjects: [
      "Русский язык",
      "Литературное чтение",
      "Математика",
      "Изобразительное искусство",
      "Труд",
      "Физическая культура",
    ],
  },
];

export function getStaffBySlug(slug: string) {
  return staff.find((person) => person.slug === slug);
}

export function getLeadership() {
  return staff.filter((person) => person.isLeadership);
}

export function getTeachers() {
  return staff.filter((person) => !person.isLeadership || person.subjects?.length);
}
