var SER_SEED = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var SER_LEN  = 5;

function generateSegment() {
  var serial = '';

  while (serial.length < SER_LEN) {
    serial += SER_SEED.charAt(Math.floor(Math.random() * SER_SEED.length));
  }

  return serial;
}

module.exports = {
  generate: function() {
    return generateSegment() + ' ' +
      generateSegment() + ' ' +
      generateSegment() + ' ' +
      generateSegment() + ' ' +
      generateSegment();
  }
};
