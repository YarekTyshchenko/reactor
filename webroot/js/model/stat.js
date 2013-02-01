Reactor.Model.Stat = Backbone.Model.extend({
    defaults: {
        name: '',
        value: null,
        oldValue: null
    },
    idAttribute: "name"
});