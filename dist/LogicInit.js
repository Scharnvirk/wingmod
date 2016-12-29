(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
Copyright (C) 2015 by Andrea Giammarchi - @WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var cloner = (function (O) {'use strict';

  // (C) Andrea Giammarchi - Mit Style

  var

    // constants
    VALUE   = 'value',
    PROTO   = '__proto__', // to avoid jshint complains

    // shortcuts
    isArray = Array.isArray,
    create  = O.create,
    dP      = O.defineProperty,
    dPs     = O.defineProperties,
    gOPD    = O.getOwnPropertyDescriptor,
    gOPN    = O.getOwnPropertyNames,
    gOPS    = O.getOwnPropertySymbols ||
              function (o) { return Array.prototype; },
    gPO     = O.getPrototypeOf ||
              function (o) { return o[PROTO]; },
    hOP     = O.prototype.hasOwnProperty,
    oKs     = (typeof Reflect !== typeof oK) &&
              Reflect.ownKeys ||
              function (o) { return gOPS(o).concat(gOPN(o)); },
    set     = function (descriptors, key, descriptor) {
      if (key in descriptors) dP(descriptors, key, {
        configurable: true,
        enumerable: true,
        value: descriptor
      });
      else descriptors[key] = descriptor;
    },

    // used to avoid recursions in deep copy
    index   = -1,
    known   = null,
    blown   = null,
    clean   = function () { known = blown = null; },

    // utilities
    New = function (source, descriptors) {
      var out = isArray(source) ? [] : create(gPO(source));
      return descriptors ? Object.defineProperties(out, descriptors) : out;
    },

    // deep copy and merge
    deepCopy = function deepCopy(source) {
      var result = New(source);
      known = [source];
      blown = [result];
      deepDefine(result, source);
      clean();
      return result;
    },
    deepMerge = function (target) {
      known = [];
      blown = [];
      for (var i = 1; i < arguments.length; i++) {
        known[i - 1] = arguments[i];
        blown[i - 1] = target;
      }
      merge.apply(true, arguments);
      clean();
      return target;
    },

    // shallow copy and merge
    shallowCopy = function shallowCopy(source) {
      clean();
      for (var
        key,
        descriptors = {},
        keys = oKs(source),
        i = keys.length; i--;
        set(descriptors, key, gOPD(source, key))
      ) key = keys[i];
      return New(source, descriptors);
    },
    shallowMerge = function () {
      clean();
      return merge.apply(false, arguments);
    },

    // internal methods
    isObject = function isObject(value) {
      /*jshint eqnull: true */
      return value != null && typeof value === 'object';
    },
    shouldCopy = function shouldCopy(value) {
      /*jshint eqnull: true */
      index = -1;
      if (isObject(value)) {
        if (known == null) return true;
        index = known.indexOf(value);
        if (index < 0) return 0 < known.push(value);
      }
      return false;
    },
    deepDefine = function deepDefine(target, source) {
      for (var
        key, descriptor,
        descriptors = {},
        keys = oKs(source),
        i = keys.length; i--;
      ) {
        key = keys[i];
        descriptor = gOPD(source, key);
        if (VALUE in descriptor) deepValue(descriptor);
        set(descriptors, key, descriptor);
      }
      dPs(target, descriptors);
    },
    deepValue = function deepValue(descriptor) {
      var value = descriptor[VALUE];
      if (shouldCopy(value)) {
        descriptor[VALUE] = New(value);
        deepDefine(descriptor[VALUE], value);
        blown[known.indexOf(value)] = descriptor[VALUE];
      } else if (-1 < index && index in blown) {
        descriptor[VALUE] = blown[index];
      }
    },
    merge = function merge(target) {
      for (var
        source,
        keys, key,
        value, tvalue,
        descriptor,
        deep = this.valueOf(),
        descriptors = {},
        i, a = 1;
        a < arguments.length; a++
      ) {
        source = arguments[a];
        keys = oKs(source);
        for (i = 0; i < keys.length; i++) {
          key = keys[i];
          descriptor = gOPD(source, key);
          if (hOP.call(target, key)) {
            if (VALUE in descriptor) {
              value = descriptor[VALUE];
              if (shouldCopy(value)) {
                descriptor = gOPD(target, key);
                if (VALUE in descriptor) {
                  tvalue = descriptor[VALUE];
                  if (isObject(tvalue)) {
                    merge.call(deep, tvalue, value);
                  }
                }
              }
            }
          } else {
            if (deep && VALUE in descriptor) {
              deepValue(descriptor);
            }
            set(descriptors, key, descriptor);
          }
        }
      }
      return dPs(target, descriptors);
    }
  ;

  return {
    deep: {
      copy: deepCopy,
      merge: deepMerge
    },
    shallow: {
      copy: shallowCopy,
      merge: shallowMerge
    }
  };

}(Object));
module.exports = cloner;
},{}],2:[function(require,module,exports){
(function (global){
"use strict";

global.Utils = require("shared/Utils");
global.Constants = require("shared/Constants");
global.EventEmitter = require("shared/EventEmitter");

if ('function' === typeof importScripts) {
    importScripts('../../lib/p2.js');
    importScripts('../../lib/threex.loop.js');
    var LogicCore = require('logic/Core');
    self.core = new LogicCore(self);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"logic/Core":3,"shared/Constants":70,"shared/EventEmitter":71,"shared/Utils":72}],3:[function(require,module,exports){
"use strict";

var RenderBus = require("logic/RenderBus");
var GameWorld = require("logic/GameWorld");
var ActorManager = require("logic/actor/ActorManager");
var MapManager = require("logic/map/MapManager");
var GameScene = require("logic/GameScene");
var WorldAiMapExtractor = require("logic/WorldAiMapExtractor");

function Core(worker) {
    this.makeMainComponents(worker);
    this.initializeEventHandlers();

    this.initFpsCounter();

    this.running = false;
}

Core.prototype.makeMainComponents = function (worker) {
    this.renderBus = new RenderBus({ worker: worker });
    this.world = new GameWorld();
    this.actorManager = new ActorManager({ world: this.world });
    this.mapManager = new MapManager();
    this.scene = new GameScene({ world: this.world, actorManager: this.actorManager, mapManager: this.mapManager });
    this.worldAiMapXtractor = new WorldAiMapExtractor({ world: this.world });
};

Core.prototype.initializeEventHandlers = function () {
    this.scene.on('newMapBodies', this.onNewMapBodies.bind(this));
    // this.scene.on('newPlayerActor', this.onNewPlayerActor.bind(this));
    this.scene.on('gameFinished', this.onGameFinished.bind(this));

    this.renderBus.on('pause', this.onPause.bind(this));
    this.renderBus.on('startGame', this.onStart.bind(this));
    this.renderBus.on('aiImageDone', this.onAiImageDone.bind(this));
    this.renderBus.on('inputState', this.onInputState.bind(this));
    this.renderBus.on('mapHitmapsLoaded', this.onMapHitmapsLoaded.bind(this));
    this.renderBus.on('weaponSwitched', this.onWeaponSwitched.bind(this));

    this.mapManager.on('mapDone', this.onMapDone.bind(this));

    this.actorManager.on('actorStateChange', this.onActorStateChange.bind(this));
    this.actorManager.on('playerDied', this.onPlayerDied.bind(this));
    this.actorManager.on('playSound', this.onPlaySound.bind(this));
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
    this.actorManager.update(this.inputState);
    this.renderBus.postMessage('updateActors', this.world.makeUpdateData());
    this.world.cleanDeadActors();
    this.world.step(1 / Constants.LOGIC_REFRESH_RATE);

    this.logicTicks++;
    this.scene.update();
};

Core.prototype.startGameLoop = function () {
    var logicLoop = new THREEx.PhysicsLoop(Constants.LOGIC_REFRESH_RATE);
    logicLoop.add(this.processGameLogic.bind(this));
    logicLoop.start();
};

Core.prototype.onInputState = function (event) {
    this.inputState = event.data;
};

Core.prototype.onStart = function () {
    this.startGameLoop();
    this.running = true;
};

Core.prototype.onPause = function () {
    this.running = false;
};

Core.prototype.onAiImageDone = function (event) {
    this.actorManager.aiImage = event.data;
};
//
// Core.prototype.onNewPlayerActor = function(event){
//     var playerActor = event.data;
//     this.actorManager.setPlayerActor(playerActor);
//     this.renderBus.postMessage('attachPlayer', {actorId: playerActor.body.actorId});
// };

Core.prototype.onActorStateChange = function (event) {
    this.renderBus.postMessage('actorStateChange', { data: event.data });
};

Core.prototype.onNewMapBodies = function () {
    var mapBodies = this.worldAiMapXtractor.getTerrainBodies();
    this.renderBus.postMessage('getAiImage', mapBodies);
    this.renderBus.postMessage('newMapBodies', mapBodies);
};

Core.prototype.onPlayerDied = function (event) {
    this.renderBus.postMessage('gameEnded', { enemiesKilled: event.data });
};

Core.prototype.onGameFinished = function (event) {
    this.renderBus.postMessage('gameFinished', {});
};

Core.prototype.onMapHitmapsLoaded = function (event) {
    if (!event.data.hitmaps) throw new Error('No hitmap data received on onMapHitmapsLoaded event!');
    var hitmaps = JSON.parse(event.data.hitmaps);
    this.mapManager.loadChunkHitmaps(hitmaps);
    this.mapManager.createMap();
};

Core.prototype.onMapDone = function (event) {
    this.scene.fillScene(event.data.bodies);
    this.renderBus.postMessage('mapDone', event.data.layout);
};

Core.prototype.onPlaySound = function (event) {
    this.renderBus.postMessage('playSound', event.data);
};

Core.prototype.onWeaponSwitched = function (event) {
    this.actorManager.switchPlayerWeapon(event.data);
};

module.exports = Core;

},{"logic/GameScene":4,"logic/GameWorld":5,"logic/RenderBus":6,"logic/WorldAiMapExtractor":7,"logic/actor/ActorManager":8,"logic/map/MapManager":43}],4:[function(require,module,exports){
"use strict";

var ActorFactory = require("shared/ActorFactory")('logic');
var BaseBody = require("logic/actor/component/body/BaseBody");

function GameScene(config) {
    Object.assign(this, config);
    if (!this.world) throw new Error('No world specified for Logic GameScene');
    if (!this.actorManager) throw new Error('No actorManager specified for Logic GameScene');
    this.timer = 0;

    EventEmitter.apply(this, arguments);
}

GameScene.extend(EventEmitter);

GameScene.prototype.fillScene = function (mapBodies) {

    var playerActor = this.actorManager.addNew({
        classId: ActorFactory.SHIP,
        positionX: 0,
        positionY: 0,
        angle: 0
    });

    for (var i = 0; i < 0; i++) {
        this.actorManager.addNew({
            classId: ActorFactory.DEBUG,
            positionX: Utils.rand(-100, 100),
            positionY: Utils.rand(-100, 100),
            angle: 0
        });
    }
    //
    // this.emit({
    //     type: 'newPlayerActor',
    //     data: playerActor
    // });

    this.addMapBodies(mapBodies);

    this.actorManager.addNew({
        classId: ActorFactory.ENEMYSPAWNER,
        positionX: 0,
        positionY: 221,
        angle: Utils.degToRad(180)
    });

    this.actorManager.addNew({
        classId: ActorFactory.ENEMYSPAWNER,
        positionX: -352,
        positionY: 221,
        angle: Utils.degToRad(180)
    });

    this.actorManager.addNew({
        classId: ActorFactory.ENEMYSPAWNER,
        positionX: 0,
        positionY: -573,
        angle: Utils.degToRad(0)
    });

    this.actorManager.addNew({
        classId: ActorFactory.ENEMYSPAWNER,
        positionX: -352,
        positionY: -573,
        angle: Utils.degToRad(0)
    });
};

GameScene.prototype.update = function () {
    this.timer++;

    if (this.timer % 180 === 0) {
        this.checkGameEndCondition();
    }
};

GameScene.prototype.addMapBodies = function (mapBodies) {
    for (var i = 0; i < mapBodies.length; i++) {
        this.world.addBody(mapBodies[i]);
    }
    this.emit({ type: 'newMapBodies' });
};

GameScene.prototype.checkGameEndCondition = function () {
    if (this.world.countEnemies() === 0) {
        this.emit({ type: 'gameFinished' });
    }
};

module.exports = GameScene;

},{"logic/actor/component/body/BaseBody":14,"shared/ActorFactory":69}],5:[function(require,module,exports){
'use strict';

function GameWorld(config) {
    p2.World.apply(this, arguments);

    this.transferArray = new Float32Array(Constants.STORAGE_SIZE * 5); //this holds transfer data for all actors, needs to be ultra-fast
    this.deadTransferArray = []; //amount of dying actors per cycle is minscule; it is more efficient to use standard array here

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

/*
    This function makes update data for existing actors,
    but for dead actors it has it pre-done.
    This is because dying actors fill the array during the cycle.
    The format is otherwise identical.
*/
GameWorld.prototype.makeUpdateData = function () {
    var transferArray = this.transferArray;
    var transferrableActorCount = 0;

    for (var i = 0, l = this.bodies.length; i < l; i++) {
        var body = this.bodies[i];
        if (body.actor) {
            transferArray[transferrableActorCount * 5] = body.actorId;
            transferArray[transferrableActorCount * 5 + 1] = body.classId;
            transferArray[transferrableActorCount * 5 + 2] = body.position[0];
            transferArray[transferrableActorCount * 5 + 3] = body.position[1];
            transferArray[transferrableActorCount * 5 + 4] = body.angle;
            transferrableActorCount++;
            body.update();
        }
    }

    return {
        actorCount: transferrableActorCount,
        transferArray: this.transferArray,
        deadActorCount: this.deadTransferArray.length / 5,
        deadTransferArray: this.deadTransferArray
    };
};

GameWorld.prototype.onCollision = function (collisionEvent) {
    var relativeContactPointB = collisionEvent.contactEquation.contactPointB;
    var relativeContactPointA = collisionEvent.contactEquation.contactPointA;
    var definiteContactPointB = [relativeContactPointB[0] + collisionEvent.bodyB.position[0], relativeContactPointB[1] + collisionEvent.bodyB.position[1]];
    var definiteContactPointA = [relativeContactPointA[0] + collisionEvent.bodyA.position[0], relativeContactPointA[1] + collisionEvent.bodyA.position[1]];

    collisionEvent.bodyA.onCollision(collisionEvent.bodyB, definiteContactPointB);
    collisionEvent.bodyB.onCollision(collisionEvent.bodyA, definiteContactPointA);
};

GameWorld.prototype.countEnemies = function () {
    var enemies = 0;
    for (var i = 0; i < this.bodies.length; i++) {
        var body = this.bodies[i];
        if (body.actor && body.shape.collisionGroup === Constants.COLLISION_GROUPS.ENEMY) {
            enemies++;
        }
    }
    return enemies;
};

GameWorld.prototype.prepareBodyForDeath = function (body) {
    var deadTransferArray = this.deadTransferArray;
    var currentDeadsLength = deadTransferArray.length / 5; //because there are 5 properties in one-dimensional array

    deadTransferArray[currentDeadsLength * 5] = body.actorId;
    deadTransferArray[currentDeadsLength * 5 + 1] = -1;
    deadTransferArray[currentDeadsLength * 5 + 2] = body.position[0];
    deadTransferArray[currentDeadsLength * 5 + 3] = body.position[1];
    deadTransferArray[currentDeadsLength * 5 + 4] = body.angle;

    this.removeBody(body);
};

GameWorld.prototype.cleanDeadActors = function () {
    this.deadTransferArray = [];
};

module.exports = GameWorld;

},{}],6:[function(require,module,exports){
"use strict";

var WorkerBus = require("shared/WorkerBus");

function RenderBus(config) {
    WorkerBus.apply(this, arguments);
}

RenderBus.extend(WorkerBus);

module.exports = WorkerBus;

},{"shared/WorkerBus":73}],7:[function(require,module,exports){
'use strict';

function WorldAiMapExtractor(config) {
    config = config || {};
    if (!config.world) throw new Error('No world specified for WorldAiMapExtractor');

    Object.assign(this, config);
}

WorldAiMapExtractor.prototype.getTerrainBodies = function () {
    var wallBodies = [];
    for (var i = 0; i < this.world.bodies.length; i++) {
        var body = this.world.bodies[i];
        if (Array.isArray(body.shape)) {
            wallBodies = wallBodies.concat(this.extractShapes(body));
        } else {
            wallBodies.push(this.extractSingleShape(body));
        }
    }
    return wallBodies;
};

WorldAiMapExtractor.prototype.extractSingleShape = function (body) {
    if (body.shape.collisionGroup === Constants.COLLISION_GROUPS.TERRAIN) {
        switch (body.shape.constructor.name) {
            case 'Box':
                return {
                    class: body.shape.constructor.name,
                    angle: body.angle,
                    height: body.shape.height,
                    width: body.shape.width,
                    position: body.position
                };
            case 'Convex':
                return {
                    class: body.shape.constructor.name,
                    vertices: body.shape.vertices,
                    position: body.position
                };
        }
    }
};

WorldAiMapExtractor.prototype.extractShapes = function (body) {
    var wallBodies = [];
    for (var i = 0, l = body.shape.length; i < l; i++) {
        var shape = body.shape[i];
        if (shape.collisionGroup === Constants.COLLISION_GROUPS.TERRAIN) {
            var position = [body.position[0] + shape.position[0], body.position[1] + shape.position[1]];
            switch (shape.constructor.name) {
                case 'Box':
                    wallBodies.push({
                        class: shape.constructor.name,
                        angle: body.angle,
                        height: shape.height,
                        width: shape.width,
                        position: position
                    });
                    break;
                case 'Convex':
                    wallBodies.push({
                        class: shape.constructor.name,
                        angle: body.angle,
                        vertices: shape.vertices,
                        position: position
                    });
                    break;
            }
        }
    }
    return wallBodies;
};

module.exports = WorldAiMapExtractor;

},{}],8:[function(require,module,exports){
'use strict';

var ActorFactory = require("shared/ActorFactory")('logic');

function ActorManager(config) {
    config = config || {};
    this.storage = Object.create(null);
    this.world = null;
    this.factory = config.factory || ActorFactory.getInstance();
    this.currentId = 1;
    this.playerActors = [];
    this.aiImage = null;
    this.aiGraph = {};

    this.actorStatesChanged = {};

    this.enemiesKilled = 0;

    Object.assign(this, config);

    this.timer = 0;

    if (!this.world) throw new Error('No world for Logic ActorManager!');

    EventEmitter.apply(this, arguments);
}

ActorManager.extend(EventEmitter);

ActorManager.prototype.addNew = function (config) {
    if (Object.keys(this.storage).length >= Constants.STORAGE_SIZE) {
        console.warn('Actor manager storage is full! Cannot create new Actor!');
        return;
    }

    var actor = this.factory.create(Object.assign(config, {
        manager: this,
        world: this.world,
        id: this.currentId
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
    this.timer++;

    for (var i = 0; i < this.playerActors.length; i++) {
        if (this.storage[this.playerActors[i]]) {
            this.storage[this.playerActors[i]].playerUpdate(inputState);
        }
    }

    for (var actorId in this.storage) {
        this.storage[actorId].update();
    }

    this.sendActorStateChanges();
};

ActorManager.prototype.attachPlayer = function (actor) {
    this.playerActors.push(actor.id);
};

ActorManager.prototype.removeActorAt = function (actorId) {
    delete this.storage[actorId];
};

ActorManager.prototype.actorDied = function (actor) {
    delete this.storage[actor.body.actorId];
    this.world.prepareBodyForDeath(actor.body);
};

ActorManager.prototype.endGame = function () {
    setTimeout(function () {
        this.muteSounds = true;
    }.bind(this), 3000);
    this.emit({
        type: 'playerDied',
        data: this.enemiesKilled
    });
};

ActorManager.prototype.getFirstPlayerActor = function () {
    //wyleci
    return this.storage[this.playerActors[0]];
};

ActorManager.prototype.notifyOfActorChangedState = function (actorId, newState) {
    this.actorStatesChanged[actorId] = newState;
};

ActorManager.prototype.sendActorStateChanges = function () {
    if (Object.keys(this.actorStatesChanged).length > 0) {
        this.emit({
            type: 'actorStateChange',
            data: this.actorStatesChanged
        });
        this.actorStatesChanged = {};
    }
};

ActorManager.prototype.playSound = function (config) {
    if (!this.muteSounds) {
        var volume = config.volume || 1;
        var playerActor = this.getFirstPlayerActor();
        var distance = config.actor && playerActor ? Utils.distanceBetweenPoints(playerActor.body.position[0], config.actor.body.position[0], playerActor.body.position[1], config.actor.body.position[1]) : 0;
        this.emit({
            type: 'playSound',
            data: {
                sounds: config.sounds,
                distance: distance,
                volume: volume
            }
        });
    }
};

ActorManager.prototype.switchPlayerWeapon = function (weaponConfig) {
    //wyleci
    var playerActor = this.getFirstPlayerActor();
    if (playerActor) {
        playerActor.switchWeapon(weaponConfig);
    }
};

module.exports = ActorManager;

},{"shared/ActorFactory":69}],9:[function(require,module,exports){
"use strict";

var ActorFactory = require("shared/ActorFactory")('logic');
var BaseStateChangeHandler = require("logic/actor/component/stateChangeHandler/BaseStateChangeHandler");

function BaseActor(config) {
    Object.assign(this, config);

    this.body = this.createBody();
    if (!this.body) throw new Error('No body defined for Logic Actor!');

    this.body.position = [this.positionX || 0, this.positionY || 0];
    this.body.angle = this.angle || 0;
    this.body.actor = this;
    this.body.velocity = Utils.angleToVector(this.angle, this.velocity || 0);

    this.thrust = 0;
    this.horizontalThrust = 0;
    this.angleForce = 0;

    this.timer = 0;
    this.id = this.id || config.id;

    this.props = this.props || {};

    this.stateChangeHandler = this.createStateHandler();

    if (this.props.isPlayer) {
        this.manager.attachPlayer(this);
    }
}

BaseActor.prototype.applyConfig = function (config) {
    for (var property in config) {
        this[property] = this[property] || config[property];
    }
};

BaseActor.prototype.createBody = function () {
    return null;
};

BaseActor.prototype.createStateHandler = function () {
    return new BaseStateChangeHandler({ actor: this, initialState: Object.assign({}, this.props) });
};

BaseActor.prototype.update = function () {
    this.timer++;
    if (this.timer > this.props.timeout) {
        this.deathMain();
    }
    this.customUpdate();
    this.processMovement();
};

BaseActor.prototype.onCollision = function (otherActor, relativeContactPoint) {
    this.stateChangeHandler.onCollision(otherActor, relativeContactPoint);
};

BaseActor.prototype.notifyManagerOfStateChange = function (newState) {
    this.manager.notifyOfActorChangedState(this.id, newState);
};

BaseActor.prototype.remove = function () {
    this.manager.removeActorAt(this.id);
};

BaseActor.prototype.customUpdate = function () {};

BaseActor.prototype.playerUpdate = function () {};

BaseActor.prototype.onHit = function () {};

BaseActor.prototype.onSpawn = function () {};

BaseActor.prototype.onDeath = function () {};

BaseActor.prototype.deathMain = function (relativeContactPoint) {
    if (this.props.collisionFixesPosition) {
        this.body.position = relativeContactPoint;
    }
    this.manager.actorDied(this);
    this.onDeath();
};

BaseActor.prototype.processMovement = function () {
    if (this.angleForce !== 0) {
        this.body.angularVelocity = this.angleForce * this.props.turnSpeed;
    } else {
        this.body.angularVelocity = 0;
    }

    if (this.thrust !== 0) {
        this.body.applyForceLocal([0, this.thrust * this.props.acceleration]);
    }

    if (this.horizontalThrust !== 0) {
        this.body.applyForceLocal([this.horizontalThrust * this.props.acceleration, 0]);
    }
};

BaseActor.prototype.drawDebug = function (position) {
    this.manager.addNew({
        classId: ActorFactory.DEBUG,
        positionX: position[0],
        positionY: position[1],
        angle: 0,
        velocity: 0
    });
};

module.exports = BaseActor;

},{"logic/actor/component/stateChangeHandler/BaseStateChangeHandler":15,"shared/ActorFactory":69}],10:[function(require,module,exports){
"use strict";

var BaseActor = require("logic/actor/BaseActor");
var BaseBody = require("logic/actor/component/body/BaseBody");

function DebugActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.applyConfig({
        // timeout: config.timeout || 5
    });
}

DebugActor.extend(BaseActor);

DebugActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Circle({
            radius: 0
        }),
        actor: this,
        mass: 0
    });
};

DebugActor.prototype.onSpawn = function () {
    // this.angleForce = Utils.rand(-15,15);
};

module.exports = DebugActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":14}],11:[function(require,module,exports){
"use strict";

var PlasmaGun = require("logic/actor/component/weapon/PlasmaGun");
var Blaster = require("logic/actor/component/weapon/Blaster");
var PulseWaveGun = require("logic/actor/component/weapon/PulseWaveGun");

function WeaponSystem(config) {
    Object.assign(this, config);

    this.weapons = {
        'plasmagun': this.createPlasma(),
        'lasgun': this.createBlaster(),
        'pulsewavegun': this.createPulseWave()
    };

    if (!this.currentWeapon) {
        this.switchWeaponByIndex(0);
    }

    if (!this.actor) throw new Error('No actor for Logic WeaponSystem!');
}

WeaponSystem.prototype.shoot = function () {
    if (this.weapons[this.currentWeapon]) {
        this.weapons[this.currentWeapon].shoot();
    }
};

WeaponSystem.prototype.stopShooting = function () {
    if (this.weapons[this.currentWeapon]) {
        this.weapons[this.currentWeapon].stopShooting();
    }
};

WeaponSystem.prototype.switchWeapon = function (weaponName) {
    if (this.weapons[weaponName]) {
        this.currentWeapon = weaponName;
        this.actor.manager.playSound({ sounds: ['cannon_change'], actor: this.actor, volume: 1 });
    } else {
        console.warn('This weapon system has no such weapon: ', weaponName);
    }
};

WeaponSystem.prototype.switchWeaponByIndex = function (weaponIndex) {
    var weaponNames = Object.keys(this.weapons);
    if (weaponIndex >= 0 && weaponIndex < weaponNames.length) {
        var weaponName = weaponNames[weaponIndex];
        this.currentWeapon = weaponName;
    } else {
        console.warn('This weapon system has no weapon of index: ', weaponIndex);
    }
};

WeaponSystem.prototype.update = function () {
    if (this.weapons[this.currentWeapon]) {
        this.weapons[this.currentWeapon].update();
    }
};

WeaponSystem.prototype.createBlaster = function () {
    return new Blaster({
        actor: this.actor,
        firingPoints: this.firingPoints
    });
};

WeaponSystem.prototype.createPlasma = function () {
    return new PlasmaGun({
        actor: this.actor,
        firingPoints: this.firingPoints
    });
};

WeaponSystem.prototype.createPulseWave = function () {
    return new PulseWaveGun({
        actor: this.actor,
        firingPoints: this.firingPoints
    });
};

module.exports = WeaponSystem;

},{"logic/actor/component/weapon/Blaster":17,"logic/actor/component/weapon/PlasmaGun":19,"logic/actor/component/weapon/PulseWaveGun":20}],12:[function(require,module,exports){
'use strict';

function BaseBrain(config) {
    config = config || [];

    Object.assign(this, config);

    if (!this.actor) throw new Error('No actor for a Brain!');
    if (!this.manager) throw new Error('No manager for a Brain!');

    this.orders = {
        thrust: 0, //backward < 0; forward > 0
        horizontalThrust: 0, //left < 0; right > 0
        turn: 0, //left < 0; right > 0
        shoot: false,
        lookAtPosition: null
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

},{}],13:[function(require,module,exports){
'use strict';

var BaseBrain = require("logic/actor/component/ai/BaseBrain");

function MookBrain(config) {

    config.shootingArc = config.shootingArc || 15;
    config.nearDistance = config.nearDistance || 40;
    config.farDistance = config.farDistance || 90;
    config.firingDistance = config.firingDistance || 200;

    Object.assign(this, config);
    BaseBrain.apply(this, arguments);

    this.timer = 0;
    this.activationTime = Utils.rand(100, 150);

    this.preferredTurn = 1;
    this.createWallDetectionParameters();

    this.gotoPoint = null;
}

MookBrain.extend(BaseBrain);

MookBrain.prototype.createWallDetectionParameters = function () {
    this.wallDetectionDistances = new Uint16Array([10]);

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
    if (this.playerActor && this.playerActor.body) {
        this.timer++;

        if (this.timer % 30 === 0) {
            this.preferredTurn *= -1;
        }

        var nearbyWalls = this.detectNearbyWallsFast();

        if (this.isWallBetween(this.actor.body.position, this.playerActor.body.position)) {
            if (this.gotoPoint) {
                if (!this.isWallBetween(this.actor.body.position, this.gotoPoint)) {
                    this.seesGotoPointAction(nearbyWalls);
                } else {
                    this.gotoPoint = null;
                    this.freeRoamActon(nearbyWalls);
                }
            } else {
                this.freeRoamActon(nearbyWalls);
            }
        } else {
            this.seesPlayerAction();
        }

        this.avoidWalls(nearbyWalls);
    }
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
    for (var _i = 0; _i < this.wallDetectionAngleIndexesRear.length; _i++) {
        if (this.detectionResults[this.wallDetectionAngleIndexesRear[_i]] === 1) {
            directions.rear = true;
            break;
        }
    }
    for (var _i2 = 0; _i2 < this.wallDetectionAngleIndexesLeft.length; _i2++) {
        if (this.detectionResults[this.wallDetectionAngleIndexesLeft[_i2]] === 1) {
            directions.left = true;
            break;
        }
    }
    for (var _i3 = 0; _i3 < this.wallDetectionAngleIndexesRight.length; _i3++) {
        if (this.detectionResults[this.wallDetectionAngleIndexesRight[_i3]] === 1) {
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
    this.orders.lookAtPosition = this.getPlayerPositionWithLead(this.actor.weapon.velocity, 1);
    this.gotoPoint = [this.playerActor.body.position[0], this.playerActor.body.position[1]];
    var distance = Utils.distanceBetweenPoints(this.actor.body.position[0], this.playerActor.body.position[0], this.actor.body.position[1], this.playerActor.body.position[1]);

    this.orders.thrust = 0;
    if (distance > this.farDistance) {
        this.orders.thrust = 1;
    }
    if (distance < this.nearDistance) {
        this.orders.thrust = -1;
    }

    this.orders.turn = 0;

    if (distance < this.firingDistance) {
        this.shootAction(distance);
    }
    this.randomStrafeAction();
    this.playCalloutSound();
};

MookBrain.prototype.freeRoamActon = function (nearbyWalls) {
    this.orders.lookAtPosition = this.gotoPoint;
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

MookBrain.prototype.seesGotoPointAction = function (nearbyWalls) {
    this.orders.lookAtPosition = this.gotoPoint;
    this.orders.horizontalThrust = 0;
    this.orders.thrust = 1;
    this.orders.turn = 0;
    this.orders.shoot = false;

    var distance = Utils.distanceBetweenPoints(this.actor.body.position[0], this.gotoPoint[0], this.actor.body.position[1], this.gotoPoint[1]);

    if (distance < 20) {
        this.gotoPoint = null;
    }

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

    this.orders.shoot = Utils.pointInArc(this.actor.body.position, this.playerActor.body.position, this.actor.body.angle, this.shootingArc);
};

MookBrain.prototype.randomStrafeAction = function () {
    if (Utils.rand(0, 100) > 98) {
        this.orders.horizontalThrust = Utils.rand(0, 2) - 1;
    }
};

MookBrain.prototype.playCalloutSound = function () {
    if (this.actor.calloutSound) {
        if (Utils.rand(0, 150) === 0) {
            this.manager.playSound({ sounds: [this.actor.calloutSound], actor: this.actor });
        }
    }
};

module.exports = MookBrain;

},{"logic/actor/component/ai/BaseBrain":12}],14:[function(require,module,exports){
'use strict';

function BaseBody(config) {
    this.actorId = null;
    config.position = config.position || [0, 0];
    config.angle = Utils.degToRad(config.angle || 0);
    config.radius = config.radius || 0;
    config.height = config.height || 1;
    config.width = config.width || 1;
    Object.assign(this, config);

    p2.Body.call(this, config);

    this.shape = config.shape || this.createShape();
    this.initShape();
}

BaseBody.extend(p2.Body);

BaseBody.prototype.createShape = function () {
    switch (this.collisionType) {
        case 'playerProjectile':
            return new p2.Circle({
                radius: this.radius,
                collisionGroup: Constants.COLLISION_GROUPS.SHIPPROJECTILE,
                collisionMask: Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN
            });
        case 'enemyProjectile':
            return new p2.Circle({
                radius: this.radius,
                collisionGroup: Constants.COLLISION_GROUPS.ENEMYPROJECTILE,
                collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN
            });
        case 'playerShip':
            return new p2.Circle({
                radius: this.radius,
                collisionGroup: Constants.COLLISION_GROUPS.SHIP,
                collisionMask: Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.ENEMYEXPLOSION
            });
        case 'enemyShip':
            return new p2.Circle({
                radius: this.radius,
                collisionGroup: Constants.COLLISION_GROUPS.ENEMY,
                collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.SHIPEXPLOSION
            });
        case 'terrain':
            return new p2.Box({
                height: this.height,
                width: this.width,
                collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
                collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE
            });
        case 'terrain-convex':
            return new p2.Convex({
                vertices: this.vertices,
                collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
                collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE
            });
        default:
            throw new Error('No collisionType defined for default createShape in BaseBody!');
    }
};

BaseBody.prototype.initShape = function () {
    if (this.shape.length > 0) {
        for (var i = 0; i < this.shape.length; i++) {
            this.addShape(this.shape[i], this.shape[i].position);
        }
    } else {
        this.addShape(this.shape, this.shape.position);
    }
};

BaseBody.prototype.onCollision = function (otherBody, relativeContactPoint) {
    if (this.actor) {
        this.actor.onCollision(otherBody.actor, relativeContactPoint);
    }
};

BaseBody.prototype.update = function () {};

module.exports = BaseBody;

},{}],15:[function(require,module,exports){
"use strict";

// var BaseState = require("logic/actor/component/stateChangeHandler/state/BaseState");

function BaseStateChangeHandler(config) {
    config = config || {};
    Object.assign(this, config);
    this.actor = config.actor;
    this.initialState = config.initialState;
    this.state = config.state || config.initialState;
}

BaseStateChangeHandler.prototype.onCollision = function (otherActor, relativeContactPoint) {
    if (otherActor && this.state.hp != Infinity && otherActor.props.damage > 0) {
        this.state.hp -= otherActor.props.damage;
        this.actor.onHit();
    }

    if (this.state.hp <= 0 || this.actor.props.removeOnHit) {
        this.actor.deathMain(relativeContactPoint);
    }

    this.actor.notifyManagerOfStateChange(this.state);
};

module.exports = BaseStateChangeHandler;

},{}],16:[function(require,module,exports){
'use strict';

function BaseWeapon(config) {
    this.burstCount = 1;
    this.burstCooldown = 0;
    this.cooldown = 100;
    this.recoil = 0;
    this.velocity = 10;
    this.sound = null;

    /*example:
        this.firingPoints = [
            {offsetAngle: 90, offsetDistance:20, fireAngle: 0}
            {offsetAngle: +90, offsetDistance:20, fireAngle: 0}
        ]
        this.firingMode = 'alternate' | 'simultaneous'
        all properties are relative to actor's body; this example will create
        a weapon firing two shots forward from side mounts.
    */

    this.firingPoints = [];
    this.firingMode = 'simultaneous';
    this.currentFiringPoint = 0;

    Object.assign(this, config);

    this.timer = 0;
    this.shooting = false;
    this.shotsFired = 0;

    if (!this.projectileClass) throw new Error('No projectile class for a Weapon!');
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
    switch (this.firingMode) {
        case 'alternate':
            this.handleFiringAlternate();
            break;
        default:
            this.handleFiringSimultaneous();
    }
    this.shotsFired++;
    if (this.shotsFired >= this.burstCount) {
        this.shotsFired = 0;
        this.timer += this.cooldown;
    }
};

BaseWeapon.prototype.fireProjectile = function (firingPointConfig) {
    var body = this.actor.body;
    var offsetPosition = Utils.angleToVector(body.angle + Utils.degToRad(firingPointConfig.offsetAngle), firingPointConfig.offsetDistance);
    this.actor.manager.addNew({
        classId: this.projectileClass,
        positionX: body.position[0] + offsetPosition[0],
        positionY: body.position[1] + offsetPosition[1],
        angle: body.angle + firingPointConfig.fireAngle,
        velocity: this.velocity
    });
};

BaseWeapon.prototype.handleFiringSimultaneous = function () {
    this.firingPoints.forEach(this.fireProjectile.bind(this));
    this.timer += this.burstCooldown;
    this.actor.body.applyForceLocal([0, -this.recoil]);

    if (this.sound) {
        this.actor.manager.playSound({ sounds: [this.sound], actor: this.actor, volume: this.volume });
    }
};

BaseWeapon.prototype.handleFiringAlternate = function () {
    this.currentFiringPoint++;
    if (this.currentFiringPoint >= this.firingPoints.length) {
        this.currentFiringPoint = 0;
    }

    this.fireProjectile(this.firingPoints[this.currentFiringPoint]);
    this.timer += this.burstCooldown;
    this.actor.body.applyForceLocal([0, -this.recoil]);

    if (this.sound) {
        this.actor.manager.playSound({ sounds: [this.sound], actor: this.actor, volume: this.volume });
    }
};

module.exports = BaseWeapon;

},{}],17:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function Blaster(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.LASERPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 28;
    this.velocity = 1500;
    this.burstCount = 4;
    this.burstCooldown = 4;
    this.sound = 'blue_laser';
    this.firingMode = 'alternate';
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":69}],18:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function MoltenBallThrower(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.MOLTENPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.burstCount = 2;
    this.burstCooldown = 5;
    this.cooldown = 60;
    this.recoil = 100;
    this.velocity = 160;
    this.sound = 'molten';
    this.volume = 0.4;
}

MoltenBallThrower.extend(BaseWeapon);

module.exports = MoltenBallThrower;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":69}],19:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function PlasmaGun(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.PLASMAPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 14;
    this.velocity = 230;
    this.sound = 'plasmashot3';
    this.volume = 0.5;
}

PlasmaGun.extend(BaseWeapon);

module.exports = PlasmaGun;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":69}],20:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function PlasmaGun(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.PULSEWAVEPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 5;
    this.velocity = 460;
    this.sound = 'laser_charged';
    this.firingMode = 'alternate';
    this.volume = 0.5;
}

PlasmaGun.extend(BaseWeapon);

module.exports = PlasmaGun;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":69}],21:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function Blaster(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.REDLASERPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 150;
    this.velocity = 550;
    this.burstCount = 1;
    this.burstCooldown = 20;
    this.sound = 'laser_purple';
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":69}],22:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function Blaster(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.REDLASERPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.burstCount = 5;
    this.burstCooldown = 12;
    this.cooldown = 100;
    this.velocity = 700;
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":69}],23:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function RingBlaster(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.RINGPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 80;
    this.velocity = 130;
    this.sound = 'laser_charged';
}

RingBlaster.extend(BaseWeapon);

module.exports = RingBlaster;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":69}],24:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var MookBrain = require("logic/actor/component/ai/MookBrain");
var MoltenBallThrower = require("logic/actor/component/weapon/MoltenBallThrower");
var RedBlaster = require("logic/actor/component/weapon/RedBlaster");
var ActorFactory = require("shared/ActorFactory")('logic');

function MookActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        acceleration: 140,
        turnSpeed: 2,
        hp: 6,
        bodyConfig: {
            actor: this,
            mass: 4,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 5,
            collisionType: 'enemyShip'
        }
    });

    this.calloutSound = 'drone';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    BaseActor.apply(this, arguments);
}

MookActor.extend(BaseActor);

MookActor.prototype.createBrain = function () {
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        firingDistance: 140
    });
};

MookActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

MookActor.prototype.customUpdate = function () {
    if (this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

MookActor.prototype.doBrainOrders = function () {
    if (this.brain.orders.lookAtPosition) {
        this.lookAtPosition(this.brain.orders.lookAtPosition);
        if (this.brain.orders.turn !== 0) {
            this.angleForce = this.brain.orders.turn;
        }
    } else {
        this.angleForce = this.brain.orders.turn;
    }

    this.thrust = this.brain.orders.thrust;
    this.horizontalThrust = this.brain.orders.horizontalThrust;

    if (this.brain.orders.shoot) {
        this.weapon.shoot();
    } else {
        this.weapon.stopShooting();
    }
};

MookActor.prototype.lookAtPosition = function (position) {
    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle = Utils.angleBetweenPointsFromCenter(angleVector, [position[0] - this.body.position[0], position[1] - this.body.position[1]]);

    if (angle < 180 && angle > 0) {
        this.angleForce = Math.min(angle / this.stepAngle, 1) * -1;
    }

    if (angle >= 180 && angle < 360) {
        this.angleForce = Math.min((360 - angle) / this.stepAngle, 1);
    }
};

MookActor.prototype.createWeapon = function () {
    return new MoltenBallThrower({
        actor: this,
        manager: this.manager,
        firingMode: 'alternate',
        firingPoints: [{ offsetAngle: -90, offsetDistance: 3.5, fireAngle: 0 }, { offsetAngle: 90, offsetDistance: 3.5, fireAngle: 0 }]
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
    this.manager.enemiesKilled++;
    this.manager.playSound({ sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8'], actor: this, volume: 10 });
};

MookActor.prototype.onHit = function () {
    if (Utils.rand(0, 10) == 10) {
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(50, 100)
        });
    }
};

module.exports = MookActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/ai/MookBrain":13,"logic/actor/component/body/BaseBody":14,"logic/actor/component/weapon/MoltenBallThrower":18,"logic/actor/component/weapon/RedBlaster":21,"shared/ActorFactory":69}],25:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var MookActor = require("logic/actor/enemy/MookActor");
var MookBrain = require("logic/actor/component/ai/MookBrain");
var RedSuperBlaster = require("logic/actor/component/weapon/RedSuperBlaster");
var ActorFactory = require("shared/ActorFactory")('logic');

function MookBossActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        acceleration: 300,
        turnSpeed: 1.5,
        hp: 100,
        bodyConfig: {
            actor: this,
            mass: 8,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 10,
            collisionType: 'enemyShip'
        }
    });

    MookActor.apply(this, arguments);
}

MookBossActor.extend(MookActor);

MookBossActor.prototype.createWeapon = function () {
    return new RedSuperBlaster({
        actor: this,
        manager: this.manager,
        firingPoints: [{ offsetAngle: 90, offsetDistance: 4, fireAngle: 0 }, { offsetAngle: -90, offsetDistance: 4, fireAngle: 0 }]
    });
};

MookBossActor.prototype.onDeath = function () {
    for (var i = 0; i < 50; i++) {
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(20, 100)
        });
    }
    for (var _i = 0; _i < 5; _i++) {
        this.manager.addNew({
            classId: ActorFactory.BOOMCHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(0, 50)
        });
    }
    this.body.dead = true;
    this.manager.enemiesKilled++;
};

