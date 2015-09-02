var request = require('request');
var jsdom   = require('jsdom');
var extend  = require('extend');

var serialGen = require('./serial-generator');

var urls = {
  form_view: 'https://mediaflightplan.com/login/?a=register',
  form_base: 'https://mediaflightplan.com/login/',
  form_post: 'https://mediaflightplan.com/login/register.php'
};

var registration_data = {
  u_uname: 'poopy@butthole.net',
  u_pass1: 'password1',
  u_pass2: 'password1',
  u_firstn: 'poopy',
  u_lastn: 'butthole',
  coll_id: 168,
  sem_id: 3,
  year_id: 11,
  u_class: 'Marketing 101',
  u_prof: 1011288
};

var Checker = function Checker(store) {
  this.store = store;
  this.cookie = '';
  this.busy = false;
};

Checker.prototype.composeReq =  function(url) {
  return {
    followAllRedirects: true,
    url: url,
    headers: {
      referer: urls.form_view,
      cookie: this.cookie
    }
  };
}

Checker.prototype.check = function(cb) {
  var checker = this;
  checker.busy = true;

  request.get( checker.composeReq(urls.form_view), function(err, res, data) {
    if (err) {
      checker.busy = false;
      return cb(err);
    }

    if (res.headers['set-cookie'])
      checker.cookie = res.headers['set-cookie'][0].split(';')[0];

    // PARSE HTML
    jsdom.env(data, [ 'http://code.jquery.com/jquery.js' ],
      function(err, window) {
        if (err) {
          checker.busy = false;
          return cb(err);
        }

        var $ = window.$;
        var form = $('#register');

        var serial = serialGen.generate();

        while (checker.store.has(serial))
          serial = serialGen.generate();

        var parts = serial.split(' ');

        var req = checker.composeReq(urls.form_base + form.attr('action'));
        req.form = extend(registration_data, {
          ser1: parts[0],
          ser2: parts[1],
          ser3: parts[2],
          ser4: parts[3],
          ser5: parts[4]
        });

        // SUBMIT FORM
        request.post(req, function(err, res, data) {
          if (err) {
            checker.busy = false;
            return cb(err);
          }

          jsdom.env(data, [ 'http://code.jquery.com/jquery.js' ],
            function(err, window) {
              if (err) {
                checker.busy = false;
                return cb(err);
              } else {
                var error = null;
                var $errors = null;
                var fail = true;
                try {
                  var $ = window.$;
                  $errors = $('#register .error');;
                  var fail = $errors.length > 12;
                  checker.store.put(serial, !fail);
                } catch(e) {
                  error = e;
                } finally {
                  checker.busy = false;
                  cb(error, serial, !fail, $errors);
                }
              }
            });

        });
      });
  });
};

module.exports = Checker;
