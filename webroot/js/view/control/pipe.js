Reactor.View.Pipe = Reactor.View.Control.extend({
    type: 'Pipe',
    scale: 0.18,
    degrees: 0,
    line: null,
    dim: {
            w: 130,
            h: 130
    },
    data: {
        rate: null
    },
    render: function() {
        var paper = Raphael(this.el, this.dim.w, this.dim.h);
        
        var body = paper.rect(2, 2, this.dim.w-4, this.dim.h-4, 12);
        body.attr('fill', '#ccc');
        body.attr('stroke', '#666');
        body.attr('stroke-width', 4);

        var name = paper.text(this.dim.w/2, this.dim.h-20, '');
        name.attr('fill', '#000');
        this.nameLabel = name;

        this.valueLabel = paper.text(15, 15, '0').attr({'text-anchor': 'start'});

        var littleDial = paper.circle(this.dim.w/2+30, this.dim.h/2-30, 18);
        littleDial.attr('fill', '#ccc');
        littleDial.attr('stroke', '#666');
        littleDial.attr('stroke-width', 2);

        var littleCenter = paper.circle(this.dim.w/2+30, this.dim.h/2+-30, 2);
        littleCenter.attr('stroke-width', 0);
        littleCenter.attr('fill', '#000');

        var littleHand = paper.path('M '+(this.dim.w/2+30)+' '+(this.dim.h/2-30+2)+' l -16 -2 l 16 -2');
        littleHand.attr('fill', '#000');
        littleHand.attr('stroke-width', 0);
        this.littleHand = littleHand;

        var mainDial = paper.circle(this.dim.w/2, this.dim.h/2, 30);
        mainDial.attr("fill", "#ccc");
        mainDial.attr("stroke", "#666");
        mainDial.attr("stroke-width", 5);

        var line = paper.path(
            "M "+this.dim.w/2+" "+this.dim.h/2+" l 14.695 20.225 "+
            "m -14.695 -20.225 l 23.776 -7.725 "+
            "m -23.776 7.725 l 0 -25.000 "+
            "m 0 25.000 l -23.776 -7.725 "+
            "m 23.776 7.725 l -14.695 20.225"
        );
        line.attr("stroke", "#000");
        line.attr("stroke-width", '14');
        //line.attr('stroke-linecap', 'round');
        this.line = line;
        this.initRender();
        return this;
    },
    frame: function() {
        this.degrees = (this.data.rate*this.scale + this.degrees);
        this.line.transform('r'+this.degrees%360+","+this.dim.w/2+","+this.dim.h/2);
        this.littleHand.transform('r'+(this.degrees/100)%360+','+(this.dim.w/2+30)+','+(this.dim.h/2-30));
        this.valueLabel.attr('text', $.trim(this.data.rate));
        if (this.control.get('bindings').rate) {
            this.nameLabel.attr('text', this.control.get('bindings').rate.substring(0,25));
        }
    }
})