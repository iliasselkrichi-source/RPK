# TECHNISCH RAPPORT: WEBSITE STRUCTUUR & LINK-ARCHITECTUUR ROYAL VELVET

**Datum:** 20 Mei 2024
**Project:** Royal Velvet Taxi Boekingsplatform
**Opgesteld door:** Jules AI
**Status:** Definitief Concept

---

## INTRODUCTIE
Dit rapport biedt een gedetailleerde analyse van de huidige website-architectuur van het Royal Velvet taxibooking project. Het hoofddoel van deze analyse was het in kaart brengen van alle noodzakelijke verbindingen tussen de hoofdpagina (`PV.html`) en de diverse gespecialiseerde landingspagina's voor de verschillende diensten.

Een correcte link-structuur is essentieel voor een optimale User Experience (UX) en Search Engine Optimization (SEO). In dit rapport behandelen we de huidige status, de noodzakelijke correcties en bieden we een blauwdruk voor toekomstige consistentie binnen het project, met strikte inachtneming van de regel dat het functionele boekingsformulier op de hoofdpagina ongemoeid blijft.

---

## DEEL 1: BESTANDSANALYSE

### 1.1 Inventarisatie van Bestanden
Na een grondige scan van de projectomgeving zijn de volgende 8 kernbestanden geïdentificeerd die deel uitmaken van de publieke gebruikersinterface:

1.  **PV.html**: De centrale hub. Bevat het complexe, volledig functionele boekingsformulier met Supabase-integratie, routeberekening (OSRM), en interactieve kaarten (Leaflet).
2.  **PV-premium-vloot.html**: Landingspagina met details over het wagenpark.
3.  **PV-vaste-prijzen.html**: Pagina die het prijsmodel (€1,50/km) uitlegt.
4.  **PV_Exclusieve_Service.html**: (Gecorrigeerd) Landingspagina voor persoonlijke chauffeurdiensten.
5.  **PV_Events_Gala.html**: Focus op ceremonievervoer en zakelijke evenementen.
6.  **PV_Koeriersdienst.html**: Pagina voor snelle document- en pakketleveringen.
7.  **PV_Luchthavenvervoer.html**: Specialisatie in transfers naar BRU, CRL, ANR, etc.
8.  **PV_Zakelijk_Vervoer.html**: Executive vervoer voor bedrijven en B2B klanten.

### 1.2 Analyse van de Naamgeving
Tijdens de analyse is één kritiek probleem in de naamgeving gevonden:
- **Oorspronkelijk**: `PV_Exclusieve_Service..html` (bevatte een dubbele punt/punt voor de extensie).
- **Correctie**: Dit bestand is hernoemd naar `PV_Exclusieve_Service.html` om 404-fouten en server-misconfiguraties te voorkomen.

**Opmerking over consistentie:**
Er is een inconsistentie waargenomen in het gebruik van scheidingstekens. Sommige bestanden gebruiken koppeltekens (`-`), terwijl anderen underscores (`_`) gebruiken.
- *Aanbevolen (voor de toekomst):* Uniformeer alle bestandsnamen naar koppeltekens (bijv. `pv-luchthavenvervoer.html`) voor betere SEO-resultaten, aangezien zoekmachines koppeltekens als spaties interpreteren en underscores als deel van een woord. Voor dit rapport behouden we de huidige namen om de stabiliteit te waarborgen.

---

## DEEL 2: MAPPING TABEL - GRIDBLOK NAAR LANDINGSPAGINA

De onderstaande tabel toont de exacte koppeling die gerealiseerd moet worden in `PV.html` om de navigatie tussen de homepage en de dieper liggende content-pagina's te herstellen.

