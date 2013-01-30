function Reactor(pathname) {
    this.socket = io.connect(
        'http://'+window.location.hostname+':2000/'
        //"http://localhost:2000/"
    );
    this.config = {};
    this.cache = null;
    this.socket.on('connect', function () {});
}

Reactor.prototype = {
    setDataCallback: function(callback) {
        this.socket.on('out', function(data) {
            // Cache the data
            this.cache = data;
            //console.log(this.cache);
            callback(data)
        });
    },
    getConfig: function() {
        return this.config;
    },
    getDataList: function() {
        return this.cache;
    }
}
