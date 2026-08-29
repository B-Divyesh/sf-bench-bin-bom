import './style.css';
import { AppState, BomLine, Part, Project, allocateBom, makeId, parseBom, parseParts, partsCsv, sampleState } from './domain';
import { download, isDemoMode, loadState, resetDemo, saveState } from './storage';
import { captureLicense, hasLicense, restoreLicense, verifyLicense } from './license';

declare const __BUILD_ID__: string;
const PHOTO_LIMIT = 2 * 1024 * 1024;
const demo = isDemoMode();
const capturedLicense = captureLicense();
let state: AppState = loadState();
let undo: (() => void) | undefined;
let notice = '';
const root = document.querySelector<HTMLDivElement>('#app')!;
const esc = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[character]!));
const active = () => {
  const route = currentRoute();
  const routeId = route.startsWith('build/') ? route.slice(6) : undefined;
  return state.projects.find((project) => project.id === (routeId || state.activeProjectId));
};
const demoBase = demo && location.pathname.startsWith('/demo') ? '/demo' : '';
const demoQuery = demo && !demoBase ? '?demo=1' : '';

type Route = 'inventory' | 'projects' | 'about' | 'privacy' | 'terms' | `build/${string}`;
function routePath(route: Route) {
  const path = route === 'inventory' ? '/' : route === 'projects' ? '/builds' : `/${route}`;
  return `${demoBase}${path}${demoQuery}`;
}
function currentRoute(): Route {
  const legacy = location.hash.slice(1);
  if (legacy) return legacy === 'inventory' ? 'inventory' : legacy as Route;
  let path = location.pathname;
  if (demoBase && path.startsWith(demoBase)) path = path.slice(demoBase.length);
  const segment = path.replace(/^\/+|\/+$/g, '');
  if (!segment) return 'inventory';
  if (segment === 'builds') return 'projects';
  if (segment.startsWith('build/')) return segment as Route;
  if (['about', 'privacy', 'terms'].includes(segment)) return segment as Route;
  return 'inventory';
}
function navigate(route: Route) {
  history.pushState({}, '', routePath(route));
  render(true);
}
function commit(next: AppState, errorTarget?: Element | null) {
  try {
    saveState(next);
    state = next;
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'That change could not be saved. Try again.';
    if (errorTarget) errorTarget.textContent = message;
    else { notice = message; render(); }
    return false;
  }
}
function withProject(project: Project) {
  return { ...state, projects: state.projects.map((item) => item.id === project.id ? project : item) };
}

function modal(title: string, body: string) {
  return `<dialog class="sheet" aria-label="${esc(title)}"><form><header><h2>${esc(title)}</h2><button class="icon" type="button" data-cancel aria-label="Close">×</button></header>${body}</form></dialog>`;
}
function routeLink(route: Route, label: string, extra = '') {
  const selected = currentRoute() === route || (route === 'projects' && currentRoute().startsWith('build/'));
  return `<a href="${routePath(route)}" data-route="${route}" ${selected ? 'aria-current="page"' : ''} ${extra}>${label}</a>`;
}
function appShell(content: string) {
  const banner = demo ? `<aside class="demo-banner" aria-label="Demo mode"><b>Demo — sample data, nothing is saved</b><span>Changes stay separate from your real bench.</span><div><button type="button" data-action="reset-demo">Reset demo</button><button type="button" data-action="start-real">Start for real</button></div></aside>` : '';
  return `<a class="skip" href="#main">Skip to workspace</a>${banner}<header class="top"><a class="brand" href="${routePath('inventory')}" data-route="inventory" aria-label="Bench Bin BOM home"><span class="brand-mark" aria-hidden="true">▣</span><span>Bench Bin <b>BOM</b></span></a><nav aria-label="Product">${routeLink('inventory', `Bench stock <small>${state.parts.length}</small>`)}${routeLink('projects', `Builds <small>${state.projects.length}</small>`)}${routeLink('about', 'About')}</nav><button class="primary compact" data-action="new-project">New build</button></header><main id="main">${content}</main><footer class="app-footer"><p>Compare a project BOM with parts in your drawers.</p><nav aria-label="Legal">${routeLink('privacy', 'Privacy')} ${routeLink('terms', 'Terms')}</nav><p>Built by Param Factory · v0.1.1 · ${__BUILD_ID__}</p></footer><div class="route-status visually-hidden" aria-live="polite"></div><div class="toast" aria-live="polite">${notice ? `${esc(notice)} ${undo ? '<button data-action="undo">Undo</button>' : ''}` : ''}</div>`;
}

