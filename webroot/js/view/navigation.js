Reactor.View.AddControlModal = Backbone.View.extend({
    id: 'addControlModal',
    className: 'modal hide fade',
    attributes: {
        tabIndex: '-1',
        role: 'dialog'
    },
    template: _.template($('#addControlModalTemplate').html()),
    events: {
        'change #statsList': 'selectStat',
        'click #addControlButton': 'addControl'
    },
    controlViews: {},
    runAnimation: true,
    initialize: function(options) {
        this.stats = reactor.stats;
        // What about remove
        this.stats.bind('add', this.render, this);
        this.animate();
    },
    render: function() {
        this.$el.html(this.template({stats:this.stats.toJSON()}));
        return this;
    },
    selectStat: function(e) {
        var statname = $(e.target).val();
        var controlsDiv = this.$el.find('#controls');
        _.forEach(reactor.availableViews, function(View, key) {
            if (! this.controlViews[key]) {
                var view = new View({
                    model: this.stats.get(statname)
                });
                view.on('highlight', this.selectControl, this);
                controlsDiv.append(view.render().el);
                this.controlViews[key] = (view);
            } else {
                this.controlViews[key].setModel(this.stats.get(statname));
                this.controlViews[key].reset();
            }
        }, this);
    },
    selectControl: function(view) {
        if (this.selectedControl && this.selectedControl !== view) {
            this.selectedControl.unhighlight();
        }
        this.selectedControl = view;
    },
    addControl: function() {
        this.$el.modal('hide');

        var control = new Reactor.Model.Control({
            statName: this.selectedControl.model.get('name'),
            view: this.selectedControl.type
        });
        reactor.controls.add(control);
        this.trigger('addControl');
    },
    animate: function() {
        this.runAnimation = true;
        var draw = _.bind(function() {
            if (this.runAnimation) {
                requestAnimFrame(draw);
            }
            // Drawing code goes here
            _.forEach(this.controlViews, function(view) {
                view.frame();
            });
        }, this);
        draw();
    }
});

Reactor.View.Navigation = Backbone.View.extend({
    events: {
        'click #addControl': 'addControl'
    },
    addControl: function(event) {
        event.preventDefault();

        this.$el.find('#addControlModal').modal({
            backdrop: false
        }).on('shown', function() {
            $(this).find('#statsList').trigger('change');
        });
    },
    render: function() {
        var modal = new Reactor.View.AddControlModal();
        modal.on('addControl', _.bind(function(){
            this.trigger('addControl')
        }, this));
        this.$el.append(modal.render().el);
        return this;
    }
});