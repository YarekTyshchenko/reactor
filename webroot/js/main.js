$(function(){
    var counters = {};
    var gauges = {};
    var reactor = new Reactor(window.location.pathname);
    reactor.setDataCallback(function(data) {
        data.list.counters.forEach(function(name){
            // Get the counter object by name
            updateControl(name, data.counters[name], counters);
        });
        data.list.gauges.forEach(function(name){
            updateControl(name, data.gauges[name], gauges);
        });
    });

    var updateControl = function(name, value, counters) {
        if (! counters[name]) {
            counters[name] = new JustGage({
                id: "g1",
                value: 0,
                min: 0,
                max: 40000,
                title: name,
                label: ''
            });
        }
        counters[name].refresh(value);
    }
});