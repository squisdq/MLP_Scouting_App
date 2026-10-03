import { html, useState, useEffect } from "../html.js";
import { db, addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, writeBatch } from "../firebase.js";
import Modal from "./Modal.js";

export default function SessionList({ onOpen }) {
  const [sessions, setSessions] = useState(null); // null = загрузка
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query(collection(db, "sessions"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => setSessions(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), (e) => setError(e.message));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const ref = await addDoc(collection(db, "sessions"), { name: name.trim(), createdAt: serverTimestamp() });
      setOpen(false);
      setName("");
      onOpen(ref.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Удаляем сессию вместе со всеми командами внутри (подколлекция сама не удаляется)
  const remove = async (s) => {
    if (!window.confirm(`Удалить сессию «${s.name}» вместе со всеми командами? Это нельзя отменить.`)) return;
    try {
      const teams = await getDocs(collection(db, "sessions", s.id, "teams"));
      const batch = writeBatch(db);
      teams.forEach((t) => batch.delete(t.ref));
      batch.delete(doc(db, "sessions", s.id));
      await batch.commit();
    } catch (err) {
      setError(err.message);
    }
  };

  const date = (s) => s.createdAt?.toDate().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) ?? "Сохраняется…";

  return html`
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-score text-4xl font-bold sm:text-5xl">Pony Scouting</h1>
          <p className="text-slate-600 dark:text-slate-300">Выберите соревнование или создайте новое</p>
        </div>
        <button onClick=${() => setOpen(true)} className="rounded-lg bg-field px-5 py-3 font-semibold text-white shadow hover:bg-blue-800 active:scale-[.98]">
          Создать новую сессию
        </button>
      </header>

      ${error && html`<p className="mb-4 rounded-lg bg-red-100 dark:bg-red-900/40 p-3 text-red-800 dark:text-red-200">Ошибка Firebase: ${error}</p>`}

      ${sessions === null
        ? html`<p className="text-slate-500 dark:text-slate-400">Загрузка…</p>`
        : sessions.length === 0
        ? html`<p className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-10 text-center text-slate-500 dark:text-slate-400">Сессий пока нет. Создайте первую, например «Almaty Regional 2026».</p>`
        : html`<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            ${sessions.map((s) => html`
              <li key=${s.id} className="relative">
                <button onClick=${() => onOpen(s.id)} className="group h-full w-full rounded-xl border-l-8 border-field bg-white dark:bg-slate-800 p-5 pr-24 text-left shadow-sm transition hover:shadow-md">
                  <span className="block font-score text-2xl font-semibold group-hover:text-field dark:group-hover:text-blue-400">${s.name}</span>
                  <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">${date(s)}</span>
                </button>
                <button onClick=${() => remove(s)} aria-label=${`Удалить сессию ${s.name}`}
                  className="absolute right-3 top-3 rounded-md px-2 py-1 text-sm font-medium text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600">Удалить</button>
              </li>`)}
          </ul>`}

      ${open && html`
        <${Modal} title="Новая сессия" onClose=${() => setOpen(false)}>
          <form onSubmit=${create} className="space-y-4">
            <div>
              <label className="field-label" htmlFor="sname">Название соревнования</label>
              <input id="sname" autoFocus className="field-input" placeholder="Almaty Regional 2026" value=${name} onChange=${(e) => setName(e.target.value)} />
            </div>
            <button disabled=${saving || !name.trim()} className="w-full rounded-lg bg-field py-3 font-semibold text-white disabled:opacity-50">
              ${saving ? "Создаём…" : "Создать сессию"}
            </button>
          </form>
        <//>`}
    </div>`;
}