module.exports = MookBossActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/ai/MookBrain":13,"logic/actor/component/body/BaseBody":14,"logic/actor/component/weapon/RedSuperBlaster":22,"logic/actor/enemy/MookActor":24,"shared/ActorFactory":69}],26:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var MookBrain = require("logic/actor/component/ai/MookBrain");
var RingBlaster = require("logic/actor/component/weapon/RingBlaster");
var ActorFactory = require("shared/ActorFactory")('logic');

function OrbotActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        acceleration: 150,
        turnSpeed: 4,
        hp: 3,
        bodyConfig: {
            actor: this,
            mass: 2,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 2,
            collisionType: 'enemyShip'
        }
    });

    this.calloutSound = 'orbot';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    BaseActor.apply(this, arguments);
}

OrbotActor.extend(BaseActor);

OrbotActor.prototype.createBrain = function (config) {
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        shootingArc: 30,
        nearDistance: 10,
        farDistance: 30,
        firingDistance: 50
    });
};

OrbotActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

OrbotActor.prototype.customUpdate = function () {
    if (this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

OrbotActor.prototype.doBrainOrders = function () {
    if (this.brain.orders.lookAtPosition) {
        this.lookAtPosition(this.brain.orders.lookAtPosition);
        if (this.brain.orders.turn !== 0) {
            this.angleForce = this.brain.orders.turn;
        }
    } else {
        this.angleForce = this.brain.orders.turn;
    }

    this.thrust = this.brain.orders.thrust;
    this.horizontalThrust = this.brain.orders.horizontalThrust;

    if (this.brain.orders.shoot) {
        this.weapon.shoot();
    } else {
        this.weapon.stopShooting();
    }
};

OrbotActor.prototype.lookAtPosition = function (position) {
    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle = Utils.angleBetweenPointsFromCenter(angleVector, [position[0] - this.body.position[0], position[1] - this.body.position[1]]);

    if (angle < 180 && angle > 0) {
        this.angleForce = Math.min(angle / this.stepAngle, 1) * -1;
    }

    if (angle >= 180 && angle < 360) {
        this.angleForce = Math.min((360 - angle) / this.stepAngle, 1);
    }
};

OrbotActor.prototype.createWeapon = function () {
    return new RingBlaster({
        actor: this,
        manager: this.manager,
        firingPoints: [{ offsetAngle: 90, offsetDistance: 0.2, fireAngle: 0 }]
    });
};

OrbotActor.prototype.onDeath = function () {
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
    this.manager.enemiesKilled++;
    this.manager.playSound({ sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8'], actor: this, volume: 10 });
};

OrbotActor.prototype.onHit = function () {
    if (Utils.rand(0, 5) == 5) {
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(50, 100)
        });
    }
};

module.exports = OrbotActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/ai/MookBrain":13,"logic/actor/component/body/BaseBody":14,"logic/actor/component/weapon/RingBlaster":23,"shared/ActorFactory":69}],27:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var MookBrain = require("logic/actor/component/ai/MookBrain");
var RedBlaster = require("logic/actor/component/weapon/RedBlaster");
var ActorFactory = require("shared/ActorFactory")('logic');

function SniperActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        acceleration: 90,
        turnSpeed: 0.8,
        hp: 12,
        bodyConfig: {
            actor: this,
            mass: 8,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 4,
            collisionType: 'enemyShip'
        }
    });

    this.calloutSound = 'sniper';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    BaseActor.apply(this, arguments);
}

