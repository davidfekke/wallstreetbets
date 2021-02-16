import PG from 'pg';

const Pool = PG.Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'etfdb',
    password: 'password',
    port: 5432
});

//const result = await pool.query('SELECT id, symbol FROM stock LIMIT 100;');

const full_link = 'https://www.reddit.com/r/wallstreetbets/comments/lk3d23/not_a_loss_until_i_sell_waiting_patiently_on_my/';

const insertQuery = 'INSERT INTO mention (stock_id, dt, message, source, url) VALUES ($1, \'epoch\'::timestamptz + $2 * \'1 second\'::interval, $3, $4, $5);';
try {
    const result = await pool.query(insertQuery, [1996, 1613355513, 'Not a loss until I sell, waiting patiently on my leap calls, let’s gooooooooo $NOK', 'WallStreetBets', full_link]);
    console.log(result);
} catch (err) {
    console.error(err);
} finally {
    await pool.end();
}

async function insertMention(pool, stockIds, element) {
    //  INSERT INTO mention (stock_id, dt, message, source, url) VALUES (6604, 'epoch'::timestamptz + 1613094762 * '1 second'::interval, 'What are you thoughts on $VNDA', 'WallStreetBets', 'https://reddit/r/wallstreetbets/');
    const insertQuery = 'INSERT INTO mention (stock_id, dt, message, source, url) VALUES ($1, \'epoch\'::timestamptz + $2 * \'1 second\'::interval, $3, $4, $5);';

    for (let id of stockIds) {
        await pool.query(insertQuery, id, element.created_utc, element.title, 'WallStreetBets', element.full_link);
    }
}