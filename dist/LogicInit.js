(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Constants = {
    SHOW_FPS: false,

    LOGIC_REFRESH_RATE: 60,

    MAX_SHADER_UNIFORM_SIZE: 512,

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

},{}],2:[function(require,module,exports){
(function (global){
"use strict";

global.Utils = require("Utils");
global.Constants = require("Constants");

if ('function' === typeof importScripts) {
    importScripts('../../lib/p2.js');
    importScripts('../../lib/threex.loop.js');
    var LogicCore = require('logic/Core');
    self.core = new LogicCore(self);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"Constants":1,"Utils":3,"logic/Core":4}],3:[function(require,module,exports){
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
        return receiver;
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
    },

    rotateOffsetPoint: function rotateOffsetPoint(centerX, centerY, pointX, pointY, radAngle) {
        var newX = centerX + (Math.cos(radAngle) * (pointX - centerX) + Math.sin(radAngle) * (pointY - centerY));
        var newY = centerY + (-Math.sin(radAngle) * (pointX - centerX) + Math.cos(radAngle) * (pointY - centerY));
        return [newX, newY];
    },

    distanceBetweenPoints: function distanceBetweenPoints(p1x, p2x, p1y, p2y) {
        return Math.sqrt((p1x - p2x) * (p1x - p2x) + (p1y - p2y) * (p1y - p2y));
    },

    pointDifference: function pointDifference(p1x, p2x, p1y, p2y) {
        return [p1x >= 0 && p2x >= 0 || p1x < 0 && p2x < 0 ? p1x - p2x : p1x + p2x * -1, p1y >= 0 && p2y >= 0 || p1y < 0 && p2y < 0 ? p1y - p2y : p1y + p2y * -1];
    }
};

if (!Function.prototype.extend) {
    Function.prototype.extend = function (oldClass) {
        this.prototype = Object.create(oldClass.prototype);
        this.prototype.constructor = oldClass;
    };
}

module.exports = Utils;

},{}],4:[function(require,module,exports){
"use strict";

var RenderBus = require("logic/RenderBus");
var GameWorld = require("logic/GameWorld");
var ActorManager = require("logic/actorManagement/ActorManager");
var GameScene = require("logic/GameScene");
var AiImageRequester = require("logic/ai/AiImageRequester");

function Core(worker) {
    this.makeMainComponents(worker);

    this.startGameLoop();
    this.scene.fillScene();
    this.initFpsCounter();

    this.aiImageRequester.requestImage();

    this.running = false;
}

Core.prototype.makeMainComponents = function (worker) {
    this.renderBus = new RenderBus({ worker: worker, core: this });
    this.world = new GameWorld();
    this.actorManager = new ActorManager({ world: this.world, core: this });
    this.scene = new GameScene({ world: this.world, actorManager: this.actorManager, core: this });
    this.aiImageRequester = new AiImageRequester({ world: this.world, renderBus: this.renderBus });
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

Core.prototype.saveAiImage = function (imageData) {
    this.actorManager.aiImage = imageData;
};

module.exports = Core;

},{"logic/GameScene":5,"logic/GameWorld":6,"logic/RenderBus":7,"logic/actorManagement/ActorManager":8,"logic/ai/AiImageRequester":21}],5:[function(require,module,exports){
'use strict';

var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function GameScene(config) {
    Object.assign(this, config);
    if (!this.world) throw new Error('No world specified for Logic GameScene');
    if (!this.actorManager) throw new Error('No actorManager specified for Logic GameScene');
    if (!this.core) throw new Error('No core specified for Logic GameScene');
    this.timer = 0;
}

GameScene.prototype.fillScene = function () {

    var playerActor = this.actorManager.addNew({
        classId: ActorFactory.SHIP,
        positionX: 0,
        positionY: 0,
        angle: 0
    });

    this.actorManager.setPlayerActor(playerActor);

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

},{"renderer/actorManagement/ActorFactory":22}],6:[function(require,module,exports){
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

GameWorld.prototype.getWallActors = function () {
    var wallActors = [];
    for (var i = 0; i < this.bodies.length; i++) {
        var body = this.bodies[i];
        if (body.shape.collisionGroup === Constants.COLLISION_GROUPS.TERRAIN) {
            switch (body.shape.constructor.name) {
                case 'Box':
                    wallActors.push({
                        class: body.shape.constructor.name,
                        angle: body.angle,
                        height: body.shape.height,
                        width: body.shape.width,
                        position: body.position
                    });
                    break;
                case 'Convex':
                    wallActors.push({
                        class: body.shape.constructor.name,
                        vertices: body.shape.vertices,
                        position: body.position
                    });
                    break;
            }
        }
    }
    return wallActors;
};

GameWorld.prototype.onCollision = function (collisionEvent) {
    collisionEvent.bodyA.onCollision(collisionEvent.bodyB);
    collisionEvent.bodyB.onCollision(collisionEvent.bodyA);
};

module.exports = GameWorld;

},{}],7:[function(require,module,exports){
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
        case "pause":
            this.core.pause();
            break;
        case "start":
            this.core.start();
            break;
        case "aiImageDone":
            this.core.saveAiImage(message.data);
            break;
    }
};

module.exports = RenderBus;

},{}],8:[function(require,module,exports){
'use strict';

var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

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

    var actor = this.factory.create(Object.assign(config, {
        manager: this,
        world: this.world
    }));

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

//todo: notify brains of this and also aiImage
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

ActorManager.prototype.getFirstPlayerActor = function () {
    return this.storage[this.playerActors[0]];
};

module.exports = ActorManager;

},{"renderer/actorManagement/ActorFactory":22}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
"use strict";

function BaseBrain(config) {
    config = config || [];

    this.actor = config.actor;
    this.manager = config.manager;
    this.playerActor = config.playerActor;

    this.orders = {
        turnLeft: false,
        turnRight: false,
        forward: false,
        backward: false,
        strafeLeft: false,
        strafeRight: false,
        shoot: false,
        lookAtPlayer: false
    };
}

BaseBrain.prototype.update = function () {};

BaseBrain.prototype.getPlayerPosition = function () {
    return this.playerActor.body.position;
};

BaseBrain.prototype.isPositionInWall = function (position) {
    if (this.manager.aiImage) {
        var imageObject = this.manager.aiImage;
        var aiPosition = this.castPosition(position, imageObject);
        return imageObject.imageData.data[(aiPosition[1] * imageObject.imageData.width + aiPosition[0]) * 4] === 0;
    } else {
        return false;
    }
};

BaseBrain.prototype.castPosition = function (position, imageObject) {
    return [parseInt(position[0] * imageObject.lengthMultiplierX + imageObject.centerX), parseInt(position[1] * imageObject.lengthMultiplierY + imageObject.centerY)];
};

BaseBrain.prototype.isWallBetween = function (positionA, positionB) {
    var densityMultiplier = arguments.length <= 2 || arguments[2] === undefined ? 0.3 : arguments[2];

    if (this.manager.aiImage) {
        var imageObject = this.manager.aiImage;
        var distance = Utils.distanceBetweenPoints(positionA[0], positionB[0], positionA[1], positionB[1]);
        var detectionPointCount = distance * imageObject.lengthMultiplierX * densityMultiplier; //doesn't matter too much if X or Y
        var diff = Utils.pointDifference(positionA[0], positionB[0], positionA[1], positionB[1]);
        var point = [positionA[0], positionA[1]];

        for (var i = 0; i < detectionPointCount; i++) {
            point[0] -= diff[0] / detectionPointCount;
            point[1] -= diff[1] / detectionPointCount;
            if (this.isPositionInWall(point)) {
                return true;
            }
        }
    }
    return false;
};

module.exports = BaseBrain;

},{}],11:[function(require,module,exports){
"use strict";

var BaseBrain = require("logic/actor/components/ai/BaseBrain");

function MookBrain(config) {
    Object.assign(this, config);
    BaseBrain.apply(this, arguments);

    this.timer = 0;
}

MookBrain.extend(BaseBrain);

MookBrain.prototype.update = function () {
    this.timer++;

    if (this.timer % 2 === 0) {
        this.orders.lookAtPlayer = !this.isWallBetween(this.actor.body.position, this.playerActor.body.position);

        var distance = Utils.distanceBetweenPoints(this.actor.body.position[0], this.playerActor.body.position[0], this.actor.body.position[1], this.playerActor.body.position[1]);
        this.orders.forward = distance > 90;
        this.orders.backward = distance < 40;
    }
};

module.exports = MookBrain;

},{"logic/actor/components/ai/BaseBrain":10}],12:[function(require,module,exports){
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

var BaseBody = require("logic/actor/components/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');
var MookBrain = require("logic/actor/components/ai/MookBrain");

function MookActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.brain = new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor()
    });

    this.acceleration = 100;
    this.backwardAccelerationRatio = 1;
    this.horizontalAccelerationRatio = 1;
    this.turnSpeed = 2.5;

    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    this.thrust = 0;
    this.horizontalThrust = 0;
    this.rotationForce = 0;

    this.hp = 4;

    this.weaponTimer = 0;
    this.shotsFired = 0;
    this.activationTime = Utils.rand(200, 600);
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

    this.brain.update();
    this.processWeapon();
    this.processMovement();
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
        this.shotsFired = 0;
        this.weaponTimer += 120;
    }
};

