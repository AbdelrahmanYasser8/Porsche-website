const FALLBACK_RATES = {
  EUR: 0.92, AUD: 1.50, JPY: 150, EGP: 48,
};

const API_URL = "https://open.er-api.com/v6/latest/USD";
const CACHE_KEY = "porsche-rates-cache";
const CACHE_TTL = 3600000;

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const { rates, ts } = JSON.parse(raw);
      if (Date.now() - ts < CACHE_TTL) return rates;
    }
  } catch {
    return null;
  }
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

  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const data = await response.json();
      if (data.rates) {
        setCached(data.rates);
        return data.rates;
      }
    }
  } catch {}

  return FALLBACK_RATES;
}
