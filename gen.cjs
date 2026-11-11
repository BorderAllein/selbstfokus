// Selbstfokus: statischer Generator. Aufruf: node gen.cjs
// Artikel mit publishedAt in der Zukunft werden nicht erzeugt (Veröffentlichung per Workflow Mo/Mi/Fr 9 Uhr).
const fs = require('fs'), path = require('path');
const ROOT = __dirname;
const SITE = 'https://selbstfokus.de';
const NAME = 'Selbstfokus';
const CLAIM = 'Verstehe Dich. Entwickle Dich. Führe Dich.';
const DESC = 'Selbstfokus ist ein redaktionell unabhängiges Informations- und Entwicklungsportal für Selbstführung und Persönlichkeitsentwicklung. Herausgeber: BA Entertainment.';
const STAND = new Date().toISOString().slice(0, 10);
const TODAY = process.env.BUILD_DATE || STAND;

const { PILLARS, AUTHORS, NETWORK } = require('./content/meta.cjs');
const SRC = require('./content/sources.cjs');
let ALL = [];
for (const f of fs.readdirSync(path.join(ROOT, 'content')).filter(f => /^articles.*\.cjs$/.test(f)).sort()) ALL = ALL.concat(require('./content/' + f));
const ARTICLES = ALL.filter(a => !a.publishedAt || a.publishedAt <= TODAY).sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || '') || a.slug.localeCompare(b.slug));
const BY = Object.fromEntries(ARTICLES.map(a => [a.slug, a]));
const GLOSS = require('./content/glossar.cjs');
const NET = require('./content/netzwerk.cjs');
const SOCIAL = [['Instagram', 'https://www.instagram.com/cogether_official'], ['TikTok', 'https://www.tiktok.com/@borderallein_official'], ['YouTube', 'https://www.youtube.com/@cogether'], ['LinkedIn', 'https://de.linkedin.com/in/cogether']];
const NLBOX = `<section class="nl wrap-narrow" aria-label="CoGether-Newsletter"><h2>Der CoGether-Newsletter</h2><p class="small">Impulse und neue Beiträge per E-Mail. Das Formular wird von cogether.de geladen (Double-Opt-in, jederzeit abbestellbar).</p><iframe id="nlf" title="CoGether-Newsletter anmelden" src="https://cogether.de/newsletter-embed/selbstfokus/" loading="lazy" height="330" style="width:100%;border:0"></iframe><script>window.addEventListener('message',function(e){if(e.origin==='https://cogether.de'&&e.data&&e.data.cgnl){var f=document.getElementById('nlf');if(f)f.style.height=(e.data.h+8)+'px'}});</script></section>`;

// ---------- Hilfen ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fixAmp = s => s.replace(/&(?!#?\w+;)/g, '&amp;');
const dfmt = d => { const [y, m, t] = d.split('-'); return `${+t}. ${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][+m - 1]} ${y}`; };
const wc = a => Math.max(3, Math.round(JSON.stringify([a.kurz, a.body, a.faq]).replace(/<[^>]*>/g, ' ').split(/\s+/).length / 200));
function md(s, a) {
  s = fixAmp(s);
  s = s.replace(/\{\{a:([a-z0-9-]+)\|([^}]+)\}\}/g, (_, sl, t) => BY[sl] ? `<a href="/artikel/${sl}/">${t}</a>` : t);
  if (a) s = s.replace(/\{(\d+(?:,\d+)*)\}/g, (_, n) => '<sup class="q">' + n.split(',').map(i => `<a href="#q${i}" aria-label="Quelle ${i}">${i}</a>`).join(',') + '</sup>');
  return s;
}
const write = (rel, content) => { const p = path.join(ROOT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, content); };
const pil = id => PILLARS.find(p => p.id === id);

