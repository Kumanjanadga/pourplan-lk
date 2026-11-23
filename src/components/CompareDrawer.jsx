import React from 'react';
import { X, Scale, Plus, Award } from 'lucide-react';
import BottleSilhouette, { getCategoryBadgeClass } from './BottleSilhouette.jsx';

export default function CompareDrawer({ items, isOpen, onClose, onRemove, onClear, onAddToBudget }) {
  if (!isOpen) return null;

  const withMetrics = items.map((b) => {
    const per100ml = b.price && b.volumeMl ? Math.round((b.price / b.volumeMl) * 100) : null;
    const per50ml = b.price && b.volumeMl ? Math.round((b.price / b.volumeMl) * 50) : null;
    return { ...b, per100ml, per50ml };
  });

  const bestPer100 = withMetrics
    .filter((b) => b.per100ml !== null)
    .reduce((min, b) => (min === null || b.per100ml < min ? b.per100ml : min), null);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Side-by-Side Comparison</h2>
              <p className="text-xs text-slate-400">
                Compare volume, ABV, and cost per 100 ml objectively (up to 3 bottles)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-rose-300 cursor-pointer"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {items.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              Tap <strong className="text-slate-200">Compare</strong> on any 2 or 3 bottles in the
              catalogue to compare their value side by side.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {withMetrics.map((b) => {
                const isBestValue = bestPer100 !== null && b.per100ml === bestPer100 && items.length > 1;
                return (
                  <div
                    key={b.id}
                    className={`relative flex flex-col rounded-2xl border p-4 ${
                      isBestValue
                        ? 'border-amber-500/60 bg-amber-500/5'
                        : 'border-slate-800 bg-slate-950/60'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onRemove(b.id)}
                      className="absolute right-3 top-3 z-20 rounded-full bg-slate-900/90 p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                      aria-label={`Remove ${b.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {isBestValue && (
                      <div className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-bold text-slate-950">
                        <Award className="h-3 w-3" />
                        Lowest Rs. / 100 ml
                      </div>
                    )}

                    <BottleSilhouette category={b.category} volumeMl={b.volumeMl} />

                    <span
                      className={`mt-3 w-fit rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getCategoryBadgeClass(
                        b.category
                      )}`}
                    >
                      {b.category}
                    </span>

                    <h3 className="mt-2 text-sm font-bold text-slate-100 min-h-[2.5rem]">{b.name}</h3>

                    <dl className="mt-3 space-y-2 border-t border-slate-800 pt-3 text-xs">
                      <div className="flex justify-between">
                        <dt className="text-slate-400">Approx. Price</dt>
                        <dd className="font-bold text-amber-400">{b.priceDisplay}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-400">Volume</dt>
                        <dd className="text-slate-200">{b.volumeLabel}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-400">ABV</dt>
                        <dd className="text-slate-200">{b.abvLabel || '—'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-400">Cost / 100 ml</dt>
                        <dd className="font-semibold text-slate-100">
                          {b.per100ml ? `Rs. ${b.per100ml.toLocaleString()}` : '—'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-400">Cost / 50 ml pour</dt>
                        <dd className="text-slate-200">
                          {b.per50ml ? `Rs. ${b.per50ml.toLocaleString()}` : '—'}
                        </dd>
                      </div>
                    </dl>

                    {b.price && (
                      <button
                        type="button"
                        onClick={() => onAddToBudget(b)}
                        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add to Budget
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