function inventory() {
  const rows = state.parts.length ? state.parts.map((part) => `<li class="part-row"><div class="part-photo">${part.photo ? `<img src="${part.photo}" alt="Photo of ${esc(part.name)}">` : '<span aria-hidden="true">●</span>'}</div><div><strong>${esc(part.name)}</strong><span>${esc(part.value || 'No value recorded')}</span></div><div class="number"><b>${part.quantity}</b><span>on hand</span></div><div class="bin">${esc(part.bin || 'Unbinned')}</div><button class="quiet" data-edit-part="${part.id}">Edit</button></li>`).join('') : `<li class="empty"><span aria-hidden="true">▦</span><h2>Your bench is clear</h2><p>Add what is already in the drawers. A build can then show what is missing.</p><div class="action-row"><button class="primary" data-action="new-part">Add first part</button><button class="secondary" data-action="load-sample">Load sample project</button></div></li>`;
  return appShell(`<section class="intro"><div><p class="eyebrow">Drawer stock</p><h1>Check your stock before you start building</h1><p>For makers and homelab builders who want to catch part shortages before a project stalls.</p><div class="action-row"><button class="primary" data-action="new-part">Add a part</button><button class="secondary" data-action="import-parts">Import CSV</button></div></div><aside class="diorama" aria-label="Paper project list beside component drawers"><span class="paper-line">Project list</span><span class="mini-bin b1">10k</span><span class="mini-bin b2">ESP</span><span class="mini-bin b3">M3</span></aside></section><section class="panel stock"><div class="section-heading"><div><p class="eyebrow">Bench stock</p><h2>${state.parts.length} recorded parts</h2></div><button class="quiet" data-action="export-parts" ${state.parts.length ? '' : 'disabled'}>Export CSV</button></div><ul class="parts">${rows}</ul></section>`);
}
function projects() {
  const cards = state.projects.length ? state.projects.map((project) => {
    const statuses = allocateBom(state.parts, project.bom);
    const shortage = statuses.filter((status) => !status.ready).length;
    return `<article class="project-card"><p class="eyebrow">${shortage ? `${shortage} shortage${shortage === 1 ? '' : 's'}` : 'Ready to pull'}</p><h2>${esc(project.name)}</h2><p>${project.bom.length} BOM lines · updated ${new Date(project.updatedAt).toLocaleDateString()}</p><a class="secondary link-button" href="${routePath(`build/${project.id}`)}" data-route="build/${project.id}">Open pull list</a></article>`;
  }).join('') : `<div class="empty"><span aria-hidden="true">☷</span><h2>No builds yet</h2><p>Paste a BOM from your project notes and check it against the bench.</p><button class="primary" data-action="new-project">Start a build</button></div>`;
  return appShell(`<section class="page-heading"><p class="eyebrow">Project cards</p><h1>Your builds</h1><p>Check whether each build can start with the stock you recorded.</p></section><section class="project-grid">${cards}</section>`);
}
function build(project: Project) {
  const statuses = allocateBom(state.parts, project.bom);
  const lines = project.bom.map((line, index) => {
    const result = statuses[index];
    return `<li class="bom-row ${result.ready ? 'ready' : 'short'}"><div class="status-symbol" aria-label="${result.ready ? 'Ready' : 'Short'}">${result.ready ? '✓' : '!'}</div><div><strong>${esc(line.part)}</strong><span>${esc(line.value || 'Value not specified')}${line.note ? ` · ${esc(line.note)}` : ''}</span>${line.substitute ? `<small>Substitute: ${esc(line.substitute)} — review electrical fit yourself.</small>` : ''}</div><div class="number"><b>${line.needed}</b><span>needed</span></div><div class="number"><b>${result.stocked}</b><span>allocated</span></div><div><b>${result.ready ? 'Ready' : `${result.shortage} short`}</b></div><button class="quiet" data-edit-line="${line.id}">Edit</button></li>`;
  }).join('');
  const short = statuses.filter((status) => !status.ready).length;
  return appShell(`<section class="build-head"><div><a class="back" href="${routePath('projects')}" data-route="projects">← All builds</a><p class="eyebrow">Project pull card</p><h1>${esc(project.name)}</h1><p>${esc(project.notes || 'No project note yet.')}</p></div><div class="readiness ${short ? 'short' : 'ready'}"><b>${short ? `${short} line${short === 1 ? '' : 's'} to source` : 'Ready to pull'}</b><span>${short ? 'Review shortages before starting.' : 'Everything is recorded on the bench.'}</span></div></section><section class="pull-actions"><button class="primary" data-action="new-line">Add BOM line</button><button class="secondary" data-action="import-bom">Paste or import BOM</button><button class="secondary" data-action="print">Print pull list</button><button class="quiet" data-action="edit-project">Edit build</button></section><section class="panel bom"><div class="table-labels" aria-hidden="true"><span></span><span>Part</span><span>Need</span><span>Allocated</span><span>Status</span><span></span></div><ul>${lines || '<li class="empty"><h2>No BOM lines</h2><p>Add parts or paste CSV to check this build.</p><button class="primary" data-action="import-bom">Paste BOM</button></li>'}</ul></section><aside class="safety-note"><b>Substitutes need your review.</b> Check ratings, pinouts, and fit before use.</aside>`);
}
function about() {
  return appShell(`<section class="page-heading"><p class="eyebrow">Local desktop tool</p><h1>About Bench Bin BOM</h1><p>Bench Bin BOM stores your inventory and projects on this device.</p></section><section class="panel prose"><h2>Bench Pass costs $12 once</h2><p>The free app records up to 40 stock parts and two builds. Bench Pass removes those limits. CSV export, accessibility, and safety notes stay free.</p><a class="primary link-button" href="https://api.sociobot.in/api/v1/products/bench-bin-bom/checkout">Buy Bench Pass for $12</a><p>${hasLicense() ? 'A verified Bench Pass is active on this device.' : 'Already bought Bench Pass?'} <button class="inline" data-action="restore-license">Paste a license</button></p><p>The app checks a saved license at most once each day when online.</p></section>`);
}
function legal(kind: 'privacy' | 'terms') {
  const privacy = kind === 'privacy';
  return appShell(`<article class="legal"><a class="back" href="${routePath('about')}" data-route="about">← Back to About</a><h1>${privacy ? 'Privacy' : 'Terms'}</h1>${privacy ? '<p>Bench Bin BOM stores parts, photos, projects, and the license token in this app’s device storage. It has no analytics or tracking.</p><p>License verification sends only the saved token to Sociobot. CSV files leave the app only when you export them.</p><h2>Delete local data</h2><p>Clear the app storage or uninstall the app to remove its local record.</p>' : '<p>Bench Bin BOM is a planning tool. It does not guarantee stock counts, component compatibility, or electrical safety.</p><p>Check substitutions, ratings, pinouts, and fit before use. Bench Pass is a $12 one-time license sold by Sociobot and Dodo, the merchant of record. A refund revokes the license.</p>'}</article>`);
}