// ---------- Layout ----------
const LOGO = '<svg class="logo" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="16" cy="16" r="7" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".55"/><circle cx="16" cy="16" r="3" fill="var(--amber)"/></svg>';
function layout({ title, description, path: p, body, type = 'website', jsonld = [], noindex = false, active = '', nl = false }) {
  const url = SITE + p;
  const full = title.includes(NAME) ? title : `${title} | ${NAME}`;
  const nav = [['/thema/selbstfuehrung/', 'Selbstführung', 'selbstfuehrung'], ['/thema/selbstwert/', 'Selbstwert', 'selbstwert'], ['/thema/emotionale-kompetenz/', 'Emotionen', 'emotionale-kompetenz'], ['/thema/persoenlichkeitsentwicklung/', 'Persönlichkeit', 'persoenlichkeitsentwicklung'], ['/thema/beziehungen-kommunikation/', 'Beziehungen', 'beziehungen-kommunikation']];
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
${noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${NAME}">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="de_DE">
<meta property="og:image" content="${SITE}/assets/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1f4d3a">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/source-serif-4-400-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/fraunces-600-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts.css">
<link rel="stylesheet" href="/assets/site.css?v=${STAND}">
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body>
<a class="skip" href="#main">Zum Inhalt springen</a>
<div class="notice">Informationsangebot. Keine Diagnose, keine Therapie, keine ärztliche Beratung. In einer Krise: Telefonseelsorge kostenlos <a href="tel:116123">116 123</a>, Notruf <a href="tel:112">112</a>.</div>
<header class="top">
 <div class="wrap top-in">
  <a class="brand" href="/" aria-label="${NAME}, Startseite">${LOGO}<span>${NAME}</span></a>
  <nav class="nav" aria-label="Hauptnavigation" id="nav">
   ${nav.map(([h, t, id]) => `<a href="${h}"${active === id ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
   <a href="/suche/" class="nav-search"${active === 'suche' ? ' aria-current="page"' : ''}>Suche</a>
  </nav>
  <button class="burger" aria-expanded="false" aria-controls="nav" aria-label="Menü öffnen"><span></span><span></span></button>
 </div>
</header>
<main id="main">
${body}
</main>
${nl ? NLBOX : ''}
<footer class="foot">
 <div class="wrap foot-grid">
  <div class="foot-brand"><a class="brand" href="/">${LOGO}<span>${NAME}</span></a><p>${CLAIM}</p><p class="small">Redaktionell unabhängiges Informations- und Entwicklungsportal für Selbstführung und Persönlichkeitsentwicklung. Herausgeber: BA Entertainment.</p></div>
  <div><h2>Themen</h2><ul>${PILLARS.map(p => `<li><a href="/thema/${p.id}/">${p.name}</a></li>`).join('')}</ul></div>
  <div><h2>Magazin</h2><ul><li><a href="/redaktion/">Redaktion und Quellen</a></li><li><a href="/autoren/">Autor:innen</a></li><li><a href="/glossar/">Glossar</a></li><li><a href="/suche/">Suche</a></li><li><a href="/kontakt/">Kontakt</a></li><li><a href="/netzwerk/">Netzwerk</a></li></ul><h2 class="mt">Rechtliches</h2><ul><li><a href="/impressum/">Impressum</a></li><li><a href="/datenschutz/">Datenschutz</a></li></ul></div>
  <div><h2>Die CoGether-Welt</h2><ul>${NETWORK.map(n => `<li><a href="${n.url}" rel="noopener">${n.name}</a></li>`).join('')}</ul></div>
 </div>
 <div class="wrap foot-note"><p><strong>Wichtig:</strong> Die Inhalte dienen der Information. Sie ersetzen keine Diagnose, keine ärztliche und keine psychotherapeutische Behandlung. Bei akuter Krise erreichst Du die Telefonseelsorge kostenlos unter <a href="tel:116123">116 123</a>, im Notfall den Notruf <a href="tel:112">112</a>.</p><p class="follow"><strong>Folge uns:</strong> ${SOCIAL.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join(' · ')}</p><p class="small">© ${new Date().getFullYear()} BA Entertainment · ${NAME} · Stand: ${dfmt(STAND)}</p></div>
</footer>
<script src="/assets/site.js?v=${STAND}" defer></script>
</body>
</html>`;
}
const crumbs = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE + u })) });
const crumbHtml = items => `<nav class="crumbs" aria-label="Brotkrumen">${items.map(([n, u], i) => i < items.length - 1 ? `<a href="${u}">${esc(n)}</a>` : `<span>${esc(n)}</span>`).join(' / ')}</nav>`;
const cardHtml = a => `<article class="card"><p class="kicker"><a href="/thema/${a.pillar}/">${pil(a.pillar).name}</a> · ${a.sub}</p><h3><a href="/artikel/${a.slug}/">${esc(a.title)}</a></h3><p>${esc(a.description)}</p><p class="meta">${AUTHORS[a.author].name} · ${wc(a)} Min. Lesezeit · ${dfmt(a.publishedAt)}</p></article>`;
const orgLd = { '@type': 'Organization', '@id': SITE + '/#org', name: 'BA Entertainment', url: SITE + '/', address: { '@type': 'PostalAddress', streetAddress: 'Alleestraße 15', postalCode: '42781', addressLocality: 'Haan', addressCountry: 'DE' }, email: 'info@cogether.de' };

