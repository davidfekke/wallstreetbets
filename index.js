import axios from 'axios';

// axios.get('https://api.pushshift.io/reddit/search/submission/?subreddit=wallstreetbets&q=$GME&after=1d')
//     .then(result => { console.log(result.data.data) })
//     .catch(err => CloseEvent.error(err));

const getData = async () => {
    const results = await axios.get('https://api.pushshift.io/reddit/search/submission/?subreddit=wallstreetbets&q=$GME&after=1d');
    return results.data.data;
};

const resultArray = await getData();
console.log(resultArray.length);
