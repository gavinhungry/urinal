/**
 * urinal - Simple URI shortening server
 * https://github.com/gavinhungry/urinal
 */

var bodyParser = require('body-parser');
var config = require('./config.json');
var express = require('express');
var uriManager = require('./lib/uri');

var _status = function(res, statusCode) {
  return res.status(statusCode).json(statusCode).end();
};

var app = express();
app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/uri', function(req, res) {
  uriManager.saveUri(req.body.uri || '').then(res.json.bind(res), function(err) {
    _status(res, 500);
  });
});

app.get('/:key', function(req, res) {
  uriManager.crud.read(req.params.key, function(err, doc) {
    if (err) {
      return _status(res, 500);
    }

    if (!doc) {
      return _status(res, 404);
    }

    res.redirect(doc.uri);
  });
});

app.get('/:key/delete/:secret', function(req, res) {
  uriManager.crud.read(req.params.key, function(err, doc) {
    if (err) {
      return _status(res, 500);
    }

    if (!doc) {
      return _status(res, 404);
    }

    if (doc.secret !== req.params.secret) {
      return _status(res, 403);
    }

    uriManager.crud.delete(req.params.key, function(err, removed) {
      if (err) {
        return _status(res, 500);
      }

      if (!removed) {
        return _status(res, 404);
      }

      _status(res, 410);
    });

  });
});

app.get('*', function(req, res) {
  _status(res, 404);
});

console.log('Running on port', config.port);
app.listen(config.port);
