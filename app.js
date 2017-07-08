console.log("Initialising....");

var db = require('mongoose');
var express = require('express');

var DB_URI = "mongodb://instabot:pulsung7690@ds151222.mlab.com:51222/heroku_t3fqxl7f";

db.connect(DB_URI, {
  useMongoClient: true
}, function (error) {
  if (error) console.error(error);
  else console.log('Database Connected');
});

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(process.env.PORT || this.SERVER_PORT);

//console.log(this.SERVER_PORT);
