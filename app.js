const { useState, useEffect, useMemo } = React;

// TELJES termék árlista
const DEFAULT_PRODUCT_PRICES = {
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
  
  // Barna Tücsök
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
  
  // Banán tücsök
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
  
  // Fekete tücsök
  "Fekete tücsök - Nagy, 1 lier": { beszerzesi_ar: 7000, eladasi_ar: 11490 },
  "Fekete tücsök - Nagy, 5dl": { beszerzesi_ar: 3500, eladasi_ar: 6990 },
  "Fekete tücsök - Közepes, 1 lier": { beszerzesi_ar: 7000, eladasi_ar: 11490 },
  "Fekete tücsök - Közepes, 5dl": { beszerzesi_ar: 3500, eladasi_ar: 6990 },
  
  // Lisztkukac
  "Lisztkukac - 1 liter": { beszerzesi_ar: 2500, eladasi_ar: 5490 },
  "Lisztkukac - 5dl": { beszerzesi_ar: 1250, eladasi_ar: 3190 },
  "Lisztkukac - 3 dl": { beszerzesi_ar: 750, eladasi_ar: 2290 },
  "Lisztkukac - 5 cl": { beszerzesi_ar: 125, eladasi_ar: 790 },
  
  // Gyászbogárlárva
  "Gyászbogárlárva - 1 liter": { beszerzesi_ar: 3000, eladasi_ar: 5490 },
  "Gyászbogárlárva - 5dl": { beszerzesi_ar: 1500, eladasi_ar: 3190 },
  "Gyászbogárlárva - 3 dl": { beszerzesi_ar: 900, eladasi_ar: 2290 },
  "Gyászbogárlárva - 5 cl": { beszerzesi_ar: 150, eladasi_ar: 790 },
  
  // Keleti Vándorsáska
  "Keleti Vándorsáska - Subadult, 100 db": { beszerzesi_ar: 3000, eladasi_ar: 4990 },
  "Keleti Vándorsáska - Subadult, 50 db": { beszerzesi_ar: 1500, eladasi_ar: 2790 },
  "Keleti Vándorsáska - Közepes, 100 db": { beszerzesi_ar: 2500, eladasi_ar: 4490 },
  "Keleti Vándorsáska - Közepes, 50 db": { beszerzesi_ar: 1250, eladasi_ar: 2490 },
  "Keleti Vándorsáska - Kicsi, 100 db": { beszerzesi_ar: 2000, eladasi_ar: 3990 },
  "Keleti Vándorsáska - Kicsi, 50 db": { beszerzesi_ar: 1000, eladasi_ar: 2290 },
  
  // Afrikai vándorsáska
  "Afrikai vándorsáska - Subadult, 100 db": { beszerzesi_ar: 3000, eladasi_ar: 4990 },
  "Afrikai vándorsáska - Subadult, 50 db": { beszerzesi_ar: 1500, eladasi_ar: 2790 },
  "Afrikai vándorsáska - Közepes, 100 db": { beszerzesi_ar: 2500, eladasi_ar: 4490 },
  "Afrikai vándorsáska - Közepes, 50 db": { beszerzesi_ar: 1250, eladasi_ar: 2490 },
  "Afrikai vándorsáska - Kicsi, 100 db": { beszerzesi_ar: 2000, eladasi_ar: 3990 },
  "Afrikai vándorsáska - Kicsi, 50 db": { beszerzesi_ar: 1000, eladasi_ar: 2990 },
  
  // Argentin csótány
  "Argentin csótány - 1 liter": { beszerzesi_ar: 10000, eladasi_ar: 14490 },
  "Argentin csótány - 5 dl": { beszerzesi_ar: 5000, eladasi_ar: 8490 },
  "Argentin csótány - 10 db (próbacsomag)": { beszerzesi_ar: 300, eladasi_ar: 1340 },
  
  // Csoki csótány
  "Csoki csótány - 1 liter, közepes/nagy": { beszerzesi_ar: 10000, eladasi_ar: 14490 },
  "Csoki csótány - 5 dl, közepes/nagy": { beszerzesi_ar: 5000, eladasi_ar: 7990 },
  "Csoki csótány - 3 dl, közepes/nagy": { beszerzesi_ar: 3000, eladasi_ar: 4990 },
  "Csoki csótány - adag, 0": { beszerzesi_ar: 1500, eladasi_ar: 2490 },
  "Csoki csótány - adag, 1": { beszerzesi_ar: 1500, eladasi_ar: 2490 },
  "Csoki csótány - adag, 2": { beszerzesi_ar: 1500, eladasi_ar: 2490 },
  "Csoki csótány - adag, 3": { beszerzesi_ar: 1500, eladasi_ar: 2490 },
  "Csoki csótány - adag, közepes/nagy": { beszerzesi_ar: 800, eladasi_ar: 1490 },
  
  // Viaszmoly lárva
  "Viaszmoly lárva - 100 db": { beszerzesi_ar: 2500, eladasi_ar: 5290 },
  "Viaszmoly lárva - 50 db": { beszerzesi_ar: 1250, eladasi_ar: 3290 },
  "Viaszmoly lárva - 20 db": { beszerzesi_ar: 500, eladasi_ar: 1590 },
  "Viaszmoly lárva - 10 db": { beszerzesi_ar: 250, eladasi_ar: 890 },
  
  // Fagyasztott egér
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
  
  // Fagyasztott fürj
  "Fagyasztott fürj - 1 db": { beszerzesi_ar: 150, eladasi_ar: 490 },
  "Fagyasztott fürj - 5 db": { beszerzesi_ar: 750, eladasi_ar: 2250 },
  "Fagyasztott fürj - 20 db": { beszerzesi_ar: 3000, eladasi_ar: 7800 },
  "Fagyasztott fürj - 50 db": { beszerzesi_ar: 7500, eladasi_ar: 14500 },
  
  "Poecilotheria metallica ( 2 vedlés)": { beszerzesi_ar: 4500, eladasi_ar: 8990 },
  "Poecilotheria regalis ( 3 cm th)": { beszerzesi_ar: 3000, eladasi_ar: 6990 },
  "Acanthoscurria geniculata - 1,5 cm": { beszerzesi_ar: 2000, eladasi_ar: 5990 },
  "Acanthoscurria geniculata - 3 cm": { beszerzesi_ar: 1000, eladasi_ar: 7990 },
  
  // Fagyasztott patkány
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
  
  // Patkány (élő)
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
  
  // Sokcsecsű egér
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
  
  // Kókuszrost talaj
  "Kókuszrost talaj terráriumba - 1db": { beszerzesi_ar: 250, eladasi_ar: 690 },
  "Kókuszrost talaj terráriumba - 10db": { beszerzesi_ar: 2500, eladasi_ar: 5990 },
  "Kókuszrost talaj terráriumba - 30db": { beszerzesi_ar: 7500, eladasi_ar: 14990 },
  
  "Papír tasak": { beszerzesi_ar: 100, eladasi_ar: 290 }
};

