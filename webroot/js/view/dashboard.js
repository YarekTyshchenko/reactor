Reactor.View.Dashboard = Backbone.View.extend({
    tagName: 'div',
    controlViews: {},
    controls: null,
    stats: null,
    initialize: function(options) {
        this.controls = options.controls;
        this.stats = options.stats;
        this.controls.bind('add', this.addControl, this);
    },
    render: function() {
        this.controls.forEach(function(control) {
            this.addControl(control);
        }, this);
        // start animation
        this.animate();
        return this;
    },
    addControl: function(control) {
        var name = control.get('statName');
        var view = control.getView();
        this.controlViews[control.cid] = new view({
            model: this.stats.get(name),
            control: control,
            id: name
        });
        this.controlViews[control.cid].on('changeControl', _.bind(function(){
            this.trigger('changeControl');
        }, this));
        this.$el = $('#dashboard');
        this.$el.append(this.controlViews[control.cid].render().el);
    },
    animate: function() {
        var controlViews = this.controlViews;
        var draw = function() {
            requestAnimFrame(draw);
            // Drawing code goes here
            _.forEach(controlViews, function(view) {
                view.frame();
            });
        }
        draw();
    }
})