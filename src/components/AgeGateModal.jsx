import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function AgeGateModal({ onConfirm }) {
  const [underage, setUnderage] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl shadow-black/70">
        <div className="mb-5 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            {underage ? <AlertTriangle className="h-7 w-7" /> : <ShieldCheck className="h-7 w-7" />}
          </div>
        </div>

        <h2 className="font-display text-center text-2xl font-bold text-slate-100">
          {underage ? 'Access Restricted (21+)' : 'Age Confirmation Required'}
        </h2>

        {underage ? (
          <div className="mt-4 space-y-4 text-center text-sm text-slate-300">
            <p>
              Under Section 31(1) of Sri Lanka&apos;s National Authority on Tobacco and Alcohol (NATA)
              Act, No. 27 of 2006, alcohol-related reference tools are restricted to adults aged
              21 and over.
            </p>
            <button
              type="button"
              onClick={() => setUnderage(false)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700 transition"
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            <p className="mt-3 text-center text-sm leading-relaxed text-slate-300">
              <strong className="text-amber-400">PourPlan LK</strong> is a neutral, informational
              event budgeting and price reference tool for Sri Lanka. We do not sell, deliver, or
              promote alcohol.
            </p>

            <div className="mt-5 rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 text-xs text-slate-400 leading-relaxed">
              By entering, you confirm that you are at least{' '}
              <strong className="text-slate-200">21 years of age</strong> (the legal purchasing age
              in Sri Lanka) and agree to use this tool strictly for personal event planning.
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition cursor-pointer shadow-lg shadow-amber-500/20"
              >
                I am 21 or older
              </button>
              <button
                type="button"
                onClick={() => setUnderage(true)}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 transition cursor-pointer"
              >
                Under 21
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
