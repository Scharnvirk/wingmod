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
'use strict';

global.Utils = require('shared/Utils');
global.Constants = require('shared/Constants');
global.EventEmitter = require('shared/EventEmitter');

if ('function' === typeof importScripts) {
    importScripts('../../lib/p2.js');
    importScripts('../../lib/threex.loop.js');
    var LogicCore = require('logic/Core');
    self.core = new LogicCore(self);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"logic/Core":3,"shared/Constants":105,"shared/EventEmitter":106,"shared/Utils":107}],3:[function(require,module,exports){
'use strict';

var RenderBus = require('logic/RenderBus');
var GameWorld = require('logic/GameWorld');
var ActorManager = require('logic/actor/ActorManager');
var MapManager = require('logic/map/MapManager');
var GameScene = require('logic/GameScene');
var GameState = require('logic/GameState');
var WorldAiMapExtractor = require('logic/WorldAiMapExtractor');

function Core(worker) {
    this.createMainComponents(worker);
    this.createEventHandlers();
    this.createFpsCounter();

    this.running = false;
}

Core.prototype.createMainComponents = function (worker) {
    this.renderBus = new RenderBus({ core: this, worker: worker });
    this.world = new GameWorld();
    this.gameState = new GameState();
    this.actorManager = new ActorManager({ world: this.world, gameState: this.gameState });
    this.mapManager = new MapManager();
    this.scene = new GameScene({ world: this.world, actorManager: this.actorManager, mapManager: this.mapManager });
    this.worldAiMapXtractor = new WorldAiMapExtractor({ world: this.world });
};

Core.prototype.createEventHandlers = function () {
    this.scene.on('newMapBodies', this.onNewMapBodies.bind(this));
    this.scene.on('gameFinished', this.onGameFinished.bind(this));
    this.scene.on('gameEnded', this.onPlayerDied.bind(this));

    this.mapManager.on('mapDone', this.onMapDone.bind(this));

    this.actorManager.on('actorStateChange', this.onActorStateChange.bind(this));
    this.actorManager.on('playSound', this.onPlaySound.bind(this));

    this.gameState.on('gameStateChange', this.onGameStateChange.bind(this));
};

Core.prototype.createFpsCounter = function () {
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
    this.gameState.update();
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

Core.prototype.onActorStateChange = function (event) {
    this.renderBus.postMessage('actorStateChange', { data: event.data });
};

Core.prototype.onNewMapBodies = function () {
    var mapBodies = this.worldAiMapXtractor.getTerrainBodies();
    this.renderBus.postMessage('getAiImage', mapBodies);
    this.renderBus.postMessage('newMapBodies', mapBodies);
};

Core.prototype.onPlayerDied = function (event) {
    var _this2 = this;

    setTimeout(function () {
        _this2.renderBus.postMessage('gameEnded', { enemiesKilled: event.data });
        _this2.running = false;
    }, 2000);
};

Core.prototype.onGameFinished = function (event) {
    var _this3 = this;

    setTimeout(function () {
        _this3.renderBus.postMessage('gameFinished', { enemiesKilled: event.data });
        _this3.running = false;
    }, 500);
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

Core.prototype.onGameStateChange = function (event) {
    this.renderBus.postMessage('gameStateChange', event.data);
};

module.exports = Core;

},{"logic/GameScene":4,"logic/GameState":5,"logic/GameWorld":6,"logic/RenderBus":7,"logic/WorldAiMapExtractor":8,"logic/actor/ActorManager":9,"logic/map/MapManager":61}],4:[function(require,module,exports){
'use strict';

var ActorFactory = require('shared/ActorFactory')('logic');
var BaseBody = require('logic/actor/component/body/BaseBody');

function GameScene(config) {
    Object.assign(this, config);
    if (!this.world) throw new Error('No world specified for Logic GameScene');
    if (!this.actorManager) throw new Error('No actorManager specified for Logic GameScene');
    this.timer = 0;

    EventEmitter.apply(this, arguments);
}

GameScene.extend(EventEmitter);

GameScene.prototype.fillScene = function (mapBodies) {

    this.actorManager.addNew({
        classId: ActorFactory.SHIP,
        positionX: 0,
        positionY: 0,
        angle: 0
    });

    var i = void 0;

    // for (i = 0; i < 1; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.MHULK,
    //         positionX: Utils.rand(-100, 100),
    //         positionY: Utils.rand(-100, 100),
    //         angle: 0
    //     });
    // }

    // for (i = 0; i < 1; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.MOOK,
    //         positionX: Utils.rand(-100, 100),
    //         positionY: Utils.rand(-100, 100),
    //         angle: 0
    //     });
    // }

    // for (i = 0; i < 1; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.PLASMAPICKUP,
    //         positionX: Utils.rand(-100, 100),
    //         positionY: Utils.rand(-100, 100),
    //         angle: 0
    //     });
    // }

    // for (i = 0; i < 0; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.DEBUG,
    //         positionX: Utils.rand(-100, 100),
    //         positionY: Utils.rand(-100, 100),
    //         angle: 0
    //     });
    // }

    this.addMapBodies(mapBodies);

    this.actorManager.addNew({
        classId: ActorFactory.ENEMYSPAWNER,
        positionX: -175,
        positionY: -147,
        angle: Utils.degToRad(0)
    });

    this.actorManager.addNew({
        classId: ActorFactory.ENEMYSPAWNER,
        positionX: 175,
        positionY: -307,
        angle: Utils.degToRad(0)
    });

    this.actorManager.addNew({
        classId: ActorFactory.ENEMYSPAWNER,
        positionX: -260,
        positionY: 814,
        angle: Utils.degToRad(-90)
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'ENERGYPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: -180,
        positionY: -14,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'ENERGYPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: -180,
        positionY: 48,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'PLASMAPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: 50,
        positionY: -287,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'SHIELDPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: 203,
        positionY: 236,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'SHIELDPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: -89,
        positionY: -312,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'SHIELDPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: -89,
        positionY: -280,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'SHIELDPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: 203,
        positionY: 175,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'SHIELDPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: -20,
        positionY: 1024,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'SHIELDPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: -60,
        positionY: 1024,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'ENERGYPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: -60,
        positionY: 814,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'ENERGYPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: -100,
        positionY: 814,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'ENERGYPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: -140,
        positionY: 814,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'MISSILEQUADPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: -292,
        positionY: 567,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'MISSILEQUADPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: -292,
        positionY: 531,
        angle: 0
    });
};

GameScene.prototype.update = function () {
    this.timer++;

    if (this.timer % 180 === 0) {
        this.checkGameEndCondition();
        this.checkGameOverCondition();
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

GameScene.prototype.checkGameOverCondition = function () {
    if (!this.actorManager.getFirstPlayerActor()) {
        this.emit({ type: 'gameEnded' });
    }
};

module.exports = GameScene;

},{"logic/actor/component/body/BaseBody":15,"shared/ActorFactory":104}],5:[function(require,module,exports){
'use strict';

function GameState() {
    this._state = this._createInitialState();
    this._props = this._createInitialProps();
    this._notifyOfStateChange();
    this._timer = 0;

    EventEmitter.apply(this, arguments);
}

GameState.extend(EventEmitter);

GameState.prototype._createInitialState = function () {
    return {
        weapons: ['plasmagun', 'lasgun', 'redlasgun', 'pulsewavegun', 'missilelauncher'],
        currentWeapons: ['plasmagun', 'lasgun', 'redlasgun', 'pulsewavegun', 'missilelauncher'],
        ammo: {
            energy: 100,
            plasma: 25,
            rads: 0,
            missiles: 0
        },
        ammoMax: {
            energy: 200,
            plasma: 200,
            rads: 10,
            missiles: 20
        },
        existingActorsByType: {},
        removedActorsByType: {}
    };
};

GameState.prototype._createInitialProps = function () {
    return {
        ammoRechargeRate: 60,
        pickupColors: {
            plasma: '#00d681',
            energy: '#ffc04d',
            rads: '#8a4dff',
            missiles: '#ff4d4d',
            coolant: '#8bc9ff',
            shield: '#66aaff'
        }
    };
};

GameState.prototype.update = function () {
    this._timer++;
    this.rechargeAmmo();
};

GameState.prototype.requestShoot = function (weaponName, ammoConfig) {
    if (this._canFireWeapon(weaponName, ammoConfig)) {
        this._subtractAmmo(ammoConfig);
        this._notifyOfStateChange();
        return true;
    } else {
        return false;
    }
};

GameState.prototype.getWeapons = function () {
    return this._state.weapons;
};

GameState.prototype.rechargeAmmo = function () {
    if (this._timer % this._props.ammoRechargeRate === 0) {
        this.addAmmo({ energy: 1 });
    }
};

GameState.prototype.handleShieldPickup = function (amount) {
    this._state.message = {
        text: amount + ' ' + 'SHIELDS',
        color: this._props.pickupColors['shield']
    };
    this._notifyOfStateChange();
};

GameState.prototype.addAmmo = function (ammoConfig, withMessage) {
    var _this = this;

    Object.keys(ammoConfig).forEach(function (ammoType) {
        _this._state.ammo[ammoType] += ammoConfig[ammoType];
        var notify = false;

        if (_this._state.ammo[ammoType] !== _this._state.ammoMax[ammoType]) {
            notify = true;
        }

        if (_this._state.ammo[ammoType] > _this._state.ammoMax[ammoType]) {
            _this._state.ammo[ammoType] = _this._state.ammoMax[ammoType];
        }

        if (withMessage) {
            _this._state.message = {
                text: ammoConfig[ammoType] + ' ' + ammoType.toUpperCase(),
                color: _this._props.pickupColors[ammoType]
            };
        }

        if (notify) {
            _this._notifyOfStateChange();
        }
    });
};

GameState.prototype.prepareMessage = function (text, color) {
    this._state.message = {
        text: text,
        color: color
    };
};

GameState.prototype.sendMessage = function (text, color) {
    this._state.message = {
        text: text,
        color: color
    };
    this._notifyOfStateChange();
};

GameState.prototype.addActorByType = function (type) {
    if (!this._state.existingActorsByType[type]) {
        this._state.existingActorsByType[type] = 0;
    }
    this._state.existingActorsByType[type]++;
};

GameState.prototype.removeActorByType = function (type) {
    if (!this._state.existingActorsByType[type]) {
        this._state.existingActorsByType[type] = 0;
    } else {
        this._state.existingActorsByType[type]--;
    }
};

GameState.prototype.getActorCountByType = function (type) {
    if (!this._state.existingActorsByType[type]) {
        this._state.existingActorsByType[type] = 0;
    }

    return this._state.existingActorsByType[type];
};

GameState.prototype._notifyOfStateChange = function () {
    this.emit({
        type: 'gameStateChange',
        data: this._state
    });
    this._cleanState();
};

GameState.prototype._cleanState = function () {
    this._state.message = null;
};

GameState.prototype._canFireWeapon = function (weaponName, ammoConfig) {
    var _this2 = this;

    var weaponExists = !!~this._state.weapons.indexOf(weaponName);
    var ammoTypes = Object.keys(ammoConfig);
    var canFire = true;
    if (weaponExists) {
        ammoTypes.forEach(function (ammoType) {
            if (!_this2._state.ammo[ammoType] || _this2._state.ammo[ammoType] < ammoConfig[ammoType]) {
                canFire = false;
                _this2.sendMessage('CANNOT FIRE ' + weaponName.toUpperCase() + '; AMMO MISSING: ' + ammoType.toUpperCase() + '!', '#ff5030');
            }
        });
        return canFire;
    } else {
        return false;
    }
};

GameState.prototype._subtractAmmo = function (ammoConfig) {
    var _this3 = this;

    Object.keys(ammoConfig).forEach(function (ammoType) {
        _this3._state.ammo[ammoType] -= ammoConfig[ammoType];
    });
};

module.exports = GameState;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

var WorkerBus = require('shared/WorkerBus');

function RenderBus() {
    WorkerBus.apply(this, arguments);
}

RenderBus.extend(WorkerBus);

//Worker bus events passed directly - too cpu-intensive for events
RenderBus.prototype.handleMessage = function (message) {
    switch (message.data.type) {
        case 'pause':
            this.core.onPause(message);
            break;
        case 'startGame':
            this.core.onStart(message);
            break;
        case 'aiImageDone':
            this.core.onAiImageDone(message);
            break;
        case 'inputState':
            this.core.onInputState(message);
            break;
        case 'mapHitmapsLoaded':
            this.core.onMapHitmapsLoaded(message);
            break;
        case 'weaponSwitched':
            this.core.onWeaponSwitched(message);
            break;
    }
};

module.exports = RenderBus;

},{"shared/WorkerBus":108}],8:[function(require,module,exports){
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
                    angle: body.angle,
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

},{}],9:[function(require,module,exports){
'use strict';

var ActorFactory = require('shared/ActorFactory')('logic');

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
    if (!this.gameState) throw new Error('No gameState for Logic ActorMAnager!');

    EventEmitter.apply(this, arguments);
}

ActorManager.extend(EventEmitter);

ActorManager.prototype.addNew = function (config) {
    if (Object.keys(this.storage).length >= Constants.STORAGE_SIZE) {
        throw new Error('Actor manager storage is full! Cannot create new Actor!');
    }

    var actor = this.factory.create(Object.assign(config, {
        manager: this,
        gameState: this.gameState,
        world: this.world,
        id: this.currentId
    }));

    actor.parent = config.parent;

    this.storage[this.currentId] = actor;
    this.currentId++;
    this.world.addBody(actor.getBody());
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
    delete this.storage[actor.id];
    this.world.prepareBodyForDeath(actor.getBody());
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

ActorManager.prototype.updateActorState = function (actor) {
    this.actorStatesChanged[actor.id] = actor.state;
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
        var distance = config.actor && playerActor ? Utils.distanceBetweenActors(config.actor, playerActor) : 0;
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

},{"shared/ActorFactory":104}],10:[function(require,module,exports){
'use strict';

var ActorFactory = require('shared/ActorFactory')('logic');

function BaseActor(config) {
    this.id = this.id || config.id;
    this.props = this._createProps(this.props || {});
    this.state = this._createState(this.state || {});
    this.timer = 0;

    this.gameState = config.gameState || null;
    this.manager = config.manager || null;

    this._body = this.createBody();
    if (!this._body) throw new Error('No body defined for Logic Actor!');

    this._body.position = [config.positionX || 0, config.positionY || 0];
    this._body.angle = config.angle || 0;
    this._body.actor = this;
    this._body.velocity = Utils.angleToVector(config.angle, config.velocity || 0);
    this._body.actorId = this.id;
    this._body.classId = config.classId;

    this._stepAngle = Utils.radToDeg((this.props.turnSpeed || 0) / Constants.LOGIC_REFRESH_RATE);
    this._thrust = 0;
    this._horizontalThrust = 0;
    this._angleForce = 0;

    if (this.props.isPlayer) {
        this.manager.attachPlayer(this);
    }

    this.gameState.addActorByType(this.props.type);

    Object.assign(this, this._mixinInstanceValues || {});
}

BaseActor.prototype.applyConfig = function (config) {
    for (var property in config) {
        this[property] = this[property] || config[property];
    }
    this.bodyConfig.collisionType = this.props.type;
};

BaseActor.prototype.getPosition = function () {
    return this._body.position;
};

BaseActor.prototype.getAngle = function () {
    return this._body.angle;
};

BaseActor.prototype.getStepAngle = function () {
    return this._stepAngle;
};

BaseActor.prototype.getVelocity = function () {
    return this._body.velocity;
};

BaseActor.prototype.applyRecoil = function (amount) {
    this._body.applyForceLocal([0, -amount]);
};

BaseActor.prototype.destroyBody = function () {
    return this._body.dead = true;
};

BaseActor.prototype.getAngleVector = function (leadFactor) {
    return Utils.angleToVector(this._body.angle, leadFactor || 1);
};

BaseActor.prototype.getBody = function () {
    return this._body;
};

BaseActor.prototype.setThrust = function (thrust) {
    this._thrust = thrust;
};

BaseActor.prototype.setHorizontalThrust = function (horizontalThrust) {
    this._horizontalThrust = horizontalThrust;
};

BaseActor.prototype.setAngleForce = function (angleForce) {
    this._angleForce = angleForce;
};

BaseActor.prototype.setMass = function (mass) {
    this._body.mass = mass;
    this._body.updateMassProperties();
};

BaseActor.prototype.getMass = function () {
    return this._body.mass;
};

BaseActor.prototype.playSound = function (sounds, volume) {
    this.manager.playSound({ sounds: sounds, actor: this, volume: volume || 1 });
};

BaseActor.prototype.createBody = function () {
    return null;
};

BaseActor.prototype.onCollision = function (otherActor, relativeContactPoint) {
    this._updateHpAndShieldOnCollision(otherActor, relativeContactPoint);

    if (this.state.hp <= 0 || this.props.removeOnHit) {
        this.deathMain(relativeContactPoint);
    }

    if (otherActor && this.state.pickup && otherActor.state.canPickup) {
        otherActor.handlePickup(this.state.pickup);
        this.deathMain(relativeContactPoint);
    }

    this.manager.updateActorState(this);

    this.customOnCollision();
};

BaseActor.prototype.update = function () {
    this.timer++;
    if (this.timer > this.props.timeout) {
        this.deathMain();
    }
    this.customUpdate();
    this.processMovement();
};

BaseActor.prototype.remove = function () {
    this.manager.removeActorAt(this.id);
};

BaseActor.prototype.handlePickup = function () {};

BaseActor.prototype.customOnCollision = function () {};

BaseActor.prototype.customUpdate = function () {};

BaseActor.prototype.playerUpdate = function () {};

BaseActor.prototype.onHit = function () {};

BaseActor.prototype.onSpawn = function () {};

BaseActor.prototype.onDeath = function () {};

BaseActor.prototype.deathMain = function (relativeContactPoint) {
    if (this.props.collisionFixesPosition && relativeContactPoint) {
        this._body.position = relativeContactPoint;
    }
    this.manager.actorDied(this);
    if (this.props.soundsOnDeath) {
        this.manager.playSound({ sounds: this.props.soundsOnDeath, actor: this });
    }
    this.gameState.removeActorByType(this.props.type);
    this.onDeath();
};

BaseActor.prototype.processMovement = function () {
    if (this._angleForce !== 0) {
        this._body.angularVelocity = this._angleForce * this.props.turnSpeed;
    } else {
        this._body.angularVelocity = 0;
    }

    if (this._thrust !== 0) {
        this._body.applyForceLocal([0, this._thrust * this.props.acceleration]);
    }

    if (this._horizontalThrust !== 0) {
        this._body.applyForceLocal([this._horizontalThrust * this.props.acceleration, 0]);
    }

    if (this.props.constantAcceleration) {
        this._body.applyForceLocal([0, this.props.constantAcceleration]);
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

BaseActor.prototype.spawn = function (config) {
    config = config || {};
    config.amount = config.amount || 1;
    config.angle = config.angle || 0;
    config.velocity = config.velocity || 0;
    config.classId = config.classId || ActorFactory.DEBUG;
    config.probability = (config.probability || 1) * 100;

    for (var i = 0; i < Utils.randArray(config.amount); i++) {
        if (config.probability === 100 || Utils.rand(1, 100) <= config.probability) {
            this.manager.addNew({
                classId: config.classId,
                positionX: this._body.position[0],
                positionY: this._body.position[1],
                angle: Utils.randArray(config.angle),
                velocity: Utils.randArray(config.velocity),
                parent: this
            });
        }
    }
};

BaseActor.prototype._createProps = function (props) {
    var newProps = Object.assign({}, props);
    if (!newProps.timeout && props.timeoutRandomMin && newProps.timeoutRandomMax) {
        newProps.timeout = Utils.rand(newProps.timeoutRandomMin, newProps.timeoutRandomMax);
    }
    return newProps;
};

BaseActor.prototype._createState = function (state) {
    var newProps = Object.assign({}, this.props);
    var newState = Object.assign({}, state);
    return Object.assign(newProps, newState);
};

BaseActor.prototype._updateHpAndShieldOnCollision = function (otherActor, relativeContactPoint) {
    if (otherActor && this.state.hp != Infinity && otherActor.props.damage > 0) {
        if (this.state.shield) {
            this.state.shield -= otherActor.props.damage;
            if (this.state.shield < 0) {
                this.state.hp += this.state.shield;
                this.state.shield = 0;
            }
            this.onHit(true);
        } else {
            this.state.hp -= otherActor.props.damage;
            this.onHit();
        }
        this.state.relativeContactPoint = relativeContactPoint;
    }
};

module.exports = BaseActor;

},{"shared/ActorFactory":104}],11:[function(require,module,exports){
'use strict';

var BaseActor = require('logic/actor/BaseActor');
var BaseBody = require('logic/actor/component/body/BaseBody');

function DebugActor(config) {
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);
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

module.exports = DebugActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15}],12:[function(require,module,exports){
'use strict';

var PlasmaGun = require('logic/actor/component/weapon/PlasmaGun');
var Blaster = require('logic/actor/component/weapon/Blaster');
var RedBlaster = require('logic/actor/component/weapon/RedBlaster');
var PulseWaveGun = require('logic/actor/component/weapon/PulseWaveGun');
var MissileLauncher = require('logic/actor/component/weapon/MissileLauncher');

function WeaponSystem(config) {
    Object.assign(this, config);

    this.weapons = this._createWeapons();

    if (!this.currentWeapon) {
        this.switchWeaponByIndex(0);
    }

    if (!this.actor) throw new Error('No actor for Logic WeaponSystem!');
    if (!this.gameState) throw new Error('No gameState for Logic WeaponSystem!');
}

WeaponSystem.prototype._createWeapons = function () {
    var _this = this;

    var weapons = [];
    var weaponNames = this.gameState.getWeapons();
    weaponNames.forEach(function (weaponName) {
        var creatorFunctionName = 'create' + Utils.firstToUpper(weaponName);
        if (creatorFunctionName && _this[creatorFunctionName] instanceof Function) {
            weapons[weaponName] = _this[creatorFunctionName](weaponName);
        } else {
            throw new Error('Could not find a creator for weapon: ' + weaponName + '. Expected creator name: ' + creatorFunctionName);
        }
    });
    return weapons;
};

WeaponSystem.prototype.shoot = function () {
    this.weapons[this.currentWeapon].shoot();
};

WeaponSystem.prototype.stopShooting = function () {
    if (this.weapons[this.currentWeapon]) {
        this.weapons[this.currentWeapon].stopShooting();
    }
};

WeaponSystem.prototype.switchWeapon = function (weaponName, silent) {
    if (this.weapons[weaponName]) {
        this.currentWeapon = weaponName;
        if (!silent) {
            this.actor.playSound(['cannon_change']);
        }
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

WeaponSystem.prototype.createLasgun = function (name) {
    return new Blaster({
        actor: this.actor,
        firingPoints: this.firingPoints,
        name: name,
        gameState: this.gameState
    });
};

WeaponSystem.prototype.createRedlasgun = function (name) {
    return new RedBlaster({
        actor: this.actor,
        firingPoints: this.firingPoints,
        name: name,
        gameState: this.gameState
    });
};

WeaponSystem.prototype.createPlasmagun = function (name) {
    return new PlasmaGun({
        actor: this.actor,
        firingPoints: this.firingPoints,
        name: name,
        gameState: this.gameState
    });
};

WeaponSystem.prototype.createPulsewavegun = function (name) {
    return new PulseWaveGun({
        actor: this.actor,
        firingPoints: this.firingPoints,
        name: name,
        gameState: this.gameState
    });
};

WeaponSystem.prototype.createMissilelauncher = function (name) {
    return new MissileLauncher({
        actor: this.actor,
        firingPoints: this.firingPoints,
        name: name,
        gameState: this.gameState
    });
};

module.exports = WeaponSystem;

},{"logic/actor/component/weapon/Blaster":17,"logic/actor/component/weapon/MissileLauncher":20,"logic/actor/component/weapon/PlasmaGun":22,"logic/actor/component/weapon/PulseWaveGun":23,"logic/actor/component/weapon/RedBlaster":24}],13:[function(require,module,exports){
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
    return this.playerActor.getPosition();
};

BaseBrain.prototype.getPlayerPositionWithLead = function () {
    var leadSpeed = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
    var leadSkill = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];


    var p = this.actor.getPosition();
    var tp = this.playerActor.getPosition();
    var tv = this.playerActor.getVelocity();
    var lv = this.actor.getAngleVector(leadSpeed);

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

},{}],14:[function(require,module,exports){
'use strict';

var BaseBrain = require('logic/actor/component/ai/BaseBrain');

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
    if (this.playerActor && this.playerActor._body) {
        this.timer++;

        if (this.timer % 30 === 0) {
            this.preferredTurn *= -1;
        }

        var nearbyWalls = this.detectNearbyWallsFast();
        var actorPosition = this.actor.getPosition();

        if (this.isWallBetween(actorPosition, this.playerActor.getPosition())) {
            if (this.gotoPoint) {
                if (!this.isWallBetween(actorPosition, this.gotoPoint)) {
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
            var positionOffset = Utils.angleToVector(this.actor.getAngle() + Utils.degToRad(this.wallDetectionAngles[a]), this.wallDetectionDistances[d]);
            var actorPosition = this.actor.getPosition();
            this.detectionResults[a] = this.isPositionInWall([actorPosition[0] + positionOffset[0], actorPosition[1] + positionOffset[1]]);
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
    this.gotoPoint = this.playerActor.getPosition();
    var distance = Utils.distanceBetweenActors(this.actor, this.playerActor);

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

    var position = this.actor.getPosition();

    var distance = Utils.distanceBetweenPoints(position[0], this.gotoPoint[0], position[1], this.gotoPoint[1]);

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
    var inArc = Utils.pointInArc(this.actor.getPosition(), this.playerActor.getPosition(), this.actor.getAngle(), this.shootingArc);
    var playerLive = this.playerActor.state.hp > 0;
    this.orders.shoot = inArc && playerLive;
};

MookBrain.prototype.randomStrafeAction = function () {
    if (Utils.rand(0, 100) > 98) {
        this.orders.horizontalThrust = Utils.rand(0, 2) - 1;
    }
};

MookBrain.prototype.playCalloutSound = function () {
    if (this.actor.calloutSound) {
        if (Utils.rand(0, 150) === 0) {
            this.actor.playSound([this.actor.calloutSound]);
        }
    }
};

module.exports = MookBrain;

},{"logic/actor/component/ai/BaseBrain":13}],15:[function(require,module,exports){
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
        case 'unCollidable':
            return new p2.Circle({
                radius: 0,
                collisionGroup: 0,
                collisionMask: 0
            });
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
        case 'pickup':
            return new p2.Circle({
                radius: this.radius,
                collisionGroup: Constants.COLLISION_GROUPS.PICKUP,
                collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.EXPLOSION
            });
        case 'playerShip':
            return new p2.Circle({
                radius: this.radius,
                collisionGroup: Constants.COLLISION_GROUPS.SHIP,
                collisionMask: Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.PICKUP | Constants.COLLISION_GROUPS.EXPLOSION
            });
        case 'enemyShip':
            return new p2.Circle({
                radius: this.radius,
                collisionGroup: Constants.COLLISION_GROUPS.ENEMY,
                collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.EXPLOSION
            });
        case 'enemyMapObject':
            return new p2.Circle({
                radius: this.radius,
                collisionGroup: Constants.COLLISION_GROUPS.ENEMY,
                collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.EXPLOSION
            });
        case 'terrain':
            return new p2.Box({
                height: this.height,
                width: this.width,
                collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
                collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.PICKUP
            });
        case 'terrain-convex':
            return new p2.Convex({
                vertices: this.vertices,
                collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
                collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE
            });
        case 'explosion':
            return new p2.Circle({
                radius: this.radius,
                collisionGroup: Constants.COLLISION_GROUPS.EXPLOSION,
                collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIP
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

},{}],16:[function(require,module,exports){
'use strict';

function BaseWeapon(config) {
    this.burstCount = 1;
    this.burstCooldown = 0;
    this.cooldown = 100;
    this.recoil = 0;
    this.velocity = 10;
    this.sound = null;
    this.name = config.name || 'baseWeapon';
    this.gameState = config.gameState;
    this.defaultEmptyTiming = 60;

    this.ammoConfig = {};

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
            var canShoot = !this.gameState || this.gameState.requestShoot(this.name, this.ammoConfig);
            if (canShoot) {
                this.processActiveWeapon();
            } else {
                this.shotsFired = 99999;
                this.timer = this.defaultEmptyTiming;
                this.actor.playSound(['empty']);
            }
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
    var position = this.actor.getPosition();
    var angle = this.actor.getAngle();
    var offsetPosition = Utils.angleToVector(angle + Utils.degToRad(firingPointConfig.offsetAngle), firingPointConfig.offsetDistance);
    this.actor.manager.addNew({
        classId: this.projectileClass,
        positionX: position[0] + offsetPosition[0],
        positionY: position[1] + offsetPosition[1],
        angle: angle + firingPointConfig.fireAngle,
        velocity: this.velocity
    });
};

BaseWeapon.prototype.handleFiringSimultaneous = function () {
    this.firingPoints.forEach(this.fireProjectile.bind(this));
    this.timer += this.burstCooldown;
    this.actor.applyRecoil(this.recoil);

    if (this.sound) {
        this.actor.playSound([this.sound], this.volume);
    }
};

BaseWeapon.prototype.handleFiringAlternate = function () {
    this.currentFiringPoint++;
    if (this.currentFiringPoint >= this.firingPoints.length) {
        this.currentFiringPoint = 0;
    }

    this.fireProjectile(this.firingPoints[this.currentFiringPoint]);
    this.timer += this.burstCooldown;
    this.actor.applyRecoil(this.recoil);

    if (this.sound) {
        this.actor.playSound([this.sound], this.volume);
    }
};

module.exports = BaseWeapon;

},{}],17:[function(require,module,exports){
'use strict';

var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function Blaster(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.LASERPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 45;
    this.velocity = 1800;
    this.burstCount = 3;
    this.burstCooldown = 5;
    this.sound = 'blue_laser';
    this.firingMode = 'simultaneous';
    this.ammoConfig = {
        energy: 1.5
    };
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":104}],18:[function(require,module,exports){
'use strict';

var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function EnemyMissileLauncher(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.ENEMYCONCSNMISSILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 100;
    this.velocity = 150;
    this.burstCount = 3;
    this.burstCooldown = 20;
    this.sound = 'missile';
    this.firingMode = 'alternate';
    this.volume = 1;
}

EnemyMissileLauncher.extend(BaseWeapon);

module.exports = EnemyMissileLauncher;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":104}],19:[function(require,module,exports){
'use strict';

var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function GreenBlaster(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.GREENLASERPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 120;
    this.velocity = 350;
    this.burstCount = 4;
    this.burstCooldown = 6;
    this.sound = 'laser_green';
}

GreenBlaster.extend(BaseWeapon);

module.exports = GreenBlaster;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":104}],20:[function(require,module,exports){
'use strict';

var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function MissileLauncher(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.CONCSNMISSILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 40;
    this.velocity = 100;
    this.sound = 'missile';
    this.firingMode = 'alternate';
    this.volume = 0.5;
    this.ammoConfig = {
        missiles: 1
    };
}

MissileLauncher.extend(BaseWeapon);

module.exports = MissileLauncher;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":104}],21:[function(require,module,exports){
'use strict';

var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function MoltenBallThrower(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.MOLTENPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.burstCount = 3;
    this.burstCooldown = 5;
    this.cooldown = 60;
    this.recoil = 100;
    this.velocity = 160;
    this.sound = 'molten';
    this.volume = 0.4;
}

MoltenBallThrower.extend(BaseWeapon);

module.exports = MoltenBallThrower;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":104}],22:[function(require,module,exports){
'use strict';

var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function PlasmaGun(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.PLASMAPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 7;
    this.velocity = 230;
    this.sound = 'plasmashot3';
    this.volume = 0.8;
    this.ammoConfig = {
        plasma: 1
    };
}

PlasmaGun.extend(BaseWeapon);

module.exports = PlasmaGun;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":104}],23:[function(require,module,exports){
'use strict';

var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function PlasmaGun(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.PULSEWAVEPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 5;
    this.velocity = 390;
    this.sound = 'disrupter';
    this.firingMode = 'alternate';
    this.volume = 0.5;
    this.ammoConfig = {
        energy: 0.8
    };
}

PlasmaGun.extend(BaseWeapon);

module.exports = PlasmaGun;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":104}],24:[function(require,module,exports){
'use strict';

var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function Blaster(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.REDLASERPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 15;
    this.velocity = 1400;
    this.sound = 'red_laser';
    this.firingMode = 'simultaneous';
    this.ammoConfig = {
        energy: 0.5
    };
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":104}],25:[function(require,module,exports){
'use strict';

var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function RingBlaster(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.RINGPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 80;
    this.velocity = 200;
    this.sound = 'disrupter';
}

RingBlaster.extend(BaseWeapon);

module.exports = RingBlaster;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":104}],26:[function(require,module,exports){
'use strict';

var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function SniperBlaster(config) {
    Object.assign(this, config);

    this.projectileClass = ActorFactory.PURPLELASERPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 150;
    this.velocity = 500;
    this.burstCount = 2;
    this.burstCooldown = 20;
    this.sound = 'laser_purple';
}

SniperBlaster.extend(BaseWeapon);

module.exports = SniperBlaster;

},{"logic/actor/component/weapon/BaseWeapon":16,"shared/ActorFactory":104}],27:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var EnemyMissileLauncher = require('logic/actor/component/weapon/EnemyMissileLauncher');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var DropMixin = require('logic/actor/mixin/DropMixin');

function MhulkActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.MHULK);

    this.calloutSound = 'mhulk';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();

    BaseActor.apply(this, arguments);
}

MhulkActor.extend(BaseActor);
MhulkActor.mixin(BrainMixin);
MhulkActor.mixin(DropMixin);

MhulkActor.prototype.createBrain = function () {
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        firingDistance: 800
    });
};

MhulkActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

MhulkActor.prototype.customUpdate = function () {
    if (this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

MhulkActor.prototype.createWeapon = function () {
    return new EnemyMissileLauncher({
        actor: this,
        manager: this.manager,
        firingMode: 'alternate',
        firingPoints: [{ offsetAngle: -37, offsetDistance: 12.5, fireAngle: 0 }, { offsetAngle: 37, offsetDistance: 12.5, fireAngle: 0 }]
    });
};

MhulkActor.prototype.onDeath = function () {
    var _this = this;

    this.spawn({
        amount: 20,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: 3,
        classId: ActorFactory.BOOMCHUNK,
        angle: [0, 360],
        velocity: [40, 80]
    });

    setTimeout(function () {
        _this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);

    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

MhulkActor.prototype.onHit = function () {
    this.spawn({
        amount: 1,
        probability: 0.3,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.playSound(['armorHit1', 'armorHit2'], 1);
};

module.exports = MhulkActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/ai/MookBrain":14,"logic/actor/component/body/BaseBody":15,"logic/actor/component/weapon/EnemyMissileLauncher":18,"logic/actor/mixin/BrainMixin":36,"logic/actor/mixin/DropMixin":37,"shared/ActorConfig":103,"shared/ActorFactory":104}],28:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var MoltenBallThrower = require('logic/actor/component/weapon/MoltenBallThrower');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var DropMixin = require('logic/actor/mixin/DropMixin');

function MookActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.MOOK);

    this.calloutSound = 'drone';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();

    BaseActor.apply(this, arguments);
}

MookActor.extend(BaseActor);
MookActor.mixin(BrainMixin);
MookActor.mixin(DropMixin);

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

MookActor.prototype.createWeapon = function () {
    return new MoltenBallThrower({
        actor: this,
        manager: this.manager,
        firingMode: 'alternate',
        firingPoints: [{ offsetAngle: -90, offsetDistance: 3.5, fireAngle: 0 }, { offsetAngle: 90, offsetDistance: 3.5, fireAngle: 0 }]
    });
};

MookActor.prototype.onDeath = function () {
    var _this = this;

    this.spawn({
        amount: 10,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });

    setTimeout(function () {
        _this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);

    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

MookActor.prototype.onHit = function () {
    this.spawn({
        amount: 1,
        probability: 0.3,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.playSound(['armorHit1', 'armorHit2'], 1);
};

module.exports = MookActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/ai/MookBrain":14,"logic/actor/component/body/BaseBody":15,"logic/actor/component/weapon/MoltenBallThrower":21,"logic/actor/mixin/BrainMixin":36,"logic/actor/mixin/DropMixin":37,"shared/ActorConfig":103,"shared/ActorFactory":104}],29:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var RingBlaster = require('logic/actor/component/weapon/RingBlaster');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var DropMixin = require('logic/actor/mixin/DropMixin');

function OrbotActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.ORBOT);

    this.calloutSound = 'orbot';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();

    BaseActor.apply(this, arguments);
}

OrbotActor.extend(BaseActor);
OrbotActor.mixin(BrainMixin);
OrbotActor.mixin(DropMixin);

OrbotActor.prototype.createBrain = function () {
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

OrbotActor.prototype.createWeapon = function () {
    return new RingBlaster({
        actor: this,
        manager: this.manager,
        firingPoints: [{ offsetAngle: 90, offsetDistance: 0.2, fireAngle: 0 }]
    });
};

OrbotActor.prototype.onDeath = function () {
    var _this = this;

    this.spawn({
        amount: 10,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });

    setTimeout(function () {
        _this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);

    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

OrbotActor.prototype.onHit = function () {
    this.spawn({
        amount: 1,
        probability: 0.3,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.playSound(['armorHit1', 'armorHit2'], 1);
};

module.exports = OrbotActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/ai/MookBrain":14,"logic/actor/component/body/BaseBody":15,"logic/actor/component/weapon/RingBlaster":25,"logic/actor/mixin/BrainMixin":36,"logic/actor/mixin/DropMixin":37,"shared/ActorConfig":103,"shared/ActorFactory":104}],30:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var GreenBlaster = require('logic/actor/component/weapon/GreenBlaster');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var DropMixin = require('logic/actor/mixin/DropMixin');

function ShulkActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.SHULK);

    this.calloutSound = 'shulk';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();

    BaseActor.apply(this, arguments);
}

ShulkActor.extend(BaseActor);
ShulkActor.mixin(BrainMixin);
ShulkActor.mixin(DropMixin);

ShulkActor.prototype.createBrain = function () {
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        firingDistance: 180
    });
};

ShulkActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

ShulkActor.prototype.customUpdate = function () {
    if (this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

ShulkActor.prototype.createWeapon = function () {
    return new GreenBlaster({
        actor: this,
        manager: this.manager,
        firingMode: 'alternate',
        firingPoints: [{ offsetAngle: -37, offsetDistance: 10.5, fireAngle: 0 }, { offsetAngle: 37, offsetDistance: 10.5, fireAngle: 0 }, { offsetAngle: -35, offsetDistance: 10, fireAngle: 0 }, { offsetAngle: 35, offsetDistance: 10, fireAngle: 0 }]
    });
};

ShulkActor.prototype.onDeath = function () {
    var _this = this;

    this.spawn({
        amount: 20,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: 1,
        classId: ActorFactory.BOOMCHUNK,
        angle: [0, 360],
        velocity: [20, 40]
    });

    setTimeout(function () {
        _this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);

    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

ShulkActor.prototype.onHit = function () {
    this.spawn({
        amount: 1,
        probability: 0.3,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.playSound(['armorHit1', 'armorHit2'], 1);
};

module.exports = ShulkActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/ai/MookBrain":14,"logic/actor/component/body/BaseBody":15,"logic/actor/component/weapon/GreenBlaster":19,"logic/actor/mixin/BrainMixin":36,"logic/actor/mixin/DropMixin":37,"shared/ActorConfig":103,"shared/ActorFactory":104}],31:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var SniperBlaster = require('logic/actor/component/weapon/SniperBlaster');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var DropMixin = require('logic/actor/mixin/DropMixin');

function SniperActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.SNIPER);

    this.calloutSound = 'sniper';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();

    BaseActor.apply(this, arguments);
}

SniperActor.extend(BaseActor);
SniperActor.mixin(BrainMixin);
SniperActor.mixin(DropMixin);

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

SniperActor.prototype.createWeapon = function () {
    return new SniperBlaster({
        actor: this,
        manager: this.manager,
        firingPoints: [{ offsetAngle: 10, offsetDistance: 5, fireAngle: 0 }]
    });
};

SniperActor.prototype.onDeath = function () {
    var _this = this;

    this.spawn({
        amount: 10,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });

    setTimeout(function () {
        _this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);

    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

SniperActor.prototype.onHit = function () {
    this.spawn({
        amount: 1,
        probability: 0.3,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.playSound(['armorHit1', 'armorHit2'], 1);
};

module.exports = SniperActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/ai/MookBrain":14,"logic/actor/component/body/BaseBody":15,"logic/actor/component/weapon/SniperBlaster":26,"logic/actor/mixin/BrainMixin":36,"logic/actor/mixin/DropMixin":37,"shared/ActorConfig":103,"shared/ActorFactory":104}],32:[function(require,module,exports){
'use strict';

var BaseActor = require('logic/actor/BaseActor');
var BaseBody = require('logic/actor/component/body/BaseBody');
var ActorFactory = require('shared/ActorFactory')('logic');

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

    if (rand < 1) {
        enemyType = ActorFactory.MHULK;
    } else if (rand >= 1 && rand < 3) {
        enemyType = ActorFactory.SHULK;
    } else if (rand >= 3 && rand < 7) {
        enemyType = ActorFactory.MOOK;
    } else if (rand >= 7 && rand < 10) {
        enemyType = ActorFactory.SNIPER;
    } else if (rand === 10) {
        enemyType = ActorFactory.ORBOT;
        mobsToSpawn = 2;
    }

    if (!this.created) {
        this.spawn({
            amount: mobsToSpawn,
            classId: enemyType,
            angle: [0, 360],
            velocity: [50, 100]
        });
        this.created = true;
    }

    this.playSound(['spawn'], 10);
};

module.exports = EnemySpawnMarkerActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorFactory":104}],33:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var DropMixin = require('logic/actor/mixin/DropMixin');

function EnemySpawnerActor(config) {
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ENEMYSPAWNER);
    BaseActor.apply(this, arguments);

    this.state.spawnDelay = 0;
}

EnemySpawnerActor.extend(BaseActor);
EnemySpawnerActor.mixin(DropMixin);

EnemySpawnerActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

EnemySpawnerActor.prototype.customUpdate = function () {
    if (this.state.spawnDelay > 0) {
        this.state.spawnDelay--;
    } else {
        var timeCondition = Utils.rand(Math.min(this.timer / 60, this.props.spawnRate), this.props.spawnRate) === this.props.spawnRate;
        var limitCondition = this.gameState.getActorCountByType('enemyShip') < this.state.globalMaxSpawnedEnemies;
        if (timeCondition && limitCondition) {
            this.createEnemySpawnMarker();
        }
    }

    if (this.timer % 10 === 0 && this.state.shield < this.props.shield) {
        this.state.shield += 5;
        if (this.state.shield > this.props.shield) {
            this.state.shield = this.props.shield;
        }
        this.manager.updateActorState(this);
    }
};

EnemySpawnerActor.prototype.createEnemySpawnMarker = function () {
    this.state.spawnDelay = this.props.spawnRate;

    this.spawn({
        classId: ActorFactory.ENEMYSPAWNMARKER,
        angle: [0, 0],
        velocity: [0, 0]
    });

    this.manager.updateActorState(this);
};

EnemySpawnerActor.prototype.onDeath = function () {
    this.spawn({
        amount: 40,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: 5,
        classId: ActorFactory.BOOMCHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });

    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

EnemySpawnerActor.prototype.onHit = function (shielded) {
    if (shielded) {
        this.playSound(['shieldHit1', 'shieldHit2', 'shieldHit3'], 10);
    } else {
        this.spawn({
            amount: 1,
            probability: 0.5,
            classId: ActorFactory.CHUNK,
            angle: [0, 360],
            velocity: [50, 100]
        });
        this.playSound(['armorHit1', 'armorHit2'], 10);
    }
};

module.exports = EnemySpawnerActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"logic/actor/mixin/DropMixin":37,"shared/ActorConfig":103,"shared/ActorFactory":104}],34:[function(require,module,exports){
'use strict';

var BaseActor = require('logic/actor/BaseActor');
var BaseBody = require('logic/actor/component/body/BaseBody');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');

function ItemSpawnerActor(config) {
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ITEMSPAWNER);
    BaseActor.apply(this, arguments);

    this.props.spawns = config.spawns || this.props.spawns;

    this.state.spawnDelay = this.props.spawns && this.props.spawns.spawnedInitially ? 0 : -1;
}

ItemSpawnerActor.extend(BaseActor);

ItemSpawnerActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

ItemSpawnerActor.prototype.customUpdate = function () {
    if (!this.props.spawns) {
        return;
    }

    if (this.state.spawnDelay === 0) {
        this.spawnPickup();
        this.state.spawnDelay--;
    } else if (this.state.spawnDelay > 0) {
        this.state.spawnDelay--;
    }
};

ItemSpawnerActor.prototype.spawnPickup = function () {
    this.spawn({
        amount: 1,
        classId: ActorFactory[this.props.spawns.class],
        angle: 0,
        velocity: 0
    });
};

ItemSpawnerActor.prototype.onPickupTaken = function () {
    this.state.spawnDelay = this.props.spawns.delayAfterPickup;
};

module.exports = ItemSpawnerActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103,"shared/ActorFactory":104}],35:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');

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
            collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.PICKUP
        });
        shapes.push(shape);
    }
    return shapes;
};

module.exports = MapActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15}],36:[function(require,module,exports){
"use strict";

var BrainMixin = {
    doBrainOrders: function doBrainOrders() {
        if (this.brain.orders.lookAtPosition) {
            this.lookAtPosition(this.brain.orders.lookAtPosition);
            if (this.brain.orders.turn !== 0) {
                this.setAngleForce(this.brain.orders.turn);
            }
        } else {
            this.setAngleForce(this.brain.orders.turn);
        }

        this.setThrust(this.brain.orders.thrust);
        this.setHorizontalThrust(this.brain.orders.horizontalThrust);

        if (this.brain.orders.shoot) {
            this.weapon.shoot();
        } else {
            this.weapon.stopShooting();
        }
    },
    lookAtPosition: function lookAtPosition(position) {
        var angleVector = this.getAngleVector();
        var actorPosition = this.getPosition();
        var angle = Utils.angleBetweenPointsFromCenter(angleVector, [position[0] - actorPosition[0], position[1] - actorPosition[1]]);

        if (angle < 180 && angle > 0) {
            this.setAngleForce(Math.min(angle / this.getStepAngle(), 1) * -1);
        }

        if (angle >= 180 && angle < 360) {
            this.setAngleForce(Math.min((360 - angle) / this.getStepAngle(), 1));
        }
    }
};

module.exports = BrainMixin;

},{}],37:[function(require,module,exports){
'use strict';

var ActorFactory = require('shared/ActorFactory')('logic');

var DropMixin = {
    handleDrops: function handleDrops() {
        var _this = this;

        if (!(this.props.drops instanceof Array)) return;

        this.props.drops.forEach(function (drop) {
            _this.spawn({
                amount: drop.amount || 1,
                probability: drop.probability || 1,
                classId: ActorFactory[drop.class],
                angle: [0, 360],
                velocity: [50, 100]
            });
        });
    }
};

module.exports = DropMixin;

},{"shared/ActorFactory":104}],38:[function(require,module,exports){
'use strict';

var InputMixin = {
    _hudModifiers: ['q', 'e'],

    applyLookAtAngleInput: function applyLookAtAngleInput(inputState) {
        var angleForce = 0;

        var lookTarget = Utils.angleToVector(inputState.mouseRotation, 1);
        var angleVector = this.getAngleVector();
        var angle = Utils.angleBetweenPointsFromCenter(angleVector, lookTarget);

        if (angle < 180 && angle > 0) {
            angleForce = Math.min(angle / this.getStepAngle(), 1) * -1;
        }

        if (angle >= 180 && angle < 360) {
            angleForce = Math.min((360 - angle) / this.getStepAngle(), 1);
        }

        this.setAngleForce(angleForce);
    },

    applyThrustInput: function applyThrustInput(inputState) {
        this.setThrust(0);
        this.setHorizontalThrust(0);

        if (inputState.a) {
            this.setHorizontalThrust(-1);
        }

        if (inputState.d) {
            this.setHorizontalThrust(1);
        }

        if (inputState.w) {
            this.setThrust(1);
        }

        if (inputState.s) {
            this.setThrust(-1);
        }
    },

    applyWeaponInput: function applyWeaponInput(inputState) {
        var inHud = this._hudModifiers.some(function (element) {
            return inputState[element];
        });

        if (!inHud) {
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
    }
};

module.exports = InputMixin;

},{}],39:[function(require,module,exports){
'use strict';

var PickupMixin = {
    _pickupValues: {
        shield: 10,
        energy: 25,
        plasma: 25,
        missileQuad: 4
    },

    handlePickup: function handlePickup(pickupType) {
        switch (pickupType) {
            case 'shield':
                this._handleShieldPickup();break;
            case 'energy':
                this._handleEnergyPickup();break;
            case 'plasma':
                this._handlePlasmaPickup();break;
            case 'missileQuad':
                this._handleMissileQuadPickup();break;
            default:
                break;
        }
        this.playSound(['powerup'], 1);
    },

    _handleShieldPickup: function _handleShieldPickup() {
        this.state.shield += this._pickupValues['shield'];
        if (this.state.shield > this.props.shield) {
            this.state.shield = this.props.shield;
        }
        this.gameState.handleShieldPickup(this._pickupValues['shield']);
    },

    _handleEnergyPickup: function _handleEnergyPickup() {
        if (!this.gameState) throw new Error('Cannot handle an energy pickup for an actor without gameState!');
        this.gameState.addAmmo({ energy: this._pickupValues['energy'] }, true);
    },

    _handlePlasmaPickup: function _handlePlasmaPickup() {
        if (!this.gameState) throw new Error('Cannot handle a plasma pickup for an actor without gameState!');
        this.gameState.addAmmo({ plasma: this._pickupValues['plasma'] }, true);
    },

    _handleMissileQuadPickup: function _handleMissileQuadPickup() {
        if (!this.gameState) throw new Error('Cannot handle a missileQuad pickup for an actor without gameState!');
        this.gameState.addAmmo({ missiles: this._pickupValues['missileQuad'] }, true);
    }
};

module.exports = PickupMixin;

},{}],40:[function(require,module,exports){
'use strict';

var ChunkActor = require('logic/actor/object/ChunkActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');

function BoomChunkActor(config) {
    config = config || [];
    this.applyConfig(ActorConfig.BOOMCHUNK);
    ChunkActor.apply(this, arguments);
    Object.assign(this, config);
}

BoomChunkActor.extend(ChunkActor);

BoomChunkActor.prototype.onDeath = function () {
    var _this = this;

    setTimeout(function () {
        _this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);
};

module.exports = BoomChunkActor;

},{"logic/actor/object/ChunkActor":41,"shared/ActorConfig":103,"shared/ActorFactory":104}],41:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

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
    this.setAngleForce(Utils.rand(-35, 35));
};

module.exports = ChunkActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],42:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function ExplosionActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.EXPLOSION);
    BaseActor.apply(this, arguments);
}

ExplosionActor.extend(BaseActor);

ExplosionActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

module.exports = ExplosionActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],43:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function EnergyPickupActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ENERGYPICKUP);
    BaseActor.apply(this, arguments);
    if (this.parent) {
        this.props.timeout = 9999999;
    }
}

EnergyPickupActor.extend(BaseActor);

EnergyPickupActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

EnergyPickupActor.prototype.onDeath = function () {
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};

module.exports = EnergyPickupActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],44:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function MissileQuadPickupActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.MISSILEQUADPICKUP);
    BaseActor.apply(this, arguments);
    if (this.parent) {
        this.props.timeout = 9999999;
    }
}

MissileQuadPickupActor.extend(BaseActor);

MissileQuadPickupActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

MissileQuadPickupActor.prototype.onDeath = function () {
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};

module.exports = MissileQuadPickupActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],45:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function PlasmaPickupActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PLASMAPICKUP);
    BaseActor.apply(this, arguments);
    if (this.parent) {
        this.props.timeout = 9999999;
    }
}

PlasmaPickupActor.extend(BaseActor);

PlasmaPickupActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

PlasmaPickupActor.prototype.onDeath = function () {
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};

module.exports = PlasmaPickupActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],46:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function ShieldPickupActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.SHIELDPICKUP);
    BaseActor.apply(this, arguments);
    if (this.parent) {
        this.props.timeout = 9999999;
    }
}

ShieldPickupActor.extend(BaseActor);

ShieldPickupActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

ShieldPickupActor.prototype.onDeath = function () {
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};

module.exports = ShieldPickupActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],47:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var WeaponSystem = require('logic/actor/component/WeaponSystem');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var InputMixin = require('logic/actor/mixin/InputMixin');
var PickupMixin = require('logic/actor/mixin/PickupMixin');

function ShipActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.SHIP);

    this.lastInputStateX = 0;
    this.lastInputStateY = 0;

    this.primaryWeaponSystem = this.createPrimaryWeaponSystem();
    this.secondaryWeaponSystem = this.createSecondaryWeaponSystem();

    var silent = true;
    this.primaryWeaponSystem.switchWeapon('redlasgun', silent);
    this.secondaryWeaponSystem.switchWeapon('plasmagun', silent);

    BaseActor.apply(this, arguments);
}

