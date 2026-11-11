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
const NET = Object.assign({}, require('./content/netzwerk.cjs'), require('./content/netzwerk2.cjs'));
const SOCIAL = [['Instagram', 'https://www.instagram.com/cogether_official'], ['TikTok', 'https://www.tiktok.com/@borderallein_official'], ['YouTube', 'https://www.youtube.com/@cogether'], ['LinkedIn', 'https://de.linkedin.com/in/cogether']];
// Fallback-Verlinkung: Artikel ohne Eintrag in content/netzwerk*.cjs bekommen 3 bis 4 Standardlinks je Säule. Jeder Artikel erhält mindestens einen Link auf cogether.de.
const WK = s => 'https://cogether.de/wissen/' + s + '/', OBS = s => 'https://guidanceobservatory.com/analyses/' + s + '/';
const L = (p, t, u) => ({ p, t, u });
const POD = L('Podcast Border Allein', 'Podcast Border Allein: Gespräche über alte Muster, Beziehungen und Selbstführung', 'https://borderallein.de/podcast/');
const ZU = L('Ziele umsetzen', 'Ziele umsetzen: Wissen fürs praktische Tun', 'https://zieleumsetzen.de/thema/ziele-setzen/');
const FB = {
  selbstfuehrung: [L('CoGether Wissen', 'Selbstführung lernen: Was es bedeutet und wie Du anfängst', WK('selbstfuehrung-lernen-was-es-bedeutet-und-wie-du-anfaengst')), L('Guidance Observatory', 'Selbstführung (Self-Leadership) in der Forschung', OBS('selbstfuehrung-self-leadership')), ZU, POD],
  selbstwert: [L('CoGether Wissen', 'Ich bin nicht gut genug: Woher das Gefühl kommt und was hilft', WK('ich-bin-nicht-gut-genug-woher-das-gefuehl-kommt-und-was-hilft')), L('CoGether Wissen', 'Selbstmitgefühl lernen', WK('selbstmitgefuehl-lernen-warum-weniger-selbstkritik-dich-nicht-schwaecher-sondern-handlungsfaehiger-machen-kann')), L('Guidance Observatory', 'Selbstmitgefühl und psychische Belastung', OBS('selbstmitgefuehl-und-psychische-belastung')), L('Podcast Gedankenkotze', 'Gedankenkotze: Folgen zum Thema Selbstwert', 'https://gedankenkotze.de/thema/selbstwert/')],
  'emotionale-kompetenz': [L('CoGether Wissen', 'Emotionale Intelligenz steigern: Übungen für den Alltag', WK('emotionale-intelligenz-steigern-uebungen-fuer-den-alltag')), L('Guidance Observatory', 'Emotionsregulation: Welche Strategien wirken', OBS('emotionsregulation-welche-strategien-wirken')), L('Podcast Gedankenkotze', 'Gedankenkotze: Folgen zum Thema Gefühle', 'https://gedankenkotze.de/thema/gefuehle/')],
  persoenlichkeitsentwicklung: [L('CoGether Wissen', 'Muster erkennen und verändern', WK('muster-erkennen-und-veraendern-immer-gleich-reagieren')), L('Guidance Observatory', 'Growth Mindset: Was zwei Meta-Analysen zeigen', OBS('growth-mindset-was-zwei-meta-analysen-zeigen')), ZU, POD],
  'beziehungen-kommunikation': [L('CoGether Wissen', 'Emotionale Intelligenz in der Beziehung: Konflikte, Nähe und Gespräche', WK('emotionale-intelligenz-in-der-beziehung-konflikte-naehe-und-gespraeche')), L('Podcast Gedankenkotze', 'Gedankenkotze: Folgen zum Thema Beziehungen', 'https://gedankenkotze.de/thema/beziehungen/'), POD],
  'stress-erholung': [L('CoGether Wissen', 'Burnout erkennen: Anzeichen, Ursachen und Wege zurück zu Kräften', WK('burnout-erkennen-anzeichen-ursachen-und-wie-du-wieder-zu-kraeften-kommst')), L('Guidance Observatory', 'Erholung von der Arbeit: Was 54 Stichproben zeigen', OBS('erholung-von-der-arbeit-was-54-stichproben-zeigen')), L('Podcast Gedankenkotze', 'Gedankenkotze: Folgen zum Thema Erschöpfung', 'https://gedankenkotze.de/thema/erschoepfung/')],
  'sinn-ziele': [L('CoGether Wissen', 'Orientierungslos und Sinnkrise: Was dahintersteckt und wie Du Richtung findest', WK('orientierungslos-sinnkrise-lebenskrise-was-dahintersteckt-und-wie-du-wieder-richtung-findest')), L('Guidance Observatory', 'Selbstkonkordante Ziele', OBS('selbstkonkordante-ziele-warum-passende-ziele-wohlbefinden-staerken')), ZU, POD],
  verbundenheit: [L('CoGether Wissen', 'Einsam trotz Menschen: Warum Du Dich allein fühlst und was hilft', WK('einsam-trotz-menschen-warum-du-dich-allein-fuehlst-und-was-hilft')), L('Podcast Gedankenkotze', 'Gedankenkotze: Folgen zum Thema Beziehungen', 'https://gedankenkotze.de/thema/beziehungen/'), POD]
};
const FALLBACK = a => (FB[a.pillar] || FB.selbstfuehrung).slice();
const NLBOX = `<section class="nl wrap-narrow" aria-label="CoGether-Newsletter"><h2>Der CoGether-Newsletter</h2><p class="small">Impulse und neue Beiträge per E-Mail. Das Formular wird von cogether.de geladen (Double-Opt-in, jederzeit abbestellbar).</p><iframe id="nlf" title="CoGether-Newsletter anmelden" src="https://cogether.de/newsletter-embed/selbstfokus/" loading="lazy" height="330" style="width:100%;border:0"></iframe><script>window.addEventListener('message',function(e){if(e.origin==='https://cogether.de'&&e.data&&e.data.cgnl){var f=document.getElementById('nlf');if(f)f.style.height=(e.data.h+8)+'px'}});</script></section>`;

