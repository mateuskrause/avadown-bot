// const Datastore = require('nedb');
const Twit = require('twit');
const request = require('request');

require('dotenv').config();

// const database = new Datastore('database/data.db');
// database.loadDatabase();

function verify() {
    let url = "http://ava.cefor.ifes.edu.br/";

    request(url, (error, res) => {
        if (error) console.log("error: " + error);
        console.log("res: " + JSON.stringify(res));
    });
}

function tweetStatus(message) {
    let bot = new Twit({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        timeout_ms: 60 * 1000
    });

    let tweet = {
        status: message
    }

    bot.post('statuses/update', tweet, tweeted);

    function tweeted(error, data, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Tweeted: " + message);
        }
    }
}

verify();
// setInterval(verify(), 5*1000);