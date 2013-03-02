var util = require('util');
var io = require('socket.io').listen(20000);
var fs = require('fs');
var _ = require('underscore');

var settingsFilename = './config/settings.json';
var settings = {config: {controls: []}};
if (fs.existsSync(settingsFilename)) {
    settings = JSON.parse(fs.readFileSync(settingsFilename, 'utf8'));
}

var statlist = {};
function ReactorBackend(startupTime, config, emitter){
    var self = this;
    this.lastFlush = startupTime;
    this.lastException = startupTime;
    this.config = config.console || {};

    io.set('log level', 2);
    io.sockets.on('connection', function(socket){
        console.log(settings);
        socket.emit('updateConfig', settings);

        socket.on('setConfig', function(data) {
            // Check incoming config
            console.log(data);
            // Save new config
            //if (! settings) {
                settings = data;

                fs.writeFileSync(settingsFilename, JSON.stringify(settings, null, 4));
            //}
            
            socket.broadcast.emit('updateConfig', settings);
        });

        socket.on('getStatsList', function (callback) {
            var finallist = {};
            var recurse = function(bits, stat, list) {
                if (! list) {
                    list = finallist;
                }
                var bit = bits.shift();
                if (bits.length > 0) {
                    if (! list[bit]) {
                        list[bit] = {};
                    }
                    recurse(bits, stat, list[bit]);
                    return;
                }
                list[bit] = stat;
            };
            _.forEach(statlist, function(stat, key) {
                var bits = key.split('.');
                recurse(bits, stat, finallist);
            });
            callback(finallist);
        });
    });

    // Handle disconnect

    this.statsCache = {
        counters: {},
        timers: {}
    };

    // attach
    emitter.on('flush', function(timestamp, metrics) { self.flush(timestamp, metrics); });
    emitter.on('status', function(callback) { self.status(callback); });
};

ReactorBackend.prototype.flush = function(timestamp, metrics) {
    var self = this;
    // merge with previously sent values
    Object.keys(self.statsCache).forEach(function(type) {
        if(!metrics[type]) return;
        var typeName;
        if (type === 'counters') {
            typeName = 'counter';
        } else if (type === 'timers') {
            typeName = 'timer';
        }
        Object.keys(metrics[type]).forEach(function(name) {
            var value = metrics[type][name];
            self.statsCache[type][name] || (self.statsCache[type][name] = 0);
            self.statsCache[type][name] += value;
            statlist[name] = {name: name, type:typeName, value: value};
        });
    });

    Object.keys(metrics.gauges).forEach(function(name) {
        statlist[name] = {name: name, type:'gauge', value: metrics.gauges[name]};
    });

    // Only send stats that we have controls for
    var out = {};
    settings.config.controls.forEach(function(control) {
        if (! out[control.statName]) {
            out[control.statName] = statlist[control.statName];
        }
    });
    io.sockets.emit('out', {list:out});
};

ReactorBackend.prototype.status = function(write) {
    ['lastFlush', 'lastException'].forEach(function(key) {
    write(null, 'console', key, this[key]);
    }, this);
};

exports.init = function(startupTime, config, events) {
    var instance = new ReactorBackend(startupTime, config, events);
    return true;
};