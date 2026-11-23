import React, { useMemo, useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Users,
  Copy,
  Check,
  Share2,
  Printer,
  Wallet,
} from 'lucide-react';

export default function BudgetDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  onClear,
  budgetCap,
  onBudgetCapChange,
  splitCount,
  onSplitCountChange,
}) {
  const [mixersCost, setMixersCost] = useState(0);
  const [bitesCost, setBitesCost] = useState(0);
  const [copied, setCopied] = useState(false);

  const totals = useMemo(() => {
    const bottlesSubtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);
    const totalBottles = items.reduce((sum, item) => sum + item.qty, 0);
    const grandTotal = bottlesSubtotal + (Number(mixersCost) || 0) + (Number(bitesCost) || 0);
    const people = Math.max(1, Number(splitCount) || 1);
    const perPerson = Math.ceil(grandTotal / people);
    const cap = Number(budgetCap) || 0;
    const pct = cap > 0 ? Math.min(100, Math.round((grandTotal / cap) * 100)) : 0;
    const remaining = cap > 0 ? cap - grandTotal : null;

    return {
      bottlesSubtotal,
      totalBottles,
      grandTotal,
      people,
      perPerson,
      cap,
      pct,
      remaining,
    };
  }, [items, mixersCost, bitesCost, splitCount, budgetCap]);

  const buildWhatsAppText = () => {
    const lines = [
      '*PourPlan LK — Event Beverage Budget*',
      '',
      '*Bottles:*',
      ...items.map(
        (i) =>
          `• ${i.qty}x ${i.name} (${i.volumeLabel}) — Rs. ${(
            (i.price || 0) * i.qty
          ).toLocaleString()}`
      ),
    ];

    if (Number(mixersCost) > 0) {
      lines.push(`• Mixers & Chasers — Rs. ${Number(mixersCost).toLocaleString()}`);
    }
    if (Number(bitesCost) > 0) {
      lines.push(`• Ice & Bites — Rs. ${Number(bitesCost).toLocaleString()}`);
    }

    lines.push('');
    lines.push(`*Total Estimate:* Rs. ${totals.grandTotal.toLocaleString()}`);
    if (totals.people > 1) {
      lines.push(
        `*Split (${totals.people} people):* Rs. ${totals.perPerson.toLocaleString()} / person`
      );
    }
    lines.push('');
    lines.push('_Approximate retail reference only. Enjoy responsibly (21+)._');
    return lines.join('\n');
  };

  const handleCopyWhatsApp = async () => {
    try {
      await navigator.clipboard.writeText(buildWhatsAppText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = buildWhatsAppText();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(buildWhatsAppText())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/75 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Event Budget &amp; Splitter</h2>
              <p className="text-xs text-slate-400">
                {totals.totalBottles} {totals.totalBottles === 1 ? 'bottle' : 'bottles'} planned
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-rose-300 cursor-pointer"
              >
                Clear
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Target Budget Cap */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="budget-cap" className="text-xs font-semibold text-slate-300">
                Target Budget Cap (Rs.)
              </label>
              <input
                id="budget-cap"
                type="number"
                min="0"
                step="1000"
                placeholder="e.g. 25000"
                value={budgetCap || ''}
                onChange={(e) => onBudgetCapChange(e.target.value ? Number(e.target.value) : 0)}
                className="w-32 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-right text-xs font-semibold text-amber-300 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {totals.cap > 0 && (
              <div className="mt-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      totals.remaining < 0
                        ? 'bg-rose-500'
                        : totals.pct > 85
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                    }`}
                    style={{ width: `${totals.pct}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px]">
                  <span className="text-slate-400">{totals.pct}% used</span>
                  {totals.remaining >= 0 ? (
                    <span className="font-medium text-emerald-400">
                      Rs. {totals.remaining.toLocaleString()} remaining
                    </span>
                  ) : (
                    <span className="font-semibold text-rose-400">
                      Over by Rs. {Math.abs(totals.remaining).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottle List */}
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 py-10 text-center text-sm text-slate-400">
              Your budget tray is empty.
              <br />
              <span className="text-xs text-slate-500">
                Tap &quot;+ Add&quot; on any bottle to start calculating.
              </span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-100">{item.name}</p>
                    <p className="text-xs text-slate-400">
                      {item.volumeLabel} · Rs. {(item.price || 0).toLocaleString()} each
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.id, item.qty - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:border-amber-500/50 cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-100">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:border-amber-500/50 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="ml-1 rounded-lg p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Extras */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Optional Extras (Rs.)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Mixers &amp; Chasers</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={mixersCost || ''}
                  placeholder="0"
                  onChange={(e) => setMixersCost(e.target.value ? Number(e.target.value) : 0)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Ice &amp; Bites</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={bitesCost || ''}
                  placeholder="0"
                  onChange={(e) => setBitesCost(e.target.value ? Number(e.target.value) : 0)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bill Splitter */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                <Users className="h-4 w-4" />
                Split Bill Between
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSplitCountChange(Math.max(1, totals.people - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/30 bg-slate-900 text-amber-300 hover:bg-slate-800 cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={totals.people}
                  onChange={(e) =>
                    onSplitCountChange(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-14 rounded-lg border border-amber-500/30 bg-slate-900 py-1 text-center text-xs font-bold text-slate-100 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => onSplitCountChange(totals.people + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/30 bg-slate-900 text-amber-300 hover:bg-slate-800 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between border-t border-amber-500/20 pt-3">
              <span className="text-xs text-slate-300">Per Person Share</span>
              <span className="text-xl font-bold text-amber-400">
                Rs. {totals.perPerson.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Totals & Export */}
        <div className="border-t border-slate-800 bg-slate-950/90 p-5 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-slate-400">Grand Total Estimate</span>
            <span className="text-2xl font-bold text-slate-100">
              Rs. {totals.grandTotal.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={items.length === 0}
              onClick={handleCopyWhatsApp}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy WhatsApp'}
            </button>

            <button
              type="button"
              disabled={items.length === 0}
              onClick={handleOpenWhatsApp}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              Share to WhatsApp
            </button>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => window.print()}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / Save Budget Sheet
          </button>
        </div>
      </div>
    </div>
  );
}
