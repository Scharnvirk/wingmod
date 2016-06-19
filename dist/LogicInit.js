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
},{"logic/Core":3,"shared/Constants":69,"shared/EventEmitter":70,"shared/Utils":71}],3:[function(require,module,exports){
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
    this.scene.on('newPlayerActor', this.onNewPlayerActor.bind(this));
    this.scene.on('gameFinished', this.onGameFinished.bind(this));

    this.renderBus.on('pause', this.onPause.bind(this));
    this.renderBus.on('startGame', this.onStart.bind(this));
    this.renderBus.on('aiImageDone', this.onAiImageDone.bind(this));
    this.renderBus.on('inputState', this.onInputState.bind(this));
    this.renderBus.on('mapHitmapsLoaded', this.onMapHitmapsLoaded.bind(this));

    this.mapManager.on('mapDone', this.onMapDone.bind(this));

    this.actorManager.on('actorEvents', this.onActorEvents.bind(this));
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

Core.prototype.onNewPlayerActor = function (event) {
    var playerActor = event.data;
    this.actorManager.setPlayerActor(playerActor);
    this.renderBus.postMessage('attachPlayer', { actorId: playerActor.body.actorId });
};

Core.prototype.onActorEvents = function (event) {
    this.renderBus.postMessage('actorEvents', { actorData: event.data });
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
    this.mapManager.buildMap();
};

Core.prototype.onMapDone = function (event) {
    this.scene.fillScene(event.data.bodies);
    this.renderBus.postMessage('mapDone', event.data.layout);
};

Core.prototype.onPlaySound = function (event) {
    this.renderBus.postMessage('playSound', event.data);
};

module.exports = Core;

},{"logic/GameScene":4,"logic/GameWorld":5,"logic/RenderBus":6,"logic/WorldAiMapExtractor":7,"logic/actor/ActorManager":8,"logic/map/MapManager":41}],4:[function(require,module,exports){
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
        angle: Utils.rand(0, 360)
    });

    this.emit({
        type: 'newPlayerActor',
        data: playerActor
    });

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

},{"logic/actor/component/body/BaseBody":13,"shared/ActorFactory":68}],5:[function(require,module,exports){
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
    var transferrableBodyId = 0;

    for (var i = 0; i < this.bodies.length; i++) {
        var body = this.bodies[i];
        if (body.actor) {
            transferArray[transferrableBodyId * 5] = body.actorId;
            transferArray[transferrableBodyId * 5 + 1] = body.dead ? -1 : body.classId;
            transferArray[transferrableBodyId * 5 + 2] = body.position[0];
            transferArray[transferrableBodyId * 5 + 3] = body.position[1];
            transferArray[transferrableBodyId * 5 + 4] = body.angle;
            transferrableBodyId++;

            if (body.dead) {
                deadActors.push(body.actorId);
                body.onDeath();
                this.removeBody(body);
            }
            body.update();
        }
    }

    return {
        length: transferrableBodyId,
        transferArray: this.transferArray,
        deadActors: deadActors
    };
};

GameWorld.prototype.onCollision = function (collisionEvent) {
    collisionEvent.bodyA.onCollision(collisionEvent.bodyB);
    collisionEvent.bodyB.onCollision(collisionEvent.bodyA);
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

module.exports = GameWorld;

},{}],6:[function(require,module,exports){
"use strict";

var WorkerBus = require("shared/WorkerBus");

function RenderBus(config) {
    WorkerBus.apply(this, arguments);
}

RenderBus.extend(WorkerBus);

module.exports = WorkerBus;

},{"shared/WorkerBus":72}],7:[function(require,module,exports){
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
    this.actorEventsToSend = {};
    this.aiImage = null;
    this.aiGraph = {};

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
    this.timer++;

    for (var i = 0; i < this.playerActors.length; i++) {
        if (this.storage[this.playerActors[i]]) {
            this.storage[this.playerActors[i]].playerUpdate(inputState);
        }
    }

    for (var actorId in this.storage) {
        this.storage[actorId].update();
    }

    this.sendActorEvents();
};

ActorManager.prototype.setPlayerActor = function (actor) {
    this.playerActors.push(actor.body.actorId);
};

ActorManager.prototype.removeActorAt = function (actorId) {
    delete this.storage[actorId];
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
    return this.storage[this.playerActors[0]];
};

ActorManager.prototype.requestActorEvent = function (actorId, eventName, eventParams) {
    this.actorEventsToSend[actorId] = this.actorEventsToSend[actorId] || {};
    this.actorEventsToSend[actorId][eventName] = eventParams;
};

ActorManager.prototype.sendActorEvents = function () {
    if (Object.keys(this.actorEventsToSend).length > 0) {
        this.emit({
            type: 'actorEvents',
            data: this.actorEventsToSend
        });
        this.actorEventsToSend = {};
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

module.exports = ActorManager;

},{"shared/ActorFactory":68}],9:[function(require,module,exports){
'use strict';

var ActorFactory = require("shared/ActorFactory")('logic');

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
    this.rotationForce = 0;

    this.timer = 0;
    this.customParams = {};
}

BaseActor.prototype.applyConfig = function (config) {
    for (var property in config) {
        this[property] = this[property] || config[property];
    }
};

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
    if (otherActor && this.hp != Infinity && otherActor.damage > 0) {
        this.hp -= otherActor.damage;
        this.sendActorEvent('currentHp', this.hp);
        this.onHit();
    }

    if (this.hp <= 0 || this.removeOnHit) {
        this.onDeath();
    }
};

BaseActor.prototype.sendActorEvent = function (eventName, eventdata) {
    this.manager.requestActorEvent(this.body.actorId, eventName, eventdata);
};

BaseActor.prototype.remove = function (actorId) {
    this.manager.removeActorAt(actorId);
};

BaseActor.prototype.customUpdate = function () {};

BaseActor.prototype.playerUpdate = function () {};

BaseActor.prototype.onHit = function () {};

BaseActor.prototype.onSpawn = function () {};

BaseActor.prototype.onDeath = function () {
    this.body.dead = true;
};

BaseActor.prototype.processMovement = function () {
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

},{"shared/ActorFactory":68}],10:[function(require,module,exports){
"use strict";

var BaseActor = require("logic/actor/BaseActor");
var BaseBody = require("logic/actor/component/body/BaseBody");

function DebugActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.applyConfig({
        timeout: config.timeout || 5
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
    this.rotationForce = Utils.rand(-15, 15);
};

module.exports = DebugActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":13}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"logic/actor/component/ai/BaseBrain":11}],13:[function(require,module,exports){
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

BaseBody.prototype.onDeath = function () {
    if (this.actor) {
        this.actor.remove(this.actorId);
    }
};

BaseBody.prototype.onCollision = function (otherBody) {
    if (this.actor) {
        this.actor.onCollision(otherBody.actor);
    }
};

BaseBody.prototype.update = function () {};

module.exports = BaseBody;

},{}],14:[function(require,module,exports){
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
    this.manager.addNew({
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
        this.manager.playSound({ sounds: [this.sound], actor: this.actor, volume: this.volume });
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
        this.manager.playSound({ sounds: [this.sound], actor: this.actor, volume: this.volume });
    }
};

module.exports = BaseWeapon;

},{}],15:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function Blaster(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.LASERPROJECITLE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 15;
    this.velocity = 600;
    this.sound = 'blue_laser';
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;

},{"logic/actor/component/weapon/BaseWeapon":14,"shared/ActorFactory":68}],16:[function(require,module,exports){
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

},{"logic/actor/component/weapon/BaseWeapon":14,"shared/ActorFactory":68}],17:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function PlasmaGun(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.PLASMAPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 10;
    this.velocity = 250;
    this.sound = 'plasmashot3';
    this.volume = 0.5;
}