MookActor.prototype.processMovement = function () {
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

MookActor.prototype.actorLogic = function () {
    this.rotationForce = 0;

    if (this.brain.orders.lookAtPlayer) {
        this.lookAtPlayer();

        if (this.brain.orders.backward) {
            this.thrust = -1;
        } else if (this.brain.orders.forward) {
            this.thrust = 1;
        } else {
            this.thrust = 0;
        }

        if (Utils.rand(0, 100) > 99) {
            var horizontalThrustRand = Utils.rand(0, 2);
            this.horizontalThrust = horizontalThrustRand - 1;
        }

        if (this.timer > this.activationTime) {
            this.requestShoot = true;
        }
    } else {
        if (Utils.rand(0, 100) === 100) this.rotationForce = Utils.rand(-2, 2);
        if (Utils.rand(0, 100) > 95) {
            var thrustRand = Utils.rand(0, 100);
            if (thrustRand > 60) {
                this.thrust = 1;
            } else if (thrustRand <= 2) {
                this.thrust = -1;
            } else {
                this.thrust = 0;
            }
        }
        this.horizontalThrust = 0;

        this.requestShoot = false;
    }
};

MookActor.prototype.lookAtPlayer = function () {
    var playerPosition = this.brain.getPlayerPosition();
    if (playerPosition) {
        var angleVector = Utils.angleToVector(this.body.angle, 1);
        var angle = Utils.vectorAngleToPoint(angleVector[0], playerPosition[0] - this.body.position[0], angleVector[1], playerPosition[1] - this.body.position[1]);

        if (angle < 180 && angle > 0) {
            this.rotationForce = Math.min(angle / this.stepAngle, 1) * -1;
        }

        if (angle >= 180 && angle < 360) {
            this.rotationForce = Math.min((360 - angle) / this.stepAngle, 1);
        }
    }
};

MookActor.prototype.shoot = function () {
    this.weaponTimer += 10;
    this.manager.addNew({
        classId: ActorFactory.MOLTENPROJECTILE,
        positionX: this.body.position[0],
        positionY: this.body.position[1],
        angle: this.body.angle,
        velocity: 150
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

},{"logic/actor/BaseActor":9,"logic/actor/components/ai/MookBrain":11,"logic/actor/components/body/BaseBody":12,"renderer/actorManagement/ActorFactory":22}],14:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/components/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function PillarActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);
    this.hp = 500;
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

PillarActor.prototype.onDeath = function () {
    for (var i = 0; i < 40; i++) {
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0] + Utils.rand(-5, 5),
            positionY: this.body.position[1] + Utils.rand(-5, 5),
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(5, 50)
        });
    }
    this.body.dead = true;
};

