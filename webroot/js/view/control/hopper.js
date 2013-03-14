Reactor.View.Hopper = Reactor.View.Control.extend({
    type: 'Hopper',
    data: {
        quantity: 20
    },
    render: function() {
        this._createWall = _.bind(function() {
            var fixDef = new Box2D.Dynamics.b2FixtureDef;
            fixDef.density = 1.0;
            fixDef.friction = 0.5;
            fixDef.restitution = 0.2;
            fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;

            var bodyDef = new Box2D.Dynamics.b2BodyDef;
            bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
         
            //create ground
            return function(x, y, width, height, angle) {
                bodyDef.position.Set(x, y);
                bodyDef.angle = angle * (Math.PI / 180) || 0;
                fixDef.shape.SetAsBox(width/2, height/2);
                this.world.CreateBody(bodyDef).CreateFixture(fixDef);
            }
        }, this)();
        var canvas = $('<canvas>');
        this.$el.append(canvas);
        
        var context = canvas[0].getContext("2d");

        var debugDraw = new Box2D.Dynamics.b2DebugDraw();
        debugDraw.SetSprite(context);
        debugDraw.SetDrawScale(30.0);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(
            Box2D.Dynamics.b2DebugDraw.e_shapeBit |
            Box2D.Dynamics.b2DebugDraw.e_jointBit
        );

        var world = new Box2D.Dynamics.b2World(
            new Box2D.Common.Math.b2Vec2(0, 9.8),
            // new Box2D.Common.Math.b2Vec2(0, 0),
            true
        );
        world.SetDebugDraw(debugDraw);

        var fixDef = new Box2D.Dynamics.b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        var bodyDef = new Box2D.Dynamics.b2BodyDef;
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(
            0.15 //radius
        );
         
        this._createObject = function(x, y) {
            bodyDef.position.x = x + (Math.random() * 3 - 1.5);
            bodyDef.position.y = y + (Math.random() * 3 - 1.5);
            var object = world.CreateBody(bodyDef);
            object.CreateFixture(fixDef);
            return object;
        }

        this.world = world;
        this.bodies = [];
        this.initRender();
        this._createObject;
        return this;
    },
    finishRender: function() {
        this._createWall(2.8, 4, 0.1, 2.3, -45);
        this._createWall(7.2, 4, 0.1, 2.3, 45);
        this._createWall(2, 2, 0.1, 2);
        this._createWall(8, 2, 0.1, 2);
        this.refresh('quantity');
    },
    refresh: function(namedParam) {
        var x = this.data[namedParam];
        if (this.bodies.length > 500) {
            var length = this.bodies.length;
            for (var i = 0; i < length - 500; i++) {
                this.world.DestroyBody(
                    this.bodies.shift()
                );
            };
        }
        for (var i = 0; i < x || i > 300; i++) {
            this.bodies.push(
                this._createObject(5, -2)
            );
        };
    },
    frame: function() {
        //this._createObject();
        this.world.Step(
            1 / 60,   //frame-rate
            10,       //velocity iterations
            10        //position iterations
        );
        this.world.DrawDebugData();
        this.world.ClearForces();
    }
});