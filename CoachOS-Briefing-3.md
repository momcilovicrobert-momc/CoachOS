# CoachOS — Claude Code Briefing

## Projekt
CoachOS je PWA coaching platforma za osebnega trenerja Roberta.
GitHub repo: `momcilovicrobert-momc/CoachOS`
Hosting: GitHub Pages

## Fajli
- `coachos-coach.html` — stari coach dashboard (deprecated)
- `dashboard-v2.html` — AKTIVNI coach dashboard (PRIMARNA STRAN!)
- `coachos-template.html` — template za nove kliente
- `coachos-eli.html` / `coachos-hana.html` / `coachos-nina.html` / `coachos-niko.html` / `coachos-janja.html` / `coachos-tamara.html`
- `coachos-pain-tracker.html`
- `images/clients/` — slike klientov

## Aktivni klienti (6)
| Ime | Status | Opomba |
|-----|--------|--------|
| Eli | Aktivna | Izkušena, gym |
| Hana | Aktivna | Displazija kolkov |
| Nina | Aktivna | Morda localStorage problem |
| Niko | Program only | 17 let, boks+gym |
| Janja | Program only | Nova |
| Tamara | Program only | 51 let, menopauza, ankle injury, kontakt samo prek Hane |

## Backend
**Google Sheets ID:** `1yEUOOHOQcd8MY9TB4_ohGTj0ijZhwqQbclqBryqv5i8`

**Apps Script URL:**
`https://script.google.com/macros/s/AKfycbwdx8hU4EqHM6Ot5swbPmMl-h6PwR78GiyR-s4yd1ysx6CieRrJjQYa1SB6Alcmw4gh/exec`

**Apps Script — aktivni endpointi (april 2026):**
- `getLog` — trening logi
- `getWeight` — teža
- `getCheckins` ✅ novo — check-in podatki
- `getMeasurements` ✅ novo — telesne mere
- `getProgram` — program

## ⚠️ KRITIČNO — Sheet struktura je NAPAČNA (v popravljanju!)

Trenutni Sheet zavihki so zgrajeni za trening loge, ne za check-ine in mere.

**Napačna trenutna struktura:**
- `[Ime]_checkin`: wellbeing vrednost se shranjuje v stolpec `Teža`, emoji v `RPE`
- `[Ime]_mere`: pas/boki/prsi/stegna se shranjujejo v stolpce `Serije/Ponovitve/Teža/RPE`

**To je aktivna naloga — struktura se bo spremenila!**
Ko delaš na check-in ali mere funkcionalnosti, najprej preveri dejansko strukturo v Sheets preden predpostaviš stolpce.

**Pravilna struktura zavihkov (cilj):**
- `[Ime]` — trening log: Datum, Trening, Vaja, Serije, Ponovitve, Teža, RPE, Opomba
- `[Ime]_teza` — teža: Datum, Teža
- `[Ime]_checkin` — check-in: Datum, Wellbeing, Sleep, Opomba (stolpci v popravljanju)
- `[Ime]_program` — program definicija
- `[Ime]_mere` — mere: Datum, Pas, Boki, Prsi, Stegna (stolpci v popravljanju)

**Volumen = Serije × Ponovitve × Teža** (glavna metrika napredka — samo za trening log!)

## Fix Workflow (POMEMBNO!)
1. Vedno delaj iz zadnjega fajla v repotu
2. Samo specifičen fix — nič drugega!
3. Po fiku → Robert puša z GitHub Desktop

## Znani bugi / TODO
- ⚠️ Sheet restrukturiranje — checkin + mere stolpci (PRIORITETA)
- SVG `var(--teal)` ne dela v stroke atributu v hex gridu (dashboard-v2)
- Timezone SLO bug v heatmapu (dashboard-v2)
- `#m-rpe` element — preveriti ali je dodan ali odstranjen
- Exercise progress grafi morda ne delajo za bodyweight/rep-only vaje
- Datumi nedosledni (ISO vs samo datum) — normalizirati
- Apps Script datum-sort trigger — dodat
- Nina: preveriti localStorage

## Dizajn — klientske strani
- Temna tema, mobile-first
- Vsi stili embedded v HTML (flat struktura, brez ločenih CSS/JS fajlov)

## Dizajn — dashboard-v2.html (DRUGAČEN STIL — BERI POZORNO!)

> ⚠️ `dashboard-v2.html` ima popolnoma drugačen vizualni stil kot vse ostale strani. "Flat dark tema" velja SAMO za klientske strani — NE za dashboard-v2.

**Vizualna referenca:** slika `11400.png` (priložena v Code tabu)

**Stil:**
- Space / nebula ozadje — globoka vijolična, modra, temno-zelena, z glow efekti
- Glowing elementi — neon robovi, svetleče barve (ne flat, ne solid)
- 3D izgled — sence, globina, ne flat
- JARVIS / cyberpunk estetika

**Layout (levo → center → desno):**
- 🔷 **Levo** — Hex grid z imeni klientov (ELI, HANA...) + check-in barva + klik za detail
- 🫀 **Center** — Body model z RPE barvami po mišičnih skupinah, BFP, Recovery, mere (tanke SVG črte)
- ❤️ **Zgoraj sredina** — AVG Heart Rate + Last Check-In (Sleep, Wellbeing, Opomba)
- 💪 **Zgoraj desno** — Workout Intensity
- 📊 **Desno** — Monthly Volume graf
- 📋 **Spodaj levo** — Recent Activity (ime + datum)
- 🟢 **Dno** — System Status bar

**Navodilo za CSS:**
Ko delaš na `dashboard-v2.html` — **ignoriraj obstoječ CSS popolnoma**.
Napiši nov `<style>` blok od nič. Edina referenca je slika `11400.png`.
Funkcionalnost (JS, fetch, podatki) ostane nedotaknjena — samo vizualni sloj se zamenja.