module.exports = PillarActor;

},{"logic/actor/BaseActor":9,"logic/actor/components/body/BaseBody":12,"renderer/actorManagement/ActorFactory":22}],15:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/components/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

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

},{"logic/actor/BaseActor":9,"logic/actor/components/body/BaseBody":12}],16:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/components/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

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

},{"logic/actor/BaseActor":9,"logic/actor/components/body/BaseBody":12}],17:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/components/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

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

    this.primaryWeaponTimer = 0;
    this.secondaryWeaponTimer = 0;

    this.hp = 10;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Circle({
            radius: 5,
            //shape: new p2.Convex({
            //    vertices: [[-4, 0], [-1.5, -4], [1.5, -4], [4, 0], [4, 2.5], [0, 5], [-4, 2.5] ],
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
    //
    // if(this.manager.aiImage){
    //     console.log(this.manager.aiImage);
    // }

    //
    // //todo - zrobic cala ta translacje pozycji znowu tutaj...
    //     if(this.manager.imageData){
    //         let imgData = this.manager.imageData.data;
    //         let index = this.body.position[1] * imgData.width + this.body.position[0];
    //         let i = index*4, d = imgData.data;
    //         //console.log(i,d[i],d[i+1],d[i+2],d[i+3]);
    //     }
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
    this.applyLookAtRotationInput(inputState);
    this.applyWeaponInput(inputState);
};

ShipActor.prototype.applyDiffRotationInput = function (inputState) {
    this.body.angle = inputState.mouseAngle;
};

ShipActor.prototype.applyLookAtRotationInput = function (inputState) {
    this.rotationForce = 0;

    var look = Utils.angleToVector(inputState.mouseAngle, 1);
    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle = Utils.vectorAngleToPoint(angleVector[0], look[0], angleVector[1], look[1]);

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

},{"logic/actor/BaseActor":9,"logic/actor/components/body/BaseBody":12,"renderer/actorManagement/ActorFactory":22}],18:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/components/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

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

},{"logic/actor/BaseActor":9,"logic/actor/components/body/BaseBody":12}],19:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/components/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

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

},{"logic/actor/BaseActor":9,"logic/actor/components/body/BaseBody":12}],20:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/components/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function PlasmaProjectileActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.hp = 1;
    this.damage = 0.5;
    this.removeOnHit = true;
    this.timeout = 120;
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

},{"logic/actor/BaseActor":9,"logic/actor/components/body/BaseBody":12}],21:[function(require,module,exports){
'use strict';

function AiImageRequester(config) {
    Object.assign(this, config);
    if (!this.world) throw new Error('No world specified for Logic AiImageRequester');
    if (!this.renderBus) throw new Error('No render bus specified for Logic AiImageRequester');
}

AiImageRequester.prototype.requestImage = function () {
    var wallActors = this.world.getWallActors();
    this.renderBus.postMessage('getAiImage', wallActors);
};

module.exports = AiImageRequester;

},{}],22:[function(require,module,exports){
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
    ActorFactory.ShipActor = context === 'renderer' ? require("renderer/actor/player/ShipActor") : require("logic/actor/player/ShipActor");
    ActorFactory.MookActor = context === 'renderer' ? require("renderer/actor/enemy/MookActor") : require("logic/actor/enemy/MookActor");
    ActorFactory.WallActor = context === 'renderer' ? require("renderer/actor/map/WallActor") : require("logic/actor/map/WallActor");
    ActorFactory.PillarActor = context === 'renderer' ? require("renderer/actor/map/PillarActor") : require("logic/actor/map/PillarActor");
    ActorFactory.ChunkActor = context === 'renderer' ? require("renderer/actor/object/ChunkActor") : require("logic/actor/object/ChunkActor");
    ActorFactory.PlasmaProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaProjectileActor") : require("logic/actor/projectile/PlasmaProjectileActor");
    ActorFactory.MoltenProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/MoltenProjectileActor") : require("logic/actor/projectile/MoltenProjectileActor");
    ActorFactory.LaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/LaserProjectileActor") : require("logic/actor/projectile/LaserProjectileActor");

    var returnObject = {};

    returnObject.getInstance = function (dependencies) {
        return new ActorFactory(dependencies);
    };

    Object.keys(idMap).forEach(function (key) {
        returnObject[key] = idMap[key];
    });

    return returnObject;
};

},{"logic/actor/enemy/MookActor":13,"logic/actor/map/PillarActor":14,"logic/actor/map/WallActor":15,"logic/actor/object/ChunkActor":16,"logic/actor/player/ShipActor":17,"logic/actor/projectile/LaserProjectileActor":18,"logic/actor/projectile/MoltenProjectileActor":19,"logic/actor/projectile/PlasmaProjectileActor":20,"renderer/actor/enemy/MookActor":30,"renderer/actor/map/PillarActor":31,"renderer/actor/map/WallActor":32,"renderer/actor/object/ChunkActor":33,"renderer/actor/player/ShipActor":34,"renderer/actor/projectile/LaserProjectileActor":35,"renderer/actor/projectile/MoltenProjectileActor":36,"renderer/actor/projectile/PlasmaProjectileActor":37}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/components/mesh/BaseMesh");
var ModelStore = require("renderer/modelRepo/ModelStore");

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

},{"renderer/actor/components/mesh/BaseMesh":24,"renderer/modelRepo/ModelStore":38}],26:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/components/mesh/BaseMesh");

