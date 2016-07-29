/**
 * urinal - URI shortening service
 * https://github.com/gavinhungry/urinal
 */

var config = require('../config');
var db = require('./db');
var Rudiment = require('rudiment');
var schema = require('js-schema');
var randomString = require('random-string');

var uriManager = module.exports;

uriManager.crud = new Rudiment({
  db: db.uris,

  schema: schema({
    key: String,
    uri: String.of(0, config.max_uri_length, null),
    created: Date,
    secret: String
  })
});

var _generateKey = function(opts) {
  var key = randomString(opts);

  return new Promise(function(res, rej) {
    uriManager.crud.read(key, function(err, doc) {
      if (err) {
        return rej(err);
      }

      doc ? _generateKey(opts).then(res, rej) : res(key);
    });
  });
};

uriManager.saveUri = function(uri) {
  if (uri.indexOf('://') === -1) {
    uri = 'http://' + uri;
  }

  return _generateKey().then(function(key) {
    return new Promise(function(res, rej) {
      uriManager.crud.create({
        key: key,
        uri: uri,
        created: new Date(),
        secret: randomString({ length: 16 })
      }, function(err, doc) {
        err ? rej(err) : res(doc);
      });
    });
  });
};