SniperActor.extend(BaseActor);

SniperActor.prototype.createBrain = function () {
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        shootingArc: 8,
        nearDistance: 200,
        farDistance: 300,
        firingDistance: 400
    });
};

SniperActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

SniperActor.prototype.customUpdate = function () {
    if (this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

SniperActor.prototype.doBrainOrders = function () {
    if (this.brain.orders.lookAtPosition) {
        this.lookAtPosition(this.brain.orders.lookAtPosition);
        if (this.brain.orders.turn !== 0) {
            this.angleForce = this.brain.orders.turn;
        }
    } else {
        this.angleForce = this.brain.orders.turn;
    }

    this.thrust = this.brain.orders.thrust;
    this.horizontalThrust = this.brain.orders.horizontalThrust;

    if (this.brain.orders.shoot) {
        this.weapon.shoot();
    } else {
        this.weapon.stopShooting();
    }
};

SniperActor.prototype.lookAtPosition = function (position) {
    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle = Utils.angleBetweenPointsFromCenter(angleVector, [position[0] - this.body.position[0], position[1] - this.body.position[1]]);

    if (angle < 180 && angle > 0) {
        this.angleForce = Math.min(angle / this.stepAngle, 1) * -1;
    }

    if (angle >= 180 && angle < 360) {
        this.angleForce = Math.min((360 - angle) / this.stepAngle, 1);
    }
};

SniperActor.prototype.createWeapon = function () {
    return new RedBlaster({
        actor: this,
        manager: this.manager,
        firingPoints: [{ offsetAngle: 10, offsetDistance: 5, fireAngle: 0 }]
    });
};

SniperActor.prototype.onDeath = function () {
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
    this.manager.enemiesKilled++;
    this.manager.playSound({ sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8'], actor: this, volume: 10 });
};

SniperActor.prototype.onHit = function () {
    if (Utils.rand(0, 10) == 10) {
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(50, 100)
        });
    }
};

module.exports = SniperActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/ai/MookBrain":13,"logic/actor/component/body/BaseBody":14,"logic/actor/component/weapon/RedBlaster":21,"shared/ActorFactory":69}],28:[function(require,module,exports){
"use strict";

var BaseActor = require("logic/actor/BaseActor");
var BaseBody = require("logic/actor/component/body/BaseBody");
var ActorFactory = require("shared/ActorFactory")('logic');

function EnemySpawnMarkerActor(config) {
    Object.assign(this, config);
    BaseActor.apply(this, arguments);

    this.bossSpawnRate = 180;
}

EnemySpawnMarkerActor.extend(BaseActor);

EnemySpawnMarkerActor.prototype.customUpdate = function () {
    if (this.timer >= 240) {
        this.deathMain();
        this.createEnemy();
    }
};

EnemySpawnMarkerActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Circle({
            radius: 1,
            collisionGroup: null,
            collisionMask: null
        })
    });
};

EnemySpawnMarkerActor.prototype.createEnemy = function () {
    var enemyType,
        mobsToSpawn = 1;

    var rand = Utils.rand(0, 10);

    if (rand < 6) {
        enemyType = ActorFactory.MOOK;
    } else if (rand >= 6 && rand < 10) {
        enemyType = ActorFactory.SNIPER;
    } else if (rand == 10) {
        enemyType = ActorFactory.ORBOT;
        mobsToSpawn = 2;
    }

    if (!this.created) {
        for (var i = 0; i < mobsToSpawn; i++) {
            this.manager.addNew({
                classId: enemyType,
                positionX: this.body.position[0] + Utils.rand(-1, 1) * mobsToSpawn - 1,
                positionY: this.body.position[1] + Utils.rand(-1, 1) * mobsToSpawn - 1,
                angle: Utils.rand(0, 360),
                velocity: Utils.rand(50, 100)
            });
        }
        this.created = true;
    }

    this.manager.playSound({ sounds: ['spawn'], actor: this, volume: 10 });
};

module.exports = EnemySpawnMarkerActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":14,"shared/ActorFactory":69}],29:[function(require,module,exports){
"use strict";

var BaseActor = require("logic/actor/BaseActor");
var BaseBody = require("logic/actor/component/body/BaseBody");
var ActorFactory = require("shared/ActorFactory")('logic');
var ActorConfig = require("shared/ActorConfig");

function EnemySpawnerActor(config) {

    this.applyConfig(ActorConfig.ENEMYSPAWNER);
    BaseActor.apply(this, arguments);
    Object.assign(this, config);
    this.spawnDelay = 0;
}

EnemySpawnerActor.extend(BaseActor);

EnemySpawnerActor.prototype.customUpdate = function () {
    if (this.spawnDelay > 0) {
        this.spawnDelay--;
    } else {
        if (Utils.rand(Math.min(this.timer / 60, this.props.spawnRate), this.props.spawnRate) === this.props.spawnRate) {
            // this.createEnemySpawnMarker();
        }
    }
};

EnemySpawnerActor.prototype.createEnemySpawnMarker = function () {
    this.spawnDelay = this.props.spawnRate;
    this.manager.addNew({
        classId: ActorFactory.ENEMYSPAWNMARKER,
        positionX: this.body.position[0],
        positionY: this.body.position[1],
        angle: 0,
        velocity: 0
    });
    this.sendActorEvent('newSpawnDelay', this.props.spawnRate);
};

EnemySpawnerActor.prototype.createBody = function () {
    return new BaseBody({
        shape: new p2.Circle({
            radius: 8,
            collisionGroup: Constants.COLLISION_GROUPS.ENEMY,
            collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIPEXPLOSION
        })
    });
};

EnemySpawnerActor.prototype.onDeath = function () {
    for (var i = 0; i < 40; i++) {
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(0, 150)
        });
    }
    for (var _i = 0; _i < 10; _i++) {
        this.manager.addNew({
            classId: ActorFactory.BOOMCHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(0, 50)
        });
    }
    this.body.dead = true;
};

EnemySpawnerActor.prototype.onHit = function () {
    if (Utils.rand(0, 5) == 5) {
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(50, 100)
        });
    }
};

module.exports = EnemySpawnerActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":14,"shared/ActorConfig":68,"shared/ActorFactory":69}],30:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function MapActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);
}

MapActor.extend(BaseActor);

MapActor.prototype.createBody = function () {
    return new BaseBody({
        shape: this.generateShapes(),
        actor: this,
        mass: 0
    });
};

MapActor.prototype.generateShapes = function () {
    var shapes = [];
    for (var i = 0; i < 100; i++) {
        var shape = new p2.Box({
            position: [Utils.rand(-1000, 1000), Utils.rand(-1000, 1000)],
            height: Utils.rand(0, 100),
            width: Utils.rand(0, 100),
            collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
            collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE
        });
        shapes.push(shape);
    }
    return shapes;
};

module.exports = MapActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":14}],31:[function(require,module,exports){
"use strict";

var ChunkActor = require("logic/actor/object/ChunkActor");
var ActorConfig = require("shared/ActorConfig");

function BoomChunkActor(config) {
    config = config || [];
    this.applyConfig(ActorConfig.BOOMCHUNK);
    ChunkActor.apply(this, arguments);
    Object.assign(this, config);
}

BoomChunkActor.extend(ChunkActor);

module.exports = BoomChunkActor;

},{"logic/actor/object/ChunkActor":32,"shared/ActorConfig":68}],32:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorConfig = require("shared/ActorConfig");

function ChunkActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.CHUNK);
    BaseActor.apply(this, arguments);
}

ChunkActor.extend(BaseActor);

ChunkActor.prototype.createBody = function () {
    return new BaseBody(Object.assign(this.bodyConfig, {
        shape: new p2.Circle({
            radius: 1,
            collisionGroup: Constants.COLLISION_GROUPS.OBJECT,
            collisionMask: Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.SHIPPROJECTILE
        })
    }));
};

ChunkActor.prototype.onSpawn = function () {
    this.angleForce = Utils.rand(-15, 15);
};

module.exports = ChunkActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":14,"shared/ActorConfig":68}],33:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseBrain = require("logic/actor/component/ai/BaseBrain");
var BaseActor = require("logic/actor/BaseActor");
var WeaponSystem = require("logic/actor/component/WeaponSystem");
var ActorFactory = require("shared/ActorFactory")('logic');
var ActorConfig = require("shared/ActorConfig");

function ShipActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.SHIP);

    this.hudModifier = 'shift';

    this.stepAngle = Utils.radToDeg(this.props.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    this.lastInputStateX = 0;
    this.lastInputStateY = 0;

    this.primaryWeaponSystem = this.createPrimaryWeaponSystem();
    this.secondaryWeaponSystem = this.createSecondaryWeaponSystem();

    this.primaryWeaponSystem.switchWeaponByIndex(0);
    this.secondaryWeaponSystem.switchWeaponByIndex(0);

    BaseActor.apply(this, arguments);
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

ShipActor.prototype.customUpdate = function () {
    this.primaryWeaponSystem.update();
    this.secondaryWeaponSystem.update();
};

ShipActor.prototype.playerUpdate = function (inputState) {
    if (inputState) {
        this.applyThrustInput(inputState);
        this.applyLookAtAngleInput(inputState);
        this.applyWeaponInput(inputState);
    }
};

ShipActor.prototype.applyLookAtAngleInput = function (inputState) {
    this.angleForce = 0;

    var lookTarget = Utils.angleToVector(inputState.mouseRotation, 1);
    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle = Utils.angleBetweenPointsFromCenter(angleVector, lookTarget);

    if (angle < 180 && angle > 0) {
        this.angleForce = Math.min(angle / this.stepAngle, 1) * -1;
    }

    if (angle >= 180 && angle < 360) {
        this.angleForce = Math.min((360 - angle) / this.stepAngle, 1);
    }

    if (inputState.q) {
        this.angleForce = 1;
    }

    if (inputState.e) {
        this.angleForce = -1;
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
    if (!inputState[this.hudModifier]) {
        if (inputState.mouseLeft) {
            this.primaryWeaponSystem.shoot();
        } else {
            this.primaryWeaponSystem.stopShooting();
        }

        if (inputState.mouseRight) {
            this.secondaryWeaponSystem.shoot();
        } else {
            this.secondaryWeaponSystem.stopShooting();
        }
    } else {
        this.primaryWeaponSystem.stopShooting();
        this.secondaryWeaponSystem.stopShooting();
    }
};

ShipActor.prototype.createPrimaryWeaponSystem = function () {
    return new WeaponSystem({
        actor: this,
        firingPoints: [{ offsetAngle: -50, offsetDistance: 4, fireAngle: 0 }, { offsetAngle: 50, offsetDistance: 4, fireAngle: 0 }]
    });
};

ShipActor.prototype.createSecondaryWeaponSystem = function () {
    return new WeaponSystem({
        actor: this,
        firingPoints: [{ offsetAngle: -40, offsetDistance: 8, fireAngle: 0 }, { offsetAngle: 40, offsetDistance: 8, fireAngle: 0 }]
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
    for (var _i = 0; _i < 5; _i++) {
        this.manager.addNew({
            classId: ActorFactory.BOOMCHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(0, 50)
        });
    }
    this.body.dead = true;
    this.manager.endGame();
    this.manager.playSound({ sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8'], actor: this });
};

ShipActor.prototype.onHit = function () {
    if (Utils.rand(8, 10) == 10) {
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(50, 100)
        });
    }
};

ShipActor.prototype.switchWeapon = function (weaponConfig) {
    switch (weaponConfig.index) {
        case 0:
            this.primaryWeaponSystem.switchWeapon(weaponConfig.weapon);
            break;
        case 1:
            this.secondaryWeaponSystem.switchWeapon(weaponConfig.weapon);
            break;
    }
};

module.exports = ShipActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/WeaponSystem":11,"logic/actor/component/ai/BaseBrain":12,"logic/actor/component/body/BaseBody":14,"shared/ActorConfig":68,"shared/ActorFactory":69}],34:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorConfig = require("shared/ActorConfig");

function LaserProjectileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.LASERPROJECTILE);
    BaseActor.apply(this, arguments);
}

LaserProjectileActor.extend(BaseActor);

LaserProjectileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

module.exports = LaserProjectileActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":14,"shared/ActorConfig":68}],35:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorConfig = require("shared/ActorConfig");

function MoltenProjectileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.MOLTENPROJECTILE);
    BaseActor.apply(this, arguments);
}

MoltenProjectileActor.extend(BaseActor);

MoltenProjectileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

module.exports = MoltenProjectileActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":14,"shared/ActorConfig":68}],36:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorConfig = require("shared/ActorConfig");

function PlasmaProjectileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PLASMAPROJECTILE);
    BaseActor.apply(this, arguments);
}

PlasmaProjectileActor.extend(BaseActor);

PlasmaProjectileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

module.exports = PlasmaProjectileActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":14,"shared/ActorConfig":68}],37:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorConfig = require("shared/ActorConfig");

function PulseWaveProjectileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PULSEWAVEPROJECTILE);
    BaseActor.apply(this, arguments);
}

PulseWaveProjectileActor.extend(BaseActor);

PulseWaveProjectileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

PulseWaveProjectileActor.prototype.customUpdate = function () {
    this.damage *= 0.97;
    this.body.updateMassProperties();
};

module.exports = PulseWaveProjectileActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":14,"shared/ActorConfig":68}],38:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorConfig = require("shared/ActorConfig");

function RedLaserProjectileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.REDLASERPROJECTILE);
    BaseActor.apply(this, arguments);
}

