const { useState, useEffect, useMemo } = React;

// Alap termék árak (a profit_kalkulator.xlsx-ből)
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
  "Mack snow (hím)": { beszerzesi_ar: 8000, eladasi_ar: 18990 },
  "Új-kaledóniai vitorlásgekkó": { beszerzesi_ar: 8000, eladasi_ar: 18990 },
  "Fürjtojáshéj kalcium por": { beszerzesi_ar: 1200, eladasi_ar: 2990 },
  "Fagyasztott fürj - 5 db": { beszerzesi_ar: 500, eladasi_ar: 1490 },
  "Lisztkukac - 1 liter": { beszerzesi_ar: 800, eladasi_ar: 2490 },
  "Lisztkukac - 5 cl": { beszerzesi_ar: 200, eladasi_ar: 590 },
  "Lisztkukac - 3 dl": { beszerzesi_ar: 400, eladasi_ar: 1290 },
  "Argentin csótány - 1 liter": { beszerzesi_ar: 1500, eladasi_ar: 3990 },
  "Kókuszrost talaj terráriumba - 10db": { beszerzesi_ar: 800, eladasi_ar: 1990 },
  "Barna Tücsök - Nagy, 100db": { beszerzesi_ar: 1200, eladasi_ar: 2990 },
  "Barna Tücsök - Közepes, 50db": { beszerzesi_ar: 800, eladasi_ar: 1990 },
  "Viaszmoly lárva - 20 db": { beszerzesi_ar: 600, eladasi_ar: 1790 },
  "Afrikai vándorsáska - Subadult, 100 db": { beszerzesi_ar: 1200, eladasi_ar: 2990 },
  "Afrikai vándorsáska - Közepes, 50 db": { beszerzesi_ar: 800, eladasi_ar: 1990 },
  "Gabonasikló": { beszerzesi_ar: 5000, eladasi_ar: 12990 },
  "Giotin ajtós terrárium – 20×20×20 cm": { beszerzesi_ar: 3500, eladasi_ar: 7990 },
  "Fagyasztott egér (10 db) - 3-6g": { beszerzesi_ar: 800, eladasi_ar: 1990 },
  "Fagyasztott egér (10 db) - 7-12g": { beszerzesi_ar: 1000, eladasi_ar: 2490 },
  "Papír tasak": { beszerzesi_ar: 100, eladasi_ar: 490 },
  "Poecilotheria regalis ( 3 cm th)": { beszerzesi_ar: 3000, eladasi_ar: 7990 }
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

  // Export árak
  const exportPrices = () => {
    const dataStr = JSON.stringify(productPrices, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'termek_arak_' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
  };

  // Import árak
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
      // Meglévő termékből másolás
      const existingPrices = productPrices[selectedExistingProduct];
      setProductPrices(prev => ({
        ...prev,
        [productName]: { ...existingPrices }
      }));
    } else if (manualMode) {
      // Manuális megadás
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
    
    // Alkalmazd a globális markup-ot a what-if-re
    if (globalMarkup !== 0) {
      Object.keys(priceData).forEach(key => {
        priceData[key] = {
          ...priceData[key],
          eladasi_ar: Math.round(priceData[key].eladasi_ar * (1 + globalMarkup / 100))
        };
      });
    }
    
    const orderGroups = {};
    orders.forEach(order => {
      if (!orderGroups[order.orderNumber]) {
        orderGroups[order.orderNumber] = [];
      }
      orderGroups[order.orderNumber].push(order);
    });

    let totalRevenue = 0;
    let totalCost = 0;
    let totalShipping = Object.keys(orderGroups).length * 2500;
    const productStats = {};

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

    const totalProfit = totalRevenue - totalCost - totalShipping;

    return {
      totalRevenue,
      totalCost,
      totalShipping,
      totalProfit,
      orderCount: Object.keys(orderGroups).length,
      productStats,
      profitMargin: ((totalProfit / totalRevenue) * 100).toFixed(2)
    };
  }, [orders, productPrices, globalMarkup]);

  // What-if profit számítás
  const whatIfProfitData = useMemo(() => {
    if (orders.length === 0 || globalMarkup === 0) return null;

    const priceData = { ...productPrices };
    Object.keys(priceData).forEach(key => {
      priceData[key] = {
        ...priceData[key],
        eladasi_ar: Math.round(priceData[key].eladasi_ar * (1 + globalMarkup / 100))
      };
    });

    let totalRevenue = 0;
    let totalCost = 0;

    orders.forEach(order => {
      const prices = priceData[order.itemName];
      if (!prices) return;

      const newPrice = Math.round(prices.eladasi_ar * (1 + globalMarkup / 100));
      totalRevenue += newPrice * order.quantity;
      totalCost += prices.beszerzesi_ar * order.quantity;
    });

    const orderGroups = {};
    orders.forEach(order => {
      if (!orderGroups[order.orderNumber]) {
        orderGroups[order.orderNumber] = [];
      }
      orderGroups[order.orderNumber].push(order);
    });
    const totalShipping = Object.keys(orderGroups).length * 2500;

    return totalRevenue - totalCost - totalShipping;
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
              💡 <strong>Tipp:</strong> Exportáld az árakat hogy következő alkalommal gyorsabban indulj!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'setup') {
    const currentProduct = missingProducts[currentMissingIndex];
    const progress = ((currentMissingIndex / missingProducts.length) * 100).toFixed(0);

    // Szűrés a meglévő termékeken
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
                Marázs: {profitData.profitMargin}%
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600 mb-1">Rendelések</p>
              <p className="text-3xl font-bold text-blue-600">
                {profitData.orderCount} db
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Átlag: {(profitData.totalProfit / profitData.orderCount).toLocaleString()} Ft/rendelés
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Marázs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedProducts.map(([name, stats]) => {
                    const margin = ((stats.profit / stats.revenue) * 100).toFixed(1);
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
                  {(((whatIfProfitData - currentProfit) / currentProfit) * 100).toFixed(1)}%
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
