
/*
import talib from './node_modules/talib/build/Release/talib.node';
*/
import yahooStockPrices from 'yahoo-stock-prices';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const talib = require('talib');
console.log("TALib Version: " + talib.version);

const price = await yahooStockPrices.getCurrentPrice('PLTR');
console.log(`PLTR: ${price}`);

const prices = await yahooStockPrices.getHistoricalPrices(0, 22, 2021, 1, 17, 2021, 'GME', '1d');

prices.forEach(item => {
  const fulldate = convertEpochToDate(item.date);
  item["full_date"] = fulldate;
});

const marketData = { 
  open: prices.map(op => op.open), 
  close: prices.map(op => op.close), 
  high: prices.map(op => op.high), 
  low: prices.map(op => op.low), 
  volume: prices.map(op => op.volume) 
};

talib.execute({
    name: "ADX",
    startIdx: 0,
    endIdx: marketData.close.length - 1,
    high: marketData.high,
    low: marketData.low,
    close: marketData.close,
    optInTimePeriod: 5
}, function (err, result) {
    console.log("Average Directional Movement Index (ADX) Function Results:");
    console.log(result);
});

function convertEpochToDate(epoch) {
    var d = new Date(0);
    d.setUTCSeconds(epoch);
    return d;
}