RedLaserProjectileActor.extend(BaseActor);

RedLaserProjectileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

module.exports = RedLaserProjectileActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":14,"shared/ActorConfig":68}],39:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorConfig = require("shared/ActorConfig");

function RingProjectileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.RINGPROJECTILE);
    BaseActor.apply(this, arguments);
}

RingProjectileActor.extend(BaseActor);

RingProjectileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

RingProjectileActor.prototype.customUpdate = function () {
    this.body.mass *= 0.96;
    this.damage *= 0.95;
    this.body.updateMassProperties();
};

module.exports = RingProjectileActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":14,"shared/ActorConfig":68}],40:[function(require,module,exports){
"use strict";

function MapAiGraphCreator(config) {
    this.graph = {};
    this.positions = {};
}

MapAiGraphCreator.prototype.createGraph = function () {};

MapAiGraphCreator.prototype.createPositions = function () {};

module.exports = MapAiGraphCreator;

},{}],41:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");

function MapChunk(config) {
    if (!config.hitmap) throw new Error("no hitmap specified for a MapChunk!");

    Object.assign(this, config);

    this.body = this.createBody();
}

MapChunk.prototype.createBody = function () {
    return new BaseBody({
        position: [0, 0],
        shape: this.createShapes(),
        mass: 0
    });
};

MapChunk.prototype.createShapes = function () {
    var multiShape = [];

    for (var i = 0, l = this.hitmap.length; i < l; i++) {
        multiShape.push(new p2.Convex({
            vertices: this.hitmap[i],
            collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
            collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE
        }));
    }

    return multiShape;
};

module.exports = MapChunk;

},{"logic/actor/component/body/BaseBody":14}],42:[function(require,module,exports){
'use strict';

function MapCreator(config) {
    EventEmitter.apply(this, arguments);
    this.chunkPrototypes = {};

    this.mapLayout = [];
}

MapCreator.extend(EventEmitter);

MapCreator.prototype.createMap = function () {
    if (Object.keys(this.chunkPrototypes).length === 0) throw new Error('Map createer has no chunks yet and is not ready!');

    this.mapLayout = [{
        name: 'chunk_HangarEndcap_1',
        position: [-1, 1],
        angle: 0
    }, {
        name: 'chunk_HangarEndcap_1',
        position: [0, 1],
        angle: 0
    }, {
        name: 'chunk_HangarStraight_SideSmall_1',
        position: [-1, 0],
        angle: 180
    }, {
        name: 'chunk_HangarStraight_SideSmall_1',
        position: [0, 0],
        angle: 0
    }, {
        name: 'chunk_HangarStraight_SideSmall_1',
        position: [-1, -1],
        angle: 180
    }, {
        name: 'chunk_HangarStraight_SideSmall_1',
        position: [0, -1],
        angle: 0
    }, {
        name: 'chunk_HangarEndcap_1',
        position: [-1, -2],
        angle: 180
    }, {
        name: 'chunk_HangarEndcap_1',
        position: [0, -2],
        angle: 180
    }];

    return this.mapLayout;
};

MapCreator.prototype.setPrototypeChunks = function (chunks) {
    this.chunkPrototypes = chunks;
};

module.exports = MapCreator;

},{}],43:[function(require,module,exports){
"use strict";

var MapChunk = require("logic/map/MapChunk");
var MapCreator = require("logic/map/MapCreator");
var MapAiGraphCreator = require("logic/map/MapAiGraphCreator");
var cloner = require("cloner");

function MapManager(config) {
    Object.assign(this, config);

    this.chunkPrototypes = {};
    this.mapBodies = [];
    this.mapCreator = new MapCreator();
    this.graphCreator = new MapAiGraphCreator();

    EventEmitter.bind(this, arguments);
}

MapManager.extend(EventEmitter);

MapManager.prototype.fixFaceVerticesOrder = function (hitmap) {
    return hitmap.map(function (face) {
        return face.reverse();
    });
};

MapManager.prototype.extractXZFromHitmap = function (hitmap) {
    return hitmap.map(function (face) {
        return face.map(function (vertex) {
            return [vertex[0], vertex[2]];
        });
    });
};

MapManager.prototype.loadChunkHitmaps = function (hitmaps) {
    for (var hitmapName in hitmaps) {
        this.chunkPrototypes[hitmapName] = new MapChunk({
            hitmap: this.fixFaceVerticesOrder(this.extractXZFromHitmap(hitmaps[hitmapName]))
        });
    }
    this.mapCreator.setPrototypeChunks(this.chunkPrototypes);
};

MapManager.prototype.createMap = function () {
    var mapLayout = this.mapCreator.createMap();
    var bodies = this.createBodiesFromLayout(mapLayout);
    var mapAiGraph = this.graphCreator.createGraph();
    this.emit({ type: 'mapDone', data: { bodies: bodies, layout: mapLayout, mapAiGraph: mapAiGraph } });
};

MapManager.prototype.createBodiesFromLayout = function (layout) {
    var _this = this;

    var bodies = [];

    layout.forEach(function (chunkConfig) {
        var newChunk = cloner.deep.copy(_this.chunkPrototypes[chunkConfig.name]);
        newChunk.body.position[0] = chunkConfig.position[0] * Constants.CHUNK_SIZE;
        newChunk.body.position[1] = chunkConfig.position[1] * Constants.CHUNK_SIZE;
        newChunk.body.angle = Utils.degToRad(chunkConfig.angle);
        bodies.push(newChunk.body);
    });

    return bodies;
};

module.exports = MapManager;

},{"cloner":1,"logic/map/MapAiGraphCreator":40,"logic/map/MapChunk":41,"logic/map/MapCreator":42}],44:[function(require,module,exports){
"use strict";

var BaseStateChangeHandler = require("renderer/actor/component/stateChangeHandler/BaseStateChangeHandler");

function BaseActor(config, actorDependencies) {
    Object.assign(this, actorDependencies);

    this.manager = config.manager;

    this.positionZ = 10;
    this.actorId = config.actorId;

    this.position = new Float32Array([config.positionX || 0, config.positionY || 0]);
    this.logicPosition = new Float32Array([this.position[0], this.position[1]]);
    this.logicPreviousPosition = new Float32Array([this.position[0], this.position[1]]);

    this.rotation = config.rotation || 0;
    this.logicRotation = this.rotation;
    this.logicPreviousRotation = this.rotation;

    this.updateFromLogic(config.positionX, config.positionY, config.rotation);

    this.meshes = this.createMeshes() || [];

    this.timer = 0;
    this.stateChangeHandler = this.createStateHandler();

    this.props = this.props || {};

    if (this.props.isPlayer) {
        this.manager.attachPlayer(this);
    }
}

BaseActor.prototype.applyConfig = function (config) {
    for (var property in config) {
        this[property] = this[property] || config[property];
    }
};

BaseActor.prototype.update = function (delta) {
    this.timer++;

    this.position[0] = this.logicPreviousPosition[0] + delta * (this.logicPosition[0] - this.logicPreviousPosition[0]);
    this.position[1] = this.logicPreviousPosition[1] + delta * (this.logicPosition[1] - this.logicPreviousPosition[1]);
    this.rotation = this.logicPreviousRotation + delta * (this.logicRotation - this.logicPreviousRotation);

    if (this.meshes) {
        for (var i = 0, l = this.meshes.length; i < l; i++) {
            this.meshes[i].update();
        }
    }

    this.customUpdate();
};

BaseActor.prototype.customUpdate = function () {};

BaseActor.prototype.updateFromLogic = function (positionX, positionY, rotation) {
    this.logicPreviousPosition[0] = this.logicPosition[0];
    this.logicPreviousPosition[1] = this.logicPosition[1];
    this.logicPreviousRotation = this.logicRotation;

    this.logicPosition[0] = positionX || 0;
    this.logicPosition[1] = positionY || 0;
    this.logicRotation = rotation || 0;
};

BaseActor.prototype.setPosition = function (positionX, positionY) {
    this.position[0] = positionX || 0;
    this.position[1] = positionY || 0;
};

BaseActor.prototype.createStateHandler = function () {
    return new BaseStateChangeHandler({ actor: this });
};

BaseActor.prototype.createMeshes = function () {
    return [];
};

BaseActor.prototype.handleStateChange = function (newState) {
    this.stateChangeHandler.update(newState);
};

BaseActor.prototype.addToScene = function (scene) {
    if (this.meshes) {
        for (var i = 0, l = this.meshes.length; i < l; i++) {
            scene.add(this.meshes[i]);
        }
    }
};

BaseActor.prototype.removeFromScene = function (scene) {
    if (this.meshes) {
        for (var i = 0, l = this.meshes.length; i < l; i++) {
            scene.remove(this.meshes[i]);
        }
    }
};

BaseActor.prototype.onDeath = function () {
    this.body.dead = this.props.removeOnHit;
    if (this.props.soundsOnDeath) {
        this.manager.playSound({ sounds: this.props.soundsOnDeath, actor: this });
    }
};

BaseActor.prototype.onSpawn = function () {};

module.exports = BaseActor;

},{"renderer/actor/component/stateChangeHandler/BaseStateChangeHandler":50}],45:[function(require,module,exports){
"use strict";

var BaseActor = require("renderer/actor/BaseActor");

function DebugActor() {
    BaseActor.apply(this, arguments);
}

DebugActor.extend(BaseActor);

DebugActor.prototype.customUpdate = function () {
    for (var i = 0, l = 100; i < l; i++) {
        this.particleManager.createParticle('particleNumberAdd', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 0,
            colorB: 1,
            scale: 5,
            alpha: 1,
            alphaMultiplier: 0.75,
            particleVelocity: 0,
            particleRotation: 0,
            lifeTime: 5,
            spriteNumber: Utils.rand(0, 10),
            speedZ: 1
        });
    }
};

module.exports = DebugActor;

},{"renderer/actor/BaseActor":44}],46:[function(require,module,exports){
'use strict';

function BaseMesh(config) {
    config.scaleX = config.scaleX || 1;
    config.scaleY = config.scaleY || 1;
    config.scaleZ = config.scaleZ || 1;

    config = config || {};

    THREE.Mesh.apply(this, [config.geometry, config.material]);
    this.rotationOffset = 0;
    this.positionZOffset = 0;
    this.positionOffset = [0, 0];

    Object.assign(this, config);

    this.scale.x = config.scaleX;
    this.scale.y = config.scaleY;
    this.scale.z = config.scaleZ;

    this.receiveShadow = typeof config.shadows === 'undefined' ? true : config.shadows;
    this.castShadow = typeof config.shadows === 'undefined' ? true : config.shadows;
}

BaseMesh.extend(THREE.Mesh);

BaseMesh.prototype.update = function () {
    if (this.actor) {
        var offsetVector = Utils.rotateVector(this.positionOffset[0], this.positionOffset[1], this.actor.rotation * -1);
        this.position.x = this.actor.position[0] + offsetVector[0];
        this.position.y = this.actor.position[1] + offsetVector[1];
        this.position.z = this.actor.positionZ + this.positionZOffset;
        this.rotation.z = this.actor.rotation + this.rotationOffset;
    }
};

module.exports = BaseMesh;

},{}],47:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function ChunkMesh(config) {
    BaseMesh.apply(this, arguments);
    this.rotationOffset = Math.PI;

    config = config || {};
    config.geometry = ModelStore.get('chunk').geometry;
    config.material = ModelStore.get('chunk').material;
    Object.assign(this, config);

    this.castShadow = true;
}

ChunkMesh.extend(BaseMesh);

module.exports = ChunkMesh;

},{"renderer/actor/component/mesh/BaseMesh":46,"renderer/assetManagement/model/ModelStore":67}],48:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function RavierMesh(config) {
    BaseMesh.apply(this, arguments);

    config = config || {};
    config.geometry = ModelStore.get('ravier_gunless').geometry;
    config.material = ModelStore.get('ravier').material;
    Object.assign(this, config);
}

RavierMesh.extend(BaseMesh);

module.exports = RavierMesh;

},{"renderer/actor/component/mesh/BaseMesh":46,"renderer/assetManagement/model/ModelStore":67}],49:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function ShipMesh(config) {
    BaseMesh.apply(this, arguments);
    this.rotationOffset = Math.PI;

    config = config || {};
    Object.assign(this, config);

    this.castShadow = true;
    this.receiveShadow = true;
}

ShipMesh.extend(BaseMesh);

module.exports = ShipMesh;

},{"renderer/actor/component/mesh/BaseMesh":46,"renderer/assetManagement/model/ModelStore":67}],50:[function(require,module,exports){
"use strict";

function BaseStateChangeHandler(config) {
    config = config || {};
    Object.assign(this, config);
    this.actor = config.actor;
    this.state = config.state || {};
}

BaseStateChangeHandler.prototype.update = function (newState) {
    this.state = newState;
    this.customUpdate();
};

BaseStateChangeHandler.prototype.customUpdate = function () {};

BaseStateChangeHandler.prototype.attachPlayer = function () {
    this.actor.attachPlayer();
};

module.exports = BaseStateChangeHandler;

},{}],51:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/ShipMesh");
var BaseActor = require("renderer/actor/BaseActor");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function MookActor() {
    BaseActor.apply(this, arguments);
    this.speedZ = Utils.rand(35, 45) / 1000;
    this.bobSpeed = Utils.rand(18, 22) / 10000;

    this.initialHp = 6;
    this.hp = 6;
}

MookActor.extend(BaseActor);

MookActor.prototype.createMeshes = function () {
    return [new BaseMesh({
        actor: this,
        scaleX: 1.2,
        scaleY: 1.2,
        scaleZ: 1.2,
        geometry: ModelStore.get('drone').geometry,
        material: ModelStore.get('drone').material
    })];
};

MookActor.prototype.customUpdate = function () {
    this.positionZ += this.speedZ;
    this.doBob();
    this.handleDamage();
    this.drawEyes();
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
    this.manager.requestUiFlash('white');
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

MookActor.prototype.drawEyes = function () {
    this.particleManager.createPremade('RedEye', {
        position: this.position,
        positionZ: this.positionZ - 8.7,
        rotation: this.rotation,
        rotationOffset: 15,
        distance: 3.5
    });
    this.particleManager.createPremade('RedEye', {
        position: this.position,
        positionZ: this.positionZ - 8.7,
        rotation: this.rotation,
        rotationOffset: 345,
        distance: 3.5
    });
};

MookActor.prototype.onHit = function () {
    if (Utils.rand(0, 5) == 5) {
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            rotation: Utils.rand(0, 360),
            velocity: Utils.rand(50, 100)
        });
    }
};