ShipActor.extend(BaseActor);
ShipActor.mixin(InputMixin);
ShipActor.mixin(PickupMixin);

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

ShipActor.prototype.createPrimaryWeaponSystem = function () {
    return new WeaponSystem({
        actor: this,
        gameState: this.gameState,
        firingPoints: [{ offsetAngle: -50, offsetDistance: 4, fireAngle: 0 }, { offsetAngle: 50, offsetDistance: 4, fireAngle: 0 }]
    });
};

ShipActor.prototype.createSecondaryWeaponSystem = function () {
    return new WeaponSystem({
        actor: this,
        gameState: this.gameState,
        firingPoints: [{ offsetAngle: -40, offsetDistance: 8, fireAngle: 0 }, { offsetAngle: 40, offsetDistance: 8, fireAngle: 0 }]
    });
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

ShipActor.prototype.onDeath = function () {
    this.spawn({
        amount: 40,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: 5,
        classId: ActorFactory.BOOMCHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });

    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

ShipActor.prototype.onHit = function (shielded) {
    if (shielded) {
        this.playSound(['shieldHit1', 'shieldHit2', 'shieldHit3'], 1);
    } else {
        this.spawn({
            amount: 1,
            probability: 0.5,
            classId: ActorFactory.CHUNK,
            angle: [0, 360],
            velocity: [50, 100]
        });
        this.playSound(['armorHit1', 'armorHit2'], 1);
    }
};

module.exports = ShipActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/WeaponSystem":12,"logic/actor/component/body/BaseBody":15,"logic/actor/mixin/InputMixin":38,"logic/actor/mixin/PickupMixin":39,"shared/ActorConfig":103,"shared/ActorFactory":104}],48:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');

function ConcsnMissileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.CONCSNMISSILE);
    BaseActor.apply(this, arguments);
}

