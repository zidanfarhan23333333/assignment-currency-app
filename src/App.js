import { useEffect, useState } from "react";
import styles from "./App.module.css";

const API_KEY = process.env.REACT_APP_API_KEY;

const API_URL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`;

function App() {
  const [currencies, setCurrencies] = useState({});

  const getPercentageValue = (numStr, percentage) => {
    const num = parseFloat(numStr);
    return (num * percentage) / 100;
  };

  const getPurchaseRate = (exchangeRate, percentage) => {
    return (
      parseFloat(exchangeRate) + getPercentageValue(exchangeRate, percentage)
    );
  };

  const getSellRate = (exchangeRate, percentage) => {
    return (
      parseFloat(exchangeRate) - getPercentageValue(exchangeRate, percentage)
    );
  };

  const formatApiData = (apiResult) => {
    const { rates } = apiResult;
    const percentage = 2.5;
    const selectedCurrencies = ["CAD", "EUR", "IDR", "JPY", "CHF", "GBP"];

    const filteredRates = selectedCurrencies.map((currency) => [
      currency,
      rates[currency],
    ]);

    const filteredRatesObject = Object.fromEntries(filteredRates);

    const result = {
      curr: {
        title: "Currency",
        values: Object.keys(filteredRatesObject),
      },
      purchaseRate: {
        title: "We Buy",
        values: Object.values(filteredRatesObject).map((rate) =>
          getPurchaseRate(rate, percentage).toFixed(5)
        ),
      },
      exchangeRate: {
        title: "Exchange Rate",
        values: Object.values(filteredRatesObject).map((rate) =>
          parseFloat(rate).toFixed(5)
        ),
      },
      sellRate: {
        title: "We Sell",
        values: Object.values(filteredRatesObject).map((rate) =>
          getSellRate(rate, percentage).toFixed(5)
        ),
      },
    };

    setCurrencies(result);
  };

  const fetchCurrencyData = async () => {
    try {
      const res = await fetch(API_URL);
      console.log("[Response Status]:", res.status);

      if (!res.ok) {
        const respJson = await res.json();
        console.error("[API Error]:", respJson);
        throw respJson;
      }

      const result = await res.json();
      console.log("[API Result]:", result);
      formatApiData(result);
    } catch (error) {
      console.error("[fetchCurrencyData Error]:", error);
    }
  };

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.container}>
        {Object.keys(currencies).length > 0 ? (
          Object.keys(currencies).map((key) => (
            <div key={key} style={{ width: "100%" }}>
              <h1 style={{ color: "white", marginBottom: "10px" }}>
                {currencies[key].title}
              </h1>
              {currencies[key].values.map((value, index) => (
                <div key={index}>
                  <p style={{ marginBottom: "5px", color: "white" }}>{value}</p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p style={{ color: "white" }}>Loading...</p>
        )}
      </section>
    </main>
  );
}

export default App;
