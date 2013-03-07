Reactor.View.DataBinding = Backbone.View.extend({
    template: _.template($('#dataBindingTemplate').html()),
    className: 'dataBinding',
    name: null,
    data: [],
    initialize: function(options) {
        this.name = options.name;
        this.data = options.autocomplete;
    },
    render: function() {
        this.$el.html(this.template({name:this.name, id:this.cid}));
        this.$el.find('input.binding').autocomplete({
            source: this.data,
            delay: 0,
            minLength: 0
        });
        return this;
    }
});
Reactor.View.ControlContainer = Backbone.View.extend({
    template: _.template($('#controlContainerTemplate').html()),
    className: 'controlContainer',
    events: {
        'click':'highlight'
    },
    view: null,
    onSelect: function() {},
    initialize: function(options) {
        this.view = options.view;
        this.onSelect = options.onSelect;
    },
    getView: function() {
        return this.view;
    },
    render: function() {
        this.$el.html(this.template({view:this.view.render().el}));
        return this;
    },
    highlight: function() {
        this.onSelect(this);
        this.$el.addClass('highlighted');
    },
    unhighlight: function() {
        this.$el.removeClass('highlighted');
    }
});
Reactor.View.AddControlModal = Backbone.View.extend({
    id: 'addControlModal',
    className: 'modal hide fade',
    attributes: {
        tabIndex: '-1',
        role: 'dialog'
    },
    template: _.template($('#addControlModalTemplate').html()),
    events: {
        'click #addControlButton': 'addControl',
        'click #closeModal': 'closeModal'
    },
    controlViews: {},
    runAnimation: true,
    statsList: {},
    initialize: function(options) {
        this.stats = reactor.stats;
        // What about remove
        this.stats.bind('add', this.render, this);
    },
    render: function() {
        this.$el.html(this.template({}));
        var controlsDiv = this.$el.find('#controlList').html('');
        _.forEach(reactor.availableViews, function(View, key) {
            var view = new View({});
            var controlContainer = new Reactor.View.ControlContainer({
                view: view,
                onSelect: _.bind(function(container) {
                    this.selectControl(container);
                }, this)
            });
            controlsDiv.append(controlContainer.render().el);
            this.controlViews[key] = (controlContainer);
        }, this);

        return this;
    },
    selectControl: function(container) {
        if (this.selectedControl && this.selectedControl !== container) {
            this.selectedControl.unhighlight();
        }
        this.selectedControl = container;
        this.populateOptions(container.getView());
    },
    populateOptions: function(view) {
        var options = $('#controlOptions');
        options.find('.name').text(view.type);
        // Clear data bindings
        var dataBindings = options.find('.dataBindings').html('');
        _.forEach(view.data, function(value, name) {
            // Render data binding view
            var binding = new Reactor.View.DataBinding({
                name: name,
                autocomplete: Object.keys(this.statsList)
            });
            dataBindings.append(binding.render().el);
        }, this);
    },
    addControl: function() {
        var bindings = {};
        $('.dataBindings input').each(function(key, input) {
            bindings[$(input).data('name')] = $(input).val();
        });
        this.$el.modal('hide');

        var control = new Reactor.Model.Control({
            bindings: bindings,
            view: this.selectedControl.getView().type,
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
                view.getView().frame();
            });
        }, this);
        draw();
    },
    closeModal: function() {
        this.runAnimation = false;
        _.forEach(this.controlViews, function(view) {
            view.getView().remove();
            view.remove();
        }, this);
        this.controlViews = {};
    }
});

Reactor.View.Navigation = Backbone.View.extend({
    events: {
        'click #addControl': 'addControl'
    },
    modal: {},
    initialize: function(options) {
        this.modal = new Reactor.View.AddControlModal();
    },
    addControl: function(event) {
        event.preventDefault();
        reactor.getStatsList(_.bind(function(list) {
            this.modal.statsList = list;

            this.$el.find('#addControlModal').modal({
                backdrop: false
            }).on('shown', _.bind(function() {
                //$(this).find('#statsList').trigger('change');
                this.modal.render();
                this.modal.animate();
            }, this));
        }, this));
    },
    render: function() {
        this.modal.on('addControl', _.bind(function(){
            this.trigger('addControl')
        }, this));
        this.$el.append(this.modal.render().el);
        return this;
    }
});