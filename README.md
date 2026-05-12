<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ryzen Ecosystem - README</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: #f6f8fa;
            color: #1f2328;
            line-height: 1.5;
            padding: 40px 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 40px 48px;
        }

        /* Typografie */
        h1 {
            font-size: 2rem;
            border-bottom: 1px solid #d0d7de;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
        }

        h2 {
            font-size: 1.5rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
            padding-bottom: 0.3rem;
            border-bottom: 1px solid #d0d7de;
        }

        h3 {
            font-size: 1.2rem;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
        }

        p {
            margin-bottom: 1rem;
        }

        /* Badges */
        .badges {
            margin-bottom: 1.5rem;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-right: 8px;
            margin-bottom: 8px;
        }

        .badge-blue { background: #1f883d; color: white; }
        .badge-green { background: #2da44e; color: white; }
        .badge-orange { background: #d97917; color: white; }
        .badge-gray { background: #57606a; color: white; }

        /* Tabellen */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }

        th, td {
            border: 1px solid #d0d7de;
            padding: 10px 12px;
            text-align: left;
        }

        th {
            background: #f6f8fa;
            font-weight: 600;
        }

        /* Code blokken */
        pre {
            background: #f6f8fa;
            border-radius: 8px;
            padding: 16px;
            overflow-x: auto;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            font-size: 0.85rem;
            margin: 1rem 0;
            border: 1px solid #d0d7de;
        }

        code {
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 0.85rem;
            background: #f6f8fa;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
        }

        pre code {
            background: none;
            padding: 0;
        }

        /* Lijsten */
        ul, ol {
            margin: 1rem 0;
            padding-left: 2rem;
        }

        li {
            margin: 0.25rem 0;
        }

        /* Boxes */
        .note-box {
            background: #fff8c5;
            border-left: 4px solid #d4a72c;
            padding: 16px;
            margin: 1rem 0;
            border-radius: 6px;
        }

        .warning-box {
            background: #ffe3e3;
            border-left: 4px solid #cf222e;
            padding: 16px;
            margin: 1rem 0;
            border-radius: 6px;
        }

        /* HR */
        hr {
            border: none;
            border-top: 1px solid #d0d7de;
            margin: 2rem 0;
        }

        /* Footer */
        .footer {
            margin-top: 2rem;
            padding-top: 1rem;
            text-align: center;
            font-size: 0.8rem;
            color: #656d76;
            border-top: 1px solid #d0d7de;
        }

        /* Screenshot placeholder */
        .screenshot-placeholder {
            background: #f6f8fa;
            border: 2px dashed #d0d7de;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            color: #656d76;
            margin: 1rem 0;
        }

        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
            table, th, td {
                font-size: 0.8rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Badges -->
        <div class="badges">
            <span class="badge badge-blue">version 1.0.0</span>
            <span class="badge badge-green">production-ready</span>
            <span class="badge badge-orange">supabase</span>
            <span class="badge badge-gray">MIT License</span>
        </div>

        <!-- Titel -->
        <h1>🚖 Ryzen Ecosystem – Multi-Platform Bedrijfssoftware</h1>

        <p>
            <strong>Drie complete bedrijfsplatforms – één codebase.</strong><br>
            Ryzen is een modulair ecosysteem voor taxi bedrijven, vakantieverhuur en autodealers. 
            Alles draait op Supabase met realtime functionaliteit.
        </p>

        <hr>

        <!-- Inhoudsopgave -->
        <h2>📋 Inhoudsopgave</h2>
        <ul>
            <li><a href="#overzicht">Overzicht</a></li>
            <li><a href="#modules">Modules</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#installatie">Installatie</a></li>
            <li><a href="#configuratie">Configuratie</a></li>
            <li><a href="#database">Database Schema</a></li>
            <li><a href="#bestanden">Bestandsstructuur</a></li>
            <li><a href="#beperkingen">Bekende beperkingen</a></li>
            <li><a href="#licentie">Licentie</a></li>
        </ul>

        <hr>

        <!-- Overzicht -->
        <h2 id="overzicht">🎯 Overzicht</h2>
        <p>
            Ryzen is ontstaan uit de behoefte aan <strong>geïntegreerde bedrijfssoftware</strong> voor drie sectoren. 
            In plaats van drie aparte systemen, is er één ecosysteem gebouwd met gedeelde database.
        </p>

        <table>
            <thead>
                <tr>
                    <th>Probleem</th>
                    <th>Oplossing</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Dure losse abonnementen</td><td>Alles-in-één platform</td></tr>
                <tr><td>Geen realtime updates</td><td>Supabase Realtime</td></tr>
                <tr><td>Tijdrovende admin</td><td>Geautomatiseerde workflows</td></tr>
                <tr><td>Beperkte schaalbaarheid</td><td>Supabase backend</td></tr>
            </tbody>
        </table>

        <hr>

        <!-- Modules -->
        <h2 id="modules">📦 Modules</h2>

        <h3>1. Fleetconnect Taxi 🚖</h3>
        <p><strong>Voor:</strong> Taxibedrijven met 5-50 wagens</p>
        <ul>
            <li>✅ Boekingswebsite (5 stappen met routeberekening)</li>
            <li>✅ Klantportaal met ritgeschiedenis en PDF facturen</li>
            <li>✅ Dispatch paneel voor ritten, chauffeurs en partners</li>
            <li>✅ Financieel dashboard met omzetgrafieken</li>
            <li>✅ CSV/JSON export</li>
        </ul>

        <h3>2. Horizon C2 (Woningen) 🏠</h3>
        <p><strong>Voor:</strong> Vakantieparken, makelaars, vastgoedbeheerders</p>
        <ul>
            <li>✅ Boekingswebsite voor 10+ woningen/units</li>
            <li>✅ Commander beheerpaneel met status workflow</li>
            <li>✅ Taakverdeling aan teamleden (Host, Concierge, Housekeeping)</li>
            <li>✅ Agenda met kalender en afspraken</li>
            <li>✅ Financieel overzicht per team</li>
        </ul>

        <h3>3. Auto Dealer Pro 🚗</h3>
        <p><strong>Voor:</strong> Occasion dealers</p>
        <ul>
            <li>✅ Voorraadbeheer met status (Nieuw/Beschikbaar/Verkocht)</li>
            <li>✅ Verkoopregistratie met winst &amp; marge berekening</li>
            <li>✅ PDF factuur generatie met BTW</li>
            <li>✅ WhatsApp delen van auto's</li>
            <li>✅ CSV export</li>
        </ul>

        <hr>

        <!-- Features (uitgebreid) -->
        <h2 id="features">✨ Features per module</h2>

        <h3>🚖 Taxi Module</h3>
        <table>
            <thead><tr><th>Functionaliteit</th><th>Status</th></tr></thead>
            <tbody>
                <tr><td>Boekingswebsite (5 stappen)</td><td>✅</td></tr>
                <tr><td>Adres autocomplete (Nominatim)</td><td>✅</td></tr>
                <tr><td>Routeberekening (OSRM/GraphHopper)</td><td>✅</td></tr>
                <tr><td>Prijsberekening: €1,50/km</td><td>✅</td></tr>
                <tr><td>Heen/terug rit (2x prijs)</td><td>✅</td></tr>
                <tr><td>Voertuigkeuze (4 types)</td><td>✅</td></tr>
                <tr><td>Extra opties (Meet & Greet, WiFi, etc.)</td><td>✅</td></tr>
                <tr><td>Klantportaal met ritgeschiedenis</td><td>✅</td></tr>
                <tr><td>PDF factuur download</td><td>✅</td></tr>
                <tr><td>Dispatch paneel</td><td>✅</td></tr>
                <tr><td>Chauffeurs & Partners beheer</td><td>✅</td></tr>
                <tr><td>Financieel dashboard</td><td>✅</td></tr>
            </tbody>
        </table>

        <h3>🏠 Woningen Module</h3>
        <table>
            <thead><tr><th>Functionaliteit</th><th>Status</th></tr></thead>
            <tbody>
                <tr><td>Boekingswebsite met 10+ units</td><td>✅</td></tr>
                <tr><td>Check-in / Check-out datum</td><td>✅</td></tr>
                <tr><td>Prijs per nacht</td><td>✅</td></tr>
                <tr><td>Extra diensten (Housekeeping, Ontbijt, Chef)</td><td>✅</td></tr>
                <tr><td>Commander beheerpaneel</td><td>✅</td></tr>
                <tr><td>Status workflow (Nieuw/Bevestigd/Uitgevoerd)</td><td>✅</td></tr>
                <tr><td>Taakverdeling aan teamleden</td><td>✅</td></tr>
                <tr><td>Agenda met kalender</td><td>✅</td></tr>
                <tr><td>Team beheer</td><td>✅</td></tr>
                <tr><td>Financieel per team</td><td>✅</td></tr>
            </tbody>
        </table>

        <h3>🚗 Auto Dealer Module</h3>
        <table>
            <thead><tr><th>Functionaliteit</th><th>Status</th></tr></thead>
            <tbody>
                <tr><td>Voorraadbeheer</td><td>✅</td></tr>
                <tr><td>Verkoopregistratie</td><td>✅</td></tr>
                <tr><td>PDF factuur met BTW</td><td>✅</td></tr>
                <tr><td>Winst &amp; marge berekening</td><td>✅</td></tr>
                <tr><td>WhatsApp delen</td><td>✅</td></tr>
                <tr><td>CSV export</td><td>✅</td></tr>
                <tr><td>Verkopers &amp; Leveranciers beheer</td><td>✅</td></tr>
            </tbody>
        </table>

        <hr>

        <!-- Installatie -->
        <h2 id="installatie">📥 Installatie</h2>

        <h3>Vereisten</h3>
        <ul>
            <li>Supabase account (gratis tier)</li>
            <li>Basiskennis HTML/JavaScript</li>
            <li>Webserver (Netlify/Vercel/GitHub Pages of eigen server)</li>
        </ul>

        <h3>Stap 1: Supabase project aanmaken</h3>
        <ol>
            <li>Ga naar <a href="https://supabase.com">supabase.com</a></li>
            <li>Maak een nieuw project aan</li>
            <li>Noteer je <code>Project URL</code> en <code>anon key</code></li>
        </ol>

        <h3>Stap 2: Database tabellen aanmaken</h3>
        <p>Open de SQL editor in Supabase en voer uit:</p>
        <pre><code>-- Bookings tabel (centraal voor alle modules)
CREATE TABLE bookings (
    id TEXT PRIMARY KEY,
    datetime DATE,
    time TIME,
    name TEXT,
    email TEXT,
    phone TEXT,
    pickup TEXT,
    destination TEXT,
    flight_number TEXT,
    vehicle TEXT,
    extras TEXT,
    amount DECIMAL,
    payment TEXT,
    status TEXT DEFAULT 'pending',
    customer_id TEXT,
    form_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers tabel (voor klantportaal)
CREATE TABLE customers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    phone TEXT,
    password_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners tabel (taxi module)
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    name TEXT,
    contact TEXT,
    email TEXT,
    phone TEXT,
    prefix TEXT
);

-- Drivers tabel (taxi module)
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    subcontractor_id INTEGER,
    driver_code TEXT,
    name TEXT,
    vehicle TEXT,
    license_plate TEXT,
    partner_name TEXT
);

-- Teamleden tabel (woningen module)
CREATE TABLE teamleden (
    id SERIAL PRIMARY KEY,
    naam TEXT,
    telefoon TEXT,
    email TEXT,
    functies TEXT[]
);

-- Boekingen taken (woningen module)
CREATE TABLE boekingen_taken (
    id SERIAL PRIMARY KEY,
    booking_id TEXT,
    taak_naam TEXT,
    team_lid_id INTEGER
);

-- Kalender afspraken (woningen module)
CREATE TABLE kalender_afspraken (
    id SERIAL PRIMARY KEY,
    titel TEXT,
    start_datum TIMESTAMPTZ,
    eind_datum TIMESTAMPTZ,
    type TEXT,
    memo TEXT
);</code></pre>

        <h3>Stap 3: Configuratie aanpassen</h3>
        <p>Open elk HTML bestand en vervang de Supabase gegevens:</p>
        <pre><code>const SUPABASE_URL = 'jouw-project-url';
const SUPABASE_ANON_KEY = 'jouw-anon-key';</code></pre>

        <h3>Stap 4: Bestanden uploaden</h3>
        <p>Upload alle bestanden naar je webserver:</p>
        <ul>
            <li><strong>Netlify:</strong> Drag & drop de map naar <code>netlify.com/drop</code></li>
            <li><strong>Vercel:</strong> <code>vercel --prod</code></li>
            <li><strong>GitHub Pages:</strong> Zet bestanden in <code>docs/</code> folder en enable in settings</li>
        </ul>

        <div class="note-box">
            <strong>💡 Tip:</strong> Start met Netlify – dit is de makkelijkste optie. Je hebt alleen een gratis account nodig.
        </div>

        <hr>

        <!-- Configuratie -->
        <h2 id="configuratie">⚙️ Configuratie</h2>

        <h3>Supabase Auth instellen</h3>
        <ol>
            <li>Ga naar Supabase Dashboard → Authentication → Settings</li>
            <li>Zet "Email" provider aan</li>
            <li>Zet "Auto confirm email" aan (voor testing)</li>
            <li>Voeg redirect URLs toe: <code>https://jouwdomein.be/*</code></li>
        </ol>

        <h3>Bestanden die configuratie nodig hebben</h3>
        <ul>
            <li><code>fleetconnect.html</code> - Taxi boeking</li>
            <li><code>index.html</code> / <code>klantenportaal.html</code> - Klant login/portaal</li>
            <li><code>onderaannemerA.html</code> - Taxi dispatch paneel</li>
            <li><code>commander.html</code> - Woningen beheerpaneel</li>
            <li><code>autodealerpaneel.html</code> - Auto dealer software</li>
            <li><code>admin-index.html</code> - Centrale login hub</li>
            <li><code>Horizon.html</code> / <code>bravo.html</code> - Woningen boekingen</li>
            <li><code>PV.html</code> - Royal Velvet (luxe taxi)</li>
            <li><code>loginfleetconnect.html</code> - Taxi admin login</li>
            <li><code>klantenportaalpv.html</code> - Royal Velvet klantportaal</li>
        </ul>

        <hr>

        <!-- Database Schema -->
        <h2 id="database">📊 Database Schema Diagram</h2>

        <pre><code>┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   customers ◄──────────┐                                        │
│   ┌──────────────┐     │                                        │
│   │ id (PK)      │     │                                        │
│   │ email        │     │                                        │
│   │ name         │     │                                        │
│   │ phone        │     │                                        │
│   └──────────────┘     │                                        │
│                        │                                        │
│   bookings ◄───────────┘                                        │
│   ┌──────────────┐                                              │
│   │ id (PK)      │                                              │
│   │ customer_id  │──┐                                          │
│   │ datetime     │  │                                          │
│   │ pickup       │  │                                          │
│   │ destination  │  │                                          │
│   │ amount       │  │                                          │
│   │ status       │  │                                          │
│   └──────────────┘  │                                          │
│                     │                                          │
│   boekingen_taken ◄─┘                                          │
│   ┌──────────────┐                                              │
│   │ id (PK)      │                                              │
│   │ booking_id   │──┐                                          │
│   │ taak_naam    │  │                                          │
│   │ team_lid_id  │  │                                          │
│   └──────────────┘  │                                          │
│                     │                                          │
│   teamleden ◄───────┘                                          │
│   ┌──────────────┐                                              │
│   │ id (PK)      │                                              │
│   │ naam         │                                              │
│   │ functies     │                                              │
│   └──────────────┘                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘</code></pre>

        <hr>

        <!-- Bestandsstructuur -->
        <h2 id="bestanden">📁 Bestandsstructuur</h2>

        <pre><code>ryzen-ecosysteem/
├── admin-index.html        # Centrale login hub
├── fleetconnect.html       # Taxi boeking
├── onderaannemerA.html     # Taxi dispatch paneel
├── klantenportaal.html     # Taxi klantportaal
├── index.html              # Taxi klant login
├── loginfleetconnect.html  # Taxi admin login
├── commander.html          # Woningen beheerpaneel
├── Horizon.html            # Woningen boeking (Hoofd)
├── bravo.html              # Woningen boeking (Tanger)
├── PV.html                 # Royal Velvet (Luxe taxi)
├── autodealerpaneel.html   # Auto dealer software
├── klantenportaalpv.html   # Royal Velvet klantportaal
├── README.html             # Deze documentatie
└── README.md               # Markdown versie</code></pre>

        <hr>

        <!-- Bekende beperkingen -->
        <h2 id="beperkingen">⚠️ Bekende beperkingen</h2>

        <div class="warning-box">
            <strong>Belangrijk:</strong> Deze beperkingen worden aangepakt in toekomstige versies.
        </div>

        <table>
            <thead>
                <tr>
                    <th>Beperking</th>
                    <th>Impact</th>
                    <th>Fix gepland</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Chauffeurs/partners in localStorage</td><td>Data is niet gedeeld tussen browsers</td><td>Q3 2026</td></tr>
                <tr><td>Geen online betalingen</td><td>Klanten kunnen niet online betalen</td><td>Q3 2026</td></tr>
                <tr><td>Eenvoudige authenticatie</td><td>Alleen email check, geen wachtwoord</td><td>Q3 2026</td></tr>
                <tr><td>Geen live tracking</td><td>Chauffeurs kunnen niet gevolgd worden</td><td>Q4 2026</td></tr>
                <tr><td>Geen mobiele apps</td><td>Alleen web beschikbaar</td><td>Q4 2026</td></tr>
            </tbody>
        </table>

        <hr>

        <!-- Snel starten -->
        <h2>🚀 Snel starten</h2>

        <table>
            <thead><tr><th>Actie</th><th>Bestand</th></tr></thead>
            <tbody>
                <tr><td>Taxi boeking</td><td><code>fleetconnect.html</code></td></tr>
                <tr><td>Admin login</td><td><code>admin-index.html</code></td></tr>
                <tr><td>Dispatch paneel</td><td>Login → Kies "Onderaannemer"</td></tr>
                <tr><td>Woningen beheer</td><td>Login → Kies "Woningen Verhuur"</td></tr>
                <tr><td>Auto dealer</td><td>Login → Kies "Auto Dealer"</td></tr>
                <tr><td>Klantportaal taxi</td><td><code>index.html</code> → inloggen</td></tr>
                <tr><td>Klantportaal Royal Velvet</td><td><code>loginfleetconnect.html</code> → inloggen</td></tr>
            </tbody>
        </table>

        <hr>

        <!-- Licentie -->
        <h2 id="licentie">📄 Licentie</h2>

        <p>
            <strong>MIT License</strong><br><br>
            Copyright (c) 2026 Ryzen Development<br><br>
            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:<br><br>
            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.
        </p>

        <hr>

        <!-- Contact -->
        <h2>📞 Contact</h2>

        <table>
            <thead><tr><th>Vraag</th><th>Contact</th></tr></thead>
            <tbody>
                <tr><td>Technische vragen</td><td><a href="#">[GitHub Issues - vul later in]</a></td></tr>
                <tr><td>Zakelijke vragen</td><td><a href="#">[jouw@email.com - vul later in]</a></td></tr>
                <tr><td>Security issues</td><td><a href="#">[security@email.com - vul later in]</a></td></tr>
            </tbody>
        </table>

        <div class="note-box">
            <strong>📝 Let op:</strong> Vul hierboven je eigen contactgegevens in voordat je dit document deelt.
        </div>

        <!-- Footer -->
        <div class="footer">
            Made with ❤️ by Ryzen Development<br>
            © 2026 - Alle rechten voorbehouden
        </div>

    </div>
</body>
</html>
