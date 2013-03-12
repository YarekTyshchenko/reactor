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
        this.$el = $('#dashboard');
        this.controls.forEach(function(control) {
            this.addControl(control);
        }, this);
        // start animation
        this.animate();
        return this;
    },
    addControl: function(control) {
        var View = control.getView();
        var view = new View({
            bindings: control.get('bindings'),
            control: control,
            id: control.get('id')
        });
        view.on('changeControl', _.bind(function(){
            this.trigger('changeControl');
        }, this));
        this.controlViews[control.cid] = view;
        this.$el.append(view.render().el);
    },
    animate: function() {
        var draw = _.bind(function() {
            requestAnimFrame(draw);
            // Drawing code goes here
            _.forEach(this.controlViews, function(view) {
                view.frame();
            });
        }, this);
        draw();
    }
})