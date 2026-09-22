// Inhalte · Quelle: Kontextdatei 17.09.2026 (Abschnitte 6 und 7) und die Claude-Design-Exporte S01 bis S04.
// (W) = von stadtwerke-bonn.de, vor Freigabe beim Kunden bestätigen · (F) = fachlich freizugeben.
import type { TopicId } from '../store'

export type AnswerForm =
  | { kind: 'yesno' }
  | { kind: 'tiles'; options: string[]; big?: boolean; meta?: Record<string, { icon: string; sub: string }> }
  | { kind: 'arc'; min: number; max: number; unit: string; label: string }

export type LockQuestion = {
  id: string
  topic: TopicId
  kicker: string
  q: string
  form: AnswerForm
  truth: string | number
  fact: string
  meaning: string
  chip: string
}

// Fragen zu Wärmepumpe aus der Kontextdatei; Photovoltaik, E-Mobilität, Strom und Fernwärme
// aus 10_Research/20260915_SWB-Stele_Research_SWB-Produktfakten.md (alle W). Die Reihenfolge
// mischt die Themen, damit die Fragenreihe auf S01 nicht nur Wärmepumpe zeigt. Die erste
// Frage ist die Schätzfrage mit dem Bogen-Regler, sie steht beim Start in der Hauptkarte.
export const LOCK_QUESTIONS: LockQuestion[] = [
  { id: 'kwh', topic: 'waermepumpe', kicker: 'Heizen · Wärmepumpe', q: 'Aus 1 kWh Strom werden wie viel kWh Wärme?',
    form: { kind: 'arc', min: 0, max: 6, unit: 'kWh Wärme', label: 'Ihre Schätzung' }, truth: 4,
    fact: 'Rund 4 kWh.', meaning: '75 % der Wärme kommen aus der Umwelt, nur 25 % aus Strom.', chip: '1 kWh Strom, rund 4 kWh Wärme' },
  { id: 'laut', topic: 'waermepumpe', kicker: 'Heizen · Wärmepumpe', q: 'Wie laut ist eine Wärmepumpe? Was glauben Sie?',
    form: { kind: 'tiles', options: ['Flüstern', 'Kühlschrank', 'Staubsauger', 'Rasenmäher'], big: true, meta: {
      'Flüstern': { icon: 'x_whisper', sub: 'etwa 30 dB' }, 'Kühlschrank': { icon: 'x_fridge', sub: 'etwa 40 dB' },
      'Staubsauger': { icon: 'x_vacuum', sub: 'etwa 70 dB' }, 'Rasenmäher': { icon: 'x_mower', sub: 'etwa 90 dB' } } }, truth: 'Kühlschrank',
    fact: 'Etwa so laut wie ein Kühlschrank.', meaning: 'Im Garten und beim Nachbarn fällt sie kaum auf.', chip: 'So leise wie ein Kühlschrank' },
  { id: 'pv_anteil', topic: 'photovoltaik', kicker: 'Eigenstrom · Photovoltaik', q: 'Wie viel Ihres Strombedarfs deckt ein Solardach?',
    form: { kind: 'tiles', options: ['30 %', '50 %', '70 %', '90 %'] }, truth: '70 %',
    fact: 'Bis zu 70 %.', meaning: 'Mit Speicher deckt das eigene Dach bis zu 70 % Ihres Strombedarfs.', chip: 'Bis zu 70 % Eigenstrom' },
  { id: 'frost', topic: 'waermepumpe', kicker: 'Heizen · Wärmepumpe', q: 'Heizt eine Wärmepumpe auch bei minus 20 Grad?', form: { kind: 'yesno' }, truth: 'Ja',
    fact: 'Ja.', meaning: 'Auch bei starkem Frost holt sie genug Wärme aus der Luft.', chip: 'Heizt auch bei Frost' },
  { id: 'ev_netz', topic: 'emobilitaet', kicker: 'Mobilität · E-Auto laden', q: 'Wallbox angemeldet: Wie viel Netzentgelt sparen Sie im Jahr?',
    form: { kind: 'tiles', options: ['10 €', '50 €', '100 €', '500 €'] }, truth: '100 €',
    fact: 'Mindestens 100 Euro im Jahr.', meaning: 'Wer die Wallbox steuerbar anmeldet, zahlt weniger Netzentgelt.', chip: 'Mindestens 100 € weniger Netzentgelt' },
  { id: 'strom_bonus', topic: 'strom', kicker: 'Strom & Tarif', q: 'Wie viel Neukundenbonus gibt es beim Stromwechsel?',
    form: { kind: 'tiles', options: ['30 €', '80 €', '130 €', '200 €'] }, truth: '130 €',
    fact: '130 Euro.', meaning: 'Beim Wechsel zu Beethoven Strom, lokal und mit Preisgarantie.', chip: '130 € Neukundenbonus' },
  { id: 'altbau', topic: 'waermepumpe', kicker: 'Heizen · Wärmepumpe', q: 'Wärmepumpe im Altbau — geht das?', form: { kind: 'yesno' }, truth: 'Ja',
    fact: 'In den meisten Fällen ja.', meaning: 'Nach gründlicher Prüfung funktioniert sie in den meisten Altbauten.', chip: 'Auch im Altbau' },
  { id: 'pv_genehmigung', topic: 'photovoltaik', kicker: 'Eigenstrom · Photovoltaik', q: 'Braucht ein Solardach eine Baugenehmigung?', form: { kind: 'yesno' }, truth: 'Nein',
    fact: 'Nein.', meaning: 'Hauseigentümer können ohne Genehmigung loslegen.', chip: 'Solardach ohne Genehmigung' },
  { id: 'gas', topic: 'waermepumpe', kicker: 'Heizen · Wärmepumpe', q: 'Gas oder Wärmepumpe: Wer heizt günstiger?',
    form: { kind: 'tiles', options: ['Gas', 'Wärmepumpe'] }, truth: 'Wärmepumpe',
    fact: 'Die Wärmepumpe.', meaning: 'Vor allem, weil sie den Großteil der Wärme aus der Umwelt holt.', chip: 'Günstiger als Gas' },
  { id: 'ev_laden', topic: 'emobilitaet', kicker: 'Mobilität · E-Auto laden', q: 'Was kostet eine kWh an der SWB-Ladesäule?',
    form: { kind: 'tiles', options: ['29 ct', '39 ct', '49 ct', '59 ct'] }, truth: '49 ct',
    fact: '49 Cent pro kWh.', meaning: 'An den öffentlichen Ladesäulen der Stadtwerke, mit Karte oder App.', chip: '49 ct je kWh unterwegs' },
  { id: 'fbh', topic: 'waermepumpe', kicker: 'Heizen · Wärmepumpe', q: 'Braucht eine Wärmepumpe zwingend Fußbodenheizung?', form: { kind: 'yesno' }, truth: 'Nein',
    fact: 'Nein.', meaning: 'Große Plattenheizkörper reichen oft aus.', chip: 'Keine Fußbodenheizung nötig' },
  { id: 'fw_netz', topic: 'fernwaerme', kicker: 'Heizen · Fernwärme', q: 'Wie lang ist das Bonner Fernwärmenetz?',
    form: { kind: 'tiles', options: ['25 km', '125 km', '250 km', '500 km'] }, truth: '125 km',
    fact: 'Rund 125 Kilometer.', meaning: 'Und es soll auf etwa 250 Kilometer wachsen.', chip: '125 km Fernwärmenetz' },
  { id: 'strom_garantie', topic: 'strom', kicker: 'Strom & Tarif', q: 'Wie lange gilt die Preisgarantie bei Beethoven Strom?',
    form: { kind: 'tiles', options: ['6 Monate', '12 Monate', '24 Monate', '36 Monate'] }, truth: '12 Monate',
    fact: '12 Monate.', meaning: 'Lokal, ökologisch und mit fester Preisgarantie.', chip: '12 Monate Preisgarantie' },
]

