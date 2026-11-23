import React, { useMemo, useState } from 'react';
import {
  Search,
  Wallet,
  Scale,
  Calculator,
  Plus,
  Minus,
  Check,
  SlidersHorizontal,
  Info,
  Sparkles,
} from 'lucide-react';
import bottlesData from './data/bottles.json';
import BottleSilhouette, { getCategoryBadgeClass } from './components/BottleSilhouette.jsx';
import AgeGateModal from './components/AgeGateModal.jsx';
import PoyaAlertBanner from './components/PoyaAlertBanner.jsx';
import GuestEstimatorModal from './components/GuestEstimatorModal.jsx';
import CompareDrawer from './components/CompareDrawer.jsx';
import BudgetDrawer from './components/BudgetDrawer.jsx';

const PRICE_PRESETS = [
  { label: 'Any price', min: '', max: '' },
  { label: 'Under Rs. 5,000', min: '0', max: '5000' },
  { label: 'Rs. 5,000 – 10,000', min: '5000', max: '10000' },
  { label: 'Rs. 10,000 – 20,000', min: '10000', max: '20000' },
  { label: 'Over Rs. 20,000', min: '20000', max: '' },
];

export default function App() {
  const [ageVerified, setAgeVerified] = useState(() => {
    try {
      return localStorage.getItem('pourplan_age_21') === 'true';
    } catch {
      return false;
    }
  });

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const [budgetItems, setBudgetItems] = useState([]);
  const [budgetCap, setBudgetCap] = useState(25000);
  const [splitCount, setSplitCount] = useState(6);
  const [compareIds, setCompareIds] = useState([]);

  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);

  const handleConfirmAge = () => {
    try {
      localStorage.setItem('pourplan_age_21', 'true');
    } catch {
      // Ignore storage errors
    }
    setAgeVerified(true);
  };

  const categories = useMemo(() => {
    const counts = bottlesData.reduce((acc, b) => {
      acc[b.category] = (acc[b.category] || 0) + 1;
      return acc;
    }, {});
    return [
      { name: 'All', count: bottlesData.length },
      ...Object.entries(counts).map(([name, count]) => ({ name, count })),
    ];
  }, []);

  const filteredBottles = useMemo(() => {
    const q = query.trim().toLowerCase();
    const lo = minPrice !== '' ? Number(minPrice) : null;
    const hi = maxPrice !== '' ? Number(maxPrice) : null;

    let list = bottlesData.filter((b) => {
      if (category !== 'All' && b.category !== category) return false;
      if (q && !`${b.name} ${b.category} ${b.volumeLabel}`.toLowerCase().includes(q)) {
        return false;
      }
      if (lo !== null || hi !== null) {
        if (b.price === null) return false;
        if (lo !== null && b.price < lo) return false;
        if (hi !== null && b.price > hi) return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => (a.price ?? 9999999) - (b.price ?? 9999999));
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    } else if (sortBy === 'value-100ml') {
      const rate = (x) => (x.price && x.volumeMl ? x.price / x.volumeMl : 9999999);
      list = [...list].sort((a, b) => rate(a) - rate(b));
    } else if (sortBy === 'abv-desc') {
      list = [...list].sort((a, b) => (b.abv ?? 0) - (a.abv ?? 0));
    }

    return list;
  }, [query, category, minPrice, maxPrice, sortBy]);

  const budgetQtyMap = useMemo(() => {
    const map = {};
    budgetItems.forEach((i) => {
      map[i.id] = i.qty;
    });
    return map;
  }, [budgetItems]);

  const budgetSummary = useMemo(() => {
    const count = budgetItems.reduce((s, i) => s + i.qty, 0);
    const total = budgetItems.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
    return { count, total };
  }, [budgetItems]);

  const compareItems = useMemo(
    () => bottlesData.filter((b) => compareIds.includes(b.id)),
    [compareIds]
  );

  const addToBudget = (bottle) => {
    if (!bottle.price) return;
    setBudgetItems((prev) => {
      const existing = prev.find((i) => i.id === bottle.id);
      if (existing) {
        return prev.map((i) => (i.id === bottle.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...bottle, qty: 1 }];
    });
  };

  const updateBudgetQty = (id, nextQty) => {
    if (nextQty <= 0) {
      setBudgetItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setBudgetItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: nextQty } : i)));
    }
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100">
      {!ageVerified && <AgeGateModal onConfirm={handleConfirmAge} />}

      {/* Sri Lanka Poya / Dry Day Alert */}
      <PoyaAlertBanner />

      {/* Top Sticky Header */}
      <header className="no-print sticky top-0 z-30 border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-100 leading-none">
                PourPlan <span className="text-amber-400">LK</span>
              </h1>
              <p className="mt-0.5 text-[11px] text-slate-400 hidden sm:block">
                Sri Lanka Event Beverage Budget &amp; Price Guide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEstimatorOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 hover:border-amber-500/50 hover:text-amber-300 transition cursor-pointer"
            >
              <Calculator className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">Party Estimator</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="relative inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 hover:border-amber-500/50 hover:text-amber-300 transition cursor-pointer"
            >
              <Scale className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">Compare</span>
              {compareIds.length > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-slate-950">
                  {compareIds.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsBudgetOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Wallet className="h-4 w-4" />
              <span>
                {budgetSummary.total > 0
                  ? `Rs. ${budgetSummary.total.toLocaleString()}`
                  : 'Budget'}
              </span>
              {budgetSummary.count > 0 && (
                <span className="rounded-full bg-slate-950/20 px-1.5 py-0.5 text-[10px]">
                  {budgetSummary.count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Search & Filter Controls */}
        <section className="no-print rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bottles (e.g., Arrack, Johnnie Walker, Moscato)..."
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Price Range & Sort */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-1.5 text-xs">
                <span className="text-slate-400">Rs.</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-16 bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
                <span className="text-slate-600">–</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-16 bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <select
                aria-label="Price preset"
                value={`${minPrice}-${maxPrice}`}
                onChange={(e) => {
                  const [lo, hi] = e.target.value.split('-');
                  setMinPrice(lo || '');
                  setMaxPrice(hi || '');
                }}
                className="rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                {PRICE_PRESETS.map((p) => (
                  <option key={p.label} value={`${p.min}-${p.max}`}>
                    {p.label}
                  </option>
                ))}
              </select>

              <div className="relative inline-flex items-center">
                <SlidersHorizontal className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-amber-400" />
                <select
                  aria-label="Sort bottles"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-slate-700/80 bg-slate-950/80 py-2 pl-8 pr-3 text-xs text-slate-200 focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="default">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="value-100ml">Best Value (Rs. / 100 ml)</option>
                  <option value="abv-desc">ABV: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const active = category === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                    active
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                      : 'border border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:text-slate-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      active ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Results Meta */}
        <div className="mt-6 mb-4 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-slate-200">{filteredBottles.length}</strong> of{' '}
            {bottlesData.length} reference listings
          </span>
          {(query || category !== 'All' || minPrice || maxPrice) && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('All');
                setMinPrice('');
                setMaxPrice('');
                setSortBy('default');
              }}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Catalogue Grid */}
        {filteredBottles.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 py-16 text-center">
            <p className="text-sm font-medium text-slate-300">No bottles match your filters.</p>
            <p className="mt-1 text-xs text-slate-500">
              Try widening your price range or clearing your search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBottles.map((b) => {
              const qty = budgetQtyMap[b.id] || 0;
              const isCompared = compareIds.includes(b.id);
              const per100ml = b.price && b.volumeMl ? Math.round((b.price / b.volumeMl) * 100) : null;
              const per50ml = b.price && b.volumeMl ? Math.round((b.price / b.volumeMl) * 50) : null;

              return (
                <article
                  key={b.id}
                  className="group relative flex flex-col rounded-2xl border border-slate-800/90 bg-slate-900/70 p-4 transition hover:border-amber-500/40 hover:bg-slate-900"
                >
                  {/* Top Badges */}
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getCategoryBadgeClass(
                        b.category
                      )}`}
                    >
                      {b.category}
                    </span>
                    {b.abvLabel && (
                      <span className="rounded-full bg-slate-950 border border-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                        {b.abvLabel} ABV
                      </span>
                    )}
                  </div>

                  {/* Custom SVG Bottle Silhouette */}
                  <BottleSilhouette category={b.category} volumeMl={b.volumeMl} />

                  {/* Details */}
                  <div className="mt-3 flex-1">
                    <h2 className="text-sm font-bold text-slate-100 leading-snug line-clamp-2 min-h-[2.5rem]">
                      {b.name}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">{b.volumeLabel}</p>

                    {/* Value Micro-metrics */}
                    <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
                      {per100ml ? (
                        <>
                          <span className="rounded-md bg-slate-950/80 border border-slate-800 px-2 py-0.5">
                            Rs. {per100ml.toLocaleString()}/100ml
                          </span>
                          <span className="rounded-md bg-slate-950/80 border border-slate-800 px-2 py-0.5">
                            Rs. {per50ml.toLocaleString()}/50ml
                          </span>
                        </>
                      ) : (
                        <span className="rounded-md bg-slate-950/80 border border-slate-800 px-2 py-0.5 text-slate-500">
                          Value pending price check
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="mt-4 border-t border-slate-800/80 pt-3">
                    <div className="flex items-baseline justify-between">
                      <span
                        className={`text-lg font-extrabold tracking-tight ${
                          b.verified ? 'text-amber-400' : 'text-slate-500 text-sm font-medium'
                        }`}
                      >
                        {b.priceDisplay}
                      </span>
                      <span className="text-[10px] text-slate-500">Ref. {b.lastUpdated}</span>
                    </div>

                    <div className="no-print mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCompare(b.id)}
                        className={`inline-flex items-center justify-center gap-1 rounded-xl border px-2.5 py-2 text-xs font-medium transition cursor-pointer ${
                          isCompared
                            ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                            : 'border-slate-700/80 bg-slate-950/70 text-slate-300 hover:border-slate-600'
                        }`}
                        title="Compare up to 3 bottles"
                      >
                        {isCompared ? <Check className="h-3.5 w-3.5" /> : <Scale className="h-3.5 w-3.5" />}
                        <span>{isCompared ? 'Added' : 'Compare'}</span>
                      </button>

                      {b.price ? (
                        qty > 0 ? (
                          <div className="flex flex-1 items-center justify-between rounded-xl border border-amber-500/50 bg-amber-500/10 px-2 py-1">
                            <button
                              type="button"
                              onClick={() => updateBudgetQty(b.id, qty - 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-amber-300 hover:bg-slate-800 cursor-pointer"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs font-bold text-amber-300">{qty} in budget</span>
                            <button
                              type="button"
                              onClick={() => updateBudgetQty(b.id, qty + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-amber-300 hover:bg-slate-800 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addToBudget(b)}
                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add to Budget
                          </button>
                        )
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex-1 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                        >
                          Price Unverified
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Neutral Informational Legal Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/80 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl space-y-2 text-xs leading-relaxed text-slate-400">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Info className="h-4 w-4 text-amber-400" />
                Informational Reference &amp; Compliance Notice (Sri Lanka)
              </div>
              <p>
                PourPlan LK is an independent, non-commercial event budgeting and price reference
                calculator. This website does not sell, supply, deliver, broker, or advertise
                alcoholic beverages. Listed LKR figures are approximate public retail references and
                may vary by licensed retailer or Excise duty revisions.
              </p>
              <p className="text-slate-500">
                Intended strictly for adults aged 21+ in accordance with Section 31(1) of the
                National Authority on Tobacco and Alcohol (NATA) Act, No. 27 of 2006. Please enjoy
                responsibly and never drink and drive.
              </p>
            </div>
            <div className="text-xs text-slate-500 sm:text-right">
              <p className="font-semibold text-slate-300">PourPlan LK</p>
              <p className="mt-1">83 Reference Entries · Updated Nov 2026</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <GuestEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
        onApplyToBudgetCap={(suggestedCap, guests) => {
          setBudgetCap(suggestedCap);
          setSplitCount(guests);
          setIsBudgetOpen(true);
        }}
      />

      <CompareDrawer
        items={compareItems}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
        onClear={() => setCompareIds([])}
        onAddToBudget={(bottle) => {
          addToBudget(bottle);
          setIsCompareOpen(false);
          setIsBudgetOpen(true);
        }}
      />

      <BudgetDrawer
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        items={budgetItems}
        onUpdateQty={updateBudgetQty}
        onRemove={(id) => setBudgetItems((prev) => prev.filter((i) => i.id !== id))}
        onClear={() => setBudgetItems([])}
        budgetCap={budgetCap}
        onBudgetCapChange={setBudgetCap}
        splitCount={splitCount}
        onSplitCountChange={setSplitCount}
      />
    </div>
  );
}
