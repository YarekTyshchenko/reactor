Reactor.View.Display = Reactor.View.Control.extend({
    tagName: 'div',
    id: 'display',
    type: 'Digital Display',
    render: function() {
        this.$el.append('<canvas id="'+this.id+'-canvas">');
        var display = new SegmentDisplay(this.id+'-canvas');
        display.pattern         = "#########";
        display.cornerType      = 2;
        display.displayType     = 7;
        display.displayAngle    = 9;
        display.digitHeight     = 20;
        display.digitWidth      = 12;
        display.digitDistance   = 2;
        display.segmentWidth    = 3;
        display.segmentDistance = 0.5;
        display.colorOn         = "rgba(0, 0, 0, 0.9)";
        display.colorOff        = "rgba(0, 0, 0, 0.1)";
        this.display = display;
        this.initRender();
        return this;
    },
    refresh: function() {
        this.value = this.model.get('value');
    },
    frame: function() {
        // Move me to refresh
        var value = this.value.toString();
        while (value.length < this.display.pattern.length) {
            value = ' '+value;
        }
        this.display.setValue(value);
    }
})