ConcsnMissileActor.extend(BaseActor);

ConcsnMissileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

ConcsnMissileActor.prototype.onDeath = function () {
    var _this = this;

    setTimeout(function () {
        _this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);
};

module.exports = ConcsnMissileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103,"shared/ActorFactory":104}],49:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');

function EnemyConcsnMissileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ENEMYCONCSNMISSILE);
    BaseActor.apply(this, arguments);
}

EnemyConcsnMissileActor.extend(BaseActor);

EnemyConcsnMissileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

EnemyConcsnMissileActor.prototype.onDeath = function () {
    var _this = this;

    setTimeout(function () {
        _this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);
};

module.exports = EnemyConcsnMissileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103,"shared/ActorFactory":104}],50:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function GreenLaserProjectileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.GREENLASERPROJECTILE);
    BaseActor.apply(this, arguments);
}

GreenLaserProjectileActor.extend(BaseActor);

GreenLaserProjectileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

module.exports = GreenLaserProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],51:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

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

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],52:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

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

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],53:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

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

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],54:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

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
    this.setMass(this.getMass() * 0.96);
    this.props.damage *= 0.95;
};

module.exports = PulseWaveProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],55:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function PurpleLaserProjectileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PURPLELASERPROJECTILE);
    BaseActor.apply(this, arguments);
}

