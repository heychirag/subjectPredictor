console.log("Initialising....");

var db = require('mongoose');

var DB_URI = "mongodb://instabot:pulsung7690@ds151222.mlab.com:51222/heroku_t3fqxl7f";

db.connect(DB_URI, function (error) {
  if (error) console.error(error);
  else console.log('Database Connected');
});