export type Topic = { id: TopicId; label: string; nav: string; icon: string; acc: string; anlass: string; sub: string; hasPage: boolean }

export const TOPICS: Topic[] = [
  { id: 'waermepumpe', label: 'Wärmepumpe', nav: 'Wärmepumpe', icon: 'ds_heating', acc: 'var(--brand-700)', anlass: 'Heizen', sub: 'Heizen mit Umweltwärme', hasPage: true },
  { id: 'photovoltaik', label: 'Photovoltaik', nav: 'Photovoltaik', icon: 'ds_photovoltaik', acc: 'var(--accent-600)', anlass: 'Eigenstrom', sub: 'Solarstrom vom eigenen Dach', hasPage: false },
  { id: 'emobilitaet', label: 'E-Mobilität', nav: 'E-Mobilität', icon: 'ds_wallbox', acc: 'var(--brand-500)', anlass: 'Mobilität', sub: 'E-Auto zu Hause laden', hasPage: false },
  { id: 'strom', label: 'Strom & Tarif', nav: 'Strom & Tarif', icon: 'ds_electricity', acc: 'var(--brand-800)', anlass: 'Strom & Tarif', sub: 'Passenden Tarif finden', hasPage: false },
  { id: 'fernwaerme', label: 'Fernwärme', nav: 'Fernwärme', icon: 'ds_district', acc: 'var(--brand-300)', anlass: 'Heizen', sub: 'Nur in Teilen Bonns verfügbar', hasPage: false },
  { id: 'beraten', label: 'Energieberatung', nav: 'Beraten', icon: 'ds_handshake', acc: 'var(--accent-800)', anlass: 'Beraten', sub: 'Haus modernisieren, Potenzial prüfen', hasPage: false },
  { id: 'kundenservice', label: 'Kundenservice', nav: 'Service', icon: 'ds_contact', acc: 'var(--harmony-800)', anlass: 'Service', sub: 'Rechnung, Zähler, Umzug — wir helfen persönlich', hasPage: false },
]
export const topicById = (id: TopicId) => TOPICS.find((t) => t.id === id)!
export const NAV_TOPICS: TopicId[] = ['waermepumpe', 'photovoltaik', 'emobilitaet', 'strom']

