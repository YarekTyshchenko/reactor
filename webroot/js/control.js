function Control() {

};

Control.prototype = {
    refresh: function(value) {
        console.log('refreshed with '+value);
    },
    frame: function() {
        console.log('Frame clocked');
    }
};

Control.counter = Counter;

function Counter() {
    this.speed = 0;
    this.value = null;
    this.degrees = 0;
    this.scale = 5.0;

    // Creates canvas 320 × 200 at 10, 50
    var paper = Raphael("counter", 70, 70);

    // Creates circle at x = 50, y = 40, with radius 10
    var circle = paper.circle(35, 35, 32);
    // Sets the fill attribute of the circle to red (#f00)
    circle.attr("fill", "#ccc");

    // Sets the stroke attribute of the circle to white
    circle.attr("stroke", "#000");

    this.line = paper.path("M10,35L60,35");
    this.line.attr("stroke", "#000");
    this.line.attr("stroke-width", '6');
    this.line.attr('stroke-linecap', 'round');
};

Counter.prototype = new Control();
Counter.prototype.refresh = function(value) {
    this.oldValue = this.value;
    this.value = value;
    if (! this.oldValue) {
        return;
    }

    var speed = value - this.oldValue;
    this.speed = speed;
};
Counter.prototype.frame = function() {
    // Advance the turn by this.speed
    this.degrees += this.speed/this.scale;
    this.line.transform('r'+this.degrees%360);
}