module.exports = MookActor;

},{"renderer/actor/BaseActor":44,"renderer/actor/component/mesh/ShipMesh":49,"renderer/assetManagement/model/ModelStore":67}],52:[function(require,module,exports){
"use strict";

var ShipMesh = require("renderer/actor/component/mesh/ShipMesh");
var MookActor = require("renderer/actor/enemy/MookActor");

function MookBossActor() {
    MookActor.apply(this, arguments);
    this.speedZ = Utils.rand(35, 45) / 1000;
    this.bobSpeed = Utils.rand(18, 22) / 10000;

    this.initialHp = 100;
    this.hp = 100;
    this.hpBarCount = 30;
}

MookBossActor.extend(MookActor);

MookBossActor.prototype.createMeshes = function () {
    return [new ShipMesh({ actor: this, scaleX: 2, scaleY: 2, scaleZ: 2 })];
};

module.exports = MookBossActor;

},{"renderer/actor/component/mesh/ShipMesh":49,"renderer/actor/enemy/MookActor":51}],53:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/ShipMesh");
var BaseActor = require("renderer/actor/BaseActor");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function OrbotActor() {
    BaseActor.apply(this, arguments);
    this.speedZ = Utils.rand(35, 45) / 1000;
    this.bobSpeed = Utils.rand(18, 22) / 10000;

    this.initialHp = 3;
    this.hp = 3;
}

OrbotActor.extend(BaseActor);

OrbotActor.prototype.createMeshes = function () {
    return [new BaseMesh({
        actor: this,
        scaleX: 1.3,
        scaleY: 1.3,
        scaleZ: 1.3,
        geometry: ModelStore.get('orbot').geometry,
        material: ModelStore.get('orbot').material
    })];
};

OrbotActor.prototype.customUpdate = function () {
    this.positionZ += this.speedZ;
    this.doBob();
    this.handleDamage();
    this.drawEyes();
};

OrbotActor.prototype.doBob = function () {
    if (this.positionZ > 10) {
        this.speedZ -= this.bobSpeed;
    } else {
        this.speedZ += this.bobSpeed;
    }
};

OrbotActor.prototype.onSpawn = function () {
    this.manager.newEnemy(this.actorId);
};

OrbotActor.prototype.onDeath = function () {
    this.manager.enemyDestroyed(this.actorId);
    this.particleManager.createPremade('OrangeBoomMedium', { position: this.position });
    this.manager.requestUiFlash('white');
};

OrbotActor.prototype.handleDamage = function () {
    var damageRandomValue = Utils.rand(0, 100) - 100 * (this.hp / this.initialHp);
    if (damageRandomValue > 20) {
        this.particleManager.createPremade('SmokePuffSmall', { position: this.position });
    }

    if (damageRandomValue > 50 && Utils.rand(0, 100) > 95) {
        this.particleManager.createPremade('BlueSparks', { position: this.position });
    }
};

OrbotActor.prototype.drawEyes = function () {
    if (this.timer % 20 === 0) {
        this.particleManager.createPremade('RedEyeBig', {
            position: this.position,
            positionZ: this.positionZ - 8.2,
            rotation: this.rotation,
            rotationOffset: 0,
            distance: 1.65
        });
    }
};

module.exports = OrbotActor;

},{"renderer/actor/BaseActor":44,"renderer/actor/component/mesh/ShipMesh":49,"renderer/assetManagement/model/ModelStore":67}],54:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/ShipMesh");
var BaseActor = require("renderer/actor/BaseActor");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function SniperActor() {
    BaseActor.apply(this, arguments);
    this.speedZ = Utils.rand(35, 45) / 1000;
    this.bobSpeed = Utils.rand(18, 22) / 10000;

    this.initialHp = 12;
    this.hp = 12;

    this.eyeRotation = 0;
    this.eyeSpeed = 3;
    this.eyeEdge = 50;
    this.eyeGoingRight = true;
}

SniperActor.extend(BaseActor);

SniperActor.prototype.createMeshes = function () {
    return [new BaseMesh({
        actor: this,
        scaleX: 1.9,
        scaleY: 1.9,
        scaleZ: 1.9,
        geometry: ModelStore.get('sniper').geometry,
        material: ModelStore.get('sniper').material
    })];
};

SniperActor.prototype.customUpdate = function () {
    this.positionZ += this.speedZ;
    this.doBob();
    this.handleDamage();
    this.drawEyes();
};

SniperActor.prototype.doBob = function () {
    if (this.positionZ > 10) {
        this.speedZ -= this.bobSpeed;
    } else {
        this.speedZ += this.bobSpeed;
    }
};

SniperActor.prototype.onSpawn = function () {
    this.manager.newEnemy(this.actorId);
};

SniperActor.prototype.onDeath = function () {
    this.manager.enemyDestroyed(this.actorId);
    this.particleManager.createPremade('OrangeBoomMedium', { position: this.position });
    this.manager.requestUiFlash('white');
};

SniperActor.prototype.handleDamage = function () {
    var damageRandomValue = Utils.rand(0, 100) - 100 * (this.hp / this.initialHp);
    if (damageRandomValue > 20) {
        this.particleManager.createPremade('SmokePuffSmall', { position: this.position });
    }

    if (damageRandomValue > 50 && Utils.rand(0, 100) > 95) {
        this.particleManager.createPremade('BlueSparks', { position: this.position });
    }
};

SniperActor.prototype.drawEyes = function () {
    if (this.eyeRotation > this.eyeEdge) {
        this.eyeGoingRight = false;
    }

    if (this.eyeRotation < -this.eyeEdge) {
        this.eyeGoingRight = true;
    }

    this.eyeRotation += this.eyeSpeed * (this.eyeGoingRight ? 1 : -1);

    this.particleManager.createPremade('PurpleEye', {
        position: this.position,
        positionZ: this.positionZ - 7.4,
        rotation: this.rotation,
        rotationOffset: this.eyeRotation,
        distance: 2.3
    });
};

SniperActor.prototype.onHit = function () {
    if (Utils.rand(0, 5) == 5) {
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            rotation: Utils.rand(0, 360),
            velocity: Utils.rand(50, 100)
        });
    }
};

module.exports = SniperActor;

},{"renderer/actor/BaseActor":44,"renderer/actor/component/mesh/ShipMesh":49,"renderer/assetManagement/model/ModelStore":67}],55:[function(require,module,exports){
'use strict';

var BaseActor = require("renderer/actor/BaseActor");

function EnemySpawnMarkerActor(config) {
    Object.apply(this, config);
    BaseActor.apply(this, arguments);
}

EnemySpawnMarkerActor.extend(BaseActor);

EnemySpawnMarkerActor.prototype.customUpdate = function () {
    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 0.5,
        colorG: 0.3,
        colorB: 1,
        scale: Utils.rand(this.timer / 5, this.timer / 5 + 20),
        alpha: this.timer / 480,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 2
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: Utils.rand(this.timer / 10, this.timer / 10 + 10),
        alpha: this.timer / 480,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 2
    });

    for (var i = 0; i < this.timer / 15; i++) {
        var rotation = Utils.rand(0, 360);
        var offsetPosition = Utils.rotationToVector(rotation, Utils.rand(20, 30));
        this.particleManager.createParticle('particleAdd', {
            positionX: this.position[0] + offsetPosition[0],
            positionY: this.position[1] + offsetPosition[1],
            colorR: 0.5,
            colorG: 0.3,
            colorB: 1,
            scale: 0.4 + this.timer / 300,
            alpha: 0.2,
            alphaMultiplier: 1.2,
            particleVelocity: -(Utils.rand(this.timer / 15, this.timer / 10) / 10),
            particleRotation: rotation,
            speedZ: Utils.rand(-40, 40) / 100,
            lifeTime: 12,
            spriteNumber: 2
        });
    }
};

EnemySpawnMarkerActor.prototype.onDeath = function () {
    var pointCount = 8;
    for (var i = 0; i < pointCount; i++) {
        this.particleManager.createParticle('particleAdd', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.3,
            colorB: 1,
            scale: 50,
            alpha: 0.25,
            alphaMultiplier: 0.7,
            particleVelocity: 2,
            particleRotation: 360 / pointCount * i,
            lifeTime: 5
        });

        this.particleManager.createParticle('particleAdd', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 50,
            alpha: 0.25,
            alphaMultiplier: 0.7,
            particleVelocity: 2,
            particleRotation: 360 / pointCount * i,
            lifeTime: 5
        });
    }
};

module.exports = EnemySpawnMarkerActor;

},{"renderer/actor/BaseActor":44}],56:[function(require,module,exports){
"use strict";

var BaseActor = require("renderer/actor/BaseActor");
var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function EnemySpawnerActor(config) {
    Object.apply(this, config);
    BaseActor.apply(this, arguments);

    this.bottomMesh = this.createBottomMesh();
    this.topMesh = this.createTopMesh();
    this.setupMeshes();

    this.rotationSpeed = 0;

    this.initialHp = 350;
    this.hp = 350;
    this.hpBarCount = 30;

    this.spawnDelay = 0;
}

EnemySpawnerActor.extend(BaseActor);

EnemySpawnerActor.prototype.onSpawn = function () {
    // this.manager.newEnemy(this.actorId);
};

EnemySpawnerActor.prototype.onDeath = function () {
    // this.manager.enemyDestroyed(this.actorId);

    var makeBoomRandomly = function makeBoomRandomly() {
        var position = [this.position[0] + Utils.rand(-5, 5), this.position[1] + Utils.rand(-5, 5)];
        this.particleManager.createPremade('OrangeBoomLarge', { position: position });
        this.manager.requestUiFlash('white');
    };

    for (var i = 0; i < 5; i++) {
        setTimeout(makeBoomRandomly.bind(this), Utils.rand(0, 40));
    }
};

EnemySpawnerActor.prototype.handleDamage = function (damageValue) {
    var damageRandomValue = Utils.rand(0, 100) - 100 * (this.hp / this.initialHp);
    var offsetPosition = Utils.rotationToVector(this.rotation, -12);
    var position = [this.position[0] + offsetPosition[0] + Utils.rand(-8, 8), this.position[1] + offsetPosition[1] + Utils.rand(-8, 8)];
    if (damageRandomValue > 20) {
        this.particleManager.createPremade('SmokePuffSmall', { position: position });
    }

    if (damageRandomValue > 50 && Utils.rand(0, 100) > 90) {
        this.particleManager.createPremade('BlueSparks', { position: position });
    }
};

EnemySpawnerActor.prototype.createBottomMesh = function () {
    return new BaseMesh({
        actor: this,
        scaleX: 3,
        scaleY: 3,
        scaleZ: 3,
        geometry: ModelStore.get('telering_bottom').geometry,
        material: ModelStore.get('telering_bottom').material.clone()
    });
};

EnemySpawnerActor.prototype.createTopMesh = function () {
    return new BaseMesh({
        actor: this,
        scaleX: 3,
        scaleY: 3,
        scaleZ: 3,
        geometry: ModelStore.get('telering_top').geometry,
        material: ModelStore.get('telering_top').material.clone()
    });
};

EnemySpawnerActor.prototype.setupMeshes = function () {
    this.bottomMesh.positionX = 10;
    this.topMesh.positionX = 10;
    this.bottomMesh.material.emissiveIntensity = 0;
    this.topMesh.material.emissiveIntensity = 0;
};

EnemySpawnerActor.prototype.update = function () {
    this.timer++;

    this.bottomMesh.update();
    this.topMesh.update();

    this.doChargingAnimation();

    // this.customUpdate();

    this.handleDamage();
};

EnemySpawnerActor.prototype.addToScene = function (scene) {
    scene.add(this.bottomMesh);
    scene.add(this.topMesh);
};

EnemySpawnerActor.prototype.removeFromScene = function (scene) {
    scene.remove(this.bottomMesh);
    scene.remove(this.topMesh);
};

EnemySpawnerActor.prototype.customHandleEvent = function (eventData) {
    if (eventData.newSpawnDelay) {
        this.spawnDelay = eventData.newSpawnDelay;
        this.maxSpawnDelay = eventData.newSpawnDelay;
    }
};

EnemySpawnerActor.prototype.doChargingAnimation = function () {
    if (this.spawnDelay > 0) {
        this.spawnDelay--;
        if (this.rotationSpeed < 0.2) {
            this.rotationSpeed += 0.0015;
        }
    } else {
        this.rotationSpeed *= 0.98;
    }
    var intensity = this.spawnDelay > 0 ? 1 - this.spawnDelay / this.maxSpawnDelay : 0;
    this.bottomMesh.material.emissiveIntensity = intensity;
    this.topMesh.material.emissiveIntensity = intensity;
    this.topMesh.rotation.y += this.rotationSpeed;
};

module.exports = EnemySpawnerActor;

},{"renderer/actor/BaseActor":44,"renderer/actor/component/mesh/BaseMesh":46,"renderer/assetManagement/model/ModelStore":67}],57:[function(require,module,exports){
"use strict";

var BaseActor = require("renderer/actor/BaseActor");

function MapActor() {
    BaseActor.apply(this, arguments);
}

MapActor.extend(BaseActor);

module.exports = MapActor;

},{"renderer/actor/BaseActor":44}],58:[function(require,module,exports){
'use strict';

var ChunkActor = require("renderer/actor/object/ChunkActor");

function BoomChunkActor() {
    ChunkActor.apply(this, arguments);
}

BoomChunkActor.extend(ChunkActor);

BoomChunkActor.prototype.onDeath = function () {
    this.particleManager.createPremade('OrangeBoomLarge', { position: this.position });
    this.manager.requestUiFlash('white');
};

module.exports = BoomChunkActor;

},{"renderer/actor/object/ChunkActor":59}],59:[function(require,module,exports){
"use strict";

var ChunkMesh = require("renderer/actor/component/mesh/ChunkMesh");
var BaseActor = require("renderer/actor/BaseActor");

function ChunkActor() {
    BaseActor.apply(this, arguments);
}

ChunkActor.extend(BaseActor);

ChunkActor.prototype.createMeshes = function () {
    return [new ChunkMesh({ actor: this, scaleX: Utils.rand(3, 15) / 10, scaleY: Utils.rand(3, 15) / 10, scaleZ: Utils.rand(3, 15) / 10 })];
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
            particleRotation: Utils.rand(0, 360),
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
            particleRotation: Utils.rand(0, 360),
            lifeTime: 60
        });
    }
};