PurpleLaserProjectileActor.extend(BaseActor);

PurpleLaserProjectileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

module.exports = PurpleLaserProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],56:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

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

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],57:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

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
    this.setMass(this.getMass() * 0.96);
    this.props.damage *= 0.95;
};

module.exports = RingProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":103}],58:[function(require,module,exports){
"use strict";

function MapAiGraphCreator(config) {
    this.graph = {};
    this.positions = {};
}

MapAiGraphCreator.prototype.createGraph = function () {};

MapAiGraphCreator.prototype.createPositions = function () {};

module.exports = MapAiGraphCreator;

},{}],59:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');

function MapChunk(config) {
    if (!config.hitmap) throw new Error('no hitmap specified for a MapChunk!');

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
            collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.PICKUP
        }));
    }

    return multiShape;
};

module.exports = MapChunk;

},{"logic/actor/component/body/BaseBody":15}],60:[function(require,module,exports){
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
        name: 'chunk_HangarStraight_SideSmall_3',
        position: [0, 1],
        angle: 0
    }, {
        name: 'chunk_HangarStraight_SideSmall_3_terrain',
        position: [0, 1],
        angle: 0
    }, {
        name: 'chunk_HangarStraight_SideSmall_2',
        position: [0, 0],
        angle: 0
    }, {
        name: 'chunk_HangarStraight_SideSmall_2_terrain',
        position: [0, 0],
        angle: 0
    }];

    return this.mapLayout;
};

MapCreator.prototype.setPrototypeChunks = function (chunks) {
    this.chunkPrototypes = chunks;
};

module.exports = MapCreator;

},{}],61:[function(require,module,exports){
'use strict';

var MapChunk = require('logic/map/MapChunk');
var MapCreator = require('logic/map/MapCreator');
var MapAiGraphCreator = require('logic/map/MapAiGraphCreator');
var cloner = require('cloner');

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
        if (!_this.chunkPrototypes[chunkConfig.name]) {
            return;
        }
        var newChunk = cloner.deep.copy(_this.chunkPrototypes[chunkConfig.name]);
        newChunk.body.position[0] = chunkConfig.position[0] * Constants.CHUNK_SIZE;
        newChunk.body.position[1] = chunkConfig.position[1] * Constants.CHUNK_SIZE;
        newChunk.body.angle = Utils.degToRad(chunkConfig.angle);
        bodies.push(newChunk.body);
    });

    return bodies;
};

module.exports = MapManager;

},{"cloner":1,"logic/map/MapAiGraphCreator":58,"logic/map/MapChunk":59,"logic/map/MapCreator":60}],62:[function(require,module,exports){
'use strict';

var BaseStateChangeHandler = require('renderer/actor/component/stateChangeHandler/BaseStateChangeHandler');

function BaseActor(config, actorDependencies) {
    this.id = this.id || config.actorId;
    this.props = this._createProps(this.props || {});
    this.state = this._createState(this.state || {});
    this.timer = 0;

    this._manager = config.manager;
    this._particleManager = actorDependencies.particleManager;

    this._position = new Float32Array([config.positionX || 0, config.positionY || 0, config.positionZ || 10]);
    this._logicPosition = new Float32Array([this._position[0], this._position[1]]);
    this._logicPreviousPosition = new Float32Array([this._position[0], this._position[1]]);

    this._rotation = config.rotation || 0;
    this._logicRotation = this._rotation;
    this._logicPreviousRotation = this._rotation;

    this.updateFromLogic(config.positionX, config.positionY, config.rotation);

    this._meshes = this.createMeshes() || [];
    this._stateChangeHandler = this.createStateHandler();

    if (this.props.isPlayer) {
        this._manager.attachPlayer(this);
    }

    Object.assign(this, this._mixinInstanceValues || {});
}

BaseActor.prototype.applyConfig = function (config) {
    for (var property in config) {
        this[property] = this[property] || config[property];
    }
};

BaseActor.prototype.getPosition = function () {
    return this._position;
};

BaseActor.prototype.getRotation = function () {
    return this._rotation;
};

BaseActor.prototype.setRotation = function (rotation) {
    this._rotation = rotation;
};

BaseActor.prototype.setMeshAt = function (mesh, index) {
    this._meshes[index] = mesh;
};

BaseActor.prototype.setState = function (newState) {
    this.state = Object.assign(this.state, newState);
};

BaseActor.prototype.getMeshAt = function (index) {
    return this._meshes[index];
};

BaseActor.prototype.getOffsetPosition = function (distanceOffset, angleOffset) {
    return Utils.rotationToVector(this._rotation + (angleOffset || 0), distanceOffset || 0);
};

BaseActor.prototype.getRelativeContactPoint = function () {
    return this.state.relativeContactPoint;
};

BaseActor.prototype.setPosition = function (positionX, positionY) {
    this._position[0] = positionX || 0;
    this._position[1] = positionY || 0;
};

BaseActor.prototype.getCamera = function () {
    return this._manager.getCamera();
};

BaseActor.prototype.onDeath = function () {};

BaseActor.prototype.onSpawn = function () {};

BaseActor.prototype.customUpdate = function () {};

BaseActor.prototype.update = function (delta) {
    this.timer++;

    this._position[0] = this._logicPreviousPosition[0] + delta * (this._logicPosition[0] - this._logicPreviousPosition[0]);
    this._position[1] = this._logicPreviousPosition[1] + delta * (this._logicPosition[1] - this._logicPreviousPosition[1]);
    this._rotation = this._logicPreviousRotation + delta * (this._logicRotation - this._logicPreviousRotation);

    if (this._meshes) {
        for (var i = 0, l = this._meshes.length; i < l; i++) {
            this._meshes[i].update();
        }
    }

    this.customUpdate();
};

BaseActor.prototype.requestUiFlash = function (options) {
    this._manager.requestUiFlash(options);
};

BaseActor.prototype.requestShake = function () {
    this._manager.requestShake();
};

BaseActor.prototype.createStateHandler = function () {
    return new BaseStateChangeHandler({ actor: this });
};

BaseActor.prototype.createMeshes = function () {
    return [];
};

BaseActor.prototype.handleStateChange = function (newState) {
    this._stateChangeHandler.update(newState);
};

BaseActor.prototype.addToScene = function (scene) {
    if (this._meshes) {
        for (var i = 0, l = this._meshes.length; i < l; i++) {
            scene.add(this._meshes[i]);
        }
    }
};

BaseActor.prototype.removeFromScene = function (scene) {
    if (this._meshes) {
        for (var i = 0, l = this._meshes.length; i < l; i++) {
            scene.remove(this._meshes[i]);
        }
    }
};

BaseActor.prototype.updateFromLogic = function (positionX, positionY, rotation) {
    this._logicPreviousPosition[0] = this._logicPosition[0];
    this._logicPreviousPosition[1] = this._logicPosition[1];
    this._logicPreviousRotation = this._logicRotation;

    this._logicPosition[0] = positionX || 0;
    this._logicPosition[1] = positionY || 0;
    this._logicRotation = rotation || 0;
};

BaseActor.prototype._createProps = function (props) {
    var newProps = Object.assign({}, props);
    if (!newProps.timeout && props.timeoutRandomMin && newProps.timeoutRandomMax) {
        newProps.timeout = Utils.rand(newProps.timeoutRandomMin, newProps.timeoutRandomMax);
    }
    return newProps;
};

BaseActor.prototype._createState = function (state) {
    var newProps = Object.assign({}, this.props);
    var newState = Object.assign({}, state);
    return Object.assign(newProps, newState);
};

module.exports = BaseActor;

},{"renderer/actor/component/stateChangeHandler/BaseStateChangeHandler":71}],63:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function DebugActor() {
    BaseActor.apply(this, arguments);
}

DebugActor.extend(BaseActor);
DebugActor.mixin(ParticleMixin);

DebugActor.prototype.customUpdate = function () {
    this.createParticle({
        amount: 100,
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: 5,
        alpha: 1,
        alphaMultiplier: 0.75,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 5,
        spriteNumber: [0, 10],
        speedZ: 1
    });
};

