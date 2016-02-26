(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition();else if (typeof define == 'function' && _typeof(define.amd) == 'object') define(definition);else this[name] = definition();
}('domready', function () {

  var fns = [],
      listener,
      doc = document,
      hack = doc.documentElement.doScroll,
      domContentLoaded = 'DOMContentLoaded',
      loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);

  if (!loaded) doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener);
    loaded = 1;
    while (listener = fns.shift()) {
      listener();
    }
  });

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn);
  };
});

},{}],2:[function(require,module,exports){
"use strict";

var Constants = {
    SHOW_FPS: false,

    LOGIC_REFRESH_RATE: 60,

    COLLISION_GROUPS: {
        SHIP: Math.pow(2, 0),
        ENEMY: Math.pow(2, 1),
        SHIPPROJECTILE: Math.pow(2, 2),
        ENEMYPROJECTILE: Math.pow(2, 3),
        SHIPEXPLOSION: Math.pow(2, 4),
        ENEMYEXPLOSION: Math.pow(2, 5),
        OBJECT: Math.pow(2, 6),
        TERRAIN: Math.pow(2, 10)
    },

    STORAGE_SIZE: 1000
};

module.exports = Constants;

},{}],3:[function(require,module,exports){
(function (global){
"use strict";

global.Utils = require("wm/Utils");
global.Constants = require("wm/Constants");

var domready = require("domready");
var Core = require("wm/renderer/Core");
var LogicInit = require('wm/LogicInit');
var gameCore;

function Init() {}

Init.prototype.start = function () {
    domready(function () {
        var logicWorker = new Worker('dist/LogicInit.js');
        var core = new Core(logicWorker);
        gameCore = core;
        console.log(gameCore);
    });
};

var init = new Init();
init.start();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"domready":1,"wm/Constants":2,"wm/LogicInit":4,"wm/Utils":5,"wm/renderer/Core":23}],4:[function(require,module,exports){
(function (global){
"use strict";

global.Utils = require("wm/Utils");
global.Constants = require("wm/Constants");

if ('function' === typeof importScripts) {
    importScripts('../../lib/p2.js');
    importScripts('../../lib/threex.loop.js');
    var LogicCore = require('wm/logic/Core');
    self.core = new LogicCore(self);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"wm/Constants":2,"wm/Utils":5,"wm/logic/Core":6}],5:[function(require,module,exports){
'use strict';

var Utils = {
    makeRandomColor: function makeRandomColor() {
        var colors = ['', '', ''];

        colors.forEach(function (color, index) {
            var newColor = Math.floor(Math.random() * 256).toString(16);
            colors[index] = newColor.length === 1 ? '0' + newColor : newColor;
        });

        var color = '0x' + colors.join('');
        return Number(color);
    },

    degToRad: function degToRad(degrees) {
        return degrees * (Math.PI / 180);
    },

    radToDeg: function radToDeg(radians) {
        return radians * (180 / Math.PI);
    },

    getRandomFloat: function getRandomFloat(min, max) {
        if (min > max) throw 'ERROR: getRandomFloat min > max';
        return Math.random() * (max - min) + min;
    },

    getRandomInteger: function getRandomInteger(min, max) {
        if (min > max) throw 'ERROR: getRandomInteger min > max';
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    rand: function rand(min, max) {
        return this.getRandomInteger(min, max);
    },

    mixin: function mixin(receiver, donor) {
        for (var prop in donor.prototype) {
            receiver[prop] = donor.prototype[prop];
        }
    },

    uptrunc: function uptrunc(x) {
        return x < 0 ? Math.floor(x) : Math.ceil(x);
    },

    angleToVector: function angleToVector(angle, velocity) {
        velocity = velocity || 0;
        return [Math.sin(angle) * -1 * velocity, Math.cos(angle) * velocity];
    },

    vectorAngleToPoint: function vectorAngleToPoint(p1x, p2x, p1y, p2y) {
        // var dotproduct = p1x*p2x + p1y*p2y;
        // var determinant = p1x*p2y - p1y*p2x;
        var angle = Math.atan2(p1y, p1x) - Math.atan2(p2y, p2x);

        angle = angle * 360 / (2 * Math.PI);

        if (angle < 0) {
            angle = angle + 360;
        }
        return angle;
    },

    angleBetweenPoints: function angleBetweenPoints(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dx, dy);
        theta *= 180 / Math.PI;
        if (theta < 0) theta = 360 + theta;
        return theta;
    },

    firstToUpper: function firstToUpper(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

};

if (!Function.prototype.extend) {
    Function.prototype.extend = function (oldClass) {
        this.prototype = Object.create(oldClass.prototype);
        this.prototype.constructor = oldClass;
    };
}

module.exports = Utils;

},{}],6:[function(require,module,exports){
"use strict";

var RenderBus = require("wm/logic/RenderBus");
var GameWorld = require("wm/logic/GameWorld");
var ActorManager = require("wm/logic/actorManagement/ActorManager");
var GameScene = require("wm/logic/GameScene");

function Core(worker) {
    this.makeMainComponents(worker);
    this.startGameLoop();
    this.scene.fillScene();
    this.initFpsCounter();

    this.running = false;
}

Core.prototype.makeMainComponents = function (worker) {
    this.renderBus = new RenderBus({ worker: worker, core: this });
    this.world = new GameWorld();
    this.actorManager = new ActorManager({ world: this.world, core: this });
    this.scene = new GameScene({ world: this.world, actorManager: this.actorManager, core: this });
};

Core.prototype.initFpsCounter = function () {
    var _this = this;

    this.logicTicks = 0;
    if (Constants.SHOW_FPS) {
        setInterval(function () {
            console.log('logicTicks: ', _this.logicTicks);
            _this.logicTicks = 0;
        }, 1000);
    }
};

Core.prototype.processGameLogic = function () {
    if (this.running) {
        this.doTick();
    }
};

Core.prototype.doTick = function () {
    this.actorManager.update(this.renderBus.inputState);
    this.world.step(1 / Constants.LOGIC_REFRESH_RATE);
    this.renderBus.postMessage('updateActors', this.world.makeUpdateData());
    this.logicTicks++;
    this.scene.update();
};

Core.prototype.startGameLoop = function () {
    var logicLoop = new THREEx.PhysicsLoop(Constants.LOGIC_REFRESH_RATE);
    logicLoop.add(this.processGameLogic.bind(this));
    logicLoop.start();
};

Core.prototype.start = function () {
    this.running = true;
};

Core.prototype.pause = function () {
    this.running = false;
};

Core.prototype.endGame = function (info) {
    this.renderBus.postMessage('gameEnded', info);
};

module.exports = Core;

},{"wm/logic/GameScene":7,"wm/logic/GameWorld":8,"wm/logic/RenderBus":9,"wm/logic/actorManagement/ActorManager":10}],7:[function(require,module,exports){
'use strict';

var ActorFactory = require("wm/renderer/actorManagement/ActorFactory")('logic');

function GameScene(config) {
    Object.assign(this, config);
    if (!this.world) throw new Error('No world specified for Logic GameScene');
    if (!this.actorManager) throw new Error('No actorManager specified for Logic GameScene');
    if (!this.core) throw new Error('No core specified for Logic GameScene');
    this.timer = 0;
}

GameScene.prototype.fillScene = function () {
    for (var i = 0; i < 100; i++) {
        this.actorManager.addNew({
            classId: ActorFactory.MOOK,
            positionX: Utils.rand(100, 150),
            positionY: Utils.rand(100, 150),
            angle: Utils.rand(0, 360)
        });
    }

    for (var i = 0; i < 100; i++) {
        this.actorManager.addNew({
            classId: ActorFactory.PILLAR,
            positionX: Utils.rand(0, 1) === 1 ? Utils.rand(-390, -20) : Utils.rand(20, 390),
            positionY: Utils.rand(0, 1) === 1 ? Utils.rand(-390, -20) : Utils.rand(20, 390),
            angle: Utils.rand(0, 360)
        });
    }

    this.actorManager.addNew({
        classId: ActorFactory.WALL,
        positionX: 0,
        positionY: -400,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.WALL,
        positionX: 0,
        positionY: 400,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.WALL,
        positionX: 400,
        positionY: 0,
        angle: Math.PI / 2
    });

    this.actorManager.addNew({
        classId: ActorFactory.WALL,
        positionX: -400,
        positionY: 0,
        angle: Math.PI / 2
    });

    var playerActor = this.actorManager.addNew({
        classId: ActorFactory.SHIP,
        positionX: 0,
        positionY: 0,
        angle: 0
    });

    this.actorManager.setPlayerActor(playerActor);

    this.core.doTick();

    console.log("scene complete");
};

GameScene.prototype.update = function () {
    this.timer++;

    for (var i = 0; i < 0; i++) {
        this.actorManager.addNew({
            classId: ActorFactory.PROJECTILE,
            positionX: 0,
            positionY: 0,
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(220, 280)
        });
    }
};

module.exports = GameScene;

},{"wm/renderer/actorManagement/ActorFactory":26}],8:[function(require,module,exports){
'use strict';

function GameWorld(config) {
    p2.World.apply(this, arguments);

    this.transferArray = new Float32Array(Constants.STORAGE_SIZE * 5);

    config = config || {};
    this.gravity = [0, 0];
    this.islandSplit = false;
    this.applyGravity = false;
    this.applySpringForces = false;
    this.defaultContactMaterial.friction = 0;
    this.solver.iterations = 20;
    this.solver.tolerance = 0.02;

    console.log(this);

    Object.assign(this, config);

    this.on('impact', this.onCollision.bind(this));
}

GameWorld.extend(p2.World);

GameWorld.prototype.makeUpdateData = function () {
    var deadActors = [];
    var transferArray = this.transferArray;

    for (var i = 0; i < this.bodies.length; i++) {
        var body = this.bodies[i];
        transferArray[i * 5] = body.actorId;
        transferArray[i * 5 + 1] = body.dead ? -1 : body.classId;
        transferArray[i * 5 + 2] = body.position[0];
        transferArray[i * 5 + 3] = body.position[1];
        transferArray[i * 5 + 4] = body.angle;

        if (body.dead) {
            deadActors.push(body.actorId);
            body.onDeath();
            this.removeBody(body);
        }

        body.update();
    }

    return {
        length: this.bodies.length,
        transferArray: this.transferArray,
        deadActors: deadActors
    };
};

GameWorld.prototype.onCollision = function (collisionEvent) {
    collisionEvent.bodyA.onCollision(collisionEvent.bodyB);
    collisionEvent.bodyB.onCollision(collisionEvent.bodyA);
};

module.exports = GameWorld;

},{}],9:[function(require,module,exports){
'use strict';

function RenderBus(config) {
    if (!config.worker) throw new Error('No worker object specified for Logic Render Bus');
    this.worker = config.worker;
    this.core = config.core;
    this.inputState = {};

    this.worker.onmessage = this.handleMessage.bind(this);
}

RenderBus.prototype.postMessage = function (type, message) {
    message.type = type;
    this.worker.postMessage(message);
};

RenderBus.prototype.handleMessage = function (message) {
    switch (message.data.type) {
        case 'inputState':
            this.inputState = message.data;
            break;
        case "debug":
            console.log(event.data.message);
            break;
        case "pause":
            this.core.pause();
            break;
        case "start":
            this.core.start();
            break;
    }
};

module.exports = RenderBus;

},{}],10:[function(require,module,exports){
'use strict';

var ActorFactory = require("wm/renderer/actorManagement/ActorFactory")('logic');

function ActorManager(config) {
    config = config || {};
    this.core = null;
    this.storage = Object.create(null);
    this.world = null;
    this.factory = config.factory || ActorFactory.getInstance();
    this.currentId = 1;
    this.playerActors = [];

    Object.assign(this, config);

    if (!this.world) throw new Error('No world for Logic ActorManager!');

    setInterval(this.checkEndGameCondition.bind(this), 3000);
}

ActorManager.prototype.addNew = function (config) {
    if (Object.keys(this.storage).length >= Constants.STORAGE_SIZE) {
        console.warn('Actor manager storage is full! Cannot create new Actor!');
        return;
    }
    var actor = this.factory.create(config);
    actor.manager = this;
    actor.world = this.world;
    actor.body.actorId = this.currentId;
    actor.body.classId = config.classId;
    this.storage[this.currentId] = actor;
    this.currentId++;
    this.world.addBody(actor.body);
    actor.onSpawn();
    return actor;
};

ActorManager.prototype.update = function (inputState) {
    this.playerActors.forEach(function (actorId) {
        if (this.storage[actorId]) {
            this.storage[actorId].playerUpdate(inputState);
        }
    }.bind(this));

    for (var actorId in this.storage) {
        this.storage[actorId].update();
    }
};

ActorManager.prototype.setPlayerActor = function (actor) {
    this.playerActors.push(actor.body.actorId);
    this.core.renderBus.postMessage('attachPlayer', { actorId: actor.body.actorId });
};

ActorManager.prototype.removeActorAt = function (actorId) {
    delete this.storage[actorId];
};

ActorManager.prototype.endGame = function () {
    var startingMooks = 100; //todo: definitely not the place for that
    var mookCount = 0;
    for (var actorId in this.storage) {
        if (this.storage[actorId].classId === ActorFactory.MOOK) {
            mookCount++;
        }
    }
    this.core.endGame({ remaining: mookCount, killed: startingMooks - mookCount });
};

ActorManager.prototype.checkEndGameCondition = function () {
    var mookCount = 0;
    for (var actorId in this.storage) {
        if (this.storage[actorId].classId === ActorFactory.MOOK) {
            mookCount++;
        }
    }
    if (mookCount === 0) {
        this.endGame();
    }
};

module.exports = ActorManager;

},{"wm/renderer/actorManagement/ActorFactory":26}],11:[function(require,module,exports){
'use strict';

function BaseActor(config) {
    Object.assign(this, config);

    this.body = this.createBody();
    if (!this.body) throw new Error('No body defined for Logic Actor!');

    this.body.position = [this.positionX || 0, this.positionY || 0];
    this.body.angle = this.angle || 0;
    this.body.actor = this;
    this.body.velocity = Utils.angleToVector(this.angle, this.velocity || 0);

    this.acceleration = 0;
    this.turnSpeed = 0;
    this.thrust = 0;
    this.rotationForce = 0;

    this.hp = Infinity;
    this.damage = 0;

    this.timeout = Infinity;
    this.timer = 0;

    this.removeOnHit = false;
}

BaseActor.prototype.createBody = function () {
    return null;
};

BaseActor.prototype.update = function () {
    this.timer++;
    if (this.timer > this.timeout) {
        this.onDeath();
    }
    this.customUpdate();
};

BaseActor.prototype.onCollision = function (otherActor) {
    if (otherActor) {
        this.hp -= otherActor.damage;
    }

    if (this.hp <= 0 || this.removeOnHit) {
        this.onDeath();
    }
};

BaseActor.prototype.remove = function (actorId) {
    this.manager.removeActorAt(actorId);
};

BaseActor.prototype.customUpdate = function () {};

BaseActor.prototype.playerUpdate = function () {};

BaseActor.prototype.onDeath = function () {
    this.body.dead = true;
};

BaseActor.prototype.onSpawn = function () {};

module.exports = BaseActor;

},{}],12:[function(require,module,exports){
"use strict";

function BaseBody(config) {
    p2.Body.apply(this, arguments);
    this.actorId = null;
    config.position = config.position || [0, 0];
    config.angle = Utils.degToRad(config.angle || 0);
    config.shape = config.shape || this.createShape();
    Object.assign(this, config);
    this.initShape();
}

BaseBody.extend(p2.Body);

BaseBody.prototype.createShape = function () {
    return new p2.Circle({ radius: 1 });
};

BaseBody.prototype.initShape = function () {
    this.addShape(this.shape);
};

BaseBody.prototype.onDeath = function () {
    this.actor.remove(this.actorId);
};

BaseBody.prototype.onCollision = function (otherBody) {
    this.actor.onCollision(otherBody.actor);
};

BaseBody.prototype.update = function () {};

module.exports = BaseBody;

},{}],13:[function(require,module,exports){
"use strict";

var BaseBody = require("wm/logic/actor/components/body/BaseBody");
var BaseActor = require("wm/logic/actor/BaseActor");
var ActorFactory = require("wm/renderer/actorManagement/ActorFactory")('logic');

function MookActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.acceleration = 100;
    this.turnSpeed = 0.8;

    this.thrust = 0;
    this.rotationForce = 0;

    this.hp = 4;

    this.weaponTimer = 0;
    this.shotsFired = 0;
}

MookActor.extend(BaseActor);

MookActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Convex({
            vertices: [[-5, 3], [0, 0], [5, 3], [0, 4]],
            collisionGroup: Constants.COLLISION_GROUPS.ENEMY,
            collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.SHIPEXPLOSION
        }),
        actor: this,
        mass: 2,
        damping: 0.75,
        angularDamping: 0,
        inertia: 10
    });
};

MookActor.prototype.customUpdate = function () {
    this.actorLogic();

    if (this.thrust !== 0) {
        this.body.applyForceLocal([0, this.thrust * this.acceleration]);
    }

    if (this.rotationForce !== 0) {
        this.body.angularVelocity = this.rotationForce * this.turnSpeed;
    } else {
        this.body.angularVelocity = 0;
    }

    this.processWeapon();
};

MookActor.prototype.processWeapon = function () {
    if (this.weaponTimer > 0) {
        this.weaponTimer--;
    }
    if (this.requestShoot && this.weaponTimer === 0) {
        this.shoot();
        this.shotsFired++;
    }
    if (this.shotsFired >= 3) {
        this.requestShoot = false;
    }
};

MookActor.prototype.actorLogic = function () {
    if (Utils.rand(0, 100) === 100) this.rotationForce = Utils.rand(-2, 2);
    if (Utils.rand(0, 100) > 97) {
        var thrustRand = Utils.rand(0, 100);
        if (thrustRand > 20) {
            this.thrust = 1;
        } else if (thrustRand <= 2) {
            this.thrust = -1;
        } else {
            this.thrust = 0;
        }
    }
    var weaponRand = Utils.rand(0, 200);
    if (weaponRand === 199) {
        this.shotsFired = 0;
        this.requestShoot = true;
    }
};

MookActor.prototype.shoot = function () {
    this.weaponTimer += 3;
    this.manager.addNew({
        classId: ActorFactory.MOLTENPROJECTILE,
        positionX: this.body.position[0],
        positionY: this.body.position[1],
        angle: this.body.angle,
        velocity: 100
    });
    this.body.applyForceLocal([0, -3000]);
};

MookActor.prototype.onDeath = function () {
    for (var i = 0; i < 10; i++) {
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(0, 100)
        });
    }
    this.body.dead = true;
};

MookActor.prototype.onSpawn = function () {};

module.exports = MookActor;

},{"wm/logic/actor/BaseActor":11,"wm/logic/actor/components/body/BaseBody":12,"wm/renderer/actorManagement/ActorFactory":26}],14:[function(require,module,exports){
"use strict";

var BaseBody = require("wm/logic/actor/components/body/BaseBody");
var BaseActor = require("wm/logic/actor/BaseActor");

function PillarActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);
}