export const RAND = [
  { id: 'wasser', title: 'Wasser', text: 'Trinkwasser aus Bonn: geprüft, regional, jederzeit. Fragen zu Härte, Qualität oder Anschluss beantworten wir am Beratungstisch.' },
  { id: 'foerderungen', title: 'Förderungen', text: 'Zuschüsse für Heizung, Solar und Laden ändern sich oft. Die Beantragung gehört bei uns zum Paket.' },
  { id: 'bonuswelt', title: 'Bonuswelt', text: 'Vorteile für Kundinnen und Kunden der Stadtwerke Bonn: Aktionen, Partnerangebote, Veranstaltungen.' },
  { id: 'events', title: 'Events', text: 'Was im Servicecenter und in Bonn ansteht: Infoabende, Aktionstage, Beratungstermine vor Ort.' },
]

// S02 Wärmepumpe · Sektionen, je in zwei Dichten
export type Section = { id: string; kicker: string; title: string; kompakt: string; ausfuehrlich: string[]; kind?: 'funktion' | 'rechner' | 'eignung' | 'kosten' | 'ablauf' | 'kombi' | 'warum' | 'faq' | 'cta' }

export const S02 = {
  path: ['Themen', 'Heizen', 'Wärmepumpe'],
  claim: '1 kWh Strom erzeugt rund 4 kWh Wärme.',
  anschluss: {
    kwh: 'Sie haben es gerade geschätzt: rund 4 kWh Wärme aus 1 kWh Strom.',
    frost: 'Heizt auch bei Frost. Und rechnet sich.',
    laut: 'So leise wie ein Kühlschrank. Und rechnet sich.',
    default: 'Heizen mit 75 % Energie aus der Umwelt.',
  },
  sections: [
    { id: 'funktion', kind: 'funktion', kicker: 'So funktioniert es', title: 'Wie funktioniert eine Wärmepumpe?',
      kompakt: 'Sie holt Wärme aus der Luft, verdichtet sie und gibt sie ans Haus ab.',
      ausfuehrlich: ['Draußen nimmt die Wärmepumpe Wärme aus der Luft auf, auch bei Frost.', 'Ein Verdichter hebt die Temperatur an; drinnen verteilt der Speicher die Wärme an Heizung und Warmwasser.', 'Aus 1 kWh Strom werden so rund 4 kWh Wärme. (F)'] },
    { id: 'rechner', kind: 'rechner', kicker: 'Ihr Nutzen', title: 'Aus 1 kWh Strom werden rund 4 kWh Wärme',
      kompakt: 'Tippen Sie auf eine Zahl — das Haus füllt sich mit.',
      ausfuehrlich: ['Tippen Sie auf eine Zahl — das Haus füllt sich mit.', '75 % der Wärme kommen aus der Umgebungsluft, nur 25 % werden als Strom zugesetzt. (W)'] },
    { id: 'eignung', kind: 'eignung', kicker: 'Passt das zu mir?', title: 'Passt das zu meinem Haus?',
      kompakt: 'Zwei kurze Fragen, dann Ihr Ergebnis.',
      ausfuehrlich: ['Zwei kurze Fragen, dann Ihr Ergebnis: sehr wahrscheinlich geeignet · lohnt die Prüfung · am besten mit Berater klären.', 'Funktioniert nach gründlicher Prüfung auch in den meisten Altbauten. (W)'] },
    { id: 'kosten', kind: 'kosten', kicker: 'Was kostet das?', title: 'Ab 114 € im Monat',
      kompakt: 'Mieten oder kaufen. Ihr Angebot am Beratungstisch.',
      ausfuehrlich: ['Die Miete ist inklusive Wartung und Vollkasko; am Ende geht die Anlage in Ihren Besitz über. (W)', 'Beispiel, Preisstand 09/2026 — Ihr Angebot am Beratungstisch.', 'Förderung: Bis zu 70 % auf die förderfähigen Kosten. Die Beantragung der Fördermittel gehört zu unserem Rundum-Sorglos-Paket. Details am Beratungstisch. (W)'] },
    { id: 'ablauf', kind: 'ablauf', kicker: 'Wie läuft das?', title: 'Nur 4 Schritte zu Ihrer neuen Wärmepumpe',
      kompakt: 'Anfrage · WP-Check · Planung und Einbau · Wartung.',
      ausfuehrlich: ['1 Ihre Anfrage', '2 Der WP-Check: kostenloser Vorab-Check bei Ihnen zu Hause', '3 Planung und Einbau', '4 Wartungs-Service'] },
    { id: 'kombi', kind: 'kombi', kicker: 'Passt dazu', title: 'Stark in Kombination',
      kompakt: 'Photovoltaik, Wallbox und Ökostrom. Zusätzlicher Bonus — Höhe am Beratungstisch.',
      ausfuehrlich: ['Mit Photovoltaik erzeugen Sie den Strom für die Wärmepumpe selbst.', 'Mit einer Wallbox laden Sie das E-Auto mit demselben Strom.', 'Mit Ökostrom heizen Sie klimafreundlich.', 'Zusätzlicher Bonus in Kombination mit Photovoltaik und Ökostrom — Höhe am Beratungstisch.'] },
    { id: 'warum', kind: 'warum', kicker: 'Warum mit den Stadtwerken Bonn', title: 'Ihr Stadtwerk vor Ort',
      kompakt: 'Über 1.000 Projekte · Vier-Augen-Prinzip · 24-Stunden-Service.',
      ausfuehrlich: ['Verlässlicher Partner: Ihr Stadtwerk vor Ort, über 1.000 Projekte.', 'Durchdachte Planung: Maßgeschneiderte Konzepte, ganzheitliche Energielösung.', 'Vier-Augen-Prinzip (W)', '24-Stunden-Service (W)', 'Wartung und Entsorgung: Entsorgung des alten Heizsystems inklusive. (W)', 'Auch im Altbau: Funktioniert nach gründlicher Prüfung in den meisten Altbauten. (W)'] },
    { id: 'faq', kind: 'faq', kicker: 'Häufige Fragen', title: 'Was Menschen uns fragen',
      kompakt: 'Miete, Hausverkauf, Förderung, Lautstärke, Frost, Heizkörper.',
      ausfuehrlich: [] },
    { id: 'cta', kind: 'cta', kicker: 'Ihr nächster Schritt', title: 'Sprechen Sie uns an — wir sind gleich nebenan.',
      kompakt: 'Kostenlos, unverbindlich, etwa 15 Minuten.',
      ausfuehrlich: ['Kostenlos und unverbindlich.', 'Etwa 15 Minuten am Beratungstisch.', 'Ihr Ergebnis von dieser Stele liegt dann schon vor.'] },
  ] as Section[],
  faq: [
    { q: 'Wie funktioniert das monatliche Mietangebot?', a: 'Sie zahlen eine feste monatliche Rate inklusive Wartung und Vollkasko. Am Ende geht die Anlage in Ihren Besitz über. (W)' },
    { q: 'Was passiert, wenn ich mein Haus verkaufen möchte?', a: 'Der Vertrag kann an die Käuferin oder den Käufer übergehen. Details am Beratungstisch. (W)' },
    { q: 'Kümmern sich die Stadtwerke auch um die KfW-Förderung?', a: 'Ja, die Beantragung der Fördermittel gehört zu unserem Rundum-Sorglos-Paket. (W)' },
    { q: 'Hört man die Wärmepumpe im Garten oder beim Nachbarn?', a: 'Etwa so laut wie ein Kühlschrank. (W)' },
    { q: 'Heizt sie auch, wenn es richtig kalt wird?', a: 'Ja. Auch bei starkem Frost holt sie genug Wärme aus der Luft. (F)' },
    { q: 'Muss ich meine Heizkörper austauschen?', a: 'Nicht zwingend. Große Plattenheizkörper reichen oft aus. (F)' },
    { q: 'Sieht man das Gerät im Garten?', a: 'Die Außeneinheit ist etwa so groß wie eine Mülltonne und lässt sich unauffällig platzieren. (F)' },
    { q: 'Wer hilft, wenn etwas nicht funktioniert?', a: '24-Stunden-Service der Stadtwerke Bonn. (W)' },
  ],
  baujahr: ['vor 1977', 'ab 1977', 'ab 1995', 'Neubau'],
  heizung: ['Gas', 'Öl', 'Fernwärme', 'Strom / andere'],
  eignung(baujahr?: string, heizung?: string) {
    if (!baujahr || !heizung) return undefined
    if (baujahr === 'Neubau' || baujahr === 'ab 1995') return 'Sehr wahrscheinlich geeignet — der kostenlose WP-Check klärt es vor Ort.'
    if (baujahr === 'ab 1977') return 'Lohnt die Prüfung — der kostenlose WP-Check klärt es bei Ihnen zu Hause.'
    return 'Am besten mit Berater klären — auch viele Häuser vor 1977 sind nach Prüfung geeignet.'
  },
}