PlasmaGun.extend(BaseWeapon);

module.exports = PlasmaGun;

},{"logic/actor/component/weapon/BaseWeapon":14,"shared/ActorFactory":68}],18:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function Blaster(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.REDLASERPROJECITLE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 150;
    this.velocity = 550;
    this.burstCount = 1;
    this.burstCooldown = 20;
    this.sound = 'laser_purple';
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;

},{"logic/actor/component/weapon/BaseWeapon":14,"shared/ActorFactory":68}],19:[function(require,module,exports){
"use strict";

var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function Blaster(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.REDLASERPROJECITLE;

    BaseWeapon.apply(this, arguments);

    this.burstCount = 5;
    this.burstCooldown = 12;
    this.cooldown = 100;
    this.velocity = 700;
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;

},{"logic/actor/component/weapon/BaseWeapon":14,"shared/ActorFactory":68}],20:[function(require,module,exports){
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

},{"logic/actor/component/weapon/BaseWeapon":14,"shared/ActorFactory":68}],21:[function(require,module,exports){
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
            mass: 2,
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

MookActor.prototype.lookAtPosition = function (position) {
    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle = Utils.angleBetweenPointsFromCenter(angleVector, [position[0] - this.body.position[0], position[1] - this.body.position[1]]);

    if (angle < 180 && angle > 0) {
        this.rotationForce = Math.min(angle / this.stepAngle, 1) * -1;
    }

    if (angle >= 180 && angle < 360) {
        this.rotationForce = Math.min((360 - angle) / this.stepAngle, 1);
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

},{"logic/actor/BaseActor":9,"logic/actor/component/ai/MookBrain":12,"logic/actor/component/body/BaseBody":13,"logic/actor/component/weapon/MoltenBallThrower":16,"logic/actor/component/weapon/RedBlaster":18,"shared/ActorFactory":68}],22:[function(require,module,exports){
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
    for (var i = 0; i < 5; i++) {
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

},{"logic/actor/BaseActor":9,"logic/actor/component/ai/MookBrain":12,"logic/actor/component/body/BaseBody":13,"logic/actor/component/weapon/RedSuperBlaster":19,"logic/actor/enemy/MookActor":21,"shared/ActorFactory":68}],23:[function(require,module,exports){
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
        hp: 4,
        bodyConfig: {
            actor: this,
            mass: 1,
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

OrbotActor.prototype.lookAtPosition = function (position) {
    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle = Utils.angleBetweenPointsFromCenter(angleVector, [position[0] - this.body.position[0], position[1] - this.body.position[1]]);

    if (angle < 180 && angle > 0) {
        this.rotationForce = Math.min(angle / this.stepAngle, 1) * -1;
    }

    if (angle >= 180 && angle < 360) {
        this.rotationForce = Math.min((360 - angle) / this.stepAngle, 1);
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

},{"logic/actor/BaseActor":9,"logic/actor/component/ai/MookBrain":12,"logic/actor/component/body/BaseBody":13,"logic/actor/component/weapon/RingBlaster":20,"shared/ActorFactory":68}],24:[function(require,module,exports){
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
        hp: 8,
        bodyConfig: {
            actor: this,
            mass: 2,
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

SniperActor.prototype.lookAtPosition = function (position) {
    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle = Utils.angleBetweenPointsFromCenter(angleVector, [position[0] - this.body.position[0], position[1] - this.body.position[1]]);

    if (angle < 180 && angle > 0) {
        this.rotationForce = Math.min(angle / this.stepAngle, 1) * -1;
    }

    if (angle >= 180 && angle < 360) {
        this.rotationForce = Math.min((360 - angle) / this.stepAngle, 1);
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

},{"logic/actor/BaseActor":9,"logic/actor/component/ai/MookBrain":12,"logic/actor/component/body/BaseBody":13,"logic/actor/component/weapon/RedBlaster":18,"shared/ActorFactory":68}],25:[function(require,module,exports){
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
        this.body.dead = true;
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

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":13,"shared/ActorFactory":68}],26:[function(require,module,exports){
"use strict";

var BaseActor = require("logic/actor/BaseActor");
var BaseBody = require("logic/actor/component/body/BaseBody");
var ActorFactory = require("shared/ActorFactory")('logic');

function EnemySpawnerActor(config) {
    Object.assign(this, config);
    BaseActor.apply(this, arguments);

    this.spawnDelay = 0;

    this.spawnRate = 240;

    this.applyConfig({
        hp: 220,
        removeOnHit: false
    });
}

EnemySpawnerActor.extend(BaseActor);

EnemySpawnerActor.prototype.customUpdate = function () {
    if (this.spawnDelay > 0) {
        this.spawnDelay--;
    } else {
        if (Utils.rand(Math.min(this.timer / 60, this.spawnRate), this.spawnRate) === this.spawnRate) {
            this.createEnemySpawnMarker();
        }
    }
};

EnemySpawnerActor.prototype.createEnemySpawnMarker = function () {
    this.spawnDelay = this.spawnRate;
    this.manager.addNew({
        classId: ActorFactory.ENEMYSPAWNMARKER,
        positionX: this.body.position[0],
        positionY: this.body.position[1],
        angle: 0,
        velocity: 0
    });
    this.sendActorEvent('newSpawnDelay', this.spawnRate);
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
    for (var i = 0; i < 10; i++) {
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

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":13,"shared/ActorFactory":68}],27:[function(require,module,exports){
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

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":13}],28:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorFactory = require("shared/ActorFactory")('logic');

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

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":13,"shared/ActorFactory":68}],29:[function(require,module,exports){
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

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":13}],30:[function(require,module,exports){
'use strict';

var ChunkActor = require("logic/actor/object/ChunkActor");

function BoomChunkActor(config) {
    config = config || [];
    ChunkActor.apply(this, arguments);
    Object.assign(this, config);

    this.applyConfig({
        timeout: Utils.rand(5, 60)
    });
}

BoomChunkActor.extend(ChunkActor);

BoomChunkActor.prototype.onDeath = function () {
    this.body.dead = true;
    this.manager.playSound({ sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8'], actor: this, volume: 10 });
};

module.exports = BoomChunkActor;

},{"logic/actor/object/ChunkActor":31}],31:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function ChunkActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        turnSpeed: 1,
        removeOnHit: false,
        timeout: Utils.rand(25, 100)
    });
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

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":13}],32:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseBrain = require("logic/actor/component/ai/BaseBrain");
var BaseActor = require("logic/actor/BaseActor");
var ActorFactory = require("shared/ActorFactory")('logic');
var Blaster = require("logic/actor/component/weapon/Blaster");
var PlasmaGun = require("logic/actor/component/weapon/PlasmaGun");

function ShipActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        acceleration: 600,
        turnSpeed: 6,
        hp: 30,
        bodyConfig: {
            actor: this,
            mass: 4,
            damping: 0.8,
            angularDamping: 0,
            inertia: 10,
            radius: 7,
            collisionType: 'playerShip'
        }
    });

    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    this.lastInputStateX = 0;
    this.lastInputStateY = 0;

    this.plasma = this.createPlasma();
    this.blaster = this.createBlaster();

    BaseActor.apply(this, arguments);
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

ShipActor.prototype.customUpdate = function () {
    this.blaster.update();
    this.plasma.update();
};

ShipActor.prototype.playerUpdate = function (inputState) {
    if (inputState) {
        this.applyThrustInput(inputState);
        this.applyLookAtRotationInput(inputState);
        this.applyWeaponInput(inputState);
    }
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
    for (var i = 0; i < 5; i++) {
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

module.exports = ShipActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/ai/BaseBrain":11,"logic/actor/component/body/BaseBody":13,"logic/actor/component/weapon/Blaster":15,"logic/actor/component/weapon/PlasmaGun":17,"shared/ActorFactory":68}],33:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function LaserProjectileActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 2,
        removeOnHit: true,
        timeout: 60,
        bodyConfig: {
            radius: 1,
            mass: 0.1,
            ccdSpeedThreshold: 1,
            ccdIterations: 4,
            collisionType: 'playerProjectile',
            actor: this
        }
    });

    BaseActor.apply(this, arguments);
}

LaserProjectileActor.extend(BaseActor);

LaserProjectileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

LaserProjectileActor.prototype.onDeath = function () {
    this.body.dead = true;
    this.manager.playSound({ sounds: ['matterhit3'], actor: this });
};

module.exports = LaserProjectileActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":13}],34:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function MoltenProjectileActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 2,
        removeOnHit: true,
        timeout: 1000,
        bodyConfig: {
            radius: 1,
            mass: 1,
            collisionType: 'enemyProjectile',
            actor: this
        }
    });

    BaseActor.apply(this, arguments);
}

MoltenProjectileActor.extend(BaseActor);

MoltenProjectileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

MoltenProjectileActor.prototype.onDeath = function () {
    this.body.dead = true;
    this.manager.playSound({ sounds: ['matterhit3'], actor: this });
};

module.exports = MoltenProjectileActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":13}],35:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function PlasmaProjectileActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 1.5,
        removeOnHit: true,
        timeout: 300,
        bodyConfig: {
            radius: 2,
            mass: 1,
            collisionType: 'playerProjectile',
            actor: this
        }
    });

    BaseActor.apply(this, arguments);
}

PlasmaProjectileActor.extend(BaseActor);

PlasmaProjectileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

PlasmaProjectileActor.prototype.onDeath = function () {
    this.body.dead = true;
    this.manager.playSound({ sounds: ['matterhit3'], actor: this });
};

module.exports = PlasmaProjectileActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":13}],36:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function RedLaserProjectileActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 4,
        removeOnHit: true,
        timeout: 120,
        bodyConfig: {
            radius: 1,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4,
            collisionType: 'enemyProjectile',
            actor: this
        }
    });

    BaseActor.apply(this, arguments);
}

