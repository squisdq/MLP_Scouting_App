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

  const date = (s) =>
    s.createdAt?.toDate().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }).replace(" г.", "г.") ?? "сохраняется…";

  return html`
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-14">
      <header className="mb-8">
        <h1 className="f-title text-5xl leading-tight sm:text-6xl">Pony Scouting</h1>
        <p className="mt-2 text-xl">выберите соревнование или создайте новое</p>
        <button onClick=${() => setOpen(true)} className="btn mt-5">Создать новую сессию</button>
      </header>

      ${error && html`<p className="err mb-4 p-3">Ошибка Firebase: ${error}</p>`}

      ${sessions === null
        ? html`<p className="text-lg">загрузка…</p>`
        : sessions.length === 0
        ? html`<p className="card p-8 text-center text-lg">Сессий пока нет. Создайте первую, например «Алматы Региональный 2026».</p>`
        : html`<ul className="grid gap-8 sm:grid-cols-2">
            ${sessions.map((s) => html`
              <li key=${s.id} className="relative">
                <button onClick=${() => onOpen(s.id)} className="card block w-full p-4 pr-24 text-left">
                  <span className="f-title block text-4xl leading-tight">${s.name}</span>
                  <span className="mt-1 block text-lg">${date(s)}</span>
                </button>
                <button onClick=${() => remove(s)} aria-label=${`Удалить сессию ${s.name}`} className="ghost-btn danger absolute right-3 top-3 text-sm">удалить</button>
              </li>`)}
          </ul>`}

      ${open && html`
        <${Modal} title="Новая сессия" onClose=${() => setOpen(false)}>
          <form onSubmit=${create} className="space-y-4">
            <div>
              <label className="label" htmlFor="sname">Название соревнования</label>
              <input id="sname" autoFocus className="input" placeholder="Almighty Regional 2026" value=${name} onChange=${(e) => setName(e.target.value)} />
            </div>
            <button disabled=${saving || !name.trim()} className="btn w-full">${saving ? "Создаём…" : "Создать сессию"}</button>
          </form>
        <//>`}
    </div>`;
}
