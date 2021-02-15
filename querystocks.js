import PG from 'pg';

const Client = PG.Client;

//console.log(Client);

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'etfdb',
    password: 'password',
    port: 5432,
});
await client.connect();

const res = await client.query('SELECT * FROM stock WHERE is_etf = $1',['false']);
console.log(res.rows);
await client.end();
