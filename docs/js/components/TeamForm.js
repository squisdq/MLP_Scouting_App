import { html, useState } from "../html.js";
import { db, doc, serverTimestamp, setDoc } from "../firebase.js";
import { DRIVING_STYLES, EMPTY_TEAM, TEXT_FIELDS } from "../constants.js";

export default function TeamForm({ sessionId, initial, existingNumbers, onDone }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState({ ...EMPTY_TEAM, ...(initial ?? {}) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    const number = String(form.number).trim();
    if (!/^\d+$/.test(number)) return setError("Номер команды — только цифры.");
    if (!isEdit && existingNumbers.includes(number)) return setError(`Команда ${number} уже есть в этой сессии.`);

    setSaving(true);
    try {
      // id документа = номер команды → дубликаты невозможны
      const { id, ...data } = form;
      await setDoc(
        doc(db, "sessions", sessionId, "teams", number),
        { ...data, number: Number(number), name: form.name.trim(), updatedAt: serverTimestamp() },
        { merge: true }
      );
      onDone();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return html`
    <form onSubmit=${submit} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label" htmlFor="num">Номер</label>
          <input id="num" required autoFocus=${!isEdit} disabled=${isEdit} inputMode="numeric" pattern="[0-9]*"
                 className="input" placeholder="12345" value=${form.number} onChange=${(e) => set("number", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label" htmlFor="tname">Название команды</label>
          <input id="tname" className="input" value=${form.name} onChange=${(e) => set("name", e.target.value)} />
        </div>
      </div>

      <div>
        <span className="label">Стиль драйвинга</span>
        <div className="grid grid-cols-2 gap-2">
          ${Object.keys(DRIVING_STYLES).map((s) => html`
            <button type="button" key=${s} onClick=${() => set("style", s)} className=${`opt ${form.style === s ? "opt-on" : ""}`}>${s}</button>`)}
        </div>
      </div>

      <div>
        <span className="label">Сила драйвинга: ${form.skill} из 5</span>
        <div className="flex gap-1">
          ${[1, 2, 3, 4, 5].map((n) => html`
            <button type="button" key=${n} onClick=${() => set("skill", n)} aria-label=${`${n} из 5`}
              className=${`text-4xl leading-none ${n <= form.skill ? "star-on" : "star-off"}`}>★</button>`)}
        </div>
      </div>

      ${TEXT_FIELDS.map((f) => html`
        <div key=${f.key}>
          <label className="label" htmlFor=${f.key}>${f.label}</label>
          <textarea id=${f.key} rows="2" className="input" placeholder=${f.hint}
                    value=${form[f.key]} onChange=${(e) => set(f.key, e.target.value)}></textarea>
        </div>`)}

      ${error && html`<p className="err p-3 text-sm">${error}</p>`}

      <button disabled=${saving} className="btn w-full">${saving ? "Сохраняем…" : isEdit ? "Сохранить изменения" : "Добавить команду"}</button>
    </form>`;
}
