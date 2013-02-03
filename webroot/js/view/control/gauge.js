Reactor.View.Gauge = Reactor.View.Control.extend({
	type: 'Gauge',
	value: 0,
	max: 1,
	min: 0,
	dim: {
            w: 130,
            h: 130
    },
	render: function() {
		var paper = Raphael(this.el, this.dim.w, this.dim.h);
		
		paper.setStart();
		var body = paper.rect(2, 2, this.dim.w-4, this.dim.h-4, 12);
        var divider = paper.path('M 2 '+(this.dim.h-this.dim.h/3)+' l '+(this.dim.w-4)+' 0');
        var set = paper.setFinish();
        set.attr('fill', '#ccc');
        set.attr('stroke', '#666');
        set.attr('stroke-width', 4);

        var needle = paper.path('M '+(this.dim.w/2)+',30 l 0, 50');
        needle.attr('stroke-width', 4);
        //needle.attr('stroke-linecap', 'round');
        this.needle = needle;

        var name = paper.text(this.dim.w/2, this.dim.h-20, '');
        name.attr('fill', '#000');
        this.nameLabel = name;

        this.valueLabel = paper.text(15, 15, '0').attr({'text-anchor': 'start'});

		this.initRender();
		return this;
	},
	refresh: function() {
		this.value = this.model.get('value');
		if (this.value > this.max) {
			this.max = this.value;
		}
	},
	frame: function() {
		//this.value = 50;
		// -50 to 50
		// 0 to 1000
		var value = ((100/this.max) * this.value) - 50;
		//console.log(value);
		this.needle.transform('r'+(value)+' '+this.dim.w/2+' 100');

		this.valueLabel.attr('text', $.trim(this.value));
        this.nameLabel.attr('text', this.model.get('name').substring(0,25));
	},
	reset: function() {
		this.max = 1;
		this.min = 0;
		this.value = 0;
	}
})