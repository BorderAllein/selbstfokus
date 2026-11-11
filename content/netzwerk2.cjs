// Link-Map, Teil 2 (neue Säulen). Gleiche Regeln wie netzwerk.cjs.
const W = s => 'https://cogether.de/wissen/' + s + '/';
const O = s => 'https://guidanceobservatory.com/analyses/' + s + '/';
const G = s => 'https://gedankenkotze.de/' + s + '/';
const CG = 'CoGether Wissen', OB = 'Guidance Observatory', GK = 'Podcast Gedankenkotze';
const PODCAST = { p: 'Podcast Border Allein', t: 'Podcast Border Allein: Gespräche über alte Muster, Beziehungen und Selbstführung', u: 'https://borderallein.de/podcast/' };
const BURN = { p: CG, t: 'Burnout erkennen: Anzeichen, Ursachen und Wege zurück zu Kräften', u: W('burnout-erkennen-anzeichen-ursachen-und-wie-du-wieder-zu-kraeften-kommst') };
const ERS = { p: GK, t: 'Gedankenkotze: Folgen zum Thema Erschöpfung', u: G('thema/erschoepfung') };
const NGG = { p: CG, t: 'Ich bin nicht gut genug: Woher das Gefühl kommt und was hilft', u: W('ich-bin-nicht-gut-genug-woher-das-gefuehl-kommt-und-was-hilft') };
const EINS = { p: CG, t: 'Einsam trotz Menschen: Warum Du Dich allein fühlst und was hilft', u: W('einsam-trotz-menschen-warum-du-dich-allein-fuehlst-und-was-hilft') };
const ORI = { p: CG, t: 'Orientierungslos und Sinnkrise: Was dahintersteckt und wie Du Richtung findest', u: W('orientierungslos-sinnkrise-lebenskrise-was-dahintersteckt-und-wie-du-wieder-richtung-findest') };
const SKZ = { p: OB, t: 'Selbstkonkordante Ziele: Warum passende Ziele Wohlbefinden stärken', u: O('selbstkonkordante-ziele-warum-passende-ziele-wohlbefinden-staerken') };
const FORT = { p: OB, t: 'Fortschritt beobachten: Was 138 Experimente zeigen', u: O('fortschritt-beobachten-was-138-experimente-zur-zielverfolgung-zeigen') };
const EMO = { p: OB, t: 'Emotionsregulation: Welche Strategien wirken', u: O('emotionsregulation-welche-strategien-wirken') };
const EIU = { p: CG, t: 'Emotionale Intelligenz steigern: Übungen für den Alltag', u: W('emotionale-intelligenz-steigern-uebungen-fuer-den-alltag') };
const GKG = { p: GK, t: 'Gedankenkotze: Folgen zum Thema Gefühle', u: G('thema/gefuehle') };
module.exports = {
  'erholung-nach-der-arbeit-abschalten': { links: [{ p: OB, t: 'Erholung von der Arbeit: Was 54 Stichproben zeigen', u: O('erholung-von-der-arbeit-was-54-stichproben-zeigen') }, { p: CG, t: 'Abends nicht abschalten können: Gedankenkreisen, Unruhe und Leere', u: W('abends-nicht-abschalten-koennen-gedankenkreisen-unruhe-und-leere') }, BURN, ERS], ctx: [['Psychologisches Abschalten', O('erholung-von-der-arbeit-was-54-stichproben-zeigen')]] },
  'mikropausen-kurze-pausen-bei-der-arbeit': { links: [{ p: OB, t: 'Mikropausen bei der Arbeit: Was eine Meta-Analyse zeigt', u: O('mikropausen-bei-der-arbeit-was-eine-meta-analyse-zu-erholung-zeigt') }, BURN, ERS, PODCAST] },
  'perfektionismus-und-burnout-streben-und-sorge': { links: [{ p: OB, t: 'Perfektionismus und Burnout: Warum Streben und Sorge verschieden wirken', u: O('perfektionismus-und-burnout') }, { p: CG, t: 'Burnout-Phasen und Test: Wo stehe ich?', u: W('burnout-phasen-und-test-wo-stehe-ich-und-was-ist-der-naechste-schritt') }, NGG, ERS] },
  'resilienztraining-was-die-studienlage-sagt': { links: [{ p: OB, t: 'Resilienztraining am Arbeitsplatz: Was 14 Studien zeigen', u: O('resilienztraining-am-arbeitsplatz') }, BURN, { p: CG, t: 'Selbstführung lernen', u: W('selbstfuehrung-lernen-was-es-bedeutet-und-wie-du-anfaengst') }, PODCAST] },
  'schreiben-ueber-belastendes-was-studien-zeigen': { links: [{ p: OB, t: 'Über Belastendes schreiben: Was 146 Studien zeigen', u: O('schreiben-ueber-belastendes-experimentelle-offenlegung') }, EMO, EIU, GKG] },
  'einsamkeit-was-die-forschung-zeigt': { links: [{ p: OB, t: 'Einsamkeit: Was ein Übersichtsartikel zeigt', u: O('einsamkeit-was-ein-uebersichtsartikel-ueber-folgen-und-mechanismen-zeigt') }, EINS, { p: GK, t: 'Gedankenkotze: Folgen zum Thema Beziehungen', u: G('thema/beziehungen') }, PODCAST] },
  'soziale-beziehungen-und-lebenserwartung': { links: [{ p: OB, t: 'Soziale Beziehungen und Lebenserwartung: Was 148 Studien zeigen', u: O('soziale-beziehungen-und-lebenserwartung-was-148-studien-zeigen') }, EINS, { p: GK, t: 'Gedankenkotze: Folgen zum Thema Beziehungen', u: G('thema/beziehungen') }, PODCAST] },
  'hochstaplergefuehl-impostor-syndrom': { links: [{ p: OB, t: 'Hochstaplergefühl: Was ein Review zum Impostor-Syndrom zeigt', u: O('hochstaplergefuehl-was-ein-systematischer-review-zu-impostor-syndrom-zeigt') }, NGG, { p: GK, t: 'Gedankenkotze: Folgen zum Thema Selbstwert', u: G('thema/selbstwert') }, PODCAST] },
  'sinn-im-leben-was-studien-zeigen': { links: [{ p: OB, t: 'Sinn im Leben und Sterblichkeit: Was eine Meta-Analyse zeigt', u: O('lebenssinn-und-sterblichkeit-was-eine-meta-analyse-zeigt') }, ORI, SKZ, PODCAST] },
  'ziele-erreichen-fortschritt-beobachten': { links: [FORT, { p: OB, t: 'Wenn-Dann-Pläne: von der Absicht zur Handlung', u: O('wenn-dann-plaene-von-der-absicht-zur-handlung') }, { p: CG, t: 'Selbstführung lernen', u: W('selbstfuehrung-lernen-was-es-bedeutet-und-wie-du-anfaengst') }, PODCAST], ctx: [['Fortschrittsbeobachtung', FORT.u]].filter(() => false) },
  'ziele-setzen-was-die-zielsetzungsforschung-zeigt': { links: [{ p: OB, t: 'Zielsetzung: 35 Jahre Forschung zur Zieltheorie', u: O('zielsetzung-35-jahre-forschung-zur-zieltheorie') }, SKZ, ORI, PODCAST] },
  'selbstgespraech-dritte-person-distanz-zu-sich-selbst': { links: [{ p: OB, t: 'Selbstgespräch in der dritten Person: Was sieben Studien zeigen', u: O('selbstgespraech-in-der-dritten-person-was-sieben-studien-zeigen') }, EMO, EIU, GKG] }
};