RedLaserProjectileActor.extend(BaseActor);

RedLaserProjectileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

RedLaserProjectileActor.prototype.onDeath = function () {
    this.body.dead = true;
    this.manager.playSound({ sounds: ['matterhit3'], actor: this });
};

module.exports = RedLaserProjectileActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":13}],37:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function RingProjectileActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 6,
        removeOnHit: true,
        timeout: 120,
        bodyConfig: {
            radius: 3,
            mass: 20,
            ccdSpeedThreshold: 1,
            ccdIterations: 2,
            collisionType: 'enemyProjectile',
            actor: this
        }
    });

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

RingProjectileActor.prototype.onDeath = function () {
    this.body.dead = true;
    this.manager.playSound({ sounds: ['matterhit3'], actor: this });
};

module.exports = RingProjectileActor;

},{"logic/actor/BaseActor":9,"logic/actor/component/body/BaseBody":13}],38:[function(require,module,exports){
"use strict";

function MapAiGraphBuilder(config) {
    this.graph = {};
    this.positions = {};
}

MapAiGraphBuilder.prototype.buildGraph = function () {};

MapAiGraphBuilder.prototype.buildPositions = function () {};

module.exports = MapAiGraphBuilder;

},{}],39:[function(require,module,exports){
'use strict';

function MapBuilder(config) {
    EventEmitter.apply(this, arguments);
    this.chunkPrototypes = {};

    this.mapLayout = [];
}

MapBuilder.extend(EventEmitter);

MapBuilder.prototype.buildMap = function () {
    if (Object.keys(this.chunkPrototypes).length === 0) throw new Error('Map builder has no chunks yet and is not ready!');

    this.mapLayout = [{
        name: 'chunk_HangarEndcap_1',
        position: [-1, 1],
        rotation: 0
    }, {
        name: 'chunk_HangarEndcap_1',
        position: [0, 1],
        rotation: 0
    }, {
        name: 'chunk_HangarStraight_SideSmall_1',
        position: [-1, 0],
        rotation: 180
    }, {
        name: 'chunk_HangarStraight_SideSmall_1',
        position: [0, 0],
        rotation: 0
    }, {
        name: 'chunk_HangarStraight_SideSmall_1',
        position: [-1, -1],
        rotation: 180
    }, {
        name: 'chunk_HangarStraight_SideSmall_1',
        position: [0, -1],
        rotation: 0
    }, {
        name: 'chunk_HangarEndcap_1',
        position: [-1, -2],
        rotation: 180
    }, {
        name: 'chunk_HangarEndcap_1',
        position: [0, -2],
        rotation: 180
    }];

    return this.mapLayout;
};

MapBuilder.prototype.setPrototypeChunks = function (chunks) {
    this.chunkPrototypes = chunks;
};

module.exports = MapBuilder;

},{}],40:[function(require,module,exports){
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

},{"logic/actor/component/body/BaseBody":13}],41:[function(require,module,exports){
"use strict";

var MapChunk = require("logic/map/MapChunk");
var MapBuilder = require("logic/map/MapBuilder");
var MapAiGraphBuilder = require("logic/map/MapAiGraphBuilder");
var cloner = require("cloner");

function MapManager(config) {
    Object.assign(this, config);

    this.chunkPrototypes = {};
    this.mapBodies = [];
    this.mapBuilder = new MapBuilder();
    this.graphBuilder = new MapAiGraphBuilder();

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
    this.mapBuilder.setPrototypeChunks(this.chunkPrototypes);
};

MapManager.prototype.buildMap = function () {
    var mapLayout = this.mapBuilder.buildMap();
    var bodies = this.buildBodiesFromLayout(mapLayout);
    var mapAiGraph = this.graphBuilder.buildGraph();
    this.emit({ type: 'mapDone', data: { bodies: bodies, layout: mapLayout, mapAiGraph: mapAiGraph } });
};

MapManager.prototype.buildBodiesFromLayout = function (layout) {
    var _this = this;

    var bodies = [];

    layout.forEach(function (chunkConfig) {
        var newChunk = cloner.deep.copy(_this.chunkPrototypes[chunkConfig.name]);
        newChunk.body.position[0] = chunkConfig.position[0] * Constants.CHUNK_SIZE;
        newChunk.body.position[1] = chunkConfig.position[1] * Constants.CHUNK_SIZE;
        newChunk.body.angle = Utils.degToRad(chunkConfig.rotation);
        bodies.push(newChunk.body);
    });

    return bodies;
};

module.exports = MapManager;

},{"cloner":1,"logic/map/MapAiGraphBuilder":38,"logic/map/MapBuilder":39,"logic/map/MapChunk":40}],42:[function(require,module,exports){
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
    this.customParams = {};
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

BaseActor.prototype.handleEvent = function (eventData) {
    if (eventData.currentHp) {
        this.hp = eventData.currentHp;
    }
    this.customHandleEvent(eventData);
};

BaseActor.prototype.customHandleEvent = function (eventData) {};

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

},{}],43:[function(require,module,exports){
"use strict";

var BaseActor = require("renderer/actor/BaseActor");

function DebugActor() {
    BaseActor.apply(this, arguments);
}

DebugActor.extend(BaseActor);

DebugActor.prototype.customUpdate = function () {
    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 0,
        colorB: 1,
        scale: 5,
        alpha: 1,
        alphaMultiplier: 0.75,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 5
    });
};

