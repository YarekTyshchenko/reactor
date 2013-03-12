Reactor.View.Cistern = Reactor.View.Control.extend({
    type: 'Cistern',
    data: {
        value: null,
        max: null
    },
    options: {
        max: 8062268000
    },
    label: null,
    insert: null,
    oldClip: null,
    render: function() {
        var paper = Raphael(this.el, 100, 100);
        
        var body = paper.circle(50, 50, 50-2, 50-2);
        body.attr('fill', '#FFF');
        body.attr('stroke', '#000');
        body.attr('stroke-width', 4);


        var insert = paper.circle(50, 50, 42, 42);
        insert.attr('stroke-width', 0);
        insert.attr('fill', '#ACC');
        //var clip = paper.rect(0, 0, 50, 50);
        insert.attr({"clip-rect": "8, 8, 84, 84"});
        this.insert = insert;

        var label = paper.text(50, 50, '');
        label.attr('fill', '#000');
        this.label = label;

        this.initRender();
        return this;
    },
    //refreshData: function(model, bindingName) {
    //    this.data[bindingName] = model.get('value');
    //},
    frame: function() {
        var max = this.data.max || this.options.max;
        if (!max) return;
        var t = ((100 - (this.data.value / max))/100 * 84);
        if (!t || t < 0 || t > 84) return;
        var rect = [
            8, t+8, 84, 84-t
        ].join(',');
        if (this.oldClip == rect) return;
        this.oldClip = rect;
        this.insert.attr({"clip-rect": rect});
        this.label.attr('text', $.trim(Math.round((this.data.value / max)*10000)/100)+'%');
    }
})