module.exports = DebugActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82}],64:[function(require,module,exports){
'use strict';

function BaseMesh(config) {
    config.scaleX = config.scaleX || 1;
    config.scaleY = config.scaleY || 1;
    config.scaleZ = config.scaleZ || 1;

    config = config || {};

    THREE.Mesh.apply(this, [config.geometry, config.material]);
    this.rotationOffset = 0;
    this.positionOffset = config.positionOffset || [0, 0, 0];

    Object.assign(this, config);

    this.scale.x = config.scaleX;
    this.scale.y = config.scaleY;
    this.scale.z = config.scaleZ;

    this.receiveShadow = typeof config.shadows === 'undefined' ? true : config.shadows;
    this.castShadow = typeof config.shadows === 'undefined' ? true : config.shadows;
}

BaseMesh.extend(THREE.Mesh);

BaseMesh.prototype.customUpdate = function () {};

BaseMesh.prototype.update = function () {
    var position = this.actor.getPosition();
    var rotation = this.actor.getRotation();
    if (this.actor) {
        var offsetVector = Utils.rotateVector(this.positionOffset[0], this.positionOffset[1], rotation * -1);
        this.position.x = position[0] + offsetVector[0];
        this.position.y = position[1] + offsetVector[1];
        this.position.z = position[2] + this.positionOffset[2];
        this.rotation.z = rotation + this.rotationOffset;
    }
    this.customUpdate();
};

module.exports = BaseMesh;

},{}],65:[function(require,module,exports){
'use strict';

var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

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

},{"renderer/actor/component/mesh/BaseMesh":64,"renderer/assetManagement/model/ModelStore":102}],66:[function(require,module,exports){
'use strict';

var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function MissileMesh(config) {
    BaseMesh.apply(this, arguments);
    this.rotationOffset = Math.PI;

    config = config || {};
    config.geometry = ModelStore.get('missile').geometry;
    config.material = ModelStore.get('weaponModel').material;
    Object.assign(this, config);

    this.castShadow = true;
}

MissileMesh.extend(BaseMesh);

module.exports = MissileMesh;

},{"renderer/actor/component/mesh/BaseMesh":64,"renderer/assetManagement/model/ModelStore":102}],67:[function(require,module,exports){
'use strict';

var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function QuadMissileMesh(config) {
    BaseMesh.apply(this, arguments);
    this.rotationOffset = Math.PI;

    config = config || {};
    config.geometry = ModelStore.get('missilelauncher').geometry;
    config.material = ModelStore.get('weaponModel').material;
    Object.assign(this, config);

    this.spinSpeed = [0, 0, 0.05];

    this.castShadow = true;
}

QuadMissileMesh.extend(BaseMesh);

QuadMissileMesh.prototype.update = function () {
    var position = this.actor.getPosition();
    var rotation = this.actor.getRotation();
    if (this.actor) {
        var offsetVector = Utils.rotateVector(this.positionOffset[0], this.positionOffset[1], rotation * -1);
        this.position.x = position[0] + offsetVector[0];
        this.position.y = position[1] + offsetVector[1];
        this.position.z = position[2] + this.positionOffset[2];
        this.rotation.x += this.spinSpeed[0];
        this.rotation.y += this.spinSpeed[1];
        this.rotation.z += this.spinSpeed[2];
    }
    this.customUpdate();
};

module.exports = QuadMissileMesh;

},{"renderer/actor/component/mesh/BaseMesh":64,"renderer/assetManagement/model/ModelStore":102}],68:[function(require,module,exports){
'use strict';

var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function RavierMesh(config) {
    BaseMesh.apply(this, arguments);

    config = config || {};
    config.geometry = ModelStore.get('ravier_gunless').geometry;
    config.material = ModelStore.get('ravier').material;

    this.positionOffset = [0, -2, 0];

    Object.assign(this, config);
}

RavierMesh.extend(BaseMesh);

module.exports = RavierMesh;

},{"renderer/actor/component/mesh/BaseMesh":64,"renderer/assetManagement/model/ModelStore":102}],69:[function(require,module,exports){
'use strict';

var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function ShieldMesh(config) {
    BaseMesh.apply(this, arguments);

    if (!this.camera) throw new Error('ShieldMesh requires a camera but none was given');
    Object.assign(this, config);

    this.hitPosition = new THREE.Vector3(0, 0, 0);
    this.intensity = 0;
    this.shieldSize = this.actor.props.shieldSize || 1.5;
    this.shieldColor = new THREE.Color(this.actor.props.shieldColor || 0x5599dd);
    this.disabled = true;

    var vertexShader = this._createVertexShader();
    var fragmentShader = this._createFragmentShader();
    var material = this._createMaterial(vertexShader, fragmentShader);

    this.geometry = ModelStore.get('shieldSphere').geometry;
    this.material = material;
    this.scale.set(0.01, 0.01, 0.01);

    this.castShadow = false;
    this.receiveShadow = false;
}

ShieldMesh.extend(BaseMesh);

ShieldMesh.prototype.customUpdate = function () {
    this._updateIntensity();
    this._updateHitAngle();
};

ShieldMesh.prototype.setIntensity = function (intensity) {
    this.intensity = parseInt(intensity) - 100;
    this._enable();
};

ShieldMesh.prototype._disable = function () {
    if (!this.disabled) {
        this.scale.set(0.01, 0.01, 0.01);
        this.disabled = true;
    }
};

ShieldMesh.prototype._enable = function () {
    if (this.disabled) {
        this.scale.set(this.shieldSize, this.shieldSize, this.shieldSize);
        this.disabled = false;
    }
};

ShieldMesh.prototype._updateIntensity = function () {
    if (this.intensity > -100) {
        this.intensity -= 10;
        this.material.uniforms['c'].value = (this.intensity + Utils.rand(-10, 10)) / 100;
        this.shieldColor.b = Utils.rand(150, 255) / 256;
        this.material.uniforms.glowColor.value = this.shieldColor;
    } else {
        this._disable();
    }
};

ShieldMesh.prototype._updateHitAngle = function () {
    var angleDifference = void 0,
        offsetPosition = void 0;
    var contactPoint = this.actor.getRelativeContactPoint();
    if (contactPoint) {
        angleDifference = Utils.rotationBetweenPoints(contactPoint, this.actor.getPosition());
        offsetPosition = this.actor.getOffsetPosition(10, angleDifference);
        offsetPosition = Utils.rotationToVector(angleDifference - this.actor.getRotation(), 10);
        this.hitPosition.x = offsetPosition[0];
        this.hitPosition.y = offsetPosition[1];
        this.material.uniforms.viewVector.value = this.hitPosition;
    }
};

ShieldMesh.prototype._createMaterial = function (vertexShader, fragmentShader) {
    return new THREE.ShaderMaterial({
        uniforms: {
            'c': { type: 'f', value: 1 },
            'p': { type: 'f', value: 1.4 },
            glowColor: { type: 'c', value: this.shieldColor },
            viewVector: { type: 'v3', value: this.camera.position }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
};

ShieldMesh.prototype._createVertexShader = function () {
    return ' \
        uniform vec3 viewVector; \
        uniform float c; \
        uniform float p; \
        varying float intensity; \
        void main() \
        { \
            vec3 vNormal = normalize( normalMatrix * normal ); \
            vec3 vNormel = normalize( normalMatrix * viewVector ); \
            intensity = pow( c - dot(vNormal, vNormel), p ); \
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); \
        } \
    ';
};

ShieldMesh.prototype._createFragmentShader = function () {
    return ' \
        uniform vec3 glowColor; \
        varying float intensity; \
        void main() \
        { \
            vec3 glow = glowColor * intensity; \
            gl_FragColor = vec4( glow, 1.0 ); \
        } \
    ';
};

module.exports = ShieldMesh;

},{"renderer/actor/component/mesh/BaseMesh":64,"renderer/assetManagement/model/ModelStore":102}],70:[function(require,module,exports){
'use strict';

var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

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

},{"renderer/actor/component/mesh/BaseMesh":64,"renderer/assetManagement/model/ModelStore":102}],71:[function(require,module,exports){
"use strict";

function BaseStateChangeHandler(config) {
    config = config || {};
    Object.assign(this, config);
    this.actor = config.actor;
}

BaseStateChangeHandler.prototype.update = function (newState) {
    this.actor.setState(newState);
    this.customUpdate();
};

BaseStateChangeHandler.prototype.customUpdate = function () {};

module.exports = BaseStateChangeHandler;

},{}],72:[function(require,module,exports){
'use strict';

var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ActorConfig = require('shared/ActorConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function MhulkActor() {
    this.applyConfig(ActorConfig.MHULK);
    BaseActor.apply(this, arguments);
}

MhulkActor.extend(BaseActor);
MhulkActor.mixin(ParticleMixin);
MhulkActor.mixin(BobMixin);
MhulkActor.mixin(ShowDamageMixin);

MhulkActor.prototype.createMeshes = function () {
    return [new BaseMesh({
        actor: this,
        scaleX: 3.8,
        scaleY: 3.8,
        scaleZ: 3.8,
        geometry: ModelStore.get('mhulk').geometry,
        material: ModelStore.get('enemyModel').material
    })];
};

MhulkActor.prototype.customUpdate = function () {
    this.doBob();
    this.showDamage();
};

MhulkActor.prototype.onSpawn = function () {};

MhulkActor.prototype.onDeath = function () {
    this.createPremade({ premadeName: 'OrangeBoomLarge' });
    this.requestUiFlash('white');
    this.requestShake();
};

module.exports = MhulkActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/component/mesh/ShipMesh":70,"renderer/actor/mixin/BobMixin":81,"renderer/actor/mixin/ParticleMixin":82,"renderer/actor/mixin/ShowDamageMixin":83,"renderer/assetManagement/model/ModelStore":102,"shared/ActorConfig":103}],73:[function(require,module,exports){
'use strict';

var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ActorConfig = require('shared/ActorConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function MookActor() {
    this.applyConfig(ActorConfig.MOOK);
    BaseActor.apply(this, arguments);
}

MookActor.extend(BaseActor);
MookActor.mixin(ParticleMixin);
MookActor.mixin(BobMixin);
MookActor.mixin(ShowDamageMixin);

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
    this.doBob();
    this.showDamage();
    this.drawEyes();
};

MookActor.prototype.onSpawn = function () {};

MookActor.prototype.onDeath = function () {
    this.createPremade({ premadeName: 'OrangeBoomMedium' });
    this.requestUiFlash('white');
    this.requestShake();
};

MookActor.prototype.drawEyes = function () {
    var positionZ = this.getPosition()[2] - 8.7;
    this.createPremade({
        premadeName: 'RedEye',
        positionZ: positionZ,
        rotationOffset: 15,
        distance: 3.5
    });
    this.createPremade({
        premadeName: 'RedEye',
        positionZ: positionZ,
        rotationOffset: 345,
        distance: 3.5
    });
};

module.exports = MookActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/component/mesh/ShipMesh":70,"renderer/actor/mixin/BobMixin":81,"renderer/actor/mixin/ParticleMixin":82,"renderer/actor/mixin/ShowDamageMixin":83,"renderer/assetManagement/model/ModelStore":102,"shared/ActorConfig":103}],74:[function(require,module,exports){
'use strict';

var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ActorConfig = require('shared/ActorConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function OrbotActor() {
    this.applyConfig(ActorConfig.ORBOT);
    BaseActor.apply(this, arguments);
}

OrbotActor.extend(BaseActor);
OrbotActor.mixin(ParticleMixin);
OrbotActor.mixin(BobMixin);
OrbotActor.mixin(ShowDamageMixin);

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
    this.doBob();
    this.showDamage();
    this.drawEyes();
};

OrbotActor.prototype.onSpawn = function () {};

OrbotActor.prototype.onDeath = function () {
    this.createPremade({ premadeName: 'OrangeBoomMedium' });
    this.requestUiFlash('white');
    this.requestShake();
};

OrbotActor.prototype.drawEyes = function () {
    var positionZ = this.getPosition()[2] - 8.2;
    if (this.timer % 20 === 0) {
        this.createPremade({
            premadeName: 'RedEyeBig',
            positionZ: positionZ,
            rotationOffset: 0,
            distance: 1.65
        });
    }
};

module.exports = OrbotActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/component/mesh/ShipMesh":70,"renderer/actor/mixin/BobMixin":81,"renderer/actor/mixin/ParticleMixin":82,"renderer/actor/mixin/ShowDamageMixin":83,"renderer/assetManagement/model/ModelStore":102,"shared/ActorConfig":103}],75:[function(require,module,exports){
'use strict';

var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ActorConfig = require('shared/ActorConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function ShulkActor() {
    this.applyConfig(ActorConfig.SHULK);
    BaseActor.apply(this, arguments);
}

ShulkActor.extend(BaseActor);
ShulkActor.mixin(ParticleMixin);
ShulkActor.mixin(BobMixin);
ShulkActor.mixin(ShowDamageMixin);

ShulkActor.prototype.createMeshes = function () {
    return [new BaseMesh({
        actor: this,
        scaleX: 6,
        scaleY: 6,
        scaleZ: 6,
        geometry: ModelStore.get('shulk').geometry,
        material: ModelStore.get('enemyModel').material
    })];
};

ShulkActor.prototype.customUpdate = function () {
    this.doBob();
    this.showDamage();
};

ShulkActor.prototype.onSpawn = function () {};

ShulkActor.prototype.onDeath = function () {
    this.createPremade({ premadeName: 'OrangeBoomLarge' });
    this.requestUiFlash('white');
    this.requestShake();
};

module.exports = ShulkActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/component/mesh/ShipMesh":70,"renderer/actor/mixin/BobMixin":81,"renderer/actor/mixin/ParticleMixin":82,"renderer/actor/mixin/ShowDamageMixin":83,"renderer/assetManagement/model/ModelStore":102,"shared/ActorConfig":103}],76:[function(require,module,exports){
'use strict';

var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ActorConfig = require('shared/ActorConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function SniperActor() {
    this.applyConfig(ActorConfig.SNIPER);
    BaseActor.apply(this, arguments);
    this.eyeRotation = 0;
    this.eyeSpeed = 3;
    this.eyeEdge = 50;
    this.eyeGoingRight = true;
}

SniperActor.extend(BaseActor);
SniperActor.mixin(ParticleMixin);
SniperActor.mixin(BobMixin);
SniperActor.mixin(ShowDamageMixin);

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
    this.doBob();
    this.showDamage();
    this.drawEyes();
};

SniperActor.prototype.onSpawn = function () {};

SniperActor.prototype.onDeath = function () {
    this.createPremade({ premadeName: 'OrangeBoomMedium' });
    this.requestUiFlash('white');
    this.requestShake();
};

SniperActor.prototype.drawEyes = function () {
    if (this.eyeRotation > this.eyeEdge) {
        this.eyeGoingRight = false;
    }

    if (this.eyeRotation < -this.eyeEdge) {
        this.eyeGoingRight = true;
    }

    this.eyeRotation += this.eyeSpeed * (this.eyeGoingRight ? 1 : -1);

    var positionZ = this.getPosition()[2] - 7.4;
    this.createPremade({
        premadeName: 'PurpleEye',
        positionZ: positionZ,
        rotationOffset: this.eyeRotation,
        distance: 2.3
    });
};

module.exports = SniperActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/component/mesh/ShipMesh":70,"renderer/actor/mixin/BobMixin":81,"renderer/actor/mixin/ParticleMixin":82,"renderer/actor/mixin/ShowDamageMixin":83,"renderer/assetManagement/model/ModelStore":102,"shared/ActorConfig":103}],77:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function EnemySpawnMarkerActor(config) {
    Object.apply(this, config);
    BaseActor.apply(this, arguments);
}

EnemySpawnMarkerActor.extend(BaseActor);
EnemySpawnMarkerActor.mixin(ParticleMixin);

EnemySpawnMarkerActor.prototype.customUpdate = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: Utils.rand(this.timer / 5, this.timer / 5 + 20),
        alpha: this.timer / 480,
        alphaMultiplier: 0.8,
        lifeTime: 2
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'WHITE',
        scale: Utils.rand(this.timer / 10, this.timer / 10 + 10),
        alpha: this.timer / 480,
        alphaMultiplier: 0.8,
        lifeTime: 2
    });

    for (var i = 0; i < this.timer / 15; i++) {
        var rotation = Utils.rand(0, 360);
        var offsetPosition = Utils.rotationToVector(rotation, Utils.rand(20, 30));
        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPosition[0],
            offsetPositionY: offsetPosition[1],
            color: 'PURPLE',
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
        this.createParticle({
            particleClass: 'particleAdd',
            color: 'PURPLE',
            scale: 50,
            alpha: 0.25,
            alphaMultiplier: 0.7,
            particleVelocity: 2,
            particleRotation: 360 / pointCount * i,
            lifeTime: 5
        });

        this.createParticle({
            particleClass: 'particleAdd',
            color: 'WHITE',
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

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82}],78:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ActorConfig = require('shared/ActorConfig');
var ShieldMesh = require('renderer/actor/component/mesh/ShieldMesh');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function EnemySpawnerActor(config) {
    this.applyConfig(ActorConfig.ENEMYSPAWNER);
    Object.apply(this, config);
    BaseActor.apply(this, arguments);

    this.bottomMesh = this.createBottomMesh();
    this.topMesh = this.createTopMesh();
    this.shieldMesh = new ShieldMesh({ actor: this, sourceMesh: this.shipMesh, camera: this.getCamera() });

    this.setupMeshes();

    this.rotationSpeed = 0;
    this.spawnDelay = 0;
}

EnemySpawnerActor.extend(BaseActor);
EnemySpawnerActor.mixin(ParticleMixin);

EnemySpawnerActor.prototype.onSpawn = function () {};

EnemySpawnerActor.prototype.onDeath = function () {
    var makeBoomRandomly = function makeBoomRandomly() {
        var actorPosition = this.getPosition();
        var position = [actorPosition[0] + Utils.rand(-5, 5), actorPosition[1] + Utils.rand(-5, 5)];
        this.createPremade({ premadeName: 'OrangeBoomLarge', position: position });
        this.requestUiFlash('white');
        this.requestShake();
    };

    for (var i = 0; i < 5; i++) {
        setTimeout(makeBoomRandomly.bind(this), Utils.rand(0, 40));
    }
};

EnemySpawnerActor.prototype.showDamage = function () {
    var damageRandomValue = Utils.rand(0, 100) - 100 * (this.state.hp / this.props.hp);

    var offsetPosition = this.getOffsetPosition(-12);
    var actorPosition = this.getPosition();

    var position = [actorPosition[0] + offsetPosition[0] + Utils.rand(-8, 8), actorPosition[1] + offsetPosition[1] + Utils.rand(-8, 8)];

    if (damageRandomValue > 20) {
        this.createPremade({ premadeName: 'SmokePuffSmall', position: position });
    }

    if (damageRandomValue > 50 && Utils.rand(0, 100) > 90) {
        this.createPremade({ premadeName: 'BlueSparks', position: position });
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
    this.bottomMesh.material.emissiveIntensity = 0;
    this.topMesh.material.emissiveIntensity = 0;
};

EnemySpawnerActor.prototype.update = function () {
    this.timer++;
    this.bottomMesh.update();
    this.topMesh.update();
    this.shieldMesh.update();
    this.updateShield();

    this.doChargingAnimation();
    this.showDamage();
};

EnemySpawnerActor.prototype.updateShield = function () {
    if (this.state.shield < this._lastShield) {
        this.shieldMesh.setIntensity(200);
    }

    this._lastShield = this.state.shield;
};

EnemySpawnerActor.prototype.addToScene = function (scene) {
    scene.add(this.bottomMesh);
    scene.add(this.topMesh);
    scene.add(this.shieldMesh);
};

EnemySpawnerActor.prototype.removeFromScene = function (scene) {
    scene.remove(this.bottomMesh);
    scene.remove(this.topMesh);
    scene.remove(this.shieldMesh);
};

EnemySpawnerActor.prototype.doChargingAnimation = function () {
    if (this.state.spawnDelay > 0) {
        this.state.spawnDelay--;
        if (this.rotationSpeed < 0.2) {
            this.rotationSpeed += 0.0015;
        }
    } else {
        this.rotationSpeed *= 0.98;
    }
    var intensity = this.state.spawnDelay > 0 ? 1 - this.state.spawnDelay / this.props.spawnRate : 0;
    this.bottomMesh.material.emissiveIntensity = intensity;
    this.topMesh.material.emissiveIntensity = intensity;

    if (this.bottomMesh.rotation.z !== 0) {
        this.topMesh.rotation.z += this.rotationSpeed;
    } else {
        this.topMesh.rotation.y += this.rotationSpeed;
    }
};

module.exports = EnemySpawnerActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/component/mesh/BaseMesh":64,"renderer/actor/component/mesh/ShieldMesh":69,"renderer/actor/mixin/ParticleMixin":82,"renderer/assetManagement/model/ModelStore":102,"shared/ActorConfig":103}],79:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');

function ItemSpawnerActor() {
    BaseActor.apply(this, arguments);
}

ItemSpawnerActor.extend(BaseActor);

module.exports = ItemSpawnerActor;

},{"renderer/actor/BaseActor":62}],80:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');