module.exports = DebugActor;

},{"renderer/actor/BaseActor":42}],44:[function(require,module,exports){
"use strict";

function BaseMesh(config) {
    config.scaleX = config.scaleX || 1;
    config.scaleY = config.scaleY || 1;
    config.scaleZ = config.scaleZ || 1;

    config = config || {};

    THREE.Mesh.apply(this, [config.geometry, config.material]);
    this.angleOffset = 0;

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

},{}],45:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

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

},{"renderer/actor/component/mesh/BaseMesh":44,"renderer/assetManagement/model/ModelStore":67}],46:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function PillarMesh(config) {
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(20, 20, 20, 50);
    config.material = Utils.rand(0, 1) === 0 ? ModelStore.get('wall').material : ModelStore.get('chunk').material;
    Object.assign(this, config);

    this.castShadow = true;
    this.receiveShadow = true;
}

PillarMesh.extend(BaseMesh);

module.exports = PillarMesh;

},{"renderer/actor/component/mesh/BaseMesh":44,"renderer/assetManagement/model/ModelStore":67}],47:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

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

},{"renderer/actor/component/mesh/BaseMesh":44,"renderer/assetManagement/model/ModelStore":67}],48:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function ShipMesh(config) {
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    //onfig.geometry = ModelStore.get('drone').geometry;
    //config.material = ModelStore.get('drone').material;
    Object.assign(this, config);

    // this.scale.x = 1.2;
    // this.scale.y = 1.2;
    // this.scale.z = 1.2;

    this.castShadow = true;
    this.receiveShadow = true;
}

