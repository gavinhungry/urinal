/**
 * urinal - URI shortening service
 * https://github.com/gavinhungry/urinal
 */

var config = require('../config.json');
var Datastore = require('nedb');
var path = require('path');

var db = module.exports;

['uris'].forEach(function(database) {
  db[database] = new Datastore({
    filename: path.join(config.db_root, database + '.db'),
    autoload: true
  });

  // auto-compact once per hour
  db[database].persistence.setAutocompactionInterval(3600000);
});
