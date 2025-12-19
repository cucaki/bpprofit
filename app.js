const { useState, useEffect, useMemo } = React;

// --- 1. ADATBÁZIS ÉS SEGÉDFÜGGVÉNYEK ---

const DEFAULT_PRODUCT_PRICES = {
  // ... (A korábbi lista maradhat itt, vagy üresen hagyható, a kód összefésüli)
  "Albino tramper (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 16990 },
  "Super hypo (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 15990 },
  "Albino (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 16990 },
  "White and yellow (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 17990 },
  "Blizzard": { beszerzesi_ar: 8000, eladasi_ar: 19990 },
  "High yellow": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "High yellow (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "Orion (Hím)": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "Jungle (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "Jungle (Hím)": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "High yellow carrot head (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 16990 },
  "Hypo": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "Blizzard (Hím)": { beszerzesi_ar: 8000, eladasi_ar: 19990 },
  "Hypo (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "Lemon frost (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "Ms": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "Mack snow": { beszerzesi_ar: 8000, eladasi_ar: 18990 },
  "Albino tramper (Hím)": { beszerzesi_ar: 8000, eladasi_ar: 15990 },
  "Riddle (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "Hypo tangerine (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 19990 },
  "Mack snow (Hím)": { beszerzesi_ar: 8000, eladasi_ar: 18990 },
  "Hypo carrot tail (Hím)": { beszerzesi_ar: 8000, eladasi_ar: 15990 },
  "Mack snow enigma": { beszerzesi_ar: 8000, eladasi_ar: 19990 },
  "Hypo carrot head": { beszerzesi_ar: 8000, eladasi_ar: 15990 },
  "Super hypo tangerine carrot tail (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 17990 },
  "Super hypo carrot tail (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 15990 },
  "High yelow (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 13990 },
  "Hypo carrot tail (Nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 15990 },
  "Királypiton": { beszerzesi_ar: 20000, eladasi_ar: 39900 },
  "Kézműves etető&itatótál": { beszerzesi_ar: 1500, eladasi_ar: 5490 },
  "Kongói rózsabogár (Pachnoda marginata)": { beszerzesi_ar: 500, eladasi_ar: 2500 },
  "Javanica csótány (Elliptorhina javanica)": { beszerzesi_ar: 100, eladasi_ar: 490 },
  "Madagaszkári bütykös csótány": { beszerzesi_ar: 100, eladasi_ar: 490 },
  "Fülöp-szigeteki botsáska (5db)": { beszerzesi_ar: 1000, eladasi_ar: 4900 },
  "Spirostreptus spec. 1 (3db)": { beszerzesi_ar: 200, eladasi_ar: 3990 },
  "Afrikai óriás ezerlábú": { beszerzesi_ar: 4000, eladasi_ar: 9990 },
  "Új-kaledóniai vitorlásgekkó": { beszerzesi_ar: 500, eladasi_ar: 4990 },
  "Szakállas agáma": { beszerzesi_ar: 13500, eladasi_ar: 23990 },
  "Caribena versicolor (2 vedlés)": { beszerzesi_ar: 1200, eladasi_ar: 3590 },
  "Lasiodora parahybana ˙(4 cm)": { beszerzesi_ar: 2000, eladasi_ar: 5990 },
  "Tliltocatl albopilosus (1,5-2 cm)": { beszerzesi_ar: 500, eladasi_ar: 2990 },
  "Tliltocatl kahlenbergi (1,5-2 cm)": { beszerzesi_ar: 500, eladasi_ar: 3490 },
  "Fürjtojáshéj kalcium por": { beszerzesi_ar: 1600, eladasi_ar: 4990 },
  "Super snow": { beszerzesi_ar: 8000, eladasi_ar: 29990 },
  "Barna Tücsök - Frissen kelt, 1 adag (1 adag = 2 cl)": { beszerzesi_ar: 1000, eladasi_ar: 1790 },
  "Barna Tücsök - Hangya, 1 adag (1 adag = 3 cl)": { beszerzesi_ar: 1000, eladasi_ar: 1790 },
  "Barna Tücsök - Mikro, 1 adag (1 adag = 3-4 cl)": { beszerzesi_ar: 1000, eladasi_ar: 1790 },
  "Barna Tücsök - Légy, 1 adag=5 cl = kb. 200 db": { beszerzesi_ar: 1000, eladasi_ar: 1790 },
  "Barna Tücsök - Légy, 1 liter": { beszerzesi_ar: 12000, eladasi_ar: 19990 },
  "Barna Tücsök - Légy, 2dl": { beszerzesi_ar: 2400, eladasi_ar: 5990 },
  "Barna Tücsök - Közepes, 50db": { beszerzesi_ar: 500, eladasi_ar: 1290 },
  "Barna Tücsök - Közepes, 100db": { beszerzesi_ar: 800, eladasi_ar: 1790 },
  "Barna Tücsök - Közepes, 2dl": { beszerzesi_ar: 1400, eladasi_ar: 3990 },
  "Barna Tücsök - Közepes, 3dl": { beszerzesi_ar: 2100, eladasi_ar: 4990 },
  "Barna Tücsök - Közepes, 5dl": { beszerzesi_ar: 3500, eladasi_ar: 6990 },
  "Barna Tücsök - Közepes, 1 liter": { beszerzesi_ar: 7000, eladasi_ar: 11490 },
  "Barna Tücsök - Nagy, 50db": { beszerzesi_ar: 500, eladasi_ar: 1290 },
  "Barna Tücsök - Nagy, 100db": { beszerzesi_ar: 800, eladasi_ar: 1790 },
  "Barna Tücsök - Nagy, 2dl": { beszerzesi_ar: 1400, eladasi_ar: 3990 },
  "Barna Tücsök - Nagy, 3dl": { beszerzesi_ar: 2100, eladasi_ar: 4990 },
  "Barna Tücsök - Nagy, 5dl": { beszerzesi_ar: 3500, eladasi_ar: 6990 },
  "Barna Tücsök - Nagy, 1 liter": { beszerzesi_ar: 7000, eladasi_ar: 11490 },
  "Barna Tücsök - Légy, 5dl": { beszerzesi_ar: 6000, eladasi_ar: 11490 },
  "Banán tücsök - Nagy, Liter": { beszerzesi_ar: 7000, eladasi_ar: 11490 },
  "Banán tücsök - Nagy, 5dl": { beszerzesi_ar: 3500, eladasi_ar: 6990 },
  "Banán tücsök - Nagy, 3dl": { beszerzesi_ar: 2100, eladasi_ar: 4990 },
  "Banán tücsök - Nagy, 2dl": { beszerzesi_ar: 1400, eladasi_ar: 3990 },
  "Banán tücsök - Nagy, 100db": { beszerzesi_ar: 500, eladasi_ar: 1790 },
  "Banán tücsök - Nagy, 50db": { beszerzesi_ar: 800, eladasi_ar: 1290 },
  "Banán tücsök - Közép, Liter": { beszerzesi_ar: 7000, eladasi_ar: 11490 },
  "Banán tücsök - Közép, 5dl": { beszerzesi_ar: 3500, eladasi_ar: 6990 },
  "Banán tücsök - Közép, 3dl": { beszerzesi_ar: 2100, eladasi_ar: 4990 },
  "Banán tücsök - Közép, 2dl": { beszerzesi_ar: 1400, eladasi_ar: 3990 },
  "Banán tücsök - Közép, 100db": { beszerzesi_ar: 500, eladasi_ar: 1790 },
  "Banán tücsök - Közép, 50db": { beszerzesi_ar: 800, eladasi_ar: 1290 },
  "Fekete tücsök - Nagy, 1 lier": { beszerzesi_ar: 7000, eladasi_ar: 11490 },
  "Fekete tücsök - Nagy, 5dl": { beszerzesi_ar: 3500, eladasi_ar: 6990 },
  "Fekete tücsök - Közepes, 1 lier": { beszerzesi_ar: 7000, eladasi_ar: 11490 },
  "Fekete tücsök - Közepes, 5dl": { beszerzesi_ar: 3500, eladasi_ar: 6990 },
  "Lisztkukac - 1 liter": { beszerzesi_ar: 2500, eladasi_ar: 5490 },
  "Lisztkukac - 5dl": { beszerzesi_ar: 1250, eladasi_ar: 3190 },
  "Lisztkukac - 3 dl": { beszerzesi_ar: 750, eladasi_ar: 2290 },
  "Lisztkukac - 5 cl": { beszerzesi_ar: 125, eladasi_ar: 790 },
  "Gyászbogárlárva - 1 liter": { beszerzesi_ar: 3000, eladasi_ar: 5490 },
  "Gyászbogárlárva - 5dl": { beszerzesi_ar: 1500, eladasi_ar: 3190 },
  "Gyászbogárlárva - 3 dl": { beszerzesi_ar: 900, eladasi_ar: 2290 },
  "Gyászbogárlárva - 5 cl": { beszerzesi_ar: 150, eladasi_ar: 790 },
  "Keleti Vándorsáska - Subadult, 100 db": { beszerzesi_ar: 3000, eladasi_ar: 4990 },
  "Keleti Vándorsáska - Subadult, 50 db": { beszerzesi_ar: 1500, eladasi_ar: 2790 },
  "Keleti Vándorsáska - Közepes, 100 db": { beszerzesi_ar: 2500, eladasi_ar: 4490 },
  "Keleti Vándorsáska - Közepes, 50 db": { beszerzesi_ar: 1250, eladasi_ar: 2490 },
  "Keleti Vándorsáska - Kicsi, 100 db": { beszerzesi_ar: 2000, eladasi_ar: 3990 },
  "Keleti Vándorsáska - Kicsi, 50 db": { beszerzesi_ar: 1000, eladasi_ar: 2290 },
  "Afrikai vándorsáska - Subadult, 100 db": { beszerzesi_ar: 3000, eladasi_ar: 4990 },
  "Afrikai vándorsáska - Subadult, 50 db": { beszerzesi_ar: 1500, eladasi_ar: 2790 },
  "Afrikai vándorsáska - Közepes, 100 db": { beszerzesi_ar: 2500, eladasi_ar: 4490 },
  "Afrikai vándorsáska - Közepes, 50 db": { beszerzesi_ar: 1250, eladasi_ar: 2490 },
  "Afrikai vándorsáska - Kicsi, 100 db": { beszerzesi_ar: 2000, eladasi_ar: 3990 },
  "Afrikai vándorsáska - Kicsi, 50 db": { beszerzesi_ar: 1000, eladasi_ar: 2990 },
  "Argentin csótány - 1 liter": { beszerzesi_ar: 10000, eladasi_ar: 14490 },
  "Argentin csótány - 5 dl": { beszerzesi_ar: 5000, eladasi_ar: 8490 },
  "Argentin csótány - 10 db (próbacsomag)": { beszerzesi_ar: 300, eladasi_ar: 1340 },
  "Csoki csótány - 1 liter, közepes/nagy": { beszerzesi_ar: 10000, eladasi_ar: 14490 },
  "Csoki csótány - 5 dl, közepes/nagy": { beszerzesi_ar: 5000, eladasi_ar: 7990 },
  "Csoki csótány - 3 dl, közepes/nagy": { beszerzesi_ar: 3000, eladasi_ar: 4990 },
  "Csoki csótány - adag, 0": { beszerzesi_ar: 1500, eladasi_ar: 2490 },
  "Csoki csótány - adag, 1": { beszerzesi_ar: 1500, eladasi_ar: 2490 },
  "Csoki csótány - adag, 2": { beszerzesi_ar: 1500, eladasi_ar: 2490 },
  "Csoki csótány - adag, 3": { beszerzesi_ar: 1500, eladasi_ar: 2490 },
  "Csoki csótány - adag, közepes/nagy": { beszerzesi_ar: 800, eladasi_ar: 1490 },
  "Viaszmoly lárva - 100 db": { beszerzesi_ar: 2500, eladasi_ar: 5290 },
  "Viaszmoly lárva - 50 db": { beszerzesi_ar: 1250, eladasi_ar: 3290 },
  "Viaszmoly lárva - 20 db": { beszerzesi_ar: 500, eladasi_ar: 1590 },
  "Viaszmoly lárva - 10 db": { beszerzesi_ar: 250, eladasi_ar: 890 },
  "Fagyasztott egér (10 db) - 1-2g": { beszerzesi_ar: 500, eladasi_ar: 1990 },
  "Fagyasztott egér (10 db) - 3-6g": { beszerzesi_ar: 800, eladasi_ar: 2390 },
  "Fagyasztott egér (10 db) - 7-12g": { beszerzesi_ar: 1400, eladasi_ar: 2790 },
  "Fagyasztott egér (10 db) - 13-17g": { beszerzesi_ar: 1500, eladasi_ar: 2890 },
  "Fagyasztott egér (10 db) - 18-22g": { beszerzesi_ar: 1600, eladasi_ar: 3190 },
  "Fagyasztott egér (10 db) - 23-30g": { beszerzesi_ar: 1700, eladasi_ar: 3490 },
  "Fagyasztott egér (10 db) - 31-50g": { beszerzesi_ar: 1900, eladasi_ar: 4890 },
  "Sisakos kaméleon": { beszerzesi_ar: 8000, eladasi_ar: 17990 },
  "Boa constrictor imperator": { beszerzesi_ar: 20000, eladasi_ar: 39990 },
  "Gabonasikló": { beszerzesi_ar: 3000, eladasi_ar: 9950 },
  "Fagyasztott fürj - 1 db": { beszerzesi_ar: 150, eladasi_ar: 490 },
  "Fagyasztott fürj - 5 db": { beszerzesi_ar: 750, eladasi_ar: 2250 },
  "Fagyasztott fürj - 20 db": { beszerzesi_ar: 3000, eladasi_ar: 7800 },
  "Fagyasztott fürj - 50 db": { beszerzesi_ar: 7500, eladasi_ar: 14500 },
  "Poecilotheria metallica ( 2 vedlés)": { beszerzesi_ar: 4500, eladasi_ar: 8990 },
  "Poecilotheria regalis ( 3 cm th)": { beszerzesi_ar: 3000, eladasi_ar: 6990 },
  "Acanthoscurria geniculata - 1,5 cm": { beszerzesi_ar: 2000, eladasi_ar: 5990 },
  "Acanthoscurria geniculata - 3 cm": { beszerzesi_ar: 1000, eladasi_ar: 7990 },
  "Fagyasztott patkány - 10-20g": { beszerzesi_ar: 150, eladasi_ar: 280 },
  "Fagyasztott patkány - 21-50g": { beszerzesi_ar: 280, eladasi_ar: 590 },
  "Fagyasztott patkány - 51-80": { beszerzesi_ar: 400, eladasi_ar: 790 },
  "Fagyasztott patkány - 81-100g": { beszerzesi_ar: 550, eladasi_ar: 990 },
  "Fagyasztott patkány - 101-130g": { beszerzesi_ar: 700, eladasi_ar: 1190 },
  "Fagyasztott patkány - 131-150g": { beszerzesi_ar: 800, eladasi_ar: 1390 },
  "Fagyasztott patkány - 151-200g": { beszerzesi_ar: 900, eladasi_ar: 1490 },
  "Fagyasztott patkány - 201-250g": { beszerzesi_ar: 1000, eladasi_ar: 1890 },
  "Fagyasztott patkány - 251-300g": { beszerzesi_ar: 1100, eladasi_ar: 1990 },
  "Fagyasztott patkány - 301g+": { beszerzesi_ar: 1300, eladasi_ar: 2190 },
  "Smaragd csótány": { beszerzesi_ar: 1000, eladasi_ar: 1990 },
  "Mack snow (hím)": { beszerzesi_ar: 8000, eladasi_ar: 17990 },
  "Tramper albino (hím)": { beszerzesi_ar: 8000, eladasi_ar: 15990 },
  "High yellow carrot tail (nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 16990 },
  "Mack snow (nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 17990 },
  "High yelow (hím)": { beszerzesi_ar: 8000, eladasi_ar: 15990 },
  "Ms (nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 17990 },
  "Albino stripe": { beszerzesi_ar: 8000, eladasi_ar: 19990 },
  "High yellow tangerine stripe": { beszerzesi_ar: 8000, eladasi_ar: 22990 },
  "Albino (hím)": { beszerzesi_ar: 8000, eladasi_ar: 18990 },
  "Ridle (nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "Ridle": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "Cute (hím)": { beszerzesi_ar: 8000, eladasi_ar: 13990 },
  "Ms (hím)": { beszerzesi_ar: 8000, eladasi_ar: 17990 },
  "Hypo carrote tail": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "High yellow (hím)": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "Stripe carrot tail (hím)": { beszerzesi_ar: 8000, eladasi_ar: 17990 },
  "High yellow stripe (hím)": { beszerzesi_ar: 8000, eladasi_ar: 14990 },
  "Stripe mack snow eclipse (nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 24990 },
  "Albino carrot tail (nőstény)": { beszerzesi_ar: 8000, eladasi_ar: 19990 },
  "Mantis": { beszerzesi_ar: 1500, eladasi_ar: 5990 },
  "graptemys pseudogeographica": { beszerzesi_ar: 2500, eladasi_ar: 8000 },
  "Tengerimalac": { beszerzesi_ar: 3000, eladasi_ar: 5990 },
  "Dzsungáriai törpehörcsög": { beszerzesi_ar: 800, eladasi_ar: 2990 },
  "Roborovszkij-törpehörcsög": { beszerzesi_ar: 800, eladasi_ar: 2990 },
  "Szíriai aranyhörcsög": { beszerzesi_ar: 800, eladasi_ar: 4990 },
  "Gabonasikó": { beszerzesi_ar: 5000, eladasi_ar: 14990 },
  "Gabonasikló (nőstény)": { beszerzesi_ar: 5000, eladasi_ar: 15990 },
  "Királypiton (nőstény)": { beszerzesi_ar: 20000, eladasi_ar: 39990 },
  "Ciliatus tenyész csapat (4+1)": { beszerzesi_ar: 20000, eladasi_ar: 44990 },
  "Óstorlábú (2 vedlés)": { beszerzesi_ar: 3500, eladasi_ar: 7990 },
  "Patkány - 10-20g": { beszerzesi_ar: 150, eladasi_ar: 280 },
  "Patkány - 21-50g": { beszerzesi_ar: 280, eladasi_ar: 590 },
  "Patkány - 51-80g": { beszerzesi_ar: 400, eladasi_ar: 790 },
  "Patkány - 81-100g": { beszerzesi_ar: 550, eladasi_ar: 990 },
  "Patkány - 101-130g": { beszerzesi_ar: 700, eladasi_ar: 1190 },
  "Patkány - 131-150g": { beszerzesi_ar: 800, eladasi_ar: 1390 },
  "Patkány - 151-200g": { beszerzesi_ar: 900, eladasi_ar: 1490 },
  "Patkány - 201-250g": { beszerzesi_ar: 1000, eladasi_ar: 1890 },
  "Patkány - 251-300g": { beszerzesi_ar: 1100, eladasi_ar: 1990 },
  "Patkány - 301g+": { beszerzesi_ar: 1300, eladasi_ar: 2190 },
  "Sokcsecsű egér (10 db) - 1-2g": { beszerzesi_ar: 500, eladasi_ar: 1990 },
  "Sokcsecsű egér (10 db) - 3-6g": { beszerzesi_ar: 800, eladasi_ar: 2390 },
  "Sokcsecsű egér (10 db) - 7-12g": { beszerzesi_ar: 1400, eladasi_ar: 2790 },
  "Sokcsecsű egér (10 db) - 13-17g": { beszerzesi_ar: 1500, eladasi_ar: 2890 },
  "Sokcsecsű egér (10 db) - 18-22 g": { beszerzesi_ar: 1600, eladasi_ar: 3190 },
  "Sokcsecsű egér (10 db) - 22-30g": { beszerzesi_ar: 1700, eladasi_ar: 3490 },
  "Sokcsecsű egér (10 db) - 31-50g": { beszerzesi_ar: 1900, eladasi_ar: 4890 },
  "Pamphobeteus sp machalla (2 vedlés)": { beszerzesi_ar: 1200, eladasi_ar: 3990 },
  "Brachypelma hamorii (1,5-2cm)": { beszerzesi_ar: 3500, eladasi_ar: 7990 },
  "Morelia viridis": { beszerzesi_ar: 200000, eladasi_ar: 299990 },
  "Kókuszrost talaj terráriumba - 1db": { beszerzesi_ar: 250, eladasi_ar: 690 },
  "Kókuszrost talaj terráriumba - 10db": { beszerzesi_ar: 2500, eladasi_ar: 5990 },
  "Kókuszrost talaj terráriumba - 30db": { beszerzesi_ar: 7500, eladasi_ar: 14990 },
  "Papír tasak": { beszerzesi_ar: 100, eladasi_ar: 290 }
};

// Termék név normalizáló (Fuzzy search-höz)
function normalizeProductName(name) {
  if (!name) return '';
  return name
    .trim()
    .toLowerCase()
    .replace(/\s*\(\s*/g, ' - ')
    .replace(/\s*\)\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fuzzy termék keresés
function findMatchingProduct(searchName, priceList) {
  if (priceList[searchName]) return searchName;
  
  const normalized = normalizeProductName(searchName);
  
  // Pontos normalizált egyezés
  for (const key of Object.keys(priceList)) {
    if (normalizeProductName(key) === normalized) {
      return key;
    }
  }
  
  // Részleges egyezés (ha tartalmazza)
  for (const key of Object.keys(priceList)) {
    const normalizedKey = normalizeProductName(key);
    if (normalizedKey.includes(normalized) || normalized.includes(normalizedKey)) {
      return key;
    }
  }
  
  return null;
}

const formatMoney = (amount) => {
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(amount);
};

// --- 2. FŐ KOMPONENS ---

function ProfitKalkulator() {
    const [orders, setOrders] = useState([]);
    
    // Az árak inicializálása: Beégetett lista + LocalStorage
    const [productPrices, setProductPrices] = useState(() => {
        const saved = localStorage.getItem('v3ProductPrices');
        const savedPrices = saved ? JSON.parse(saved) : {};
        return { ...DEFAULT_PRODUCT_PRICES, ...savedPrices };
    });
    
    const [view, setView] = useState('upload'); 
    const [editedPrices, setEditedPrices] = useState({}); 

    useEffect(() => {
        localStorage.setItem('v3ProductPrices', JSON.stringify(productPrices));
    }, [productPrices]);

    // Fájl feltöltés
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const processedOrders = jsonData.map(row => ({
                orderNumber: row['Order Number'],
                itemName: row['Item Name'],
                quantity: Number(row['Quantity (- Refund)']) || 0,
                // Itt az Item Cost az ELADÁSI ÁR (Excelből)
                itemCost: Number(row['Item Cost']) || 0,
                orderSubtotal: Number(row['Order Subtotal Amount']) || 0,
                orderShipping: Number(row['Order Shipping Amount']) || 0,
                orderTax: Number(row['Order Total Tax Amount']) || 0,
                orderTotal: Number(row['Order Total Amount']) || 0,
                cartDiscount: Number(row['Cart Discount Amount']) || 0,
                orderDate: row['Order Date']
            })).filter(order => order.itemName);

            setOrders(processedOrders);

            // 1. Ismeretlen termékek keresése
            const missingItemsDict = {}; 
            
            processedOrders.forEach(order => {
                const name = order.itemName.trim();
                const matchedName = findMatchingProduct(name, productPrices);
                
                if (!matchedName) {
                    // Ha NINCS egyezés, akkor ez egy új termék!
                    // Egységár becslése (az Item Cost itt a sor összege, vagy egységár? WooCommerce-ben általában Item Cost = Unit Price, de ha több van belőle, ellenőrizzük)
                    // Az Excel "Item Cost" mezője általában az egységárat jelenti (kedvezmények nélkül vagy azzal).
                    const detectedPrice = order.quantity > 0 ? (order.itemCost / order.quantity) : order.itemCost;
                    
                    // Valójában a WooCommerce exportban az 'Item Cost' gyakran a sor végösszege.
                    // De ha az Item Cost 1 db-ra vonatkozik, akkor jó. A biztonság kedvéért:
                    // Ha 1 db van, akkor Item Cost = Ár.
                    // Az előző elemzés alapján az Item Cost az adott sor összege volt (pl. 240 Ft 1 db-nál).
                    // De ha quantity > 1, akkor osszuk el? Nem biztos.
                    // A felhasználó azt mondta: "az eladási ár már látszódik ott".
                    // Használjuk az Item Cost-ot mint egységár, de figyeljük a Quantity-t.
                    // Ha Quantity 2 és Item Cost 480, akkor egységár 240.
                    // De a snippetben 1 db volt és Item Cost megegyezett az árral.
                    // Feltételezzük: Item Cost = Line Total (Sorösszeg). Ezért osztunk.
                    
                    const unitPrice = order.quantity > 0 ? (order.itemCost / order.quantity) : 0;

                    if (!missingItemsDict[name]) {
                        missingItemsDict[name] = { maxPrice: 0 };
                    }
                    if (unitPrice > missingItemsDict[name].maxPrice) {
                        missingItemsDict[name].maxPrice = unitPrice;
                    }
                }
            });

            // 2. Szerkesztő indítása a hiányzókra
            const newMissingProductsState = {};
            Object.keys(missingItemsDict).forEach(name => {
                 newMissingProductsState[name] = {
                    beszerzesi_ar: 0,
                    eladasi_ar: Math.round(missingItemsDict[name].maxPrice)
                };
            });

            if (Object.keys(newMissingProductsState).length > 0) {
                setEditedPrices(newMissingProductsState);
                setView('missing_price_editor'); 
            } else {
                setView('dashboard');
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSaveMissingPrices = () => {
        setProductPrices(prev => ({ ...prev, ...editedPrices }));
        setView('dashboard');
    };

    const handlePriceEditChange = (name, field, value) => {
        setEditedPrices(prev => ({
            ...prev,
            [name]: { ...prev[name], [field]: Number(value) }
        }));
    };
    
    // Profit kalkuláció (UseMemo) - ITT VAN A TRÜKK AZ UTÁNVÉTTEL!
    const profitData = useMemo(() => {
        if (orders.length === 0) return null;

        let totalRevenue = 0;
        let totalCost = 0;
        let totalShippingCost = 0;
        let totalExtraRevenue = 0; // Ez lesz az utánvét/egyéb díj
        
        const productStats = {};
        
        // 1. Rendelések szintjén: Rejtett díjak (Custom Amounts) keresése
        const orderGroups = {};
        orders.forEach(order => {
            if (!orderGroups[order.orderNumber]) {
                orderGroups[order.orderNumber] = { 
                    subtotal: order.orderSubtotal,
                    shipping: order.orderShipping,
                    tax: order.orderTax,
                    total: order.orderTotal,
                    discount: order.cartDiscount
                };
            }
        });

        Object.values(orderGroups).forEach(group => {
            // Szállítási költség logika (nekünk mennyibe kerül a futár)
            if (group.subtotal < 14000) totalShippingCost += (2500 - 1490);
            else totalShippingCost += 2500;

            // REJTETT DÍJ DETEKTÁLÁSA
            // Képlet: Végösszeg - (Termékek + Szállítás + Adó - Kedvezmény)
            // Ha marad valami pluszban, az az "Egyéb díj" (pl. Utánvét, Custom Amount)
            const expectedTotal = group.subtotal + group.shipping + group.tax - group.discount;
            const diff = group.total - expectedTotal;
            
            // Ha a különbség pozitív (és nagyobb mint 1 Ft kerekítési hiba), akkor az extra bevétel!
            if (diff > 10) { 
                totalExtraRevenue += diff;
            }
        });

        // 2. Tételek feldolgozása
        orders.forEach(order => {
            const name = order.itemName.trim();
            const matchedName = findMatchingProduct(name, productPrices);
            
            if (!matchedName) return; 

            const prices = productPrices[matchedName];
            
            // BEVÉTEL: Az Excelből jön (Item Cost oszlop), mert az a valós eladási ár
            // De ha több van egy sorban, akkor az Item Cost a sorösszeg, így csak hozzáadjuk.
            const revenue = order.itemCost; 
            
            // KÖLTSÉG: A mi adatbázisunkból jön (Beszerzési ár * mennyiség)
            const cost = prices.beszerzesi_ar * order.quantity;

            totalRevenue += revenue;
            totalCost += cost;

            if (!productStats[matchedName]) { 
                productStats[matchedName] = { quantity: 0, revenue: 0, cost: 0, profit: 0 };
            }
            productStats[matchedName].quantity += order.quantity;
            productStats[matchedName].revenue += revenue;
            productStats[matchedName].cost += cost;
            productStats[matchedName].profit += (revenue - cost);
        });

        // Hozzáadjuk az extra bevételeket (Utánvét) az összes bevételhez
        totalRevenue += totalExtraRevenue;
        // Az extra bevételnek (Utánvét díj) 0 a költsége, így tisztán profit

        return {
            totalRevenue,
            totalCost,
            totalShippingCost,
            totalExtraRevenue, // Külön is visszaadjuk, hogy megjeleníthessük
            totalProfit: totalRevenue - totalCost - totalShippingCost,
            productStats,
            orderCount: Object.keys(orderGroups).length
        };
    }, [orders, productPrices]);

    // --- NÉZETEK ---

    if (view === 'upload') {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
                <div className="max-w-xl w-full bg-white rounded-xl shadow-2xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Profit Kalkulátor</h1>
                    <p className="text-gray-500 text-center mb-8">Hardcoded adatbázis + Utánvét/Egyéb díj felismerés</p>
                    
                    <label className="block w-full cursor-pointer">
                        <div className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl p-10 text-center hover:bg-blue-100 transition duration-300">
                            <span className="text-4xl mb-2 block">📂</span>
                            <span className="font-semibold text-blue-600">Excel feltöltése</span>
                            <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
                        </div>
                    </label>
                     <div className="mt-6 text-center text-xs text-gray-400">
                        Ismert termékek száma: {Object.keys(productPrices).length} db
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'missing_price_editor') {
        const sortedMissing = Object.entries(editedPrices).sort((a, b) => a[0].localeCompare(b[0]));
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-orange-600 text-white">
                        <div>
                            <h2 className="text-2xl font-bold">⚠️ Ismeretlen termékek</h2>
                            <p className="text-orange-100 text-sm">Az alábbi termékek nincsenek az adatbázisban. Kérlek árazd be őket!</p>
                        </div>
                        <button onClick={handleSaveMissingPrices} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow">
                            HOZZÁADÁS ÉS TOVÁBB →
                        </button>
                    </div>
                    <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 border-b font-semibold text-gray-600 w-1/2">Termék neve</th>
                                    <th className="p-4 border-b font-semibold text-gray-600 w-1/4">Eladási ár (Ft)</th>
                                    <th className="p-4 border-b font-semibold text-gray-600 w-1/4">Beszerzési ár (Ft)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedMissing.map(([name, prices]) => (
                                    <tr key={name} className="hover:bg-gray-50">
                                        <td className="p-3 text-sm font-medium text-gray-700">{name}</td>
                                        <td className="p-3"><input type="number" value={prices.eladasi_ar} onChange={(e) => handlePriceEditChange(name, 'eladasi_ar', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-gray-50"/></td>
                                        <td className="p-3"><input type="number" value={prices.beszerzesi_ar} onChange={(e) => handlePriceEditChange(name, 'beszerzesi_ar', e.target.value)} className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 font-bold" placeholder="0"/></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'dashboard' && profitData) {
        const sortedStats = Object.entries(profitData.productStats).sort((a, b) => b[1].profit - a[1].profit);
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">📊 Profit Elemzés</h1>
                        <button onClick={() => setView('upload')} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded shadow">Új fájl</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Összes Bevétel</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{formatMoney(profitData.totalRevenue)}</p>
                            {profitData.totalExtraRevenue > 0 && (
                                <p className="text-xs text-green-600 mt-1">Ebből Utánvét/Egyéb: {formatMoney(profitData.totalExtraRevenue)}</p>
                            )}
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Összköltség</p>
                            <p className="text-3xl font-bold text-red-500 mt-2">{formatMoney(profitData.totalCost + profitData.totalShippingCost)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Nettó Profit</p>
                            <p className={`text-3xl font-bold mt-2 ${profitData.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatMoney(profitData.totalProfit)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Rendelések</p>
                            <p className="text-3xl font-bold text-blue-600 mt-2">{profitData.orderCount} db</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50"><h3 className="font-bold text-gray-700">Részletes bontás</h3></div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Termék / Tétel</th>
                                        <th className="px-6 py-3 text-right">Menny.</th>
                                        <th className="px-6 py-3 text-right">Bevétel (Excel)</th>
                                        <th className="px-6 py-3 text-right">Költség (Saját)</th>
                                        <th className="px-6 py-3 text-right">Profit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {/* Utánvét sor */}
                                    {profitData.totalExtraRevenue > 0 && (
                                        <tr className="bg-green-50 font-semibold">
                                            <td className="px-6 py-4 text-sm text-green-800">➕ Egyéb Díjak / Utánvét</td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-600">-</td>
                                            <td className="px-6 py-4 text-sm text-right text-green-700">{formatMoney(profitData.totalExtraRevenue)}</td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-600">{formatMoney(0)}</td>
                                            <td className="px-6 py-4 text-sm text-right text-green-600">{formatMoney(profitData.totalExtraRevenue)}</td>
                                        </tr>
                                    )}
                                    {/* Termékek */}
                                    {sortedStats.map(([name, stats]) => (
                                        <tr key={name} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{name}</td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-600">{stats.quantity}</td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-600">{formatMoney(stats.revenue)}</td>
                                            <td className="px-6 py-4 text-sm text-right text-red-400">{formatMoney(stats.cost)}</td>
                                            <td className={`px-6 py-4 text-sm text-right font-bold ${stats.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatMoney(stats.profit)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ProfitKalkulator />);