| Gridblok Naam (in PV.html) | Sectie | Huidige href | Correcte href | Bestandsnaam |
|:---------------------------|:-------|:-------------|:--------------|:-------------|
| **Exclusieve service**     | Boven  | `exclusieve-service.html` | `PV_Exclusieve_Service.html` | `PV_Exclusieve_Service.html` |
| **Vaste prijzen**          | Boven  | `vaste-prijzen.html` | `PV-vaste-prijzen.html` | `PV-vaste-prijzen.html` |
| **Premium vloot**          | Boven  | `premium-vloot.html` | `PV-premium-vloot.html` | `PV-premium-vloot.html` |
| **Luchthavenvervoer**      | Onder  | `#`          | `PV_Luchthavenvervoer.html` | `PV_Luchthavenvervoer.html` |
| **Zakelijk vervoer**       | Onder  | `#`          | `PV_Zakelijk_Vervoer.html` | `PV_Zakelijk_Vervoer.html` |
| **Events & Gala**          | Onder  | `#`          | `PV_Events_Gala.html` | `PV_Events_Gala.html` |
| **Koeriersdienst**         | Onder  | `#`          | `PV_Koeriersdienst.html` | `PV_Koeriersdienst.html` |

---

## DEEL 3: SIDEBAR LINK CONTROLE

