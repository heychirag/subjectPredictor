console.log("Initialising....");

var bot={};
//bot.toBeAdded = [];
var https = require('https');
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var cron = require('node-cron');

var DB_URI = "mongodb://instabot:pulsung7690@ds151222.mlab.com:51222/heroku_t3fqxl7f";

var log = function (msg) {
  let time = new Date();
  console.log('[' + time.toLocaleString().toString() + '] ' + msg);
};

bot.addUserImages = function (){
  if(bot.fetchedFromAPI.items[0]){
    bot.db.collection('usrimages').findOne({'id': bot.fetchedFromAPI.items[0].id},function(err, docs) {
      if(!docs){
        bot.db.collection('usrimages').insertOne(bot.fetchedFromAPI.items[0]);
        console.log("added",bot.fetchedFromAPI.items[0].id);
        bot.fetchedFromAPI.items.splice(0,1);
      }
      bot.addUserImages();
    });
  }
  else{
    if(bot.fetchedFromAPI.next){
      bot.updateAccount(bot.fetchedFromAPI.next);
    }
    else{
      return;
    }
  }
};

bot.updateAccount = function(profileLink){
  bot.db.collection('user').find({}).toArray(function(DBerror, docs) {
    if(!DBerror){
      bot.fetchedFromDB = docs[0];
    }
    request(profileLink, function (APIerror, response, body) {
      if (!APIerror && response.statusCode == 200) {
        bot.fetchedFromAPI = JSON.parse(body);
        if(!bot.fetchedFromDB){
          bot.db.collection('user').insertOne(bot.fetchedFromAPI);
        }
        else{
          bot.db.collection('user').deleteMany({});
          bot.db.collection('user').insertOne(bot.fetchedFromAPI);
        }
        for(var i in bot.fetchedFromAPI.items){
          bot.fetchedFromAPI.items[i].hashtags = bot.fetchedFromAPI.items[i].caption.text.match(/#([^\s]*)/g);
          bot.fetchedFromAPI.items[i].mentions = bot.fetchedFromAPI.items[i].caption.text.match(/@([^\s]*)/g);
        }
        bot.addUserImages();
      }
    });
  });
};

MongoClient.connect(DB_URI, function(error, response) {
  log("Connected correctly to server");
  bot.db=response;
  bot.updateAccount('https://igapi.ga/whizzzkid/media/');
  cron.schedule('* * 0,6,12,18 * * *',function(){
    console.log("fetching new pics...");
    bot.updateAccount('https://igapi.ga/whizzzkid/media/');
  });
});

