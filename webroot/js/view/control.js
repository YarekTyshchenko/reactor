Reactor.View.Control = Backbone.View.extend({
    value: null,
    className: 'control',
    events: {
        'click':'highlight'
    },
    width: 130,
    height: 130,
    initialize: function(options) {
        this.model = options.model;
        this.control = options.control || new Reactor.Model.Control();
        this.control.bind('change', this.updatePosition, this);
        this.model.bind('change', this.refresh, this);
        _.bindAll(this);
    },
    setModel: function(model) {
        this.model.unbind('change', this.refresh, this);
        this.model = model;
        this.model.bind('change', this.refresh, this);
        this.refresh();
    },
    refresh: function() {
        this.value = this.model.get('value');
    },
    frame: function() {

    },
    reset: function() {

    },
    highlight: function() {
        this.$el.addClass('highlighted');
        this.trigger('highlight', this);
    },
    unhighlight: function() {
        this.$el.removeClass('highlighted');
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