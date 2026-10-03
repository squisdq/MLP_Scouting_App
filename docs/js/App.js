import { html, useState, useEffect } from "./html.js";
import SessionList from "./components/SessionList.js";
import SessionView from "./components/SessionView.js";

// Маршрутизация через hash: "#/s/<id>" — ссылку на сессию можно отправить команде
const readHash = () => window.location.hash.match(/^#\/s\/(.+)$/)?.[1] ?? null;

export default function App() {
  const [sessionId, setSessionId] = useState(readHash);

  useEffect(() => {
    const onChange = () => setSessionId(readHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return sessionId
    ? html`<${SessionView} sessionId=${sessionId} onBack=${() => (window.location.hash = "")} />`
    : html`<${SessionList} onOpen=${(id) => (window.location.hash = `#/s/${id}`)} />`;
}
