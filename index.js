import axios from 'axios';
import PG from 'pg';

const Pool = PG.Pool;

//console.log(Client);

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'etfdb',
    password: 'password',
    port: 5432
});

const result = await pool.query('SELECT id, symbol FROM stock;');

let stockMap = new Map();
for (const row of result.rows) {
    stockMap.set(`$${row.symbol}`, row.id);
}

let lastEpoch = '';

const getData = async () => {
    const results = await axios.get('https://api.pushshift.io/reddit/search/submission/?subreddit=wallstreetbets&size=100&after=1d');
    return results.data.data;
};

const getDataForEpoch = async (epoch) => {
    const results = await axios.get(`https://api.pushshift.io/reddit/search/submission/?subreddit=wallstreetbets&size=100&after=${epoch}`);
    return results.data.data;
}

let resultArray = await getData();

await processData();

async function processData() {
    resultArray.forEach(element => {
        let doesContainDollarWord = false;
        let stockIds = [];
        const words = element.title.split(' ');
        for (const word of words) {
            if (stockMap.has(word)) {
                stockIds.push(stockMap.get(word));
                doesContainDollarWord = true;
                break;
            }
        }
        if (doesContainDollarWord) {
            console.log(stockIds);
            console.log(`${element.title}, time: ${convertEpochToDate(element.created_utc)}`);
        }
        lastEpoch = element.created_utc;
        //
        //element.title.split(' ').forEach(item => console.log(`Word: ${item}`));
        //console.log('');
    });
    await new Promise(r => setTimeout(r, 2000));
    resultArray = await getDataForEpoch(lastEpoch);
    await processData();
}

const intervalId = setInterval(() => { 
    console.log(`${new Date()}`);
    clearInterval(intervalId); 
}, 1500);

await pool.end();

function convertEpochToDate(epoch) {
    var d = new Date(0);
    d.setUTCSeconds(epoch);
    return d;
}