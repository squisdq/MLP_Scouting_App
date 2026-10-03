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
          <label className="field-label" htmlFor="num">Номер</label>
          <input id="num" required autoFocus=${!isEdit} disabled=${isEdit} inputMode="numeric" pattern="[0-9]*"
                 className="field-input disabled:bg-slate-100" placeholder="12345"
                 value=${form.number} onChange=${(e) => set("number", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="field-label" htmlFor="tname">Название команды</label>
          <input id="tname" className="field-input" value=${form.name} onChange=${(e) => set("name", e.target.value)} />
        </div>
      </div>

      <div>
        <span className="field-label">Стиль драйвинга</span>
        <div className="grid grid-cols-2 gap-2">
          ${Object.keys(DRIVING_STYLES).map((s) => html`
            <button type="button" key=${s} onClick=${() => set("style", s)}
              className=${`rounded-lg border px-3 py-2.5 font-medium ${form.style === s ? "border-field bg-field text-white" : "border-slate-300 bg-white"}`}>
              ${s}
            </button>`)}
        </div>
      </div>

      <div>
        <span className="field-label">Сила драйвинга: ${form.skill} из 5</span>
        <div className="flex gap-1">
          ${[1, 2, 3, 4, 5].map((n) => html`
            <button type="button" key=${n} onClick=${() => set("skill", n)} aria-label=${`${n} из 5`}
              className=${`text-4xl leading-none ${n <= form.skill ? "text-tape" : "text-slate-300"}`}>★</button>`)}
        </div>
      </div>

      ${TEXT_FIELDS.map((f) => html`
        <div key=${f.key}>
          <label className="field-label" htmlFor=${f.key}>${f.label}</label>
          <textarea id=${f.key} rows="2" className="field-input" placeholder=${f.hint}
                    value=${form[f.key]} onChange=${(e) => set(f.key, e.target.value)}></textarea>
        </div>`)}

      ${error && html`<p className="rounded-lg bg-red-100 p-3 text-sm text-red-800">${error}</p>`}

      <button disabled=${saving} className="w-full rounded-lg bg-field py-3 font-semibold text-white disabled:opacity-50">
        ${saving ? "Сохраняем…" : isEdit ? "Сохранить изменения" : "Добавить команду"}
      </button>
    </form>`;
}
