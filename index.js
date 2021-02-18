import axios from 'axios';
import PG from 'pg';

const Pool = PG.Pool;

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

// set last epock
const lastepochquery = 'SELECT extract(epoch from MAX(dt)) as maxdate from mention;';
const lastresult = await pool.query(lastepochquery);

let lastEpoch = '';

if (lastresult.rows.length === 1 && lastresult.rows[0].maxdate) {
    console.log(lastresult.rows);

    lastEpoch = lastresult.rows[0].maxdate
}

const getData = async () => {
    const results = await axios.get('https://api.pushshift.io/reddit/search/submission/?subreddit=wallstreetbets&size=100&after=3d');
    return results.data.data;
};

const getDataForEpoch = async (epoch) => {
    const results = await axios.get(`https://api.pushshift.io/reddit/search/submission/?subreddit=wallstreetbets&size=100&after=${epoch}`);
    return results.data.data;
}

let resultArray;
if (lastEpoch !== '') {
    resultArray = await getDataForEpoch(lastEpoch);
} else {
    resultArray = await getData();
}

await processData();

async function processData() {
    for (let element of resultArray) {
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
            console.log(`${element.title}, time: ${element.created_utc}`);
            console.log(element.full_link);
            await insertMention(pool, stockIds, element);
        }
        lastEpoch = element.created_utc;
    }

    await new Promise(r => setTimeout(r, 2000));
    resultArray = await getDataForEpoch(lastEpoch);
    await processData();
}

await pool.end();

async function insertMention(pool, stockIds, element) {
    //  INSERT INTO mention (stock_id, dt, message, source, url) VALUES (6604, 'epoch'::timestamptz + 1613094762 * '1 second'::interval, 'What are you thoughts on $VNDA', 'WallStreetBets', 'https://reddit/r/wallstreetbets/');
    const insertQuery = 'INSERT INTO mention (stock_id, dt, message, source, url) VALUES ($1, \'epoch\'::timestamptz + $2 * \'1 second\'::interval, $3, $4, $5);';

    for (let id of stockIds) {
        await pool.query(insertQuery, [id, element.created_utc, element.title, 'WallStreetBets', element.full_link]);
    }
}

function convertEpochToDate(epoch) {
    var d = new Date(0);
    d.setUTCSeconds(epoch);
    return d;
}
