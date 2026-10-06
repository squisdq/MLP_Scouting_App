// Цвет плашки стиля драйвинга (полупрозрачный — одинаково читается в светлой и тёмной теме)
export const DRIVING_STYLES = {
  "Агрессивный": "rgba(255,0,70,.25)",
  "Аккуратный": "rgba(0,175,115,.25)",
  "Защитный": "rgba(50,110,255,.25)",
  "Пассивный": "rgba(130,125,140,.30)",
};

export const TEXT_FIELDS = [
  { key: "auto", label: "Авто", hint: "Количество типов, парк, стабильность..." },
  { key: "intake", label: "Интейк", hint: "Скорость, тип, количество моторов..." },
  { key: "scoring", label: "Шутер", hint: "Стабильность, скорость, бекспин..." },
  { key: "endgame", label: "Эндгейм", hint: "Флaуэр/шутинг" },
  { key: "notes", label: "Комментарии / Поломки", hint: "Что ещё важно знать" },
];

export const EMPTY_TEAM = { number: "", name: "", style: "Аккуратный", skill: 3, auto: "", intake: "", scoring: "", endgame: "", notes: "" };
