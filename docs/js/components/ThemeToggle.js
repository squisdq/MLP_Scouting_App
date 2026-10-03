import { html, useState } from "../html.js";

// Кнопка смены темы; выбор запоминается в браузере. По умолчанию берётся тема системы.
export default function ThemeToggle() {
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
    setDark(next);
  };

  return html`<button onClick=${toggle} aria-label="Сменить тему"
    className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full bg-white text-2xl shadow-lg ring-1 ring-slate-200 dark:bg-slate-700 dark:ring-slate-600">
    ${dark ? "☀️" : "🌙"}
  </button>`;
}
