var util = require('util');
var io = require('socket.io').listen(20000);
var settings = {
    config: {
        controls: []
    }
};

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
            //}
            
            socket.broadcast.emit('updateConfig', settings);
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
    var statlist = {};

    // merge with previously sent values
    Object.keys(self.statsCache).forEach(function(type) {
        if(!metrics[type]) return;
        Object.keys(metrics[type]).forEach(function(name) {
            var value = metrics[type][name];
            self.statsCache[type][name] || (self.statsCache[type][name] = 0);
            self.statsCache[type][name] += value;
            statlist[name] = {name: name, type:'counter', value: value};
        });
    });

    Object.keys(metrics.gauges).forEach(function(name) {
        statlist[name] = {name: name, type:'gauge', value: metrics.gauges[name]};
    });

    var out = {
        counters: this.statsCache.counters,
        timers: this.statsCache.timers,
        gauges: metrics.gauges,
        timer_data: metrics.timer_data,
        counter_rates: metrics.counter_rates,
        sets: function (vals) {
            var ret = {};
            for (val in vals) {
                ret[val] = vals[val].values();
            }
            return ret;
        }(metrics.sets),
        pctThreshold: metrics.pctThreshold,
        list: statlist
    };
    io.sockets.emit('out', out);
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