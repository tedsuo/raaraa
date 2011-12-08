/*!
 * RaaRaa
 */

exports.version = '0.0.1';

function RaaRaa(models) {
    this.init(models);
};

RaaRaa.prototype = {
    // init()
    // sets up models
    init: function(models) {
	this.models = models;
    },
};

exports.RaaRaa = RaaRaa;