module.exports = ChunkActor;

},{"renderer/actor/BaseActor":44,"renderer/actor/component/mesh/ChunkMesh":47}],60:[function(require,module,exports){
"use strict";

var RavierMesh = require("renderer/actor/component/mesh/RavierMesh");
var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");
var BaseActor = require("renderer/actor/BaseActor");
var ActorConfig = require("shared/ActorConfig");

function ShipActor() {
    this.applyConfig(ActorConfig.SHIP);
    BaseActor.apply(this, arguments);
    this.count = 0;

    this.speedZ = 0.04;
    this.speedY = 0.0025;
    this.speedX = 0.002;

    this.weaponSetLocations = [[[3, 0, 0], [-3, 0, 0]], [[5, 3.5, -2.2], [-5, 3.5, -2.2]]];

    this.setupWeaponMeshes(0, 'plasmagun', 'plasmagun');
    this.setupWeaponMeshes(1, 'plasmagun', 'plasmagun');
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMeshes = function () {
    this.shipMesh = new RavierMesh({ actor: this, scaleX: 3.3, scaleY: 3.3, scaleZ: 3.3 });
    return [this.shipMesh];
};

ShipActor.prototype.switchWeapon = function (changeConfig) {
    for (var i = 0, l = this.weaponSetLocations[changeConfig.index].length; i < l; i++) {
        var meshIndexLocation = l * changeConfig.index + i + 1; //zeroth is reserved for ship
        this.meshes[meshIndexLocation].geometry = ModelStore.get(changeConfig.weapon).geometry;
        this.meshes[meshIndexLocation].material = ModelStore.get(changeConfig.weapon).material;
    }
};

ShipActor.prototype.setupWeaponMeshes = function (slotNumber, geometryName, materialName, scales) {
    var defaultScale = 1;
    scales = scales || [];

    if (slotNumber >= this.weaponSetLocations.length) {
        throw new Error('This actor does not have a weapon slot of number', slotNumber);
    }

    for (var i = 0, l = this.weaponSetLocations[slotNumber].length; i < l; i++) {
        var meshIndexLocation = l * slotNumber + i + 1; //zeroth is reserved for ship
        this.meshes[meshIndexLocation] = new BaseMesh({
            actor: this,
            scaleX: scales[0] || defaultScale,
            scaleY: scales[1] || defaultScale,
            scaleZ: scales[2] || defaultScale,
            geometry: ModelStore.get(geometryName).geometry,
            material: ModelStore.get(materialName).material,
            rotationOffset: Utils.degToRad(-90),
            positionZOffset: this.weaponSetLocations[slotNumber][i][2],
            positionOffset: [this.weaponSetLocations[slotNumber][i][0], this.weaponSetLocations[slotNumber][i][1]]
        });
    }
};

ShipActor.prototype.customUpdate = function () {
    this.doEngineGlow();
    this.positionZ += this.speedZ;
    this.doBob();
    this.handleDamage();
};

ShipActor.prototype.doBank = function () {
    this.mesh.rotation.x += Utils.degToRad((this.logicPreviousRotation - this.rotation) * 50);
};

ShipActor.prototype.doBob = function () {

    if (this.positionZ > 10) {
        this.speedZ -= 0.002;
    } else {
        this.speedZ += 0.002;
    }
};

ShipActor.prototype.doEngineGlow = function () {
    if (this.inputListener) {
        if (this.inputListener.inputState.w && !this.inputListener.inputState.s) {
            this.particleManager.createPremade('EngineGlowMedium', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                rotation: this.rotation,
                rotationOffset: 15,
                distance: -5.8
            });
            this.particleManager.createPremade('EngineGlowMedium', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                rotation: this.rotation,
                rotationOffset: 345,
                distance: -5.8
            });
        }

        if (this.inputListener.inputState.a && !this.inputListener.inputState.d) {
            this.particleManager.createPremade('EngineGlowSmall', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                rotation: this.rotation,
                rotationOffset: 40,
                distance: -4
            });
            this.particleManager.createPremade('EngineGlowSmall', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                rotation: this.rotation,
                rotationOffset: 170,
                distance: -6
            });
        }

        if (this.inputListener.inputState.d) {
            this.particleManager.createPremade('EngineGlowSmall', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                rotation: this.rotation,
                rotationOffset: 320,
                distance: -4
            });
            this.particleManager.createPremade('EngineGlowSmall', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                rotation: this.rotation,
                rotationOffset: 190,
                distance: -6
            });
        }

        if (this.inputListener.inputState.s) {
            this.particleManager.createPremade('EngineGlowMedium', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                rotation: this.rotation,
                rotationOffset: 180,
                distance: -7
            });
        }
    }
};

ShipActor.prototype.onDeath = function () {
    this.particleManager.createPremade('OrangeBoomLarge', { position: this.position });
    this.dead = true;
    this.manager.requestUiFlash('white');
};

ShipActor.prototype.handleDamage = function () {
    if (this.hp < this.lastHp) {
        this.manager.requestUiFlash('red');
    }

    var damageRandomValue = Utils.rand(0, 100) - 100 * (this.hp / this.initialHp);
    if (damageRandomValue > 20) {
        this.particleManager.createPremade('SmokePuffSmall', { position: this.position });
    }

    if (damageRandomValue > 50 && Utils.rand(0, 100) > 95) {
        this.particleManager.createPremade('BlueSparks', { position: this.position });
    }

    this.lastHp = this.hp;
};

module.exports = ShipActor;

},{"renderer/actor/BaseActor":44,"renderer/actor/component/mesh/BaseMesh":46,"renderer/actor/component/mesh/RavierMesh":48,"renderer/assetManagement/model/ModelStore":67,"shared/ActorConfig":68}],61:[function(require,module,exports){
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
    this.particleManager.createPremade('BlueLaserTrail', { position: this.position, rotation: this.rotation });
};

LaserProjectileActor.prototype.onDeath = function () {
    var offsetPosition = Utils.rotationToVector(this.rotation, -3);
    this.particleManager.createPremade('BlueSparks', { position: [this.position[0] + offsetPosition[0], this.position[1] + offsetPosition[1]] });
};

LaserProjectileActor.prototype.onSpawn = function () {
    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 12,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleRotation: this.rotation,
        lifeTime: 3
    });
};

module.exports = LaserProjectileActor;

},{"renderer/actor/BaseActor":44}],62:[function(require,module,exports){
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
    this.particleManager.createPremade('OrangeTrail', { position: this.position, rotation: this.rotation });
};

MoltenProjectileActor.prototype.onDeath = function () {
    var offsetPosition = Utils.rotationToVector(this.rotation, -3);
    this.particleManager.createPremade('OrangeBoomTiny', { position: [this.position[0] + offsetPosition[0], this.position[1] + offsetPosition[1]] });
};

MoltenProjectileActor.prototype.onSpawn = function () {
    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 60,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 30,
        alpha: 0.6,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        particleRotation: this.rotation,
        lifeTime: 10
    });
};

module.exports = MoltenProjectileActor;

},{"renderer/actor/BaseActor":44}],63:[function(require,module,exports){
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
    this.particleManager.createPremade('GreenTrail', { position: this.position, rotation: this.rotation });
};

PlasmaProjectileActor.prototype.onDeath = function () {
    var offsetPosition = Utils.rotationToVector(this.rotation, -5);
    this.particleManager.createPremade('GreenBoomTiny', { position: [this.position[0] + offsetPosition[0], this.position[1] + offsetPosition[1]] });
};

PlasmaProjectileActor.prototype.onSpawn = function () {
    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 40,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 20,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        particleRotation: this.rotation,
        lifeTime: 10
    });
};

module.exports = PlasmaProjectileActor;

},{"renderer/actor/BaseActor":44}],64:[function(require,module,exports){
'use strict';

var BaseActor = require("renderer/actor/BaseActor");

function PulseWaveProjectileActor(config) {
    BaseActor.apply(this, arguments);
    this.colorR = 1;
    this.colorG = 1;
    this.colorB = 1;
}

PulseWaveProjectileActor.extend(BaseActor);

PulseWaveProjectileActor.prototype.customUpdate = function () {
    var offsetPositionZ, offsetPositionY;
    var ringSections = 36;
    var edgeOffset = ringSections / 2;

    for (var i = -ringSections / 2; i < ringSections / 2; i++) {
        offsetPositionZ = Utils.rotationToVector(Utils.degToRad(240 / ringSections * i) + this.rotation, 1 + this.timer / 3);
        this.particleManager.createParticle('particleAdd', {
            positionX: this.position[0] + offsetPositionZ[0],
            positionY: this.position[1] + offsetPositionZ[1],
            colorR: this.colorR,
            colorG: this.colorG,
            colorB: this.colorB,
            scale: 2 - 2 / edgeOffset * Math.abs(i),
            alpha: 2 - 2 / edgeOffset * Math.abs(i) - this.timer / 30,
            alphaMultiplier: 0.4,
            particleVelocity: 1,
            particleRotation: this.rotation,
            lifeTime: 2
        });
    }
};

PulseWaveProjectileActor.prototype.onDeath = function () {
    for (var i = 0; i < 15; i++) {
        this.particleManager.createParticle('particleAdd', {
            positionX: this.position[0] + Utils.rand(-4, 4),
            positionY: this.position[1] + Utils.rand(-4, 4),
            positionZ: Utils.rand(-5, 5),
            colorR: this.colorR,
            colorG: this.colorG,
            colorB: this.colorB,
            scale: Utils.rand(1, 40),
            alpha: Utils.rand(3, 10) / 10 - this.timer / 30,
            alphaMultiplier: 0.7,
            particleVelocity: 0,
            particleRotation: 0,
            lifeTime: 1
        });
    }

    for (var _i = 0; _i < 30 - this.timer * 3; _i++) {
        this.particleManager.createParticle('particleAdd', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2, 7) / 10,
            alpha: 1 - this.timer / 30,
            alphaMultiplier: 0.94,
            particleVelocity: Utils.rand(5, 15) / 10,
            particleRotation: Utils.rand(0, 360),
            speedZ: Utils.rand(-50, 50) / 100,
            lifeTime: Utils.rand(10, 20)
        });
    }
};

PulseWaveProjectileActor.prototype.onSpawn = function () {
    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 50,
        alpha: 1,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 30,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleRotation: this.rotation,
        lifeTime: 3
    });
};

module.exports = PulseWaveProjectileActor;

},{"renderer/actor/BaseActor":44}],65:[function(require,module,exports){
'use strict';

var BaseActor = require("renderer/actor/BaseActor");

function RedLaserProjectileActor(config) {
    BaseActor.apply(this, arguments);
    this.colorR = 1;
    this.colorG = 0.3;
    this.colorB = 1;
}

RedLaserProjectileActor.extend(BaseActor);

RedLaserProjectileActor.prototype.customUpdate = function () {
    this.particleManager.createPremade('PurpleLaserTrail', { position: this.position, rotation: this.rotation });
};

RedLaserProjectileActor.prototype.onDeath = function () {
    var offsetPosition = Utils.rotationToVector(this.rotation, -3);
    this.particleManager.createPremade('PurpleSparks', { position: [this.position[0] + offsetPosition[0], this.position[1] + offsetPosition[1]] });
};

RedLaserProjectileActor.prototype.onSpawn = function () {
    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 15,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleRotation: this.rotation,
        lifeTime: 3
    });
};

module.exports = RedLaserProjectileActor;

},{"renderer/actor/BaseActor":44}],66:[function(require,module,exports){
'use strict';

var BaseActor = require("renderer/actor/BaseActor");

function RingProjectileActor(config) {
    BaseActor.apply(this, arguments);
    this.colorR = 1;
    this.colorG = 1;
    this.colorB = 1;
}

RingProjectileActor.extend(BaseActor);

RingProjectileActor.prototype.customUpdate = function () {
    var offsetPositionZ, offsetPositionY;
    var ringSections = 36;
    var edgeOffset = ringSections / 2;

    for (var i = -ringSections / 2; i < ringSections / 2; i++) {
        offsetPositionZ = Utils.rotationToVector(Utils.degToRad(240 / ringSections * i) + this.rotation, 1 + this.timer / 10);
        this.particleManager.createParticle('particleAdd', {
            positionX: this.position[0] + offsetPositionZ[0],
            positionY: this.position[1] + offsetPositionZ[1],
            colorR: this.colorR,
            colorG: this.colorG,
            colorB: this.colorB,
            scale: 2 - 2 / edgeOffset * Math.abs(i),
            alpha: 2 - 2 / edgeOffset * Math.abs(i) - this.timer / 100,
            alphaMultiplier: 0.4,
            particleVelocity: 1,
            particleRotation: this.rotation,
            lifeTime: 3
        });
    }
};

RingProjectileActor.prototype.onDeath = function () {
    for (var i = 0; i < 15; i++) {
        this.particleManager.createParticle('particleAdd', {
            positionX: this.position[0] + Utils.rand(-4, 4),
            positionY: this.position[1] + Utils.rand(-4, 4),
            positionZ: Utils.rand(-5, 5),
            colorR: this.colorR,
            colorG: this.colorG,
            colorB: this.colorB,
            scale: Utils.rand(1, 40),
            alpha: Utils.rand(3, 10) / 10 - this.timer / 100,
            alphaMultiplier: 0.7,
            particleVelocity: 0,
            particleRotation: 0,
            lifeTime: 1
        });
    }

    for (var _i = 0; _i < 100 - this.timer; _i++) {
        this.particleManager.createParticle('particleAdd', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2, 7) / 10,
            alpha: 1 - this.timer / 100,
            alphaMultiplier: 0.94,
            particleVelocity: Utils.rand(5, 15) / 10,
            particleRotation: Utils.rand(0, 360),
            speedZ: Utils.rand(-50, 50) / 100,
            lifeTime: Utils.rand(10, 20)
        });
    }
};

RingProjectileActor.prototype.onSpawn = function () {
    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 50,
        alpha: 1,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 30,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleRotation: this.rotation,
        lifeTime: 3
    });
};

module.exports = RingProjectileActor;

},{"renderer/actor/BaseActor":44}],67:[function(require,module,exports){
"use strict";

var ModelStore = {
    materials: {},
    geometries: {},

    get: function get(name) {
        return {
            geometry: this.geometries[name],
            material: this.materials[name]
        };
    },

    loadBatch: function loadBatch(batch) {
        Object.keys(batch).forEach(function (modelName) {
            this.addGeometry(modelName, batch[modelName].geometry);
            this.addMaterial(modelName, batch[modelName].material);
        }.bind(this));
    },

    addGeometry: function addGeometry(name, geometry) {
        if (geometry) {
            this.geometries[name] = geometry;
        }
    },

    addMaterial: function addMaterial(name, material) {
        if (material) {
            this.materials[name] = material instanceof Array ? material[0] : material;
        }
    }
};

module.exports = ModelStore;

},{}],68:[function(require,module,exports){
'use strict';

var ActorConfig = {
    SHIP: {
        props: {
            acceleration: 1000,
            turnSpeed: 6,
            hp: 3000,
            isPlayer: true
        },
        bodyConfig: {
            mass: 4,
            damping: 0.85,
            angularDamping: 0,
            inertia: 10,
            radius: 7,
            collisionType: 'playerShip'
        }
    },

    PLASMAPROJECTILE: {
        props: {
            hp: 1,
            damage: 1.8,
            removeOnHit: true,
            timeout: 300,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3']
        },
        bodyConfig: {
            radius: 2,
            mass: 1,
            collisionType: 'playerProjectile'
        }
    },

    LASERPROJECTILE: {
        props: {
            hp: 1,
            damage: 3,
            removeOnHit: true,
            timeout: 60,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3']
        },
        bodyConfig: {
            radius: 1,
            mass: 0.04,
            ccdSpeedThreshold: 1,
            ccdIterations: 4,
            collisionType: 'playerProjectile'
        }
    },

    MOLTENPROJECTILE: {
        props: {
            hp: 1,
            damage: 2,
            removeOnHit: true,
            timeout: 1000,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3']
        },
        bodyConfig: {
            radius: 1,
            mass: 1,
            collisionType: 'enemyProjectile'
        }
    },

    PULSEWAVEPROJECTILE: {
        props: {
            hp: 1,
            damage: 3,
            removeOnHit: true,
            timeout: 30,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3']
        },
        bodyConfig: {
            radius: 3,
            mass: 2,
            ccdSpeedThreshold: 1,
            ccdIterations: 2,
            collisionType: 'playerProjectile'
        }
    },

    REDLASERPROJECTILE: {
        props: {
            hp: 1,
            damage: 4,
            removeOnHit: true,
            timeout: 120,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3']
        },
        bodyConfig: {
            radius: 1,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4,
            collisionType: 'enemyProjectile'
        }
    },

    RINGPROJECTILE: {
        props: {
            hp: 1,
            damage: 6,
            removeOnHit: true,
            timeout: 120,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3']
        },
        bodyConfig: {
            radius: 3,
            mass: 20,
            ccdSpeedThreshold: 1,
            ccdIterations: 2,
            collisionType: 'enemyProjectile'
        }
    },

    CHUNK: {
        props: {
            hp: 1,
            turnSpeed: 1,
            removeOnHit: false,
            timeout: Utils.rand(25, 100)
        },
        bodyConfig: {
            mass: 0.01
        }
    },

    BOOMCHUNK: {
        props: {
            hp: 1,
            turnSpeed: 1,
            removeOnHit: false,
            timeout: Utils.rand(5, 60),
            soundsOnDeath: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8']
        },
        bodyConfig: {
            mass: 0.01
        }
    },

    ENEMYSPAWNER: {
        props: {
            hp: 350,
            removeOnHit: false,
            spawnRate: 240
        }
    }
};

module.exports = ActorConfig;

},{}],69:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//This is an auto-generated template file. Any changes will be overwritten!