// ---------- Artikel ----------
function articlePage(a) {
  const au = AUTHORS[a.author], pl = pil(a.pillar);
  const srcs = a.sources.map(k => { if (!SRC[k]) throw new Error('Quelle fehlt: ' + k + ' in ' + a.slug); return SRC[k]; });
  const toc = a.body.filter(b => b.h).map((b, i) => ({ id: 'h' + (i + 1), t: b.h }));
  let hi = 0;
  const body = a.body.map(b => {
    if (typeof b === 'string') return `<p>${md(b, a)}</p>`;
    if (b.h) return `<h2 id="h${++hi}">${md(b.h)}</h2>`;
    if (b.h3) return `<h3>${md(b.h3)}</h3>`;
    if (b.ul) return `<ul>${b.ul.map(x => `<li>${md(x, a)}</li>`).join('')}</ul>`;
    if (b.ol) return `<ol>${b.ol.map(x => `<li>${md(x, a)}</li>`).join('')}</ol>`;
    if (b.box) return `<aside class="box"><p>${md(b.box, a)}</p></aside>`;
    if (b.think) return `<aside class="think"><h3>${esc(b.title || 'Zum Nachdenken')}</h3><ul>${b.think.map(x => `<li>${md(x, a)}</li>`).join('')}</ul></aside>`;
    return '';
  }).join('\n');
  const rel = (a.related || []).map(s => BY[s]).filter(Boolean).slice(0, 3);
  const more = rel.length ? rel : ARTICLES.filter(x => x.pillar === a.pillar && x.slug !== a.slug).slice(0, 3);
  const cta = `/${'coach-' + a.author}/`;
  const ctaUrl = `${au.url}?utm_source=selbstfokus&utm_medium=artikel&utm_campaign=${a.slug}`;
  const crumb = [['Start', '/'], [pl.name, `/thema/${pl.id}/`], [a.title, `/artikel/${a.slug}/`]];
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description, datePublished: a.publishedAt, dateModified: a.updatedAt || a.publishedAt, inLanguage: 'de-DE', mainEntityOfPage: SITE + '/artikel/' + a.slug + '/', image: SITE + '/assets/og.png', author: { '@type': 'Person', name: au.name, jobTitle: au.role, url: au.url }, publisher: { ...orgLd, logo: { '@type': 'ImageObject', url: SITE + '/favicon.svg' } }, articleSection: pl.name, keywords: (a.keywords || []).join(', '), citation: srcs.map(s => s.u) },
    crumbs(crumb)
  ];
  if (a.faq && a.faq.length) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: a.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/\{\d+(?:,\d+)*\}/g, '').replace(/<[^>]*>/g, '') } })) });
  const nets = (NET[a.slug] || { links: [] });
  const html0 = `<article class="article wrap-narrow">
${crumbHtml(crumb)}
<header class="a-head">
 <p class="kicker"><a href="/thema/${pl.id}/">${pl.name}</a> · ${a.sub}</p>
 <h1>${esc(a.title)}</h1>
 <p class="lede">${md(a.description)}</p>
 <p class="meta">Von <a href="/autoren/#${a.author}">${au.name}</a> · ${wc(a)} Min. Lesezeit · Stand: ${dfmt(a.updatedAt || a.publishedAt)}</p>
</header>
<section class="kurz" aria-labelledby="kurz-h"><h2 id="kurz-h">Kurz gesagt</h2><ul>${a.kurz.map(k => `<li>${md(k, a)}</li>`).join('')}</ul></section>
${toc.length > 2 ? `<nav class="toc" aria-label="Inhalt"><h2>Inhalt</h2><ol>${toc.map(t => `<li><a href="#${t.id}">${md(t.t)}</a></li>`).join('')}</ol></nav>` : ''}
<div class="prose">
${body}
</div>
${a.faq && a.faq.length ? `<section class="faq"><h2>Häufige Fragen</h2>${a.faq.map(f => `<details><summary>${md(f.q)}</summary><p>${md(f.a, a)}</p></details>`).join('')}</section>` : ''}
<aside class="help"><h2>Wenn es Dich gerade stark belastet</h2><p>Dieser Text ist Information, keine Diagnose und keine Behandlung. Wenn Du Dich in einer akuten Krise befindest oder an Suizid denkst: Telefonseelsorge kostenlos unter <a href="tel:116123">116 123</a> (rund um die Uhr), im Notfall der Notruf <a href="tel:112">112</a>.</p></aside>
<section class="sources" id="quellen"><h2>Quellen</h2><ol>${srcs.map((s, i) => `<li id="q${i + 1}">${fixAmp(esc(s.t)).replace(/&amp;amp;/g, '&amp;')} <a href="${esc(s.u)}" rel="noopener nofollow">${esc(s.u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').slice(0, 70))}</a>${s.n ? ` <span class="sn">${esc(s.n)}</span>` : ''}</li>`).join('')}</ol><p class="small">Wie wir Quellen auswählen: <a href="/redaktion/">Redaktion und Quellen</a>. Fehler gefunden? <a href="mailto:info@cogether.de?subject=Korrektur%20${encodeURIComponent(a.slug)}">Schreib uns</a>.</p></section>
<section class="authorbox" id="autor"><div class="av" aria-hidden="true">${au.name[0]}</div><div><p class="kicker">Autor:in</p><h2>${au.name}</h2><p class="role">${au.role}</p><p>${au.blurb}</p><p><a href="${esc(au.url)}" rel="noopener">${au.name} bei CoGether kennenlernen</a></p></div></section>
<aside class="cta"><h2>Mit jemandem darüber sprechen</h2><p>${au.cta} Coaching ist keine Therapie und ersetzt keine ärztliche oder psychotherapeutische Behandlung.</p><p><a class="btn" href="${esc(ctaUrl)}" rel="noopener">Erstgespräch mit ${au.name} ansehen</a></p></aside>
${nets.links.length ? `<section class="netz"><h2>Im Netzwerk weiterlesen</h2><ul>${nets.links.map(l => `<li><a href="${l.u}" rel="noopener">${esc(l.t)}</a> <span class="sn">${l.p}</span></li>`).join('')}</ul></section>` : ''}
${more.length ? `<section class="more"><h2>Weiterlesen</h2><div class="cards">${more.map(cardHtml).join('')}</div></section>` : ''}
</article>`;
  let html = html0;
  for (const [ph, u] of (nets.ctx || [])) { const i = html.indexOf('<div class="prose">'); const j = html.indexOf(ph, i); if (j < 0) throw new Error('ctx fehlt: ' + a.slug + ' ' + ph); html = html.slice(0, j) + `<a href="${u}" rel="noopener">${ph}</a>` + html.slice(j + ph.length); }
  write(`artikel/${a.slug}/index.html`, layout({ title: a.title, description: a.description, path: `/artikel/${a.slug}/`, body: html, type: 'article', jsonld: ld, active: a.pillar, nl: true }));
}

// ---------- Seiten ----------
function pillarPage(p) {
  const arts = ARTICLES.filter(a => a.pillar === p.id);
  const crumb = [['Start', '/'], [p.name, `/thema/${p.id}/`]];
  const subs = p.subs.map(s => ({ s, list: arts.filter(a => a.sub === s) }));
  const body = `<div class="wrap">${crumbHtml(crumb)}<header class="page-head"><p class="kicker">Säule ${PILLARS.indexOf(p) + 1} von 5</p><h1>${p.name}</h1><p class="lede">${p.intro}</p></header>
<div class="chips" aria-label="Unterthemen">${p.subs.map(s => `<span class="chip">${s}</span>`).join('')}</div>
${arts.length ? subs.filter(x => x.list.length).map(x => `<section class="sub"><h2>${x.s}</h2><div class="cards">${x.list.map(cardHtml).join('')}</div></section>`).join('') : '<p>Die ersten Beiträge erscheinen in Kürze.</p>'}
<aside class="box wide"><p>Alle Beiträge nennen ihre Quellen und trennen Forschungsstand von Alltagsideen. Mehr dazu unter <a href="/redaktion/">Redaktion und Quellen</a>.</p></aside></div>`;
  write(`thema/${p.id}/index.html`, layout({ title: `${p.name}: Wissen und Orientierung`, description: p.meta, path: `/thema/${p.id}/`, body, nl: true, jsonld: [crumbs(crumb), { '@context': 'https://schema.org', '@type': 'CollectionPage', name: p.name, description: p.meta, url: `${SITE}/thema/${p.id}/` }], active: p.id }));
}
function homePage() {
  const latest = ARTICLES.slice(0, 6);
  const body = `<section class="hero"><div class="wrap hero-in"><div><p class="kicker">Magazin für Selbstführung und Persönlichkeitsentwicklung</p><h1>${CLAIM.split('. ').map(x => x.replace(/\.$/, '')).join('.<br>') + '.'}</h1><p class="lede">${NAME} erklärt, wie Menschen denken, fühlen, entscheiden und sich verändern. Sorgfältig recherchiert, mit Quellen, ohne Heilversprechen und ohne Verkaufsdruck.</p><form class="hsearch" action="/suche/" role="search"><label for="hq" class="sr">Suche</label><input id="hq" name="q" type="search" placeholder="Zum Beispiel: Impulskontrolle, Selbstwert, Bindung" autocomplete="off"><button class="btn" type="submit">Suchen</button></form></div>
<svg class="hero-art" viewBox="0 0 320 320" aria-hidden="true"><circle cx="160" cy="160" r="150" fill="none" stroke="var(--pine)" stroke-width="2" opacity=".25"/><circle cx="160" cy="160" r="110" fill="none" stroke="var(--pine)" stroke-width="2" opacity=".4"/><circle cx="160" cy="160" r="70" fill="none" stroke="var(--pine)" stroke-width="2.4" opacity=".65"/><circle cx="160" cy="160" r="30" fill="var(--pine)"/><circle cx="160" cy="160" r="11" fill="var(--amber)"/></svg></div></section>
<section class="wrap block"><h2 class="sec">Fünf Säulen</h2><div class="pillars">${PILLARS.map((p, i) => { const n = ARTICLES.filter(a => a.pillar === p.id).length; return `<a class="pillar" href="/thema/${p.id}/"><span class="num">${i + 1}</span><h3>${p.name}</h3><p>${p.short}</p><span class="count">${n} ${n === 1 ? 'Beitrag' : 'Beiträge'}</span></a>`; }).join('')}</div></section>
<section class="wrap block"><h2 class="sec">Neu im Magazin</h2><div class="cards">${latest.map(cardHtml).join('')}</div></section>
<section class="band"><div class="wrap principles"><div><h3>Belegt statt behauptet</h3><p>Jede Aussage stützt sich auf Studien, Fachgesellschaften oder öffentliche Stellen. Die Quellen stehen am Ende jedes Beitrags.</p></div><div><h3>Information, keine Behandlung</h3><p>Wir erklären Zusammenhänge. Wir stellen keine Diagnosen und versprechen keine Heilung.</p></div><div><h3>Unabhängig und offen</h3><p>Herausgeber ist BA Entertainment. Wer schreibt und wer dahintersteht, steht transparent auf der Seite <a href="/redaktion/">Redaktion</a>.</p></div></div></section>
<section class="wrap block"><h2 class="sec">Autor:innen</h2><div class="authors">${Object.entries(AUTHORS).map(([k, a]) => `<a class="auth" href="/autoren/#${k}"><span class="av" aria-hidden="true">${a.name[0]}</span><span><strong>${a.name}</strong><br><span class="role">${a.role}</span></span></a>`).join('')}</div></section>`;
  write('index.html', layout({ nl: true, title: `${NAME}: ${CLAIM}`, description: DESC, path: '/', body, jsonld: [{ '@context': 'https://schema.org', '@graph': [{ '@type': 'WebSite', '@id': SITE + '/#site', url: SITE + '/', name: NAME, description: DESC, inLanguage: 'de-DE', publisher: { '@id': SITE + '/#org' }, potentialAction: { '@type': 'SearchAction', target: SITE + '/suche/?q={search_term_string}', 'query-input': 'required name=search_term_string' } }, orgLd] }] }));
}
function simple(slug, title, description, inner, extra = {}) {
  const crumb = [['Start', '/'], [title, `/${slug}/`]];
  const body = `<div class="wrap-narrow">${crumbHtml(crumb)}<header class="page-head"><h1>${esc(title)}</h1>${extra.lede ? `<p class="lede">${extra.lede}</p>` : ''}</header><div class="prose">${inner}</div></div>`;
  write(`${slug}/index.html`, layout({ title, description, path: `/${slug}/`, body, jsonld: [crumbs(crumb)], noindex: !!extra.noindex }));
}
function pages() {
  simple('redaktion', 'Redaktion und Quellen: So arbeiten wir', 'Wie Selbstfokus recherchiert, Quellen auswählt, Fehler korrigiert und wie sich das Magazin finanziert und abgrenzt.', `
<h2>Unsere Grundsätze</h2>
<ul><li><strong>Quellenpflicht:</strong> Inhaltliche Aussagen stützen sich auf genannte Quellen. Zahlen übernehmen wir nur mit Quellenangabe.</li>
<li><strong>Forschungsstand ehrlich einordnen:</strong> Wir nennen auch Grenzen, Kritik und gescheiterte Wiederholungen von Studien, wenn es sie gibt.</li>
<li><strong>Keine Diagnosen, keine Heilversprechen:</strong> Wir erklären, wir diagnostizieren nicht. Psychologische Inhalte sind Information und ersetzen keine Behandlung.</li>
<li><strong>Wissen und Erfahrung trennen:</strong> Alltagsideen und Fragen zum Nachdenken kennzeichnen wir als solche. Sie sind keine Studienergebnisse.</li>
<li><strong>Keine bezahlten Beiträge:</strong> Es gibt keine Werbung und keine gekauften Empfehlungen.</li>
<li><strong>Aktualität:</strong> Jeder Beitrag zeigt das Datum seiner letzten Prüfung.</li></ul>
<h2>Welche Quellen wir nutzen</h2>
<p>Wir bevorzugen peer-reviewte Studien und Meta-Analysen (mit DOI), Leitlinien und Fachgesellschaften, Angebote von Krankenkassen und öffentlichen Stellen sowie Standardwerke der Psychologie. Die Quellen stehen am Ende jedes Beitrags mit Link.</p>
<h2>Wie Beiträge entstehen</h2>
<p>Vor jedem Beitrag prüfen wir, welche Fragen Menschen zum Thema tatsächlich suchen, und ob das Thema bei uns oder im Netzwerk schon behandelt wird. Recherche und Textentwurf entstehen mit KI-Unterstützung. Jede Quelle wird vor der Veröffentlichung am Original geprüft. Die redaktionelle Verantwortung liegt bei BA Entertainment.</p>
<h2>Abgrenzung zu CoGether</h2>
<p>${NAME} ist ein neutrales Lesemagazin. Die Autor:innen arbeiten als Coaches bei <a href="https://cogether.de/" rel="noopener">CoGether</a>. Am Ende von Beiträgen verweisen wir auf ihr Angebot. Der Inhalt der Beiträge richtet sich nach der Quellenlage, nicht nach dem Angebot. Coaching ist keine Therapie.</p>
<h2>Fehler melden</h2>
<p>Wenn Dir ein Fehler auffällt oder eine Quelle nicht mehr stimmt, schreib an <a href="mailto:info@cogether.de">info@cogether.de</a>. Wir prüfen und korrigieren.</p>
<h2>Wer steht dahinter?</h2>
<p>Herausgeber ist BA Entertainment, Haan (siehe <a href="/impressum/">Impressum</a>). Die Autor:innen findest Du unter <a href="/autoren/">Autor:innen</a>.</p>`);
  simple('autoren', 'Autor:innen', 'Die Autor:innen von Selbstfokus: Sven, Angie, Michelle und Kerstin, mit Rolle und Verweis auf ihr Angebot bei CoGether.', Object.entries(AUTHORS).map(([k, a]) => `<section id="${k}" class="authorbox big"><div class="av" aria-hidden="true">${a.name[0]}</div><div><h2>${a.name}</h2><p class="role">${a.role}</p><p>${a.blurb}</p><p><a href="${esc(a.url)}" rel="noopener">${a.name} bei CoGether kennenlernen</a></p><p class="small">Beiträge: ${ARTICLES.filter(x => x.author === k).map(x => `<a href="/artikel/${x.slug}/">${esc(x.title)}</a>`).join(' · ') || 'folgen'}</p></div></section>`).join(''), { lede: 'Wer schreibt, und wo Du die Autor:innen persönlich kennenlernen kannst.' });
  simple('kontakt', 'Kontakt', 'Kontakt zu Selbstfokus: Hinweise zu Fehlern, Rückmeldungen und Anfragen per E-Mail.', `<p>Schreib uns bei Fehlern, Rückmeldungen oder Fragen zur Redaktion an <a href="mailto:info@cogether.de">info@cogether.de</a>. Wir können keine individuelle Beratung per E-Mail leisten und keine Diagnosen stellen.</p><h2>Persönliches Gespräch</h2><p>Wenn Du Deine Fragen mit einem Menschen besprechen möchtest, findest Du bei CoGether die Autor:innen mit Erstgespräch: ${Object.entries(AUTHORS).map(([k, a]) => `<a href="${a.url}?utm_source=selbstfokus&utm_medium=kontakt" rel="noopener">${a.name}</a>`).join(', ')}.</p><aside class="help"><h2>In einer Krise</h2><p>Telefonseelsorge kostenlos <a href="tel:116123">116 123</a> (rund um die Uhr), im Notfall Notruf <a href="tel:112">112</a>.</p></aside>`);
  simple('impressum', 'Impressum', 'Impressum von Selbstfokus: Anbieter BA Entertainment, Haan.', `<h2>Angaben gemäß § 5 DDG</h2><p><strong>Anbieter</strong><br>BA Entertainment<br>Alleestraße 15<br>42781 Haan<br>Deutschland</p><p><strong>Kontakt</strong><br>E-Mail: <a href="mailto:info@cogether.de">info@cogether.de</a><br>Website: selbstfokus.de</p><p><strong>Vertretungsberechtigte Person</strong><br>S. Ulrich</p><p><strong>Umsatzsteuer-ID</strong><br>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE352483219</p><h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2><p>S. Ulrich, Anschrift wie oben.</p><h2>Haftung für Inhalte</h2><p>Die Inhalte dienen der Information und ersetzen keine ärztliche oder psychotherapeutische Beratung und Behandlung. Trotz sorgfältiger Prüfung übernehmen wir keine Gewähr für Vollständigkeit und Aktualität. Hinweise auf Fehler nehmen wir unter info@cogether.de entgegen.</p><h2>Haftung für Links</h2><p>Für Inhalte verlinkter externer Seiten sind ausschließlich deren Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar.</p><h2>Streitbeilegung</h2><p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>`);
  simple('datenschutz', 'Datenschutz', 'Datenschutzhinweise von Selbstfokus: keine Cookies, kein Tracking, selbst gehostete Schriften, Hosting über GitHub Pages.', `<p>Diese Seite setzt keine Cookies, nutzt keine Tracking-, Analyse- oder Werbedienste und lädt keine Schriften von Drittanbietern.</p><h2>Verantwortliche Stelle</h2><p>BA Entertainment, Alleestraße 15, 42781 Haan, E-Mail: info@cogether.de</p><h2>Hosting und Server-Logdaten</h2><p>Die Seite wird als statische Website über GitHub Pages (GitHub, Inc., USA) ausgeliefert. Beim Aufruf verarbeitet der Hoster technisch notwendige Daten (zum Beispiel IP-Adresse, Zeitpunkt, aufgerufene Seite, Browserangaben), um die Seite auszuliefern und die Sicherheit zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Wir haben auf diese Protokolle keinen Zugriff. Informationen zum Datenschutz von GitHub: docs.github.com/de/site-policy/privacy-policies.</p><h2>Schriftarten</h2><p>Alle Schriftarten (Fraunces, Source Serif 4, Inter) liegen auf unserem eigenen Server. Es erfolgt kein Aufruf an Google Fonts oder andere Dienste.</p><h2>Suche</h2><p>Die Suche läuft vollständig in Deinem Browser. Eingaben werden nicht übertragen oder gespeichert.</p><h2>Links zu anderen Seiten</h2><p>Wenn Du einem Link zu CoGether oder anderen externen Seiten folgst, gelten dort die jeweiligen Datenschutzhinweise. Links zu CoGether enthalten Kampagnenangaben (utm_source=selbstfokus), damit wir verstehen, welche Beiträge Menschen zu einem Gespräch führen. Persönliche Daten werden darin nicht übertragen.</p><h2>Newsletter (eingebettetes Formular von cogether.de)</h2><p>Auf Startseite, Themen- und Beitragsseiten kannst Du Dich für den CoGether-Newsletter anmelden. Das Formular wird erst beim Scrollen von cogether.de geladen. Dabei wird Deine IP-Adresse an cogether.de übertragen (Art. 6 Abs. 1 lit. f DSGVO). Eingaben werden erst beim Absenden übertragen. Die Anmeldung erfolgt per Double-Opt-in (Art. 6 Abs. 1 lit. a DSGVO), Du kannst sie jederzeit widerrufen. Verantwortlich ist BA Entertainment, siehe auch die Datenschutzhinweise unter cogether.de/datenschutz/.</p><h2>Social-Media-Links</h2><p>Im Fuß der Seite verlinken wir unsere Profile bei Instagram, TikTok, YouTube und LinkedIn. Es werden keine Inhalte dieser Dienste eingebunden. Erst wenn Du einem Link folgst, gelten dort die Datenschutzhinweise des Anbieters.</p><h2>Kontakt per E-Mail</h2><p>Wenn Du uns schreibst, verarbeiten wir Deine Angaben zur Bearbeitung Deiner Anfrage (Art. 6 Abs. 1 lit. b oder f DSGVO) und löschen sie, wenn sie nicht mehr erforderlich sind.</p><h2>Deine Rechte</h2><p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde. Schreib dazu an info@cogether.de.</p>`);
  simple('netzwerk', 'Die CoGether-Welt', 'Das Netzwerk hinter Selbstfokus: CoGether, Software für Coaches, Organisationen, Wissensportale und zwei Podcasts.', `<p>${NAME} gehört zu einem Netzwerk von Angeboten rund um Entwicklung und Begleitung. Jedes hat seine eigene Rolle.</p><div class="net">${NETWORK.map(n => `<a class="netcard" href="${n.url}" rel="noopener"><h3>${n.name}</h3><p>${n.role}</p></a>`).join('')}</div>`, { lede: 'Wer macht was, und wo Du weiterkommst.' });
  // Glossar
  const gl = GLOSS.filter(g => !g.needs || g.needs.every(s => BY[s]));
  simple('glossar', 'Glossar: Begriffe der Selbstführung', 'Begriffe aus Selbstführung, Selbstwert, Emotionen, Persönlichkeit und Beziehungen kurz und mit Quellen erklärt.', gl.map(g => `<section id="${g.id}" class="gloss"><h2>${esc(g.term)}</h2><p>${md(g.def)}</p><p class="small">${g.read ? 'Mehr dazu: ' + g.read.filter(s => BY[s]).map(s => `<a href="/artikel/${s}/">${esc(BY[s].title)}</a>`).join(' · ') + ' · ' : ''}Quelle: <a href="${esc(SRC[g.src].u)}" rel="noopener nofollow">${esc(SRC[g.src].t)}</a></p></section>`).join(''), { lede: 'Kurze Erklärungen. Die ausführliche Einordnung mit Quellen steht in den Beiträgen.' });
  // Suche
  write('suche/index.html', layout({ title: 'Suche', description: 'Suche in allen Beiträgen von Selbstfokus.', path: '/suche/', noindex: true, active: 'suche', body: `<div class="wrap-narrow"><header class="page-head"><h1>Suche</h1></header><form class="hsearch" role="search" onsubmit="return false"><label for="q" class="sr">Suchbegriff</label><input id="q" type="search" placeholder="Suchbegriff eingeben" autocomplete="off" autofocus><button class="btn" type="submit">Suchen</button></form><p id="sinfo" class="small" aria-live="polite"></p><div id="sres" class="cards one"></div><noscript><p>Für die Suche wird JavaScript benötigt. Alternativ: <a href="/thema/selbstfuehrung/">Themen ansehen</a>.</p></noscript></div>` }));
  write('404.html', layout({ title: 'Seite nicht gefunden', description: 'Diese Seite gibt es nicht.', path: '/404.html', noindex: true, body: `<div class="wrap-narrow"><header class="page-head"><h1>Seite nicht gefunden</h1><p class="lede">Die Seite gibt es nicht (mehr). Versuch es mit der <a href="/suche/">Suche</a> oder starte auf der <a href="/">Startseite</a>.</p></header></div>` }));
}
function machine() {
  const urls = ['/', ...PILLARS.map(p => `/thema/${p.id}/`), ...ARTICLES.map(a => `/artikel/${a.slug}/`), '/glossar/', '/redaktion/', '/autoren/', '/netzwerk/', '/kontakt/', '/impressum/', '/datenschutz/'];
  const lm = u => { const m = u.match(/^\/artikel\/(.+)\/$/); return m ? (BY[m[1]].updatedAt || BY[m[1]].publishedAt) : STAND; };
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${SITE}${u}</loc><lastmod>${lm(u)}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'DuckAssistBot', 'MistralAI-User', 'cohere-ai'];
  write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /suche/\n\n${bots.map(b => `User-agent: ${b}\nAllow: /\n`).join('\n')}\nSitemap: ${SITE}/sitemap.xml\n`);
  write('CNAME', 'selbstfokus.de\n');
  write('.nojekyll', '');
  write('search-index.json', JSON.stringify(ARTICLES.map(a => ({ t: a.title, u: `/artikel/${a.slug}/`, d: a.description, p: pil(a.pillar).name, s: a.sub, k: (a.keywords || []).join(' ') }))));
  write('llms.txt', `# ${NAME}\n\n> ${DESC} Themen: Selbstführung, Selbstwert, emotionale Kompetenz, Persönlichkeitsentwicklung, Beziehungen und Kommunikation. Keine Diagnosen, keine Heilversprechen. Herausgeber: BA Entertainment, Alleestraße 15, 42781 Haan. Kontakt: info@cogether.de. Stand: ${dfmt(STAND)}.\n\n## Säulen\n\n${PILLARS.map(p => `- [${p.name}](${SITE}/thema/${p.id}/): ${p.meta}`).join('\n')}\n\n## Artikel\n\n${ARTICLES.map(a => `- [${a.title}](${SITE}/artikel/${a.slug}/): ${a.description}`).join('\n')}\n\n## Redaktion\n\n- [Redaktion und Quellen](${SITE}/redaktion/): Grundsätze, Quellenauswahl, Abgrenzung zu CoGether.\n- [Autor:innen](${SITE}/autoren/): ${Object.values(AUTHORS).map(a => `${a.name} (${a.role})`).join('; ')}.\n- [Glossar](${SITE}/glossar/)\n\n## Die CoGether-Welt\n\n${NETWORK.map(n => `- [${n.name}](${n.url}): ${n.role}`).join('\n')}\n`);
  write('favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#f6efe0"/><circle cx="16" cy="16" r="11" fill="none" stroke="#1f4d3a" stroke-width="2.4"/><circle cx="16" cy="16" r="5.5" fill="none" stroke="#1f4d3a" stroke-width="1.8" opacity=".55"/><circle cx="16" cy="16" r="2.6" fill="#c9822b"/></svg>');
}

// ---------- Build ----------
for (const d of ['artikel', 'thema']) fs.rmSync(path.join(ROOT, d), { recursive: true, force: true });
ARTICLES.forEach(articlePage);
PILLARS.forEach(pillarPage);
homePage(); pages(); machine();
console.log(`Selbstfokus gebaut: ${ARTICLES.length} Artikel veröffentlicht, ${ALL.length - ARTICLES.length} geplant (Stand ${TODAY}).`);
