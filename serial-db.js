var fs = require('fs');
var serials = require('./serials');

var unsaved = 0;
var SAVE_LIMIT = 10;

var db = {
  has: function(serial) {
    return serials[serial] !== undefined;
  },
  get: function(serial) {
    return serials[serial];
  },
  put: function(serial, result) {
    serials[serial] = result;
    if (++unsaved >= SAVE_LIMIT)
      db.save();
  },
  save: function() {
    fs.writeFile('./serials.json', JSON.stringify(serials), function(err) {
      if (err) throw err;
      unsaved = 0;
    });
  }
};

module.exports = db;
