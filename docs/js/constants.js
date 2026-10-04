// Цвет плашки стиля драйвинга (полупрозрачный — одинаково читается в светлой и тёмной теме)
export const DRIVING_STYLES = {
  "Агрессивный": "rgba(255,0,70,.25)",
  "Аккуратный": "rgba(0,175,115,.25)",
  "Защитный": "rgba(50,110,255,.25)",
  "Пассивный": "rgba(130,125,140,.30)",
};

export const TEXT_FIELDS = [
  { key: "auto", label: "Автоном", hint: "Что делает, куда паркуется" },
  { key: "intake", label: "Интейк", hint: "Скорость, надежность захвата" },
  { key: "scoring", label: "Шутер / Скоринг", hint: "Как набирает очки" },
  { key: "endgame", label: "Финал / Эндгейм", hint: "Например, подвес" },
  { key: "notes", label: "Комментарии / Поломки", hint: "Что ещё важно знать" },
];

export const EMPTY_TEAM = { number: "", name: "", style: "Аккуратный", skill: 3, auto: "", intake: "", scoring: "", endgame: "", notes: "" };
