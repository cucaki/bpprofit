const { useState, useEffect, useMemo } = React;

// Segédfüggvény a pénz formázásához
const formatMoney = (amount) => {
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(amount);
};

function ProfitKalkulator() {
    // Állapotok
    const [orders, setOrders] = useState([]);
    // Az árakat most már üresen indítjuk, vagy a mentettből
    const [productPrices, setProductPrices] = useState(() => {
        const saved = localStorage.getItem('dynamicProductPrices');
        return saved ? JSON.parse(saved) : {};
    });
    const [view, setView] = useState('upload'); // 'upload', 'price_editor', 'dashboard'
    
    // Szerkesztéshez ideiglenes állapot
    const [editedPrices, setEditedPrices] = useState({});

    // Mentés a localStorage-ba változáskor
    useEffect(() => {
        if (Object.keys(productPrices).length > 0) {
            localStorage.setItem('dynamicProductPrices', JSON.stringify(productPrices));
        }
    }, [productPrices]);

    // Fájl feltöltés és feldolgozás
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

            // 1. Rendelések beolvasása
            const processedOrders = jsonData.map(row => ({
                orderNumber: row['Order Number'],
                itemName: row['Item Name'],
                quantity: Number(row['Quantity (- Refund)']) || 0,
                itemCost: Number(row['Item Cost']) || 0,
                orderSubtotal: Number(row['Order Subtotal Amount']) || 0,
                orderDate: row['Order Date']
            })).filter(order => order.itemName && order.itemName !== '');

            setOrders(processedOrders);

            // 2. Termékek kigyűjtése és árak előkészítése
            const foundProducts = {};
            
            processedOrders.forEach(order => {
                if (!order.itemName) return;
                const name = order.itemName.trim();
                
                // Egységár becslése: ha a mennyiség 1, akkor az Item Cost a pontos ár.
                // Ha több, akkor osztunk. (Biztonsági logika)
                const detectedPrice = order.quantity === 1 ? order.itemCost : (order.itemCost / order.quantity);

                if (!foundProducts[name]) {
                    foundProducts[name] = { maxPrice: 0 };
                }
                // A legmagasabb talált árat mentjük el (hogy kiszűrjük az esetleges kedvezményes eladásokat)
                if (detectedPrice > foundProducts[name].maxPrice) {
                    foundProducts[name].maxPrice = detectedPrice;
                }
            });

            // Összefésüljük a már ismert árakkal
            const newPricesState = { ...productPrices };
            let hasNewOrMissingCost = false;

            Object.keys(foundProducts).forEach(name => {
                if (!newPricesState[name]) {
                    // Új termék
                    newPricesState[name] = {
                        beszerzesi_ar: 0, // Ezt kell majd megadni
                        eladasi_ar: Math.round(foundProducts[name].maxPrice) // Excelből jön
                    };
                    hasNewOrMissingCost = true;
                } else {
                    // Már ismert termék: ha a beszerzési ár 0, akkor jelezzük a szerkesztőnek
                    if (newPricesState[name].beszerzesi_ar === 0) {
                        hasNewOrMissingCost = true;
                    }
                }
            });

            setEditedPrices(newPricesState);
            
            // Ha van új termék vagy hiányzó beszerzési ár, irány a szerkesztő
            if (hasNewOrMissingCost || Object.keys(newPricesState).length > 0) {
                setView('price_editor');
            } else {
                setProductPrices(newPricesState);
                setView('dashboard');
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSavePrices = () => {
        setProductPrices(editedPrices);
        setView('dashboard');
    };

    const handlePriceEditChange = (name, field, value) => {
        setEditedPrices(prev => ({
            ...prev,
            [name]: {
                ...prev[name],
                [field]: Number(value)
            }
        }));
    };

    // Profit számítás
    const profitData = useMemo(() => {
        if (orders.length === 0) return null;

        let totalRevenue = 0;
        let totalCost = 0;
        let totalShippingCost = 0;
        const productStats = {};

        // Rendelések csoportosítása szállítási ktg számításhoz
        const orderGroups = {};
        orders.forEach(order => {
            if (!orderGroups[order.orderNumber]) {
                orderGroups[order.orderNumber] = { subtotal: order.orderSubtotal };
            }
        });

        // Szállítási költség logika
        Object.values(orderGroups).forEach(group => {
            if (group.subtotal < 14000) {
                totalShippingCost += (2500 - 1490);
            } else {
                totalShippingCost += 2500;
            }
        });

        orders.forEach(order => {
            const name = order.itemName.trim();
            const prices = productPrices[name];
            
            if (!prices) return; 

            const revenue = prices.eladasi_ar * order.quantity; 
            const cost = prices.beszerzesi_ar * order.quantity;

            totalRevenue += revenue;
            totalCost += cost;

            if (!productStats[name]) {
                productStats[name] = {
                    quantity: 0,
                    revenue: 0,
                    cost: 0,
                    profit: 0
                };
            }

            productStats[name].quantity += order.quantity;
            productStats[name].revenue += revenue;
            productStats[name].cost += cost;
            productStats[name].profit += (revenue - cost);
        });

        const totalProfit = totalRevenue - totalCost - totalShippingCost;

        return {
            totalRevenue,
            totalCost,
            totalShippingCost,
            totalProfit,
            productStats,
            orderCount: Object.keys(orderGroups).length
        };
    }, [orders, productPrices]);

    // --- NÉZETEK ---

    // 1. Feltöltés
    if (view === 'upload') {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
                <div className="max-w-xl w-full bg-white rounded-xl shadow-2xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Profit Kalkulátor</h1>
                    <p className="text-gray-500 text-center mb-8">Töltsd fel a rendeléseket tartalmazó Excel fájlt</p>
                    
                    <label className="block w-full cursor-pointer">
                        <div className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl p-10 text-center hover:bg-blue-100 transition duration-300">
                            <span className="text-4xl mb-2 block">📂</span>
                            <span className="font-semibold text-blue-600">Kattints a fájl kiválasztásához</span>
                            <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
                        </div>
                    </label>
                    
                    <div className="mt-6 flex justify-between text-sm text-gray-400">
                        <span>v2.0 - Dinamikus</span>
                        <button onClick={() => {localStorage.removeItem('dynamicProductPrices'); setProductPrices({}); alert('Árak törölve!');}} className="text-red-400 hover:text-red-600">
                            Mentett árak törlése
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Árazás szerkesztő (Tömeges)
    if (view === 'price_editor') {
        const sortedProducts = Object.entries(editedPrices).sort((a, b) => a[0].localeCompare(b[0]));
        
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-blue-600 text-white">
                        <div>
                            <h2 className="text-2xl font-bold">Termék Árak Beállítása</h2>
                            <p className="text-blue-100 text-sm">Az Excel alapján {sortedProducts.length} terméket találtam.</p>
                        </div>
                        <button 
                            onClick={handleSavePrices}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow transition transform hover:scale-105"
                        >
                            MENTÉS ÉS SZÁMOLÁS →
                        </button>
                    </div>

                    <div className="p-4 bg-yellow-50 border-b border-yellow-100 text-yellow-800 text-sm">
                        ℹ️ <strong>Tipp:</strong> Az "Eladási ár" automatikusan kitöltve az Excelből. Csak a "Beszerzési árat" kell megadnod.
                    </div>

                    <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="p-4 border-b font-semibold text-gray-600 w-1/2">Termék neve</th>
                                    <th className="p-4 border-b font-semibold text-gray-600 w-1/4">Eladási ár (Ft)</th>
                                    <th className="p-4 border-b font-semibold text-gray-600 w-1/4">Beszerzési ár (Ft)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedProducts.map(([name, prices]) => (
                                    <tr key={name} className="hover:bg-gray-50 transition">
                                        <td className="p-3 text-sm font-medium text-gray-700">{name}</td>
                                        <td className="p-3">
                                            <input 
                                                type="number" 
                                                value={prices.eladasi_ar}
                                                onChange={(e) => handlePriceEditChange(name, 'eladasi_ar', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input 
                                                type="number" 
                                                value={prices.beszerzesi_ar}
                                                onChange={(e) => handlePriceEditChange(name, 'beszerzesi_ar', e.target.value)}
                                                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 font-bold ${prices.beszerzesi_ar === 0 ? 'border-red-300 bg-red-50' : 'border-green-300 bg-white'}`}
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Dashboard
    if (view === 'dashboard' && profitData) {
        const sortedStats = Object.entries(profitData.productStats).sort((a, b) => b[1].profit - a[1].profit);

        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">📊 Profit Elemzés</h1>
                        <div className="space-x-3">
                            <button onClick={() => {setEditedPrices(productPrices); setView('price_editor');}} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
                                ✏️ Árak szerkesztése
                            </button>
                            <button onClick={() => setView('upload')} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded shadow">
                                Új fájl
                            </button>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Bevétel</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{formatMoney(profitData.totalRevenue)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Költségek</p>
                            <p className="text-3xl font-bold text-red-500 mt-2">{formatMoney(profitData.totalCost + profitData.totalShippingCost)}</p>
                            <p className="text-xs text-gray-400 mt-1">Termék: {formatMoney(profitData.totalCost)} | Száll.: {formatMoney(profitData.totalShippingCost)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💰</div>
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Nettó Profit</p>
                            <p className={`text-3xl font-bold mt-2 ${profitData.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatMoney(profitData.totalProfit)}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Rendelések</p>
                            <p className="text-3xl font-bold text-blue-600 mt-2">{profitData.orderCount} db</p>
                            <p className="text-xs text-gray-400 mt-1">Átl. profit: {profitData.orderCount ? formatMoney(profitData.totalProfit / profitData.orderCount) : 0}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-bold text-gray-700">Termékek profitabilitása</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Termék</th>
                                        <th className="px-6 py-3 text-right">Menny.</th>
                                        <th className="px-6 py-3 text-right">Bevétel</th>
                                        <th className="px-6 py-3 text-right">Költség</th>
                                        <th className="px-6 py-3 text-right">Profit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sortedStats.map(([name, stats]) => (
                                        <tr key={name} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{name}</td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-600">{stats.quantity} db</td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-600">{formatMoney(stats.revenue)}</td>
                                            <td className="px-6 py-4 text-sm text-right text-red-400">{formatMoney(stats.cost)}</td>
                                            <td className={`px-6 py-4 text-sm text-right font-bold ${stats.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatMoney(stats.profit)}
                                            </td>
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
