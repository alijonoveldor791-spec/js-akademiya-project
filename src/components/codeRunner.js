import runtime from '../services/workerRuntime.js?raw';
const active = new Set();
const safeTags = new Set('div span p h1 h2 h3 h4 button input textarea select option label form ul ol li table tbody thead tr td th strong em b i br hr pre code section article'.split(' '));
const attrs = new Set(['id', 'class', 'type', 'placeholder', 'title', 'name', 'min', 'max', 'step', 'value', 'disabled', 'for']);
const styles = new Set(['color', 'backgroundColor', 'padding', 'margin', 'fontSize', 'fontWeight', 'border', 'borderRadius', 'display', 'gap', 'textAlign', 'width', 'maxWidth']);
export function createExecution({ source, mode = 'run', tests = [], storage = {}, onMessage = () => { }, timeout = 5000 }) {
    const frame = document.createElement('iframe'); frame.hidden = true; frame.setAttribute('sandbox', 'allow-scripts'); frame.title = 'Izolyatsiyalangan kod muhiti';
    const token = crypto.randomUUID(); let timer, alive = true;
    const stop = () => { if (!alive) return; alive = false; clearTimeout(timer); window.removeEventListener('message', listener); frame.remove(); active.delete(stop); };
    const post = message => frame.contentWindow?.postMessage({ token, ...message }, '*');
    const listener = e => {
        if (e.source !== frame.contentWindow || e.data?.token !== token || !alive) return;
        if (e.data.type === 'boot') { post({ type: 'start', source, mode, tests, storage }); return; }
        onMessage(e.data); if (['results', 'error'].includes(e.data.type) && mode === 'check') stop();
    };
    frame.srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src https://jsonplaceholder.typicode.com"><script>
 const token=${JSON.stringify(token)};
 const worker=new Worker(URL.createObjectURL(new Blob([${JSON.stringify(runtime).replace(/</g, '\\u003c')}],{type:'text/javascript'})));
 worker.onmessage=e=>parent.postMessage({token,...e.data},'*');
 worker.onerror=e=>parent.postMessage({token,type:'error',text:e.message},'*');
 onmessage=e=>{if(e.source===parent&&e.data.token===token)worker.postMessage(e.data);};
 parent.postMessage({token,type:'boot'},'*');
 <\/script>`;
    window.addEventListener('message', listener); document.body.append(frame); active.add(stop);
    timer = setTimeout(() => { onMessage({ type: 'timeout', text: `Vaqt chegarasi (${timeout / 1000} soniya) tugadi. Kod to‘xtatildi.` }); stop(); }, timeout);
    return { stop, post };
}
export function stopCode() { for (const stop of [...active]) stop(); }
function renderTree(tree, preview, execution) {
    const focused = document.activeElement, uid = focused?.dataset?.uid, selection = focused?.selectionStart;
    const build = (node, depth = 0) => {
        if (depth > 40) return document.createTextNode('…');
        const element = document.createElement(safeTags.has(node.tag) ? node.tag : 'div'); element.dataset.uid = String(node.uid);
        element.append(document.createTextNode(String(node.text || '').slice(0, 10000)));
        for (const [k, v] of Object.entries(node.attrs || {})) if (attrs.has(k)) { if (k === 'disabled') element.disabled = !!v; else element.setAttribute(k, String(v).slice(0, 300)); }
        for (const [k, v] of Object.entries(node.style || {})) if (styles.has(k) && !String(v).includes('url(')) element.style[k] = String(v);
        if ('value' in element) element.value = node.value || ''; if ('checked' in element) element.checked = !!node.checked;
        for (const child of (node.children || []).slice(0, 400)) element.append(build(child, depth + 1)); return element;
    };
    preview.replaceChildren(...(tree.children || []).slice(0, 400).map(x => build(x)));
    for (const type of ['click', 'input', 'change', 'submit']) preview['on' + type] = e => {
        if (type === 'submit') e.preventDefault(); const target = e.target.closest('[data-uid]'); if (!target) return;
        execution.post({ type: 'event', event: type, uid: Number(target.dataset.uid), value: target.value, checked: target.checked });
    };
    if (uid) { const next = preview.querySelector(`[data-uid="${uid}"]`); next?.focus(); try { next?.setSelectionRange(selection, selection); } catch { } }
}
export function runCode(source, output, preview, onStorage, storage = {}) {
    stopCode(); output.textContent = 'Kod ishga tushirilmoqda…'; preview.replaceChildren(); let lines = 0;
    const execution = createExecution({
        source, storage, timeout: 15000, onMessage: m => {
            if (m.type === 'log' || m.type === 'error') { if (lines++ === 0) output.textContent = ''; output.textContent += (m.type === 'error' ? 'Xato: ' : '') + String(m.text).slice(0, 6000) + '\n'; }
            if (m.type === 'ready' && !lines) output.textContent = 'Kod bajarildi. DOM namunasi bo‘lsa quyida ko‘rinadi.';
            if (m.type === 'tree') renderTree(m.tree, preview, execution);
            if (m.type === 'timeout') output.textContent += '\n' + m.text;
            if (m.type === 'storage') onStorage?.(m.storage);
        }
    }); return execution;
}
