
import twitter from 'twitter';
import PG from 'pg';

const Pool = PG.Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'etfdb',
    password: 'password',
    port: 5432
});

const result = await pool.query('SELECT id, symbol FROM stock WHERE symbol = \'AAPL\';');

const stock_id = result.rows[0].id;

const client = new twitter({
  consumer_key: process.env.twitter_ck,
  consumer_secret: process.env.twitter_cs,
  access_token_key: process.env.twitter_atk,
  access_token_secret: process.env.twitter_ats,
});

client.stream('statuses/filter', {track: '$PLTR'}, function(stream){
    stream.on('data', async function(tweet) {
        //console.log(tweet);
        console.log(tweet.text);

        await insertMention(pool, stock_id, tweet);
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});

async function insertMention(pool, stock_id, tweet) {
    //  INSERT INTO mention (stock_id, dt, message, source, url) VALUES (6604, 'epoch'::timestamptz + 1613094762 * '1 second'::interval, 'What are you thoughts on $VNDA', 'WallStreetBets', 'https://reddit/r/wallstreetbets/');
    const insertQuery = 'INSERT INTO mention (stock_id, dt, message, source, url) VALUES ($1, NOW(), $2, $3, $4);';
    const full_link = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
    
    const result = await pool.query(insertQuery, [stock_id, tweet.text, 'twitter', full_link]);
    console.log(result);
}