PillarActor.extend(BaseActor);

PillarActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Box({
            height: 20,
            width: 20,
            collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
            collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE
        }),
        actor: this,
        mass: 0
    });
};

module.exports = PillarActor;

},{"wm/logic/actor/BaseActor":11,"wm/logic/actor/components/body/BaseBody":12}],15:[function(require,module,exports){
"use strict";

var BaseBody = require("wm/logic/actor/components/body/BaseBody");
var BaseActor = require("wm/logic/actor/BaseActor");

function WallActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);
}

WallActor.extend(BaseActor);

WallActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Box({
            height: 10,
            width: 800,
            collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
            collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE
        }),
        actor: this,
        mass: 0
    });
};

module.exports = WallActor;

},{"wm/logic/actor/BaseActor":11,"wm/logic/actor/components/body/BaseBody":12}],16:[function(require,module,exports){
"use strict";

var BaseBody = require("wm/logic/actor/components/body/BaseBody");
var BaseActor = require("wm/logic/actor/BaseActor");

function ChunkActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);
    this.hp = 1;
    this.removeOnHit = true;
    this.timeout = Utils.rand(25, 100);
}

ChunkActor.extend(BaseActor);

ChunkActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Circle({
            radius: 1,
            collisionGroup: Constants.COLLISION_GROUPS.OBJECT,
            collisionMask: Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.SHIPPROJECTILE
        }),
        actor: this,
        mass: 0.01
    });
};

ChunkActor.prototype.onSpawn = function () {
    this.body.angularVelocity = Utils.rand(-15, 15);
};

module.exports = ChunkActor;

},{"wm/logic/actor/BaseActor":11,"wm/logic/actor/components/body/BaseBody":12}],17:[function(require,module,exports){
"use strict";

var BaseBody = require("wm/logic/actor/components/body/BaseBody");
var BaseActor = require("wm/logic/actor/BaseActor");
var ActorFactory = require("wm/renderer/actorManagement/ActorFactory")('logic');

function ShipActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.acceleration = 700;
    this.backwardAccelerationRatio = 1;
    this.horizontalAccelerationRatio = 1;
    this.turnSpeed = 6;
    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    this.thrust = 0;
    this.rotationForce = 0;

    this.lastInputStateX = 0;
    this.lastInputStateY = 0;

    this.daze = 0;
    this.primaryWeaponTimer = 0;
    this.secondaryWeaponTimer = 0;

    this.hp = 10;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Convex({
            vertices: [[-4, 0], [-1.5, -4], [1.5, -4], [4, 0], [4, 2.5], [0, 5], [-4, 2.5]],
            collisionGroup: Constants.COLLISION_GROUPS.SHIP,
            collisionMask: Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.ENEMYEXPLOSION
        }),
        actor: this,
        mass: 4,
        damping: 0.8,
        angularDamping: 0,
        inertia: 10
    });
};

ShipActor.prototype.customUpdate = function () {
    this.processMovement();
    this.processWeapon();
};

