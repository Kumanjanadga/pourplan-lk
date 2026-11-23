# PourPlan LK — Sri Lanka Event Beverage Budget & Price Guide

A modern, dark-slate & amber-gold React + Vite + Tailwind CSS web app for planning event beverage budgets, splitting bills, comparing cost per 100 ml, and checking upcoming Sri Lanka Poya / Excise dry days.

## Run Locally

```bash
cd pourplan-lk
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

The production-ready static files are generated inside the `dist/` folder.

## Free Hosting Options

### Option 1: Cloudflare Pages (Recommended — Unlimited Bandwidth)
1. Push this folder to a GitHub repository.
2. Go to [Cloudflare Pages](https://www.cloudflare.com/products/pages/) and click **Create a project → Connect to Git**.
3. Select your repository and use:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**.

### Option 2: Vercel Hobby Plan
1. Push this folder to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) → **Add New Project** → import your repo.
3. Vite is detected automatically; click **Deploy**.

## Updating Bottle Prices
Edit `src/data/bottles.json` directly—each entry has `name`, `category`, `abv`, `volumeMl`, `price`, `priceDisplay`, and `lastUpdated`.
# pourplan-lk
