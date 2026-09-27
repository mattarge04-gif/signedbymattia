// Sucht gemeinfreie Werke (CC0) im Met Museum und lädt sie herunter.
// Aufruf: node met-cc0.cjs <zielordner> "<suchbegriff>" [anzahl]
// Nur Werke mit isPublicDomain=true. Quelle und Titel landen in quellen.csv.
const fs = require('fs');
const [out, q, n = '4'] = process.argv.slice(2);
if (!out || !q) { console.error('Aufruf: node met-cc0.cjs <ordner> "<suche>" [anzahl]'); process.exit(1); }
const API = 'https://collectionapi.metmuseum.org/public/collection/v1';
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const csv = `${out}/quellen.csv`;
  if (!fs.existsSync(csv)) fs.writeFileSync(csv, 'datei;titel;kuenstler;datum;lizenz;quelle\n');
  const s = await (await fetch(`${API}/search?hasImages=true&q=${encodeURIComponent(q)}`)).json();
  let c = 0;
  for (const id of (s.objectIDs || []).slice(0, 40)) {
    const o = await (await fetch(`${API}/objects/${id}`)).json();
    if (!o.isPublicDomain || !o.primaryImage) continue;
    const file = `met-${id}.jpg`;
    fs.writeFileSync(`${out}/${file}`, Buffer.from(await (await fetch(o.primaryImage)).arrayBuffer()));
    fs.appendFileSync(csv, [file, o.title, o.artistDisplayName, o.objectDate, 'CC0 (Met Open Access)', o.objectURL].map(x => String(x || '').replace(/;/g, ',')).join(';') + '\n');
    console.log('ok', file, '|', o.title, '|', o.artistDisplayName);
    if (++c >= Number(n)) break;
  }
})();