ShipActor.prototype.processMovement = function () {
    if (this.rotationForce !== 0) {
        this.body.angularVelocity = this.rotationForce * this.turnSpeed;
    } else {
        this.body.angularVelocity = 0;
    }

    if (this.thrust !== 0) {
        this.body.applyForceLocal([0, this.thrust * this.acceleration]);
    }

    if (this.horizontalThrust !== 0) {
        this.body.applyForceLocal([this.horizontalThrust * this.acceleration, 0]);
    }
};

ShipActor.prototype.processWeapon = function () {
    if (this.primaryWeaponTimer > 0) {
        this.primaryWeaponTimer--;
    }
    if (this.requestShootPrimary && this.primaryWeaponTimer === 0) {
        this.shootPrimary();
    }
    if (this.secondaryWeaponTimer > 0) {
        this.secondaryWeaponTimer--;
    }
    if (this.requestShootSecondary && this.secondaryWeaponTimer === 0) {
        this.shootSecondary();
    }
};

ShipActor.prototype.playerUpdate = function (inputState) {
    this.applyThrustInput(inputState);
    this.applyRotationInput(inputState);
    this.applyWeaponInput(inputState);
};

ShipActor.prototype.applyRotationInput = function (inputState) {
    this.rotationForce = 0;

    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle = Utils.vectorAngleToPoint(angleVector[0], inputState.lookX - this.body.position[0], angleVector[1], inputState.lookY - this.body.position[1]);

    if (angle < 180 && angle > 0) {
        this.rotationForce = Math.min(angle / this.stepAngle, 1) * -1;
    }

    if (angle >= 180 && angle < 360) {
        this.rotationForce = Math.min((360 - angle) / this.stepAngle, 1);
    }

    if (inputState.q) {
        this.rotationForce = 1;
    }

    if (inputState.e) {
        this.rotationForce = -1;
    }

    this.lastInputStateX = inputState.lookX;
    this.lastInputStateY = inputState.lookY;
};

ShipActor.prototype.applyThrustInput = function (inputState) {
    this.thrust = 0;
    this.horizontalThrust = 0;

    if (inputState.a) {
        this.horizontalThrust = -1 * this.horizontalAccelerationRatio;
    }

    if (inputState.d) {
        this.horizontalThrust = 1 * this.horizontalAccelerationRatio;
    }

    if (inputState.w) {
        this.thrust = 1;
    }

    if (inputState.s) {
        this.thrust = -1 * this.backwardAccelerationRatio;
    }
};

ShipActor.prototype.applyWeaponInput = function (inputState) {
    this.requestShootPrimary = !!inputState.mouseLeft;
    this.requestShootSecondary = !!inputState.mouseRight;
};

ShipActor.prototype.shootPrimary = function () {
    this.primaryWeaponTimer += 10;
    var offsetPosition = Utils.angleToVector(this.body.angle + Utils.degToRad(90), 5);
    this.manager.addNew({
        classId: ActorFactory.PLASMAPROJECTILE,
        positionX: this.body.position[0] + offsetPosition[0],
        positionY: this.body.position[1] + offsetPosition[1],
        angle: this.body.angle,
        velocity: 200
    });

    offsetPosition = Utils.angleToVector(this.body.angle - Utils.degToRad(90), 5);
    this.manager.addNew({
        classId: ActorFactory.PLASMAPROJECTILE,
        positionX: this.body.position[0] + offsetPosition[0],
        positionY: this.body.position[1] + offsetPosition[1],
        angle: this.body.angle,
        velocity: 200
    });
};

ShipActor.prototype.shootSecondary = function () {
    this.secondaryWeaponTimer += 15;
    var offsetPosition = Utils.angleToVector(this.body.angle + Utils.degToRad(90), 3.2);
    this.manager.addNew({
        classId: ActorFactory.LASERPROJECITLE,
        positionX: this.body.position[0] + offsetPosition[0],
        positionY: this.body.position[1] + offsetPosition[1],
        angle: this.body.angle,
        velocity: 400
    });

    offsetPosition = Utils.angleToVector(this.body.angle - Utils.degToRad(90), 3.2);
    this.manager.addNew({
        classId: ActorFactory.LASERPROJECITLE,
        positionX: this.body.position[0] + offsetPosition[0],
        positionY: this.body.position[1] + offsetPosition[1],
        angle: this.body.angle,
        velocity: 400
    });
};

ShipActor.prototype.onDeath = function () {
    for (var i = 0; i < 40; i++) {
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(0, 100)
        });
    }
    this.body.dead = true;
    this.manager.endGame();
};

module.exports = ShipActor;

},{"wm/logic/actor/BaseActor":11,"wm/logic/actor/components/body/BaseBody":12,"wm/renderer/actorManagement/ActorFactory":26}],18:[function(require,module,exports){
"use strict";

var BaseBody = require("wm/logic/actor/components/body/BaseBody");
var BaseActor = require("wm/logic/actor/BaseActor");

function LaserProjectileActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.hp = 1;
    this.damage = 2;
    this.removeOnHit = true;
    this.timeout = 60;
}

LaserProjectileActor.extend(BaseActor);

LaserProjectileActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Circle({
            radius: 1,
            collisionGroup: Constants.COLLISION_GROUPS.SHIPPROJECTILE,
            collisionMask: Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN
        }),
        actor: this,
        mass: 1,
        ccdSpeedThreshold: 1,
        ccdIterations: 4
    });
};

LaserProjectileActor.prototype.onDeath = function () {
    this.body.dead = true;
};

module.exports = LaserProjectileActor;

},{"wm/logic/actor/BaseActor":11,"wm/logic/actor/components/body/BaseBody":12}],19:[function(require,module,exports){
"use strict";

var BaseBody = require("wm/logic/actor/components/body/BaseBody");
var BaseActor = require("wm/logic/actor/BaseActor");

function MoltenProjectileActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.hp = 1;
    this.damage = 1;
    this.removeOnHit = true;
    this.timeout = 1000;
}

MoltenProjectileActor.extend(BaseActor);

MoltenProjectileActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Circle({
            radius: 1,
            collisionGroup: Constants.COLLISION_GROUPS.ENEMYPROJECTILE,
            collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN
        }),
        actor: this,
        mass: 2,
        ccdSpeedThreshold: -1,
        ccdIterations: 4
    });
};

MoltenProjectileActor.prototype.onDeath = function () {
    this.body.dead = true;
};

module.exports = MoltenProjectileActor;

},{"wm/logic/actor/BaseActor":11,"wm/logic/actor/components/body/BaseBody":12}],20:[function(require,module,exports){
"use strict";

var BaseBody = require("wm/logic/actor/components/body/BaseBody");
var BaseActor = require("wm/logic/actor/BaseActor");

function PlasmaProjectileActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.hp = 1;
    this.damage = 0.5;
    this.removeOnHit = true;
    this.timeout = 60;
}

PlasmaProjectileActor.extend(BaseActor);

PlasmaProjectileActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Circle({
            radius: 2,
            collisionGroup: Constants.COLLISION_GROUPS.SHIPPROJECTILE,
            collisionMask: Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN
        }),
        actor: this,
        mass: 1,
        ccdSpeedThreshold: -1,
        ccdIterations: 4
    });
};

PlasmaProjectileActor.prototype.onDeath = function () {
    this.body.dead = true;
    //
    // var explosionBody = new ExplosionBody({
    //     position: this.body.position,
    //     radius: 20,
    //     lifetime: 1,
    //     mass: 2,
    //     damage: 1
    // });

    //this.world.addBody(explosionBody);
};