function MapActor() {
    BaseActor.apply(this, arguments);
}

MapActor.extend(BaseActor);

module.exports = MapActor;

},{"renderer/actor/BaseActor":62}],81:[function(require,module,exports){
"use strict";

var BobMixin = {
    _mixinInstanceValues: {
        _bobZTop: 10,
        _bobSpeed: Utils.rand(18, 22) / 10000,
        _bobSpeedZ: Utils.rand(35, 45) / 1000
    },
    doBob: function doBob() {
        this._position[2] += this._bobSpeedZ;
        if (this._position[2] > this._bobZTop) {
            this._bobSpeedZ -= this._bobSpeed;
        } else {
            this._bobSpeedZ += this._bobSpeed;
        }
    }
};

module.exports = BobMixin;

},{}],82:[function(require,module,exports){
'use strict';

var ParticleMixin = {
    createPremade: function createPremade(config) {
        config = config || {};
        config.position = [this._position[0] + (config.offsetPositionX || 0), this._position[1] + (config.offsetPositionY || 0)];
        config.rotation = this._rotation;
        this._particleManager.createPremade(config.premadeName, config);
    },

    createParticle: function createParticle(config) {
        config = config || {};
        for (var i = 0, l = Utils.randArray(config.amount || 1); i < l; i++) {
            this._particleManager.createParticle(config.particleClass || 'particleNumberAdd', {
                positionX: this._position[0] + (config.offsetPositionX || 0),
                positionY: this._position[1] + (config.offsetPositionY || 0),
                positionZ: this._position[2] + (config.offsetPositionZ || 0) - Constants.DEFAULT_POSITION_Z,
                color: config.color,
                scale: Utils.randArray(config.scale || 1),
                alpha: Utils.randArray(config.alpha || 1),
                alphaMultiplier: Utils.randArray(config.alphaMultiplier || 1),
                particleVelocity: Utils.randArray(config.particleVelocity || 0),
                particleRotation: Utils.randArray(config.particleRotation ? config.particleRotation || 0 : this._rotation),
                lifeTime: Utils.randArray(config.lifeTime || 100),
                spriteNumber: Utils.randArray(config.spriteNumber || 0),
                speedZ: Utils.randArray(config.speedZ || 0)
            });
        }
    }
};

module.exports = ParticleMixin;

},{}],83:[function(require,module,exports){
'use strict';

var ShowDamageMixin = {
    _mixinInstanceValues: {
        _lastHp: 0
    },
    showDamage: function showDamage(withFlash) {
        if (withFlash) {
            if (this.state.hp < this._lastHp) {
                this.requestUiFlash('red');
                this.requestShake();
            }
        }

        var damageRandomValue = Utils.rand(0, 100) - 100 * (this.state.hp / this.props.hp);
        if (damageRandomValue > 20) {
            this.createPremade({ premadeName: 'SmokePuffSmall' });
        }

        if (damageRandomValue > 50 && Utils.rand(0, 100) > 95) {
            this.createPremade({ premadeName: 'BlueSparks' });
        }

        this._lastHp = this.state.hp;
    }
};

module.exports = ShowDamageMixin;

},{}],84:[function(require,module,exports){
'use strict';

var ChunkActor = require('renderer/actor/object/ChunkActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function BoomChunkActor() {
    ChunkActor.apply(this, arguments);
}

BoomChunkActor.extend(ChunkActor);
BoomChunkActor.mixin(ParticleMixin);

BoomChunkActor.prototype.onDeath = function () {
    this.createPremade({ premadeName: 'OrangeBoomLarge' });
    this.requestUiFlash('white');
    this.requestShake();
};

module.exports = BoomChunkActor;

},{"renderer/actor/mixin/ParticleMixin":82,"renderer/actor/object/ChunkActor":85}],85:[function(require,module,exports){
'use strict';

var ChunkMesh = require('renderer/actor/component/mesh/ChunkMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function ChunkActor() {
    BaseActor.apply(this, arguments);
}

ChunkActor.extend(BaseActor);
ChunkActor.mixin(ParticleMixin);

ChunkActor.prototype.createMeshes = function () {
    return [new ChunkMesh({ actor: this, scaleX: Utils.rand(3, 15) / 10, scaleY: Utils.rand(3, 15) / 10, scaleZ: Utils.rand(3, 15) / 10 })];
};

ChunkActor.prototype.customUpdate = function () {
    if (this.timer % Utils.rand(5, 15) === 0) {
        this.createParticle({
            particleClass: 'smokePuffAlpha',
            offsetPositionX: Utils.rand(-2, 2),
            offsetPositionY: Utils.rand(-2, 2),
            color: 'WHITE',
            scale: Utils.rand(2, 5),
            alpha: 0.4,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0, 1) / 10,
            particleRotation: Utils.rand(0, 360),
            lifeTime: 60
        });
    }
};

ChunkActor.prototype.onDeath = function () {
    for (var i = 0; i < 10; i++) {
        this.createParticle({
            particleClass: 'smokePuffAlpha',
            offsetPositionX: Utils.rand(-1, 1),
            offsetPositionY: Utils.rand(-1, 1),
            color: 'WHITE',
            scale: Utils.rand(2, 5),
            alpha: 0.6,
            alphaMultiplier: 0.95,
            particleVelocity: Utils.rand(0, 3) / 10,
            particleRotation: Utils.rand(0, 360),
            lifeTime: 120
        });
    }
};

module.exports = ChunkActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/component/mesh/ChunkMesh":65,"renderer/actor/mixin/ParticleMixin":82}],86:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function ExplosionActor() {
    BaseActor.apply(this, arguments);
}

ExplosionActor.extend(BaseActor);
ExplosionActor.mixin(ParticleMixin);

module.exports = ExplosionActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82}],87:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function EnergyPickupActor() {
    BaseActor.apply(this, arguments);
}

EnergyPickupActor.extend(BaseActor);
EnergyPickupActor.mixin(ParticleMixin);

EnergyPickupActor.prototype.onDeath = function () {
    this.createPremade({
        premadeName: 'SmokePuffSmall',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

EnergyPickupActor.prototype.customUpdate = function () {
    this.createPremade({
        premadeName: 'EnergyPickup',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

module.exports = EnergyPickupActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82}],88:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var QuadMissileMesh = require('renderer/actor/component/mesh/QuadMissileMesh');

function MissileQuadPickupActor() {
    BaseActor.apply(this, arguments);
}

MissileQuadPickupActor.extend(BaseActor);
MissileQuadPickupActor.mixin(ParticleMixin);

MissileQuadPickupActor.prototype.createMeshes = function () {
    return [new QuadMissileMesh({ actor: this, scaleX: 1.4, scaleY: 1.4, scaleZ: 1.4 })];
};

MissileQuadPickupActor.prototype.onDeath = function () {
    this.createPremade({
        premadeName: 'SmokePuffSmall',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

MissileQuadPickupActor.prototype.customUpdate = function () {
    this.createPremade({
        premadeName: 'MissileQuadPickup',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

module.exports = MissileQuadPickupActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/component/mesh/QuadMissileMesh":67,"renderer/actor/mixin/ParticleMixin":82}],89:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function PlasmaPickupActor() {
    BaseActor.apply(this, arguments);
}

PlasmaPickupActor.extend(BaseActor);
PlasmaPickupActor.mixin(ParticleMixin);

PlasmaPickupActor.prototype.onDeath = function () {
    this.createPremade({
        premadeName: 'SmokePuffSmall',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

PlasmaPickupActor.prototype.customUpdate = function () {
    this.createPremade({
        premadeName: 'PlasmaPickup',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

module.exports = PlasmaPickupActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82}],90:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function ShieldPickupActor() {
    BaseActor.apply(this, arguments);
}

ShieldPickupActor.extend(BaseActor);
ShieldPickupActor.mixin(ParticleMixin);

ShieldPickupActor.prototype.onDeath = function () {
    this.createPremade({
        premadeName: 'SmokePuffSmall',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

ShieldPickupActor.prototype.customUpdate = function () {
    this.createPremade({
        premadeName: 'ShieldPickup',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

module.exports = ShieldPickupActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82}],91:[function(require,module,exports){
'use strict';

var RavierMesh = require('renderer/actor/component/mesh/RavierMesh');
var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ShieldMesh = require('renderer/actor/component/mesh/ShieldMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var BaseActor = require('renderer/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function ShipActor() {
    this.applyConfig(ActorConfig.SHIP);
    BaseActor.apply(this, arguments);

    this.count = 0;
    this.weaponSetLocations = [[[3, -3, -0], [-3, -3, -0]], [[5, 0.5, -1.45], [-5, 0.5, -1.45]]];
    this.targetingLinePositions = this._createTargetingLinePositions();
    this.weaponMaterialName = 'weaponModel';

    this.targetingDistance = 100;
    this.targetingMinDistance = 20;
    this.targetingMaxDistance = 400;
    this.targetingYScale = 4;
    this.targetingOffset = 0;
    this.targetingFadeFactor = 100;

    this.setupWeaponMeshes(0, 'redlasgun');
    this.setupWeaponMeshes(1, 'plasmagun');
}

ShipActor.extend(BaseActor);
ShipActor.mixin(ParticleMixin);
ShipActor.mixin(BobMixin);
ShipActor.mixin(ShowDamageMixin);

ShipActor.prototype.createMeshes = function () {
    this.shipMesh = new RavierMesh({ actor: this, scaleX: 3.3, scaleY: 3.3, scaleZ: 3.3 });
    this.shieldMesh = new ShieldMesh({ actor: this, sourceMesh: this.shipMesh, camera: this.getCamera() });

    this.protectedMeshes = 2;
    return [this.shipMesh, this.shieldMesh];
};

ShipActor.prototype.customUpdate = function () {
    this.doEngineGlow();
    this.doBob();
    this.updateShield();
    this.showDamage(true);
    this.updateTargetingDistance();
    this.showTargetingLines();
};

ShipActor.prototype.onDeath = function () {
    this.createPremade({ premadeName: 'OrangeBoomLarge' });
    this.requestUiFlash('white');
    this.requestShake();
};

ShipActor.prototype.switchWeapon = function (changeConfig) {
    for (var i = 0, l = this.weaponSetLocations[changeConfig.index].length; i < l; i++) {
        var meshIndexLocation = l * changeConfig.index + i + this.protectedMeshes; //zeroth is reserved for ship
        var mesh = this.getMeshAt(meshIndexLocation);
        mesh.geometry = ModelStore.get(changeConfig.weapon).geometry;
        mesh.material = ModelStore.get('weaponModel').material;
    }
};

ShipActor.prototype.setupWeaponMeshes = function (slotNumber, geometryName, scales) {
    var defaultScale = 1;
    scales = scales || [];

    if (slotNumber >= this.weaponSetLocations.length) {
        throw new Error('This actor does not have a weapon slot of number', slotNumber);
    }

    for (var i = 0, l = this.weaponSetLocations[slotNumber].length; i < l; i++) {
        var meshIndexLocation = l * slotNumber + i + this.protectedMeshes; //zeroth is reserved for ship
        var mesh = new BaseMesh({
            actor: this,
            scaleX: scales[0] || defaultScale,
            scaleY: scales[1] || defaultScale,
            scaleZ: scales[2] || defaultScale,
            geometry: ModelStore.get(geometryName).geometry,
            material: ModelStore.get(this.weaponMaterialName).material,
            rotationOffset: Utils.degToRad(-90),
            positionOffset: [this.weaponSetLocations[slotNumber][i][0], this.weaponSetLocations[slotNumber][i][1], this.weaponSetLocations[slotNumber][i][2]]
        });

        this.setMeshAt(mesh, meshIndexLocation);
    }
};

ShipActor.prototype.updateShield = function () {
    if (this.state.shield < this._lastShield) {
        this.shieldMesh.setIntensity(200);
        this.requestUiFlash('red');
        this.requestShake();
    }
    this._lastShield = this.state.shield;
};

ShipActor.prototype.updateTargetingDistance = function () {
    var distance = this.inputListener.inputState.mouseY;
    distance *= -1 / this.targetingYScale;

    var offset = void 0;

    if (distance + this.targetingOffset < this.targetingMinDistance) {
        offset = this.targetingMinDistance - distance;
        if (offset > this.targetingOffset) {
            this.targetingOffset = offset;
        }
    } else if (distance + this.targetingOffset > this.targetingMaxDistance) {
        offset = this.targetingMaxDistance - distance;
        if (offset < this.targetingOffset) {
            this.targetingOffset = offset;
        }
    }

    this.targetingDistance = distance + this.targetingOffset;
};

ShipActor.prototype.showTargetingLines = function () {
    var offsetPosition = void 0,
        weaponOffsetPosition = void 0;
    var alpha = this.targetingDistance / this.targetingFadeFactor;
    for (var w = 0, wl = this.targetingLinePositions.length; w < wl; w++) {
        weaponOffsetPosition = this.getOffsetPosition(this.targetingLinePositions[w][0], Utils.degToRad(90));
        for (var i = 1, l = 10; i < l; i++) {
            offsetPosition = this.getOffsetPosition(this.targetingDistance * i / 10);
            this.createParticle({
                particleClass: 'particleAdd',
                offsetPositionX: offsetPosition[0] + weaponOffsetPosition[0],
                offsetPositionY: offsetPosition[1] + weaponOffsetPosition[1],
                color: 'WHITE',
                alphaMultiplier: 0.7,
                scale: 0.5,
                particleVelocity: 1,
                alpha: alpha,
                lifeTime: 1
            });
        }

        offsetPosition = this.getOffsetPosition(this.targetingDistance);
        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPosition[0] + weaponOffsetPosition[0],
            offsetPositionY: offsetPosition[1] + weaponOffsetPosition[1],
            color: 'WHITE',
            alphaMultiplier: 0.7,
            scale: 2 + this.targetingDistance / 100,
            particleVelocity: 1,
            alpha: 1,
            lifeTime: 1,
            spriteNumber: 6
        });
    }
};

ShipActor.prototype.doEngineGlow = function () {
    var positionZ = this.getPosition()[2] - Constants.DEFAULT_POSITION_Z;
    if (this.inputListener) {

        if (this.inputListener.inputState.w && !this.inputListener.inputState.s) {
            this.createPremade({
                premadeName: 'EngineGlowMedium',
                positionZ: positionZ,
                rotationOffset: 10,
                distance: -7.6
            });
            this.createPremade({
                premadeName: 'EngineGlowMedium',
                positionZ: positionZ,
                rotationOffset: 350,
                distance: -7.6
            });
        }

        if (this.inputListener.inputState.a && !this.inputListener.inputState.d) {
            this.createPremade({
                premadeName: 'EngineGlowSmall',
                positionZ: positionZ,
                rotationOffset: 25,
                distance: -6
            });
            this.createPremade({
                premadeName: 'EngineGlowSmall',
                positionZ: positionZ,
                rotationOffset: 170,
                distance: -4.2
            });
        }

        if (this.inputListener.inputState.d) {
            this.createPremade({
                premadeName: 'EngineGlowSmall',
                positionZ: positionZ,
                rotationOffset: 335,
                distance: -6
            });
            this.createPremade({
                premadeName: 'EngineGlowSmall',
                positionZ: positionZ,
                rotationOffset: 190,
                distance: -4.2
            });
        }

        if (this.inputListener.inputState.s) {
            this.createPremade({
                premadeName: 'EngineGlowMedium',
                positionZ: positionZ,
                rotationOffset: 180,
                distance: -5
            });
        }
    }
};

ShipActor.prototype._createTargetingLinePositions = function () {
    var targetingLinePositions = [];
    this.weaponSetLocations.forEach(function (weaponConfig) {
        return weaponConfig.forEach(function (finalWeaponConfig) {
            return targetingLinePositions.push(finalWeaponConfig);
        });
    });
    return targetingLinePositions;
};

module.exports = ShipActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/component/mesh/BaseMesh":64,"renderer/actor/component/mesh/RavierMesh":68,"renderer/actor/component/mesh/ShieldMesh":69,"renderer/actor/mixin/BobMixin":81,"renderer/actor/mixin/ParticleMixin":82,"renderer/actor/mixin/ShowDamageMixin":83,"renderer/assetManagement/model/ModelStore":102,"shared/ActorConfig":103}],92:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var MissileMesh = require('renderer/actor/component/mesh/MissileMesh');

function ConcsnMissileActor() {
    BaseActor.apply(this, arguments);
}

ConcsnMissileActor.extend(BaseActor);
ConcsnMissileActor.mixin(ParticleMixin);

ConcsnMissileActor.prototype.createMeshes = function () {
    return [new MissileMesh({ actor: this, scaleX: 2, scaleY: 2, scaleZ: 2 })];
};

ConcsnMissileActor.prototype.customUpdate = function () {
    var offsetPosition = this.getOffsetPosition(-5);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'YELLOW',
        scale: 3,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 2,
        lifeTime: 20
    });

    this.createParticle({
        particleClass: 'smokePuffAlpha',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'WHITE',
        scale: Utils.rand(3, 8),
        alpha: 0.4,
        alphaMultiplier: 0.95,
        particleVelocity: -2,
        lifeTime: 60
    });
};

ConcsnMissileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-10);
    this.createPremade({ premadeName: 'OrangeBoomLarge', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
    this.requestUiFlash('white');
    this.requestShake();
};

ConcsnMissileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'RED',
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'RED',
        scale: 12,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        lifeTime: 3
    });
};

module.exports = ConcsnMissileActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/component/mesh/MissileMesh":66,"renderer/actor/mixin/ParticleMixin":82}],93:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var MissileMesh = require('renderer/actor/component/mesh/MissileMesh');

function EnemyConcsnMissileActor() {
    BaseActor.apply(this, arguments);
}

EnemyConcsnMissileActor.extend(BaseActor);
EnemyConcsnMissileActor.mixin(ParticleMixin);

EnemyConcsnMissileActor.prototype.createMeshes = function () {
    return [new MissileMesh({ actor: this, scaleX: 2, scaleY: 2, scaleZ: 2 })];
};

EnemyConcsnMissileActor.prototype.customUpdate = function () {
    var offsetPosition = this.getOffsetPosition(-5);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'YELLOW',
        scale: 3,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 2,
        lifeTime: 20
    });

    this.createParticle({
        particleClass: 'smokePuffAlpha',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'WHITE',
        scale: Utils.rand(3, 8),
        alpha: 0.4,
        alphaMultiplier: 0.95,
        particleVelocity: -2,
        lifeTime: 60
    });
};

EnemyConcsnMissileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-10);
    this.createPremade({ premadeName: 'OrangeBoomLarge', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
    this.requestUiFlash('white');
    this.requestShake();
};

EnemyConcsnMissileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'RED',
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'RED',
        scale: 12,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        lifeTime: 3
    });
};

module.exports = EnemyConcsnMissileActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/component/mesh/MissileMesh":66,"renderer/actor/mixin/ParticleMixin":82}],94:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function GreenLaserProjectileActor() {
    BaseActor.apply(this, arguments);
}

GreenLaserProjectileActor.extend(BaseActor);
GreenLaserProjectileActor.mixin(ParticleMixin);

GreenLaserProjectileActor.prototype.customUpdate = function () {
    this.createPremade({ premadeName: 'GreenLaserTrail' });
};

GreenLaserProjectileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({ premadeName: 'GreenSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

GreenLaserProjectileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'GREEN',
        alphaMultiplier: 0.7,
        scale: 7,
        particleVelocity: 1,
        alpha: 7,
        lifeTime: 1
    });

    var offsetPosition = this.getOffsetPosition(3);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'GREEN',
        alphaMultiplier: 0.7,
        scale: 6,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'GREEN',
        scale: 15,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10,
        spriteNumber: 0
    });
};

module.exports = GreenLaserProjectileActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82}],95:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function LaserProjectileActor() {
    BaseActor.apply(this, arguments);
}

LaserProjectileActor.extend(BaseActor);
LaserProjectileActor.mixin(ParticleMixin);

LaserProjectileActor.prototype.customUpdate = function () {
    this.createPremade({ premadeName: 'BlueLaserTrail' });
};

LaserProjectileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({ premadeName: 'BlueSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

LaserProjectileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        scale: 12,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        lifeTime: 3
    });
};

module.exports = LaserProjectileActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82}],96:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function MoltenProjectileActor() {
    BaseActor.apply(this, arguments);
}

