(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Constants = {
    SHOW_FPS: true,

    LOGIC_REFRESH_RATE: 60,

    DEFAULT_POSITION_Z: 10,

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

    makeRandomColor: function makeRandomColor() {
        var min = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var max = arguments.length <= 1 || arguments[1] === undefined ? 256 : arguments[1];

        var colors = ['', '', ''];

        colors.forEach(function (color, index) {
            var newColor = this.rand(min, max).toString(16);
            colors[index] = newColor.length === 1 ? '0' + newColor : newColor;
        }.bind(this));

        var color = '0x' + colors.join('');
        return Number(color);
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

    angleBetweenPointsFromCenter: function angleBetweenPointsFromCenter(p1, p2) {
        var angle = Math.atan2(p1[1], p1[0]) - Math.atan2(p2[1], p2[0]);

        angle = angle * 360 / (2 * Math.PI);

        if (angle < 0) {
            angle = angle + 360;
        }
        return angle;
    },

    angleBetweenPoints: function angleBetweenPoints(p1, p2) {
        var angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
        angle -= Math.PI / 2;
        return angle % (Math.PI * 2);
    },

    pointInArc: function pointInArc(p1, p2, p1LookAngle, p1ArcAngle) {
        var angleToP2 = this.angleBetweenPoints(p1, p2);
        var normalizedAngle = p1LookAngle % (Math.PI * 2);
        var angleDifference = normalizedAngle >= 0 && angleToP2 >= 0 || normalizedAngle < 0 && angleToP2 < 0 ? normalizedAngle - angleToP2 : normalizedAngle + angleToP2 * -1;
        return Math.abs(angleDifference) < this.degToRad(p1ArcAngle) || Math.abs(angleDifference - Math.PI * 2) < this.degToRad(p1ArcAngle) || Math.abs(angleDifference + Math.PI * 2) < this.degToRad(p1ArcAngle);
    },

    arcAngleDifference: function arcAngleDifference(p1, p2, p1LookAngle) {
        var angleToP2 = this.angleBetweenPoints(p1, p2);
        var normalizedAngle = p1LookAngle % (Math.PI * 2);
        return normalizedAngle >= 0 && angleToP2 >= 0 || normalizedAngle < 0 && angleToP2 < 0 ? normalizedAngle - angleToP2 : normalizedAngle + angleToP2 * -1;
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

},{"logic/GameScene":5,"logic/GameWorld":6,"logic/RenderBus":7,"logic/actorManagement/ActorManager":8,"logic/ai/AiImageRequester":25}],5:[function(require,module,exports){
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

    for (var i = 0; i < 40; i++) {
        this.actorManager.addNew({
            classId: ActorFactory.MOOK,
            positionX: Utils.rand(300, 350),
            positionY: Utils.rand(300, 350),
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

},{"renderer/actorManagement/ActorFactory":26}],6:[function(require,module,exports){
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
    this.actorIdsToSendUpdateAbout = [];

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

    for (var i = 0; i < this.playerActors.length; i++) {
        if (this.storage[this.playerActors[i]]) {
            this.storage[this.playerActors[i]].playerUpdate(inputState);
        }
    }

    for (var actorId in this.storage) {
        this.storage[actorId].update();
    }

    if (this.actorIdsToSendUpdateAbout.length > 0) {
        this.core.renderBus.postMessage('secondaryActorUpdate', { actorData: this.buildSecondaryUpdateTransferData() });
        this.actorIdsToSendUpdateAbout = [];
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
    var startingMooks = 40; //todo: definitely not the place for that
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

ActorManager.prototype.requestUpdateActor = function (actorId) {
    this.actorIdsToSendUpdateAbout.push(actorId);
};

ActorManager.prototype.buildSecondaryUpdateTransferData = function () {
    var transferData = {};
    for (var i = 0; i < this.actorIdsToSendUpdateAbout.length; i++) {
        var actor = this.storage[this.actorIdsToSendUpdateAbout[i]];
        if (actor) {
            transferData[this.actorIdsToSendUpdateAbout[i]] = {
                hp: actor.hp
            };
        }
    }
    return transferData;
};

module.exports = ActorManager;

},{"renderer/actorManagement/ActorFactory":26}],9:[function(require,module,exports){
'use strict';

function BaseActor(config) {
    Object.assign(this, config);

    this.body = this.createBody();
    if (!this.body) throw new Error('No body defined for Logic Actor!');

    this.ACCELERATION = 0;
    this.TURN_SPEED = 0;
    this.DAMAGE = 0;

    this.hp = Infinity;

    this.body.position = [this.positionX || 0, this.positionY || 0];
    this.body.angle = this.angle || 0;
    this.body.actor = this;
    this.body.velocity = Utils.angleToVector(this.angle, this.velocity || 0);

    this.thrust = 0;
    this.horizontalThrust = 0;
    this.rotationForce = 0;
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
    this.processMovement();
};

BaseActor.prototype.onCollision = function (otherActor) {
    if (otherActor && this.hp != Infinity && otherActor.DAMAGE > 0) {
        this.hp -= otherActor.DAMAGE;
        this.notifyManagerOfUpdate();
    }

    if (this.hp <= 0 || this.removeOnHit) {
        this.onDeath();
    }
};

BaseActor.prototype.notifyManagerOfUpdate = function () {
    this.manager.requestUpdateActor(this.body.actorId);
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

BaseActor.prototype.processMovement = function () {
    if (this.rotationForce !== 0) {
        this.body.angularVelocity = this.rotationForce * this.TURN_SPEED;
    } else {
        this.body.angularVelocity = 0;
    }

    if (this.thrust !== 0) {
        this.body.applyForceLocal([0, this.thrust * this.ACCELERATION]);
    }

    if (this.horizontalThrust !== 0) {
        this.body.applyForceLocal([this.horizontalThrust * this.ACCELERATION, 0]);
    }
};

module.exports = BaseActor;

},{}],10:[function(require,module,exports){
'use strict';

function BaseBrain(config) {
    config = config || [];

    Object.assign(this, config);

    if (!this.actor) throw new Error('No actor for a Brain!');
    if (!this.manager) throw new Error('No manager for a Brain!');
    if (!this.playerActor) throw new Error('No playerActor for a Brain!');

    this.orders = {
        thrust: 0, //backward < 0; forward > 0
        horizontalThrust: 0, //left < 0; right > 0
        turn: 0, //left < 0; right > 0
        shoot: false,
        lookAtPlayer: false
    };
}

BaseBrain.prototype.update = function () {};

BaseBrain.prototype.getPlayerPosition = function () {
    return this.playerActor.body.position;
};

BaseBrain.prototype.getPlayerPositionWithLead = function () {
    var leadSpeed = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
    var leadSkill = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    var p = this.actor.body.position;
    var tp = this.playerActor.body.position;
    var tv = this.playerActor.body.velocity;
    var lv = Utils.angleToVector(this.actor.body.angle, leadSpeed);

    var lead = Math.sqrt(leadSkill * (((tp[0] - p[0]) * (tp[0] - p[0]) + (tp[1] - p[1]) * (tp[1] - p[1])) / (lv[0] * lv[0] + lv[1] * lv[1])));
    return [tp[0] + tv[0] * lead, tp[1] + tv[1] * lead];
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
    var densityMultiplier = arguments.length <= 2 || arguments[2] === undefined ? 0.5 : arguments[2];

    if (this.manager.aiImage) {
        var imageObject = this.manager.aiImage;
        var distance = Utils.distanceBetweenPoints(positionA[0], positionB[0], positionA[1], positionB[1]);
        var detectionPointCount = distance * imageObject.lengthMultiplierX * densityMultiplier; //doesn't matter too much if X or Y
        var diff = Utils.pointDifference(positionA[0], positionB[0], positionA[1], positionB[1]);
        var point = [positionA[0], positionA[1]];

        for (var i = 1; i < detectionPointCount - 1; i++) {
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
'use strict';

var BaseBrain = require("logic/actor/component/ai/BaseBrain");

function MookBrain(config) {
    Object.assign(this, config);
    BaseBrain.apply(this, arguments);

    this.SHOOTING_ARC = 15;

    this.timer = 0;
    this.activationTime = Utils.rand(100, 150);

    this.preferredTurn = 1;
    this.createWallDetectionParameters();
}

MookBrain.extend(BaseBrain);

MookBrain.prototype.createWallDetectionParameters = function () {
    this.wallDetectionDistances = new Uint16Array([8, 20]);

    this.wallDetectionAngles = new Uint16Array([0, 45, 90, 135, 180, 225, 270, 315]);
    this.wallDetectionAngleIndexesFront = new Uint16Array([0, 1, 7]);
    this.wallDetectionAngleIndexesRear = new Uint16Array([3, 4, 5]);
    this.wallDetectionAngleIndexesLeft = new Uint16Array([5, 6, 7]);
    this.wallDetectionAngleIndexesRight = new Uint16Array([1, 2, 3]);

    this.detectionResults = new Uint8Array(this.wallDetectionAngles.length);

    this.wallDetectionAngleObject = {
        0: ['front'],
        45: ['front', 'right'],
        90: ['right'],
        135: ['rear', 'right'],
        180: ['rear'],
        225: ['left', 'rear'],
        270: ['left'],
        315: ['left', 'front']
    };
};

MookBrain.prototype.update = function () {
    this.timer++;

    if (this.timer % 30 === 0) {
        this.preferredTurn *= -1;
    }

    var nearbyWalls = this.detectNearbyWallsFast();

    if (this.isWallBetween(this.actor.body.position, this.playerActor.body.position)) {
        this.freeRoamActon(nearbyWalls);
    } else {
        this.seesPlayerAction();
    }

    this.avoidWalls(nearbyWalls);
};

//ugly as hell, but works way faster than iterating over object with for..in structure.
MookBrain.prototype.detectNearbyWallsFast = function () {
    for (var a = 0; a < this.wallDetectionAngles.length; a++) {
        for (var d = 0; d < this.wallDetectionDistances.length; d++) {
            this.detectionResults[a] = 0;
            var positionOffset = Utils.angleToVector(this.actor.body.angle + Utils.degToRad(this.wallDetectionAngles[a]), this.wallDetectionDistances[d]);
            var position = [this.actor.body.position[0] + positionOffset[0], this.actor.body.position[1] + positionOffset[1]];
            this.detectionResults[a] = this.isPositionInWall(position);
            if (this.detectionResults[a]) {
                break;
            }
        }
    }

    var directions = {};
    for (var i = 0; i < this.wallDetectionAngleIndexesFront.length; i++) {
        if (this.detectionResults[this.wallDetectionAngleIndexesFront[i]] === 1) {
            directions.front = true;
            break;
        }
    }
    for (var i = 0; i < this.wallDetectionAngleIndexesRear.length; i++) {
        if (this.detectionResults[this.wallDetectionAngleIndexesRear[i]] === 1) {
            directions.rear = true;
            break;
        }
    }
    for (var i = 0; i < this.wallDetectionAngleIndexesLeft.length; i++) {
        if (this.detectionResults[this.wallDetectionAngleIndexesLeft[i]] === 1) {
            directions.left = true;
            break;
        }
    }
    for (var i = 0; i < this.wallDetectionAngleIndexesRight.length; i++) {
        if (this.detectionResults[this.wallDetectionAngleIndexesRight[i]] === 1) {
            directions.right = true;
            break;
        }
    }

    return directions;
};

MookBrain.prototype.avoidWalls = function (nearbyWalls) {
    if (nearbyWalls.rear && !nearbyWalls.front) {
        this.orders.thrust = 1;
    }

    if (nearbyWalls.front && !nearbyWalls.rear) {
        this.orders.thrust = -1;
    }

    if (nearbyWalls.left && !nearbyWalls.right) {
        this.orders.horizontalThrust = -1;
    }

    if (nearbyWalls.right && !nearbyWalls.left) {
        this.orders.horizontalThrust = 1;
    }
};

MookBrain.prototype.seesPlayerAction = function () {
    this.orders.lookAtPlayer = true;
    var distance = Utils.distanceBetweenPoints(this.actor.body.position[0], this.playerActor.body.position[0], this.actor.body.position[1], this.playerActor.body.position[1]);

    this.orders.thrust = 0;
    if (distance > 90) this.orders.thrust = 1;
    if (distance < 40) this.orders.thrust = -1;

    this.orders.turn = 0;

    this.shootAction(distance);
    this.randomStrafeAction();
};

MookBrain.prototype.freeRoamActon = function (nearbyWalls) {
    this.orders.lookAtPlayer = false;
    this.orders.thrust = 1;
    this.orders.horizontalThrust = 0;
    this.orders.turn = 0;
    this.orders.shoot = false;

    if (nearbyWalls.left && !nearbyWalls.right) {
        this.orders.turn = 1;
    }

    if (nearbyWalls.right && !nearbyWalls.left) {
        this.orders.turn = -1;
    }

    if (nearbyWalls.front && !nearbyWalls.left && !nearbyWalls.right) {
        this.orders.turn = this.preferredTurn;
    }
};

MookBrain.prototype.shootAction = function () {
    var distance = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    var shouldShoot = this.timer > this.activationTime && Utils.pointInArc(this.actor.body.position, this.playerActor.body.position, this.actor.body.angle, this.SHOOTING_ARC);

    this.orders.shoot = shouldShoot;
};

MookBrain.prototype.randomStrafeAction = function () {
    if (Utils.rand(0, 100) > 98) {
        this.orders.horizontalThrust = Utils.rand(0, 2) - 1;
    }
};

module.exports = MookBrain;

},{"logic/actor/component/ai/BaseBrain":10}],12:[function(require,module,exports){
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
'use strict';

function BaseWeapon(config) {
    this.BURST_COUNT = 1;
    this.BURST_COOLDOWN = 0;
    this.COOLDOWN = 100;
    this.RECOIL = 0;
    this.VELOCITY = 10;

    /*example:
        this.FIRING_POINTS = [
            {offsetAngle: 90, offsetDistance:20, fireAngle: 0}
            {offsetAngle: +90, offsetDistance:20, fireAngle: 0}
        ]
        all properties are relative to actor's body; this example will create
        a weapon firing two shots forward from side mounts.
    */

    this.firingPoints = [];

    Object.assign(this, config);

    this.timer = 0;
    this.shooting = false;
    this.shotsFired = 0;

    if (!this.PROJECTILE_CLASS) throw new Error('No projectile class for a Weapon!');
    if (!this.manager) throw new Error('No actor manager for a Weapon!');
    if (!this.actor) throw new Error('No actor for a Weapon!');
}

BaseWeapon.prototype.update = function () {
    if (this.timer > 0) {
        this.timer--;
    } else {
        if (this.shooting) {
            this.processActiveWeapon();
        }
    }
};

BaseWeapon.prototype.shoot = function () {
    this.shooting = true;
};

BaseWeapon.prototype.stopShooting = function () {
    this.shooting = false;
};

BaseWeapon.prototype.processActiveWeapon = function () {
    this.handleFiring();
    this.shotsFired++;
    if (this.shotsFired >= this.BURST_COUNT) {
        this.shotsFired = 0;
        this.timer += this.COOLDOWN;
    }
};

BaseWeapon.prototype.fireProjectile = function (firingPointConfig) {
    var body = this.actor.body;
    var offsetPosition = Utils.angleToVector(body.angle + Utils.degToRad(firingPointConfig.offsetAngle), firingPointConfig.offsetDistance);
    this.manager.addNew({
        classId: this.PROJECTILE_CLASS,
        positionX: body.position[0] + offsetPosition[0],
        positionY: body.position[1] + offsetPosition[1],
        angle: body.angle + firingPointConfig.fireAngle,
        velocity: this.VELOCITY
    });
};

BaseWeapon.prototype.handleFiring = function () {
    this.firingPoints.forEach(this.fireProjectile.bind(this));
    this.timer += this.BURST_COOLDOWN;
    this.actor.body.applyForceLocal([0, -this.RECOIL]);
};

module.exports = BaseWeapon;

},{}],14:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function Blaster(config) {
    Object.assign(this, config);

    this.PROJECTILE_CLASS = ActorFactory.LASERPROJECITLE;

    BaseWeapon.apply(this, arguments);

    this.COOLDOWN = 15;
    this.VELOCITY = 600;
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;

},{"logic/actor/component/weapon/BaseWeapon":13,"renderer/actorManagement/ActorFactory":26}],15:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function MoltenBallThrower(config) {
    Object.assign(this, config);

    this.PROJECTILE_CLASS = ActorFactory.MOLTENPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.BURST_COUNT = 3;
    this.BURST_COOLDOWN = 5;
    this.COOLDOWN = 100;
    this.RECOIL = 300;
    this.VELOCITY = 210;
}

MoltenBallThrower.extend(BaseWeapon);

module.exports = MoltenBallThrower;

},{"logic/actor/component/weapon/BaseWeapon":13,"renderer/actorManagement/ActorFactory":26}],16:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function PlasmaGun(config) {
    Object.assign(this, config);

    this.PROJECTILE_CLASS = ActorFactory.PLASMAPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.COOLDOWN = 10;
    this.VELOCITY = 200;
}

PlasmaGun.extend(BaseWeapon);

module.exports = PlasmaGun;

},{"logic/actor/component/weapon/BaseWeapon":13,"renderer/actorManagement/ActorFactory":26}],17:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var MookBrain = require("logic/actor/component/ai/MookBrain");
var MoltenBallThrower = require("logic/actor/component/weapon/MoltenBallThrower");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function MookActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.ACCELERATION = 140;
    this.TURN_SPEED = 2.5;
    this.hp = 4;

    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    this.stepAngle = Utils.radToDeg(this.TURN_SPEED / Constants.LOGIC_REFRESH_RATE);
}

MookActor.extend(BaseActor);

MookActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Circle({
            //vertices: [[-5, 3], [0, 0], [5, 3], [0, 4]],
            radius: 3,
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

    if (this.timer % 2 === 0) this.brain.update();

    this.doBrainOrders();
    this.weapon.update();
};

MookActor.prototype.doBrainOrders = function () {
    if (this.brain.orders.lookAtPlayer) {
        this.lookAtPlayer();
        if (this.brain.orders.turn !== 0) {
            this.rotationForce = this.brain.orders.turn;
        }
    } else {
        this.rotationForce = this.brain.orders.turn;
    }

    this.thrust = this.brain.orders.thrust;
    this.horizontalThrust = this.brain.orders.horizontalThrust;

    if (this.brain.orders.shoot) {
        this.weapon.shoot();
    } else {
        this.weapon.stopShooting();
    }
};

MookActor.prototype.lookAtPlayer = function () {
    var playerPosition = this.brain.getPlayerPositionWithLead(210, 1.2);

    if (playerPosition) {
        var angleVector = Utils.angleToVector(this.body.angle, 1);
        var angle = Utils.angleBetweenPointsFromCenter(angleVector, [playerPosition[0] - this.body.position[0], playerPosition[1] - this.body.position[1]]);

        if (angle < 180 && angle > 0) {
            this.rotationForce = Math.min(angle / this.stepAngle, 1) * -1;
        }

        if (angle >= 180 && angle < 360) {
            this.rotationForce = Math.min((360 - angle) / this.stepAngle, 1);
        }
    }
};

MookActor.prototype.createBrain = function () {
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor()
    });
};

MookActor.prototype.createWeapon = function () {
    return new MoltenBallThrower({
        actor: this,
        manager: this.manager,
        firingPoints: [{ offsetAngle: 0, offsetDistance: 3, fireAngle: 0 }]
    });
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

module.exports = MookActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/ai/MookBrain":11,"logic/actor/component/body/BaseBody":12,"logic/actor/component/weapon/MoltenBallThrower":15,"renderer/actorManagement/ActorFactory":26}],18:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

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

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":12,"renderer/actorManagement/ActorFactory":26}],19:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
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

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":12}],20:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function ChunkActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.hp = 1;
    this.TURN_SPEED = 1;

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
    this.rotationForce = Utils.rand(-15, 15);
};

module.exports = ChunkActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":12}],21:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseBrain = require("logic/actor/component/ai/BaseBrain");
var BaseActor = require("logic/actor/BaseActor");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');
var Blaster = require("logic/actor/component/weapon/Blaster");
var PlasmaGun = require("logic/actor/component/weapon/PlasmaGun");

function ShipActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.ACCELERATION = 500;
    this.TURN_SPEED = 6;
    this.hp = 20;
    this.stepAngle = Utils.radToDeg(this.TURN_SPEED / Constants.LOGIC_REFRESH_RATE);

    this.lastInputStateX = 0;
    this.lastInputStateY = 0;

    this.plasma = this.createPlasma();
    this.blaster = this.createBlaster();
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Circle({
            radius: 5,
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
    this.blaster.update();
    this.plasma.update();
};

ShipActor.prototype.playerUpdate = function (inputState) {
    this.applyThrustInput(inputState);
    this.applyLookAtRotationInput(inputState);
    this.applyWeaponInput(inputState);
};

ShipActor.prototype.applyLookAtRotationInput = function (inputState) {
    this.rotationForce = 0;

    var lookTarget = Utils.angleToVector(inputState.mouseAngle, 1);
    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle = Utils.angleBetweenPointsFromCenter(angleVector, lookTarget);

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
        this.horizontalThrust = -1;
    }

    if (inputState.d) {
        this.horizontalThrust = 1;
    }

    if (inputState.w) {
        this.thrust = 1;
    }

    if (inputState.s) {
        this.thrust = -1;
    }
};

ShipActor.prototype.applyWeaponInput = function (inputState) {
    if (inputState.mouseLeft) {
        this.plasma.shoot();
    } else {
        this.plasma.stopShooting();
    }

    if (inputState.mouseRight) {
        this.blaster.shoot();
    } else {
        this.blaster.stopShooting();
    }
};

ShipActor.prototype.createBlaster = function () {
    return new Blaster({
        actor: this,
        manager: this.manager,
        firingPoints: [{ offsetAngle: -90, offsetDistance: 3.2, fireAngle: 0 }, { offsetAngle: 90, offsetDistance: 3.2, fireAngle: 0 }]
    });
};

ShipActor.prototype.createPlasma = function () {
    return new PlasmaGun({
        actor: this,
        manager: this.manager,
        firingPoints: [{ offsetAngle: -90, offsetDistance: 5, fireAngle: 0 }, { offsetAngle: 90, offsetDistance: 5, fireAngle: 0 }]
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

},{"logic/actor/BaseActor":9,"logic/actor/component/ai/BaseBrain":10,"logic/actor/component/body/BaseBody":12,"logic/actor/component/weapon/Blaster":14,"logic/actor/component/weapon/PlasmaGun":16,"renderer/actorManagement/ActorFactory":26}],22:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function LaserProjectileActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.hp = 1;
    this.DAMAGE = 2;
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
        mass: 0.1,
        ccdSpeedThreshold: 1,
        ccdIterations: 4
    });
};

LaserProjectileActor.prototype.onDeath = function () {
    this.body.dead = true;
};

module.exports = LaserProjectileActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":12}],23:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function MoltenProjectileActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.hp = 1;
    this.DAMAGE = 1;
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

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":12}],24:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function PlasmaProjectileActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.hp = 1;
    this.DAMAGE = 0.5;
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
};

