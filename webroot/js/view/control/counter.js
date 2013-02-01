Reactor.View.Counter = Reactor.View.Control.extend({
    type: 'Flow Rate Meter',
    render: function() {
        this.speed = 0;
        this.value = null;
        this.degrees = 0;
        this.scale = 5.0;

        // Creates canvas 320 × 200 at 10, 50
        var paper = Raphael(this.el, 70, 70);

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
        this.initRender();
        return this;
    },
    refresh: function() {
        var speed = this.model.get('value');
        this.speed = speed;
    },
    frame: function() {
        this.degrees += this.speed/this.scale;
        this.line.transform('r'+this.degrees%360);
    }
})