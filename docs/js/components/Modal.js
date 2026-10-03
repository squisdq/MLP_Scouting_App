import { html, useEffect } from "../html.js";

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return html`
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 sm:items-center sm:p-4"
         onMouseDown=${(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-2xl bg-white dark:bg-slate-800 shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-5 py-4">
          <h2 className="font-score text-2xl font-semibold">${title}</h2>
          <button onClick=${onClose} aria-label="Закрыть" className="rounded-lg p-1 text-2xl leading-none text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">×</button>
        </div>
        <div className="overflow-y-auto p-5">${children}</div>
      </div>
    </div>`;
}