module.exports = PlasmaProjectileActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":12}],25:[function(require,module,exports){
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

},{"logic/actor/enemy/MookActor":17,"logic/actor/map/PillarActor":18,"logic/actor/map/WallActor":19,"logic/actor/object/ChunkActor":20,"logic/actor/player/ShipActor":21,"logic/actor/projectile/LaserProjectileActor":22,"logic/actor/projectile/MoltenProjectileActor":23,"logic/actor/projectile/PlasmaProjectileActor":24,"renderer/actor/enemy/MookActor":34,"renderer/actor/map/PillarActor":35,"renderer/actor/map/WallActor":36,"renderer/actor/object/ChunkActor":37,"renderer/actor/player/ShipActor":38,"renderer/actor/projectile/LaserProjectileActor":39,"renderer/actor/projectile/MoltenProjectileActor":40,"renderer/actor/projectile/PlasmaProjectileActor":41}],27:[function(require,module,exports){
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

    this.initialHp = Infinity;
    this.hp = Infinity;

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

BaseActor.prototype.secondaryUpdateFromLogic = function () {};

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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
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

},{"renderer/actor/component/mesh/BaseMesh":28,"renderer/modelRepo/ModelStore":42}],30:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");

function PillarMesh(config) {
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(20, 20, 20, 50);
    config.material = new THREE.MeshLambertMaterial({ color: 0x505050 });
    Object.assign(this, config);

    this.castShadow = true;
    this.receiveShadow = true;
}

