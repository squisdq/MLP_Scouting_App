export const DRIVING_STYLES = {
  "Агрессивный": "bg-red-100 text-red-800",
  "Аккуратный": "bg-emerald-100 text-emerald-800",
  "Защитный": "bg-blue-100 text-blue-800",
  "Пассивный": "bg-slate-200 text-slate-700",
};

export const TEXT_FIELDS = [
  { key: "auto", label: "Авто", hint: "Количество типов, парк..." },
  { key: "intake", label: "Интейк", hint: "Скорость, площадь..." },
  { key: "scoring", label: "Шутер", hint: "Стабильность, рапидшут, гейм элементы..." },
  { key: "endgame", label: "Эндгейм", hint: "Шутинг/Флауэр..." },
  { key: "notes", label: "Комментарии / Поломки", hint: "Что ещё важно знать..." },
];

export const EMPTY_TEAM = { number: "", name: "", style: "Аккуратный", skill: 3, auto: "", intake: "", scoring: "", endgame: "", notes: "" };