module.exports = PlasmaProjectileActor;

},{"wm/logic/actor/BaseActor":11,"wm/logic/actor/components/body/BaseBody":12}],21:[function(require,module,exports){
"use strict";

function Camera(config) {
    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.VIEW_ANGLE = 45;
    this.ASPECT = this.WIDTH / this.HEIGHT;
    this.NEAR = 0.1;
    this.FAR = 1000;

    this.ZOOM_THRESHOLD = 0.995;
    this.zoomSpeed = 5;

    config = config || {};
    Object.assign(this, config);
    THREE.PerspectiveCamera.call(this, this.VIEV_ANGLE, this.ASPECT, this.NEAR, this.FAR);
    this.position.z = 800;

    this.expectedPositionZ = this.position.z;

    this.mousePosition = new THREE.Vector3(0, 0, 1);
}

Camera.extend(THREE.PerspectiveCamera);

Camera.prototype.update = function () {
    if (this.actor) {
        this.position.x = this.actor.position[0];
        this.position.y = this.actor.position[1];
    }

    var inputState = this.inputListener.inputState;

    if (this.inputListener && this.actor) {
        if (this.inputListener.inputState.scrollUp) {
            this.position.z += inputState.scrollUp;
        }

        if (this.inputListener.inputState.scrollDown) {
            this.position.z -= inputState.scrollDown;
        }
    }

    if (this.expectedPositionZ != this.position.z) {
        if (this.expectedPositionZ / this.position.z > this.ZOOM_THRESHOLD) {
            this.position.z = this.expectedPositionZ;
        } else {
            this.position.z += this.expectedPositionZ > this.position.z ? (this.expectedPositionZ + this.position.z) / this.zoomSpeed : (this.expectedPositionZ - this.position.z) / this.zoomSpeed;
        }
        this.updateProjectionMatrix();
    }
};

Camera.prototype.setPositionZ = function (newPositionZ, zoomSpeed) {
    this.zoomSpeed = zoomSpeed ? zoomSpeed : this.zoomSpeed;
    this.expectedPositionZ = newPositionZ;
};

module.exports = Camera;

},{}],22:[function(require,module,exports){
'use strict';

function ControlsHandler(config) {
    if (!config.inputListener) throw new Error('No inputListener specified for the handler!');
    if (!config.logicBus) throw new Error('No logic bus specified for the handler!');

    Object.assign(this, config);

    this.inputListener = config.inputListener;
    this.logicBus = config.logicBus;
    this.oldInputState = {};
    this.inputState = {};

    this.camera = config.camera;
    this.mousePosition = new THREE.Vector3(0, 0, 1);
}

ControlsHandler.prototype.update = function () {
    Object.assign(this.oldInputState, this.inputState);
    Object.assign(this.inputState, this.inputListener.inputState);

    this.setSceneMousePosition();

    var changed = false;
    for (var key in this.inputState) {
        if (this.inputState[key] != this.oldInputState[key]) {
            changed = true;
        }
    }

    if (changed) this.sendUpdate();
};

ControlsHandler.prototype.sendUpdate = function () {
    this.logicBus.postMessage('inputState', this.inputState);
};

ControlsHandler.prototype.setSceneMousePosition = function () {
    if (!this.camera) {
        return;
    }

    this.mousePosition.x = this.inputState.mouseX;
    this.mousePosition.y = this.inputState.mouseY;
    this.mousePosition.z = 1;

    this.mousePosition.unproject(this.camera);

    var heightModifier = this.mousePosition.z / (this.mousePosition.z - this.camera.position.z);

    this.inputListener.inputState.lookX = this.mousePosition.x + (this.camera.position.x - this.mousePosition.x) * heightModifier;
    this.inputListener.inputState.lookY = this.mousePosition.y + (this.camera.position.y - this.mousePosition.y) * heightModifier;
};

module.exports = ControlsHandler;

},{}],23:[function(require,module,exports){
"use strict";

var InputListener = require("wm/renderer/InputListener");
var Camera = require("wm/renderer/Camera");
var ParticleManager = require("wm/renderer/particleSystem/ParticleManager");
var ActorManager = require("wm/renderer/actorManagement/ActorManager");
var LogicBus = require("wm/renderer/LogicBus");
var ControlsHandler = require("wm/renderer/ControlsHandler");
var GameScene = require("wm/renderer/scene/GameScene");
var ModelLoader = require("wm/renderer/modelRepo/ModelLoader");
var ModelList = require("wm/renderer/modelRepo/ModelList");
var ModelStore = require("wm/renderer/modelRepo/ModelStore");
var CustomModelBuilder = require("wm/renderer/modelRepo/CustomModelBuilder");
var Ui = require("wm/renderer/ui/Ui");

function Core(logicCore) {
    if (!logicCore) throw new Error('Logic core initialization failure!');
    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.FRAMERATE = 60;
    this.renderTicks = 0;
    this.logicWorker = logicCore;
    this.resolutionCoefficient = 1;
    this.initRenderer();
    this.initAssets();
}

Core.prototype.initRenderer = function () {
    this.makeMainComponents();
    this.stats = this.makeStatsWatcher();
    this.startTime = Date.now();
    this.attachToDom(this.renderer, this.stats);
};

Core.prototype.makeMainComponents = function () {
    this.renderer = this.makeRenderer();
    this.inputListener = new InputListener(this.renderer.domElement);
    this.camera = this.makeCamera(this.inputListener);
    this.scene = this.makeScene(this.camera);
    this.particleManager = new ParticleManager({ scene: this.scene });
    this.actorManager = new ActorManager({ scene: this.scene, particleManager: this.particleManager, core: this });
    this.logicBus = new LogicBus({ core: this, logicWorker: this.logicWorker, actorManager: this.actorManager });
    this.controlsHandler = new ControlsHandler({ inputListener: this.inputListener, logicBus: this.logicBus, camera: this.camera });
    this.gameScene = new GameScene({ core: this, scene: this.scene, logicBus: this.logicBus, actorManager: this.actorManager });
    this.ui = new Ui({ core: this, logicBus: this.logicBus });
};

Core.prototype.makeStatsWatcher = function () {
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';

    return stats;
};

Core.prototype.attachToDom = function (renderer, stats) {
    console.log("doc", document.body);
    document.getElementById('viewport').appendChild(stats.domElement);
    document.getElementById('viewport').appendChild(renderer.domElement);
    this.autoResize();
};

Core.prototype.makeCamera = function (inputListener) {
    console.log('making camera');
    var camera = new Camera({ inputListener: inputListener });
    return camera;
};

Core.prototype.makeScene = function (camera) {
    var scene = new THREE.Scene();
    scene.add(camera);
    return scene;
};

Core.prototype.makeRenderer = function () {
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.WIDTH, this.HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    return renderer;
};

Core.prototype.applyResolutionCoefficient = function () {
    this.renderer.setPixelRatio(this.resolutionCoefficient);
    this.resetRenderer();
    this.resetCamera();
};

Core.prototype.autoResize = function () {
    var _this = this;

    var callback = function callback() {
        _this.resetRenderer();
        _this.resetCamera();
    };
    window.addEventListener('resize', callback, false);
    return {
        stop: function stop() {
            window.removeEventListener('resize', callback);
        }
    };
};

Core.prototype.resetRenderer = function () {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
};

Core.prototype.resetCamera = function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
};

Core.prototype.initAssets = function () {
    this.modelLoader = new ModelLoader();
    this.modelLoader.addEventListener('loaded', this.onLoaded.bind(this));
    this.modelLoader.loadModels(ModelList.models);

    //todo: zrobic customModelBuilder tez jako asyncowy loader i potem promisem zgarnac oba eventy
    //tym bardziej ze moze byc to potrzebne jesli sie jednak okaze ze tekstury ladujemy asyncowo
    this.customModelBuilder = new CustomModelBuilder();
    this.customModelBuilder.loadModels();
    ModelStore.loadBatch(this.customModelBuilder.getBatch());
};

Core.prototype.onLoaded = function (event) {
    ModelStore.loadBatch(this.modelLoader.getBatch());
    this.modelLoader.clearBatch();
    this.continueInit();
};

Core.prototype.continueInit = function () {
    this.gameScene.make();

    setInterval(this.onEachSecond.bind(this), 1000);

    this.renderLoop = new THREEx.RenderingLoop();
    this.renderLoop.add(this.render.bind(this));
    this.renderLoop.start();

    setTimeout(function () {
        this.renderLoop.stop();
    }.bind(this), 1000);

    var controlsLoop = new THREEx.PhysicsLoop(120);
    controlsLoop.add(this.controlsUpdate.bind(this));
    controlsLoop.start();
};

Core.prototype.onEachSecond = function () {
    this.renderTicks = 0;
};

Core.prototype.controlsUpdate = function () {
    this.inputListener.update();
    this.controlsHandler.update();
};

Core.prototype.render = function () {
    this.gameScene.update();
    this.actorManager.update();
    this.particleManager.update();
    this.camera.update();
    this.renderTicks++;
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
};

Core.prototype.startGameRenderMode = function () {
    this.camera.setPositionZ(200, 20);
    this.renderLoop.start();
};

Core.prototype.stopGame = function (info) {
    setTimeout(function () {
        this.ui.showStopGame(info);
    }.bind(this), 2000);
};

module.exports = Core;

},{"wm/renderer/Camera":21,"wm/renderer/ControlsHandler":22,"wm/renderer/InputListener":24,"wm/renderer/LogicBus":25,"wm/renderer/actorManagement/ActorManager":27,"wm/renderer/modelRepo/CustomModelBuilder":43,"wm/renderer/modelRepo/ModelList":44,"wm/renderer/modelRepo/ModelLoader":45,"wm/renderer/modelRepo/ModelStore":46,"wm/renderer/particleSystem/ParticleManager":49,"wm/renderer/scene/GameScene":51,"wm/renderer/ui/Ui":52}],24:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InputListener = function InputListener(domElement) {
    _classCallCheck(this, InputListener);

    this.scrollDuration = 4;
    this.scrollFallOffPercent = 10;

    this.domElement = domElement !== undefined ? domElement : document;
    if (domElement) {
        this.domElement.setAttribute('tabindex', -1);
    }

    this.inputState = Object.create(null);

    this.keys = {
        81: 'q',
        69: 'e',
        87: 'w',
        83: 's',
        65: 'a',
        68: 'd',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        1001: 'scrollUp',
        1002: 'scrollDown',
        1003: 'mouseLeft',
        1004: 'mouseRight'
    };

    Object.keys(this.keys).forEach(function (key) {
        this.inputState[this.keys[key]] = 0;
    }.bind(this));

    this.keydown = function (event) {
        if (event.altKey) {
            return;
        }
        if (this.keys.hasOwnProperty(event.keyCode)) {
            this.inputState[this.keys[event.keyCode]] = 1;
        }
    };

    this.keyup = function (event) {
        if (this.keys.hasOwnProperty(event.keyCode)) {
            this.inputState[this.keys[event.keyCode]] = 0;
        }
    };

    this.mouseWheel = function (event) {
        this.inputState.scrollUp = event.deltaY > 0 ? this.scrollDuration : 0;
        this.inputState.scrollDown = event.deltaY < 0 ? this.scrollDuration : 0;
    };

    this.mouseMove = function (event) {
        this.inputState.mouseX = event.clientX / window.innerWidth * 2 - 1;
        this.inputState.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    this.mouseDown = function (event) {
        switch (event.button) {
            case 0:
                this.inputState.mouseLeft = 1;
                break;
            case 2:
                this.inputState.mouseRight = 1;
                break;
        }
    };

    this.mouseUp = function (event) {
        switch (event.button) {
            case 0:
                this.inputState.mouseLeft = 0;
                break;
            case 2:
                this.inputState.mouseRight = 0;
                break;
        }
    };

    this.handleEvent = function (event) {
        if (typeof this[event.type] === 'function') {
            this[event.type](event);
        }
    };

    function bind(scope, fn) {
        return function () {
            fn.apply(scope, arguments);
        };
    }

    function contextmenu(event) {
        event.preventDefault();
    }

    this.update = function () {
        for (var key in this.inputState) {
            switch (key) {
                case 'scrollUp':
                case 'scrollDown':
                    if (this.inputState[key] > 0) {
                        this.inputState[key] *= 1 - this.scrollFallOffPercent / 100;
                    }
                    if (this.inputState[key] < 0.5) {
                        this.inputState[key] = 0;
                    }
                    break;
            }
        }
    };

    this.dispose = function () {
        this.domElement.removeEventListener('contextmenu', contextmenu, false);
        this.domElement.removeEventListener('wheel', _wheel, false);
        this.domElement.removeEventListener('mousemove', _wheel, false);
        this.domElement.removeEventListener('mousedown', _mousedown, false);
        this.domElement.removeEventListener('mouseup', _mouseup, false);
        window.removeEventListener('keydown', _keydown, false);
        window.removeEventListener('keyup', _keyup, false);
    };

    var _keydown = bind(this, this.keydown);
    var _keyup = bind(this, this.keyup);
    var _wheel = bind(this, this.mouseWheel);
    var _move = bind(this, this.mouseMove);
    var _mousedown = bind(this, this.mouseDown);
    var _mouseup = bind(this, this.mouseUp);

    this.domElement.addEventListener('contextmenu', contextmenu, false);
    this.domElement.addEventListener('wheel', _wheel, false);
    this.domElement.addEventListener('mousemove', _move, false);
    this.domElement.addEventListener('mousedown', _mousedown, false);
    this.domElement.addEventListener('mouseup', _mouseup, false);
    window.addEventListener('keydown', _keydown, false);
    window.addEventListener('keyup', _keyup, false);
};

module.exports = InputListener;

},{}],25:[function(require,module,exports){
'use strict';

function LogicBus(config) {
    config = config || {};
    Object.assign(this, config);
    if (!this.logicWorker) throw new Error('No logicWorker object specified for LogicBus!');
    if (!this.actorManager) throw new Error('No actorManager object specified for LogicBus!');
    if (!this.core) throw new Error('No core object specified for LogicBus!');

    this.logicWorker.onmessage = this.handleMessage.bind(this);
}

LogicBus.prototype.handleMessage = function (message) {
    switch (message.data.type) {
        case 'updateActors':
            this.actorManager.updateFromLogic(message.data);
            break;
        case 'attachPlayer':
            this.actorManager.attachPlayer(message.data.actorId);
            break;
        case 'gameEnded':
            this.core.stopGame(message.data);
            break;
    }
};

LogicBus.prototype.postMessage = function (type, message) {
    message.type = type;
    this.logicWorker.postMessage(message);
};

module.exports = LogicBus;

},{}],26:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var idMap = {
    SHIP: 1,
    MOOK: 2,
    PILLAR: 3,
    WALL: 4,
    CHUNK: 5,
    PLASMAPROJECTILE: 100,
    MOLTENPROJECTILE: 101,
    LASERPROJECITLE: 102
};