ShipMesh.extend(BaseMesh);

module.exports = ShipMesh;

},{"renderer/actor/component/mesh/BaseMesh":44,"renderer/assetManagement/model/ModelStore":67}],49:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function WallMesh(config) {
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(800, 2, 30, 30);
    config.material = ModelStore.get('wall').material;
    Object.assign(this, config);

    this.receiveShadow = true;
    this.castShadow = true;
}

WallMesh.extend(BaseMesh);

module.exports = WallMesh;

},{"renderer/actor/component/mesh/BaseMesh":44,"renderer/assetManagement/model/ModelStore":67}],50:[function(require,module,exports){
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

MookActor.prototype.createMesh = function () {
    return new BaseMesh({
        actor: this,
        scaleX: 1.2,
        scaleY: 1.2,
        scaleZ: 1.2,
        geometry: ModelStore.get('drone').geometry,
        material: ModelStore.get('drone').material
    });
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
        angle: this.angle,
        angleOffset: 15,
        distance: 3.5
    });
    this.particleManager.createPremade('RedEye', {
        position: this.position,
        positionZ: this.positionZ - 8.7,
        angle: this.angle,
        angleOffset: 345,
        distance: 3.5
    });
};

MookActor.prototype.onHit = function () {
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

module.exports = MookActor;

},{"renderer/actor/BaseActor":42,"renderer/actor/component/mesh/ShipMesh":48,"renderer/assetManagement/model/ModelStore":67}],51:[function(require,module,exports){
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

MookBossActor.prototype.createMesh = function () {
    return new ShipMesh({ actor: this, scaleX: 2, scaleY: 2, scaleZ: 2 });
};

module.exports = MookBossActor;

},{"renderer/actor/component/mesh/ShipMesh":48,"renderer/actor/enemy/MookActor":50}],52:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/ShipMesh");
var BaseActor = require("renderer/actor/BaseActor");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function OrbotActor() {
    BaseActor.apply(this, arguments);
    this.speedZ = Utils.rand(35, 45) / 1000;
    this.bobSpeed = Utils.rand(18, 22) / 10000;

    this.initialHp = 4;
    this.hp = 4;
}

OrbotActor.extend(BaseActor);

OrbotActor.prototype.createMesh = function () {
    return new BaseMesh({
        actor: this,
        scaleX: 1.3,
        scaleY: 1.3,
        scaleZ: 1.3,
        geometry: ModelStore.get('orbot').geometry,
        material: ModelStore.get('orbot').material
    });
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
            angle: this.angle,
            angleOffset: 0,
            distance: 1.65
        });
    }
};

module.exports = OrbotActor;

},{"renderer/actor/BaseActor":42,"renderer/actor/component/mesh/ShipMesh":48,"renderer/assetManagement/model/ModelStore":67}],53:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/ShipMesh");
var BaseActor = require("renderer/actor/BaseActor");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function SniperActor() {
    BaseActor.apply(this, arguments);
    this.speedZ = Utils.rand(35, 45) / 1000;
    this.bobSpeed = Utils.rand(18, 22) / 10000;

    this.initialHp = 8;
    this.hp = 8;

    this.eyeAngle = 0;
    this.eyeSpeed = 3;
    this.eyeEdge = 50;
    this.eyeGoingRight = true;
}

SniperActor.extend(BaseActor);

SniperActor.prototype.createMesh = function () {
    return new BaseMesh({
        actor: this,
        scaleX: 1.9,
        scaleY: 1.9,
        scaleZ: 1.9,
        geometry: ModelStore.get('sniper').geometry,
        material: ModelStore.get('sniper').material
    });
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
    if (this.eyeAngle > this.eyeEdge) {
        this.eyeGoingRight = false;
    }

    if (this.eyeAngle < -this.eyeEdge) {
        this.eyeGoingRight = true;
    }

    this.eyeAngle += this.eyeSpeed * (this.eyeGoingRight ? 1 : -1);

    this.particleManager.createPremade('PurpleEye', {
        position: this.position,
        positionZ: this.positionZ - 7.4,
        angle: this.angle,
        angleOffset: this.eyeAngle,
        distance: 2.3
    });
};