var idMap = {
    SHIP: 1,
    MOOK: 2,
    SNIPER: 3,
    ORBOT: 4,
    MOOKBOSS: 5,
    CHUNK: 6,
    BOOMCHUNK: 7,
    PLASMAPROJECTILE: 8,
    LASERPROJECTILE: 9,
    REDLASERPROJECTILE: 10,
    MOLTENPROJECTILE: 11,
    RINGPROJECTILE: 12,
    PULSEWAVEPROJECTILE: 13,
    MAP: 14,
    ENEMYSPAWNER: 15,
    ENEMYSPAWNMARKER: 16,
    DEBUG: 17

};

function ActorFactory(context, actorDependencies) {
    var _actorMap;

    this.actorDependencies = actorDependencies;
    ActorFactory.ShipActor = context === 'renderer' ? require("renderer/actor/player/ShipActor") : require("logic/actor/player/ShipActor");
    ActorFactory.MookActor = context === 'renderer' ? require("renderer/actor/enemy/MookActor") : require("logic/actor/enemy/MookActor");
    ActorFactory.SniperActor = context === 'renderer' ? require("renderer/actor/enemy/SniperActor") : require("logic/actor/enemy/SniperActor");
    ActorFactory.OrbotActor = context === 'renderer' ? require("renderer/actor/enemy/OrbotActor") : require("logic/actor/enemy/OrbotActor");
    ActorFactory.MookBossActor = context === 'renderer' ? require("renderer/actor/enemy/MookBossActor") : require("logic/actor/enemy/MookBossActor");
    ActorFactory.ChunkActor = context === 'renderer' ? require("renderer/actor/object/ChunkActor") : require("logic/actor/object/ChunkActor");
    ActorFactory.BoomChunkActor = context === 'renderer' ? require("renderer/actor/object/BoomChunkActor") : require("logic/actor/object/BoomChunkActor");
    ActorFactory.PlasmaProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaProjectileActor") : require("logic/actor/projectile/PlasmaProjectileActor");
    ActorFactory.LaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/LaserProjectileActor") : require("logic/actor/projectile/LaserProjectileActor");
    ActorFactory.RedLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RedLaserProjectileActor") : require("logic/actor/projectile/RedLaserProjectileActor");
    ActorFactory.MoltenProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/MoltenProjectileActor") : require("logic/actor/projectile/MoltenProjectileActor");
    ActorFactory.RingProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RingProjectileActor") : require("logic/actor/projectile/RingProjectileActor");
    ActorFactory.PulseWaveProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PulseWaveProjectileActor") : require("logic/actor/projectile/PulseWaveProjectileActor");
    ActorFactory.MapActor = context === 'renderer' ? require("renderer/actor/map/MapActor") : require("logic/actor/map/MapActor");
    ActorFactory.EnemySpawnerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnerActor") : require("logic/actor/map/EnemySpawnerActor");
    ActorFactory.EnemySpawnMarkerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnMarkerActor") : require("logic/actor/map/EnemySpawnMarkerActor");
    ActorFactory.DebugActor = context === 'renderer' ? require("renderer/actor/DebugActor") : require("logic/actor/DebugActor");

    this.actorMap = (_actorMap = {}, _defineProperty(_actorMap, idMap.SHIP, ActorFactory.ShipActor), _defineProperty(_actorMap, idMap.MOOK, ActorFactory.MookActor), _defineProperty(_actorMap, idMap.SNIPER, ActorFactory.SniperActor), _defineProperty(_actorMap, idMap.ORBOT, ActorFactory.OrbotActor), _defineProperty(_actorMap, idMap.MOOKBOSS, ActorFactory.MookBossActor), _defineProperty(_actorMap, idMap.CHUNK, ActorFactory.ChunkActor), _defineProperty(_actorMap, idMap.BOOMCHUNK, ActorFactory.BoomChunkActor), _defineProperty(_actorMap, idMap.PLASMAPROJECTILE, ActorFactory.PlasmaProjectileActor), _defineProperty(_actorMap, idMap.LASERPROJECTILE, ActorFactory.LaserProjectileActor), _defineProperty(_actorMap, idMap.REDLASERPROJECTILE, ActorFactory.RedLaserProjectileActor), _defineProperty(_actorMap, idMap.MOLTENPROJECTILE, ActorFactory.MoltenProjectileActor), _defineProperty(_actorMap, idMap.RINGPROJECTILE, ActorFactory.RingProjectileActor), _defineProperty(_actorMap, idMap.PULSEWAVEPROJECTILE, ActorFactory.PulseWaveProjectileActor), _defineProperty(_actorMap, idMap.MAP, ActorFactory.MapActor), _defineProperty(_actorMap, idMap.ENEMYSPAWNER, ActorFactory.EnemySpawnerActor), _defineProperty(_actorMap, idMap.ENEMYSPAWNMARKER, ActorFactory.EnemySpawnMarkerActor), _defineProperty(_actorMap, idMap.DEBUG, ActorFactory.DebugActor), _actorMap);
}

ActorFactory.prototype.create = function (config) {
    if (!this.actorMap[config.classId]) {
        throw new Error("Cannot create actor. Bad configuration!".config);
    }
    return new this.actorMap[config.classId](config, this.actorDependencies);
};

module.exports = function (context) {
    var returnObject = {};

    returnObject.getInstance = function (dependencies) {
        return new ActorFactory(context, dependencies);
    };

    Object.keys(idMap).forEach(function (key) {
        returnObject[key] = idMap[key];
    });

    return returnObject;
};

},{"logic/actor/DebugActor":10,"logic/actor/enemy/MookActor":24,"logic/actor/enemy/MookBossActor":25,"logic/actor/enemy/OrbotActor":26,"logic/actor/enemy/SniperActor":27,"logic/actor/map/EnemySpawnMarkerActor":28,"logic/actor/map/EnemySpawnerActor":29,"logic/actor/map/MapActor":30,"logic/actor/object/BoomChunkActor":31,"logic/actor/object/ChunkActor":32,"logic/actor/player/ShipActor":33,"logic/actor/projectile/LaserProjectileActor":34,"logic/actor/projectile/MoltenProjectileActor":35,"logic/actor/projectile/PlasmaProjectileActor":36,"logic/actor/projectile/PulseWaveProjectileActor":37,"logic/actor/projectile/RedLaserProjectileActor":38,"logic/actor/projectile/RingProjectileActor":39,"renderer/actor/DebugActor":45,"renderer/actor/enemy/MookActor":51,"renderer/actor/enemy/MookBossActor":52,"renderer/actor/enemy/OrbotActor":53,"renderer/actor/enemy/SniperActor":54,"renderer/actor/map/EnemySpawnMarkerActor":55,"renderer/actor/map/EnemySpawnerActor":56,"renderer/actor/map/MapActor":57,"renderer/actor/object/BoomChunkActor":58,"renderer/actor/object/ChunkActor":59,"renderer/actor/player/ShipActor":60,"renderer/actor/projectile/LaserProjectileActor":61,"renderer/actor/projectile/MoltenProjectileActor":62,"renderer/actor/projectile/PlasmaProjectileActor":63,"renderer/actor/projectile/PulseWaveProjectileActor":64,"renderer/actor/projectile/RedLaserProjectileActor":65,"renderer/actor/projectile/RingProjectileActor":66}],70:[function(require,module,exports){
"use strict";

var Constants = {
    SHOW_FPS: false,

    LOGIC_REFRESH_RATE: 60,

    DEFAULT_POSITION_Z: 10,

    MAX_SHADER_UNIFORM_SIZE: 512,

    RENDER_DISTANCE: 500,

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

    STORAGE_SIZE: 1000,

    CHUNK_SIZE: 352,

    MAX_SOUND_DISTANCE: 500
};

module.exports = Constants;

},{}],71:[function(require,module,exports){
"use strict";

/**
 * Base class for objects that dispatches events.
 * @class EventEmitter
 * @constructor
 */
var EventEmitter = function EventEmitter() {};

module.exports = EventEmitter;

EventEmitter.prototype = {
    constructor: EventEmitter,

    /**
     * Add an event listener
     * @method on
     * @param  {String} type
     * @param  {Function} listener
     * @return {EventEmitter} The self object, for chainability.
     */
    on: function on(type, listener, context) {
        listener.context = context || this;
        if (this._listeners === undefined) {
            this._listeners = {};
        }
        var listeners = this._listeners;
        if (listeners[type] === undefined) {
            listeners[type] = [];
        }
        if (listeners[type].indexOf(listener) === -1) {
            listeners[type].push(listener);
        }
        return this;
    },

    /**
     * Check if an event listener is added
     * @method has
     * @param  {String} type
     * @param  {Function} listener
     * @return {Boolean}
     */
    has: function has(type, listener) {
        if (this._listeners === undefined) {
            return false;
        }
        var listeners = this._listeners;
        if (listener) {
            if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1) {
                return true;
            }
        } else {
            if (listeners[type] !== undefined) {
                return true;
            }
        }

        return false;
    },

    /**
     * Remove an event listener
     * @method off
     * @param  {String} type
     * @param  {Function} listener
     * @return {EventEmitter} The self object, for chainability.
     */
    off: function off(type, listener) {
        if (this._listeners === undefined) {
            return this;
        }
        var listeners = this._listeners;
        var index = listeners[type].indexOf(listener);
        if (index !== -1) {
            listeners[type].splice(index, 1);
        }
        return this;
    },

    /**
     * Emit an event.
     * @method emit
     * @param  {Object} event
     * @param  {String} event.type
     * @return {EventEmitter} The self object, for chainability.
     */
    emit: function emit(event) {
        if (this._listeners === undefined) {
            return this;
        }
        var listeners = this._listeners;
        var listenerArray = listeners[event.type];
        if (listenerArray !== undefined) {
            event.target = this;
            for (var i = 0, l = listenerArray.length; i < l; i++) {
                var listener = listenerArray[i];
                listener.call(listener.context, event);
            }
        }
        return this;
    }
};

},{}],72:[function(require,module,exports){
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
        var max = arguments.length <= 1 || arguments[1] === undefined ? 255 : arguments[1];

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

    rotationToVector: function rotationToVector(rotation, length) {
        length = length || 0;
        return [Math.sin(rotation) * -1 * length, Math.cos(rotation) * length];
    },

    rotationBetweenPointsFromCenter: function rotationBetweenPointsFromCenter(p1, p2) {
        var rotation = Math.atan2(p1[1], p1[0]) - Math.atan2(p2[1], p2[0]);

        rotation = rotation * 360 / (2 * Math.PI);

        if (rotation < 0) {
            rotation = rotation + 360;
        }
        return rotation;
    },

    rotationBetweenPoints: function rotationBetweenPoints(p1, p2) {
        var rotation = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
        rotation -= Math.PI / 2;
        return rotation % (Math.PI * 2);
    },

    pointInArc: function pointInArc(p1, p2, p1LookAngle, p1ArcAngle) {
        var rotationToP2 = this.rotationBetweenPoints(p1, p2);
        var normalizedAngle = p1LookAngle % (Math.PI * 2);
        var rotationDifference = normalizedAngle >= 0 && rotationToP2 >= 0 || normalizedAngle < 0 && rotationToP2 < 0 ? normalizedAngle - rotationToP2 : normalizedAngle + rotationToP2 * -1;
        return Math.abs(rotationDifference) < this.degToRad(p1ArcAngle) || Math.abs(rotationDifference - Math.PI * 2) < this.degToRad(p1ArcAngle) || Math.abs(rotationDifference + Math.PI * 2) < this.degToRad(p1ArcAngle);
    },

    arcAngleDifference: function arcAngleDifference(p1, p2, p1LookAngle) {
        var rotationToP2 = this.rotationBetweenPoints(p1, p2);
        var normalizedAngle = p1LookAngle % (Math.PI * 2);
        return normalizedAngle >= 0 && rotationToP2 >= 0 || normalizedAngle < 0 && rotationToP2 < 0 ? normalizedAngle - rotationToP2 : normalizedAngle + rotationToP2 * -1;
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
    },

    rotateVector: function rotateVector(x, y, rotation) {
        var cos = Math.cos(rotation),
            sin = Math.sin(rotation),
            nx = cos * x + sin * y,
            ny = cos * y - sin * x;
        return [nx, ny];
    },

    objToScreenPosition: function objToScreenPosition(object, renderer, camera) {
        var vector = new THREE.Vector3();
        var canvas = renderer.domElement;

        vector.set(object.position[0], object.position[1], Constants.DEFAULT_POSITION_Z);
        vector.project(camera);

        vector.x = Math.round((vector.x + 1) * canvas.width / 2);
        vector.y = Math.round((-vector.y + 1) * canvas.height / 2);

        return [vector.x, vector.y];
    },

    //proxies for p2.js - it uses "angle" as angle, while three.js uses "rotation"
    angleBetweenPointsFromCenter: function angleBetweenPointsFromCenter(p1, p2) {
        return this.rotationBetweenPointsFromCenter(p1, p2);
    },

    angleToVector: function angleToVector(rotation, length) {
        return this.rotationToVector(rotation, length);
    }
};

if (!Function.prototype.extend) {
    Function.prototype.extend = function (oldClass) {
        this.prototype = Object.create(oldClass.prototype);
        this.prototype.constructor = oldClass;
    };
}

module.exports = Utils;

},{}],73:[function(require,module,exports){
'use strict';

function WorkerBus(config) {
    if (!config.worker) throw new Error('No worker object specified for Workerbus!');
    config = config || {};
    Object.assign(this, config);

    this.worker.onmessage = this.handleMessage.bind(this);

    EventEmitter.apply(this, arguments);
}

WorkerBus.extend(EventEmitter);

WorkerBus.prototype.postMessage = function (type, message) {
    message.type = type;
    this.worker.postMessage(message);
};

WorkerBus.prototype.handleMessage = function (message) {
    this.emit({
        type: message.data.type,
        data: message.data
    });
};

module.exports = WorkerBus;

},{}]},{},[2]);
