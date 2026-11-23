import React, { useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronUp, Moon } from 'lucide-react';
import dryDays from '../data/dryDays.json';

function parseLocalDate(isoStr) {
  const [y, m, d] = isoStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatReadableDate(isoStr) {
  const dt = parseLocalDate(isoStr);
  return dt.toLocaleDateString('en-LK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function PoyaAlertBanner() {
  const [expanded, setExpanded] = useState(false);

  const { nextDryDay, daysAway, upcoming } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const future = dryDays
      .map((item) => {
        const dt = parseLocalDate(item.date);
        const diffDays = Math.round((dt - today) / (1000 * 60 * 60 * 24));
        return { ...item, diffDays };
      })
      .filter((item) => item.diffDays >= 0);

    return {
      nextDryDay: future[0] || null,
      daysAway: future[0]?.diffDays ?? null,
      upcoming: future.slice(0, 6),
    };
  }, []);

  if (!nextDryDay) return null;

  const isUrgent = daysAway <= 3;

  return (
    <div
      className={`no-print border-b transition-colors ${
        isUrgent
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-slate-900/80 border-slate-800/80'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                isUrgent
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-amber-300 border border-amber-500/25'
              }`}
            >
              <Moon className="h-3 w-3" />
              {daysAway === 0
                ? 'DRY DAY TODAY'
                : daysAway === 1
                  ? 'TOMORROW'
                  : `IN ${daysAway} DAYS`}
            </span>
            <span className="text-slate-200">
              Next Sri Lanka Dry Day:{' '}
              <strong className="text-amber-300">{nextDryDay.name}</strong>{' '}
              <span className="text-slate-400">({formatReadableDate(nextDryDay.date)})</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-amber-300 transition cursor-pointer"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{expanded ? 'Hide calendar' : 'Upcoming dry days'}</span>
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-800/80 pt-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-2 text-xs"
              >
                <div>
                  <p className="font-medium text-slate-200">{day.name}</p>
                  <p className="text-slate-400">{formatReadableDate(day.date)}</p>
                </div>
                <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-amber-300">
                  {day.diffDays === 0 ? 'Today' : `${day.diffDays}d`}
                </span>
              </div>
            ))}
            <p className="col-span-full text-[11px] text-slate-500">
              Liquor sales are prohibited nationwide on Full Moon Poya Days and designated Excise
              dry days. Dates follow official Sri Lanka public holiday schedules and remain subject
              to Excise Department notices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
