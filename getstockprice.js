
import yahooStockPrices from 'yahoo-stock-prices';

const price = await yahooStockPrices.getCurrentPrice('AAPL');
console.log(price); // 132.05

const prices = await yahooStockPrices.getHistoricalPrices(0, 22, 2021, 1, 2, 2021, 'GME', '1d');
console.log(prices);