// ---------- Hilfen ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fixAmp = s => s.replace(/&(?!#?\w+;)/g, '&amp;');
const dfmt = d => { const [y, m, t] = d.split('-'); return `${+t}. ${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][+m - 1]} ${y}`; };
const wc = a => Math.max(3, Math.round(JSON.stringify([a.kurz, a.body, a.faq]).replace(/<[^>]*>/g, ' ').split(/\s+/).length / 200));
function md(s, a) {
  s = fixAmp(s);
  s = s.replace(/\{\{a:([a-z0-9-]+)\|([^}]+)\}\}/g, (_, sl, t) => BY[sl] ? `<a href="/artikel/${sl}/">${t}</a>` : t);
  if (a) s = s.replace(/\{(\d+(?:,\d+)*)\}/g, (_, n) => '<sup class="q">' + n.split(',').map(i => `<a href="#q${i}" aria-label="Quelle ${i}" title="${esc((SRC[a.sources[i - 1]] || { t: '' }).t.slice(0, 160))}">${i}</a>`).join(',') + '</sup>');
  return s;
}
const write = (rel, content) => { const p = path.join(ROOT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, content); };
const pil = id => PILLARS.find(p => p.id === id);
const ACC = { selbstfuehrung: '#0f4c5c', selbstwert: '#a4552d', 'emotionale-kompetenz': '#6b3f5e', persoenlichkeitsentwicklung: '#3b5683', 'beziehungen-kommunikation': '#8a4350', 'stress-erholung': '#1f6670', 'sinn-ziele': '#8a6208', verbundenheit: '#5b6b2a' };
const FZ = l => '<svg class="fz" viewBox="0 0 64 64" aria-hidden="true"><g class="fz-a"><circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="1.5 4.2"/></g><circle cx="32" cy="32" r="25.5" fill="none" stroke="currentColor" stroke-width=".8" opacity=".45"/><path d="M32 1v6M32 57v6M1 32h6M57 32h6" stroke="currentColor" stroke-width="1.3"/><g class="fz-b"><circle cx="32" cy="2.5" r="2.4" fill="var(--amber)"/></g><circle class="fz-d" cx="32" cy="32" r="19.5"/></svg><b class="fz-l">' + l + '</b>';
const ico = d => '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const ICON = {
  selbstfuehrung: ico('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
  selbstwert: ico('<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'),
  'emotionale-kompetenz': ico('<path d="M2 12c2.5-5 5-5 7.5 0s5 5 7.5 0 3-3 5-2"/><path d="M2 18c2.5-4 5-4 7.5 0s5 4 7.5 0 3-2.5 5-1.5" opacity=".5"/>'),
  persoenlichkeitsentwicklung: ico('<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 8-7 0 5-3 8-8 7z"/><path d="M12 15c0-3-2-5-6-5 0 4 2 6 6 5z"/>'),
  'beziehungen-kommunikation': ico('<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>'),
  'stress-erholung': ico('<path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"/>'),
  'sinn-ziele': ico('<path d="M5 21V4"/><path d="M5 5h12l-2.5 4 2.5 4H5"/>'),
  verbundenheit: ico('<circle cx="6" cy="7" r="2.3"/><circle cx="18" cy="7" r="2.3"/><circle cx="12" cy="18" r="2.3"/><path d="M8 8l3 8M16 8l-3 8M8.3 7h7.4"/>')
};
const QUESTIONS = ARTICLES.flatMap(a => a.body.filter(b => b.think).flatMap(b => b.think.map(q => ({ q: q.replace(/\{\d+(?:,\d+)*\}/g, ''), u: '/artikel/' + a.slug + '/', t: a.title, c: ACC[a.pillar] }))));

