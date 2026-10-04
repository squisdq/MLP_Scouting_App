import { html, useState, useEffect, useMemo } from "../html.js";
import { db, collection, doc, deleteDoc, onSnapshot, orderBy, query } from "../firebase.js";
import TeamCard from "./TeamCard.js";
import TeamForm from "./TeamForm.js";
import Modal from "./Modal.js";

export default function SessionView({ sessionId, onBack }) {
  const [session, setSession] = useState(undefined); // undefined = загрузка, null = не найдена
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // null | {} (новая) | объект команды
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubSession = onSnapshot(doc(db, "sessions", sessionId), (d) => setSession(d.exists() ? d.data() : null), (e) => setError(e.message));
    const q = query(collection(db, "sessions", sessionId, "teams"), orderBy("number"));
    const unsubTeams = onSnapshot(q, (snap) => setTeams(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), (e) => setError(e.message));
    return () => { unsubSession(); unsubTeams(); };
  }, [sessionId]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return teams;
    return teams.filter((t) => String(t.number).includes(s) || t.name?.toLowerCase().includes(s));
  }, [teams, search]);

  const remove = (team) => {
    if (window.confirm(`Удалить команду ${team.number}?`)) deleteDoc(doc(db, "sessions", sessionId, "teams", team.id));
  };

  if (session === null) {
    return html`<div className="p-8 text-center">
      <p className="mb-4 text-lg">Сессия не найдена.</p>
      <button onClick=${onBack} className="link text-lg underline">К списку сессий</button>
    </div>`;
  }

  return html`
    <div className="mx-auto max-w-5xl px-5 pb-24">
      <div className="sticky-bar sticky top-0 z-10 -mx-5 mb-6 px-5 pb-3 pt-8">
        <button onClick=${onBack} className="link mb-1 text-lg">← все сессии</button>
        <div className="flex items-center justify-between gap-3">
          <h1 className="f-title text-3xl leading-tight sm:text-5xl">${session?.name ?? "…"}</h1>
          <button onClick=${() => setEditing({})} className="btn btn-sm shrink-0">Добавить команду</button>
        </div>
        <input type="search" inputMode="numeric" placeholder="Поиск по номеру команды" value=${search}
               onChange=${(e) => setSearch(e.target.value)} className="input mt-3" />
      </div>

      ${error && html`<p className="err mb-4 p-3">Ошибка Firebase: ${error}</p>`}

      ${teams.length === 0
        ? html`<p className="card p-8 text-center text-lg">Команд пока нет. Добавьте первую.</p>`
        : filtered.length === 0
        ? html`<p className="p-10 text-center text-lg">Ничего не найдено по запросу «${search}».</p>`
        : html`<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            ${filtered.map((t) => html`<${TeamCard} key=${t.id} team=${t} onEdit=${() => setEditing(t)} onDelete=${() => remove(t)} />`)}
          </div>`}

      ${editing && html`
        <${Modal} title=${editing.id ? `Команда ${editing.number}` : "Новая команда"} onClose=${() => setEditing(null)}>
          <${TeamForm} sessionId=${sessionId} initial=${editing.id ? editing : null}
                       existingNumbers=${teams.map((t) => t.id)} onDone=${() => setEditing(null)} />
        <//>`}
    </div>`;
}