MoltenProjectileActor.extend(BaseActor);
MoltenProjectileActor.mixin(ParticleMixin);

MoltenProjectileActor.prototype.customUpdate = function () {
    this.createPremade({ premadeName: 'OrangeTrail' });
};

MoltenProjectileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({ premadeName: 'OrangeBoomTiny', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

MoltenProjectileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'ORANGE',
        scale: 60,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'ORANGE',
        scale: 30,
        alpha: 0.6,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10
    });
};

module.exports = MoltenProjectileActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82}],97:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function PlasmaProjectileActor() {
    BaseActor.apply(this, arguments);
}

PlasmaProjectileActor.extend(BaseActor);
PlasmaProjectileActor.mixin(ParticleMixin);

PlasmaProjectileActor.prototype.customUpdate = function () {
    this.createPremade({ premadeName: 'GreenTrail' });
};

PlasmaProjectileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-5);
    this.createPremade({ premadeName: 'GreenBoomTiny', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

PlasmaProjectileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'GREEN',
        alphaMultiplier: 0.7,
        scale: 7,
        particleVelocity: 1,
        alpha: 8,
        lifeTime: 1
    });

    var offsetPosition = this.getOffsetPosition(3);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'GREEN',
        alphaMultiplier: 0.7,
        scale: 7,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'GREEN',
        scale: 20,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10,
        spriteNumber: 0
    });
};

module.exports = PlasmaProjectileActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82}],98:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var ActorConfig = require('shared/ActorConfig');

function PulseWaveProjectileActor() {
    this.applyConfig(ActorConfig.PULSEWAVEPROJECTILE);
    BaseActor.apply(this, arguments);
}

PulseWaveProjectileActor.extend(BaseActor);
PulseWaveProjectileActor.mixin(ParticleMixin);

PulseWaveProjectileActor.prototype.customUpdate = function () {
    var ringSections = 20;
    var angle = Utils.degToRad(360 / ringSections);
    var zPosition = void 0,
        xPosition = void 0,
        offsetPosition = void 0;
    var timerFactor = this.timer / (this.props.timeout + 3);
    var radius = Utils.rand(15, 20) / 10 - timerFactor;

    for (var i = 0; i < ringSections; i++) {
        zPosition = Math.sin(i * angle) * radius;
        xPosition = Math.cos(i * angle) * radius;
        offsetPosition = this.getOffsetPosition(xPosition, Math.PI / 2);
        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPosition[0],
            offsetPositionY: offsetPosition[1],
            offsetPositionZ: zPosition,
            color: 'WHITE',
            scale: 1,
            alpha: 1 - timerFactor,
            alphaMultiplier: 0.9,
            particleVelocity: 0,
            lifeTime: 1
        });
    }

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        scale: 16 - timerFactor * 3,
        alpha: 1 - timerFactor,
        alphaMultiplier: 0.94,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1
    });
};

PulseWaveProjectileActor.prototype.onDeath = function () {
    var ringSections = 28;
    var angle = Utils.degToRad(360 / ringSections);
    var zPosition = void 0,
        xPosition = void 0,
        offsetPosition = void 0,
        xOffsetPosition = void 0;
    var timerFactor = this.timer / (this.props.timeout + 3);
    var radius = 5 - timerFactor * 3;

    for (var i = 0; i < ringSections; i++) {
        zPosition = Math.sin(i * angle) * radius;
        xPosition = Math.cos(i * angle) * radius;
        offsetPosition = this.getOffsetPosition(xPosition, Math.PI / 2);
        xOffsetPosition = this.getOffsetPosition(-5);

        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPosition[0] + xOffsetPosition[0],
            offsetPositionY: offsetPosition[1] + xOffsetPosition[1],
            offsetPositionZ: zPosition,
            color: 'BLUE',
            scale: 5,
            alpha: 2 - timerFactor * 2,
            alphaMultiplier: 0.6,
            particleVelocity: 0,
            lifeTime: 3
        });
    }

    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0] + xOffsetPosition[0],
        offsetPositionY: offsetPosition[1] + xOffsetPosition[1],
        color: 'BLUE',
        alphaMultiplier: 0.6,
        scale: 30,
        alpha: 2 - timerFactor * 2,
        lifeTime: 3
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'WHITE',
        scale: 24,
        alpha: 2 - timerFactor * 2,
        alphaMultiplier: 0.6,
        lifeTime: 3
    });
};

PulseWaveProjectileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        scale: 50,
        alpha: 1,
        alphaMultiplier: 0.2,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        scale: 30,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        lifeTime: 3
    });
};

module.exports = PulseWaveProjectileActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82,"shared/ActorConfig":103}],99:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function PurpleLaserProjectileActor() {
    BaseActor.apply(this, arguments);
}

PurpleLaserProjectileActor.extend(BaseActor);
PurpleLaserProjectileActor.mixin(ParticleMixin);

PurpleLaserProjectileActor.prototype.customUpdate = function () {
    this.createPremade({ premadeName: 'PurpleLaserTrail' });
};

PurpleLaserProjectileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({ premadeName: 'PurpleSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

PurpleLaserProjectileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: 15,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        lifeTime: 3
    });
};

module.exports = PurpleLaserProjectileActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82}],100:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function RedLaserProjectileActor() {
    BaseActor.apply(this, arguments);
}

RedLaserProjectileActor.extend(BaseActor);
RedLaserProjectileActor.mixin(ParticleMixin);

RedLaserProjectileActor.prototype.customUpdate = function () {
    this.createPremade({ premadeName: 'RedLaserTrail' });
};

RedLaserProjectileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({ premadeName: 'RedSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

RedLaserProjectileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'DEEPRED',
        scale: 20,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'RED',
        scale: 8,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        lifeTime: 3
    });
};

module.exports = RedLaserProjectileActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82}],101:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var ActorConfig = require('shared/ActorConfig');

function RingProjectileActor() {
    this.applyConfig(ActorConfig.RINGPROJECTILE);
    BaseActor.apply(this, arguments);
}

RingProjectileActor.extend(BaseActor);
RingProjectileActor.mixin(ParticleMixin);

RingProjectileActor.prototype.customUpdate = function () {
    var ringSections = 20;
    var angle = Utils.degToRad(360 / ringSections);
    var zPosition = void 0,
        xPosition = void 0,
        offsetPosition = void 0;
    var timerFactor = this.timer / (this.props.timeout + 3);
    var radius = Utils.rand(15, 20) / 10 - timerFactor;

    for (var i = 0; i < ringSections; i++) {
        zPosition = Math.sin(i * angle) * radius;
        xPosition = Math.cos(i * angle) * radius;
        offsetPosition = this.getOffsetPosition(xPosition, Math.PI / 2);
        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPosition[0],
            offsetPositionY: offsetPosition[1],
            offsetPositionZ: zPosition,
            color: 'WHITE',
            scale: 1,
            alpha: 1 - timerFactor,
            alphaMultiplier: 0.9,
            particleVelocity: 0,
            lifeTime: 1
        });
    }

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: 16 - timerFactor * 3,
        alpha: 1 - timerFactor,
        alphaMultiplier: 0.94,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1
    });
};

RingProjectileActor.prototype.onDeath = function () {
    var ringSections = 28;
    var angle = Utils.degToRad(360 / ringSections);
    var zPosition = void 0,
        xPosition = void 0,
        offsetPosition = void 0,
        xOffsetPosition = void 0;
    var timerFactor = this.timer / (this.props.timeout + 3);
    var radius = 5 - timerFactor * 3;

    for (var i = 0; i < ringSections; i++) {
        zPosition = Math.sin(i * angle) * radius;
        xPosition = Math.cos(i * angle) * radius;
        offsetPosition = this.getOffsetPosition(xPosition, Math.PI / 2);
        xOffsetPosition = this.getOffsetPosition(-5);

        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPosition[0] + xOffsetPosition[0],
            offsetPositionY: offsetPosition[1] + xOffsetPosition[1],
            offsetPositionZ: zPosition,
            color: 'PURPLE',
            scale: 5,
            alpha: 2 - timerFactor * 2,
            alphaMultiplier: 0.6,
            particleVelocity: 0,
            lifeTime: 3
        });
    }

    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0] + xOffsetPosition[0],
        offsetPositionY: offsetPosition[1] + xOffsetPosition[1],
        color: 'PURPLE',
        alphaMultiplier: 0.6,
        scale: 30,
        alpha: 2 - timerFactor * 2,
        lifeTime: 3
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'WHITE',
        scale: 24,
        alpha: 2 - timerFactor * 2,
        alphaMultiplier: 0.6,
        lifeTime: 3
    });
};

RingProjectileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: 50,
        alpha: 1,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: 30,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleRotation: this.getRotation(),
        lifeTime: 3
    });
};