function ActorFactory(actorDependencies) {
    var _actorMap;

    this.actorDependencies = actorDependencies;
    this.actorMap = (_actorMap = {}, _defineProperty(_actorMap, idMap.SHIP, ActorFactory.ShipActor), _defineProperty(_actorMap, idMap.MOOK, ActorFactory.MookActor), _defineProperty(_actorMap, idMap.WALL, ActorFactory.WallActor), _defineProperty(_actorMap, idMap.PILLAR, ActorFactory.PillarActor), _defineProperty(_actorMap, idMap.CHUNK, ActorFactory.ChunkActor), _defineProperty(_actorMap, idMap.PLASMAPROJECTILE, ActorFactory.PlasmaProjectileActor), _defineProperty(_actorMap, idMap.MOLTENPROJECTILE, ActorFactory.MoltenProjectileActor), _defineProperty(_actorMap, idMap.LASERPROJECITLE, ActorFactory.LaserProjectileActor), _actorMap);
}

ActorFactory.prototype.create = function (config) {
    if (!this.actorMap[config.classId]) {
        throw new Error("Cannot create actor. Bad configuration!".config);
    }
    return new this.actorMap[config.classId](config, this.actorDependencies);
};

module.exports = function (context) {
    ActorFactory.ShipActor = context === 'renderer' ? require("wm/renderer/actor/player/ShipActor") : require("wm/logic/actor/player/ShipActor");
    ActorFactory.MookActor = context === 'renderer' ? require("wm/renderer/actor/enemy/MookActor") : require("wm/logic/actor/enemy/MookActor");
    ActorFactory.WallActor = context === 'renderer' ? require("wm/renderer/actor/map/WallActor") : require("wm/logic/actor/map/WallActor");
    ActorFactory.PillarActor = context === 'renderer' ? require("wm/renderer/actor/map/PillarActor") : require("wm/logic/actor/map/PillarActor");
    ActorFactory.ChunkActor = context === 'renderer' ? require("wm/renderer/actor/object/ChunkActor") : require("wm/logic/actor/object/ChunkActor");
    ActorFactory.PlasmaProjectileActor = context === 'renderer' ? require("wm/renderer/actor/projectile/PlasmaProjectileActor") : require("wm/logic/actor/projectile/PlasmaProjectileActor");
    ActorFactory.MoltenProjectileActor = context === 'renderer' ? require("wm/renderer/actor/projectile/MoltenProjectileActor") : require("wm/logic/actor/projectile/MoltenProjectileActor");
    ActorFactory.LaserProjectileActor = context === 'renderer' ? require("wm/renderer/actor/projectile/LaserProjectileActor") : require("wm/logic/actor/projectile/LaserProjectileActor");

    var returnObject = {};

    returnObject.getInstance = function (dependencies) {
        return new ActorFactory(dependencies);
    };

    Object.keys(idMap).forEach(function (key) {
        returnObject[key] = idMap[key];
    });

    return returnObject;
};

},{"wm/logic/actor/enemy/MookActor":13,"wm/logic/actor/map/PillarActor":14,"wm/logic/actor/map/WallActor":15,"wm/logic/actor/object/ChunkActor":16,"wm/logic/actor/player/ShipActor":17,"wm/logic/actor/projectile/LaserProjectileActor":18,"wm/logic/actor/projectile/MoltenProjectileActor":19,"wm/logic/actor/projectile/PlasmaProjectileActor":20,"wm/renderer/actor/enemy/MookActor":35,"wm/renderer/actor/map/PillarActor":36,"wm/renderer/actor/map/WallActor":37,"wm/renderer/actor/object/ChunkActor":38,"wm/renderer/actor/player/ShipActor":39,"wm/renderer/actor/projectile/LaserProjectileActor":40,"wm/renderer/actor/projectile/MoltenProjectileActor":41,"wm/renderer/actor/projectile/PlasmaProjectileActor":42}],27:[function(require,module,exports){
'use strict';

var ActorFactory = require("wm/renderer/actorManagement/ActorFactory")('renderer');

function ActorManager(config) {
    config = config || {};
    this.storage = Object.create(null);
    this.scene = null;
    this.framerate = config.framerate || 60;

    this.DELTA_SMOOTHNESS = 0;

    Object.assign(this, config);

    if (!this.scene) throw new Error('No scene for Renderer ActorManager!');
    if (!this.particleManager) throw new Error('No particleManager for Renderer ActorManager!');

    this.factory = config.factory || ActorFactory.getInstance({ particleManager: this.particleManager });
    this.currentPhysicsTime = Date.now();
    this.lastPhysicsTime = Date.now() - 1;
}

ActorManager.prototype.update = function () {
    var delta = (Date.now() - this.currentPhysicsTime) / (this.currentPhysicsTime - this.lastPhysicsTime);

    for (var actor in this.storage) {
        this.storage[actor].update(isFinite(delta) ? Math.min(delta, 1) : 0);
    }
};

/*
transferArray[i*5] = body.actorId;
transferArray[i*5+1] = body.classId;
transferArray[i*5+2] = body.position[0];
transferArray[i*5+3] = body.position[1];
transferArray[i*5+4] = body.angle;
*/
ActorManager.prototype.updateFromLogic = function (dataObject) {
    this.lastPhysicsTime = this.currentPhysicsTime;
    this.currentPhysicsTime = Date.now();
    var dataArray = dataObject.transferArray;
    var deadActorIds = dataObject.deadActors;

    for (var i = 0; i < dataObject.length; i++) {
        var actor = this.storage[dataArray[i * 5]];
        if (!actor) {
            if (dataArray[i * 5 + 1] > 0) {
                this.createActor({
                    actorId: dataArray[i * 5],
                    classId: dataArray[i * 5 + 1],
                    positionX: dataArray[i * 5 + 2],
                    positionY: dataArray[i * 5 + 3],
                    angle: dataArray[i * 5 + 4]
                });
            }
        } else {
            actor.updateFromLogic(dataArray[i * 5 + 2], dataArray[i * 5 + 3], dataArray[i * 5 + 4]);
        }
    }

    for (var i = 0; i < deadActorIds.length; i++) {
        this.deleteActor(deadActorIds[i]);
    }
};

ActorManager.prototype.createActor = function (config) {
    var actor = this.factory.create(config);

    if (this.actorRequestingPlayer && this.actorRequestingPlayer === config.actorId) {
        this.core.camera.actor = actor;
        this.core.gameScene.actor = actor;
        actor.inputListener = this.core.inputListener;
    }

    this.storage[config.actorId] = actor;
    actor.addToScene(this.scene);
    actor.onSpawn();
};

ActorManager.prototype.attachPlayer = function (actorId) {
    if (!this.storage[actorId]) {
        this.actorRequestingPlayer = actorId;
    } else {
        this.core.camera.actor = this.storage[actorId];
    }
};

ActorManager.prototype.deleteActor = function (actorId) {
    var actor = this.storage[actorId];
    if (actor) {
        actor.onDeath();
        actor.removeFromScene(this.scene);
    }
    delete this.storage[actorId];
};

module.exports = ActorManager;

},{"wm/renderer/actorManagement/ActorFactory":26}],28:[function(require,module,exports){
"use strict";

function BaseActor(config, actorDependencies) {
    Object.assign(this, actorDependencies);

    this.positionZ = 10;

    this.position = new Float32Array([config.positionX || 0, config.positionY || 0]);
    this.logicPosition = new Float32Array([this.position[0], this.position[1]]);
    this.logicPreviousPosition = new Float32Array([this.position[0], this.position[1]]);

    this.angle = config.angle || 0;
    this.logicAngle = this.angle;
    this.logicPreviousAngle = this.angle;

    this.updateFromLogic(config.positionX, config.positionY, config.angle);

    this.mesh = this.createMesh();
    this.sprite = this.createSprite();

    this.timer = 0;
}

BaseActor.prototype.update = function (delta) {
    this.timer++;

    this.position[0] = this.logicPreviousPosition[0] + delta * (this.logicPosition[0] - this.logicPreviousPosition[0]);
    this.position[1] = this.logicPreviousPosition[1] + delta * (this.logicPosition[1] - this.logicPreviousPosition[1]);
    this.angle = this.logicPreviousAngle + delta * (this.logicAngle - this.logicPreviousAngle);

    if (this.mesh) {
        this.mesh.update();
    }

    if (this.sprite) {
        this.sprite.update();
    }

    this.customUpdate();
};

BaseActor.prototype.customUpdate = function () {};

BaseActor.prototype.updateFromLogic = function (positionX, positionY, angle) {
    this.logicPreviousPosition[0] = this.logicPosition[0];
    this.logicPreviousPosition[1] = this.logicPosition[1];
    this.logicPreviousAngle = this.logicAngle;

    this.logicPosition[0] = positionX || 0;
    this.logicPosition[1] = positionY || 0;
    this.logicAngle = angle || 0;
};

BaseActor.prototype.createMesh = function () {
    return null;
};

BaseActor.prototype.createSprite = function () {
    return null;
};

BaseActor.prototype.addToScene = function (scene) {
    if (this.mesh) {
        scene.add(this.mesh);
    }

    if (this.sprite) {
        scene.add(this.sprite);
    }
};

BaseActor.prototype.removeFromScene = function (scene) {
    if (this.mesh) {
        scene.remove(this.mesh);
    }

    if (this.sprite) {
        scene.remove(this.sprite);
    }
};

BaseActor.prototype.onDeath = function () {};

BaseActor.prototype.onSpawn = function () {};

module.exports = BaseActor;

},{}],29:[function(require,module,exports){
"use strict";

function BaseMesh(config) {
    THREE.Mesh.apply(this, arguments);
    this.angleOffset = 0;

    config.scaleX = config.scaleX || 1;
    config.scaleY = config.scaleY || 1;
    config.scaleZ = config.scaleZ || 1;

    config = config || {};
    Object.assign(this, config);

    this.scale.x = config.scaleX;
    this.scale.y = config.scaleY;
    this.scale.z = config.scaleZ;
}

BaseMesh.extend(THREE.Mesh);

BaseMesh.prototype.update = function () {
    if (this.actor) {
        this.position.x = this.actor.position[0];
        this.position.y = this.actor.position[1];
        this.position.z = this.actor.positionZ;
        this.rotation.z = this.actor.angle + this.angleOffset;
    }
};

module.exports = BaseMesh;

},{}],30:[function(require,module,exports){
"use strict";

var BaseMesh = require("wm/renderer/actor/components/mesh/BaseMesh");
var ModelStore = require("wm/renderer/modelRepo/ModelStore");

function ChunkMesh(config) {
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = ModelStore.get('chunk').geometry;
    config.material = ModelStore.get('chunk').material;
    Object.assign(this, config);

    this.castShadow = true;
}

ChunkMesh.extend(BaseMesh);

module.exports = ChunkMesh;

},{"wm/renderer/actor/components/mesh/BaseMesh":29,"wm/renderer/modelRepo/ModelStore":46}],31:[function(require,module,exports){
"use strict";

var BaseMesh = require("wm/renderer/actor/components/mesh/BaseMesh");

function PillarMesh(config) {
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(20, 20, 50, 50);
    config.material = new THREE.MeshLambertMaterial({ color: 0x505050 });
    Object.assign(this, config);

    this.castShadow = true;
    this.receiveShadow = true;
}

PillarMesh.extend(BaseMesh);

module.exports = PillarMesh;

},{"wm/renderer/actor/components/mesh/BaseMesh":29}],32:[function(require,module,exports){
"use strict";

var BaseMesh = require("wm/renderer/actor/components/mesh/BaseMesh");
var ModelStore = require("wm/renderer/modelRepo/ModelStore");

function RavierMesh(config) {
    BaseMesh.apply(this, arguments);

    config = config || {};
    config.geometry = ModelStore.get('ravier').geometry;
    config.material = ModelStore.get('ravier').material;
    Object.assign(this, config);

    this.castShadow = true;
}

RavierMesh.extend(BaseMesh);

module.exports = RavierMesh;

},{"wm/renderer/actor/components/mesh/BaseMesh":29,"wm/renderer/modelRepo/ModelStore":46}],33:[function(require,module,exports){
"use strict";

var BaseMesh = require("wm/renderer/actor/components/mesh/BaseMesh");
var ModelStore = require("wm/renderer/modelRepo/ModelStore");

function ShipMesh(config) {
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = ModelStore.get('ship').geometry;
    config.material = ModelStore.get('ship').material;
    Object.assign(this, config);

    this.castShadow = true;
    this.receiveShadow = true;
}

ShipMesh.extend(BaseMesh);

module.exports = ShipMesh;

},{"wm/renderer/actor/components/mesh/BaseMesh":29,"wm/renderer/modelRepo/ModelStore":46}],34:[function(require,module,exports){
"use strict";

var BaseMesh = require("wm/renderer/actor/components/mesh/BaseMesh");

function WallMesh(config) {
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(800, 2, 50, 50);
    config.material = new THREE.MeshLambertMaterial({ color: 0x505050 });
    Object.assign(this, config);

    this.receiveShadow = true;
}

WallMesh.extend(BaseMesh);

module.exports = WallMesh;

},{"wm/renderer/actor/components/mesh/BaseMesh":29}],35:[function(require,module,exports){
"use strict";

var ShipMesh = require("wm/renderer/actor/components/mesh/ShipMesh");
var BaseActor = require("wm/renderer/actor/BaseActor");

function MookActor() {
    BaseActor.apply(this, arguments);
}

MookActor.extend(BaseActor);

MookActor.prototype.createMesh = function () {
    return new ShipMesh({ actor: this, scaleX: 1, scaleY: 1, scaleZ: 1 });
};

MookActor.prototype.onDeath = function () {
    for (var i = 0; i < 100; i++) {
        this.particleManager.createParticle('smokePuffAlpha', {
            positionX: this.position[0] + Utils.rand(-2, 2),
            positionY: this.position[1] + Utils.rand(-2, 2),
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2, 15),
            alpha: Utils.rand(0, 3) / 10 + 0.3,
            alphaMultiplier: 0.95,
            particleVelocity: Utils.rand(0, 4) / 10,
            particleAngle: Utils.rand(0, 360),
            lifeTime: 120
        });
    }

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 200,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 40,
        alpha: 1,
        alphaMultiplier: 0.95,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 80
    });

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 0.6,
        colorB: 0.2,
        scale: 60,
        alpha: 1,
        alphaMultiplier: 0.95,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 80
    });
};