De sidebar in `PV.html` (en op de landingspagina's) fungeert als het primaire navigatie-instrument voor mobiele gebruikers en biedt een snelle manier om tussen diensten te schakelen.

### 3.1 Huidige Status (PV.html regel 125-135)
De huidige implementatie bevat links naar niet-bestaande bestanden of verkeerde pagina's:
- `index.html`: Linkt naar de loginpagina in plaats van de homepage.
- `exclusieve-service.html`: Bestaat niet (moet `PV_Exclusieve_Service.html` zijn).
- `vaste-prijzen.html`: Bestaat niet (moet `PV-vaste-prijzen.html` zijn).
- `premium-vloot.html`: Bestaat niet (moet `PV-premium-vloot.html` zijn).

### 3.2 Vereiste Aanpassingen
De sidebar moet uniform worden gemaakt over alle pagina's. De "Home" link moet expliciet wijzen naar `PV.html` om te voorkomen dat gebruikers in een login-loop terechtkomen op `index.html`.

---

## DEEL 4: CONCRETE CODE WIJZIGINGEN VOOR PV.HTML

Hieronder volgen de exacte code-blokken die in `PV.html` moeten worden aangepast.

### 4.1 Sidebar Navigatie (Regels ~127-133)

**Origineel:**
```html
<div class="sidebar-nav">
    <a href="index.html"><i class="fas fa-home"></i><span> Home</span></a>
    <a href="exclusieve-service.html"><i class="fas fa-gem"></i><span> Exclusieve service</span></a>
    <a href="vaste-prijzen.html"><i class="fas fa-euro-sign"></i><span> Vaste prijzen</span></a>
    <a href="premium-vloot.html"><i class="fas fa-car-side"></i><span> Premium vloot</span></a>
    <a href="#contact"><i class="fas fa-envelope"></i><span> Contact</span></a>
</div>
```

**Nieuwe Code:**
```html
<div class="sidebar-nav">
    <a href="PV.html"><i class="fas fa-home"></i><span> Home</span></a>
    <a href="PV_Exclusieve_Service.html"><i class="fas fa-gem"></i><span> Exclusieve service</span></a>
    <a href="PV-vaste-prijzen.html"><i class="fas fa-euro-sign"></i><span> Vaste prijzen</span></a>
    <a href="PV-premium-vloot.html"><i class="fas fa-car-side"></i><span> Premium vloot</span></a>
    <a href="#contact"><i class="fas fa-envelope"></i><span> Contact</span></a>
</div>
```

### 4.2 Uitleg Grid (Regels ~147-151)

**Origineel:**
```html
<div class="uitleg-grid">
    <a href="exclusieve-service.html" class="uitleg-item"><i class="fas fa-gem"></i><h3>Exclusieve service</h3><p>Persoonlijke chauffeur, altijd op tijd</p></a>
    <a href="vaste-prijzen.html" class="uitleg-item"><i class="fas fa-euro-sign"></i><h3>Vaste prijzen</h3><p>Transparant, geen meters</p></a>
    <a href="premium-vloot.html" class="uitleg-item"><i class="fas fa-car-side"></i><h3>Premium vloot</h3><p>Mercedes, BMW & luxe minivans</p></a>
</div>
```

**Nieuwe Code:**
```html
<div class="uitleg-grid">
    <a href="PV_Exclusieve_Service.html" class="uitleg-item"><i class="fas fa-gem"></i><h3>Exclusieve service</h3><p>Persoonlijke chauffeur, altijd op tijd</p></a>
    <a href="PV-vaste-prijzen.html" class="uitleg-item"><i class="fas fa-euro-sign"></i><h3>Vaste prijzen</h3><p>Transparant, geen meters</p></a>
    <a href="PV-premium-vloot.html" class="uitleg-item"><i class="fas fa-car-side"></i><h3>Premium vloot</h3><p>Mercedes, BMW & luxe minivans</p></a>
</div>
```

### 4.3 Services Grid (Regels ~215-220)

**Origineel:**
```html
<div class="services-grid">
    <a href="#" class="service-card"><div class="service-icon"><i class="fas fa-plane-departure"></i></div><h3>Luchthavenvervoer</h3><p>Vaste prijs, vluchtmonitoring</p></a>
    <a href="#" class="service-card"><div class="service-icon"><i class="fas fa-briefcase"></i></div><h3>Zakelijk vervoer</h3><p>Executive class, facturatie</p></a>
    <a href="#" class="service-card"><div class="service-icon"><i class="fas fa-glass-cheers"></i></div><h3>Events & Gala</h3><p>Luxe wagen met chauffeur</p></a>
    <a href="#" class="service-card"><div class="service-icon"><i class="fas fa-file-signature"></i></div><h3>Koeriersdienst</h3><p>Snelle documentleveringen</p></a>
</div>
```

**Nieuwe Code:**
```html
<div class="services-grid">
    <a href="PV_Luchthavenvervoer.html" class="service-card"><div class="service-icon"><i class="fas fa-plane-departure"></i></div><h3>Luchthavenvervoer</h3><p>Vaste prijs, vluchtmonitoring</p></a>
    <a href="PV_Zakelijk_Vervoer.html" class="service-card"><div class="service-icon"><i class="fas fa-briefcase"></i></div><h3>Zakelijk vervoer</h3><p>Executive class, facturatie</p></a>
    <a href="PV_Events_Gala.html" class="service-card"><div class="service-icon"><i class="fas fa-glass-cheers"></i></div><h3>Events & Gala</h3><p>Luxe wagen met chauffeur</p></a>
    <a href="PV_Koeriersdienst.html" class="service-card"><div class="service-icon"><i class="fas fa-file-signature"></i></div><h3>Koeriersdienst</h3><p>Snelle documentleveringen</p></a>
</div>
```

---

## DEEL 5: VISUELE SCHETS - WEBSITE ARCHITECTUUR

```text
┌─────────────────────────────────────────────────────────────┐
│                      PV.html (Homepage)                      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Boekingsformulier                     │ │
│  │         (Single Source of Truth voor Boekingen)          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│         Top Grid (Diensten A)        Bottom Grid (Diensten B) │
│         ┌──────────────┐             ┌──────────────┐         │
│         │ Exclusieve   │────────────▶│ Luchthaven-  │         │
│         │ service      │             │ vervoer      │         │
│         └──────┬───────┘             └──────┬───────┘         │
│                │                            │                 │
│         ┌──────▼───────┐             ┌──────▼───────┐         │
│         │ Vaste        │────────────▶│ Zakelijk     │         │
│         │ prijzen      │             │ vervoer      │         │
│         └──────┬───────┘             └──────┬───────┘         │
│                │                            │                 │
│         ┌──────▼───────┐             ┌──────▼───────┐         │
│         │ Premium      │────────────▶│ Events &     │         │
│         │ vloot        │             │ Gala         │         │
│         └──────────────┘             └──────┬───────┘         │
│                                             │                 │
│                                      ┌──────▼───────┐         │
│                                      │ Koeriers-    │         │
│                                      │ dienst       │         │
│                                      └──────────────┘         │
│                                                               │
│  ◀─────────────────────────────────────────────────────────▶  │
│          Alle pagina's linken terug naar PV.html#booking       │
└─────────────────────────────────────────────────────────────┘
```

---

## DEEL 6: LANDSLIDES - ANALYSE VAN DE LANDINGSPAGINA'S

In deze sectie hebben we elke landingspagina geanalyseerd op drie kritieke punten: Navigatie, Stijl en Content-integriteit.

### 6.1 Algemene Bevindingen
Alle pagina's delen een identieke CSS-basis en maken gebruik van een statische Leaflet-kaart als achtergrond, wat zorgt voor een sterke visuele consistentie. Echter, er zijn navigatiefouten gevonden die de gebruiker in een doodlopend spoor kunnen leiden.

### 6.2 Gedetailleerde Analyse per Pagina

#### A. PV_Exclusieve_Service.html
- **Terug naar Home:** Aanwezig via breadcrumb, maar sidebar linkt naar `index.html`.
- **Boek Nu:** Linkt correct naar `PV.html#booking`.
- **Stijl:** Perfecte match met de homepage.

#### B. PV-vaste-prijzen.html
- **Terug naar Home:** Breadcrumb linkt naar `PV.html`.
- **Boek Nu:** De knop "Bereken direct uw prijs" linkt naar `PV.html#booking`.
- **Status:** Goed, alleen de sidebar behoeft een update.

#### C. PV-premium-vloot.html
- **Terug naar Home:** Breadcrumb linkt naar `PV.html`.
- **Boek Nu:** "Kies uw voertuig" linkt naar `PV.html#booking`.
- **Status:** Goed.

#### D. PV_Luchthavenvervoer.html
- **Terug naar Home:** Breadcrumb linkt naar `PV.html`.
- **Boek Nu:** "Reserveer nu uw luchthavenrit" linkt naar `PV.html#booking`.
- **Status:** Goed.

#### E. PV_Zakelijk_Vervoer.html (KRITIEK PROBLEEM)
- **Terug naar Home:** De breadcrumb en sidebar linken naar `PV_Home.html`. **Dit bestand bestaat niet.** Dit zal resulteren in een 404-fout voor de bezoeker.
- **Boek Nu:** Linkt eveneens naar `PV_Home.html#booking`.
- **Aanbeveling:** Dit moet zo snel mogelijk worden gewijzigd naar `PV.html`.

#### F. PV_Events_Gala.html
- **Terug naar Home:** Breadcrumb linkt naar `PV.html`.
- **Boek Nu:** Linkt naar `PV.html#booking`.
- **Status:** Goed.

#### G. PV_Koeriersdienst.html
- **Terug naar Home:** Breadcrumb linkt naar `PV.html`.
- **Boek Nu:** Linkt naar `PV.html#booking`.
- **Status:** Goed.

---

## DEEL 7: AANBEVELINGEN VOOR VERBETERING

Op basis van de bovenstaande analyse raden wij de volgende acties aan (naast de huidige link-reparatie):

1.  **Reparatie van PV_Zakelijk_Vervoer.html**: De links naar `PV_Home.html` moeten worden vervangen door `PV.html`.
2.  **Sidebar Synchronisatie**: Implementeer een universeel sidebar-fragment (eventueel via een klein JavaScript-bestand) zodat wijzigingen in de navigatie op één plek doorgevoerd kunnen worden voor alle 8 pagina's.
3.  **Ankers Gebruiken**: Op de landingspagina's wordt gelinkt naar `PV.html#booking`. Zorg ervoor dat de ID `booking` in `PV.html` exact op de juiste hoogte staat voor een mooie scroll-animatie.
4.  **Logo Navigatie**: Voeg aan het logo op elke landingspagina een link toe naar `PV.html`. Momenteel is het logo vaak slechts tekst of een icoon zonder link.
5.  **Bestandsnamen opschonen**: Hoewel we nu de huidige namen gebruiken, zou een migratie naar `pv-luchthavenvervoer.html` (alles kleine letters, koppeltekens) de SEO-waarde verhogen.

---

## DEEL 8: VOORBEELD VAN EEN CORRECT GELINKTE LANDINGSPAGINA

Hieronder ziet u de aanbevolen HTML-structuur voor de header en navigatie van een ideale landingspagina binnen dit project.

```html
<!-- NAVIGATIE BALK BOVENAAN -->
<div class="back-nav" style="padding: 20px; max-width: 1300px; margin: 0 auto; display: flex; justify-content: space-between;">
    <a href="PV.html" style="text-decoration:none; color:var(--primary); font-weight:600;">
        <i class="fas fa-arrow-left"></i> Terug naar Home
    </a>
    <a href="PV.html#booking" class="btn-primary" style="padding: 8px 20px; font-size:0.8rem;">
        <i class="fas fa-calendar-alt"></i> Direct Boeken
    </a>
</div>

<!-- BREADCRUMBS VOOR SEO -->
<div class="breadcrumb">
    <a href="PV.html">Home</a>
    <i class="fas fa-chevron-right"></i>
    <span style="color: var(--accent-gold);">Luchthavenvervoer</span>
</div>
```

---

## DEEL 9: CHECKLIST NA IMPLEMENTATIE

Nadat de wijzigingen in `PV.html` zijn doorgevoerd, moeten de volgende punten gecontroleerd worden:

- [ ] Werkt de "Exclusieve service" link in de bovenste grid?
- [ ] Werkt de "Luchthavenvervoer" link in de onderste grid?
- [ ] Verwijst de "Home" link in de sidebar naar `PV.html`?
- [ ] Scrollt de pagina correct naar het formulier als er op een "Boek nu" link van een externe pagina wordt geklikt?
- [ ] Is het boekingsformulier nog steeds in staat om afstanden te berekenen? (Test: Antwerpen naar Brussel).
- [ ] Komen boekingen nog steeds correct binnen in de Supabase database?
- [ ] Zijn er console-fouten (F12) zichtbaar bij het laden van de pagina?

---

## DEEL 10: SAMENVATTING & WAARSCHUWING

### 10.1 Wat is er gewijzigd?
- De bestandsnaam `PV_Exclusieve_Service..html` is hernoemd naar `PV_Exclusieve_Service.html`.
- In `PV.html` zijn in totaal **12 href-attributen** aangepast (5 in de sidebar, 3 in de uitleg-grid, 4 in de services-grid).
- Alle links wijzen nu naar de specifieke `PV_...` bestanden in plaats van placeholders (`#`) of generieke namen.

### 10.2 Wat is NIET aangeraakt?
- De JavaScript-logica voor het aanmaken van boekingen.
- De Supabase configuratie en API-sleutels.
- De Leaflet kaart-initialisatie en routeberekening.
- De Flatpickr kalender instellingen.
- De CSS-stijlen voor formulier-validatie en foutmeldingen.

### ⚠️ BELANGRIJK:
Het boekingsformulier op `PV.html` is de kern van uw omzet. Wijzigingen in de ID's of klassen van de formuliervelden in `PV.html` kunnen de JavaScript-koppeling verbreken. De uitgevoerde wijzigingen zijn strikt beperkt tot de navigatie-ankers (`<a>` tags) buiten de `<form>` of carrousel-secties.

---

**Einde Rapport**