function render(moveFocus = false) {
  const route = currentRoute();
  const project = route.startsWith('build/') ? state.projects.find((item) => item.id === route.slice(6)) : undefined;
  root.innerHTML = route.startsWith('build/') ? (project ? build(project) : appShell('<section class="empty"><h1>That build is not here</h1><p>It may have been removed from this device.</p><a class="primary link-button" href="/builds" data-route="projects">See builds</a></section>')) : route === 'projects' ? projects() : route === 'about' ? about() : route === 'privacy' || route === 'terms' ? legal(route) : inventory();
  const heading = root.querySelector<HTMLElement>('h1')!;
  const titles: Record<string, string> = { inventory: 'Bench stock — Bench Bin BOM', projects: 'Builds — Bench Bin BOM', about: 'About — Bench Bin BOM', privacy: 'Privacy — Bench Bin BOM', terms: 'Terms — Bench Bin BOM' };
  document.title = route.startsWith('build/') ? `${heading.textContent} — Bench Bin BOM` : titles[route];
  bind();
  if (moveFocus) {
    heading.tabIndex = -1;
    heading.focus();
    const live = root.querySelector<HTMLElement>('.route-status');
    if (live) live.textContent = document.title;
  }
}
function openDialog(html: string) {
  const returnFocus = document.activeElement as HTMLElement | null;
  document.body.insertAdjacentHTML('beforeend', html);
  const dialog = document.body.querySelector<HTMLDialogElement>('dialog:last-of-type')!;
  dialog.querySelectorAll<HTMLElement>('[data-cancel]').forEach((button) => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => { dialog.remove(); returnFocus?.focus(); }, { once: true });
  dialog.showModal();
  return dialog;
}
const canAdd = (kind: 'part' | 'project') => hasLicense() || (kind === 'part' ? state.parts.length < 40 : state.projects.length < 2);

