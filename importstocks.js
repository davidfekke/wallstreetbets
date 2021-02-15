import path from 'path';
import { promises as fsPromises } from 'fs';

const __dirname = path.dirname(import.meta.url);

const nysecsv = path.join(__dirname, 'NYSE_screener.csv');
const nasdaqcsv = 'NASDAQ_screener.csv';
const amexcsv = 'AMEX_screener.csv';

const insert_query = 'INSERT INTO stock (symbol, name, exchange, is_etf) VALUES ($1, $2, $3, $4)';

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
  

// const client = new Client({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'etfdb',
//     password: 'password',
//     port: 5432,
// });
//await client.connect();

try {
    const nysedata = await fsPromises.readFile('NYSE_screener.csv', 'UTF-8');
    const nyseArray = nysedata.split('\r\n'); 
    nyseArray.shift();
    for (let item of nyseArray) {
        const row = item.split(',');
        console.log(`NASDAQ Symbol: ${row[0]}, name: ${row[1]}`);
        await pool.query(insert_query,[row[0], row[1],'NYSE', 'false']);
    }
} catch (err) {
    console.error(err);
}

try {
    const nasdaqdata = await fsPromises.readFile('nasdaq_screener.csv', 'UTF-8');
    const nasdaqArray = nasdaqdata.split('\r\n'); 
    nasdaqArray.shift();
    for (let item of nasdaqArray) {
        const row = item.split(',');
        console.log(`NASDAQ Symbol: ${row[0]}, name: ${row[1]}`);
        await pool.query(insert_query,[row[0], row[1],'NASDAQ', 'false']);
    }
} catch (err) {
    console.error(err);
}

try {
    const amexdata = await fsPromises.readFile('AMEX_screener.csv', 'UTF-8');
    const amexArray = amexdata.split('\r\n'); 
    amexArray.shift();

    for (let item of amexArray) {
        const row = item.split(',');
        console.log(`AMEX Symbol: ${row[0]}, name: ${row[1]}`);
        await pool.query(insert_query,[row[0], row[1],'AMEX', 'false']);
    }
} catch (err) {
    console.error(err);
}

await pool.end();



