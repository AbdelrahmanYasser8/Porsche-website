const FALLBACK_RATES = {
  EUR: 0.86, GBP: 0.74, JPY: 160, AUD: 1.40, CAD: 1.39,
  CHF: 0.79, CNY: 6.77,
};

const API_URLS = [
  "https://open.er-api.com/v6/latest/USD",
];

const CACHE_KEY = "porsche-rates-cache";
const CACHE_TTL = 3600000;

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const { rates, ts } = JSON.parse(raw);
      if (Date.now() - ts < CACHE_TTL) return rates;
    }
  } catch {}
  return null;
}

function setCached(rates) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, ts: Date.now() }));
  } catch {}
}

export async function fetchExchangeRates() {
  const cached = getCached();
  if (cached) return cached;

  for (const url of API_URLS) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const rates = data.rates;
      if (rates) {
        setCached(rates);
        return rates;
      }
    } catch {
      continue;
    }
  }

  return FALLBACK_RATES;
}