function partDialog(part?: Part) {
  const item = part || { id: makeId(), name:'', value:'', quantity:1, bin:'', note:'' };
  const dialog = openDialog(modal(part ? 'Edit part' : 'Add a part', `<label>Part name<input required name="name" value="${esc(item.name)}" autocomplete="off"></label><div class="form-grid"><label>Value or variant<input name="value" value="${esc(item.value)}"></label><label>Quantity on hand<input required type="number" min="0" step="1" name="quantity" value="${item.quantity}"></label></div><label>Bin location<input name="bin" value="${esc(item.bin)}" placeholder="A2 · top drawer"></label><label>Note<input name="note" value="${esc(item.note)}" placeholder="Package, rating, or condition"></label><label>Photo<input name="photo" type="file" accept="image/*" aria-describedby="photo-help"></label><p id="photo-help" class="help">Stored on this device. Maximum file size: 2 MB.</p><p class="error" aria-live="polite"></p><footer><button class="secondary" type="button" data-cancel>Cancel</button>${part ? '<button class="danger" type="button" data-delete-part>Remove</button>' : ''}<button class="primary" type="submit">Save part</button></footer>`));
  dialog.addEventListener('submit', async (event) => {
    event.preventDefault();
    const error = dialog.querySelector('.error');
    if (!part && !canAdd('part')) { error!.textContent = 'The free bench holds 40 parts. Bench Pass removes this limit.'; return; }
    const form = new FormData(event.target as HTMLFormElement);
    const file = form.get('photo') as File;
    if (file?.size > PHOTO_LIMIT) { error!.textContent = 'That photo is larger than 2 MB. Choose a smaller image.'; return; }
    let photo = item.photo;
    if (file?.size) photo = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('That photo could not be read. Choose another image.'));
      reader.readAsDataURL(file);
    }).catch((problem: Error) => { error!.textContent = problem.message; return undefined; });
    if (file?.size && !photo) return;
    const nextPart: Part = { ...item, name:String(form.get('name')).trim(), value:String(form.get('value')).trim(), quantity:Number(form.get('quantity')), bin:String(form.get('bin')).trim(), note:String(form.get('note')).trim(), photo };
    const next = { ...state, parts: part ? state.parts.map((current) => current.id === item.id ? nextPart : current) : [...state.parts, nextPart] };
    if (commit(next, error)) { dialog.close(); render(); }
  });
  dialog.querySelector('[data-delete-part]')?.addEventListener('click', () => {
    const next = { ...state, parts: state.parts.filter((current) => current.id !== item.id) };
    if (!commit(next, dialog.querySelector('.error'))) return;
    notice = `${item.name} removed.`;
    undo = () => { commit({ ...state, parts: [...state.parts, item] }); };
    dialog.close(); render();
  });
}
function projectDialog(project?: Project) {
  const item = project || { id: makeId(), name:'', notes:'', bom:[], updatedAt:new Date().toISOString() };
  const dialog = openDialog(modal(project ? 'Edit build' : 'Start a build', `<label>Build name<input required name="name" value="${esc(item.name)}" placeholder="Garage sensor"></label><label>Build note<textarea name="notes" rows="3" placeholder="What is this for?">${esc(item.notes)}</textarea></label><p class="error" aria-live="polite"></p><footer><button class="secondary" type="button" data-cancel>Cancel</button><button class="primary" type="submit">${project ? 'Save build' : 'Create pull card'}</button></footer>`));
  dialog.addEventListener('submit', (event) => {
    event.preventDefault();
    const error = dialog.querySelector('.error');
    if (!project && !canAdd('project')) { error!.textContent = 'The free bench includes two builds. Bench Pass removes this limit.'; return; }
    const form = new FormData(event.target as HTMLFormElement);
    const nextProject = { ...item, name:String(form.get('name')).trim(), notes:String(form.get('notes')).trim(), updatedAt:new Date().toISOString() };
    const next = { ...state, projects: project ? state.projects.map((current) => current.id === item.id ? nextProject : current) : [...state.projects, nextProject], activeProjectId: nextProject.id };
    if (commit(next, error)) { dialog.close(); navigate(`build/${nextProject.id}`); }
  });
}
function bomDialog(line?: BomLine) {
  const project = active();
  if (!project) return;
  const item = line || { id:makeId(), part:'', value:'', needed:1, substitute:'', note:'' };
  const dialog = openDialog(modal(line ? 'Edit BOM line' : 'Add BOM line', `<label>Part name<input required name="part" value="${esc(item.part)}"></label><div class="form-grid"><label>Value or variant<input name="value" value="${esc(item.value)}"></label><label>Quantity needed<input required min="1" step="1" type="number" name="needed" value="${item.needed}"></label></div><label>Substitute note<input name="substitute" value="${esc(item.substitute)}" placeholder="Optional — verify fit"></label><label>Build note<input name="note" value="${esc(item.note)}"></label><p class="error" aria-live="polite"></p><footer><button class="secondary" type="button" data-cancel>Cancel</button>${line ? '<button class="danger" type="button" data-delete-line>Remove</button>' : ''}<button class="primary" type="submit">Save line</button></footer>`));
  dialog.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.target as HTMLFormElement);
    const nextLine: BomLine = { id:item.id, part:String(form.get('part')).trim(), value:String(form.get('value')).trim(), needed:Number(form.get('needed')), substitute:String(form.get('substitute')).trim(), note:String(form.get('note')).trim() };
    const nextProject = { ...project, bom: line ? project.bom.map((current) => current.id === item.id ? nextLine : current) : [...project.bom, nextLine], updatedAt:new Date().toISOString() };
    if (commit(withProject(nextProject), dialog.querySelector('.error'))) { dialog.close(); render(); }
  });
  dialog.querySelector('[data-delete-line]')?.addEventListener('click', () => {
    const nextProject = { ...project, bom: project.bom.filter((current) => current.id !== item.id), updatedAt:new Date().toISOString() };
    if (commit(withProject(nextProject), dialog.querySelector('.error'))) { dialog.close(); render(); }
  });
}
function importDialog(kind: 'parts' | 'bom') {
  const dialog = openDialog(modal(kind === 'bom' ? 'Paste a BOM' : 'Import bench CSV', `<p>Use CSV columns: ${kind === 'bom' ? 'part, value, quantity, substitute, note.' : 'name, value, quantity, bin, note.'}</p><label>CSV<textarea required name="csv" rows="9" placeholder="part,value,quantity&#10;10k resistor,1/4W,8"></textarea></label><p class="error" aria-live="polite"></p><footer><button class="secondary" type="button" data-cancel>Cancel</button><button class="primary" type="submit">Import rows</button></footer>`));
  dialog.addEventListener('submit', (event) => {
    event.preventDefault();
    const error = dialog.querySelector('.error');
    const raw = String(new FormData(event.target as HTMLFormElement).get('csv'));
    try {
      let next: AppState;
      if (kind === 'bom') {
        const project = active();
        if (!project) throw new Error('Open a build first.');
        const rows = parseBom(raw).map((row) => ({ ...row, id:makeId() }));
        next = withProject({ ...project, bom:[...project.bom, ...rows], updatedAt:new Date().toISOString() });
      } else {
        const rows = parseParts(raw).map((row) => ({ ...row, id:makeId() }));
        if (!hasLicense() && state.parts.length + rows.length > 40) throw new Error('This import exceeds the free 40-part limit. Bench Pass removes the limit.');
        next = { ...state, parts:[...state.parts, ...rows] };
      }
      if (commit(next, error)) { dialog.close(); render(); }
    } catch (problem) {
      error!.textContent = problem instanceof Error ? problem.message : 'Could not import those rows.';
    }
  });
}

