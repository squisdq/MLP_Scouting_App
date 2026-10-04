import { html } from "../html.js";
import { DRIVING_STYLES, TEXT_FIELDS } from "../constants.js";

function Stars({ value }) {
  return html`<span className="inline-flex text-xl leading-none" aria-label=${`${value} из 5`}>
    ${[1, 2, 3, 4, 5].map((n) => html`<span key=${n} className=${n <= value ? "star-on" : "star-off"}>★</span>`)}
  </span>`;
}

export default function TeamCard({ team, onEdit, onDelete }) {
  const filled = TEXT_FIELDS.filter((f) => team[f.key]?.trim());

  return html`
    <article className="card flex flex-col p-4">
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="f-title accent text-5xl leading-none">${team.number}</p>
          <h3 className="f-title mt-1 truncate text-xl">${team.name || "без названия"}</h3>
        </div>
        <div className="flex shrink-0 gap-1 text-sm">
          <button onClick=${onEdit} className="ghost-btn">изменить</button>
          <button onClick=${onDelete} className="ghost-btn danger">удалить</button>
        </div>
      </header>

      <div className="inset mt-3 flex items-center justify-between rounded-xl px-3 py-2">
        <span className="chip" style=${{ background: DRIVING_STYLES[team.style] }}>${team.style}</span>
        <${Stars} value=${team.skill} />
      </div>

      ${filled.length > 0 && html`
        <dl className="mt-3 space-y-2.5 text-base">
          ${filled.map((f) => html`
            <div key=${f.key} className=${f.key === "notes" ? "note p-2.5" : ""}>
              <dt className="muted text-sm">${f.label}</dt>
              <dd className="whitespace-pre-wrap">${team[f.key]}</dd>
            </div>`)}
        </dl>`}
    </article>`;
}
