const Datastore = require('nedb');
const Twit = require('twit');
const request = require('request');

require('dotenv').config();

const database = new Datastore('database.db');
database.loadDatabase();

function verify() {
    let url = "http://ava.cefor.ifes.edu.br/";

    request(url, (error, res) => {
        let status;

        if (error) {
            console.log("error: " + error);
            status = error;
        } else {
            console.log("res: " + res.statusCode);
            status = res.statusCode;
        }

        //salvar no bd ultima ação
        database.insert({
            status: status,
            date: getCurrentDate()
        });
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

function getCurrentDate() {
    var date = new Date();
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}


//onde a mágica acontece
setInterval(() => verify(), 5 * 60 * 1000); //executa a cada 5 minutos