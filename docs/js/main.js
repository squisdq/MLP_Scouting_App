import { html, createRoot } from "./html.js";
import App from "./App.js";

createRoot(document.getElementById("root")).render(html`<${App} />`);