function bind() {
  root.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); navigate(link.dataset.route as Route); }));
  root.querySelector('[data-action="new-part"]')?.addEventListener('click', () => partDialog());
  root.querySelector('[data-action="new-project"]')?.addEventListener('click', () => projectDialog());
  root.querySelector('[data-action="import-parts"]')?.addEventListener('click', () => importDialog('parts'));
  root.querySelector('[data-action="import-bom"]')?.addEventListener('click', () => importDialog('bom'));
  root.querySelector('[data-action="new-line"]')?.addEventListener('click', () => bomDialog());
  root.querySelector('[data-action="edit-project"]')?.addEventListener('click', () => { const project = active(); if (project) projectDialog(project); });
  root.querySelector('[data-action="export-parts"]')?.addEventListener('click', () => { download('bench-bin-parts.csv', partsCsv(state.parts)); notice = 'Bench CSV exported.'; render(); });
  root.querySelector('[data-action="print"]')?.addEventListener('click', () => window.print());
  root.querySelector('[data-action="undo"]')?.addEventListener('click', () => { undo?.(); undo = undefined; notice = 'Part restored.'; render(); });
  root.querySelector('[data-action="load-sample"]')?.addEventListener('click', () => {
    if (location.protocol.startsWith('http')) location.assign('/demo/');
    else location.assign('/?demo=1');
  });
  root.querySelector('[data-action="reset-demo"]')?.addEventListener('click', () => { state = resetDemo(); notice = 'Demo reset to the original sample.'; render(); });
  root.querySelector('[data-action="start-real"]')?.addEventListener('click', () => {
    if (location.protocol.startsWith('http')) location.assign('/');
    else location.assign('/');
  });
  root.querySelector('[data-action="restore-license"]')?.addEventListener('click', () => {
    const dialog = openDialog(modal('Paste a Bench Pass license', '<label>License token<input required name="license" autocomplete="off"></label><p class="error" aria-live="polite"></p><footer><button class="secondary" type="button" data-cancel>Cancel</button><button class="primary" type="submit">Verify license</button></footer>'));
    dialog.addEventListener('submit', async (event) => {
      event.preventDefault();
      const token = String(new FormData(event.target as HTMLFormElement).get('license'));
      restoreLicense(token);
      const valid = await verifyLicense();
      if (valid) { dialog.close(); notice = 'Bench Pass verified.'; render(); }
      else dialog.querySelector('.error')!.textContent = 'That license could not be verified. Check the token and try again.';
    });
  });
  root.querySelectorAll<HTMLElement>('[data-edit-part]').forEach((button) => button.addEventListener('click', () => partDialog(state.parts.find((part) => part.id === button.dataset.editPart))));
  root.querySelectorAll<HTMLElement>('[data-edit-line]').forEach((button) => button.addEventListener('click', () => { const project = active(); const line = project?.bom.find((item) => item.id === button.dataset.editLine); if (line) bomDialog(line); }));
}

window.addEventListener('popstate', () => render(true));
window.addEventListener('online', () => { notice = 'Back online. Your bench data stayed on this device.'; render(); });
window.addEventListener('offline', () => { notice = 'Offline. The desktop app keeps working with local data.'; render(); });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
verifyLicense().then((valid) => {
  if (capturedLicense) notice = valid ? 'Bench Pass verified.' : 'That license could not be verified. Free limits still apply.';
  render();
});
if (location.hash) {
  const legacy = currentRoute();
  history.replaceState({}, '', routePath(legacy));
}
render();