function PillarMesh(config) {
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(20, 20, 15, 50);
    config.material = new THREE.MeshLambertMaterial({ color: 0x505050 });
    Object.assign(this, config);

    this.castShadow = true;
    this.receiveShadow = true;
}

PillarMesh.extend(BaseMesh);

module.exports = PillarMesh;

},{"renderer/actor/components/mesh/BaseMesh":24}],27:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/components/mesh/BaseMesh");
var ModelStore = require("renderer/modelRepo/ModelStore");

function RavierMesh(config) {
    BaseMesh.apply(this, arguments);

    config = config || {};
    config.geometry = ModelStore.get('ravier').geometry;
    config.material = ModelStore.get('ravier').material;
    Object.assign(this, config);

    //this.castShadow = true;
}

RavierMesh.extend(BaseMesh);

module.exports = RavierMesh;

},{"renderer/actor/components/mesh/BaseMesh":24,"renderer/modelRepo/ModelStore":38}],28:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/components/mesh/BaseMesh");
var ModelStore = require("renderer/modelRepo/ModelStore");

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

},{"renderer/actor/components/mesh/BaseMesh":24,"renderer/modelRepo/ModelStore":38}],29:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/components/mesh/BaseMesh");

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

},{"renderer/actor/components/mesh/BaseMesh":24}],30:[function(require,module,exports){
"use strict";

var ShipMesh = require("renderer/actor/components/mesh/ShipMesh");
var BaseActor = require("renderer/actor/BaseActor");

function MookActor() {
    BaseActor.apply(this, arguments);
    this.speedZ = 0.04;
}

MookActor.extend(BaseActor);

MookActor.prototype.createMesh = function () {
    return new ShipMesh({ actor: this, scaleX: 1, scaleY: 1, scaleZ: 1 });
};

MookActor.prototype.customUpdate = function () {
    this.positionZ += this.speedZ;
    this.doBob();
};

MookActor.prototype.doBob = function () {
    if (this.positionZ > 10) {
        this.speedZ -= 0.002;
    } else {
        this.speedZ += 0.002;
    }
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

},{"renderer/actor/BaseActor":23,"renderer/actor/components/mesh/ShipMesh":28}],31:[function(require,module,exports){
"use strict";

var PillarMesh = require("renderer/actor/components/mesh/PillarMesh");
var BaseActor = require("renderer/actor/BaseActor");

function PillarActor() {
    BaseActor.apply(this, arguments);
}

PillarActor.extend(BaseActor);

PillarActor.prototype.createMesh = function () {
    return new PillarMesh({ actor: this });
};

PillarActor.prototype.onDeath = function () {
    for (var i = 0; i < 20; i++) {
        this.particleManager.createParticle('smokePuffAlpha', {
            positionX: this.position[0] + Utils.rand(-10, 10),
            positionY: this.position[1] + Utils.rand(-10, 10),
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(30, 50),
            alpha: Utils.rand(0, 3) / 10 + 0.3,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0, 4) / 10,
            particleAngle: Utils.rand(0, 360),
            lifeTime: 120
        });
    }
    //
    // this.particleManager.createParticle('mainExplosionAdd', {
    //     positionX: this.position[0],
    //     positionY: this.position[1],
    //     colorR: 1,
    //     colorG: 1,
    //     colorB: 1,
    //     scale: 500,
    //     alpha: 1,
    //     alphaMultiplier: 0.4,
    //     particleVelocity: 0,
    //     particleAngle: 0,
    //     lifeTime: 30
    // });
    //
    // this.particleManager.createParticle('mainExplosionAdd', {
    //     positionX: this.position[0],
    //     positionY: this.position[1],
    //     colorR: 1,
    //     colorG: 1,
    //     colorB: 1,
    //     scale: 120,
    //     alpha: 1,
    //     alphaMultiplier: 0.95,
    //     particleVelocity: 0,
    //     particleAngle: 0,
    //     lifeTime: 80
    // });
    //
    // this.particleManager.createParticle('mainExplosionAdd', {
    //     positionX: this.position[0],
    //     positionY: this.position[1],
    //     colorR: 1,
    //     colorG: 0.6,
    //     colorB: 0.2,
    //     scale: 300,
    //     alpha: 1,
    //     alphaMultiplier: 0.95,
    //     particleVelocity: 0,
    //     particleAngle: 0,
    //     lifeTime: 90
    // });
};

module.exports = PillarActor;

},{"renderer/actor/BaseActor":23,"renderer/actor/components/mesh/PillarMesh":26}],32:[function(require,module,exports){
"use strict";

var WallMesh = require("renderer/actor/components/mesh/WallMesh");
var BaseActor = require("renderer/actor/BaseActor");

function WallActor() {
    BaseActor.apply(this, arguments);
}

WallActor.extend(BaseActor);

WallActor.prototype.createMesh = function () {
    return new WallMesh({ actor: this });
};

module.exports = WallActor;

},{"renderer/actor/BaseActor":23,"renderer/actor/components/mesh/WallMesh":29}],33:[function(require,module,exports){
"use strict";

var ChunkMesh = require("renderer/actor/components/mesh/ChunkMesh");
var BaseActor = require("renderer/actor/BaseActor");

function ChunkActor() {
    BaseActor.apply(this, arguments);
}

ChunkActor.extend(BaseActor);

ChunkActor.prototype.createMesh = function () {
    return new ChunkMesh({ actor: this, scaleX: Utils.rand(5, 10) / 10, scaleY: Utils.rand(5, 10) / 10, scaleZ: Utils.rand(5, 10) / 10 });
};

ChunkActor.prototype.customUpdate = function () {
    if (this.timer % Utils.rand(5, 15) === 0) {
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
};

module.exports = ChunkActor;

},{"renderer/actor/BaseActor":23,"renderer/actor/components/mesh/ChunkMesh":25}],34:[function(require,module,exports){
"use strict";

var RavierMesh = require("renderer/actor/components/mesh/RavierMesh");
var BaseActor = require("renderer/actor/BaseActor");

function ShipActor() {
    BaseActor.apply(this, arguments);
    this.count = 0;
    this.speedZ = 0.04;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMesh = function () {
    return new RavierMesh({ actor: this, scaleX: 3, scaleY: 3, scaleZ: 3 });
};

ShipActor.prototype.customUpdate = function () {
    this.doEngineGlow();
    this.positionZ += this.speedZ;
    this.doBob();
};

ShipActor.prototype.doBank = function () {
    this.mesh.rotation.x += Utils.degToRad((this.logicPreviousAngle - this.angle) * 50);
};

ShipActor.prototype.doBob = function () {
    if (this.positionZ > 10) {
        this.speedZ -= 0.002;
    } else {
        this.speedZ += 0.002;
    }
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

},{"renderer/actor/BaseActor":23,"renderer/actor/components/mesh/RavierMesh":27}],35:[function(require,module,exports){
'use strict';

var BaseActor = require("renderer/actor/BaseActor");

function LaserProjectileActor(config) {
    BaseActor.apply(this, arguments);
    this.colorR = 0.3;
    this.colorG = 0.3;
    this.colorB = 1;
}

LaserProjectileActor.extend(BaseActor);

LaserProjectileActor.prototype.customUpdate = function () {
    for (var i = 0; i < 15; i++) {
        var offsetPosition = Utils.angleToVector(this.angle, -i * 0.6);
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

    this.particleManager.createParticle('mainExplosionAdd', {
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

    this.particleManager.createParticle('mainExplosionAdd', {
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
    this.particleManager.createParticle('mainExplosionAdd', {
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
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleAngle: this.angle,
        lifeTime: 3
    });
};

module.exports = LaserProjectileActor;

},{"renderer/actor/BaseActor":23}],36:[function(require,module,exports){
'use strict';

var BaseActor = require("renderer/actor/BaseActor");

function MoltenProjectileActor(config) {
    BaseActor.apply(this, arguments);
    this.colorR = 1;
    this.colorG = 0.3;
    this.colorB = 0.1;
}

MoltenProjectileActor.extend(BaseActor);

MoltenProjectileActor.prototype.customUpdate = function () {
    for (var i = 0; i < 3; i++) {
        var offsetPosition = Utils.angleToVector(this.angle, -i * 0.5);
        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 1.5,
            alpha: 1,
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
        scale: 6,
        alpha: 0.6,
        alphaMultiplier: 0.6,
        particleVelocity: 1,
        particleAngle: this.angle,
        lifeTime: 1
    });
};

MoltenProjectileActor.prototype.onDeath = function () {
    for (var i = 0; i < 5; i++) {
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

    this.particleManager.createParticle('mainExplosionAdd', {
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

    this.particleManager.createParticle('mainExplosionAdd', {
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
    this.particleManager.createParticle('mainExplosionAdd', {
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

},{"renderer/actor/BaseActor":23}],37:[function(require,module,exports){
'use strict';

var BaseActor = require("renderer/actor/BaseActor");

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
            scale: 2.6 - 0.4 * i,
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
        scale: 8,
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

    this.particleManager.createParticle('mainExplosionAdd', {
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

    this.particleManager.createParticle('mainExplosionAdd', {
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

    this.particleManager.createParticle('mainExplosionAdd', {
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

    this.particleManager.createParticle('mainExplosionAdd', {
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

},{"renderer/actor/BaseActor":23}],38:[function(require,module,exports){
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

},{}]},{},[2]);
