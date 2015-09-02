var log = require('custom-logger');

var Checker = require('./checker');
var serials = require('./serial-db');

var MAX_CHECKERS = 20;
var checkers = [];

function handleCheck(err, serial, success, $errors) {
  if (err) {
    log.error(err);
  } else {
    log.info('testing serial..', serial);
    if (success) {
      log.info('🎉 SERIAL SEEMS VALID VALID! 😀');
    } else {
      log.warn('serial failed with message:', $errors.eq(0).text());
    }
  }
  console.log();
}

function setup() {
  while (checkers.length < MAX_CHECKERS) {
    checkers[checkers.length] = new Checker(serials);
  }
}

function checkChecker(checker) {
  if (!checker.busy) checker.check(handleCheck);
}

function run() {
  checkers.forEach(checkChecker);
  setTimeout(run, 1000);
}

setup();
run();