// ---------- Layout ----------
const LOGO = '<svg class="logo" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="16" cy="16" r="7" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".55"/><circle cx="16" cy="16" r="3" fill="var(--amber)"/></svg>';
function layout({ title, description, path: p, body, type = 'website', jsonld = [], noindex = false, active = '', nl = false }) {
  const url = SITE + p;
  const full = title.includes(NAME) ? title : `${title} | ${NAME}`;
  const nav = [['/thema/selbstfuehrung/', 'Selbstführung', 'selbstfuehrung'], ['/thema/selbstwert/', 'Selbstwert', 'selbstwert'], ['/thema/emotionale-kompetenz/', 'Emotionen', 'emotionale-kompetenz'], ['/thema/persoenlichkeitsentwicklung/', 'Persönlichkeit', 'persoenlichkeitsentwicklung'], ['/thema/beziehungen-kommunikation/', 'Beziehungen', 'beziehungen-kommunikation'], ['/thema/stress-erholung/', 'Stress', 'stress-erholung'], ['/thema/sinn-ziele/', 'Sinn', 'sinn-ziele'], ['/thema/verbundenheit/', 'Verbundenheit', 'verbundenheit']];
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
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/source-serif-4-400-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/fraunces-600-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts.css">
<link rel="stylesheet" href="/assets/site.css?v=${STAND}e">
<link rel="stylesheet" href="/assets/design.css?v=${STAND}e">
<link rel="stylesheet" href="/assets/theme.css?v=${STAND}e">
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body>
<a class="skip" href="#main">Zum Inhalt springen</a>
<div class="progress" aria-hidden="true"><i></i></div>
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
<script src="/assets/site.js?v=${STAND}e" defer></script>
</body>
</html>`;
}
const crumbs = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE + u })) });
const crumbHtml = items => `<nav class="crumbs" aria-label="Brotkrumen">${items.map(([n, u], i) => i < items.length - 1 ? `<a href="${u}">${esc(n)}</a>` : `<span>${esc(n)}</span>`).join(' / ')}</nav>`;
const cardHtml = a => `<article class="card" style="--accent:${ACC[a.pillar]}"><p class="kicker"><a href="/thema/${a.pillar}/">${pil(a.pillar).name}</a> · ${a.sub}</p><h3><a href="/artikel/${a.slug}/">${esc(a.title)}</a></h3><p>${esc(a.description)}</p><p class="meta">${AUTHORS[a.author].name} · ${wc(a)} Min. Lesezeit · ${dfmt(a.publishedAt)}</p></article>`;
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
  const nets = Object.assign({ links: [] }, NET[a.slug] || { links: FALLBACK(a) });
  if (!nets.links.some(l => /^https:\/\/cogether\.de\//.test(l.u))) nets.links = nets.links.concat([FB[a.pillar][0]]);
  const html0 = `<article class="article" style="--accent:${ACC[a.pillar]}">
${crumbHtml(crumb)}
<header class="a-head">
 <p class="kicker"><a href="/thema/${pl.id}/">${pl.name}</a> · ${a.sub}</p>
 <h1>${esc(a.title)}</h1>
 <p class="lede">${md(a.description)}</p>
 <p class="meta">Von <a href="/autoren/#${a.author}">${au.name}</a> · ${wc(a)} Min. Lesezeit · Stand: ${dfmt(a.updatedAt || a.publishedAt)}</p>
 <div class="tools" role="group" aria-label="Leseoptionen"><button type="button" class="tool" data-act="focus" aria-pressed="false">◎ Fokusmodus</button><button type="button" class="tool" data-act="smaller" aria-label="Schrift kleiner">A−</button><button type="button" class="tool" data-act="bigger" aria-label="Schrift größer">A+</button></div>
</header>
<section class="kurz" aria-labelledby="kurz-h"><h2 id="kurz-h">Kurz gesagt</h2><ul>${a.kurz.map(k => `<li>${md(k, a)}</li>`).join('')}</ul></section>
${toc.length > 2 ? `<nav class="toc" aria-label="Inhalt"><h2>Inhalt</h2><ol>${toc.map(t => `<li><a href="#${t.id}">${md(t.t)}</a></li>`).join('')}</ol></nav>` : ''}
<div class="prose">
${body}
</div>
${a.faq && a.faq.length ? `<section class="faq"><h2>Häufige Fragen</h2>${a.faq.map(f => `<details><summary>${md(f.q)}</summary><p>${md(f.a, a)}</p></details>`).join('')}</section>` : ''}
<aside class="help"><h2>Wenn es Dich gerade stark belastet</h2><p>Dieser Text ist Information, keine Diagnose und keine Behandlung. Wenn Du Dich in einer akuten Krise befindest oder an Suizid denkst: Telefonseelsorge kostenlos unter <a href="tel:116123">116 123</a> (rund um die Uhr), im Notfall der Notruf <a href="tel:112">112</a>.</p></aside>
<section class="sources" id="quellen"><h2>Quellen</h2><ol>${srcs.map((s, i) => `<li id="q${i + 1}">${fixAmp(esc(s.t)).replace(/&amp;amp;/g, '&amp;')} <a href="${esc(s.u)}" rel="noopener nofollow">${esc(s.u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').slice(0, 70))}</a>${s.n ? ` <span class="sn">${esc(s.n)}</span>` : ''}</li>`).join('')}</ol><p class="small">Wie wir Quellen auswählen: <a href="/redaktion/">Redaktion und Quellen</a>. Fehler gefunden? <a href="mailto:info@cogether.de?subject=Korrektur%20${encodeURIComponent(a.slug)}">Schreib uns</a>.</p></section>
<section class="authorbox" id="autor"><div class="av" aria-hidden="true">${FZ(au.name[0])}</div><div><p class="kicker">Autor:in</p><h2>${au.name}</h2><p class="role">${au.role}</p><p>${au.blurb}</p><p><a href="${esc(au.url)}" rel="noopener">${au.name} bei CoGether kennenlernen</a></p></div></section>
<aside class="cta"><h2>Mit jemandem darüber sprechen</h2><p>${au.cta} Coaching ist keine Therapie und ersetzt keine ärztliche oder psychotherapeutische Behandlung.</p><p><a class="btn" href="${esc(ctaUrl)}" rel="noopener">Erstgespräch mit ${au.name} ansehen</a></p></aside>
${nets.links.length ? `<section class="netz"><h2>Im Netzwerk weiterlesen</h2><ul>${nets.links.map(l => `<li><a href="${l.u}" rel="noopener">${esc(l.t)}</a> <span class="sn">${l.p}</span></li>`).join('')}</ul></section>` : ''}
${more.length ? `<section class="more"><h2>Weiterlesen</h2><div class="cards">${more.map(cardHtml).join('')}</div></section>` : ''}
</article>`;
  let html = html0;
  for (const [ph, u] of (nets.ctx || [])) { const i = html.indexOf('<div class="prose">'); const j = html.indexOf(ph, i); if (j < 0) { console.warn('WARN ctx fehlt: ' + a.slug + ' ' + ph); continue; } html = html.slice(0, j) + `<a href="${u}" rel="noopener">${ph}</a>` + html.slice(j + ph.length); }
  write(`artikel/${a.slug}/index.html`, layout({ title: a.title, description: a.description, path: `/artikel/${a.slug}/`, body: html, type: 'article', jsonld: ld, active: a.pillar, nl: true }));
}

// ---------- Seiten ----------
function pillarPage(p) {
  const arts = ARTICLES.filter(a => a.pillar === p.id);
  const crumb = [['Start', '/'], [p.name, `/thema/${p.id}/`]];
  const subs = p.subs.map(s => ({ s, list: arts.filter(a => a.sub === s) }));
  const body = `<div class="wrap pillar-page" style="--accent:${ACC[p.id]}">${crumbHtml(crumb)}<header class="page-head"><span class="pico">${ICON[p.id]}</span><p class="kicker">Säule ${PILLARS.indexOf(p) + 1} von ${PILLARS.length}</p><h1>${p.name}</h1><p class="lede">${p.intro}</p></header>
<div class="chips" aria-label="Unterthemen">${p.subs.map(s => `<span class="chip">${s}</span>`).join('')}</div>
${arts.length ? subs.filter(x => x.list.length).map(x => `<section class="sub"><h2>${x.s}</h2><div class="cards">${x.list.map(cardHtml).join('')}</div></section>`).join('') : '<p>Die ersten Beiträge erscheinen in Kürze.</p>'}
<aside class="box wide"><p>Alle Beiträge nennen ihre Quellen und trennen Forschungsstand von Alltagsideen. Mehr dazu unter <a href="/redaktion/">Redaktion und Quellen</a>.</p></aside></div>`;
  write(`thema/${p.id}/index.html`, layout({ title: `${p.name}: Wissen und Orientierung`, description: p.meta, path: `/thema/${p.id}/`, body, nl: true, jsonld: [crumbs(crumb), { '@context': 'https://schema.org', '@type': 'CollectionPage', name: p.name, description: p.meta, url: `${SITE}/thema/${p.id}/` }], active: p.id }));
}
function homePage() {
  const latest = ARTICLES.slice(0, 6);
  const body = `<section class="hero" id="hero"><i class="vf a"></i><i class="vf b"></i><i class="vf c"></i><i class="vf d"></i><div class="wrap hero-in"><div><p class="kicker">Magazin für Selbstführung und Persönlichkeitsentwicklung</p><h1>${CLAIM.split('. ').map((x, i) => `<span class="ln" style="--d:${i * 0.2}s">${x.replace(/\.$/, '')}.</span>`).join('')}</h1><p class="lede">${NAME} erklärt, wie Menschen denken, fühlen, entscheiden und sich verändern. Sorgfältig recherchiert, mit Quellen, ohne Heilversprechen und ohne Verkaufsdruck.</p><form class="hsearch" action="/suche/" role="search"><label for="hq" class="sr">Suche</label><input id="hq" name="q" type="search" placeholder="Zum Beispiel: Impulskontrolle, Selbstwert, Bindung" autocomplete="off"><button class="btn" type="submit">Suchen</button></form></div>
<svg class="hero-art" viewBox="0 0 320 320" aria-hidden="true"><g class="spin2"><path d="M160.0 10.0L160.0 0.0M173.1 10.6L173.5 5.6M186.0 12.3L186.9 7.4M198.8 15.1L200.1 10.3M211.3 19.0L213.0 14.3M223.4 24.1L225.5 19.5M235.0 30.1L240.0 21.4M246.0 37.1L248.9 33.0M256.4 45.1L259.6 41.3M266.1 53.9L269.6 50.4M274.9 63.6L278.7 60.4M282.9 74.0L287.0 71.1M289.9 85.0L298.6 80.0M295.9 96.6L300.5 94.5M301.0 108.7L305.7 107.0M304.9 121.2L309.7 119.9M307.7 134.0L312.6 133.1M309.4 146.9L314.4 146.5M310.0 160.0L320.0 160.0M309.4 173.1L314.4 173.5M307.7 186.0L312.6 186.9M304.9 198.8L309.7 200.1M301.0 211.3L305.7 213.0M295.9 223.4L300.5 225.5M289.9 235.0L298.6 240.0M282.9 246.0L287.0 248.9M274.9 256.4L278.7 259.6M266.1 266.1L269.6 269.6M256.4 274.9L259.6 278.7M246.0 282.9L248.9 287.0M235.0 289.9L240.0 298.6M223.4 295.9L225.5 300.5M211.3 301.0L213.0 305.7M198.8 304.9L200.1 309.7M186.0 307.7L186.9 312.6M173.1 309.4L173.5 314.4M160.0 310.0L160.0 320.0M146.9 309.4L146.5 314.4M134.0 307.7L133.1 312.6M121.2 304.9L119.9 309.7M108.7 301.0L107.0 305.7M96.6 295.9L94.5 300.5M85.0 289.9L80.0 298.6M74.0 282.9L71.1 287.0M63.6 274.9L60.4 278.7M53.9 266.1L50.4 269.6M45.1 256.4L41.3 259.6M37.1 246.0L33.0 248.9M30.1 235.0L21.4 240.0M24.1 223.4L19.5 225.5M19.0 211.3L14.3 213.0M15.1 198.8L10.3 200.1M12.3 186.0L7.4 186.9M10.6 173.1L5.6 173.5M10.0 160.0L0.0 160.0M10.6 146.9L5.6 146.5M12.3 134.0L7.4 133.1M15.1 121.2L10.3 119.9M19.0 108.7L14.3 107.0M24.1 96.6L19.5 94.5M30.1 85.0L21.4 80.0M37.1 74.0L33.0 71.1M45.1 63.6L41.3 60.4M53.9 53.9L50.4 50.4M63.6 45.1L60.4 41.3M74.0 37.1L71.1 33.0M85.0 30.1L80.0 21.4M96.6 24.1L94.5 19.5M108.7 19.0L107.0 14.3M121.2 15.1L119.9 10.3M134.0 12.3L133.1 7.4M146.9 10.6L146.5 5.6" stroke="var(--pine)" stroke-width="1.2" fill="none" opacity=".55"/></g><circle cx="160" cy="160" r="138" fill="none" stroke-width="1" opacity=".22"/><g class="spin"><path d="M160.0 48.0L160.0 38.0M171.7 48.6L172.2 43.6M183.3 50.4L184.3 45.6M194.6 53.5L196.2 48.7M205.6 57.7L207.6 53.1M216.0 63.0L221.0 54.3M225.8 69.4L228.8 65.3M234.9 76.8L238.3 73.1M243.2 85.1L246.9 81.7M250.6 94.2L254.7 91.2M257.0 104.0L265.7 99.0M262.3 114.4L266.9 112.4M266.5 125.4L271.3 123.8M269.6 136.7L274.4 135.7M271.4 148.3L276.4 147.8M272.0 160.0L282.0 160.0M271.4 171.7L276.4 172.2M269.6 183.3L274.4 184.3M266.5 194.6L271.3 196.2M262.3 205.6L266.9 207.6M257.0 216.0L265.7 221.0M250.6 225.8L254.7 228.8M243.2 234.9L246.9 238.3M234.9 243.2L238.3 246.9M225.8 250.6L228.8 254.7M216.0 257.0L221.0 265.7M205.6 262.3L207.6 266.9M194.6 266.5L196.2 271.3M183.3 269.6L184.3 274.4M171.7 271.4L172.2 276.4M160.0 272.0L160.0 282.0M148.3 271.4L147.8 276.4M136.7 269.6L135.7 274.4M125.4 266.5L123.8 271.3M114.4 262.3L112.4 266.9M104.0 257.0L99.0 265.7M94.2 250.6L91.2 254.7M85.1 243.2L81.7 246.9M76.8 234.9L73.1 238.3M69.4 225.8L65.3 228.8M63.0 216.0L54.3 221.0M57.7 205.6L53.1 207.6M53.5 194.6L48.7 196.2M50.4 183.3L45.6 184.3M48.6 171.7L43.6 172.2M48.0 160.0L38.0 160.0M48.6 148.3L43.6 147.8M50.4 136.7L45.6 135.7M53.5 125.4L48.7 123.8M57.7 114.4L53.1 112.4M63.0 104.0L54.3 99.0M69.4 94.2L65.3 91.2M76.8 85.1L73.1 81.7M85.1 76.8L81.7 73.1M94.2 69.4L91.2 65.3M104.0 63.0L99.0 54.3M114.4 57.7L112.4 53.1M125.4 53.5L123.8 48.7M136.7 50.4L135.7 45.6M148.3 48.6L147.8 43.6" stroke="var(--pine)" stroke-width="1.2" fill="none" opacity=".7"/></g><circle cx="160" cy="160" r="96" fill="none" stroke-width="1.4" opacity=".4"/><circle cx="160" cy="160" r="62" fill="none" stroke-width="1.8" opacity=".65"/><path d="M8 160H92M228 160H312M160 8V92M160 228V312" stroke="var(--pine)" stroke-width="1.2" opacity=".5"/><g class="scan"><path d="M160 160V70" stroke="var(--amber)" stroke-width="1.6"/><circle cx="160" cy="70" r="3.2" fill="var(--amber)" stroke="none"/></g><circle class="core" cx="160" cy="160" r="26"/><circle class="pip" cx="160" cy="160" r="9"/></svg></div></section>
<section class="wrap block"><ul class="stats"><li><strong>${ARTICLES.length}</strong> Beiträge</li><li><strong>${PILLARS.length}</strong> Säulen</li><li><strong>${Object.keys(AUTHORS).length}</strong> Autor:innen</li><li><strong>100 %</strong> mit Quellen</li></ul><h2 class="sec">Acht Säulen</h2><div class="pillars">${PILLARS.map((p, i) => { const n = ARTICLES.filter(a => a.pillar === p.id).length; return `<a class="pillar" style="--accent:${ACC[p.id]}" href="/thema/${p.id}/"><span class="pico">${ICON[p.id]}</span><h3>${p.name}</h3><p>${p.short}</p><span class="count">${n} ${n === 1 ? 'Beitrag' : 'Beiträge'}</span></a>`; }).join('')}</div></section>
<section class="wrap block"><div class="qcard" id="qcard" aria-live="polite"><p class="kicker">Frage zum Nachdenken</p><p class="qtext" id="qtext">Was beschäftigt Dich gerade am meisten?</p><p class="qsrc"><a id="qlink" href="/thema/selbstfuehrung/">Zu den Beiträgen</a> <button type="button" id="qnext" class="tool">Nächste Frage ↻</button></p><script type="application/json" id="qdata">${JSON.stringify(QUESTIONS).replace(/</g, "\\u003c")}</script></div></section>
<section class="wrap block"><h2 class="sec">Neu im Magazin</h2><div class="cards">${latest.map(cardHtml).join('')}</div></section>
<section class="band"><div class="wrap principles"><div><h3>Belegt statt behauptet</h3><p>Jede Aussage stützt sich auf Studien, Fachgesellschaften oder öffentliche Stellen. Die Quellen stehen am Ende jedes Beitrags.</p></div><div><h3>Information, keine Behandlung</h3><p>Wir erklären Zusammenhänge. Wir stellen keine Diagnosen und versprechen keine Heilung.</p></div><div><h3>Unabhängig und offen</h3><p>Herausgeber ist BA Entertainment. Wer schreibt und wer dahintersteht, steht transparent auf der Seite <a href="/redaktion/">Redaktion</a>.</p></div></div></section>
<section class="wrap block"><h2 class="sec">Autor:innen</h2><div class="authors">${Object.entries(AUTHORS).map(([k, a]) => `<a class="auth" href="/autoren/#${k}"><span class="av" aria-hidden="true">${FZ(a.name[0])}</span><span><strong>${a.name}</strong><br><span class="role">${a.role}</span></span></a>`).join('')}</div></section>`;
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
<h2>Verlinkung im Netzwerk</h2>
<p>Jeder Beitrag verweist am Ende auf passende Seiten im CoGether-Netzwerk (Block „Im Netzwerk weiterlesen“) und auf ein Erstgespräch bei den Autor:innen. Die Links liegen zentral in der Link-Map des Portals. Beiträge ohne eigenen Eintrag erhalten automatisch Standardlinks je Säule, mindestens einen auf cogether.de. Wir verlinken nur Seiten, die erreichbar sind, mit beschreibendem Linktext.</p>
<h2>Fehler melden</h2>
<p>Wenn Dir ein Fehler auffällt oder eine Quelle nicht mehr stimmt, schreib an <a href="mailto:info@cogether.de">info@cogether.de</a>. Wir prüfen und korrigieren.</p>
<h2>Wer steht dahinter?</h2>
<p>Herausgeber ist BA Entertainment, Haan (siehe <a href="/impressum/">Impressum</a>). Die Autor:innen findest Du unter <a href="/autoren/">Autor:innen</a>.</p>`);
  simple('autoren', 'Autor:innen', 'Die Autor:innen von Selbstfokus: Sven, Angie, Michelle und Kerstin, mit Rolle und Verweis auf ihr Angebot bei CoGether.', Object.entries(AUTHORS).map(([k, a]) => `<section id="${k}" class="authorbox big"><div class="av" aria-hidden="true">${FZ(a.name[0])}</div><div><h2>${a.name}</h2><p class="role">${a.role}</p><p>${a.blurb}</p><p><a href="${esc(a.url)}" rel="noopener">${a.name} bei CoGether kennenlernen</a></p><p class="small">Beiträge: ${ARTICLES.filter(x => x.author === k).map(x => `<a href="/artikel/${x.slug}/">${esc(x.title)}</a>`).join(' · ') || 'folgen'}</p></div></section>`).join(''), { lede: 'Wer schreibt, und wo Du die Autor:innen persönlich kennenlernen kannst.' });
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
  write('favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#ffffff"/><circle cx="16" cy="16" r="11" fill="none" stroke="#0f4c5c" stroke-width="2.4"/><circle cx="16" cy="16" r="5.5" fill="none" stroke="#0f4c5c" stroke-width="1.8" opacity=".55"/><circle cx="16" cy="16" r="2.6" fill="#0f4c5c"/></svg>');
}

// ---------- Build ----------
for (const d of ['artikel', 'thema']) fs.rmSync(path.join(ROOT, d), { recursive: true, force: true });
ARTICLES.forEach(articlePage);
PILLARS.forEach(pillarPage);
homePage(); pages(); machine();
console.log(`Selbstfokus gebaut: ${ARTICLES.length} Artikel veröffentlicht, ${ALL.length - ARTICLES.length} geplant (Stand ${TODAY}).`);
