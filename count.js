var serials = require('./serials');

var total = Object.keys(serials).length;
var good = 0;

Object.keys(serials).forEach(function(s) {
	if (serials[s]) good++;
});

console.log('total:', total);
console.log('good: ', good);
console.log('bad:  ', total - good);


