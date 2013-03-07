Reactor.View.Control = Backbone.View.extend({
    className: 'control',
    width: 130,
    height: 130,
    data: {},
    initialize: function(options) {
        this.models = options.models || {};
        this.control = options.control || new Reactor.Model.Control();
        this.control.bind('change', this.updatePosition, this);
        _.forEach(this.models, function(model) {
            model.bind('change', this.refreshData, this);
        }, this);
    },
    // setModel: function(binding, model) {
    //     this.models[binding].unbind('change', this.refreshData, this);
    //     this.models[binding] = model;
    //     this.models[binding].bind('change', this.refreshData, this);
    //     this.refreshData();
    // },
    refreshData: function() {
        _.forEach(this.models, function(stat, name) {
            this.data[name] = stat.get('value');
        }, this);
        this.refresh();
    },
    refresh: function() {

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
        this.$el.css('width', this.width);
        this.$el.css('height', this.height);
        this.updatePosition();
    },
    updatePosition: function() {
        this.$el.css('left', this.control.get('position').x);
        this.$el.css('top', this.control.get('position').y);
    }
})