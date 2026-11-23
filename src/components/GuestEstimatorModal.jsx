import React, { useMemo, useState } from 'react';
import { X, Users, Clock, Sparkles, Calculator } from 'lucide-react';

const PACE_RATES = {
  light: { label: 'Light (Casual)', drinksPerHour: 0.75, desc: 'Family dinner or relaxed evening' },
  moderate: { label: 'Moderate (Standard)', drinksPerHour: 1.2, desc: 'Typical birthday or gathering' },
  heavy: { label: 'Lively (Party)', drinksPerHour: 1.65, desc: 'Long celebration or reception' },
};

const MIX_PRESETS = {
  balanced: { label: 'Balanced (70% Spirits / 30% Wine)', spiritShare: 0.7, wineShare: 0.3 },
  spirits: { label: 'Mostly Spirits (90% Spirits / 10% Wine)', spiritShare: 0.9, wineShare: 0.1 },
  wine: { label: 'Wine Focused (30% Spirits / 70% Wine)', spiritShare: 0.3, wineShare: 0.7 },
};

export default function GuestEstimatorModal({ isOpen, onClose, onApplyToBudgetCap }) {
  const [guests, setGuests] = useState(12);
  const [hours, setHours] = useState(4);
  const [pace, setPace] = useState('moderate');
  const [mix, setMix] = useState('balanced');

  const estimate = useMemo(() => {
    const rate = PACE_RATES[pace].drinksPerHour;
    const totalServings = Math.ceil(guests * hours * rate);

    const spiritServings = Math.round(totalServings * MIX_PRESETS[mix].spiritShare);
    const wineServings = totalServings - spiritServings;

    // 750ml spirits = ~15 standard 50ml pours; 750ml wine = ~5 standard 150ml pours
    const spiritBottles = spiritServings > 0 ? Math.max(1, Math.ceil(spiritServings / 15)) : 0;
    const wineBottles = wineServings > 0 ? Math.max(1, Math.ceil(wineServings / 5)) : 0;

    // Mixers: ~200ml per spirit pour -> liters; Ice: ~0.4kg per guest
    const mixerLiters = Math.max(2, Math.ceil((spiritServings * 0.2)));
    const iceKg = Math.max(2, Math.ceil(guests * 0.4));

    // Rough LKR mid-tier planning estimate (Arrack/mid-spirit ~Rs. 5,500, Wine ~Rs. 3,800, Mixers/Ice ~Rs. 350/L)
    const approxMidBudget =
      spiritBottles * 5500 + wineBottles * 3800 + mixerLiters * 350 + iceKg * 250;

    return {
      totalServings,
      spiritBottles,
      wineBottles,
      mixerLiters,
      iceKg,
      approxMidBudget,
    };
  }, [guests, hours, pace, mix]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Party Quantity Estimator</h2>
              <p className="text-xs text-slate-400">
                Estimate bottle counts so you don&apos;t overbuy
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* Sliders */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Users className="h-4 w-4 text-amber-400" />
                  Drinking Guests
                </span>
                <span className="text-lg font-bold text-amber-400">{guests}</span>
              </div>
              <input
                type="range"
                min="2"
                max="100"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="mt-3 w-full accent-amber-500 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                <span>2</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Clock className="h-4 w-4 text-amber-400" />
                  Event Duration
                </span>
                <span className="text-lg font-bold text-amber-400">{hours} hrs</span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="mt-3 w-full accent-amber-500 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                <span>2 hrs</span>
                <span>5 hrs</span>
                <span>8 hrs</span>
              </div>
            </div>
          </div>

          {/* Pace */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Event Pace
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {Object.entries(PACE_RATES).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPace(key)}
                  className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                    pace === key
                      ? 'border-amber-500 bg-amber-500/15 text-amber-200'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mix */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Beverage Mix
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(MIX_PRESETS).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMix(key)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                    mix === key
                      ? 'border-amber-500 bg-amber-500 text-slate-950 font-semibold'
                      : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Sparkles className="h-4 w-4" />
              Estimated Planning Quantities
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 text-center">
                <div className="text-2xl font-bold text-amber-400">{estimate.spiritBottles}</div>
                <div className="mt-0.5 text-[11px] text-slate-400">Spirits (750 ml)</div>
              </div>
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 text-center">
                <div className="text-2xl font-bold text-rose-400">{estimate.wineBottles}</div>
                <div className="mt-0.5 text-[11px] text-slate-400">Wine (750 ml)</div>
              </div>
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 text-center">
                <div className="text-2xl font-bold text-sky-400">{estimate.mixerLiters} L</div>
                <div className="mt-0.5 text-[11px] text-slate-400">Chasers / Mixers</div>
              </div>
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 text-center">
                <div className="text-2xl font-bold text-slate-200">{estimate.iceKg} kg</div>
                <div className="mt-0.5 text-[11px] text-slate-400">Ice Cubes</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3 text-xs">
              <div className="text-slate-300">
                Rough mid-range budget:{' '}
                <strong className="text-amber-300">
                  Rs. {estimate.approxMidBudget.toLocaleString()}
                </strong>{' '}
                <span className="text-slate-500">
                  (~Rs. {Math.round(estimate.approxMidBudget / guests).toLocaleString()} / person)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onApplyToBudgetCap(estimate.approxMidBudget, guests);
                  onClose();
                }}
                className="rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition cursor-pointer"
              >
                Use as Target Budget &amp; Split
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Estimates assume 50 ml spirit pours (15 per 750 ml bottle) and 150 ml wine pours (5 per
            750 ml bottle). Always arrange safe transport and plenty of water &amp; food for guests.
          </p>
        </div>
      </div>
    </div>
  );
}
