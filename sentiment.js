import Sentiment from 'sentiment';
import PG from 'pg';

const sentiment = new Sentiment();

const Pool = PG.Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'etfdb',
    password: 'password',
    port: 5432
});

const results = await pool.query(`
    SELECT s.name, m.message 
    FROM mention m
        JOIN stock s
            ON s.id = m.stock_id;
`);

const options = {
    extras: {
      'YOLO': 5,
      'moon': 3,
      '🚀': 5,
      '💎🙌🏾': 4
    }
};

for (let row of results.rows) {
    const sent = sentiment.analyze(row.message, options);
    console.log(`${sent.score}: ${row.name}, ${row.message}`);
}

await pool.end();
