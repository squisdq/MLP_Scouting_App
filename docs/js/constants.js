export const DRIVING_STYLES = {
  "Агрессивный": "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200",
  "Аккуратный": "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200",
  "Защитный": "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200",
  "Пассивный": "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200",
};

export const TEXT_FIELDS = [
  { key: "auto", label: "Автоном", hint: "Что делает, куда паркуется" },
  { key: "intake", label: "Интейк", hint: "Скорость, надежность захвата" },
  { key: "scoring", label: "Шутер / Скоринг", hint: "Как набирает очки" },
  { key: "endgame", label: "Финал / Эндгейм", hint: "Например, подвес" },
  { key: "notes", label: "Комментарии / Поломки", hint: "Что ещё важно знать" },
];

export const EMPTY_TEAM = { number: "", name: "", style: "Аккуратный", skill: 3, auto: "", intake: "", scoring: "", endgame: "", notes: "" };
