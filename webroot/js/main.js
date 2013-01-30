$(function(){
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    var controls = {};
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
        if (! controls[name]) {
            controls[name] = new Control.counter();
        }
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
        controls[name].refresh(value);
    }

    function draw() {
        requestAnimFrame(draw);
        // Drawing code goes here
        Object.keys(controls).forEach(function(name) {
            controls[name].frame();
        });
    }
    draw();
});