export const S03 = {
  path: ['Themen', 'Heizen', 'Wärmepumpe', 'Beratung'],
  title: 'Das haben Sie herausgefunden',
  sub: 'Ihr Ergebnis aus dieser Sitzung.',
  empty: 'Sie haben sich die Wärmepumpe angesehen.',
  next: 'Ihr nächster Schritt',
  table: 'Jetzt am Tisch besprechen',
  expect: [
    { icon: 'ds_handshake', text: 'Kostenlos und unverbindlich' },
    { icon: 'x_clock', text: 'Etwa 15 Minuten' },
    { icon: 'ds_mappin', text: 'Direkt hier im Servicecenter' },
  ],
  codeLabel: 'Ihr Code',
  codes: ['Für Elise', 'Mondschein', 'Pastorale', 'Eroica', 'Fidelio'],
  codeText: 'Nennen Sie diesen Code am Tisch, dann starten wir direkt beim Thema.',
  noCode: ['Wenige Meter, rechts im Flur.', 'Sagen Sie einfach „Wärmepumpe".'],
  phone: 'Infos aufs Handy',
  phoneText: 'Kamera öffnen, QR scannen, E-Mail eintragen — fertig.',
  nfc: 'Oder Handy hier anhalten.',
  browse: 'Weiter stöbern',
  privacy: 'Ihre Angaben bleiben nur auf dieser Stele und werden nach der Sitzung gelöscht.',
  end: 'Sitzung beenden',
}