SniperActor.prototype.onHit = function () {
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

module.exports = SniperActor;

},{"renderer/actor/BaseActor":42,"renderer/actor/component/mesh/ShipMesh":48,"renderer/assetManagement/model/ModelStore":67}],54:[function(require,module,exports){
'use strict';

var BaseActor = require("renderer/actor/BaseActor");

function EnemySpawnMarkerActor(config) {
    Object.apply(this, config);
    BaseActor.apply(this, arguments);
}

EnemySpawnMarkerActor.extend(BaseActor);

EnemySpawnMarkerActor.prototype.customUpdate = function () {
    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 0.5,
        colorG: 0.3,
        colorB: 1,
        scale: Utils.rand(this.timer / 5, this.timer / 5 + 20),
        alpha: this.timer / 480,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 2
    });

    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: Utils.rand(this.timer / 10, this.timer / 10 + 10),
        alpha: this.timer / 480,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 2
    });

    for (var i = 0; i < this.timer / 15; i++) {
        var angle = Utils.rand(0, 360);
        var offsetPosition = Utils.angleToVector(angle, Utils.rand(20, 30));
        this.particleManager.createParticle('particleAddSplash', {
            positionX: this.position[0] + offsetPosition[0],
            positionY: this.position[1] + offsetPosition[1],
            colorR: 0.5,
            colorG: 0.3,
            colorB: 1,
            scale: 0.4 + this.timer / 300,
            alpha: 0.2,
            alphaMultiplier: 1.2,
            particleVelocity: -(Utils.rand(this.timer / 15, this.timer / 10) / 10),
            particleAngle: angle,
            speedZ: Utils.rand(-40, 40) / 100,
            lifeTime: 12
        });
    }
};

EnemySpawnMarkerActor.prototype.onDeath = function () {
    var pointCount = 8;
    for (var i = 0; i < pointCount; i++) {
        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.3,
            colorB: 1,
            scale: 50,
            alpha: 0.25,
            alphaMultiplier: 0.7,
            particleVelocity: 2,
            particleAngle: 360 / pointCount * i,
            lifeTime: 5
        });

        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 50,
            alpha: 0.25,
            alphaMultiplier: 0.7,
            particleVelocity: 2,
            particleAngle: 360 / pointCount * i,
            lifeTime: 5
        });
    }
};

module.exports = EnemySpawnMarkerActor;

},{"renderer/actor/BaseActor":42}],55:[function(require,module,exports){
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

    this.initialHp = 220;
    this.hp = 220;
    this.hpBarCount = 30;

    this.spawnDelay = 0;
}

EnemySpawnerActor.extend(BaseActor);

EnemySpawnerActor.prototype.onSpawn = function () {
    this.manager.newEnemy(this.actorId);
};

EnemySpawnerActor.prototype.onDeath = function () {
    this.manager.enemyDestroyed(this.actorId);

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
    var offsetPosition = Utils.angleToVector(this.angle, -12);
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

    this.customUpdate();

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

},{"renderer/actor/BaseActor":42,"renderer/actor/component/mesh/BaseMesh":44,"renderer/assetManagement/model/ModelStore":67}],56:[function(require,module,exports){
"use strict";

var BaseActor = require("renderer/actor/BaseActor");

function MapActor() {
    BaseActor.apply(this, arguments);
}

MapActor.extend(BaseActor);

module.exports = MapActor;

},{"renderer/actor/BaseActor":42}],57:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":42,"renderer/actor/component/mesh/PillarMesh":46}],58:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":42,"renderer/actor/component/mesh/WallMesh":49}],59:[function(require,module,exports){
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

},{"renderer/actor/object/ChunkActor":60}],60:[function(require,module,exports){
"use strict";

var ChunkMesh = require("renderer/actor/component/mesh/ChunkMesh");
var BaseActor = require("renderer/actor/BaseActor");

function ChunkActor() {
    BaseActor.apply(this, arguments);
}

ChunkActor.extend(BaseActor);

ChunkActor.prototype.createMesh = function () {
    return new ChunkMesh({ actor: this, scaleX: Utils.rand(3, 15) / 10, scaleY: Utils.rand(3, 15) / 10, scaleZ: Utils.rand(3, 15) / 10 });
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

},{"renderer/actor/BaseActor":42,"renderer/actor/component/mesh/ChunkMesh":45}],61:[function(require,module,exports){
"use strict";

var RavierMesh = require("renderer/actor/component/mesh/RavierMesh");
var BaseActor = require("renderer/actor/BaseActor");

function ShipActor() {
    BaseActor.apply(this, arguments);
    this.count = 0;
    this.speedZ = 0.04;

    //todo: generic config holder
    this.initialHp = 30;
    this.hp = 30;
    this.lastHp = this.hp;
    this.hpBarCount = 20;

    this.speedZ = 0.04;
    this.speedY = 0.0025;
    this.speedX = 0.002;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMesh = function () {
    return new RavierMesh({ actor: this, scaleX: 3.3, scaleY: 3.3, scaleZ: 3.3 });
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

    this.mesh.rotation.y += this.speedY;
    if (this.mesh.rotation.y > 0) {
        this.speedY -= 0.00012;
    } else {
        this.speedY += 0.00012;
    }

    this.mesh.rotation.x += this.speedX;
    if (this.mesh.rotation.x > 0) {
        this.speedX -= 0.00009;
    } else {
        this.speedX += 0.00009;
    }

    // this.positionZ += this.speedZ;
    // if (this.positionZ > 10){
    //     this.speedZ -= 0.002;
    // } else {
    //     this.speedZ += 0.002;
    // }
};

ShipActor.prototype.doEngineGlow = function () {
    if (this.inputListener) {
        if (this.inputListener.inputState.w && !this.inputListener.inputState.s) {
            this.particleManager.createPremade('EngineGlowMedium', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 15,
                distance: -5.8
            });
            this.particleManager.createPremade('EngineGlowMedium', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 345,
                distance: -5.8
            });
        }

        if (this.inputListener.inputState.a && !this.inputListener.inputState.d) {
            this.particleManager.createPremade('EngineGlowSmall', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 40,
                distance: -4
            });
            this.particleManager.createPremade('EngineGlowSmall', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 170,
                distance: -6
            });
        }

        if (this.inputListener.inputState.d) {
            this.particleManager.createPremade('EngineGlowSmall', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 320,
                distance: -4
            });
            this.particleManager.createPremade('EngineGlowSmall', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 190,
                distance: -6
            });
        }

        if (this.inputListener.inputState.s) {
            this.particleManager.createPremade('EngineGlowMedium', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 180,
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

},{"renderer/actor/BaseActor":42,"renderer/actor/component/mesh/RavierMesh":47}],62:[function(require,module,exports){
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
        scale: 12,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleAngle: this.angle,
        lifeTime: 3
    });
};