module.exports = MookActor;

},{"wm/renderer/actor/BaseActor":28,"wm/renderer/actor/components/mesh/ShipMesh":33}],36:[function(require,module,exports){
"use strict";

var PillarMesh = require("wm/renderer/actor/components/mesh/PillarMesh");
var BaseActor = require("wm/renderer/actor/BaseActor");

function PillarActor() {
    BaseActor.apply(this, arguments);
}

PillarActor.extend(BaseActor);

PillarActor.prototype.createMesh = function () {
    return new PillarMesh({ actor: this });
};

module.exports = PillarActor;

},{"wm/renderer/actor/BaseActor":28,"wm/renderer/actor/components/mesh/PillarMesh":31}],37:[function(require,module,exports){
"use strict";

var WallMesh = require("wm/renderer/actor/components/mesh/WallMesh");
var BaseActor = require("wm/renderer/actor/BaseActor");

function WallActor() {
    BaseActor.apply(this, arguments);
}

WallActor.extend(BaseActor);

WallActor.prototype.createMesh = function () {
    return new WallMesh({ actor: this });
};

module.exports = WallActor;

},{"wm/renderer/actor/BaseActor":28,"wm/renderer/actor/components/mesh/WallMesh":34}],38:[function(require,module,exports){
"use strict";

var ChunkMesh = require("wm/renderer/actor/components/mesh/ChunkMesh");
var BaseActor = require("wm/renderer/actor/BaseActor");

function ChunkActor() {
    BaseActor.apply(this, arguments);
}

ChunkActor.extend(BaseActor);

ChunkActor.prototype.createMesh = function () {
    return new ChunkMesh({ actor: this, scaleX: Utils.rand(5, 10) / 10, scaleY: Utils.rand(5, 10) / 10, scaleZ: Utils.rand(5, 10) / 10 });
};

ChunkActor.prototype.customUpdate = function () {
    if (this.timer % Utils.rand(5, 10) === 0) {
        this.particleManager.createParticle('smokePuffAlpha', {
            positionX: this.position[0] + Utils.rand(-2, 2),
            positionY: this.position[1] + Utils.rand(-2, 2),
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2, 5),
            alpha: 0.6,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0, 1) / 10,
            particleAngle: Utils.rand(0, 360),
            lifeTime: 60
        });
    }
};

ChunkActor.prototype.onDeath = function () {
    for (var i = 0; i < 20; i++) {
        this.particleManager.createParticle('smokePuffAlpha', {
            positionX: this.position[0] + Utils.rand(-2, 2),
            positionY: this.position[1] + Utils.rand(-2, 2),
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(1, 3),
            alpha: 0.6,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0, 1) / 10,
            particleAngle: Utils.rand(0, 360),
            lifeTime: 60
        });
    }

    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 0.3,
        colorB: 0.1,
        scale: 20,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 40
    });

    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 15,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 40
    });
};

module.exports = ChunkActor;

},{"wm/renderer/actor/BaseActor":28,"wm/renderer/actor/components/mesh/ChunkMesh":30}],39:[function(require,module,exports){
"use strict";

var RavierMesh = require("wm/renderer/actor/components/mesh/RavierMesh");
var BaseActor = require("wm/renderer/actor/BaseActor");

function ShipActor() {
    BaseActor.apply(this, arguments);
    this.count = 0;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMesh = function () {
    return new RavierMesh({ actor: this, scaleX: 3, scaleY: 3, scaleZ: 3 });
};

ShipActor.prototype.customUpdate = function () {
    this.doEngineGlow();
};

ShipActor.prototype.doBank = function () {
    this.mesh.rotation.x += Utils.degToRad((this.logicPreviousAngle - this.angle) * 50);
};

ShipActor.prototype.doEngineGlow = function () {
    if (this.inputListener.inputState.w && !this.inputListener.inputState.s) {
        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(10, 15),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -5,
            particleAngle: this.angle + Utils.degToRad(15),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(10, 15),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -5,
            particleAngle: this.angle - Utils.degToRad(15),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(3, 4),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -5,
            particleAngle: this.angle + Utils.degToRad(15),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(3, 4),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -5,
            particleAngle: this.angle - Utils.degToRad(15),
            lifeTime: 1
        });
    }

    if (this.inputListener.inputState.a && !this.inputListener.inputState.d) {
        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(6, 11),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -4,
            particleAngle: this.angle + Utils.degToRad(40),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2, 3),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -4,
            particleAngle: this.angle + Utils.degToRad(40),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(6, 11),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -6,
            particleAngle: this.angle + Utils.degToRad(170),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2, 3),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -6,
            particleAngle: this.angle + Utils.degToRad(170),
            lifeTime: 1
        });
    }

    if (this.inputListener.inputState.d) {
        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(6, 11),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -4,
            particleAngle: this.angle - Utils.degToRad(40),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2, 3),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -4,
            particleAngle: this.angle - Utils.degToRad(40),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(6, 11),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -6,
            particleAngle: this.angle - Utils.degToRad(170),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2, 3),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -6,
            particleAngle: this.angle - Utils.degToRad(170),
            lifeTime: 1
        });
    }

    if (this.inputListener.inputState.s) {

        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(10, 15),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -7,
            particleAngle: this.angle + Utils.degToRad(180),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(3, 4),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -7,
            particleAngle: this.angle + Utils.degToRad(180),
            lifeTime: 1
        });
    }
};

ShipActor.prototype.onDeath = function () {
    for (var i = 0; i < 100; i++) {
        this.particleManager.createParticle('smokePuffAlpha', {
            positionX: this.position[0] + Utils.rand(-2, 2),
            positionY: this.position[1] + Utils.rand(-2, 2),
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2, 15),
            alpha: Utils.rand(0, 3) / 10 + 0.3,
            alphaMultiplier: 0.95,
            particleVelocity: Utils.rand(0, 4) / 10,
            particleAngle: Utils.rand(0, 360),
            lifeTime: 120
        });
    }

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 200,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 40,
        alpha: 1,
        alphaMultiplier: 0.95,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 80
    });

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 0.6,
        colorB: 0.2,
        scale: 60,
        alpha: 1,
        alphaMultiplier: 0.95,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 80
    });
};

module.exports = ShipActor;

},{"wm/renderer/actor/BaseActor":28,"wm/renderer/actor/components/mesh/RavierMesh":32}],40:[function(require,module,exports){
'use strict';

var BaseActor = require("wm/renderer/actor/BaseActor");

function LaserProjectileActor(config) {
    BaseActor.apply(this, arguments);
    this.colorR = 0.3;
    this.colorG = 0.3;
    this.colorB = 1;
}

LaserProjectileActor.extend(BaseActor);

LaserProjectileActor.prototype.customUpdate = function () {
    for (var i = 0; i < 20; i++) {
        var offsetPosition = Utils.angleToVector(this.angle, -i * 0.4);
        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0] + offsetPosition[0],
            positionY: this.position[1] + offsetPosition[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 1,
            alpha: 1 - 0.05 * i,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleAngle: this.angle,
            lifeTime: 1
        });
    }

    for (var i = 0; i < 5; i++) {
        var offsetPosition = Utils.angleToVector(this.angle, -i * 1.8);
        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0] + offsetPosition[0],
            positionY: this.position[1] + offsetPosition[1],
            colorR: this.colorR,
            colorG: this.colorG,
            colorB: this.colorB,
            scale: 5,
            alpha: 0.7 - 0.1 * i,
            alphaMultiplier: 0.6,
            particleVelocity: 2,
            particleAngle: this.angle,
            lifeTime: 1
        });
    }
};

LaserProjectileActor.prototype.onDeath = function () {
    for (var i = 0; i < 100; i++) {
        this.particleManager.createParticle('particleAddSplash', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: this.colorR * 0.3 + 0.7,
            colorG: this.colorG * 0.3 + 0.7,
            colorB: this.colorB * 0.3 + 0.7,
            scale: 1,
            alpha: 1,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(1, 6) / 10,
            particleAngle: Utils.rand(0, 360),
            lifeTime: Utils.rand(20, 100)
        });
    }

    this.particleManager.createParticle('particleAddSplash', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 30,
        alpha: 1,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 10
    });

    this.particleManager.createParticle('particleAddSplash', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 5,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 15
    });

    this.particleManager.createParticle('particleAddSplash', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR,
        colorG: this.colorG,
        colorB: this.colorB,
        scale: 8,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
};

