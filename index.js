const Datastore = require('nedb');
const Twit = require('twit');
const request = require('request');

require('dotenv').config();

const last = new Datastore('last.db');

last.loadDatabase();

const url = "http://ava.cefor.ifes.edu.br/";

console.log("bot rodando");

function verify() {

    request(url, (error, res) => {
        let status;
        let time = getCurrentHour();

        if (error) {
            console.log(getCurrentDate() + " - error: " + error);

        } else {
            console.log(getCurrentDate() + " - res: " + res.statusCode);
            status = res.statusCode;

            last.find({}, (err, docs) => {
                if (docs.length < 1) {

                    last.insert({ last: status });

                    if (status == 200) {
                        tweetStatus("Ainda não");
                    } else {
                        tweetStatus("Sim (" + time + ")");
                    }

                } else {

                    if (docs[0].last != status) {
                        last.update({}, { last: status }, {});
                    }

                    if (status == 200 && docs[0].last != 200) {
                        tweetStatus("Voltou (" + time + ")");
                    } else if (status != 200 && docs[0].last == 200) {
                        tweetStatus("Sim (" + time + ")");
                    }
                }
                

            });
        }

    });
}

function tweetStatus(message) {
    let bot = new Twit({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        timeout_ms: 30 * 1000
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

function getCurrentHour() {
    var date = new Date();
    return padLeadingZeros(date.getHours(), 2) + ":" + padLeadingZeros(date.getMinutes(), 2);
}

function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

//onde a mágica acontece
setInterval(() => verify(), 10 * 1000); //executa a cada 1 minuto