export const S04 = {
  title: 'Was möchten Sie verbessern?',
  zugpferd: { kicker: 'Meistgefragt: Wärmepumpe', title: '1 kWh Strom, rund 4 kWh Wärme' },
  tiles: [
    { topic: 'waermepumpe' as TopicId, title: 'Heizen', sub: 'Heizkosten senken, Heizung erneuern', icon: 'ds_heating', acc: 'var(--brand-700)', tag: 'Meistgefragt' },
    { topic: 'photovoltaik' as TopicId, title: 'Eigenstrom', sub: 'Solarstrom vom eigenen Dach', icon: 'ds_photovoltaik', acc: 'var(--accent-600)', tag: 'Stark mit Wärmepumpe' },
    { topic: 'emobilitaet' as TopicId, title: 'Mobilität', sub: 'E-Auto zu Hause laden', icon: 'ds_wallbox', acc: 'var(--brand-500)', tag: 'Stark mit Wärmepumpe' },
    { topic: 'strom' as TopicId, title: 'Strom & Tarif', sub: 'Passenden Tarif finden', icon: 'ds_electricity', acc: 'var(--brand-800)' },
    { topic: 'beraten' as TopicId, title: 'Beraten', sub: 'Haus modernisieren, Potenzial prüfen', icon: 'ds_handshake', acc: 'var(--accent-800)' },
    { topic: 'kundenservice' as TopicId, title: 'Kundenservice', sub: 'Rechnung, Zähler, Umzug — wir helfen persönlich', icon: 'ds_contact', acc: 'var(--harmony-800)' },
  ],
  heizen: {
    title: 'Wärmepumpe oder Fernwärme?',
    wp: 'Heizt mit Energie aus der Umwelt. Für die meisten Häuser.',
    fw: 'Nur in Teilen Bonns verfügbar. Ob bei Ihnen: am Beratungstisch.',
  },
  ausserdem: 'Weitere\nThemen',
}

export const SYSTEM = {
  timeoutHint: 240,
  timeoutCount: 45,
  resetQ: 'Zum Start zurückkehren?',
  resetNote: 'Diese Stele speichert keine persönlichen Daten.',
  resetYes: 'Ja, zum Start',
  resetNo: 'Abbrechen',
  timeoutTitle: 'Noch da?',
  timeoutText: 'Ohne Berührung kehrt die Stele gleich zum Start zurück.',
  timeoutStay: 'Ja, weiter',
  timeoutReset: 'Zum Start',
  deleted: 'Zurück am Start.',
  berater: 'Berater',
  beraterCta: 'Jetzt mit Berater sprechen',
  summary: 'Zusammenfassung mitnehmen',
  alle: 'Alle Bereiche',
  uebersicht: 'Zur Übersicht',
  zurueck: 'Zurück',
}
