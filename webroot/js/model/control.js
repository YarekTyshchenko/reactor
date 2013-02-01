Reactor.Model.Control = Backbone.Model.extend({
    defaults: {
        // Default view
        id: null,
        view: 'Flow Rate Meter',
        statName: '',
        position: {
            x: null,
            y: null
        }
    },
    initialize: function(options) {
        if (! this.get('id')) {
            this.set('id', 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            }));
        }
    },
    getView: function() {
        return reactor.availableViews[this.get('view')];
    }
})