LaserProjectileActor.prototype.onSpawn = function () {
    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 20,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 1
    });

    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 8,
        alpha: 1,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        particleAngle: this.angle,
        lifeTime: 10
    });
};

module.exports = LaserProjectileActor;

},{"wm/renderer/actor/BaseActor":28}],41:[function(require,module,exports){
'use strict';

var BaseActor = require("wm/renderer/actor/BaseActor");

function MoltenProjectileActor(config) {
    BaseActor.apply(this, arguments);
    this.colorR = 1;
    this.colorG = 0.3;
    this.colorB = 0.1;
}

MoltenProjectileActor.extend(BaseActor);

MoltenProjectileActor.prototype.customUpdate = function () {
    for (var i = 0; i < 3; i++) {
        var offsetPosition = Utils.angleToVector(this.angle, -i * 0.3);
        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0] + offsetPosition[0],
            positionY: this.position[1] + offsetPosition[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 2 - 0.3 * i,
            alpha: 1 - 0.19 * i,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleAngle: this.angle,
            lifeTime: 1
        });
    }

    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR,
        colorG: this.colorG,
        colorB: this.colorB,
        scale: 7,
        alpha: 0.4,
        alphaMultiplier: 0.6,
        particleVelocity: 1,
        particleAngle: this.angle,
        lifeTime: 2
    });
};

MoltenProjectileActor.prototype.onDeath = function () {
    for (var i = 0; i < 20; i++) {
        this.particleManager.createParticle('smokePuffAlpha', {
            positionX: this.position[0] + Utils.rand(-2, 2),
            positionY: this.position[1] + Utils.rand(-2, 2),
            colorR: this.colorR * 0.3 + 0.7,
            colorG: this.colorG * 0.3 + 0.7,
            colorB: this.colorB * 0.3 + 0.7,
            scale: Utils.rand(1, 3),
            alpha: 0.6,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0, 1) / 10,
            particleAngle: Utils.rand(0, 360),
            lifeTime: 60
        });
    }

    this.particleManager.createParticle('particleAddSplash', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 35,
        alpha: 1,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 10
    });

    this.particleManager.createParticle('particleAddSplash', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 8,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 15
    });

    this.particleManager.createParticle('particleAddSplash', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 10,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
};

MoltenProjectileActor.prototype.onSpawn = function () {
    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 1
    });

    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 15,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        particleAngle: this.angle,
        lifeTime: 10
    });
};

module.exports = MoltenProjectileActor;

},{"wm/renderer/actor/BaseActor":28}],42:[function(require,module,exports){
'use strict';

var BaseActor = require("wm/renderer/actor/BaseActor");

function PlasmaProjectileActor(config) {
    BaseActor.apply(this, arguments);
    this.colorR = 0.3;
    this.colorG = 1;
    this.colorB = 0.5;
}

PlasmaProjectileActor.extend(BaseActor);

PlasmaProjectileActor.prototype.customUpdate = function () {
    for (var i = 0; i < 5; i++) {
        var offsetPosition = Utils.angleToVector(this.angle, -i * 0.7);
        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0] + offsetPosition[0],
            positionY: this.position[1] + offsetPosition[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 3 - 0.4 * i,
            alpha: 1 - 0.19 * i,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleAngle: this.angle,
            lifeTime: 1
        });
    }

    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR,
        colorG: this.colorG,
        colorB: this.colorB,
        scale: 10,
        alpha: 0.5,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleAngle: this.angle,
        lifeTime: 2
    });
};

PlasmaProjectileActor.prototype.onDeath = function () {
    for (var i = 0; i < 20; i++) {
        this.particleManager.createParticle('smokePuffAlpha', {
            positionX: this.position[0] + Utils.rand(-3, 3),
            positionY: this.position[1] + Utils.rand(-3, 3),
            colorR: this.colorR * 0.3 + 0.7,
            colorG: this.colorG * 0.3 + 0.7,
            colorB: this.colorB * 0.3 + 0.7,
            scale: Utils.rand(1, 3),
            alpha: 0.6,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0, 1) / 10,
            particleAngle: Utils.rand(0, 360),
            lifeTime: 60
        });
    }

    this.particleManager.createParticle('particleAddSplash', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 40,
        alpha: 1,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 10
    });

    this.particleManager.createParticle('particleAddSplash', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 10,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 15
    });

    this.particleManager.createParticle('particleAddSplash', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 15,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
};

PlasmaProjectileActor.prototype.onSpawn = function () {
    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 1
    });

    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 15,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        particleAngle: this.angle,
        lifeTime: 10
    });
};

module.exports = PlasmaProjectileActor;

},{"wm/renderer/actor/BaseActor":28}],43:[function(require,module,exports){
'use strict';

function CustomModelBuilder() {
    this.batch = {};
    this.configuration = this.configure();
}

CustomModelBuilder.prototype.configure = function () {
    return {
        'chunk': {
            material: new THREE.MeshPhongMaterial({
                color: 0x888888,
                map: new THREE.TextureLoader().load("/models/chunk.png")
            })
        },
        'orangeChunk': {
            material: new THREE.MeshPhongMaterial({
                color: 0x885522,
                map: new THREE.TextureLoader().load("/models/chunk.png")
            })
        }
    };
};

CustomModelBuilder.prototype.loadModels = function () {
    var _this = this;

    Object.keys(this.configuration).forEach(function (modelName) {
        _this.batch[modelName] = {
            geometry: _this.configuration[modelName].geometry,
            material: _this.configuration[modelName].material
        };
    });
};

CustomModelBuilder.prototype.getBatch = function () {
    return this.batch;
};

CustomModelBuilder.prototype.clearBatch = function () {
    this.batch = {};
};

module.exports = CustomModelBuilder;

},{}],44:[function(require,module,exports){
'use strict';

var ModelList = {
    models: ['/models/ship.json', '/models/ravier.json', '/models/chunk.json']
};

module.exports = ModelList;

},{}],45:[function(require,module,exports){
'use strict';

function ModelLoader() {
    this.batch = {};
    Utils.mixin(this, THREE.EventDispatcher);
}

ModelLoader.prototype.loadModels = function (modelPaths) {
    var _this = this;

    if (!modelPaths) throw "ERROR: No model paths have been specified for the loader!";
    var loader = new THREE.JSONLoader();

    Promise.all(modelPaths.map(function (modelPath) {
        var willLoadModels = new Promise(function (resolve, reject) {
            loader.load(modelPath, function (geometry, material) {
                _this.batch[_this.getModelName(modelPath)] = {
                    geometry: geometry,
                    material: material
                };
                resolve();
            }, _this.getDefaultTexturePath(modelPath));
        });
        return willLoadModels;
    })).then(this.doneAction.bind(this));
};

ModelLoader.prototype.getBatch = function () {
    return this.batch;
};

ModelLoader.prototype.clearBatch = function () {
    this.batch = {};
};

ModelLoader.prototype.doneAction = function () {
    this.dispatchEvent({ type: 'loaded' });
};

ModelLoader.prototype.getModelName = function (path) {
    var name = path.split('.')[0].split('/').pop();
    if (!name) throw 'ERROR: Bad model path: ' + path;
    return name;
};

ModelLoader.prototype.getDefaultTexturePath = function (path) {
    return path.replace('json', 'png');
};

module.exports = ModelLoader;

},{}],46:[function(require,module,exports){
'use strict';

var ModelStore = {
    _materials: {},
    _geometries: {},

    get: function get(name) {
        return {
            geometry: this._geometries[name],
            material: this._materials[name]
        };
    },

    loadBatch: function loadBatch(batch) {
        Object.keys(batch).forEach(function (modelName) {
            this._addGeometry(modelName, batch[modelName].geometry);
            this._addMaterial(modelName, batch[modelName].material);
        }.bind(this));
    },

    _addGeometry: function _addGeometry(name, geometry) {
        this._geometries[name] = geometry;
    },

    _addMaterial: function _addMaterial(name, material) {
        if (!material) throw 'ERROR - no material specified';
        this._materials[name] = material instanceof Array ? material[0] : material;
    }
};

module.exports = ModelStore;

},{}],47:[function(require,module,exports){
"use strict";

var ParticleShaders = require("wm/renderer/particleSystem/ParticleShaders");

function ParticleConfigBuilder() {
    this.particleMaterialConfig = {
        smokePuffAlpha: new THREE.ShaderMaterial({
            uniforms: { map: { type: "t", value: new THREE.TextureLoader().load("/gfx/smokePuffAlpha.png") } },
            vertexShader: ParticleShaders.vertexShader,
            fragmentShader: ParticleShaders.fragmentShader,
            transparent: true
        }),
        particleAdd: new THREE.ShaderMaterial({
            uniforms: { map: { type: "t", value: new THREE.TextureLoader().load("/gfx/particleAdd.png") } },
            vertexShader: ParticleShaders.vertexShader,
            fragmentShader: ParticleShaders.fragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true
        }),
        mainExplosionAdd: new THREE.ShaderMaterial({
            uniforms: { map: { type: "t", value: new THREE.TextureLoader().load("/gfx/particleAdd.png") } },
            vertexShader: ParticleShaders.vertexShader,
            fragmentShader: ParticleShaders.fragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true
        })
    };

    this.particleGeneratorConfig = {
        smokePuffAlpha: {
            material: this.particleMaterialConfig.smokePuffAlpha,
            maxParticles: 1000,
            positionZ: 9
        },
        particleAddTrail: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 7000,
            positionZ: 9
        },
        particleAddSplash: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 3000,
            positionZ: 9
        },
        mainExplosionAdd: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 500,
            positionZ: 9
        }
    };
}

ParticleConfigBuilder.prototype.getConfig = function (configName) {
    return this.particleGeneratorConfig[configName];
};

ParticleConfigBuilder.prototype.getAllConfigs = function () {
    return this.particleGeneratorConfig;
};