function ProfitKalkulator() {
  const [orders, setOrders] = useState([]);
  const [productPrices, setProductPrices] = useState(() => {
    const saved = localStorage.getItem('productPrices');
    return saved ? JSON.parse(saved) : { ...DEFAULT_PRODUCT_PRICES };
  });
  const [missingProducts, setMissingProducts] = useState([]);
  const [currentMissingIndex, setCurrentMissingIndex] = useState(0);
  const [selectedExistingProduct, setSelectedExistingProduct] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [tempPrices, setTempPrices] = useState({ beszerzesi_ar: '', eladasi_ar: '' });
  const [view, setView] = useState('upload');
  const [globalMarkup, setGlobalMarkup] = useState(0);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('productPrices', JSON.stringify(productPrices));
  }, [productPrices]);

  const exportPrices = () => {
    const dataStr = JSON.stringify(productPrices, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'termek_arak_' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
  };

  const importPrices = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        setProductPrices(prev => ({ ...prev, ...imported }));
        alert(`${Object.keys(imported).length} termék ár importálva!`);
      } catch (error) {
        alert('Hiba az import során!');
      }
    };
    reader.readAsText(file);
  };

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
        quantity: row['Quantity (- Refund)'] || 0,
        itemCost: row['Item Cost'] || 0,
        orderSubtotal: row['Order Subtotal Amount'] || 0, // ÚJ: Részösszeg beolvasása
        orderDate: row['Order Date']
      })).filter(order => order.itemName && order.itemName !== '');

      setOrders(processedOrders);

      const uniqueProducts = [...new Set(processedOrders.map(o => o.itemName))];
      const missing = uniqueProducts.filter(p => !productPrices[p]);
      
      if (missing.length > 0) {
        setMissingProducts(missing);
        setCurrentMissingIndex(0);
        setView('setup');
      } else {
        setView('dashboard');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSetMissingProduct = () => {
    const productName = missingProducts[currentMissingIndex];

    if (!manualMode && selectedExistingProduct) {
      const existingPrices = productPrices[selectedExistingProduct];
      setProductPrices(prev => ({
        ...prev,
        [productName]: { ...existingPrices }
      }));
    } else if (manualMode) {
      const beszerzesi = parseFloat(tempPrices.beszerzesi_ar);
      const eladasi = parseFloat(tempPrices.eladasi_ar);

      if (isNaN(beszerzesi) || isNaN(eladasi)) {
        alert('Kérlek adj meg érvényes számokat!');
        return;
      }

      setProductPrices(prev => ({
        ...prev,
        [productName]: {
          beszerzesi_ar: beszerzesi,
          eladasi_ar: eladasi
        }
      }));
    } else {
      alert('Válassz egy terméket a listából!');
      return;
    }

    setTempPrices({ beszerzesi_ar: '', eladasi_ar: '' });
    setSelectedExistingProduct('');
    setManualMode(false);

    if (currentMissingIndex < missingProducts.length - 1) {
      setCurrentMissingIndex(prev => prev + 1);
    } else {
      setView('dashboard');
    }
  };

  const profitData = useMemo(() => {
    if (orders.length === 0) return null;

    const priceData = { ...productPrices };
    
    // Csoportosítás rendelési szám alapján
    const orderGroups = {};
    orders.forEach(order => {
      if (!orderGroups[order.orderNumber]) {
        // Minden rendeléshez csak egyszer vesszük a részösszeget
        orderGroups[order.orderNumber] = {
            items: [],
            subtotal: order.orderSubtotal 
        };
      }
      orderGroups[order.orderNumber].items.push(order);
    });

    let totalRevenue = 0;
    let totalCost = 0;
    const productStats = {};
    
    // === SZÁLLÍTÁSI KÖLTSÉG KALKULÁCIÓ (MÓDOSÍTVA) ===
    let totalShippingCost = 0;
    Object.values(orderGroups).forEach(group => {
        // A csoportosított rendelés részösszegét használjuk
        if (group.subtotal < 14000) {
            totalShippingCost += (2500 - 1490);
        } else {
            totalShippingCost += 2500;
        }
    });
    // === SZÁLLÍTÁSI KÖLTSÉG KALKULÁCIÓ VÉGE ===

    orders.forEach(order => {
      const prices = priceData[order.itemName];
      if (!prices) return;

      const revenue = order.itemCost * order.quantity;
      const cost = prices.beszerzesi_ar * order.quantity;

      totalRevenue += revenue;
      totalCost += cost;

      if (!productStats[order.itemName]) {
        productStats[order.itemName] = {
          quantity: 0,
          revenue: 0,
          cost: 0,
          profit: 0
        };
      }

      productStats[order.itemName].quantity += order.quantity;
      productStats[order.itemName].revenue += revenue;
      productStats[order.itemName].cost += cost;
      productStats[order.itemName].profit += revenue - cost;
    });

    const totalProfit = totalRevenue - totalCost - totalShippingCost;

    return {
      totalRevenue,
      totalCost,
      totalShipping: totalShippingCost, // Javítva
      totalProfit,
      orderCount: Object.keys(orderGroups).length,
      productStats,
      profitMargin: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0
    };
  }, [orders, productPrices]); // globalMarkup eltávolítva, mert a what-if kezeli

  const whatIfProfitData = useMemo(() => {
    if (orders.length === 0 || globalMarkup === 0) return null;
    
    // Csoportosítás rendelési szám alapján
    const orderGroups = {};
    orders.forEach(order => {
        if (!orderGroups[order.orderNumber]) {
            orderGroups[order.orderNumber] = { items: [] };
        }
        orderGroups[order.orderNumber].items.push(order);
    });

    let newTotalRevenue = 0;
    let totalCost = 0;
    let newTotalShippingCost = 0;

    // === WHAT-IF SZÁLLÍTÁSI KÖLTSÉG KALKULÁCIÓ (MÓDOSÍTVA) ===
    Object.values(orderGroups).forEach(group => {
        // Minden tétel árát újraszámoljuk a markup alapján
        const newOrderSubtotal = group.items.reduce((sum, item) => {
            const originalPrices = productPrices[item.itemName];
            if (!originalPrices) return sum; // Ha nincs ár, nem számoljuk
            
            // Az eredeti eladási árból számolunk, nem a kedvezményesből
            const newPrice = Math.round(originalPrices.eladasi_ar * (1 + globalMarkup / 100));
            return sum + (newPrice * item.quantity);
        }, 0);

        if (newOrderSubtotal < 14000) {
            newTotalShippingCost += (2500 - 1490);
        } else {
            newTotalShippingCost += 2500;
        }
    });
    // === WHAT-IF SZÁLLÍTÁSI KÖLTSÉG VÉGE ===

    orders.forEach(order => {
        const prices = productPrices[order.itemName];
        if (!prices) return;
  
        // Az új bevételt az eredeti eladási árból számoljuk, hogy a kuponok ne zavarjanak be
        const newRevenue = Math.round(prices.eladasi_ar * (1 + globalMarkup / 100)) * order.quantity;
        newTotalRevenue += newRevenue;
        totalCost += prices.beszerzesi_ar * order.quantity;
    });

    return newTotalRevenue - totalCost - newTotalShippingCost;
  }, [orders, productPrices, globalMarkup]);

  if (view === 'upload') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Profit Kalkulátor</h1>
          <p className="text-gray-600 mb-6">
            Töltsd fel a WooCommerce rendeléseid Excel fájlját, és kezdd el az elemzést!
          </p>
          
          <label className="block mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 cursor-pointer transition">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Kattints ide vagy húzd ide a WooCommerce fájlt
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Excel fájl (.xlsx, .xls)
              </p>
            </div>
          </label>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Árlisták kezelése</h3>
            <div className="flex gap-3">
              <button
                onClick={exportPrices}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >
                📥 Árak exportálása
              </button>
              <label className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition cursor-pointer text-center">
                📤 Árak importálása
                <input
                  type="file"
                  accept=".json"
                  onChange={importPrices}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tipp:</strong> {Object.keys(DEFAULT_PRODUCT_PRICES).length} termék ár van beépítve!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'setup') {
    const currentProduct = missingProducts[currentMissingIndex];
    const progress = ((currentMissingIndex / missingProducts.length) * 100).toFixed(0);

    const existingProducts = Object.keys(productPrices);
    const filteredProducts = searchFilter 
      ? existingProducts.filter(p => p.toLowerCase().includes(searchFilter.toLowerCase()))
      : existingProducts;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-800">Termék árak beállítása</h2>
              <span className="text-sm text-gray-500">
                {currentMissingIndex + 1} / {missingProducts.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-semibold text-lg">
              ⚠️ Hiányzó termék: {currentProduct}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setManualMode(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  !manualMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📋 Választás listából
              </button>
              <button
                onClick={() => setManualMode(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  manualMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✍️ Kézi megadás
              </button>
            </div>

            {!manualMode ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keress rá és válassz egy hasonló terméket
                </label>
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Keresés... (pl. gekkó, tücsök)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
                />
                <div className="border border-gray-300 rounded-lg max-h-96 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <div
                      key={product}
                      onClick={() => setSelectedExistingProduct(product)}
                      className={`p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 ${
                        selectedExistingProduct === product ? 'bg-blue-100' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{product}</span>
                        <div className="text-sm text-gray-600">
                          <span className="mr-4">Besz: {productPrices[product].beszerzesi_ar.toLocaleString()} Ft</span>
                          <span>Elad: {productPrices[product].eladasi_ar.toLocaleString()} Ft</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beszerzési ár (Ft)
                  </label>
                  <input
                    type="number"
                    value={tempPrices.beszerzesi_ar}
                    onChange={(e) => setTempPrices(prev => ({ ...prev, beszerzesi_ar: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="pl. 8000"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eladási ár (Ft)
                  </label>
                  <input
                    type="number"
                    value={tempPrices.eladasi_ar}
                    onChange={(e) => setTempPrices(prev => ({ ...prev, eladasi_ar: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="pl. 16990"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSetMissingProduct}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {currentMissingIndex < missingProducts.length - 1 ? 'Következő →' : 'Kész ✓'}
            </button>
            <button
              onClick={() => {
                if (confirm('Biztosan kihagyod ezt a terméket?')) {
                  if (currentMissingIndex < missingProducts.length - 1) {
                    setCurrentMissingIndex(prev => prev + 1);
                  } else {
                    setView('dashboard');
                  }
                }
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Kihagyás
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'dashboard' && profitData) {
    const sortedProducts = Object.entries(profitData.productStats)
      .sort((a, b) => b[1].profit - a[1].profit);

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">📊 Profit Dashboard</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setView('whatif')}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                🔮 What-If
              </button>
              <button
                onClick={exportPrices}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                💾 Export
              </button>
              <button
                onClick={() => {
                  setOrders([]);
                  setGlobalMarkup(0);
                  setView('upload');
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Új fájl
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600 mb-1">Összes bevétel</p>
              <p className="text-3xl font-bold text-gray-800">
                {profitData.totalRevenue.toLocaleString()} Ft
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600 mb-1">Összes költség</p>
              <p className="text-3xl font-bold text-red-600">
                {(profitData.totalCost + profitData.totalShipping).toLocaleString()} Ft
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Termék: {profitData.totalCost.toLocaleString()} Ft<br/>
                Szállítás: {profitData.totalShipping.toLocaleString()} Ft
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600 mb-1">Nettó profit</p>
              <p className={`text-3xl font-bold ${profitData.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitData.totalProfit.toLocaleString()} Ft
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Marzs: {profitData.profitMargin}%
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600 mb-1">Rendelések</p>
              <p className="text-3xl font-bold text-blue-600">
                {profitData.orderCount} db
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Átlag: {profitData.orderCount > 0 ? (profitData.totalProfit / profitData.orderCount).toFixed(0).toLocaleString() : 0} Ft/rendelés
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Termékek profitabilitása</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Termék</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Mennyiség</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bevétel</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Költség</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Profit</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Marzs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedProducts.map(([name, stats]) => {
                    const margin = stats.revenue > 0 ? ((stats.profit / stats.revenue) * 100).toFixed(1) : 0;
                    return (
                      <tr key={name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">{name}</td>
                        <td className="px-6 py-4 text-sm text-right text-gray-600">{stats.quantity} db</td>
                        <td className="px-6 py-4 text-sm text-right text-gray-800 font-medium">
                          {stats.revenue.toLocaleString()} Ft
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-red-600">
                          {stats.cost.toLocaleString()} Ft
                        </td>
                        <td className={`px-6 py-4 text-sm text-right font-medium ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stats.profit.toLocaleString()} Ft
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-600">
                          {margin}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'whatif' && profitData) {
    const currentProfit = profitData.totalProfit;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">🔮 What-If Elemzés</h1>
            <button
              onClick={() => setView('dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              ← Vissza
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Globális árváltoztatás</h2>
            <p className="text-gray-600 mb-6">
              Próbáld ki, hogyan változna a profitod ha MINDEN terméken változtatsz az árakon!
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Árváltozás (%): {globalMarkup > 0 ? '+' : ''}{globalMarkup}%
              </label>
              <input
                type="range"
                min="-50"
                max="100"
                step="5"
                value={globalMarkup}
                onChange={(e) => setGlobalMarkup(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>-50%</span>
                <span>0%</span>
                <span>+100%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setGlobalMarkup(-10)}
                className="py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                -10%
              </button>
              <button
                onClick={() => setGlobalMarkup(0)}
                className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Reset
              </button>
              <button
                onClick={() => setGlobalMarkup(10)}
                className="py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
              >
                +10%
              </button>
            </div>
          </div>

          {whatIfProfitData !== null && globalMarkup !== 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-1">Jelenlegi profit</p>
                <p className="text-3xl font-bold text-gray-800">
                  {currentProfit.toLocaleString()} Ft
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-1">What-If profit</p>
                <p className="text-3xl font-bold text-purple-600">
                  {whatIfProfitData.toLocaleString()} Ft
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-1">Változás</p>
                <p className={`text-3xl font-bold ${(whatIfProfitData - currentProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(whatIfProfitData - currentProfit) >= 0 ? '+' : ''}{(whatIfProfitData - currentProfit).toLocaleString()} Ft
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {currentProfit !== 0 ? (((whatIfProfitData - currentProfit) / Math.abs(currentProfit)) * 100).toFixed(1) : 'N/A'}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ProfitKalkulator />);
