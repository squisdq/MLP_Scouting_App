import { html } from "../html.js";
import { DRIVING_STYLES, TEXT_FIELDS } from "../constants.js";

function Stars({ value }) {
  return html`<span className="inline-flex text-xl leading-none" aria-label=${`${value} из 5`}>
    ${[1, 2, 3, 4, 5].map((n) => html`<span key=${n} className=${n <= value ? "text-tape" : "text-slate-300 dark:text-slate-600"}>★</span>`)}
  </span>`;
}

export default function TeamCard({ team, onEdit, onDelete }) {
  const filled = TEXT_FIELDS.filter((f) => team[f.key]?.trim());

  return html`
    <article className="flex flex-col rounded-xl border-t-4 border-field bg-white dark:bg-slate-800 p-4 shadow-sm">
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-score text-5xl font-bold leading-none text-field dark:text-blue-400">${team.number}</p>
          <h3 className="mt-1 truncate text-lg font-semibold">${team.name || "Без названия"}</h3>
        </div>
        <div className="flex shrink-0 gap-1 text-sm">
          <button onClick=${onEdit} className="rounded-md px-2 py-1 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Изменить</button>
          <button onClick=${onDelete} className="rounded-md px-2 py-1 font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30">Удалить</button>
        </div>
      </header>

      <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-700/50 px-3 py-2">
        <span className=${`rounded-full px-3 py-1 text-sm font-semibold ${DRIVING_STYLES[team.style] ?? "bg-slate-200 dark:bg-slate-600"}`}>${team.style}</span>
        <${Stars} value=${team.skill} />
      </div>

      ${filled.length > 0 && html`
        <dl className="mt-3 space-y-2.5 text-[15px]">
          ${filled.map((f) => html`
            <div key=${f.key} className=${f.key === "notes" ? "rounded-lg bg-amber-50 dark:bg-amber-900/30 p-2.5" : ""}>
              <dt className="text-sm font-semibold text-slate-500 dark:text-slate-400">${f.label}</dt>
              <dd className="whitespace-pre-wrap">${team[f.key]}</dd>
            </div>`)}
        </dl>`}
    </article>`;
}
