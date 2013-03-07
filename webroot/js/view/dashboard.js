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
    getStatsForBindings: function(bindings) {
        var models = {};
        _.forEach(bindings, function(stat, name) {
            var statModel = this.stats.get(stat);
            if (!statModel) {
                statModel = new Reactor.Model.Stat({
                    name: stat
                });
            }
            this.stats.add(statModel);
            models[name] = statModel;
        }, this);
        return models;
    },
    addControl: function(control) {
        var View = control.getView();
        this.controlViews[control.cid] = new View({
            models: this.getStatsForBindings(control.get('bindings')),
            control: control,
            id: control.get('id')
        });
        this.controlViews[control.cid].on('changeControl', _.bind(function(){
            this.trigger('changeControl');
        }, this));
        this.$el.append(this.controlViews[control.cid].render().el);
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