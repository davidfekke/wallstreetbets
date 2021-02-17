let timerId;
let lastUpdated;
let currentTweet;
let lastTweet;

import twitter from 'twitter';

const client = new twitter({
  consumer_key: process.env.twitter_ck,
  consumer_secret: process.env.twitter_cs,
  access_token_key: process.env.twitter_atk,
  access_token_secret: process.env.twitter_ats,
});

client.stream('statuses/filter', {track: '$AAPL'},  function(stream){
    stream.on('data', function(tweet) {
        console.log(tweet.text);
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});