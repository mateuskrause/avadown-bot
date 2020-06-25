const Datastore = require('nedb');
const Twit = require('twit');
const request = require('request');

require('dotenv').config();

const log = new Datastore('log.db');
const last = new Datastore('last.db');
log.loadDatabase();
last.loadDatabase();

//
setInterval(() => verify(), 5 * 60 * 1000); //executa a cada 5 minutos
//

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

            last.find({}, (err, docs) => {
                if (docs.length < 1) {

                    last.insert({ last: status });

                    if (status == 200) {
                        tweetStatus("Ainda não");
                        insertLog();
                    } else {
                        tweetStatus("Sim (Erro " + status + ")");
                        insertLog();
                    }

                } else {

                    if(docs[0].last != status){
                        last.update({}, { last: status }, {});
                    }

                    if (status == 200 && docs[0].last != 200) {
                        tweetStatus("Voltou");
                        insertLog();
                    } else if (status != 200 && docs[0].last == 200) {
                        tweetStatus("Sim (Erro " + status + ")");
                        insertLog();
                    }
                }
            });
        }

        function insertLog() {
            log.insert({
                status: status,
                date: getCurrentDate()
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
        timeout_ms: 60 * 1000 //timeoout de segurança acho eu
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