var reactor = {
    availableViews: {
        'Flow Rate Meter': Reactor.View.Counter,
        'Digital Display': Reactor.View.Display
    },
    settings: {
        config: {
            controls: []
        }
    },
    init: function(pathname) {
        this.socket = io.connect(
            'http://'+window.location.hostname+':20000/'
            //"http://localhost:20000/"
        );
        //this.settings.pathname = pathname;
        this.socket.on('connect', function () {});

        this.stats = new Reactor.Collection.Stats();
        this.controls = new Reactor.Collection.Controls();
        this.dashboard = new Reactor.View.Dashboard({
            stats: this.stats,
            controls: this.controls
        });
        this.dashboard.render();
        this.dashboard.on('changeControl', this.exchangeConfig, this);
        this.setupEvents();
        this.nav = new Reactor.View.Navigation();
        this.nav.setElement($('#navigation'));
        this.nav.render();
        this.nav.on('addControl', this.exchangeConfig, this);
    },
    setupEvents: function() {
        var statsCollection = this.stats;
        this.socket.on('out', function(data) {
            _.forEach(data.list, function(stat) {
                if (! statsCollection.get(stat.name)) {
                    statsCollection.add(new Reactor.Model.Stat(stat));
                } else {
                    statsCollection.get(stat.name).set(stat);
                }
            });
        });
        this.socket.on('updateConfig', _.bind(this.updateConfig, this));
    },
    exchangeConfig: function() {
        // Exchange config
        this.settings.config.controls = this.controls.toJSON();
        var settings = this.settings;
        this.socket.emit('setConfig', this.settings);
    },
    updateConfig: function(settings) {
        if (! settings) {
            return;
        }
        var controls = settings.config.controls;
        _.forEach(controls, function(controlSettings){
            if (! this.stats.get(controlSettings.statName)) {
                this.stats.add(new Reactor.Model.Stat({
                   name: controlSettings.statName
                }));
            }
            if (! this.controls.get(controlSettings.id)) {
                var control = new Reactor.Model.Control(controlSettings);
                reactor.controls.add(control);
            } else {
                this.controls.get(controlSettings.id).set(controlSettings);
            }

        }, this);
    }
};