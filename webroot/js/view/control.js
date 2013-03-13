Reactor.View.Control = Backbone.View.extend({
    className: 'control',
    //width: 130,
    //height: 130,
    data: null,
    initialize: function(options) {
        this.bindings = options.bindings;
        this.control = options.control || new Reactor.Model.Control();
        this.control.bind('change', this.updatePosition, this);
        this.data = _.extend({}, this.data);
        _.forEach(this.getModelsByBinding(this.bindings), function(model, name) {
            model.bind('change', function(model) {
                this.refreshData(model, name);
            }, this);
        }, this);
    },
    // setModel: function(binding, model) {
    //     this.models[binding].unbind('change', this.refreshData, this);
    //     this.models[binding] = model;
    //     this.models[binding].bind('change', this.refreshData, this);
    //     this.refreshData();
    // },
    getModelsByBinding: function(bindings) {
        var models = {};
        _.forEach(bindings, function(stat, name) {
            if (!stat) return;
            var statModel = reactor.stats.get(stat);
            if (!statModel) {
                statModel = new Reactor.Model.Stat({
                    name: stat
                });
            }
            reactor.stats.add(statModel);
            models[name] = statModel;
        }, this);
        return models;
    },
    refreshData: function(model, bindingName) {
        this.data[bindingName] = model.get('value');
        this.refresh(bindingName);
    },
    refresh: function(bindingName) {

    },
    frame: function() {

    },
    reset: function() {

    },
    draggableStop: function(event, ui) {
        this.control.set('position', {
            x:ui.position.left,
            y:ui.position.top
        });
        this.trigger('changeControl');
    },
    initRender: function() {
        this.$el.draggable({
            stop: _.bind(function(event, ui) {
                this.draggableStop(event, ui);
            }, this)
        });
        //this.$el.css('width', this.width);
        //this.$el.css('height', this.height);
        this.updatePosition();
    },
    updatePosition: function() {
        this.$el.css('left', this.control.get('position').x);
        this.$el.css('top', this.control.get('position').y);
    }
})