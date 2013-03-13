Reactor.View.Dots = Reactor.View.Control.extend({
    type: 'Dots',
    data: {
        value: 1,
    },
    dots: null,
    _arrangeDots: function(value) {
        var width = Math.sqrt(2*value/3);
        var height = 3*width/2;
        return {
            rows: Math.ceil(width),
            columns: Math.ceil(height)
        };
    },
    render: function() {
        var paper = Raphael(this.el, 150, 100);
        this.dots = [];

        this._createDot = _.bind(function(x, y, interval) {
            var dot = paper.circle(
                x*interval*3+(interval),
                y*interval*3+(interval),
                interval,
                interval
            );
            dot.attr('fill', '#0C0');
            dot.attr('stroke', '#000');
            dot.attr('stroke-width', 0);
            this.dots.push(dot);
        }, this);

        this.initRender();
        this.refresh('value');
        return this;
    },
    refresh: function(bindingName) {
        if (! this.data[bindingName]) return;

        // Clear old dots
        _.forEach(this.dots, function(dot) {
            dot.remove();
        });
        this.dots = [];
        
        // Work out position
        var grid = this._arrangeDots(this.data[bindingName]);
        var interval = Math.min(100*1.5/grid.rows, 100/grid.columns) / 2;
        for (var y = 0; y < grid.rows; y++) {
            for (var x = 0; x < grid.columns; x++) {
                if (this.data[bindingName]-- > 0) {
                    this._createDot(x, y, interval);
                }
            };
        };
    }
});