PillarMesh.extend(BaseMesh);

module.exports = PillarMesh;

},{"renderer/actor/component/mesh/BaseMesh":28}],31:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/modelRepo/ModelStore");

function RavierMesh(config) {
    BaseMesh.apply(this, arguments);

    config = config || {};
    config.geometry = ModelStore.get('ravier').geometry;
    config.material = ModelStore.get('ravier').material;
    Object.assign(this, config);

    this.receiveShadow = true;
    this.castShadow = true;
}

RavierMesh.extend(BaseMesh);

module.exports = RavierMesh;

},{"renderer/actor/component/mesh/BaseMesh":28,"renderer/modelRepo/ModelStore":42}],32:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
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

},{"renderer/actor/component/mesh/BaseMesh":28,"renderer/modelRepo/ModelStore":42}],33:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");

function WallMesh(config) {
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(800, 2, 30, 30);
    config.material = new THREE.MeshLambertMaterial({ color: 0x505050 });
    Object.assign(this, config);

    this.receiveShadow = true;
    this.castShadow = true;
}

WallMesh.extend(BaseMesh);

module.exports = WallMesh;

},{"renderer/actor/component/mesh/BaseMesh":28}],34:[function(require,module,exports){
"use strict";

var ShipMesh = require("renderer/actor/component/mesh/ShipMesh");
var BaseActor = require("renderer/actor/BaseActor");

function MookActor() {
    BaseActor.apply(this, arguments);
    this.speedZ = Utils.rand(35, 45) / 1000;
    this.bobSpeed = Utils.rand(18, 22) / 10000;

    this.initialHp = 4;
    this.hp = 4;
}

MookActor.extend(BaseActor);

MookActor.prototype.createMesh = function () {
    return new ShipMesh({ actor: this, scaleX: 1, scaleY: 1, scaleZ: 1 });
};

MookActor.prototype.customUpdate = function () {
    this.positionZ += this.speedZ;
    this.doBob();
    this.handleDamage();
};

MookActor.prototype.doBob = function () {
    if (this.positionZ > 10) {
        this.speedZ -= this.bobSpeed;
    } else {
        this.speedZ += this.bobSpeed;
    }
};

MookActor.prototype.onSpawn = function () {
    this.manager.newEnemy(this.actorId);
};

MookActor.prototype.onDeath = function () {
    this.manager.enemyDestroyed(this.actorId);
    this.particleManager.createPremade('OrangeBoomMedium', { position: this.position });
};

MookActor.prototype.handleDamage = function () {
    var damageRandomValue = Utils.rand(0, 100) - 100 * (this.hp / this.initialHp);
    if (damageRandomValue > 20) {
        this.particleManager.createPremade('SmokePuffSmall', { position: this.position });
    }

    if (damageRandomValue > 50 && Utils.rand(0, 100) > 95) {
        this.particleManager.createPremade('BlueSparks', { position: this.position });
    }
};

module.exports = MookActor;

},{"renderer/actor/BaseActor":27,"renderer/actor/component/mesh/ShipMesh":32}],35:[function(require,module,exports){
"use strict";

var PillarMesh = require("renderer/actor/component/mesh/PillarMesh");
var BaseActor = require("renderer/actor/BaseActor");

function PillarActor() {
    BaseActor.apply(this, arguments);
    this.positionZ = Utils.rand(5, 9);
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
};

module.exports = PillarActor;

},{"renderer/actor/BaseActor":27,"renderer/actor/component/mesh/PillarMesh":30}],36:[function(require,module,exports){
"use strict";

var WallMesh = require("renderer/actor/component/mesh/WallMesh");
var BaseActor = require("renderer/actor/BaseActor");

function WallActor() {
    BaseActor.apply(this, arguments);
}

WallActor.extend(BaseActor);

WallActor.prototype.createMesh = function () {
    return new WallMesh({ actor: this });
};

module.exports = WallActor;

},{"renderer/actor/BaseActor":27,"renderer/actor/component/mesh/WallMesh":33}],37:[function(require,module,exports){
"use strict";

var ChunkMesh = require("renderer/actor/component/mesh/ChunkMesh");
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

},{"renderer/actor/BaseActor":27,"renderer/actor/component/mesh/ChunkMesh":29}],38:[function(require,module,exports){
"use strict";

var RavierMesh = require("renderer/actor/component/mesh/RavierMesh");
var BaseActor = require("renderer/actor/BaseActor");

function ShipActor() {
    BaseActor.apply(this, arguments);
    this.count = 0;
    this.speedZ = 0.04;

    //todo: generic config holder
    this.initialHp = 20;
    this.hp = 20;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMesh = function () {
    return new RavierMesh({ actor: this, scaleX: 3, scaleY: 3, scaleZ: 3 });
};

ShipActor.prototype.customUpdate = function () {
    this.doEngineGlow();
    this.positionZ += this.speedZ;
    this.doBob();
    this.handleDamage();
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
        this.particleManager.createPremade('EngineGlowMedium', {
            position: this.position,
            positionZ: this.positionZ,
            angle: this.angle,
            angleOffset: 15,
            distance: -5.2
        });
        this.particleManager.createPremade('EngineGlowMedium', {
            position: this.position,
            positionZ: this.positionZ,
            angle: this.angle,
            angleOffset: 345,
            distance: -5.2
        });
    }

    if (this.inputListener.inputState.a && !this.inputListener.inputState.d) {
        this.particleManager.createPremade('EngineGlowSmall', {
            position: this.position,
            positionZ: this.positionZ,
            angle: this.angle,
            angleOffset: 40,
            distance: -4
        });
        this.particleManager.createPremade('EngineGlowSmall', {
            position: this.position,
            positionZ: this.positionZ,
            angle: this.angle,
            angleOffset: 170,
            distance: -6
        });
    }

    if (this.inputListener.inputState.d) {
        this.particleManager.createPremade('EngineGlowSmall', {
            position: this.position,
            positionZ: this.positionZ,
            angle: this.angle,
            angleOffset: 320,
            distance: -4
        });
        this.particleManager.createPremade('EngineGlowSmall', {
            position: this.position,
            positionZ: this.positionZ,
            angle: this.angle,
            angleOffset: 190,
            distance: -6
        });
    }

    if (this.inputListener.inputState.s) {
        this.particleManager.createPremade('EngineGlowMedium', {
            position: this.position,
            positionZ: this.positionZ,
            angle: this.angle,
            angleOffset: 180,
            distance: -7
        });
    }
};

ShipActor.prototype.onDeath = function () {
    this.particleManager.createPremade('OrangeBoomLarge', { position: this.position });
    this.dead = true;
};

ShipActor.prototype.handleDamage = function () {
    var damageRandomValue = Utils.rand(0, 100) - 100 * (this.hp / this.initialHp);
    if (damageRandomValue > 20) {
        this.particleManager.createPremade('SmokePuffSmall', { position: this.position });
    }

    if (damageRandomValue > 50 && Utils.rand(0, 100) > 95) {
        this.particleManager.createPremade('BlueSparks', { position: this.position });
    }
};

module.exports = ShipActor;

},{"renderer/actor/BaseActor":27,"renderer/actor/component/mesh/RavierMesh":31}],39:[function(require,module,exports){
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
    this.particleManager.createPremade('BlueLaserTrail', { position: this.position, angle: this.angle });
};

LaserProjectileActor.prototype.onDeath = function () {
    this.particleManager.createPremade('BlueSparks', { position: this.position });
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

},{"renderer/actor/BaseActor":27}],40:[function(require,module,exports){
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
    this.particleManager.createPremade('OrangeTrail', { position: this.position, angle: this.angle });
};

MoltenProjectileActor.prototype.onDeath = function () {
    this.particleManager.createPremade('OrangeBoomTiny', { position: this.position, angle: this.angle });
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

},{"renderer/actor/BaseActor":27}],41:[function(require,module,exports){
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
    this.particleManager.createPremade('GreenTrail', { position: this.position, angle: this.angle });
};

PlasmaProjectileActor.prototype.onDeath = function () {
    this.particleManager.createPremade('GreenBoomTiny', { position: this.position, angle: this.angle });
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

},{"renderer/actor/BaseActor":27}],42:[function(require,module,exports){
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