module.exports = LaserProjectileActor;

},{"renderer/actor/BaseActor":42}],63:[function(require,module,exports){
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
        scale: 60,
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
        scale: 30,
        alpha: 0.6,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        particleAngle: this.angle,
        lifeTime: 10
    });
};

module.exports = MoltenProjectileActor;

},{"renderer/actor/BaseActor":42}],64:[function(require,module,exports){
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
        scale: 40,
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
        scale: 20,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        particleAngle: this.angle,
        lifeTime: 10
    });
};

module.exports = PlasmaProjectileActor;

},{"renderer/actor/BaseActor":42}],65:[function(require,module,exports){
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
    this.particleManager.createPremade('PurpleLaserTrail', { position: this.position, angle: this.angle });
};

RedLaserProjectileActor.prototype.onDeath = function () {
    this.particleManager.createPremade('PurpleSparks', { position: this.position });
};

RedLaserProjectileActor.prototype.onSpawn = function () {
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
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleAngle: this.angle,
        lifeTime: 3
    });
};

module.exports = RedLaserProjectileActor;

},{"renderer/actor/BaseActor":42}],66:[function(require,module,exports){
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
        offsetPositionZ = Utils.angleToVector(Utils.degToRad(240 / ringSections * i) + this.angle, 1 + this.timer / 10);
        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0] + offsetPositionZ[0],
            positionY: this.position[1] + offsetPositionZ[1],
            colorR: this.colorR,
            colorG: this.colorG,
            colorB: this.colorB,
            scale: 2 - 2 / edgeOffset * Math.abs(i),
            alpha: 2 - 2 / edgeOffset * Math.abs(i) - this.timer / 100,
            alphaMultiplier: 0.4,
            particleVelocity: 1,
            particleAngle: this.angle,
            lifeTime: 3
        });
    }
};

RingProjectileActor.prototype.onDeath = function () {
    for (var i = 0; i < 15; i++) {
        this.particleManager.createParticle('particleAddTrail', {
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
            particleAngle: 0,
            lifeTime: 1
        });
    }

    for (var i = 0; i < 100 - this.timer; i++) {
        this.particleManager.createParticle('particleAddSplash', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2, 7) / 10,
            alpha: 1 - this.timer / 100,
            alphaMultiplier: 0.94,
            particleVelocity: Utils.rand(5, 15) / 10,
            particleAngle: Utils.rand(0, 360),
            speedZ: Utils.rand(-50, 50) / 100,
            lifeTime: Utils.rand(10, 20)
        });
    }
};

RingProjectileActor.prototype.onSpawn = function () {
    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR * 0.3 + 0.7,
        colorG: this.colorG * 0.3 + 0.7,
        colorB: this.colorB * 0.3 + 0.7,
        scale: 50,
        alpha: 1,
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
        scale: 30,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleAngle: this.angle,
        lifeTime: 3
    });
};

module.exports = RingProjectileActor;

},{"renderer/actor/BaseActor":42}],67:[function(require,module,exports){
'use strict';

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
        this.geometries[name] = geometry;
    },

    addMaterial: function addMaterial(name, material) {
        if (!material) throw 'ERROR - no material specified';
        this.materials[name] = material instanceof Array ? material[0] : material;
    }
};

module.exports = ModelStore;

},{}],68:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var idMap = {
    SHIP: 1,
    MOOK: 2,
    PILLAR: 3,
    WALL: 4,
    CHUNK: 5,
    MOOKBOSS: 6,
    BOOMCHUNK: 7,
    SNIPER: 8,
    ORBOT: 9,
    PLASMAPROJECTILE: 100,
    MOLTENPROJECTILE: 101,
    LASERPROJECITLE: 102,
    REDLASERPROJECITLE: 103,
    RINGPROJECTILE: 104,
    MAP: 1000,
    ENEMYSPAWNER: 1001,
    ENEMYSPAWNMARKER: 1002,
    DEBUG: 99999
};