module.exports = ParticleConfigBuilder;

},{"wm/renderer/particleSystem/ParticleShaders":50}],48:[function(require,module,exports){
'use strict';

function ParticleGenerator(config) {
    THREE.Points.apply(this, arguments);

    config = config || {};
    config.positionZ = config.positionZ || 10;
    config.maxParticles = config.maxParticles || 100;

    config.positionHiddenFromView = 100000;

    Object.assign(this, config);

    if (!this.material) throw new Error('No material defined for ParticleGenerator!');

    this.usedPoints = new Float32Array(this.maxParticles);
    this.nextPointer = 0;
    this.geometry = this.createGeometry();
}

ParticleGenerator.extend(THREE.Points);

ParticleGenerator.prototype.createGeometry = function () {
    var geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array(this.maxParticles * 3);
    var colors = new Float32Array(this.maxParticles * 3);
    var speeds = new Float32Array(this.maxParticles * 2);
    var alphas = new Float32Array(this.maxParticles * 2);
    var scales = new Float32Array(this.maxParticles * 1);
    var lifeTime = new Float32Array(this.maxParticles * 1);

    for (var i = 0; i < this.maxParticles; i++) {
        vertices[i * 3 + 0] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
        vertices[i * 3 + 1] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
        vertices[i * 3 + 2] = this.positionZ;

        lifeTime[i] = -1;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('speed', new THREE.BufferAttribute(speeds, 2));
    geometry.addAttribute('alpha', new THREE.BufferAttribute(alphas, 2));
    geometry.addAttribute('scale', new THREE.BufferAttribute(scales, 1));
    geometry.lifeTime = lifeTime;

    this.positionHandle = geometry.attributes.position.array;
    this.alphaHandle = geometry.attributes.alpha.array;
    this.colorHandle = geometry.attributes.color.array;
    this.scaleHandle = geometry.attributes.scale.array;
    this.speedHandle = geometry.attributes.speed.array;

    return geometry;
};

ParticleGenerator.prototype.create = function (config) {
    var particleId = this.nextPointer;
    this.nextPointer++;
    if (this.nextPointer > this.maxParticles) {
        this.nextPointer = 0;
    }

    this.initParticle(particleId, config);
};

ParticleGenerator.prototype.deactivate = function (particleId) {
    this.positionHandle[particleId * 3] = this.positionHiddenFromView;
    this.positionHandle[particleId * 3 + 1] = this.positionHiddenFromView;
};

ParticleGenerator.prototype.update = function () {
    for (var i = 0; i < this.maxParticles; i++) {
        this.updateParticle(i);
    }
    this.geometry.attributes.alpha.needsUpdate = true;
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.scale.needsUpdate = true;
};

ParticleGenerator.prototype.updateParticle = function (particleId) {
    var lifeTime = this.geometry.lifeTime;
    if (lifeTime[particleId] === 0) {
        this.deactivate(particleId);
    } else {
        lifeTime[particleId] -= 1;
        this.alphaHandle[particleId * 2] *= this.alphaHandle[particleId * 2 + 1];
        this.positionHandle[particleId * 3] += this.speedHandle[particleId * 2];
        this.positionHandle[particleId * 3 + 1] += this.speedHandle[particleId * 2 + 1];
    }
};

ParticleGenerator.prototype.initParticle = function (particleId, config) {
    this.positionHandle[particleId * 3] = config.positionX;
    this.positionHandle[particleId * 3 + 1] = config.positionY;
    this.colorHandle[particleId * 3] = config.colorR;
    this.colorHandle[particleId * 3 + 1] = config.colorG;
    this.colorHandle[particleId * 3 + 2] = config.colorB;
    this.scaleHandle[particleId] = config.scale;
    this.alphaHandle[particleId * 2] = config.alpha;
    this.alphaHandle[particleId * 2 + 1] = config.alphaMultiplier;
    this.speedHandle[particleId * 2] = Math.sin(config.particleAngle) * -1 * config.particleVelocity;
    this.speedHandle[particleId * 2 + 1] = Math.cos(config.particleAngle) * config.particleVelocity;
    this.geometry.lifeTime[particleId] = config.lifeTime;
};

module.exports = ParticleGenerator;

},{}],49:[function(require,module,exports){
"use strict";

var ParticleConfigBuilder = require("wm/renderer/particleSystem/ParticleConfigBuilder");
var ParticleGenerator = require("wm/renderer/particleSystem/ParticleGenerator");

function ParticleManager(config) {
    config = config || {};
    Object.assign(this, config);

    if (!this.scene) throw new Error('No scene specified for ParticleGenerator!');

    this.configBuilder = new ParticleConfigBuilder();
    this.configs = this.configBuilder.getAllConfigs();

    this.generators = {};

    this.buildGenerators();
}

ParticleManager.prototype.buildGenerators = function () {
    var _this = this;

    Object.keys(this.configs).forEach(function (configName) {
        var generator = new ParticleGenerator(_this.configs[configName]);
        _this.generators[configName] = generator;
        _this.scene.add(generator);
    });
};

ParticleManager.prototype.getGenerator = function (typeName) {
    return this.generators[typeName];
};

ParticleManager.prototype.update = function () {
    for (var typeName in this.generators) {
        this.generators[typeName].update();
    }
};

ParticleManager.prototype.createParticle = function (typeName, config) {
    this.generators[typeName].create(config);
};

module.exports = ParticleManager;

},{"wm/renderer/particleSystem/ParticleConfigBuilder":47,"wm/renderer/particleSystem/ParticleGenerator":48}],50:[function(require,module,exports){
"use strict";

var ParticleShaders = {
    vertexShader: " \
        attribute float alpha; \
        attribute vec3 color; \
        varying float vAlpha; \
        varying vec3 vColor; \
        attribute float scale; \
        void main() { \
            vAlpha = alpha; \
            vColor = color; \
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 ); \
            gl_PointSize =  scale * (1000.0 / - mvPosition.z) ; \
            gl_Position = projectionMatrix * mvPosition; \
        }",

    fragmentShader: " \
        uniform sampler2D map; \
        varying vec3 vColor; \
        varying float vAlpha; \
        void main() { \
			gl_FragColor = vec4(vColor, vAlpha) * texture2D( map, gl_PointCoord ); \
        } \
    "
};

module.exports = ParticleShaders;

},{}],51:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameScene = function () {
    function GameScene(config) {
        _classCallCheck(this, GameScene);

        Object.assign(this, config);
        this.lightCounter = 0;
    }

    _createClass(GameScene, [{
        key: "makeWalls",
        value: function makeWalls() {
            var walls = [];
            var wall;

            var material = new THREE.MeshLambertMaterial({
                color: 0xffffff
            });

            var wallGeometry = new THREE.BoxGeometry(5, 50, 5, 1, 1, 1);

            for (var i = 0; i < 100; i++) {
                wall = new THREE.Mesh(wallGeometry, material);
                wall.position.x = Utils.rand(-200, 200);
                wall.position.y = Utils.rand(-200, 200);
                wall.position.z = Utils.rand(0, 2);
                wall.rotateZ(Utils.degToRad(Utils.rand(0, 360)));
                walls.push(wall);
            }

            var combine = new THREE.Geometry();

            walls.forEach(function (w) {
                w.updateMatrix();
                combine.merge(w.geometry, w.matrix);
            });

            return new THREE.Mesh(combine, material);
        }
    }, {
        key: "make",
        value: function make() {
            var combine = new THREE.Geometry();
            var planeTex = new THREE.TextureLoader().load("/models/floor.png");
            planeTex.wrapS = planeTex.wrapT = THREE.RepeatWrapping;
            planeTex.repeat.set(10, 10);
            var geometry = new THREE.PlaneGeometry(800, 800, 2, 2);
            var material = new THREE.MeshPhongMaterial({ color: 0x888888, map: planeTex });
            var floor = new THREE.Mesh(geometry, material);

            floor.updateMatrix();
            combine.merge(floor.geometry, floor.matrix);

            var walls = this.makeWalls();
            combine.merge(walls.geometry, walls.matrix);
            var combinedObject = new THREE.Mesh(combine, material);
            combinedObject.receiveShadow = true;
            combinedObject.castShadow = true;
            combinedObject.matrixAutoUpdate = false;
            combinedObject.updateMatrix();

            this.scene.add(combinedObject);

            var directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
            directionalLight.position.set(2, 2, 10);
            this.scene.add(directionalLight);

            this.pointLight = new THREE.PointLight(0xffffff, 1);
            this.pointLight.distance = 200;
            this.pointLight.castShadow = true;
            this.pointLight.shadowCameraNear = 1;
            this.pointLight.shadowCameraFar = 200;
            this.pointLight.shadowMapWidth = 2048;
            this.pointLight.shadowMapHeight = 2048;
            this.pointLight.shadowBias = 0;
            this.pointLight.shadowDarkness = 0.4;
            this.pointLight.position.set(0, 0, 50);
            this.scene.add(this.pointLight);
        }
    }, {
        key: "update",
        value: function update() {
            if (this.actor) {
                var offsetPosition = Utils.angleToVector(this.actor.angle, 20);
                this.pointLight.position.x = this.actor.position[0] + offsetPosition[0];
                this.pointLight.position.y = this.actor.position[1] + offsetPosition[1];
            }
        }
    }]);

    return GameScene;
}();

module.exports = GameScene;

},{}],52:[function(require,module,exports){
'use strict';

function Ui(config) {
    Object.assign(this, config);
    if (!this.logicBus) throw new Error('No logicBus object specified for Ui!');
    if (!this.core) throw new Error('No core object specified for Ui!');

    this.makeUi();
}

Ui.prototype.makeUi = function () {
    var startButton = document.getElementById('startButton');
    startButton.addEventListener('click', this.onStartButtonClick.bind(this, startButton));
};

Ui.prototype.onStartButtonClick = function () {
    this.logicBus.postMessage('start', {});
    this.core.startGameRenderMode();

    var viewportElement = document.getElementById('viewport');

    viewportElement.removeClass('blur');
    viewportElement.addClass('blurEnd');

    viewportElement.addEventListener('animationend', function () {
        viewportElement.removeClass('blurEnd');
    });

    this.hide(document.getElementById('startScreen'));
};

Ui.prototype.hide = function (element) {
    element.style.display = 'none';
};

Ui.prototype.show = function (element) {
    element.style.display = '';
};

Ui.prototype.showStopGame = function (info) {
    document.getElementById('viewport').addClass('blurStart');
    document.getElementById('endText').addClass('textAppear');
    document.getElementById('scoreText').addClass('textAppear');
    document.getElementById('scoreText').innerHTML = 'KILLED: ' + info.killed + '<br>REMAINING: ' + info.remaining + '<br><br>' + this.getOpinionOnResult(info.remaining);
    this.show(document.getElementById('endScreen'));
};

Ui.prototype.getOpinionOnResult = function (remainingMooks) {
    if (remainingMooks === 100) {
        return 'You didn\'t even try, did you?';
    } else if (remainingMooks > 90 && remainingMooks < 100) {
        return 'You seem to have discovered shooting function.';
    } else if (remainingMooks > 80 && remainingMooks < 90) {
        return 'Far, far away.';
    } else if (remainingMooks > 70 && remainingMooks < 80) {
        return 'Come on. You can do better! I hope, for this is only a techtest and they still suck.';
    } else if (remainingMooks > 60 && remainingMooks < 70) {
        return 'Try using your second weapon on them. Works much better.';
    } else if (remainingMooks > 50 && remainingMooks < 60) {
        return 'You know you can shoot down these orange blobs with your primary weapon?';
    } else if (remainingMooks > 40 && remainingMooks < 50) {
        return 'Only half more to go.';
    } else if (remainingMooks > 30 && remainingMooks < 40) {
        return 'That is a formidable effort.';
    } else if (remainingMooks > 20 && remainingMooks < 30) {
        return 'It should be getting easier by now.';
    } else if (remainingMooks > 10 && remainingMooks < 20) {
        return 'So close.';
    } else if (remainingMooks > 0 && remainingMooks < 10) {
        return 'Almost there. Got unlucky with a stray shot?';
    } else {
        return 'You got them all! Grats!';
    }
};

module.exports = Ui;

},{}]},{},[3]);
