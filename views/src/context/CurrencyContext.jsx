import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchExchangeRates } from "../api/currency";

const CURRENCIES = [
  { code: "AUD", symbol: "A$", label: "AUD A$" },
  { code: "EGP", symbol: "\u00A3E", label: "EGP \u00A3E" },
  { code: "EUR", symbol: "\u20AC", label: "EUR \u20AC" },
  { code: "JPY", symbol: "\u00A5", label: "JPY \u00A5" },
  { code: "USD", symbol: "$", label: "USD $" },
];

const STORAGE_KEY = "porsche-currency";

function getInitialCurrency() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && CURRENCIES.some((c) => c.code === raw)) return raw;
  } catch {}
  return "USD";
}

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(getInitialCurrency);
  const [rates, setRates] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {}
  }, [currency]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const result = await fetchExchangeRates();
      if (active) setRates(result);
    };

    load();

    return () => { active = false; };
  }, []);

  const convertPrice = useCallback(
    (usdAmount) => {
      if (currency === "USD" || !rates) return usdAmount;
      const rate = rates[currency];
      if (!rate) return usdAmount;
      return usdAmount * rate;
    },
    [currency, rates],
  );

  const activeCurrency = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const formatPrice = useCallback(
    (usdAmount) => {
      const converted = convertPrice(usdAmount);
      return `${activeCurrency.symbol} ${Math.round(converted).toLocaleString()}`;
    },
    [convertPrice, activeCurrency],
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, currencies: CURRENCIES, convertPrice, formatPrice, activeCurrency }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