function ActorFactory(context, actorDependencies) {
    var _actorMap;

    ActorFactory.ShipActor = context === 'renderer' ? require("renderer/actor/player/ShipActor") : require("logic/actor/player/ShipActor");
    ActorFactory.MookActor = context === 'renderer' ? require("renderer/actor/enemy/MookActor") : require("logic/actor/enemy/MookActor");
    ActorFactory.SniperActor = context === 'renderer' ? require("renderer/actor/enemy/SniperActor") : require("logic/actor/enemy/SniperActor");
    ActorFactory.OrbotActor = context === 'renderer' ? require("renderer/actor/enemy/OrbotActor") : require("logic/actor/enemy/OrbotActor");
    ActorFactory.MookBossActor = context === 'renderer' ? require("renderer/actor/enemy/MookBossActor") : require("logic/actor/enemy/MookBossActor");
    ActorFactory.WallActor = context === 'renderer' ? require("renderer/actor/map/WallActor") : require("logic/actor/map/WallActor");
    ActorFactory.PillarActor = context === 'renderer' ? require("renderer/actor/map/PillarActor") : require("logic/actor/map/PillarActor");
    ActorFactory.ChunkActor = context === 'renderer' ? require("renderer/actor/object/ChunkActor") : require("logic/actor/object/ChunkActor");
    ActorFactory.BoomChunkActor = context === 'renderer' ? require("renderer/actor/object/BoomChunkActor") : require("logic/actor/object/BoomChunkActor");
    ActorFactory.PlasmaProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaProjectileActor") : require("logic/actor/projectile/PlasmaProjectileActor");
    ActorFactory.MoltenProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/MoltenProjectileActor") : require("logic/actor/projectile/MoltenProjectileActor");
    ActorFactory.LaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/LaserProjectileActor") : require("logic/actor/projectile/LaserProjectileActor");
    ActorFactory.RedLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RedLaserProjectileActor") : require("logic/actor/projectile/RedLaserProjectileActor");
    ActorFactory.RingProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RingProjectileActor") : require("logic/actor/projectile/RingProjectileActor");
    ActorFactory.MapActor = context === 'renderer' ? require("renderer/actor/map/MapActor") : require("logic/actor/map/MapActor");
    ActorFactory.EnemySpawnerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnerActor") : require("logic/actor/map/EnemySpawnerActor");
    ActorFactory.EnemySpawnMarkerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnMarkerActor") : require("logic/actor/map/EnemySpawnMarkerActor");
    ActorFactory.DebugActor = context === 'renderer' ? require("renderer/actor/DebugActor") : require("logic/actor/DebugActor");

    this.actorDependencies = actorDependencies;
    this.actorMap = (_actorMap = {}, _defineProperty(_actorMap, idMap.SHIP, ActorFactory.ShipActor), _defineProperty(_actorMap, idMap.MOOK, ActorFactory.MookActor), _defineProperty(_actorMap, idMap.MOOKBOSS, ActorFactory.MookBossActor), _defineProperty(_actorMap, idMap.SNIPER, ActorFactory.SniperActor), _defineProperty(_actorMap, idMap.ORBOT, ActorFactory.OrbotActor), _defineProperty(_actorMap, idMap.WALL, ActorFactory.WallActor), _defineProperty(_actorMap, idMap.PILLAR, ActorFactory.PillarActor), _defineProperty(_actorMap, idMap.CHUNK, ActorFactory.ChunkActor), _defineProperty(_actorMap, idMap.BOOMCHUNK, ActorFactory.BoomChunkActor), _defineProperty(_actorMap, idMap.PLASMAPROJECTILE, ActorFactory.PlasmaProjectileActor), _defineProperty(_actorMap, idMap.MOLTENPROJECTILE, ActorFactory.MoltenProjectileActor), _defineProperty(_actorMap, idMap.LASERPROJECITLE, ActorFactory.LaserProjectileActor), _defineProperty(_actorMap, idMap.REDLASERPROJECITLE, ActorFactory.RedLaserProjectileActor), _defineProperty(_actorMap, idMap.RINGPROJECTILE, ActorFactory.RingProjectileActor), _defineProperty(_actorMap, idMap.MAP, ActorFactory.MapActor), _defineProperty(_actorMap, idMap.ENEMYSPAWNER, ActorFactory.EnemySpawnerActor), _defineProperty(_actorMap, idMap.ENEMYSPAWNMARKER, ActorFactory.EnemySpawnMarkerActor), _defineProperty(_actorMap, idMap.DEBUG, ActorFactory.DebugActor), _actorMap);
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

},{"logic/actor/DebugActor":10,"logic/actor/enemy/MookActor":21,"logic/actor/enemy/MookBossActor":22,"logic/actor/enemy/OrbotActor":23,"logic/actor/enemy/SniperActor":24,"logic/actor/map/EnemySpawnMarkerActor":25,"logic/actor/map/EnemySpawnerActor":26,"logic/actor/map/MapActor":27,"logic/actor/map/PillarActor":28,"logic/actor/map/WallActor":29,"logic/actor/object/BoomChunkActor":30,"logic/actor/object/ChunkActor":31,"logic/actor/player/ShipActor":32,"logic/actor/projectile/LaserProjectileActor":33,"logic/actor/projectile/MoltenProjectileActor":34,"logic/actor/projectile/PlasmaProjectileActor":35,"logic/actor/projectile/RedLaserProjectileActor":36,"logic/actor/projectile/RingProjectileActor":37,"renderer/actor/DebugActor":43,"renderer/actor/enemy/MookActor":50,"renderer/actor/enemy/MookBossActor":51,"renderer/actor/enemy/OrbotActor":52,"renderer/actor/enemy/SniperActor":53,"renderer/actor/map/EnemySpawnMarkerActor":54,"renderer/actor/map/EnemySpawnerActor":55,"renderer/actor/map/MapActor":56,"renderer/actor/map/PillarActor":57,"renderer/actor/map/WallActor":58,"renderer/actor/object/BoomChunkActor":59,"renderer/actor/object/ChunkActor":60,"renderer/actor/player/ShipActor":61,"renderer/actor/projectile/LaserProjectileActor":62,"renderer/actor/projectile/MoltenProjectileActor":63,"renderer/actor/projectile/PlasmaProjectileActor":64,"renderer/actor/projectile/RedLaserProjectileActor":65,"renderer/actor/projectile/RingProjectileActor":66}],69:[function(require,module,exports){
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

},{}],70:[function(require,module,exports){
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

},{}],71:[function(require,module,exports){
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

},{}],72:[function(require,module,exports){
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