module.exports = RingProjectileActor;

},{"renderer/actor/BaseActor":62,"renderer/actor/mixin/ParticleMixin":82,"shared/ActorConfig":103}],102:[function(require,module,exports){
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

},{}],103:[function(require,module,exports){
'use strict';

var ActorConfig = {
    SHIP: {
        props: {
            canPickup: true,
            acceleration: 1000,
            turnSpeed: 6,
            hp: 50,
            shield: 50,
            hpBarCount: 10,
            shieldBarCount: 10,
            isPlayer: true,
            type: 'playerShip'
        },
        bodyConfig: {
            mass: 4,
            damping: 0.85,
            angularDamping: 0,
            inertia: 10,
            radius: 7
        }
    },

    EXPLOSION: {
        props: {
            hp: 1000,
            damage: 10,
            removeOnHit: true,
            timeout: 1,
            type: 'explosion'
        },
        bodyConfig: {
            radius: 40,
            mass: 5
        }
    },

    PLASMAPROJECTILE: {
        props: {
            hp: 1,
            damage: 3,
            removeOnHit: true,
            timeout: 300,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 2,
            mass: 1
        }
    },

    LASERPROJECTILE: {
        props: {
            hp: 1,
            damage: 4,
            removeOnHit: true,
            timeout: 60,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.3,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    REDLASERPROJECTILE: {
        props: {
            hp: 1,
            damage: 2,
            removeOnHit: true,
            timeout: 60,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.3,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    MOLTENPROJECTILE: {
        props: {
            hp: 1,
            damage: 2,
            removeOnHit: true,
            timeout: 1000,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 1
        }
    },

    PULSEWAVEPROJECTILE: {
        props: {
            hp: 2,
            damage: 5,
            removeOnHit: true,
            timeout: 30,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 3,
            mass: 2.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 2
        }
    },

    PURPLELASERPROJECTILE: {
        props: {
            hp: 1,
            damage: 4,
            removeOnHit: true,
            timeout: 120,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    GREENLASERPROJECTILE: {
        props: {
            hp: 1,
            damage: 3,
            removeOnHit: true,
            timeout: 120,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    RINGPROJECTILE: {
        props: {
            hp: 1,
            damage: 5,
            removeOnHit: true,
            timeout: 120,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 3,
            mass: 20,
            ccdSpeedThreshold: 1,
            ccdIterations: 2
        }
    },

    CONCSNMISSILE: {
        props: {
            hp: 2,
            damage: 25,
            removeOnHit: true,
            timeout: 800,
            constantAcceleration: 400,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 2,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    ENEMYCONCSNMISSILE: {
        props: {
            hp: 1.5,
            damage: 10,
            removeOnHit: true,
            timeout: 800,
            constantAcceleration: 200,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    CHUNK: {
        props: {
            hp: 1,
            turnSpeed: 1,
            removeOnHit: false,
            timeoutRandomMin: 25,
            timeoutRandomMax: 100
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
            timeoutRandomMin: 5,
            timeoutRandomMax: 60,
            soundsOnDeath: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6']
        },
        bodyConfig: {
            mass: 0.01
        }
    },

    ENEMYSPAWNER: {
        props: {
            drops: [{ class: 'SHIELDPICKUP', amount: [1, 2] }, { class: 'ENERGYPICKUP', amount: [1, 2] }, { class: 'PLASMAPICKUP', amount: 1 }],
            danger: 4,
            hp: 80,
            shield: 100,
            shieldSize: 4,
            shieldColor: 0x5533ff,
            hpBarCount: 7,
            shieldBarCount: 7,
            barHeight: 12,
            removeOnHit: false,
            spawnRate: 240,
            globalMaxSpawnedEnemies: 16,
            enemy: true,
            type: 'enemyMapObject'
        },
        bodyConfig: {
            radius: 8
        }
    },

    ITEMSPAWNER: {
        props: {
            hp: 1,
            removeOnHit: false,
            spawns: { class: 'SHIELDPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
            type: 'unCollidable'
        },
        bodyConfig: {
            mass: 4,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 5
        }
    },

    MOOK: {
        props: {
            drops: [{ class: 'ENERGYPICKUP', probability: 0.1 }],
            danger: 1,
            acceleration: 140,
            turnSpeed: 2,
            hp: 6,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip'
        },
        bodyConfig: {
            mass: 4,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 5
        }
    },

    SHULK: {
        props: {
            drops: [{ class: 'ENERGYPICKUP', probability: 0.3 }, { class: 'SHIELDPICKUP', probability: 0.2 }],
            danger: 2,
            acceleration: 700,
            turnSpeed: 1.5,
            hp: 20,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip'
        },
        bodyConfig: {
            mass: 20,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 6
        }
    },

    MHULK: {
        props: {
            drops: [{ class: 'MISSILEQUADPICKUP', probability: 0.8 }, { class: 'MISSILEQUADPICKUP', probability: 0.2 }],
            danger: 3,
            acceleration: 700,
            turnSpeed: 0.9,
            hp: 60,
            hpBarCount: 7,
            enemy: true,
            type: 'enemyShip'
        },
        bodyConfig: {
            mass: 30,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 10
        }
    },

    ORBOT: {
        props: {
            drops: [{ class: 'PLASMAPICKUP', probability: 0.1 }],
            danger: 1,
            acceleration: 150,
            turnSpeed: 4,
            hp: 2,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip'
        },
        bodyConfig: {
            mass: 2,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 2
        }
    },

    SNIPER: {
        props: {
            drops: [{ class: 'SHIELDPICKUP', probability: 0.2 }],
            danger: 2,
            acceleration: 90,
            turnSpeed: 0.8,
            hp: 10,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip'
        },
        bodyConfig: {
            mass: 8,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 4
        }
    },

    SHIELDPICKUP: {
        props: {
            pickup: 'shield',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
            type: 'pickup'
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.75
        }
    },

    ENERGYPICKUP: {
        props: {
            pickup: 'energy',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
            type: 'pickup'
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.75
        }
    },

    PLASMAPICKUP: {
        props: {
            pickup: 'plasma',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
            type: 'pickup'
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.75
        }
    },

    MISSILEQUADPICKUP: {
        props: {
            pickup: 'missileQuad',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
            type: 'pickup'
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.75
        }
    }
};

module.exports = ActorConfig;

},{}],104:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//This is an auto-generated template file. Any changes will be overwritten!

var idMap = {
    SHIP: 1,
    MOOK: 2,
    SNIPER: 3,
    ORBOT: 4,
    SHULK: 5,
    MHULK: 6,
    CHUNK: 7,
    BOOMCHUNK: 8,
    EXPLOSION: 9,
    PLASMAPROJECTILE: 10,
    LASERPROJECTILE: 11,
    REDLASERPROJECTILE: 12,
    PURPLELASERPROJECTILE: 13,
    GREENLASERPROJECTILE: 14,
    MOLTENPROJECTILE: 15,
    RINGPROJECTILE: 16,
    PULSEWAVEPROJECTILE: 17,
    CONCSNMISSILE: 18,
    ENEMYCONCSNMISSILE: 19,
    MAP: 20,
    ENEMYSPAWNER: 21,
    ENEMYSPAWNMARKER: 22,
    ITEMSPAWNER: 23,
    DEBUG: 24,
    SHIELDPICKUP: 25,
    ENERGYPICKUP: 26,
    PLASMAPICKUP: 27,
    MISSILEQUADPICKUP: 28

};

function ActorFactory(context, actorDependencies) {
    var _actorMap;

    this.actorDependencies = actorDependencies;
    ActorFactory.ShipActor = context === 'renderer' ? require("renderer/actor/player/ShipActor") : require("logic/actor/player/ShipActor");
    ActorFactory.MookActor = context === 'renderer' ? require("renderer/actor/enemy/MookActor") : require("logic/actor/enemy/MookActor");
    ActorFactory.SniperActor = context === 'renderer' ? require("renderer/actor/enemy/SniperActor") : require("logic/actor/enemy/SniperActor");
    ActorFactory.OrbotActor = context === 'renderer' ? require("renderer/actor/enemy/OrbotActor") : require("logic/actor/enemy/OrbotActor");
    ActorFactory.ShulkActor = context === 'renderer' ? require("renderer/actor/enemy/ShulkActor") : require("logic/actor/enemy/ShulkActor");
    ActorFactory.MhulkActor = context === 'renderer' ? require("renderer/actor/enemy/MhulkActor") : require("logic/actor/enemy/MhulkActor");
    ActorFactory.ChunkActor = context === 'renderer' ? require("renderer/actor/object/ChunkActor") : require("logic/actor/object/ChunkActor");
    ActorFactory.BoomChunkActor = context === 'renderer' ? require("renderer/actor/object/BoomChunkActor") : require("logic/actor/object/BoomChunkActor");
    ActorFactory.ExplosionActor = context === 'renderer' ? require("renderer/actor/object/ExplosionActor") : require("logic/actor/object/ExplosionActor");
    ActorFactory.PlasmaProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaProjectileActor") : require("logic/actor/projectile/PlasmaProjectileActor");
    ActorFactory.LaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/LaserProjectileActor") : require("logic/actor/projectile/LaserProjectileActor");
    ActorFactory.RedLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RedLaserProjectileActor") : require("logic/actor/projectile/RedLaserProjectileActor");
    ActorFactory.PurpleLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PurpleLaserProjectileActor") : require("logic/actor/projectile/PurpleLaserProjectileActor");
    ActorFactory.GreenLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/GreenLaserProjectileActor") : require("logic/actor/projectile/GreenLaserProjectileActor");
    ActorFactory.MoltenProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/MoltenProjectileActor") : require("logic/actor/projectile/MoltenProjectileActor");
    ActorFactory.RingProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RingProjectileActor") : require("logic/actor/projectile/RingProjectileActor");
    ActorFactory.PulseWaveProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PulseWaveProjectileActor") : require("logic/actor/projectile/PulseWaveProjectileActor");
    ActorFactory.ConcsnMissileActor = context === 'renderer' ? require("renderer/actor/projectile/ConcsnMissileActor") : require("logic/actor/projectile/ConcsnMissileActor");
    ActorFactory.EnemyConcsnMissileActor = context === 'renderer' ? require("renderer/actor/projectile/EnemyConcsnMissileActor") : require("logic/actor/projectile/EnemyConcsnMissileActor");
    ActorFactory.MapActor = context === 'renderer' ? require("renderer/actor/map/MapActor") : require("logic/actor/map/MapActor");
    ActorFactory.EnemySpawnerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnerActor") : require("logic/actor/map/EnemySpawnerActor");
    ActorFactory.EnemySpawnMarkerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnMarkerActor") : require("logic/actor/map/EnemySpawnMarkerActor");
    ActorFactory.ItemSpawnerActor = context === 'renderer' ? require("renderer/actor/map/ItemSpawnerActor") : require("logic/actor/map/ItemSpawnerActor");
    ActorFactory.DebugActor = context === 'renderer' ? require("renderer/actor/DebugActor") : require("logic/actor/DebugActor");
    ActorFactory.ShieldPickupActor = context === 'renderer' ? require("renderer/actor/pickup/ShieldPickupActor") : require("logic/actor/pickup/ShieldPickupActor");
    ActorFactory.EnergyPickupActor = context === 'renderer' ? require("renderer/actor/pickup/EnergyPickupActor") : require("logic/actor/pickup/EnergyPickupActor");
    ActorFactory.PlasmaPickupActor = context === 'renderer' ? require("renderer/actor/pickup/PlasmaPickupActor") : require("logic/actor/pickup/PlasmaPickupActor");
    ActorFactory.MissileQuadPickupActor = context === 'renderer' ? require("renderer/actor/pickup/MissileQuadPickupActor") : require("logic/actor/pickup/MissileQuadPickupActor");

    this.actorMap = (_actorMap = {}, _defineProperty(_actorMap, idMap.SHIP, ActorFactory.ShipActor), _defineProperty(_actorMap, idMap.MOOK, ActorFactory.MookActor), _defineProperty(_actorMap, idMap.SNIPER, ActorFactory.SniperActor), _defineProperty(_actorMap, idMap.ORBOT, ActorFactory.OrbotActor), _defineProperty(_actorMap, idMap.SHULK, ActorFactory.ShulkActor), _defineProperty(_actorMap, idMap.MHULK, ActorFactory.MhulkActor), _defineProperty(_actorMap, idMap.CHUNK, ActorFactory.ChunkActor), _defineProperty(_actorMap, idMap.BOOMCHUNK, ActorFactory.BoomChunkActor), _defineProperty(_actorMap, idMap.EXPLOSION, ActorFactory.ExplosionActor), _defineProperty(_actorMap, idMap.PLASMAPROJECTILE, ActorFactory.PlasmaProjectileActor), _defineProperty(_actorMap, idMap.LASERPROJECTILE, ActorFactory.LaserProjectileActor), _defineProperty(_actorMap, idMap.REDLASERPROJECTILE, ActorFactory.RedLaserProjectileActor), _defineProperty(_actorMap, idMap.PURPLELASERPROJECTILE, ActorFactory.PurpleLaserProjectileActor), _defineProperty(_actorMap, idMap.GREENLASERPROJECTILE, ActorFactory.GreenLaserProjectileActor), _defineProperty(_actorMap, idMap.MOLTENPROJECTILE, ActorFactory.MoltenProjectileActor), _defineProperty(_actorMap, idMap.RINGPROJECTILE, ActorFactory.RingProjectileActor), _defineProperty(_actorMap, idMap.PULSEWAVEPROJECTILE, ActorFactory.PulseWaveProjectileActor), _defineProperty(_actorMap, idMap.CONCSNMISSILE, ActorFactory.ConcsnMissileActor), _defineProperty(_actorMap, idMap.ENEMYCONCSNMISSILE, ActorFactory.EnemyConcsnMissileActor), _defineProperty(_actorMap, idMap.MAP, ActorFactory.MapActor), _defineProperty(_actorMap, idMap.ENEMYSPAWNER, ActorFactory.EnemySpawnerActor), _defineProperty(_actorMap, idMap.ENEMYSPAWNMARKER, ActorFactory.EnemySpawnMarkerActor), _defineProperty(_actorMap, idMap.ITEMSPAWNER, ActorFactory.ItemSpawnerActor), _defineProperty(_actorMap, idMap.DEBUG, ActorFactory.DebugActor), _defineProperty(_actorMap, idMap.SHIELDPICKUP, ActorFactory.ShieldPickupActor), _defineProperty(_actorMap, idMap.ENERGYPICKUP, ActorFactory.EnergyPickupActor), _defineProperty(_actorMap, idMap.PLASMAPICKUP, ActorFactory.PlasmaPickupActor), _defineProperty(_actorMap, idMap.MISSILEQUADPICKUP, ActorFactory.MissileQuadPickupActor), _actorMap);
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

},{"logic/actor/DebugActor":11,"logic/actor/enemy/MhulkActor":27,"logic/actor/enemy/MookActor":28,"logic/actor/enemy/OrbotActor":29,"logic/actor/enemy/ShulkActor":30,"logic/actor/enemy/SniperActor":31,"logic/actor/map/EnemySpawnMarkerActor":32,"logic/actor/map/EnemySpawnerActor":33,"logic/actor/map/ItemSpawnerActor":34,"logic/actor/map/MapActor":35,"logic/actor/object/BoomChunkActor":40,"logic/actor/object/ChunkActor":41,"logic/actor/object/ExplosionActor":42,"logic/actor/pickup/EnergyPickupActor":43,"logic/actor/pickup/MissileQuadPickupActor":44,"logic/actor/pickup/PlasmaPickupActor":45,"logic/actor/pickup/ShieldPickupActor":46,"logic/actor/player/ShipActor":47,"logic/actor/projectile/ConcsnMissileActor":48,"logic/actor/projectile/EnemyConcsnMissileActor":49,"logic/actor/projectile/GreenLaserProjectileActor":50,"logic/actor/projectile/LaserProjectileActor":51,"logic/actor/projectile/MoltenProjectileActor":52,"logic/actor/projectile/PlasmaProjectileActor":53,"logic/actor/projectile/PulseWaveProjectileActor":54,"logic/actor/projectile/PurpleLaserProjectileActor":55,"logic/actor/projectile/RedLaserProjectileActor":56,"logic/actor/projectile/RingProjectileActor":57,"renderer/actor/DebugActor":63,"renderer/actor/enemy/MhulkActor":72,"renderer/actor/enemy/MookActor":73,"renderer/actor/enemy/OrbotActor":74,"renderer/actor/enemy/ShulkActor":75,"renderer/actor/enemy/SniperActor":76,"renderer/actor/map/EnemySpawnMarkerActor":77,"renderer/actor/map/EnemySpawnerActor":78,"renderer/actor/map/ItemSpawnerActor":79,"renderer/actor/map/MapActor":80,"renderer/actor/object/BoomChunkActor":84,"renderer/actor/object/ChunkActor":85,"renderer/actor/object/ExplosionActor":86,"renderer/actor/pickup/EnergyPickupActor":87,"renderer/actor/pickup/MissileQuadPickupActor":88,"renderer/actor/pickup/PlasmaPickupActor":89,"renderer/actor/pickup/ShieldPickupActor":90,"renderer/actor/player/ShipActor":91,"renderer/actor/projectile/ConcsnMissileActor":92,"renderer/actor/projectile/EnemyConcsnMissileActor":93,"renderer/actor/projectile/GreenLaserProjectileActor":94,"renderer/actor/projectile/LaserProjectileActor":95,"renderer/actor/projectile/MoltenProjectileActor":96,"renderer/actor/projectile/PlasmaProjectileActor":97,"renderer/actor/projectile/PulseWaveProjectileActor":98,"renderer/actor/projectile/PurpleLaserProjectileActor":99,"renderer/actor/projectile/RedLaserProjectileActor":100,"renderer/actor/projectile/RingProjectileActor":101}],105:[function(require,module,exports){
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
        EXPLOSION: Math.pow(2, 4),
        OBJECT: Math.pow(2, 6),
        PICKUP: Math.pow(2, 8),
        TERRAIN: Math.pow(2, 10)
    },

    STORAGE_SIZE: 1000,

    FOG_COLOR: 0x000000,

    FOG_DISTANCE_START: 350,

    CHUNK_SIZE: 768,

    MAX_SOUND_DISTANCE: 500
};

module.exports = Constants;

},{}],106:[function(require,module,exports){
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

},{}],107:[function(require,module,exports){
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
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    rand: function rand(min, max) {
        return min === max ? min : this.getRandomInteger(min, max);
    },

    randArray: function randArray(config) {
        if (config instanceof Array) {
            return this.rand(config[0], config[1]);
        } else {
            return config;
        }
    },

    makeRandomColor: function makeRandomColor() {
        var min = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var max = arguments.length <= 1 || arguments[1] === undefined ? 255 : arguments[1];
        var r = arguments[2];
        var g = arguments[3];
        var b = arguments[4];

        var colors = [r || '', g || '', b || ''];

        var newColor = 0;
        colors.forEach(function (color, index) {
            if (colors[index] === '') {
                newColor = this.rand(min, max).toString(16);
            } else {
                newColor = colors[index].toString(16);
            }
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

    gamePositionToScreenPosition: function gamePositionToScreenPosition(position, renderer, camera) {
        var vector = new THREE.Vector3();
        var canvas = renderer.domElement;

        vector.set(position[0], position[1], Constants.DEFAULT_POSITION_Z);
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
    },

    distanceBetweenActors: function distanceBetweenActors(actor1, actor2) {
        return this.distanceBetweenPoints(actor1._body.position[0], actor2._body.position[0], actor1._body.position[1], actor2._body.position[1]);
    }
};

if (!Function.prototype.extend) {
    Function.prototype.extend = function (oldClass) {
        this.prototype = Object.create(oldClass.prototype);
        this.prototype.constructor = oldClass;
    };
}

var mixinInit = function mixinInit(prototype, mixin) {
    var newMixinInstanceValues = Object.assign(prototype._mixinInstanceValues || {}, mixin._mixinInstanceValues);
    var newProto = Object.assign(this.prototype, mixin);
    newProto._mixinInstanceValues = newMixinInstanceValues;

    prototype = newProto;
};

if (!Function.prototype.mixin) {
    Function.prototype.mixin = function (mixins) {
        var _this = this;

        if (mixins instanceof Array) {
            mixins.forEach(function (mixin) {
                mixinInit.call(_this, _this.prototype, mixin);
            });
        } else {
            mixinInit.call(this, this.prototype, mixins);
        }
    };
}

module.exports = Utils;

},{}],108:[function(require,module,exports){
'use strict';

function WorkerBus(config) {
    if (!config.worker) throw new Error('No worker object specified for Workerbus!');
    if (!config.core) throw new Error('No core object specified for Workerbus!');
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
