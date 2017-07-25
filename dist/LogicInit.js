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

    var isBrowserMobile = Utils.isBrowserMobile();

    var LogicCore = require('logic/Core');
    self.core = new LogicCore({
        worker: self,
        isBrowserMobile: isBrowserMobile
    });
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"logic/Core":3,"shared/Constants":112,"shared/EventEmitter":114,"shared/Utils":115}],3:[function(require,module,exports){
'use strict';

var RenderBus = require('logic/RenderBus');
var GameWorld = require('logic/GameWorld');
var ActorManager = require('logic/actor/ActorManager');
var MapManager = require('logic/map/MapManager');
var GameScene = require('logic/GameScene');
var GameState = require('logic/GameState');
var WorldAiMapExtractor = require('logic/WorldAiMapExtractor');

function Core(config) {
    if (!config.worker) throw new Error('Logic core initialization failure!');

    this.isBrowserMobile = config.isBrowserMobile;

    this.createMainComponents(config.worker);
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

    this.scene = new GameScene({
        world: this.world,
        actorManager: this.actorManager,
        mapManager: this.mapManager,
        isBrowserMobile: this.isBrowserMobile
    });

    this.worldAiMapXtractor = new WorldAiMapExtractor({ world: this.world });
};

Core.prototype.createEventHandlers = function () {
    this.scene.on('newMapBodies', this.onNewMapBodies.bind(this));
    this.scene.on('gameFinished', this.onGameFinished.bind(this));
    this.scene.on('gameEnded', this.onPlayerDied.bind(this));

    this.mapManager.on('mapDone', this.onMapDone.bind(this));

    this.actorManager.on('actorStateChange', this.onActorStateChange.bind(this));
    this.actorManager.on('playSound', this.onPlaySound.bind(this));
    this.actorManager.on('weaponSwitched', this.onWeaponSwitched.bind(this));

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

Core.prototype.onUnpause = function () {
    this.running = true;
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

Core.prototype.onPlayerDied = function () {
    var _this2 = this;

    var killStats = this.gameState.getKillStats();

    setTimeout(function () {
        _this2.renderBus.postMessage('gameEnded', { killStats: killStats, enemyCausingDeathIndex: 0 });
        _this2.running = false;
    }, 2000);
};

Core.prototype.onGameFinished = function () {
    var _this3 = this;

    var killStats = this.gameState.getKillStats();

    setTimeout(function () {
        _this3.renderBus.postMessage('gameFinished', { killStats: killStats, enemyCausingDeathIndex: 0 });
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
    this.renderBus.postMessage('weaponSwitched', event.data);
};

Core.prototype.onGameStateChange = function (event) {
    this.renderBus.postMessage('gameStateChange', event.data);
};

Core.prototype.onDifficultyChange = function (event) {
    this.gameState.setDifficultyFactor(event.data.difficulty);
};

module.exports = Core;

},{"logic/GameScene":4,"logic/GameState":5,"logic/GameWorld":6,"logic/RenderBus":7,"logic/WorldAiMapExtractor":8,"logic/actor/ActorManager":9,"logic/map/MapManager":59}],4:[function(require,module,exports){
'use strict';

var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var EnemyConfig = require('shared/EnemyConfig');
var WeaponConfig = require('shared/WeaponConfig');
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
        classId: this.isBrowserMobile ? ActorFactory.DEMOSHIP : ActorFactory.SHIP,
        positionX: 0,
        positionY: 0,
        angle: 0
    });

    var i = void 0;

    // for (i = 0; i < 1; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.WEAPONPICKUP,
    //         subclassId: 16,
    //         positionX: Utils.rand(-100, 100),
    //         positionY: Utils.rand(-100, 100),
    //         angle: 0         
    //     });
    // }

    // for (i = 0; i < 3; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.BULLETAMMOPICKUP,
    //         positionX: Utils.rand(-100, 100),
    //         positionY: Utils.rand(-100, 100),
    //         angle: 0         
    //     });
    // }

    // for (i = 0; i < 1; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.ENEMY,
    //         subclassId: EnemyConfig.getSubclassIdFor('DRILLER'),
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
        spawns: { class: 'PLASMAPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: 40,
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
        positionY: 557,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'MISSILEQUADPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: -302,
        positionY: 567,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'MISSILEQUADPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: -302,
        positionY: 557,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'BULLETAMMOPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: 232,
        positionY: 420,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: { class: 'BULLETAMMOPICKUP', delayAfterPickup: 60 * 30, spawnedInitially: true },
        positionX: 262,
        positionY: 420,
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

},{"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109,"shared/ActorFactory":110,"shared/EnemyConfig":113,"shared/WeaponConfig":116}],5:[function(require,module,exports){
'use strict';

var WeaponConfig = require('shared/WeaponConfig');

function GameState() {
    this._state = this._createInitialState();
    this._props = this._createInitialProps();
    this._notifyOfStateChange();
    this._timer = 0;
    this._props.difficulties = Constants.DIFFICULTIES;

    EventEmitter.apply(this, arguments);
}

GameState.extend(EventEmitter);

GameState.prototype._createInitialState = function () {
    return {
        weaponSystems: {
            0: { weapons: ['RED_BLASTER', 'NONE'], currentWeaponIndex: 0 },
            1: { weapons: ['NONE', 'NONE'], currentWeaponIndex: 0 }
        },
        ammo: {
            energy: 100,
            plasma: 0,
            missiles: 0,
            rads: 0,
            coolant: 0,
            bullets: 0
        },
        ammoMax: {
            energy: 200,
            plasma: 200,
            missiles: 30,
            rads: 5,
            coolant: 500,
            bullets: 2000
        },
        difficultyFactor: 1,
        existingActorsByType: {},
        removedActorsByType: {},
        killStats: {},
        lastProjectileStrikingPlayerOwnedBy: null
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
            shield: '#66aaff',
            weapon: '#ff4d4d',
            bullets: '#d4d4d4'
        },
        enemyMessageColor: '#ffffff'
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

GameState.prototype.getWeaponSystem = function (weaponSystemIndex) {
    return this._state.weaponSystems[weaponSystemIndex];
};

GameState.prototype.switchWeapon = function (weaponSystemIndex) {
    var weaponSystem = this._state.weaponSystems[weaponSystemIndex];
    weaponSystem.currentWeaponIndex++;
    if (weaponSystem.currentWeaponIndex >= weaponSystem.weapons.length) {
        weaponSystem.currentWeaponIndex = 0;
    }
};

GameState.prototype.rechargeAmmo = function () {
    if (this._timer % this._props.ammoRechargeRate === 0) {
        this.addAmmo({ energy: 1 });
    }
};

GameState.prototype.getKillStats = function () {
    var _this = this;

    var killStats = [];

    Object.keys(this._state.killStats).forEach(function (enemyName) {
        killStats.push({
            enemyIndex: _this._state.killStats[enemyName].enemyIndex,
            enemyName: enemyName,
            killCount: _this._state.killStats[enemyName].killCount,
            pointWorth: _this._state.killStats[enemyName].pointWorth
        });
    });

    return killStats;
};

GameState.prototype.handleShieldPickup = function (amount) {
    this._state.message = {
        text: amount + ' ' + 'SHIELDS',
        color: this._props.pickupColors['shield']
    };
    this._notifyOfStateChange();
};

GameState.prototype.addAmmo = function (ammoConfig, withMessage) {
    var _this2 = this;

    Object.keys(ammoConfig).forEach(function (ammoType) {
        _this2._state.ammo[ammoType] += ammoConfig[ammoType];
        var notify = false;

        if (_this2._state.ammo[ammoType] !== _this2._state.ammoMax[ammoType]) {
            notify = true;
        }

        if (_this2._state.ammo[ammoType] > _this2._state.ammoMax[ammoType]) {
            _this2._state.ammo[ammoType] = _this2._state.ammoMax[ammoType];
        }

        if (withMessage) {
            _this2._state.message = {
                text: ammoConfig[ammoType] + ' ' + ammoType.toUpperCase(),
                color: _this2._props.pickupColors[ammoType]
            };
        }

        if (notify) {
            _this2._notifyOfStateChange();
        }
    });
};

GameState.prototype.replaceWeapon = function (weaponSystemIndex, weaponIndex, weaponSubclassId) {
    this._state.weaponSystems[weaponSystemIndex].weapons[weaponIndex] = WeaponConfig.getNameById(weaponSubclassId);

    var weaponPrimarySecondaryString = weaponSystemIndex === 0 ? 'PRIMARY' : 'SECONDARY';
    var weaponName = WeaponConfig[WeaponConfig.getNameById(weaponSubclassId)].name;

    this._state.message = {
        text: 'WEAPON FOR ' + weaponPrimarySecondaryString + ' SLOT: ' + weaponName,
        color: this._props.pickupColors['weapon']
    };

    this._notifyOfStateChange();
};

GameState.prototype.removeWeapon = function (weaponSystemIndex, weaponIndex) {
    var weaponPrimarySecondaryString = weaponSystemIndex === 0 ? 'PRIMARY' : 'SECONDARY';
    var noneWeaponName = WeaponConfig.getNoneName();
    var noneWeaponSubclassId = WeaponConfig.getSubclassIdFor(noneWeaponName);
    var currentWeaponName = this._state.weaponSystems[weaponSystemIndex].weapons[weaponIndex];

    if (noneWeaponName === currentWeaponName) return;

    this._state.message = {
        text: 'DROPPED ' + weaponPrimarySecondaryString + ' SLOT WEAPON: ' + currentWeaponName,
        color: this._props.pickupColors['weapon']
    };

    this._state.weaponSystems[weaponSystemIndex].weapons[weaponIndex] = WeaponConfig.getNameById(noneWeaponSubclassId);
    this._notifyOfStateChange();
};

GameState.prototype.informOfNoFreeWeaponSlots = function () {
    this._state.message = {
        text: 'NO FREE SLOTS FOR PICKING UP WEAPONS! HOLD [Q] OR [E] TO DROP CURRENT WEAPON!',
        color: this._props.pickupColors['weapon']
    };
    this._notifyOfStateChange();
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

GameState.prototype.removeActor = function (actorProps) {
    actorProps = actorProps || {};
    var type = actorProps.type;

    if (!this._state.existingActorsByType[type]) {
        this._state.existingActorsByType[type] = 0;
    } else {
        this._state.existingActorsByType[type]--;
    }

    if (actorProps.name) {
        this._removeNamedActor(actorProps);
    }
};

GameState.prototype.getActorCountByType = function (type) {
    if (!this._state.existingActorsByType[type]) {
        this._state.existingActorsByType[type] = 0;
    }

    return this._state.existingActorsByType[type];
};

GameState.prototype.setDifficultyFactor = function (factor) {
    this._state.difficultyFactor = factor;
};

GameState.prototype.getDifficultyForType = function (type) {
    if (!this._props.difficulties.hasOwnProperty(type)) {
        console.warn('no difficulty type: ' + type + '; returning default (1)');
        return 1;
    }

    return this._props.difficulties[type][this._state.difficultyFactor];
};

GameState.prototype._removeNamedActor = function (actorProps) {
    if (!this._state.killStats[actorProps.name]) {
        this._state.killStats[actorProps.name] = {
            killCount: 0,
            pointWorth: actorProps.pointWorth || 0,
            enemyIndex: actorProps.enemyIndex || 0
        };
    }
    this._state.killStats[actorProps.name].killCount += 1;

    this._state.message = {
        text: actorProps.name + ': ' + actorProps.pointWorth + ' POINTS',
        color: this._props.enemyMessageColor
    };
    this._notifyOfStateChange();
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
    var _this3 = this;

    var ammoTypes = Object.keys(ammoConfig);
    var canFire = true;
    ammoTypes.forEach(function (ammoType) {
        if (!_this3._state.ammo[ammoType] || _this3._state.ammo[ammoType] < ammoConfig[ammoType]) {
            canFire = false;
            _this3.sendMessage('CANNOT FIRE ' + weaponName.toUpperCase() + '; AMMO MISSING: ' + ammoType.toUpperCase() + '!', '#ff5030');
        }
    });
    return canFire;
};

GameState.prototype._subtractAmmo = function (ammoConfig) {
    var _this4 = this;

    Object.keys(ammoConfig).forEach(function (ammoType) {
        _this4._state.ammo[ammoType] -= ammoConfig[ammoType];
    });
};

module.exports = GameState;

},{"shared/WeaponConfig":116}],6:[function(require,module,exports){
'use strict';

function GameWorld(config) {
    p2.World.apply(this, arguments);

    this.positionTransferArray = new Float32Array(Constants.STORAGE_SIZE * 3); //this holds position transfer data for all actors, needs to be ultra-fast
    this.configTransferArray = new Uint16Array(Constants.STORAGE_SIZE * 3); //this holds config transfer data for all actors, needs to be ultra-fast too
    //WATCH OUT FOR SIZE!!! UP TO 64K items!

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
    var positionTransferArray = this.positionTransferArray;
    var configTransferArray = this.configTransferArray;
    var transferrableActorCount = 0;

    for (var i = 0, l = this.bodies.length; i < l; i++) {
        var body = this.bodies[i];
        if (body.actor) {
            configTransferArray[transferrableActorCount * 3] = body.actorId;
            configTransferArray[transferrableActorCount * 3 + 1] = body.classId;
            configTransferArray[transferrableActorCount * 3 + 2] = body.subclassId;
            positionTransferArray[transferrableActorCount * 3] = body.position[0];
            positionTransferArray[transferrableActorCount * 3 + 1] = body.position[1];
            positionTransferArray[transferrableActorCount * 3 + 2] = body.angle;
            transferrableActorCount++;
        }
    }

    return {
        actorCount: transferrableActorCount,
        positionTransferArray: this.positionTransferArray,
        configTransferArray: this.configTransferArray,
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

GameWorld.prototype.prepareBodyForDeath = function (body, deathType) {
    var deadTransferArray = this.deadTransferArray;
    var currentDeadsLength = deadTransferArray.length / 5; //because there are 5 properties in one-dimensional array

    deadTransferArray[currentDeadsLength * 5] = body.actorId;
    deadTransferArray[currentDeadsLength * 5 + 1] = -1;
    deadTransferArray[currentDeadsLength * 5 + 2] = body.position[0];
    deadTransferArray[currentDeadsLength * 5 + 3] = body.position[1];
    deadTransferArray[currentDeadsLength * 5 + 4] = body.angle;
    deadTransferArray[currentDeadsLength * 5 + 5] = deathType;

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
        case 'difficultyChange':
            this.core.onDifficultyChange(message);
            break;
        case 'gameUnpause':
            this.core.onUnpause(message);
            break;
        case 'gamePause':
            this.core.onPause(message);
            break;
    }
};

module.exports = RenderBus;

},{"shared/WorkerBus":117}],8:[function(require,module,exports){
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
var ActorTypes = require('shared/ActorTypes');

function ActorManager(config) {
    config = config || {};

    this._storage = this._createStorage();
    this._playerType = ActorTypes.getPlayerType();

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
    var actor = this.factory.create(Object.assign(config, {
        manager: this,
        gameState: this.gameState,
        world: this.world,
        id: this.currentId
    }));

    actor.parent = config.parent;
    actor.applySpawnConfig(config.spawnConfig);

    this._storage[actor.getType()][this.currentId] = actor;
    this.currentId++;
    this.world.addBody(actor.getBody());
    actor.onSpawn();

    return actor;
};

ActorManager.prototype.update = function (inputState) {
    this.timer++;

    for (var i = 0; i < this.playerActors.length; i++) {
        if (this._storage[this._playerType][this.playerActors[i]]) {
            this._storage[this._playerType][this.playerActors[i]].playerUpdate(inputState);
        }
    }

    for (var actorType in ActorTypes.types) {
        for (var actorId in this._storage[actorType]) {
            this._storage[actorType][actorId].update();
        }
    }

    this.sendActorStateChanges();
};

ActorManager.prototype.attachPlayer = function (actor) {
    this.playerActors.push(actor.id);
};

ActorManager.prototype.removeActorAt = function (actor) {
    delete this._storage[actor.getType()][actor.id];
};

ActorManager.prototype.actorDied = function (actor, deathType) {
    delete this._storage[actor.getType()][actor.id];
    this.world.prepareBodyForDeath(actor.getBody(), deathType);
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
    return this._storage['playerShip'][this.playerActors[0]]; //todo - zamienic to na szukanie po playerActors
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

ActorManager.prototype.onPlayerWeaponSwitched = function (weaponSystemIndex, weaponName) {
    this.emit({
        type: 'weaponSwitched',
        data: {
            weaponSystemIndex: weaponSystemIndex,
            weaponName: weaponName
        }
    });
    this.gameState.switchWeapon(weaponSystemIndex);
};

ActorManager.prototype.getActorsByType = function (type) {
    return this._storage[type];
};

ActorManager.prototype._createStorage = function () {
    var storage = Object.create(null);

    Object.keys(ActorTypes.types).forEach(function (actorType) {
        storage[actorType] = Object.create(null);
    });

    return storage;
};

module.exports = ActorManager;

},{"shared/ActorFactory":110,"shared/ActorTypes":111}],10:[function(require,module,exports){
'use strict';

var ActorFactory = require('shared/ActorFactory')('logic');
var BaseBody = require('logic/actor/component/body/BaseBody');

function BaseActor(config) {
    this.id = this.id || config.id;
    this.props = this._createProps(this.props || {});
    this.state = this._createState(this.state || {});
    this.timer = 0;

    this.props.isPlayer = this.props.isPlayer || config.isPlayer;

    this.gameState = config.gameState || null;
    this.manager = config.manager || null;

    this._body = this.createBody(this.props.isPlayer);
    if (!this._body) throw new Error('No body defined for Logic Actor!');

    this._body.position = [config.positionX || 0, config.positionY || 0];
    this._body.angle = config.angle || 0;
    this._body.actor = this;
    this._body.velocity = Utils.angleToVector(config.angle, config.velocity || 0);
    this._body.actorId = this.id;
    this._body.classId = config.classId;
    this._body.subclassId = config.subclassId;

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

BaseActor.prototype.applySpawnConfig = function (spawnConfig) {
    for (var property in spawnConfig) {
        this[property] = Object.assign(this[property], spawnConfig[property]);
    }
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

BaseActor.prototype.getType = function () {
    return this.props.type || 'noType';
};

BaseActor.prototype.isOwnedByPlayer = function () {
    return !!this.props.isPlayer;
};

BaseActor.prototype.setOwnedByPlayer = function (ownedByPlayer) {
    this.props.isPlayer = ownedByPlayer;
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

BaseActor.prototype.getOffsetPosition = function (distanceOffset, angleOffset) {
    return Utils.rotationToVector(this.angle + (angleOffset || 0), distanceOffset || 0);
};

BaseActor.prototype.getPowerLevel = function () {
    return this.props.powerLevel || 1;
};

BaseActor.prototype.playSound = function (sounds, volume) {
    this.manager.playSound({ sounds: sounds, actor: this, volume: volume || 1 });
};

BaseActor.prototype.createBody = function (isPlayer) {
    this.bodyConfig.isPlayer = isPlayer;
    return new BaseBody(this.bodyConfig);
};

BaseActor.prototype.onCollision = function (otherActor, relativeContactPoint) {
    this._updateHpAndShieldOnCollision(otherActor, relativeContactPoint);

    if (this.state.hp <= 0 || this.props.removeOnHit) {
        if (this.props.delayedDeath) {
            if (!this.state.deathTimer) {
                this.delayDeath();
            }
        } else {
            this.deathMain(relativeContactPoint, Constants.DEATH_TYPES.HIT);
        }
    }

    if (otherActor && this.state.pickup && otherActor.state.canPickup) {
        var pickedUp = otherActor.handlePickup(this.state, this.subclassId);
        if (pickedUp) {
            this.deathMain(relativeContactPoint, Constants.DEATH_TYPES.HIT);
        }
    }

    this.manager.updateActorState(this);

    this.customOnCollision();
};

BaseActor.prototype.update = function () {
    this.timer++;
    if (this.timer > this.props.timeout) {
        this.deathMain(null, Constants.DEATH_TYPES.TIMEOUT);
    }
    if (this.state.deathTimer && this.state.deathTimer > -1) {
        this.state.deathTimer--;
        if (this.state.deathTimer === 0) {
            this.deathMain(null, Constants.DEATH_TYPES.HIT);
        }
    }
    this.customUpdate();
    this.processMovement();
};

BaseActor.prototype.remove = function () {
    this.manager.removeActorAt(this);
};

BaseActor.prototype.handlePickup = function () {};

BaseActor.prototype.customOnCollision = function () {};

BaseActor.prototype.customUpdate = function () {};

BaseActor.prototype.playerUpdate = function () {};

BaseActor.prototype.onHit = function () {};

BaseActor.prototype.onSpawn = function () {};

BaseActor.prototype.onDeath = function () {};

BaseActor.prototype.onTimeout = function () {};

BaseActor.prototype.delayDeath = function () {
    this.state.deathTimer = this.props.delayedDeath.time || 0;
    this.onDelayedDeath && this.onDelayedDeath();
    this.manager.updateActorState(this);
};

BaseActor.prototype.deathMain = function (relativeContactPoint, deathType) {
    if (this.state.alreadyRemoved) {
        return;
    }

    this.state.alreadyRemoved = true;

    if (this.props.collisionFixesPosition && relativeContactPoint) {
        this._body.position = relativeContactPoint;
    }

    this.manager.actorDied(this, deathType);

    this._handleDeath(deathType);

    this.gameState.removeActor(this.props);
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
    config = Object.assign({}, config || {});
    config.amount = config.amount || 1;
    config.angle = config.angle || 0;
    config.velocity = config.velocity || 0;
    config.classId = config.classId || ActorFactory.DEBUG;
    config.probability = (config.probability || 1) * 100;
    config.offsetPosition = this.getOffsetPosition(config.spawnOffset || 0);
    config.powerLevel = config.powerLevel || 1;
    config.isPlayer = config.isPlayer || false;

    for (var i = 0; i < Utils.randArray(config.amount); i++) {
        if (config.probability === 100 || Utils.rand(1, 100) <= config.probability) {
            this.manager.addNew({
                classId: config.classId,
                subclassId: config.subclassId,
                positionX: config.offsetPosition[0] + this._body.position[0],
                positionY: config.offsetPosition[1] + this._body.position[1],
                angle: this.angle + Utils.degToRad(Utils.randArray(config.angle)),
                velocity: Utils.randArray(config.velocity),
                parent: this,
                spawnConfig: config.customConfig,
                isPlayer: config.isPlayer,
                powerLevel: config.powerLevel
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

BaseActor.prototype._handleDeath = function (deathType) {
    if (this.props.soundsOnDeath) {
        this.manager.playSound({ sounds: this.props.soundsOnDeath, actor: this });
    }
    switch (deathType) {
        case Constants.DEATH_TYPES.HIT:
            this.onDeath();
            break;
        case Constants.DEATH_TYPES.TIMEOUT:
            this.onTimeout();
            break;
    }
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

},{"logic/actor/component/body/BaseBody":15,"shared/ActorFactory":110}],11:[function(require,module,exports){
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

var Weapon = require('logic/actor/component/weapon/Weapon');

var WeaponConfig = require('shared/WeaponConfig');
var ActorFactory = require('shared/ActorFactory')('logic');

function WeaponSystem(config) {
    Object.assign(this, config);

    if (!this.actor) throw new Error('No actor for Logic WeaponSystem!');
    if (!this.gameState) throw new Error('No gameState for Logic WeaponSystem!');

    this.weaponSystemIndex = config.weaponSystemIndex;
    this.weapons = this._createWeapons(this.gameState.getWeaponSystem(this.weaponSystemIndex).weapons);
    this.weaponCount = this.weapons.length;

    this._canPickup = false;
    this._canPickupTimer = 0;
    this._switchingBlocked = false;
    this._droppingBlocked = false;

    this.currentWeaponIndex = 0;
}

WeaponSystem.prototype._createWeapons = function (weaponNames) {
    var _this = this;

    var weapons = [];
    weaponNames.forEach(function (weaponName) {
        if (!WeaponConfig[weaponName]) {
            throw new Error('Could not find a config for weapon: ' + weaponName + '.');
        }
        var weapon = new Weapon(Object.assign({
            actor: _this.actor,
            firingPoints: _this.firingPoints,
            gameState: _this.gameState,
            weaponName: weaponName
        }, WeaponConfig[weaponName]));

        weapons.push(weapon);
    });
    return weapons;
};

WeaponSystem.prototype.lockDropWeapon = function () {
    this._droppingBlocked = true;
};

WeaponSystem.prototype.unlockDropWeapon = function () {
    this._droppingBlocked = false;
};

WeaponSystem.prototype.blockWeaponSwitch = function () {
    this._switchingBlocked = true;
};

WeaponSystem.prototype.unlockWeaponSwitch = function () {
    this._switchingBlocked = false;
};

WeaponSystem.prototype.isBlocked = function () {
    return this._switchingBlocked;
};

WeaponSystem.prototype.getOpenSlotInfo = function () {
    var forcedPickup = this._canPickup;
    var firstSlotIsOpen = !!this.weapons[0].noneType;
    var secondSlotIsOpen = !!this.weapons[1].noneType;
    var emptyWeaponCount = this.weapons.reduce(function (carry, weapon) {
        return carry + (!!weapon.noneType ? 1 : 0);
    }, 0);

    return {
        forcedPickup: forcedPickup,
        firstSlotIsOpen: firstSlotIsOpen,
        secondSlotIsOpen: secondSlotIsOpen,
        emptyWeaponCount: emptyWeaponCount,
        isOpen: forcedPickup || firstSlotIsOpen || secondSlotIsOpen
    };
};

WeaponSystem.prototype.enablePickup = function () {
    this._canPickup = true;
    this._canPickupTimer = 5;
};

WeaponSystem.prototype.disablePickup = function () {
    this._canPickup = false;
};

WeaponSystem.prototype.dropWeapon = function () {
    if (this._droppingBlocked) return;

    var weaponIndex = this._getNextWeaponIndex();
    if (this.weapons[weaponIndex].noneType) return;

    var weapon = new Weapon(Object.assign({
        actor: this.actor,
        firingPoints: this.firingPoints,
        gameState: this.gameState,
        weaponName: WeaponConfig.getNoneName()
    }, WeaponConfig[WeaponConfig.getNoneName()]));

    this._createDropPickup(this.weapons[this.currentWeaponIndex]);

    this.weapons[this.currentWeaponIndex] = weapon;

    this.gameState.removeWeapon(this.weaponSystemIndex, this.currentWeaponIndex);
    this.switchWeaponToNext();
};

WeaponSystem.prototype.shoot = function () {
    this.weapons[this.currentWeaponIndex].shoot();
};

WeaponSystem.prototype.stopShooting = function () {
    this.weapons[this.currentWeaponIndex].stopShooting();
};

WeaponSystem.prototype.getCurrentWeaponIndex = function () {
    return this.currentWeaponIndex;
};

WeaponSystem.prototype.replaceWeapon = function (weaponIndex, weaponSubclassId) {
    var weaponName = WeaponConfig.getNameById(weaponSubclassId);
    if (!WeaponConfig[weaponName]) {
        throw new Error('Could not find a config for weapon: ' + weaponName + '.');
    }

    var weapon = new Weapon(Object.assign({
        actor: this.actor,
        firingPoints: this.firingPoints,
        gameState: this.gameState,
        weaponName: weaponName
    }, WeaponConfig[weaponName]));

    this.weapons[weaponIndex] = weapon;

    this.gameState.replaceWeapon(this.weaponSystemIndex, weaponIndex, weaponSubclassId);
};

WeaponSystem.prototype.switchWeaponToNext = function () {
    var weaponIndex = this._getNextWeaponIndex();
    if (this.weapons[weaponIndex].noneType) return;

    this.currentWeaponIndex = weaponIndex;

    this.actor.playSound(['cannon_change']);
    this.actor.manager.onPlayerWeaponSwitched(this.weaponSystemIndex, this.weapons[this.currentWeaponIndex].weaponName);
};

WeaponSystem.prototype.switchWeaponToIndex = function (weaponIndex) {
    if (weaponIndex >= this.weaponCount) throw new Error('This weapon system has ' + this.weaponCount + ' weapons but it was commanded to change to weapon index ' + weaponIndex);
    this.currentWeaponIndex = weaponIndex;

    this.actor.playSound(['cannon_change']);
    this.actor.manager.onPlayerWeaponSwitched(this.weaponSystemIndex, this.weapons[this.currentWeaponIndex].weaponName);
};

WeaponSystem.prototype.update = function () {
    if (this.weapons[this.currentWeaponIndex]) {
        this.weapons[this.currentWeaponIndex].update();
    }

    if (this._canPickupTimer > 0) {
        this._canPickupTimer--;
        if (this._canPickupTimer === 0) {
            this._canPickup = false;
        }
    }
};

WeaponSystem.prototype._getNextWeaponIndex = function () {
    var weaponIndex = this.currentWeaponIndex;

    weaponIndex++;
    if (weaponIndex >= this.weaponCount) {
        weaponIndex = 0;
    }

    return weaponIndex;
};

WeaponSystem.prototype._createDropPickup = function (weaponConfig) {
    this.actor.spawn({
        classId: ActorFactory.WEAPONPICKUP,
        angle: 0,
        velocity: 50,
        spawnOffset: -5,
        subclassId: WeaponConfig.getSubclassIdFor(weaponConfig.weaponName)
    });
};

module.exports = WeaponSystem;

},{"logic/actor/component/weapon/Weapon":16,"shared/ActorFactory":110,"shared/WeaponConfig":116}],13:[function(require,module,exports){
'use strict';

var ActorTypes = require('shared/ActorTypes');

function BaseBrain(config) {
    config = config || [];

    Object.assign(this, config);

    if (!this.actor) throw new Error('No actor for a Brain!');
    if (!this.gameState) throw new Error('No gameState for a Brain!');
    if (!this.manager) throw new Error('No manager for a Brain!');

    this.detectEnemies = !this.enemyActor;
    this.enemyTypes = this.enemyTypes || [ActorTypes.getPlayerType()];
    this.enemyDetectionFrequency = 60;

    this.orders = {
        thrust: 0, //backward < 0; forward > 0
        horizontalThrust: 0, //left < 0; right > 0
        turn: 0, //left < 0; right > 0
        shoot: false,
        lookAtPosition: null
    };

    this.timer = 0;
}

BaseBrain.prototype.update = function () {
    if (this.timer % this.enemyDetectionFrequency === 0 && this.detectEnemies) {
        this.enemyActor = this.getClosestEnemy();
    }

    this.customUpdate();

    this.timer++;
};

BaseBrain.prototype.customUpdate = function () {};

BaseBrain.prototype.getClosestEnemy = function () {
    var enemyActors = void 0,
        enemyActor = void 0,
        distance = void 0,
        currentlyClosestActor = void 0,
        minimumDistance = Infinity;

    for (var i = 0; i < this.enemyTypes.length; i++) {
        enemyActors = this.manager.getActorsByType(this.enemyTypes[i]);
        for (var enemyActorId in enemyActors) {
            enemyActor = enemyActors[enemyActorId];
            distance = Utils.distanceBetweenActors(enemyActor, this.actor);

            if (distance < minimumDistance) {
                minimumDistance = distance;
                if (!this.isWallBetween(this.actor.getPosition(), enemyActor.getPosition())) {
                    currentlyClosestActor = enemyActor;
                }
            }
        }
    }

    return currentlyClosestActor;
};

BaseBrain.prototype.getEnemyPosition = function () {
    return this.enemyActor.getPosition();
};

BaseBrain.prototype.getEnemyPositionWithLead = function () {
    var leadSpeed = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
    var leadSkill = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    var p = this.actor.getPosition();
    var tp = this.enemyActor.getPosition();
    var tv = this.enemyActor.getVelocity();
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

},{"shared/ActorTypes":111}],14:[function(require,module,exports){
'use strict';

var BaseBrain = require('logic/actor/component/ai/BaseBrain');

function MookBrain(config) {

    config.shootingArc = config.shootingArc || 15;
    config.nearDistance = config.nearDistance || 40;
    config.farDistance = config.farDistance || 90;
    config.chaserRetreatDistance = config.chaserRetreatDistance || 1000;
    config.chaserRetreatTime = config.chaserRetreatDistance || 60;
    config.wallDetectionDistance = config.wallDetectionDistance || 10;
    config.firingDistance = config.firingDistance || 200;
    config.leadSkill = typeof config.leadSkill !== 'undefined' ? config.leadSkill : 1;
    config.behavior = config.behavior || 'dogfighter';

    Object.assign(this, config);
    BaseBrain.apply(this, arguments);

    this.activationTime = Utils.rand(100, 150);

    this.preferredTurn = 1;
    this.createWallDetectionParameters();

    this.gotoPoint = null;
}

MookBrain.extend(BaseBrain);

MookBrain.prototype.createWallDetectionParameters = function () {
    this.wallDetectionDistances = new Uint16Array([this.wallDetectionDistance]);

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

MookBrain.prototype.customUpdate = function () {
    this.nearbyWalls = this.detectNearbyWallsFast();

    if (this.enemyActor && this.enemyActor._body) {

        if (this.timer % 30 === 0) {
            this.preferredTurn *= -1;
        }

        var actorPosition = this.actor.getPosition();

        if (this.isWallBetween(actorPosition, this.enemyActor.getPosition())) {
            if (this.gotoPoint) {
                if (!this.isWallBetween(actorPosition, this.gotoPoint)) {
                    this.seesGotoPointAction(this.nearbyWalls);
                } else {
                    this.gotoPoint = null;
                    this.freeRoamActon(this.nearbyWalls);
                }
            } else {
                this.freeRoamActon(this.nearbyWalls);
            }
        } else {
            this.seesEnemyAction();
        }

        this.avoidWalls(this.nearbyWalls);
    } else {
        this.freeRoamActon(this.nearbyWalls);
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

MookBrain.prototype.seesEnemyAction = function () {
    switch (this.behavior) {
        case 'chaser':
            this._chaserSeesEnemyAction();
            break;
        case 'dogfighter':
        default:
            this._dogfighterSeesEnemyAction();
    }
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
    var inArc = Utils.pointInArc(this.actor.getPosition(), this.enemyActor.getPosition(), this.actor.getAngle(), this.shootingArc);
    var enemyLive = this.enemyActor.state.hp > 0;
    this.orders.shoot = inArc && enemyLive;
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

MookBrain.prototype._dogfighterSeesEnemyAction = function () {
    this.orders.lookAtPosition = this.getEnemyPositionWithLead(this.actor.weapon.velocity, this.leadSkill);
    this.gotoPoint = this.enemyActor.getPosition();
    var distance = Utils.distanceBetweenActors(this.actor, this.enemyActor);

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

MookBrain.prototype._chaserSeesEnemyAction = function () {
    if (!this._currentChaserMode) {
        this._currentChaserMode = 'follow';
    }

    switch (this._currentChaserMode) {
        case 'follow':
            this._chaserSeesEnemyFollowAction();
            break;
        case 'retreat':
            this._chaserSeesEnemyRetreatAction();
            break;
    }
};

MookBrain.prototype._chaserSeesEnemyFollowAction = function () {
    this.orders.lookAtPosition = this.getEnemyPositionWithLead(this.actor.weapon.velocity, this.leadSkill);
    this.gotoPoint = this.enemyActor.getPosition();
    var distance = Utils.distanceBetweenActors(this.actor, this.enemyActor);

    this.orders.thrust = 1;

    if (distance < this.firingDistance) {
        this.shootAction(distance);
    }

    if (distance < this.nearDistance) {
        this.orders.lookAtPosition = this.actor.getOffsetPosition(this.chaserRetreatDistance, Utils.rand(160, 200));
        this._currentChaserMode = 'retreat';
        this._chaserTimer = this.chaserRetreatTime;
        this.orders.shoot = false;
    }

    this.orders.turn = 0;

    if (!this.nearbyWalls.right && !this.nearbyWalls.left && !this.nearbyWalls.front && !this.nearbyWalls.rear) {
        this.orders.horizontalThrust = 0;
    }

    this.playCalloutSound();
};

MookBrain.prototype._chaserSeesEnemyRetreatAction = function () {
    var position = this.actor.getPosition();
    var targetPosition = this.orders.lookAtPosition;
    var distanceToTarget = targetPosition ? Utils.distanceBetweenPoints(position[0], targetPosition[0], position[1], targetPosition[1]) : 0;

    this.orders.thrust = 1;
    this.orders.turn = 0;

    if (this._chaserTimer > 0) {
        this._chasertimer--;
    } else {
        this._currentChaserMode = 'follow';
    }

    if (distanceToTarget < 20 || this.nearbyWalls.left || this.nearbyWalls.right || this.nearbyWalls.front || this.nearbyWalls.back) {
        this._currentChaserMode = 'follow';
    }

    if (!this.nearbyWalls.right && !this.nearbyWalls.left && !this.nearbyWalls.front && !this.nearbyWalls.rear) {
        this.orders.horizontalThrust = 0;
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
            if (this.isPlayer) {
                return new p2.Circle({
                    radius: this.radius,
                    collisionGroup: Constants.COLLISION_GROUPS.SHIPPROJECTILE,
                    collisionMask: Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN
                });
            } else {
                return new p2.Circle({
                    radius: this.radius,
                    collisionGroup: Constants.COLLISION_GROUPS.ENEMYPROJECTILE,
                    collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN
                });
            }
        case 'enemyProjectile':
            if (this.isPlayer) {
                return new p2.Circle({
                    radius: this.radius,
                    collisionGroup: Constants.COLLISION_GROUPS.SHIPPROJECTILE,
                    collisionMask: Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN
                });
            } else {
                return new p2.Circle({
                    radius: this.radius,
                    collisionGroup: Constants.COLLISION_GROUPS.ENEMYPROJECTILE,
                    collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN
                });
            }
        case 'pickup':
            return new p2.Circle({
                radius: this.radius,
                collisionGroup: Constants.COLLISION_GROUPS.PICKUP,
                collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.EXPLOSION
            });
        case 'playerShip':
            if (this.isPlayer) {
                return new p2.Circle({
                    radius: this.radius,
                    collisionGroup: Constants.COLLISION_GROUPS.SHIP,
                    collisionMask: Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.PICKUP | Constants.COLLISION_GROUPS.EXPLOSION
                });
            } else {
                return new p2.Circle({
                    radius: this.radius,
                    collisionGroup: Constants.COLLISION_GROUPS.ENEMY,
                    collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.EXPLOSION
                });
            }
        case 'enemyShip':
            if (this.isPlayer) {
                return new p2.Circle({
                    radius: this.radius,
                    collisionGroup: Constants.COLLISION_GROUPS.SHIP,
                    collisionMask: Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.PICKUP | Constants.COLLISION_GROUPS.EXPLOSION
                });
            } else {
                return new p2.Circle({
                    radius: this.radius,
                    collisionGroup: Constants.COLLISION_GROUPS.ENEMY,
                    collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.EXPLOSION
                });
            }
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

function Weapon(config) {

    this.burstCount = 1;
    this.burstCooldown = 0;
    this.cooldown = 100;
    this.recoil = 0;
    this.randomAngle = 0;
    this.projectileCount = 1;
    this.velocity = 10;
    this.sound = null;
    this.name = config.name || 'baseWeapon';
    this.gameState = config.gameState;
    this.defaultEmptyTiming = 60;
    this.ammoConfig = {};
    this.firingPoints = [];
    this.firingMode = 'simultaneous';
    this.currentFiringPoint = 0;

    Object.assign(this, config);
    if (!this.projectileClass) throw new Error('No projectile class for a Weapon!');
    if (!this.actor) throw new Error('No actor for a Weapon!');

    this.timer = 0;
    this.shooting = false;
    this.shotsFired = 0;

    this.ownedByPlayer = this.actor.isOwnedByPlayer();
    this.powerLevel = this.actor.getPowerLevel();

    this._alterPropertiesByPowerLevel(this.powerLevel);
}

Weapon.prototype.update = function () {
    if (this.timer > 0) {
        this.timer--;
    } else {
        if (this.shooting) {
            var canShoot = !this.gameState || this.gameState.requestShoot(this.weaponName, this.ammoConfig);
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

Weapon.prototype.shoot = function () {
    if (this.noneType) return;
    this.shooting = true;
};

Weapon.prototype.stopShooting = function () {
    this.shooting = false;
};

Weapon.prototype.processActiveWeapon = function () {
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

Weapon.prototype.fireProjectile = function (firingPointConfig) {
    var position = this.actor.getPosition();
    var angle = this.actor.getAngle();
    var randomAngle = Utils.degToRad(this.randomAngle);
    var offsetPosition = Utils.angleToVector(angle + Utils.degToRad(firingPointConfig.offsetAngle), firingPointConfig.offsetDistance);

    for (var i = 0; i < this.projectileCount; i++) {
        this.actor.manager.addNew({
            classId: this.projectileClass,
            positionX: position[0] + offsetPosition[0],
            positionY: position[1] + offsetPosition[1],
            angle: angle + firingPointConfig.fireAngle + Utils.rand(0, randomAngle * 1000) / 1000 - randomAngle / 2,
            velocity: this.velocity,
            isPlayer: this.ownedByPlayer,
            powerLevel: this.powerLevel
        });
    }
};

Weapon.prototype.handleFiringSimultaneous = function () {
    this.firingPoints.forEach(this.fireProjectile.bind(this));
    this.timer += this.burstCooldown;
    this.actor.applyRecoil(this.recoil);

    if (this.sound) {
        this.actor.playSound([this.sound], this.volume);
    }
};

Weapon.prototype.handleFiringAlternate = function () {
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

Weapon.prototype._alterPropertiesByPowerLevel = function (powerLevel) {
    this.burstCooldown *= 1 / powerLevel;
    if (this.burstCount > 1) this.burstCount = Math.ceil(this.burstCount * (powerLevel * 2 / 3));
    this.cooldown *= 1 / powerLevel;
    this.velocity = Math.max(this.velocity / (3 / 2), this.velocity * powerLevel);
};

module.exports = Weapon;

},{}],17:[function(require,module,exports){
'use strict';

var EnemyActor = require('logic/actor/enemy/EnemyActor');
var ActorFactory = require('shared/ActorFactory')('logic');
var EnemyConfig = require('shared/EnemyConfig');

function ChampionEnemyActor(config) {
    config = config || [];
    Object.assign(this, config);
    EnemyActor.apply(this, arguments);

    this.props.dropChance = 0;
    this.props.championSpawnChance = 0.02;
    this.state.spawnTimer = 0;
    this.state.spawnTime = this.props.logic.championConfig ? this.props.logic.championConfig.spawnTime : 999;
}

ChampionEnemyActor.extend(EnemyActor);

ChampionEnemyActor.prototype.customUpdate = function () {
    if (this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();

    this._championUpdate();
    this._spawnGuardianUpdate();
};

ChampionEnemyActor.prototype._championUpdate = function () {
    if (!this.props.logic.championConfig) return;

    if (!this.state.champion) this.state.champion = {};
    if (!this.state.champion.currentGuards) this.state.champion.currentGuards = 0;

    if (this.state.champion.currentGuards < this.props.logic.championConfig.guardianCount && this.state.spawnTimer === 0) {
        if (Utils.rand(0, 100) < this.props.championSpawnChance * 100) {
            this._createGuardianInit();
        }
    }
};

ChampionEnemyActor.prototype.onChildDeath = function () {
    this.state.champion.currentGuards--;
};

ChampionEnemyActor.prototype._createGuardianInit = function () {
    this.state.spawnTimer = this.state.spawnTime;
    this.manager.updateActorState(this);
};

ChampionEnemyActor.prototype._spawnGuardianUpdate = function () {
    if (this.state.spawnTimer > 0) {
        this.state.spawnTimer--;

        if (this.state.spawnTimer === 0) {
            this._createGuardian();
            this.playSound(['spawn'], 10);
        }
    }
};

ChampionEnemyActor.prototype._createGuardian = function () {
    var guardianType = this.props.logic.championConfig.guardianTypes[Utils.rand(0, this.props.logic.championConfig.guardianTypes.length - 1)];
    this.spawn({
        classId: ActorFactory.ENEMY,
        subclassId: EnemyConfig.getSubclassIdFor(guardianType),
        angle: [0, 360],
        velocity: [15, 20]
    });

    this.state.champion.currentGuards++;
};

module.exports = ChampionEnemyActor;

},{"logic/actor/enemy/EnemyActor":18,"shared/ActorFactory":110,"shared/EnemyConfig":113}],18:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var Weapon = require('logic/actor/component/weapon/Weapon');
var WeaponConfig = require('shared/WeaponConfig');
var EnemyConfig = require('shared/EnemyConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');

var ActorFactory = require('shared/ActorFactory')('logic');

function EnemyActor(config) {
    config = config || [];

    Object.assign(this, config);
    this.applyConfig(EnemyConfig.getById(config.subclassId));

    this.calloutSound = this.props.calloutSound;

    BaseActor.apply(this, arguments);

    this.applyDifficulty();

    this.props.dropChance = 0.07;
    this.props.dropChanceForRandomWeapon = 0.5;
    this.props.randomWeaponRangeMax = 16;
    this.props.randomWeaponRangeMin = 1;

    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
}

EnemyActor.extend(BaseActor);
EnemyActor.mixin(BrainMixin);

EnemyActor.prototype.applyDifficulty = function () {
    this.props.hp *= this.gameState.getDifficultyForType('hp');
    this.props.acceleration *= this.gameState.getDifficultyForType('acceleration');
    this.props.turnSpeed *= this.gameState.getDifficultyForType('turnSpeed');
    this.props.pointWorth *= this.gameState.getDifficultyForType('pointWorth');
    this.props.powerLevel *= this.gameState.getDifficultyForType('powerLevel');
    this.state.hp *= this.gameState.getDifficultyForType('hp');
    this.state.powerLevel *= this.gameState.getDifficultyForType('powerLevel');
    this.state.acceleration *= this.gameState.getDifficultyForType('acceleration');
    this.state.turnSpeed *= this.gameState.getDifficultyForType('turnSpeed');
    this.state.pointWorth *= this.gameState.getDifficultyForType('pointWorth');
};

EnemyActor.prototype.createBrain = function () {
    return new MookBrain(Object.assign({
        actor: this,
        manager: this.manager,
        gameState: this.gameState,
        enemyActor: this.manager.getFirstPlayerActor()
    }, this.props.logic.brain));
};

EnemyActor.prototype.customUpdate = function () {
    if (this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

EnemyActor.prototype.createWeapon = function () {
    var weaponType = this.props.logic.weapon.type;
    var chanceForRandomWeapon = this.props.logic.weapon.chanceForRandomWeapon || 0;
    var randomWeaponPool = this.props.logic.weapon.randomPool || [];

    if (randomWeaponPool.length > 0 && chanceForRandomWeapon > 0) {
        chanceForRandomWeapon *= 100;
        this.props.dropChance = 1 - (1 - this.props.dropChance) * (1 - this.props.dropChance);
        if (Utils.rand(0, 100) < chanceForRandomWeapon) {
            weaponType = randomWeaponPool[Utils.rand(0, randomWeaponPool.length - 1)];
        }
    }

    this.props.weaponDropType = weaponType;

    var weaponConfig = Object.assign({
        actor: this,
        manager: this.manager
    }, WeaponConfig[weaponType], this.props.logic.weapon);

    return new Weapon(weaponConfig);
};

EnemyActor.prototype.onDeath = function () {
    if (!this.props.logic.onDeath) return;
    this._handleEvent(this.props.logic.onDeath);

    this._notifyParentOfDeath();
    this._dropWeapon();
};

EnemyActor.prototype.onHit = function () {
    if (!this.props.logic.onHit) return;
    this._handleEvent(this.props.logic.onHit);
};

EnemyActor.prototype.onDelayedDeath = function () {
    this.state.deathTimer = Utils.rand(1, this.state.deathTimer);
    this.customUpdate = function () {
        this._handleDelayedDeath();
    };
};

EnemyActor.prototype._handleDelayedDeath = function () {
    if (Utils.rand(0, 100) < this.props.delayedDeath.deathObjectSpawnChance * 100) {
        this.spawn({
            classId: this.props.delayedDeath.deathObjectPool[Utils.rand(0, this.props.delayedDeath.deathObjectPool.length - 1)],
            angle: [0, 360],
            velocity: [50, 100]
        });
    }
};

EnemyActor.prototype._handleEvent = function (config) {
    if (config.spawn) {
        this._spawn(config.spawn);
    }

    if (config.sounds) {
        this.playSound(config.sounds.sounds, config.sounds.volume);
    }
};

EnemyActor.prototype._spawn = function (spawnConfig) {
    var _this = this;

    spawnConfig.forEach(function (object) {
        if (object.delay) {
            setTimeout(function () {
                _this.spawn(object);
            }, object.delay);
        } else {
            _this.spawn(object);
        }
    });
};

EnemyActor.prototype._dropWeapon = function () {
    if (Utils.rand(0, 100) < this.props.dropChance * 100) {
        var weaponTypeId = Utils.rand(0, 100) < this.props.dropChanceForRandomWeapon * 100 ? Utils.rand(this.props.randomWeaponRangeMin, this.props.randomWeaponRangeMax) : WeaponConfig.getSubclassIdFor(this.props.weaponDropType);
        this.spawn({
            classId: ActorFactory.WEAPONPICKUP,
            subclassId: weaponTypeId,
            angle: [0, 360],
            velocity: [15, 20]
        });
    }
};

EnemyActor.prototype._notifyParentOfDeath = function () {
    this.parent && this.parent.onChildDeath && this.parent.onChildDeath();
};

module.exports = EnemyActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/ai/MookBrain":14,"logic/actor/component/body/BaseBody":15,"logic/actor/component/weapon/Weapon":16,"logic/actor/mixin/BrainMixin":22,"shared/ActorFactory":110,"shared/EnemyConfig":113,"shared/WeaponConfig":116}],19:[function(require,module,exports){
'use strict';

var BaseActor = require('logic/actor/BaseActor');
var BaseBody = require('logic/actor/component/body/BaseBody');
var ActorFactory = require('shared/ActorFactory')('logic');
var EnemyConfig = require('shared/EnemyConfig');

function EnemySpawnMarkerActor(config) {
    Object.assign(this, config);
    BaseActor.apply(this, arguments);
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
    var enemiesToSpawn = this.props.enemyClass === 'ORBOT' ? 2 : 1;

    if (!this.created) {
        this.spawn({
            amount: 1,
            classId: this.props.enemyClass,
            subclassId: EnemyConfig.getSubclassIdFor(this.props.enemySubclass),
            angle: [0, 360],
            velocity: [50, 100]
        });
        this.created = true;
    }

    this.playSound(['spawn'], 10);
};

module.exports = EnemySpawnMarkerActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorFactory":110,"shared/EnemyConfig":113}],20:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var EnemyConfig = require('shared/EnemyConfig');

function EnemySpawnerActor(config) {
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ENEMYSPAWNER);
    BaseActor.apply(this, arguments);

    this.state.spawnDelay = 0;
}

EnemySpawnerActor.extend(BaseActor);

EnemySpawnerActor.prototype.customUpdate = function () {
    if (this.state.spawnDelay > 0) {
        this.state.spawnDelay--;
    } else {
        var timeCondition = Utils.rand(Math.min(this.timer / 60, this.props.spawnRate), this.props.spawnRate) === this.props.spawnRate;
        var limitCondition = this.gameState.getActorCountByType('enemyShip') < this.state.globalMaxSpawnedEnemies;
        if (timeCondition && limitCondition) {
            this.createEnemySpawnMarker(this._pickEnemyClassToSpawn());
        }
    }

    if (this.timer % 10 === 0 && this.state.shield < this.props.shield) {
        this.state.shield += 5;
        if (this.state.shield > this.props.shield) {
            this.state.shield = this.props.shield;
        }
        this.manager.updateActorState(this);
    }

    if (this.timer % 60 === 0) {
        this._updateSpawnPool();
    }
};

EnemySpawnerActor.prototype.createEnemySpawnMarker = function (enemySubclass) {
    this.state.spawnDelay = this.props.spawnRate;

    this.spawn({
        classId: ActorFactory.ENEMYSPAWNMARKER,
        angle: [0, 0],
        velocity: [0, 0],
        customConfig: {
            props: {
                enemyClass: ActorFactory.ENEMY,
                enemySubclass: enemySubclass
            }
        }
    });

    this.manager.updateActorState(this);
};

EnemySpawnerActor.prototype.onDelayedDeath = function () {
    this.customUpdate = function () {
        this._handleDelayedDeath();
    };

    this.state.shield = 0;

    this.spawn({
        classId: ActorFactory.ENEMYSPAWNMARKER,
        angle: [0, 0],
        velocity: [0, 0],
        customConfig: {
            props: {
                enemyClass: ActorFactory.CHAMPIONENEMY,
                enemySubclass: this._pickEnemyChampionClassToSpawn()
            }
        }
    });
};

EnemySpawnerActor.prototype._handleDelayedDeath = function () {
    var spawnRandom = Utils.rand(0, 100);

    if (spawnRandom < 5) {
        this.spawn({
            classId: ActorFactory.CHUNK,
            angle: [0, 360],
            velocity: [50, 100]
        });
    } else if (spawnRandom >= 5 && spawnRandom <= 7) {
        this.spawn({
            classId: ActorFactory.FLAMECHUNK,
            angle: [0, 360],
            velocity: [50, 100]
        });
    } else if (spawnRandom >= 7 && spawnRandom <= 10) {
        this.spawn({
            classId: ActorFactory.BOOMCHUNK,
            angle: [0, 360],
            velocity: [20, 40]
        });
    }
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
        if (!this.state.deathTimer) {
            this.playSound(['armorHit1', 'armorHit2'], 10);
        }
    }
};

EnemySpawnerActor.prototype._pickEnemyClassToSpawn = function () {
    return this.state.spawnPool[Utils.rand(0, this.state.spawnPool.length - 1)];
};

EnemySpawnerActor.prototype._pickEnemyChampionClassToSpawn = function () {
    return EnemyConfig.getNameById(Utils.rand(101, 107));
};

EnemySpawnerActor.prototype._updateSpawnPool = function () {
    if (!this.state.nextSpawn && Object.keys(this.props.spawnPoolAdditions.length > 0)) {
        this.state.nextSpawn = this._getNextSpawn();
    }

    if (this.state.nextSpawn) {
        if (this.timer % (this.state.nextSpawn.spawnTime * 60) === 0) {
            this.state.spawnPool.push(this.state.nextSpawn.spawnClass);
            this.state.nextSpawn = null;
        }
    }
};

EnemySpawnerActor.prototype._getNextSpawn = function () {
    var spawnTimes = Object.keys(this.props.spawnPoolAdditions);
    var nextSpawnTime = spawnTimes[0];
    var nextSpawnClass = this.props.spawnPoolAdditions[nextSpawnTime];
    delete this.props.spawnPoolAdditions[nextSpawnTime];

    return { spawnTime: nextSpawnTime, spawnClass: nextSpawnClass };
};

module.exports = EnemySpawnerActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109,"shared/ActorFactory":110,"shared/EnemyConfig":113}],21:[function(require,module,exports){
'use strict';

var BaseActor = require('logic/actor/BaseActor');
var BaseBody = require('logic/actor/component/body/BaseBody');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');

function ItemSpawnerActor(config) {
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ITEMSPAWNER);
    BaseActor.apply(this, arguments);

    this.isSpawner = true;

    this.props.spawns = config.spawns || this.props.spawns;

    this.state.spawnDelay = this.props.spawns && this.props.spawns.spawnedInitially ? 0 : -1;
}

ItemSpawnerActor.extend(BaseActor);

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

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109,"shared/ActorFactory":110}],22:[function(require,module,exports){
"use strict";

var BrainMixin = {
    doBrainOrders: function doBrainOrders() {
        if (this.brain.orders.lookAtPosition) {
            this._lookAtPosition(this.brain.orders.lookAtPosition);
            if (this.brain.orders.turn > 0) {
                this.setAngleForce(this.brain.orders.turn);
                if (!this.orders) {
                    this.orders = {};
                }
                this.orders.horizontalThrust = -1;
            } else if (this.brain.orders.turn < 0) {
                this.setAngleForce(this.brain.orders.turn);
                if (!this.orders) {
                    this.orders = {};
                }
                this.orders.horizontalThrust = 1;
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
    _lookAtPosition: function _lookAtPosition(position) {
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

},{}],23:[function(require,module,exports){
"use strict";

var HomingMixin = {
    updateHomingLock: function updateHomingLock() {
        if (!this._homingTarget && this.timer % Constants.HOMING_LOCK_ACQUIRE_FREQUENCY === 0) {
            this._homingTarget = this._findClosestTarget();
        }

        //todo: poprawny retargeting

        if (this._homingTarget) {
            var lookAtPosition = this._getTargetPositionWithLead(250, 1);
            this._lookAtPosition(lookAtPosition);
        }

        this.setThrust(1);
    },

    _lookAtPosition: function _lookAtPosition(position) {
        var velocity = this.getVelocity();
        var actorPosition = this.getPosition();

        var velocityAngle = Math.atan2(velocity[0], velocity[1]);

        if (velocityAngle < Math.PI) {
            velocityAngle *= -1;
        } else {
            velocityAngle = Math.PI * 2 - velocityAngle;
        }

        var bodyAngle = Utils.angleToVector(this._body.angle, 1);
        velocityAngle = Utils.angleToVector(velocityAngle, 1);

        bodyAngle = Utils.angleBetweenPointsFromCenter(bodyAngle, [position[0] - actorPosition[0], position[1] - actorPosition[1]]);
        velocityAngle = Utils.angleBetweenPointsFromCenter(velocityAngle, [position[0] - actorPosition[0], position[1] - actorPosition[1]]);

        var aspectSeekDistance = this.props.acceleration;
        var distanceBetweenActors = Math.min(Utils.distanceBetweenActors(this, this._homingTarget), aspectSeekDistance);

        var velocityModifier = (1 - distanceBetweenActors / aspectSeekDistance) * this.props.acceleration / 1100;
        var bodyModifier = 1 - velocityModifier;

        var angle = bodyAngle * bodyModifier + velocityAngle * velocityModifier;

        if (angle < 180 && angle > 0) {
            this.setAngleForce(Math.min(angle / this.getStepAngle(), 1) * -1);
        }

        if (angle >= 180 && angle < 360) {
            this.setAngleForce(Math.min((360 - angle) / this.getStepAngle(), 1));
        }
    },

    _findClosestTarget: function _findClosestTarget() {
        var targetActors = void 0,
            targetActor = void 0,
            distance = void 0,
            currentlyClosestActor = void 0,
            minimumDistance = this.props.homingRange || Infinity;

        var targetTypes = this.props.homingAgainst;

        for (var i = 0; i < targetTypes.length; i++) {
            targetActors = this.manager.getActorsByType(targetTypes[i]);
            for (var targetActorId in targetActors) {
                targetActor = targetActors[targetActorId];
                distance = Utils.distanceBetweenActors(targetActor, this);

                if (distance < minimumDistance) {
                    minimumDistance = distance;

                    var wallBetween = this._isWallBetween(this.getPosition(), targetActor.getPosition());
                    var inArc = Utils.pointInArc(this.getPosition(), targetActor.getPosition(), this.getAngle(), this.props.homingArc);

                    if (!wallBetween && inArc) {
                        currentlyClosestActor = targetActor;
                    }
                }
            }
        }

        return currentlyClosestActor;
    },

    _isWallBetween: function _isWallBetween(positionA, positionB) {
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
                if (this._isPositionInWall(point)) {
                    this._homingTarget = false;
                    return true;
                }
            }
        }
        return false;
    },
    _isPositionInWall: function _isPositionInWall(position) {
        if (this.manager.aiImage) {
            var imageObject = this.manager.aiImage;
            var aiPosition = this._castPosition(position, imageObject);
            return imageObject.imageData.data[(aiPosition[1] * imageObject.imageData.width + aiPosition[0]) * 4] === 0;
        } else {
            return false;
        }
    },
    _castPosition: function _castPosition(position, imageObject) {
        return [parseInt(position[0] * imageObject.lengthMultiplierX + imageObject.centerX), parseInt(position[1] * imageObject.lengthMultiplierY + imageObject.centerY)];
    },
    _getTargetPositionWithLead: function _getTargetPositionWithLead() {
        var leadSpeed = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
        var leadSkill = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        var p = this.getPosition();

        var tp = this._homingTarget.getPosition();
        var tv = this._homingTarget.getVelocity();
        var lv = this.getAngleVector(leadSpeed);

        var lead = Math.sqrt(leadSkill * (((tp[0] - p[0]) * (tp[0] - p[0]) + (tp[1] - p[1]) * (tp[1] - p[1])) / (lv[0] * lv[0] + lv[1] * lv[1])));
        return [tp[0] + tv[0] * lead, tp[1] + tv[1] * lead];
    }
};

module.exports = HomingMixin;

},{}],24:[function(require,module,exports){
"use strict";

var InputMixin = {
    _lastInputState: {},

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

        if (!inputState.q && this._lastInputState.q === 1) {
            this.secondaryWeaponSystem.switchWeaponToNext();
        }

        if (!inputState.e && this._lastInputState.e === 1) {
            this.primaryWeaponSystem.switchWeaponToNext();
        }

        if (inputState.q && this._lastInputState.q > 1) {
            this.secondaryWeaponSystem.dropWeapon();
            this.secondaryWeaponSystem.lockDropWeapon();
        }

        if (inputState.e && this._lastInputState.e > 1) {
            this.primaryWeaponSystem.dropWeapon();
            this.primaryWeaponSystem.lockDropWeapon();
        }

        if (!inputState.q && this._lastInputState.q > 1) {
            this.secondaryWeaponSystem.unlockDropWeapon();
        }

        if (!inputState.e && this._lastInputState.e > 1) {
            this.primaryWeaponSystem.unlockDropWeapon();
        }
    },

    saveLastInput: function saveLastInput(inputState) {
        this._lastInputState = Object.assign({}, inputState);
    }
};

module.exports = InputMixin;

},{}],25:[function(require,module,exports){
'use strict';

var PickupMixin = {
    _pickupValues: {
        shield: 10,
        energy: 25,
        plasma: 25,
        missileQuad: 4,
        bullets: 400
    },

    handlePickup: function handlePickup(pickupActorState, pickupActorSubclassId) {
        var canPickup = void 0;
        switch (pickupActorState.pickup) {
            case 'shield':
                canPickup = this._handleShieldPickup();break;
            case 'energy':
                canPickup = this._handleEnergyPickup();break;
            case 'plasma':
                canPickup = this._handlePlasmaPickup();break;
            case 'missileQuad':
                canPickup = this._handleMissileQuadPickup();break;
            case 'bulletAmmo':
                canPickup = this._handleBulletAmmoPickup();break;
            case 'weapon':
                canPickup = pickupActorState.pickupBlockedTimer === 0 && this._handleWeaponPickup(pickupActorSubclassId);break;
            default:
                throw new Error('unknown pickup: ' + pickupActorState, pickupActorState.pickup);
        }
        if (canPickup) {
            this.playSound(['powerup'], 1);
        }
        return canPickup;
    },

    _handleShieldPickup: function _handleShieldPickup() {
        this.state.shield += this._pickupValues['shield'];
        if (this.state.shield > this.props.shield) {
            this.state.shield = this.props.shield;
        }
        this.gameState.handleShieldPickup(this._pickupValues['shield']);
        return true;
    },

    _handleEnergyPickup: function _handleEnergyPickup() {
        if (!this.gameState) throw new Error('Cannot handle an energy pickup for an actor without gameState!');
        this.gameState.addAmmo({ energy: this._pickupValues['energy'] }, true);
        return true;
    },

    _handlePlasmaPickup: function _handlePlasmaPickup() {
        if (!this.gameState) throw new Error('Cannot handle a plasma pickup for an actor without gameState!');
        this.gameState.addAmmo({ plasma: this._pickupValues['plasma'] }, true);
        return true;
    },

    _handleMissileQuadPickup: function _handleMissileQuadPickup() {
        if (!this.gameState) throw new Error('Cannot handle a missileQuad pickup for an actor without gameState!');
        this.gameState.addAmmo({ missiles: this._pickupValues['missileQuad'] }, true);
        return true;
    },

    _handleBulletAmmoPickup: function _handleBulletAmmoPickup() {
        if (!this.gameState) throw new Error('Cannot handle a bulletAmmo pickup for an actor without gameState!');
        this.gameState.addAmmo({ bullets: this._pickupValues['bullets'] }, true);
        return true;
    },

    _handleWeaponPickup: function _handleWeaponPickup(weaponSubclassId) {
        if (!this.gameState) throw new Error('Cannot handle a weapon pickup for an actor without gameState!');

        var primaryOpenSlotInfo = this.primaryWeaponSystem.getOpenSlotInfo();
        var secondaryOpenSlotInfo = this.secondaryWeaponSystem.getOpenSlotInfo();

        if (primaryOpenSlotInfo.isOpen || secondaryOpenSlotInfo.isOpen) {

            var pickupingWeaponSystem = primaryOpenSlotInfo.emptyWeaponCount >= secondaryOpenSlotInfo.emptyWeaponCount ? this.primaryWeaponSystem : this.secondaryWeaponSystem;
            var openSlotInfo = pickupingWeaponSystem === this.primaryWeaponSystem ? primaryOpenSlotInfo : secondaryOpenSlotInfo;

            var weaponIndex = void 0;
            if (openSlotInfo.forcedPickup) {
                weaponIndex = pickupingWeaponSystem.getCurrentWeaponIndex();
            } else if (openSlotInfo.firstSlotIsOpen) {
                weaponIndex = 0;
            } else if (openSlotInfo.secondSlotIsOpen) {
                weaponIndex = 1;
            } else {
                this.gameState.informOfNoFreeWeaponSlots();
                return false;
            }

            if (openSlotInfo.forcedPickup) {
                pickupingWeaponSystem.blockWeaponSwitch();
            }

            pickupingWeaponSystem.replaceWeapon(weaponIndex, weaponSubclassId);

            return true;
        } else {
            this.gameState.informOfNoFreeWeaponSlots();
            return false;
        }
    }
};

module.exports = PickupMixin;

},{}],26:[function(require,module,exports){
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

BoomChunkActor.prototype.onTimeout = function () {
    var _this = this;

    setTimeout(function () {
        _this.spawn({
            classId: ActorFactory.SMALLEXPLOSION,
            angle: [0, 360],
            velocity: [60, 120]
        });
    }, 100);
};

module.exports = BoomChunkActor;

},{"logic/actor/object/ChunkActor":27,"shared/ActorConfig":109,"shared/ActorFactory":110}],27:[function(require,module,exports){
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

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],28:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');

function ExplosionActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.EXPLOSION);
    BaseActor.apply(this, arguments);
}

ExplosionActor.extend(BaseActor);

module.exports = ExplosionActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109,"shared/ActorFactory":110}],29:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function FlameChunkActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.FLAMECHUNK);
    BaseActor.apply(this, arguments);
}

FlameChunkActor.extend(BaseActor);

FlameChunkActor.prototype.createBody = function () {
    return new BaseBody(Object.assign(this.bodyConfig, {
        shape: new p2.Circle({
            radius: 1,
            collisionGroup: Constants.COLLISION_GROUPS.OBJECT,
            collisionMask: Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.SHIPPROJECTILE
        })
    }));
};

FlameChunkActor.prototype.onSpawn = function () {
    this.setAngleForce(Utils.rand(-35, 35));
};

module.exports = FlameChunkActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],30:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function SmallExplosionActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.SMALLEXPLOSION);
    BaseActor.apply(this, arguments);
}

SmallExplosionActor.extend(BaseActor);

module.exports = SmallExplosionActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],31:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function BulletAmmoPickupActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.BULLETAMMOPICKUP);
    BaseActor.apply(this, arguments);
    if (this.parent && this.parent.isSpawner) {
        this.props.timeout = 9999999;
    }
}

BulletAmmoPickupActor.extend(BaseActor);

BulletAmmoPickupActor.prototype.onDeath = function () {
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};

module.exports = BulletAmmoPickupActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],32:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function EnergyPickupActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ENERGYPICKUP);
    BaseActor.apply(this, arguments);
    if (this.parent && this.parent.isSpawner) {
        this.props.timeout = 9999999;
    }
}

EnergyPickupActor.extend(BaseActor);

EnergyPickupActor.prototype.onDeath = function () {
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};

module.exports = EnergyPickupActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],33:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function MissileQuadPickupActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.MISSILEQUADPICKUP);
    BaseActor.apply(this, arguments);
    if (this.parent && this.parent.isSpawner) {
        this.props.timeout = 9999999;
    }
}

MissileQuadPickupActor.extend(BaseActor);

MissileQuadPickupActor.prototype.onDeath = function () {
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};

module.exports = MissileQuadPickupActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],34:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function PlasmaPickupActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PLASMAPICKUP);
    BaseActor.apply(this, arguments);
    if (this.parent && this.parent.isSpawner) {
        this.props.timeout = 9999999;
    }
}

PlasmaPickupActor.extend(BaseActor);

PlasmaPickupActor.prototype.onDeath = function () {
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};

module.exports = PlasmaPickupActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],35:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function ShieldPickupActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.SHIELDPICKUP);
    BaseActor.apply(this, arguments);
    if (this.parent && this.parent.isSpawner) {
        this.props.timeout = 9999999;
    }
}

ShieldPickupActor.extend(BaseActor);

ShieldPickupActor.prototype.onDeath = function () {
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};

module.exports = ShieldPickupActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],36:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var WeaponConfig = require('shared/WeaponConfig');

function WeaponPickupActor(config) {
    config = config || [];
    Object.assign(this, config);

    this.applyConfig(ActorConfig.WEAPONPICKUP);
    this.props.weaponConfig = WeaponConfig.getById(config.subclassId);

    BaseActor.apply(this, arguments);
    if (this.parent && this.parent.isSpawner) {
        this.props.timeout = 9999999;
    }

    this.state.pickupBlockedTimer = config.parent && config.parent.isOwnedByPlayer() ? 120 : 0;
}

WeaponPickupActor.extend(BaseActor);

WeaponPickupActor.prototype.isPickupPossible = function () {
    return this.props.pickupBlockedTimer === 0;
};

WeaponPickupActor.prototype.customUpdate = function () {
    if (this.state.pickupBlockedTimer > 0) {
        this.state.pickupBlockedTimer--;
    }
};

WeaponPickupActor.prototype.onDeath = function () {
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};

module.exports = WeaponPickupActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109,"shared/WeaponConfig":116}],37:[function(require,module,exports){
'use strict';

var ShipActor = require('logic/actor/player/ShipActor');
var ActorConfig = require('shared/ActorConfig');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var Weapon = require('logic/actor/component/weapon/Weapon');
var ActorTypes = require('shared/ActorTypes');
var WeaponConfig = require('shared/WeaponConfig');

function DemoShipActor() {
    this.applyConfig(ActorConfig.DEMOSHIP);
    ShipActor.apply(this, arguments);
    this.weapon = this.createWeapon();
    this.brain = this.createBrain();
}

DemoShipActor.extend(ShipActor);
DemoShipActor.mixin(BrainMixin);

DemoShipActor.prototype.createBrain = function () {
    return new MookBrain({
        actor: this,
        manager: this.manager,
        gameState: this.gameState,
        enemyTypes: ActorTypes.getEnemyTypes(),
        firingDistance: 800,
        shootingArc: 20,
        leadSkill: 1
    });
};

DemoShipActor.prototype.customUpdate = function () {
    this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

DemoShipActor.prototype.createWeapon = function () {
    var weaponConfig = Object.assign({
        actor: this,
        manager: this.manager
    }, WeaponConfig['RED_BLASTER'], {
        type: 'RED_BLASTER',
        firingPoints: [{ offsetAngle: -50, offsetDistance: 4, fireAngle: 0 }, { offsetAngle: 50, offsetDistance: 4, fireAngle: 0 }]
    });

    return new Weapon(weaponConfig);
};

module.exports = DemoShipActor;

},{"logic/actor/component/ai/MookBrain":14,"logic/actor/component/weapon/Weapon":16,"logic/actor/mixin/BrainMixin":22,"logic/actor/player/ShipActor":38,"shared/ActorConfig":109,"shared/ActorTypes":111,"shared/WeaponConfig":116}],38:[function(require,module,exports){
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

    BaseActor.apply(this, arguments);
}

ShipActor.extend(BaseActor);
ShipActor.mixin(InputMixin);
ShipActor.mixin(PickupMixin);

ShipActor.prototype.customUpdate = function () {
    this.primaryWeaponSystem.update();
    this.secondaryWeaponSystem.update();
};

ShipActor.prototype.playerUpdate = function (inputState) {
    if (inputState) {
        this.applyThrustInput(inputState);
        this.applyLookAtAngleInput(inputState);
        this.applyWeaponInput(inputState);
        this.saveLastInput(inputState);
    }
};

ShipActor.prototype.createPrimaryWeaponSystem = function () {
    return new WeaponSystem({
        actor: this,
        gameState: this.gameState,
        firingPoints: [{ offsetAngle: -40, offsetDistance: 7.5, fireAngle: 0 }, { offsetAngle: 40, offsetDistance: 7.5, fireAngle: 0 }],
        weaponSystemIndex: 0
    });
};

ShipActor.prototype.createSecondaryWeaponSystem = function () {
    return new WeaponSystem({
        actor: this,
        gameState: this.gameState,
        firingPoints: [{ offsetAngle: -50, offsetDistance: 4, fireAngle: 0 }, { offsetAngle: 50, offsetDistance: 4, fireAngle: 0 }],
        weaponSystemIndex: 1
    });
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
    this.spawn({
        amount: Utils.rand(15, 20),
        classId: ActorFactory.FLAMECHUNK,
        angle: [0, 360],
        velocity: [200, 300]
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

},{"logic/actor/BaseActor":10,"logic/actor/component/WeaponSystem":12,"logic/actor/component/body/BaseBody":15,"logic/actor/mixin/InputMixin":24,"logic/actor/mixin/PickupMixin":25,"shared/ActorConfig":109,"shared/ActorFactory":110}],39:[function(require,module,exports){
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

ConcsnMissileActor.prototype.onDeath = function () {
    var _this = this;

    setTimeout(function () {
        _this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);
    this.spawn({
        amount: Utils.rand(1, 5),
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: Utils.rand(15, 20),
        classId: ActorFactory.FLAMECHUNK,
        angle: [0, 360],
        velocity: [200, 300]
    });
};

module.exports = ConcsnMissileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109,"shared/ActorFactory":110}],40:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var HomingMixin = require('logic/actor/mixin/HomingMixin');

function EmdProjectileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.EMDPROJECTILE);
    BaseActor.apply(this, arguments);
}

EmdProjectileActor.extend(BaseActor);
EmdProjectileActor.mixin(HomingMixin);

EmdProjectileActor.prototype.customUpdate = function () {
    this.updateHomingLock();
};

module.exports = EmdProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"logic/actor/mixin/HomingMixin":23,"shared/ActorConfig":109}],41:[function(require,module,exports){
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

EnemyConcsnMissileActor.prototype.onDeath = function () {
    var _this = this;

    setTimeout(function () {
        _this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);
    this.spawn({
        amount: Utils.rand(1, 5),
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: Utils.rand(15, 20),
        classId: ActorFactory.FLAMECHUNK,
        angle: [0, 360],
        velocity: [200, 300]
    });
};

module.exports = EnemyConcsnMissileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109,"shared/ActorFactory":110}],42:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');
var HomingMixin = require('logic/actor/mixin/HomingMixin');

function EnemyHomingMissileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ENEMYHOMINGMISSILE);
    BaseActor.apply(this, arguments);
}

EnemyHomingMissileActor.extend(BaseActor);
EnemyHomingMissileActor.mixin(HomingMixin);

EnemyHomingMissileActor.prototype.customUpdate = function () {
    this.updateHomingLock();
};

EnemyHomingMissileActor.prototype.onDeath = function () {
    var _this = this;

    setTimeout(function () {
        _this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);
    this.spawn({
        amount: Utils.rand(1, 5),
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: Utils.rand(15, 20),
        classId: ActorFactory.FLAMECHUNK,
        angle: [0, 360],
        velocity: [200, 300]
    });
};

module.exports = EnemyHomingMissileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"logic/actor/mixin/HomingMixin":23,"shared/ActorConfig":109,"shared/ActorFactory":110}],43:[function(require,module,exports){
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

module.exports = GreenLaserProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],44:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');
var HomingMixin = require('logic/actor/mixin/HomingMixin');

function HomingMissileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.HOMINGMISSILE);
    BaseActor.apply(this, arguments);
}

HomingMissileActor.extend(BaseActor);
HomingMissileActor.mixin(HomingMixin);

HomingMissileActor.prototype.customUpdate = function () {
    this.updateHomingLock();
};

HomingMissileActor.prototype.onDeath = function () {
    var _this = this;

    setTimeout(function () {
        _this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);
    this.spawn({
        amount: Utils.rand(1, 5),
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: Utils.rand(15, 20),
        classId: ActorFactory.FLAMECHUNK,
        angle: [0, 360],
        velocity: [200, 300]
    });
};

module.exports = HomingMissileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"logic/actor/mixin/HomingMixin":23,"shared/ActorConfig":109,"shared/ActorFactory":110}],45:[function(require,module,exports){
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

module.exports = LaserProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],46:[function(require,module,exports){
'use strict';

var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function MinigunProjectileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.MINIGUNPROJECTILE);
    BaseActor.apply(this, arguments);
}

MinigunProjectileActor.extend(BaseActor);

module.exports = MinigunProjectileActor;

},{"logic/actor/BaseActor":10,"shared/ActorConfig":109}],47:[function(require,module,exports){
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

module.exports = MoltenProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],48:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function PlasmaBlastMiniProjectile(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PLASMABLASTMINIPROJECTILE);
    BaseActor.apply(this, arguments);
}

PlasmaBlastMiniProjectile.extend(BaseActor);

module.exports = PlasmaBlastMiniProjectile;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],49:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');

function PlasmaBlastProjectileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PLASMABLASTPROJECTILE);
    BaseActor.apply(this, arguments);
}

PlasmaBlastProjectileActor.extend(BaseActor);

PlasmaBlastProjectileActor.prototype.onDeath = function () {
    this._explode();
};

PlasmaBlastProjectileActor.prototype.onTimeout = function () {
    this._explode();
};

PlasmaBlastProjectileActor.prototype._explode = function () {
    this.playSound(['plasmabig1']);
    this.spawn({
        amount: 50,
        classId: ActorFactory.PLASMABLASTMINIPROJECTILE,
        angle: [-360, 360],
        velocity: [250, 450],
        spawnOffset: -10,
        isPlayer: this.isPlayer,
        powerLevel: this.powerLevel
    });
};

module.exports = PlasmaBlastProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109,"shared/ActorFactory":110}],50:[function(require,module,exports){
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

module.exports = PlasmaProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],51:[function(require,module,exports){
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

PulseWaveProjectileActor.prototype.customUpdate = function () {
    this.setMass(this.getMass() * 0.96);
    this.props.damage *= 0.95;
};

module.exports = PulseWaveProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],52:[function(require,module,exports){
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

module.exports = PurpleLaserProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],53:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function RedLaserEnemyProjectileActor(config) {
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.REDLASERENEMYPROJECTILE);
    BaseActor.apply(this, arguments);
}

RedLaserEnemyProjectileActor.extend(BaseActor);

module.exports = RedLaserEnemyProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],54:[function(require,module,exports){
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

module.exports = RedLaserProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],55:[function(require,module,exports){
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

RingProjectileActor.prototype.customUpdate = function () {
    this.setMass(this.getMass() * 0.96);
    this.props.damage *= 0.95;
};

module.exports = RingProjectileActor;

},{"logic/actor/BaseActor":10,"logic/actor/component/body/BaseBody":15,"shared/ActorConfig":109}],56:[function(require,module,exports){
"use strict";

function MapAiGraphCreator(config) {
    this.graph = {};
    this.positions = {};
}

MapAiGraphCreator.prototype.createGraph = function () {};

MapAiGraphCreator.prototype.createPositions = function () {};

module.exports = MapAiGraphCreator;

},{}],57:[function(require,module,exports){
'use strict';

var BaseBody = require('logic/actor/component/body/BaseBody');

function MapChunk(config) {
    if (!config.vertices) throw new Error('no vertices specified for a MapChunk!');

    Object.assign(this, config);

    this.body = this.createBody();
}

MapChunk.prototype.createBody = function () {
    return new BaseBody({
        position: [0, 0],
        shape: this.createShape(),
        mass: 0
    });
};

MapChunk.prototype.createShape = function () {
    return new p2.Convex({
        vertices: this.vertices,
        collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
        collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.PICKUP
    });
};

module.exports = MapChunk;

},{"logic/actor/component/body/BaseBody":15}],58:[function(require,module,exports){
'use strict';

function MapCreator(config) {
    EventEmitter.apply(this, arguments);
    this.chunkPrototypes = {};

    this.mapLayout = [];
}

MapCreator.extend(EventEmitter);

MapCreator.prototype.createMap = function () {
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

},{}],59:[function(require,module,exports){
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
    var hitmapShapes = void 0,
        chunkPrototypeCollection = void 0;

    for (var hitmapName in hitmaps) {
        chunkPrototypeCollection = [];
        hitmapShapes = this.fixFaceVerticesOrder(this.extractXZFromHitmap(hitmaps[hitmapName]));
        hitmapShapes.forEach(function (shape) {
            chunkPrototypeCollection.push(new MapChunk({
                vertices: shape
            }));
        });
        this.chunkPrototypes[hitmapName] = chunkPrototypeCollection;
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

    var bodies = [],
        newBody = void 0;

    layout.forEach(function (chunkConfig) {
        if (!_this.chunkPrototypes[chunkConfig.name]) {
            return;
        }

        _this.chunkPrototypes[chunkConfig.name].forEach(function (chunkShape) {
            newBody = cloner.deep.copy(chunkShape);
            newBody.body.position[0] = chunkConfig.position[0] * Constants.CHUNK_SIZE;
            newBody.body.position[1] = chunkConfig.position[1] * Constants.CHUNK_SIZE;
            newBody.body.angle = Utils.degToRad(chunkConfig.angle);
            bodies.push(newBody.body);
        });
    });

    return bodies;
};

module.exports = MapManager;

},{"cloner":1,"logic/map/MapAiGraphCreator":56,"logic/map/MapChunk":57,"logic/map/MapCreator":58}],60:[function(require,module,exports){
'use strict';

var BaseStateChangeHandler = require('renderer/actor/component/stateChangeHandler/BaseStateChangeHandler');

function BaseActor(config, actorDependencies) {
    this.id = this.id || config.actorId;
    this.props = this._createProps(this.props || {});
    this.state = this._createState(this.state || {});
    this.timer = 0;

    this._manager = config.manager;
    this._gameState = config.gameState;
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

BaseActor.prototype.getManager = function () {
    return this._manager;
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

BaseActor.prototype.handleDeath = function (deathType) {
    switch (deathType) {
        case Constants.DEATH_TYPES.HIT:
            this.onDeath();
            break;
        case Constants.DEATH_TYPES.TIMEOUT:
            this.onTimeout();
            break;
    }
};

BaseActor.prototype.onDeath = function () {};

BaseActor.prototype.onTimeout = function () {};

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

},{"renderer/actor/component/stateChangeHandler/BaseStateChangeHandler":69}],61:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],62:[function(require,module,exports){
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

},{}],63:[function(require,module,exports){
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

},{"renderer/actor/component/mesh/BaseMesh":62,"renderer/assetManagement/model/ModelStore":108}],64:[function(require,module,exports){
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

},{"renderer/actor/component/mesh/BaseMesh":62,"renderer/assetManagement/model/ModelStore":108}],65:[function(require,module,exports){
'use strict';

var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function PickupMesh(config) {
    BaseMesh.apply(this, arguments);
    this.rotationOffset = Math.PI;

    config = config || {};
    config.geometry = ModelStore.get(config.modelName).geometry;
    config.material = ModelStore.get('weaponModel').material;
    Object.assign(this, config);

    this.scale.x = config.scaleX || 4;
    this.scale.y = config.scaleY || 4;
    this.scale.z = config.scaleZ || 4;

    this.spinSpeed = [0, 0, 0.05];

    this.castShadow = true;
}

PickupMesh.extend(BaseMesh);

PickupMesh.prototype.update = function () {
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

module.exports = PickupMesh;

},{"renderer/actor/component/mesh/BaseMesh":62,"renderer/assetManagement/model/ModelStore":108}],66:[function(require,module,exports){
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

},{"renderer/actor/component/mesh/BaseMesh":62,"renderer/assetManagement/model/ModelStore":108}],67:[function(require,module,exports){
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

},{"renderer/actor/component/mesh/BaseMesh":62,"renderer/assetManagement/model/ModelStore":108}],68:[function(require,module,exports){
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

},{"renderer/actor/component/mesh/BaseMesh":62,"renderer/assetManagement/model/ModelStore":108}],69:[function(require,module,exports){
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

},{}],70:[function(require,module,exports){
'use strict';

var EnemyActor = require('renderer/actor/enemy/EnemyActor');

function ChampionEnemyActor(config) {
    EnemyActor.apply(this, arguments);
    this.props.spawnTime = 120;
}

ChampionEnemyActor.extend(EnemyActor);

ChampionEnemyActor.prototype.customUpdate = function () {
    this.doBob();
    this.showDamage();
    this._doSpawnInitAnimation();
};

ChampionEnemyActor.prototype._doSpawnInitAnimation = function () {
    if (this.state.spawnTimer <= 0) return;

    this.state.spawnTimer--;

    var intensity = (this.state.spawnTime - this.state.spawnTimer) * 2;

    if (this.state.spawnTimer === 0) {
        this._doSpawnInitBlast();
    }

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: Utils.rand(intensity / 5, intensity / 5 + 20),
        alpha: intensity / 480,
        alphaMultiplier: 0.8,
        lifeTime: 2
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'WHITE',
        scale: Utils.rand(intensity / 10, intensity / 10 + 10),
        alpha: intensity / 480,
        alphaMultiplier: 0.8,
        lifeTime: 2
    });

    for (var i = 0; i < intensity / 15; i++) {
        var rotation = Utils.rand(0, 360);
        var offsetPosition = Utils.rotationToVector(rotation, Utils.rand(20, 30));
        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPosition[0],
            offsetPositionY: offsetPosition[1],
            color: 'PURPLE',
            scale: 0.4 + intensity / 300,
            alpha: 0.2,
            alphaMultiplier: 1.2,
            particleVelocity: -(Utils.rand(intensity / 15, intensity / 10) / 10),
            particleRotation: rotation,
            speedZ: Utils.rand(-40, 40) / 100,
            lifeTime: 12,
            spriteNumber: 2
        });
    }
};

ChampionEnemyActor.prototype._doSpawnInitBlast = function () {
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

module.exports = ChampionEnemyActor;

},{"renderer/actor/enemy/EnemyActor":71}],71:[function(require,module,exports){
'use strict';

var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var EnemyConfig = require('shared/EnemyConfig');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function EnemyActor(config) {
    this.applyConfig(EnemyConfig.getById(config.subclassId));
    BaseActor.apply(this, arguments);

    this.applyDifficulty();
}

EnemyActor.extend(BaseActor);
EnemyActor.mixin(ParticleMixin);
EnemyActor.mixin(BobMixin);
EnemyActor.mixin(ShowDamageMixin);

EnemyActor.prototype.createMeshes = function () {
    return [new BaseMesh({
        actor: this,
        scaleX: this.props.render.model.scaleX,
        scaleY: this.props.render.model.scaleY,
        scaleZ: this.props.render.model.scaleZ,
        geometry: ModelStore.get(this.props.render.model.geometry).geometry,
        material: ModelStore.get(this.props.render.model.material).material
    })];
};

EnemyActor.prototype.customUpdate = function () {
    this.doBob();
    this.showDamage();
};

EnemyActor.prototype.onSpawn = function () {};

EnemyActor.prototype.onDeath = function () {
    var _this = this;

    if (!this.props.render.onDeath) return;

    if (this.props.render.onDeath.premades) {
        this.props.render.onDeath.premades.forEach(function (premade) {
            _this.createPremade({ premadeName: premade });
        });
    }

    if (this.props.render.onDeath.uiFlash) {
        this.requestUiFlash(this.props.render.onDeath.uiFlash);
    }

    if (this.props.render.onDeath.shake) {
        this.requestShake();
    }
};

EnemyActor.prototype.applyDifficulty = function () {
    this.props.hp *= this._gameState.getDifficultyForType('hp');
    this.state.hp *= this._gameState.getDifficultyForType('hp');
};

module.exports = EnemyActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/component/mesh/ShipMesh":68,"renderer/actor/mixin/BobMixin":75,"renderer/actor/mixin/ParticleMixin":76,"renderer/actor/mixin/ShowDamageMixin":77,"renderer/assetManagement/model/ModelStore":108,"shared/EnemyConfig":113}],72:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],73:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":60,"renderer/actor/component/mesh/BaseMesh":62,"renderer/actor/component/mesh/ShieldMesh":67,"renderer/actor/mixin/ParticleMixin":76,"renderer/assetManagement/model/ModelStore":108,"shared/ActorConfig":109}],74:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');

function ItemSpawnerActor() {
    BaseActor.apply(this, arguments);
}

ItemSpawnerActor.extend(BaseActor);

module.exports = ItemSpawnerActor;

},{"renderer/actor/BaseActor":60}],75:[function(require,module,exports){
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

},{}],76:[function(require,module,exports){
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

},{}],77:[function(require,module,exports){
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

},{}],78:[function(require,module,exports){
'use strict';

var ChunkActor = require('renderer/actor/object/ChunkActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function BoomChunkActor() {
    ChunkActor.apply(this, arguments);
}

BoomChunkActor.extend(ChunkActor);
BoomChunkActor.mixin(ParticleMixin);

BoomChunkActor.prototype.onTimeout = function () {
    this.createPremade({ premadeName: 'OrangeBoomLarge' });
    this.requestUiFlash('white');
    this.requestShake();
};

module.exports = BoomChunkActor;

},{"renderer/actor/mixin/ParticleMixin":76,"renderer/actor/object/ChunkActor":79}],79:[function(require,module,exports){
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
    this.createPremade({ premadeName: 'OrangeBoomTiny' });
};

module.exports = ChunkActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/component/mesh/ChunkMesh":63,"renderer/actor/mixin/ParticleMixin":76}],80:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function ExplosionActor() {
    BaseActor.apply(this, arguments);
}

ExplosionActor.extend(BaseActor);
ExplosionActor.mixin(ParticleMixin);

module.exports = ExplosionActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],81:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function FlameChunkActor() {
    BaseActor.apply(this, arguments);
}

FlameChunkActor.extend(BaseActor);
FlameChunkActor.mixin(ParticleMixin);

FlameChunkActor.prototype.customUpdate = function () {
    this.createParticle({
        particleClass: 'smokePuffAlpha',
        offsetPositionX: Utils.rand(-2, 2),
        offsetPositionY: Utils.rand(-2, 2),
        color: 'WHITE',
        scale: Utils.rand(2, 5) / (this.timer + 1) * 8,
        alpha: 0.4,
        alphaMultiplier: 0.9,
        particleVelocity: Utils.rand(0, 1) / 10,
        particleRotation: Utils.rand(0, 360),
        lifeTime: 50
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'WHITE',
        scale: 6 / (this.timer + 1) * 12,
        alpha: 0.8,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 15
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'ORANGE',
        scale: 8 / (this.timer + 1) * 12,
        alpha: 0.8,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 20
    });
};

FlameChunkActor.prototype.onDeath = function () {
    this.createPremade({ premadeName: 'OrangeBoomTiny' });
};

module.exports = FlameChunkActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],82:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function SmallExplosionActor() {
    BaseActor.apply(this, arguments);
}

SmallExplosionActor.extend(BaseActor);
SmallExplosionActor.mixin(ParticleMixin);

module.exports = SmallExplosionActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],83:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var PickupMesh = require('renderer/actor/component/mesh/PickupMesh');

function BulletAmmoPickupActor() {
    BaseActor.apply(this, arguments);
}

BulletAmmoPickupActor.extend(BaseActor);
BulletAmmoPickupActor.mixin(ParticleMixin);

BulletAmmoPickupActor.prototype.createMeshes = function () {
    return [new PickupMesh({
        actor: this,
        modelName: 'minigunammo'
    })];
};

BulletAmmoPickupActor.prototype.onDeath = function () {
    this.createPremade({
        premadeName: 'SmokePuffSmall',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

BulletAmmoPickupActor.prototype.customUpdate = function () {
    this.createPremade({
        premadeName: 'BulletAmmoPickup',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

module.exports = BulletAmmoPickupActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/component/mesh/PickupMesh":65,"renderer/actor/mixin/ParticleMixin":76}],84:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],85:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var PickupMesh = require('renderer/actor/component/mesh/PickupMesh');

function MissileQuadPickupActor() {
    BaseActor.apply(this, arguments);
}

MissileQuadPickupActor.extend(BaseActor);
MissileQuadPickupActor.mixin(ParticleMixin);

MissileQuadPickupActor.prototype.createMeshes = function () {
    return [new PickupMesh({
        actor: this,
        modelName: 'missilelauncher2'
    })];
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

},{"renderer/actor/BaseActor":60,"renderer/actor/component/mesh/PickupMesh":65,"renderer/actor/mixin/ParticleMixin":76}],86:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],87:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],88:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var WeaponConfig = require('shared/WeaponConfig');
var PickupMesh = require('renderer/actor/component/mesh/PickupMesh');

function WeaponPickupActor(config) {
    this.modelName = WeaponConfig.getById(config.subclassId).modelName;
    BaseActor.apply(this, arguments);
}

WeaponPickupActor.extend(BaseActor);
WeaponPickupActor.mixin(ParticleMixin);

WeaponPickupActor.prototype.createMeshes = function () {
    return [new PickupMesh({
        actor: this,
        modelName: this.modelName,
        scaleX: 1.5,
        scaleY: 1.5,
        scaleZ: 1.5
    })];
};

WeaponPickupActor.prototype.onDeath = function () {
    this.createPremade({
        premadeName: 'SmokePuffSmall',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

WeaponPickupActor.prototype.customUpdate = function () {
    this.createPremade({
        premadeName: 'WeaponPickup',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

module.exports = WeaponPickupActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/component/mesh/PickupMesh":65,"renderer/actor/mixin/ParticleMixin":76,"shared/WeaponConfig":116}],89:[function(require,module,exports){
'use strict';

var ActorConfig = require('shared/ActorConfig');
var ShipActor = require('renderer/actor/player/ShipActor');

function DemoShipActor() {
    this.applyConfig(ActorConfig.DEMOSHIP);
    ShipActor.apply(this, arguments);
}

DemoShipActor.extend(ShipActor);

module.exports = DemoShipActor;

},{"renderer/actor/player/ShipActor":90,"shared/ActorConfig":109}],90:[function(require,module,exports){
'use strict';

var RavierMesh = require('renderer/actor/component/mesh/RavierMesh');
var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ShieldMesh = require('renderer/actor/component/mesh/ShieldMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var BaseActor = require('renderer/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var WeaponConfig = require('shared/WeaponConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function ShipActor() {
    this.applyConfig(ActorConfig.SHIP);
    BaseActor.apply(this, arguments);

    this.count = 0;
    this.weaponSetLocations = [[[5, 1.5, -1.45], [-5, 1.5, -1.45]], [[3, -2, -0], [-3, -2, -0]]];
    this.targetingLinePositions = this._createTargetingLinePositions();
    this.weaponMaterialName = 'weaponModel';

    this.targetingDistance = 100;
    this.targetingMinDistance = 20;
    this.targetingMaxDistance = 400;
    this.targetingYScale = 4;
    this.targetingOffset = 0;
    this.targetingFadeFactor = 100;

    this.defaultPrimaryWeapon = 'RED_BLASTER';
    this.defaultSecondaryWeapon = 'NONE';

    this._setupWeapons();
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

ShipActor.prototype.switchWeapons = function (changeConfig) {
    for (var i = 0, l = this.weaponSetLocations[changeConfig.weaponSystemIndex].length; i < l; i++) {
        var meshIndexLocation = l * changeConfig.weaponSystemIndex + i + this.protectedMeshes; //zeroth is reserved for ship
        var mesh = this.getMeshAt(meshIndexLocation);
        mesh.geometry = ModelStore.get(WeaponConfig[changeConfig.weaponName].modelName).geometry;
        mesh.material = ModelStore.get('weaponModel').material;
    }
};

ShipActor.prototype.updateWeapons = function (weaponSystemsConfig) {
    var _this = this;

    this.weaponSetLocations.forEach(function (weaponSetLocation, weaponSystemsConfigIndex) {
        weaponSetLocation.forEach(function (location, locationIndex) {
            var meshIndexLocation = weaponSystemsConfigIndex * _this.weaponSetLocations[weaponSystemsConfigIndex].length + locationIndex + _this.protectedMeshes; //zeroth is reserved for ship
            var mesh = _this.getMeshAt(meshIndexLocation);
            var currentWeaponSystemsConfig = weaponSystemsConfig[weaponSystemsConfigIndex];
            var weaponConfig = WeaponConfig[currentWeaponSystemsConfig.weapons[currentWeaponSystemsConfig.currentWeaponIndex]];
            if (!weaponConfig) throw new Error('Missing weapon configuration for ' + weaponConfig);
            mesh.geometry = ModelStore.get(weaponConfig.modelName).geometry;
            mesh.material = ModelStore.get('weaponModel').material;
        });
    });
};

ShipActor.prototype.setupWeaponMeshes = function (slotNumber, weaponName, scales) {
    var defaultScale = 1;
    var weaponConfig = WeaponConfig[weaponName];
    scales = scales || [];

    if (!weaponConfig) throw new Error('Unknown weapon: ' + weaponName);
    if (slotNumber >= this.weaponSetLocations.length) throw new Error('This actor does not have a weapon slot of number ' + slotNumber);

    for (var i = 0, l = this.weaponSetLocations[slotNumber].length; i < l; i++) {
        var meshIndexLocation = l * slotNumber + i + this.protectedMeshes; //zeroth is reserved for ship

        var mesh = new BaseMesh({
            actor: this,
            scaleX: scales[0] || defaultScale,
            scaleY: scales[1] || defaultScale,
            scaleZ: scales[2] || defaultScale,
            geometry: ModelStore.get(weaponConfig.modelName).geometry,
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

ShipActor.prototype._setupWeapons = function () {
    var primaryWeaponSystem = this.getManager().getGameState().getWeaponSystem(0);
    var secondaryWeaponSystem = this.getManager().getGameState().getWeaponSystem(1);

    this.setupWeaponMeshes(0, primaryWeaponSystem && primaryWeaponSystem[0] || this.defaultPrimaryWeapon);
    this.setupWeaponMeshes(1, secondaryWeaponSystem && secondaryWeaponSystem[0] || this.defaultSecondaryWeapon);
};

module.exports = ShipActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/component/mesh/BaseMesh":62,"renderer/actor/component/mesh/RavierMesh":66,"renderer/actor/component/mesh/ShieldMesh":67,"renderer/actor/mixin/BobMixin":75,"renderer/actor/mixin/ParticleMixin":76,"renderer/actor/mixin/ShowDamageMixin":77,"renderer/assetManagement/model/ModelStore":108,"shared/ActorConfig":109,"shared/WeaponConfig":116}],91:[function(require,module,exports){
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
    var offsetPosition = this.getOffsetPosition(-8);
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
    this.createPremade({ premadeName: 'OrangeBoomSmall', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
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

},{"renderer/actor/BaseActor":60,"renderer/actor/component/mesh/MissileMesh":64,"renderer/actor/mixin/ParticleMixin":76}],92:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function EmdProjectileActor() {
    BaseActor.apply(this, arguments);
}

EmdProjectileActor.extend(BaseActor);
EmdProjectileActor.mixin(ParticleMixin);

EmdProjectileActor.prototype.customUpdate = function () {
    this.createPremade({ premadeName: 'EmdTrail' });
};

EmdProjectileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-5);
    this.createPremade({ premadeName: 'BlueBoom', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

EmdProjectileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
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
        color: 'BLUE',
        alphaMultiplier: 0.7,
        scale: 7,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        scale: 20,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10,
        spriteNumber: 0
    });
};

module.exports = EmdProjectileActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],93:[function(require,module,exports){
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
    var offsetPosition = this.getOffsetPosition(-8);
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

},{"renderer/actor/BaseActor":60,"renderer/actor/component/mesh/MissileMesh":64,"renderer/actor/mixin/ParticleMixin":76}],94:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var MissileMesh = require('renderer/actor/component/mesh/MissileMesh');

function EnemyHomingMissileActor() {
    BaseActor.apply(this, arguments);
}

EnemyHomingMissileActor.extend(BaseActor);
EnemyHomingMissileActor.mixin(ParticleMixin);

EnemyHomingMissileActor.prototype.createMeshes = function () {
    return [new MissileMesh({ actor: this, scaleX: 2, scaleY: 2, scaleZ: 2 })];
};

EnemyHomingMissileActor.prototype.customUpdate = function () {
    var offsetPosition = this.getOffsetPosition(-8);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'BLUE',
        scale: 4,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 2,
        lifeTime: 30
    });

    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'WHITE',
        scale: 2,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 2,
        lifeTime: 30
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

EnemyHomingMissileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-10);
    this.createPremade({ premadeName: 'OrangeBoomLarge', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
    this.requestUiFlash('white');
    this.requestShake();
};

EnemyHomingMissileActor.prototype.onSpawn = function () {
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

module.exports = EnemyHomingMissileActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/component/mesh/MissileMesh":64,"renderer/actor/mixin/ParticleMixin":76}],95:[function(require,module,exports){
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

    this.createParticle({
        particleClass: 'particleAdd',
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
        lifeTime: 10
    });
};

module.exports = GreenLaserProjectileActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],96:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var MissileMesh = require('renderer/actor/component/mesh/MissileMesh');

function HomingMissileActor() {
    BaseActor.apply(this, arguments);
}

HomingMissileActor.extend(BaseActor);
HomingMissileActor.mixin(ParticleMixin);

HomingMissileActor.prototype.createMeshes = function () {
    return [new MissileMesh({ actor: this, scaleX: 2, scaleY: 2, scaleZ: 2 })];
};

HomingMissileActor.prototype.customUpdate = function () {
    var offsetPosition = this.getOffsetPosition(-8);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'BLUE',
        scale: 4,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 2,
        lifeTime: 30
    });

    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'WHITE',
        scale: 2,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 2,
        lifeTime: 30
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

HomingMissileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-10);
    this.createPremade({ premadeName: 'OrangeBoomLarge', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
    this.requestUiFlash('white');
    this.requestShake();
};

HomingMissileActor.prototype.onSpawn = function () {
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

module.exports = HomingMissileActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/component/mesh/MissileMesh":64,"renderer/actor/mixin/ParticleMixin":76}],97:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function LaserProjectileActor() {
    BaseActor.apply(this, arguments);
}

LaserProjectileActor.extend(BaseActor);
LaserProjectileActor.mixin(ParticleMixin);

LaserProjectileActor.prototype.customUpdate = function () {
    this.createPremade({ premadeName: 'BlueLargeLaserTrail' });
};

LaserProjectileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({ premadeName: 'BlueSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

LaserProjectileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        alphaMultiplier: 0.7,
        scale: 7,
        particleVelocity: 1,
        alpha: 7,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'DEEPBLUE',
        alphaMultiplier: 0.7,
        scale: 6,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'DEEPBLUE',
        scale: 15,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10
    });
};

module.exports = LaserProjectileActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],98:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function MinigunProjectileActor() {
    BaseActor.apply(this, arguments);
}

MinigunProjectileActor.extend(BaseActor);
MinigunProjectileActor.mixin(ParticleMixin);

MinigunProjectileActor.prototype.customUpdate = function () {
    this.createPremade({ premadeName: 'BulletTrail' });
};

MinigunProjectileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({ premadeName: 'OrangeSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

MinigunProjectileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'ORANGE',
        alphaMultiplier: 0.7,
        scale: 5,
        particleVelocity: 1,
        alpha: 7,
        lifeTime: 1
    });

    var offsetPosition = this.getOffsetPosition(-3);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'ORANGE',
        alphaMultiplier: 0.7,
        scale: 4,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'ORANGE',
        scale: 8,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10
    });
};

module.exports = MinigunProjectileActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],99:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],100:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function PlasmaBlastMiniProjectileActor() {
    BaseActor.apply(this, arguments);
}

PlasmaBlastMiniProjectileActor.extend(BaseActor);
PlasmaBlastMiniProjectileActor.mixin(ParticleMixin);

PlasmaBlastMiniProjectileActor.prototype.customUpdate = function () {
    this.createPremade({ premadeName: 'GreenTrail' });
};

PlasmaBlastMiniProjectileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-5);
    this.createPremade({ premadeName: 'GreenTrailLarge', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

PlasmaBlastMiniProjectileActor.prototype.onTimeout = function () {
    var offsetPosition = this.getOffsetPosition(-5);
    this.createPremade({ premadeName: 'GreenTrailLarge', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

module.exports = PlasmaBlastMiniProjectileActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],101:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function PlasmaBlastProjectileActor() {
    BaseActor.apply(this, arguments);
}

PlasmaBlastProjectileActor.extend(BaseActor);
PlasmaBlastProjectileActor.mixin(ParticleMixin);

PlasmaBlastProjectileActor.prototype.customUpdate = function () {
    this.createPremade({
        premadeName: 'GreenTrailLarge',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

PlasmaBlastProjectileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-5);
    this.createPremade({ premadeName: 'GreenBoomLarge', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

PlasmaBlastProjectileActor.prototype.onTimeout = function () {
    var offsetPosition = this.getOffsetPosition(-5);
    this.createPremade({ premadeName: 'GreenBoomLarge', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

PlasmaBlastProjectileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'GREEN',
        alphaMultiplier: 0.7,
        scale: 14,
        particleVelocity: 4,
        alpha: 8,
        lifeTime: 3
    });

    var offsetPosition = this.getOffsetPosition(3);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'GREEN',
        alphaMultiplier: 0.7,
        scale: 14,
        particleVelocity: 3,
        alpha: 0.5,
        lifeTime: 3
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'GREEN',
        scale: 30,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 15,
        spriteNumber: 0
    });
};

module.exports = PlasmaBlastProjectileActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],102:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],103:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76,"shared/ActorConfig":109}],104:[function(require,module,exports){
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
        color: 'WHITE',
        alphaMultiplier: 0.7,
        scale: 7,
        particleVelocity: 1,
        alpha: 7,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        alphaMultiplier: 0.7,
        scale: 6,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: 15,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10
    });
};

module.exports = PurpleLaserProjectileActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],105:[function(require,module,exports){
'use strict';

var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function RedLaserEnemyProjectileActor() {
    BaseActor.apply(this, arguments);
}

RedLaserEnemyProjectileActor.extend(BaseActor);
RedLaserEnemyProjectileActor.mixin(ParticleMixin);

RedLaserEnemyProjectileActor.prototype.customUpdate = function () {
    this.createPremade({ premadeName: 'RedLaserSmallTrail' });
};

RedLaserEnemyProjectileActor.prototype.onDeath = function () {
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({ premadeName: 'RedSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1] });
};

RedLaserEnemyProjectileActor.prototype.onSpawn = function () {
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'RED',
        alphaMultiplier: 0.7,
        scale: 5,
        particleVelocity: 1,
        alpha: 7,
        lifeTime: 1
    });

    var offsetPosition = this.getOffsetPosition(-3);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'DEEPRED',
        alphaMultiplier: 0.7,
        scale: 4,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'DEEPRED',
        scale: 8,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10
    });
};

module.exports = RedLaserEnemyProjectileActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],106:[function(require,module,exports){
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
        color: 'RED',
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
        color: 'DEEPRED',
        alphaMultiplier: 0.7,
        scale: 6,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'DEEPRED',
        scale: 15,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10
    });
};

module.exports = RedLaserProjectileActor;

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76}],107:[function(require,module,exports){
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
    var ringSections = 40;
    var angle = Utils.degToRad(360 / ringSections);
    var zPosition = void 0,
        xPosition = void 0,
        offsetPosition = void 0;
    var timerFactor = this.timer / (this.props.timeout + 3);
    var radius = Utils.rand(25, 30) / 10 - timerFactor;

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

},{"renderer/actor/BaseActor":60,"renderer/actor/mixin/ParticleMixin":76,"shared/ActorConfig":109}],108:[function(require,module,exports){
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

},{}],109:[function(require,module,exports){
'use strict';

var ActorFactory = require('shared/ActorFactory')('logic');

var ActorConfig = {
    SHIP: {
        props: {
            canPickup: true,
            acceleration: 1000,
            turnSpeed: 12,
            hp: 50,
            shield: 50,
            hpBarCount: 10,
            shieldBarCount: 10,
            isPlayer: true,
            type: 'playerShip',
            powerLevel: 3
        },
        bodyConfig: {
            mass: 4,
            damping: 0.85,
            angularDamping: 0,
            inertia: 10,
            radius: 7
        }
    },

    DEMOSHIP: {
        props: {
            canPickup: true,
            acceleration: 1000,
            turnSpeed: 6,
            hp: 50,
            shield: 50,
            hpBarCount: 10,
            shieldBarCount: 10,
            isPlayer: true,
            type: 'playerShip',
            powerLevel: 3
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
            mass: 4
        }
    },

    SMALLEXPLOSION: {
        props: {
            hp: 1000,
            damage: 5,
            removeOnHit: true,
            timeout: 1,
            type: 'explosion'
        },
        bodyConfig: {
            radius: 20,
            mass: 2
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

    EMDPROJECTILE: {
        props: {
            hp: 1,
            damage: 3,
            removeOnHit: true,
            timeout: 300,
            acceleration: 1200,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile',
            homingAgainst: ['enemyShip', 'enemyMapObject'],
            homingRange: 1000,
            homingArc: 30,
            turnSpeed: 0.8
        },
        bodyConfig: {
            radius: 2,
            mass: 1,
            damping: 0.995
        }
    },

    PLASMABLASTPROJECTILE: {
        props: {
            hp: 1,
            damage: 3,
            removeOnHit: true,
            timeout: 60,
            collisionFixesPosition: true,
            soundsOnDeath: ['plasmabig1'],
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 2,
            mass: 1
        }
    },

    PLASMABLASTMINIPROJECTILE: {
        props: {
            hp: 1,
            damage: 5,
            removeOnHit: true,
            timeoutRandomMin: 10,
            timeoutRandomMax: 20,
            soundsOnDeath: ['matterhit3'],
            collisionFixesPosition: true,
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
            damage: 6,
            removeOnHit: true,
            timeout: 120,
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

    REDLASERENEMYPROJECTILE: {
        props: {
            hp: 1,
            damage: 1,
            removeOnHit: true,
            timeout: 180,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.2,
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
            damage: 15,
            removeOnHit: true,
            timeout: 800,
            constantAcceleration: 200,
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

    HOMINGMISSILE: {
        props: {
            hp: 2,
            damage: 15,
            removeOnHit: true,
            timeout: 800,
            acceleration: 650,
            constantAcceleration: 0,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile',
            homingAgainst: ['enemyShip', 'enemyMapObject'],
            homingRange: 1000,
            homingArc: 30,
            turnSpeed: 2
        },
        bodyConfig: {
            radius: 2,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4,
            damping: 0.995
        }
    },

    ENEMYCONCSNMISSILE: {
        props: {
            hp: 1.5,
            damage: 10,
            removeOnHit: true,
            timeout: 800,
            constantAcceleration: 150,
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

    ENEMYHOMINGMISSILE: {
        props: {
            hp: 1.5,
            damage: 10,
            removeOnHit: true,
            timeout: 800,
            acceleration: 650,
            constantAcceleration: 0,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile',
            homingAgainst: ['playerShip'],
            homingRange: 1000,
            homingArc: 30,
            turnSpeed: 2
        },
        bodyConfig: {
            radius: 2,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4,
            damping: 0.995
        }
    },

    MINIGUNPROJECTILE: {
        props: {
            hp: 1,
            damage: 0.5,
            removeOnHit: true,
            timeout: 60,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.04,
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

    FLAMECHUNK: {
        props: {
            hp: 1,
            turnSpeed: 1,
            removeOnHit: false,
            timeoutRandomMin: 5,
            timeoutRandomMax: 10
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
            timeoutRandomMax: 30,
            soundsOnDeath: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6']
        },
        bodyConfig: {
            mass: 0.01
        }
    },

    ENEMYSPAWNER: {
        props: {
            drops: [{ class: 'SHIELDPICKUP', amount: [1, 2] }, { class: 'ENERGYPICKUP', amount: [1, 2] }],
            danger: 4,
            hp: 150,
            shield: 100,
            shieldSize: 3.5,
            shieldColor: 0x5533ff,
            hpBarCount: 7,
            shieldBarCount: 5,
            barHeight: 12,
            removeOnHit: false,
            spawnRate: 240,
            globalMaxSpawnedEnemies: 16,
            enemy: true,
            type: 'enemyMapObject',
            name: 'GATEWAY',
            delayedDeath: {
                time: 300
            },
            pointWorth: 1000,
            enemyIndex: 5,
            spawnPool: ['CHASER', 'MOOK', 'ORBOT', 'SNIPER'],
            spawnPoolAdditions: {
                60: 'SHULK',
                120: 'SHULK',
                150: 'SPIDER',
                180: 'MHULK',
                210: 'SPIDER',
                240: 'MHULK',
                270: 'DRILLER',
                300: 'SHULK',
                360: 'SPIDER',
                390: 'LHULK',
                420: 'DRILLER',
                550: 'LHULK'
            }
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

    WEAPONPICKUP: {
        props: {
            pickup: 'weapon',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
            type: 'pickup'
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.65
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
            damping: 0.65
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
            damping: 0.65
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
            damping: 0.65
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
            damping: 0.65
        }
    },

    BULLETAMMOPICKUP: {
        props: {
            pickup: 'bulletAmmo',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
            type: 'pickup'
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.65
        }
    }
};

module.exports = ActorConfig;

},{"shared/ActorFactory":110}],110:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//This is an auto-generated template file. Any changes will be overwritten!

var idMap = {
    SHIP: 1,
    DEMOSHIP: 2,
    ENEMY: 3,
    CHAMPIONENEMY: 4,
    CHUNK: 5,
    FLAMECHUNK: 6,
    BOOMCHUNK: 7,
    EXPLOSION: 8,
    SMALLEXPLOSION: 9,
    EMDPROJECTILE: 10,
    PLASMAPROJECTILE: 11,
    PLASMABLASTPROJECTILE: 12,
    PLASMABLASTMINIPROJECTILE: 13,
    LASERPROJECTILE: 14,
    REDLASERPROJECTILE: 15,
    REDLASERENEMYPROJECTILE: 16,
    PURPLELASERPROJECTILE: 17,
    GREENLASERPROJECTILE: 18,
    MOLTENPROJECTILE: 19,
    RINGPROJECTILE: 20,
    PULSEWAVEPROJECTILE: 21,
    CONCSNMISSILE: 22,
    ENEMYCONCSNMISSILE: 23,
    HOMINGMISSILE: 24,
    ENEMYHOMINGMISSILE: 25,
    MINIGUNPROJECTILE: 26,
    ENEMYSPAWNER: 27,
    ENEMYSPAWNMARKER: 28,
    ITEMSPAWNER: 29,
    DEBUG: 30,
    SHIELDPICKUP: 31,
    ENERGYPICKUP: 32,
    PLASMAPICKUP: 33,
    MISSILEQUADPICKUP: 34,
    BULLETAMMOPICKUP: 35,
    WEAPONPICKUP: 36

};

function ActorFactory(context, actorDependencies) {
    var _actorMap;

    this.actorDependencies = actorDependencies;
    ActorFactory.ShipActor = context === 'renderer' ? require("renderer/actor/player/ShipActor") : require("logic/actor/player/ShipActor");
    ActorFactory.DemoShipActor = context === 'renderer' ? require("renderer/actor/player/DemoShipActor") : require("logic/actor/player/DemoShipActor");
    ActorFactory.EnemyActor = context === 'renderer' ? require("renderer/actor/enemy/EnemyActor") : require("logic/actor/enemy/EnemyActor");
    ActorFactory.ChampionEnemyActor = context === 'renderer' ? require("renderer/actor/enemy/ChampionEnemyActor") : require("logic/actor/enemy/ChampionEnemyActor");
    ActorFactory.ChunkActor = context === 'renderer' ? require("renderer/actor/object/ChunkActor") : require("logic/actor/object/ChunkActor");
    ActorFactory.FlameChunkActor = context === 'renderer' ? require("renderer/actor/object/FlameChunkActor") : require("logic/actor/object/FlameChunkActor");
    ActorFactory.BoomChunkActor = context === 'renderer' ? require("renderer/actor/object/BoomChunkActor") : require("logic/actor/object/BoomChunkActor");
    ActorFactory.ExplosionActor = context === 'renderer' ? require("renderer/actor/object/ExplosionActor") : require("logic/actor/object/ExplosionActor");
    ActorFactory.SmallExplosionActor = context === 'renderer' ? require("renderer/actor/object/SmallExplosionActor") : require("logic/actor/object/SmallExplosionActor");
    ActorFactory.EmdProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/EmdProjectileActor") : require("logic/actor/projectile/EmdProjectileActor");
    ActorFactory.PlasmaProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaProjectileActor") : require("logic/actor/projectile/PlasmaProjectileActor");
    ActorFactory.PlasmaBlastProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaBlastProjectileActor") : require("logic/actor/projectile/PlasmaBlastProjectileActor");
    ActorFactory.PlasmaBlastMiniProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaBlastMiniProjectileActor") : require("logic/actor/projectile/PlasmaBlastMiniProjectileActor");
    ActorFactory.LaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/LaserProjectileActor") : require("logic/actor/projectile/LaserProjectileActor");
    ActorFactory.RedLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RedLaserProjectileActor") : require("logic/actor/projectile/RedLaserProjectileActor");
    ActorFactory.RedLaserEnemyProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RedLaserEnemyProjectileActor") : require("logic/actor/projectile/RedLaserEnemyProjectileActor");
    ActorFactory.PurpleLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PurpleLaserProjectileActor") : require("logic/actor/projectile/PurpleLaserProjectileActor");
    ActorFactory.GreenLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/GreenLaserProjectileActor") : require("logic/actor/projectile/GreenLaserProjectileActor");
    ActorFactory.MoltenProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/MoltenProjectileActor") : require("logic/actor/projectile/MoltenProjectileActor");
    ActorFactory.RingProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RingProjectileActor") : require("logic/actor/projectile/RingProjectileActor");
    ActorFactory.PulseWaveProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PulseWaveProjectileActor") : require("logic/actor/projectile/PulseWaveProjectileActor");
    ActorFactory.ConcsnMissileActor = context === 'renderer' ? require("renderer/actor/projectile/ConcsnMissileActor") : require("logic/actor/projectile/ConcsnMissileActor");
    ActorFactory.EnemyConcsnMissileActor = context === 'renderer' ? require("renderer/actor/projectile/EnemyConcsnMissileActor") : require("logic/actor/projectile/EnemyConcsnMissileActor");
    ActorFactory.HomingMissileActor = context === 'renderer' ? require("renderer/actor/projectile/HomingMissileActor") : require("logic/actor/projectile/HomingMissileActor");
    ActorFactory.EnemyHomingMissileActor = context === 'renderer' ? require("renderer/actor/projectile/EnemyHomingMissileActor") : require("logic/actor/projectile/EnemyHomingMissileActor");
    ActorFactory.MinigunProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/MinigunProjectileActor") : require("logic/actor/projectile/MinigunProjectileActor");
    ActorFactory.EnemySpawnerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnerActor") : require("logic/actor/map/EnemySpawnerActor");
    ActorFactory.EnemySpawnMarkerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnMarkerActor") : require("logic/actor/map/EnemySpawnMarkerActor");
    ActorFactory.ItemSpawnerActor = context === 'renderer' ? require("renderer/actor/map/ItemSpawnerActor") : require("logic/actor/map/ItemSpawnerActor");
    ActorFactory.DebugActor = context === 'renderer' ? require("renderer/actor/DebugActor") : require("logic/actor/DebugActor");
    ActorFactory.ShieldPickupActor = context === 'renderer' ? require("renderer/actor/pickup/ShieldPickupActor") : require("logic/actor/pickup/ShieldPickupActor");
    ActorFactory.EnergyPickupActor = context === 'renderer' ? require("renderer/actor/pickup/EnergyPickupActor") : require("logic/actor/pickup/EnergyPickupActor");
    ActorFactory.PlasmaPickupActor = context === 'renderer' ? require("renderer/actor/pickup/PlasmaPickupActor") : require("logic/actor/pickup/PlasmaPickupActor");
    ActorFactory.MissileQuadPickupActor = context === 'renderer' ? require("renderer/actor/pickup/MissileQuadPickupActor") : require("logic/actor/pickup/MissileQuadPickupActor");
    ActorFactory.BulletAmmoPickupActor = context === 'renderer' ? require("renderer/actor/pickup/BulletAmmoPickupActor") : require("logic/actor/pickup/BulletAmmoPickupActor");
    ActorFactory.WeaponPickupActor = context === 'renderer' ? require("renderer/actor/pickup/WeaponPickupActor") : require("logic/actor/pickup/WeaponPickupActor");

    this.actorMap = (_actorMap = {}, _defineProperty(_actorMap, idMap.SHIP, ActorFactory.ShipActor), _defineProperty(_actorMap, idMap.DEMOSHIP, ActorFactory.DemoShipActor), _defineProperty(_actorMap, idMap.ENEMY, ActorFactory.EnemyActor), _defineProperty(_actorMap, idMap.CHAMPIONENEMY, ActorFactory.ChampionEnemyActor), _defineProperty(_actorMap, idMap.CHUNK, ActorFactory.ChunkActor), _defineProperty(_actorMap, idMap.FLAMECHUNK, ActorFactory.FlameChunkActor), _defineProperty(_actorMap, idMap.BOOMCHUNK, ActorFactory.BoomChunkActor), _defineProperty(_actorMap, idMap.EXPLOSION, ActorFactory.ExplosionActor), _defineProperty(_actorMap, idMap.SMALLEXPLOSION, ActorFactory.SmallExplosionActor), _defineProperty(_actorMap, idMap.EMDPROJECTILE, ActorFactory.EmdProjectileActor), _defineProperty(_actorMap, idMap.PLASMAPROJECTILE, ActorFactory.PlasmaProjectileActor), _defineProperty(_actorMap, idMap.PLASMABLASTPROJECTILE, ActorFactory.PlasmaBlastProjectileActor), _defineProperty(_actorMap, idMap.PLASMABLASTMINIPROJECTILE, ActorFactory.PlasmaBlastMiniProjectileActor), _defineProperty(_actorMap, idMap.LASERPROJECTILE, ActorFactory.LaserProjectileActor), _defineProperty(_actorMap, idMap.REDLASERPROJECTILE, ActorFactory.RedLaserProjectileActor), _defineProperty(_actorMap, idMap.REDLASERENEMYPROJECTILE, ActorFactory.RedLaserEnemyProjectileActor), _defineProperty(_actorMap, idMap.PURPLELASERPROJECTILE, ActorFactory.PurpleLaserProjectileActor), _defineProperty(_actorMap, idMap.GREENLASERPROJECTILE, ActorFactory.GreenLaserProjectileActor), _defineProperty(_actorMap, idMap.MOLTENPROJECTILE, ActorFactory.MoltenProjectileActor), _defineProperty(_actorMap, idMap.RINGPROJECTILE, ActorFactory.RingProjectileActor), _defineProperty(_actorMap, idMap.PULSEWAVEPROJECTILE, ActorFactory.PulseWaveProjectileActor), _defineProperty(_actorMap, idMap.CONCSNMISSILE, ActorFactory.ConcsnMissileActor), _defineProperty(_actorMap, idMap.ENEMYCONCSNMISSILE, ActorFactory.EnemyConcsnMissileActor), _defineProperty(_actorMap, idMap.HOMINGMISSILE, ActorFactory.HomingMissileActor), _defineProperty(_actorMap, idMap.ENEMYHOMINGMISSILE, ActorFactory.EnemyHomingMissileActor), _defineProperty(_actorMap, idMap.MINIGUNPROJECTILE, ActorFactory.MinigunProjectileActor), _defineProperty(_actorMap, idMap.ENEMYSPAWNER, ActorFactory.EnemySpawnerActor), _defineProperty(_actorMap, idMap.ENEMYSPAWNMARKER, ActorFactory.EnemySpawnMarkerActor), _defineProperty(_actorMap, idMap.ITEMSPAWNER, ActorFactory.ItemSpawnerActor), _defineProperty(_actorMap, idMap.DEBUG, ActorFactory.DebugActor), _defineProperty(_actorMap, idMap.SHIELDPICKUP, ActorFactory.ShieldPickupActor), _defineProperty(_actorMap, idMap.ENERGYPICKUP, ActorFactory.EnergyPickupActor), _defineProperty(_actorMap, idMap.PLASMAPICKUP, ActorFactory.PlasmaPickupActor), _defineProperty(_actorMap, idMap.MISSILEQUADPICKUP, ActorFactory.MissileQuadPickupActor), _defineProperty(_actorMap, idMap.BULLETAMMOPICKUP, ActorFactory.BulletAmmoPickupActor), _defineProperty(_actorMap, idMap.WEAPONPICKUP, ActorFactory.WeaponPickupActor), _actorMap);
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

},{"logic/actor/DebugActor":11,"logic/actor/enemy/ChampionEnemyActor":17,"logic/actor/enemy/EnemyActor":18,"logic/actor/map/EnemySpawnMarkerActor":19,"logic/actor/map/EnemySpawnerActor":20,"logic/actor/map/ItemSpawnerActor":21,"logic/actor/object/BoomChunkActor":26,"logic/actor/object/ChunkActor":27,"logic/actor/object/ExplosionActor":28,"logic/actor/object/FlameChunkActor":29,"logic/actor/object/SmallExplosionActor":30,"logic/actor/pickup/BulletAmmoPickupActor":31,"logic/actor/pickup/EnergyPickupActor":32,"logic/actor/pickup/MissileQuadPickupActor":33,"logic/actor/pickup/PlasmaPickupActor":34,"logic/actor/pickup/ShieldPickupActor":35,"logic/actor/pickup/WeaponPickupActor":36,"logic/actor/player/DemoShipActor":37,"logic/actor/player/ShipActor":38,"logic/actor/projectile/ConcsnMissileActor":39,"logic/actor/projectile/EmdProjectileActor":40,"logic/actor/projectile/EnemyConcsnMissileActor":41,"logic/actor/projectile/EnemyHomingMissileActor":42,"logic/actor/projectile/GreenLaserProjectileActor":43,"logic/actor/projectile/HomingMissileActor":44,"logic/actor/projectile/LaserProjectileActor":45,"logic/actor/projectile/MinigunProjectileActor":46,"logic/actor/projectile/MoltenProjectileActor":47,"logic/actor/projectile/PlasmaBlastMiniProjectileActor":48,"logic/actor/projectile/PlasmaBlastProjectileActor":49,"logic/actor/projectile/PlasmaProjectileActor":50,"logic/actor/projectile/PulseWaveProjectileActor":51,"logic/actor/projectile/PurpleLaserProjectileActor":52,"logic/actor/projectile/RedLaserEnemyProjectileActor":53,"logic/actor/projectile/RedLaserProjectileActor":54,"logic/actor/projectile/RingProjectileActor":55,"renderer/actor/DebugActor":61,"renderer/actor/enemy/ChampionEnemyActor":70,"renderer/actor/enemy/EnemyActor":71,"renderer/actor/map/EnemySpawnMarkerActor":72,"renderer/actor/map/EnemySpawnerActor":73,"renderer/actor/map/ItemSpawnerActor":74,"renderer/actor/object/BoomChunkActor":78,"renderer/actor/object/ChunkActor":79,"renderer/actor/object/ExplosionActor":80,"renderer/actor/object/FlameChunkActor":81,"renderer/actor/object/SmallExplosionActor":82,"renderer/actor/pickup/BulletAmmoPickupActor":83,"renderer/actor/pickup/EnergyPickupActor":84,"renderer/actor/pickup/MissileQuadPickupActor":85,"renderer/actor/pickup/PlasmaPickupActor":86,"renderer/actor/pickup/ShieldPickupActor":87,"renderer/actor/pickup/WeaponPickupActor":88,"renderer/actor/player/DemoShipActor":89,"renderer/actor/player/ShipActor":90,"renderer/actor/projectile/ConcsnMissileActor":91,"renderer/actor/projectile/EmdProjectileActor":92,"renderer/actor/projectile/EnemyConcsnMissileActor":93,"renderer/actor/projectile/EnemyHomingMissileActor":94,"renderer/actor/projectile/GreenLaserProjectileActor":95,"renderer/actor/projectile/HomingMissileActor":96,"renderer/actor/projectile/LaserProjectileActor":97,"renderer/actor/projectile/MinigunProjectileActor":98,"renderer/actor/projectile/MoltenProjectileActor":99,"renderer/actor/projectile/PlasmaBlastMiniProjectileActor":100,"renderer/actor/projectile/PlasmaBlastProjectileActor":101,"renderer/actor/projectile/PlasmaProjectileActor":102,"renderer/actor/projectile/PulseWaveProjectileActor":103,"renderer/actor/projectile/PurpleLaserProjectileActor":104,"renderer/actor/projectile/RedLaserEnemyProjectileActor":105,"renderer/actor/projectile/RedLaserProjectileActor":106,"renderer/actor/projectile/RingProjectileActor":107}],111:[function(require,module,exports){
'use strict';

var ActorTypes = {
    types: {
        playerShip: 'playerShip',
        explosion: 'explosion',
        playerProjectile: 'playerProjectile',
        enemyProjectile: 'enemyProjectile',
        noType: 'noType',
        enemyMapObject: 'enemyMapObject',
        unCollidable: 'unCollidable',
        enemyShip: 'enemyShip',
        pickup: 'pickup'
    },

    getPlayerType: function getPlayerType() {
        return 'playerShip';
    },
    getEnemyTypes: function getEnemyTypes() {
        return ['enemyShip'];
    }
};

module.exports = ActorTypes;

},{}],112:[function(require,module,exports){
"use strict";

var Constants = {
    SHOW_FPS: false,

    LOGIC_REFRESH_RATE: 60,

    DEFAULT_POSITION_Z: 10,

    MAX_SHADER_UNIFORM_SIZE: 512,

    RENDER_DISTANCE: 700,

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

    DEATH_TYPES: {
        HIT: 0,
        TIMEOUT: 1
    },

    HOMING_LOCK_ACQUIRE_FREQUENCY: 3,

    STORAGE_SIZE: 1000,

    FOG_COLOR: 0x000000,

    FOG_DISTANCE_START: 400,

    CHUNK_SIZE: 768,

    MAX_SOUND_DISTANCE: 500,

    DIFFICULTIES: {
        hp: [0.5, 0.75, 1, 1.2, 1.5],
        acceleration: [0.8, 0.9, 1, 1.5, 2],
        turnSpeed: [0.7, 0.85, 1, 1.5, 2],
        fireDelay: [2, 1.5, 1, 0.75, 0.5],
        pointWorth: [0.2, 0.6, 1, 3, 5],
        powerLevel: [0.7, 0.85, 1.05, 1.55, 2.1]
    }
};

module.exports = Constants;

},{}],113:[function(require,module,exports){
'use strict';

var ActorFactory = require('shared/ActorFactory')('logic');

var ENEMY_MAP = {
    CHASER: 1,
    MOOK: 2,
    SNIPER: 3,
    ORBOT: 4,
    SHULK: 5,
    SPIDER: 6,
    MHULK: 7,
    LHULK: 8,
    DRILLER: 9,

    CHASERBOSS: 101,
    MOOKBOSS: 102,
    SNIPERBOSS: 103,
    ORBOTBOSS: 104,
    SHULKBOSS: 105,
    SPIDERBOSS: 106,
    MHULKBOSS: 107,

    SPIDERLING: 10007
};

var ID_MAP = Utils.objectSwitchKeysAndValues(ENEMY_MAP);

var getById = function getById(id) {
    var configObject = EnemyConfig[ID_MAP[id]];
    if (!configObject) throw new Error('Missing enemy config for subclassId ' + id);
    return configObject;
};

var getNameById = function getNameById(id) {
    return ID_MAP[id];
};

var getSubclassIdFor = function getSubclassIdFor(enemyClassName) {
    var id = ENEMY_MAP[enemyClassName];
    if (!id) throw new Error('Missing enemy config for ' + enemyClassName);
    return id;
};

var EnemyConfig = {
    getById: getById,
    getSubclassIdFor: getSubclassIdFor,
    getNameById: getNameById,

    CHASER: {
        props: {
            danger: 1,
            hp: 4,
            enemy: true,
            acceleration: 1000,
            turnSpeed: 7,
            hpBarCount: 5,
            type: 'enemyShip',
            name: 'CHASER',
            pointWorth: 25,
            enemyIndex: 8,
            calloutSound: 'drone',
            powerLevel: 1.5,
            logic: {
                brain: {
                    firingDistance: 250,
                    leadSkill: 0.4,
                    nearDistance: 100,
                    farDistance: 500,
                    shootingArc: 30,
                    wallDetectionDistance: 30,
                    behavior: 'chaser'
                },
                weapon: {
                    type: 'MINI_RED_BLASTER',
                    randomPool: ['RED_BLASTER'],
                    chanceForRandomWeapon: 0.2,
                    firingMode: 'alternate',
                    firingPoints: [{ offsetAngle: -90, offsetDistance: 3.5, fireAngle: 0 }, { offsetAngle: 90, offsetDistance: 3.5, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 10,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 8,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [200, 300]
                    }, {
                        classId: ActorFactory.SMALLEXPLOSION,
                        delay: 100
                    }, {
                        probability: 0.2,
                        classId: ActorFactory.ENERGYPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 2.5,
                    scaleY: 2.5,
                    scaleZ: 2.5,
                    geometry: 'chaser',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
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
            danger: 1,
            acceleration: 140,
            turnSpeed: 2,
            hp: 4,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip',
            name: 'DRONE',
            pointWorth: 20,
            enemyIndex: 0,
            calloutSound: 'drone',
            powerLevel: 1,
            logic: {
                brain: {
                    firingDistance: 140,
                    leadSkill: 0
                },
                weapon: {
                    type: 'MOLTEN_BALL_THROWER',
                    firingMode: 'alternate',
                    firingPoints: [{ offsetAngle: -90, offsetDistance: 3.5, fireAngle: 0 }, { offsetAngle: 90, offsetDistance: 3.5, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 10,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 8,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [200, 300]
                    }, {
                        classId: ActorFactory.SMALLEXPLOSION,
                        delay: 100
                    }, {
                        probability: 0.2,
                        classId: ActorFactory.ENERGYPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 1.2,
                    scaleY: 1.2,
                    scaleZ: 1.2,
                    geometry: 'drone',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 4,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 5
        }
    },

    SNIPER: {
        props: {
            danger: 1,
            acceleration: 90,
            turnSpeed: 0.65,
            hp: 7,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip',
            name: 'WATCHMAN',
            pointWorth: 30,
            enemyIndex: 1,
            calloutSound: 'sniper',
            powerLevel: 1.2,
            logic: {
                brain: {
                    shootingArc: 8,
                    nearDistance: 200,
                    farDistance: 300,
                    firingDistance: 400,
                    leadSkill: 0.5
                },
                weapon: {
                    type: 'BLUE_BLASTER',
                    firingPoints: [{ offsetAngle: 10, offsetDistance: 5, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 10,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 8,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [200, 300]
                    }, {
                        classId: ActorFactory.SMALLEXPLOSION,
                        delay: 100
                    }, {
                        probability: 0.3,
                        classId: ActorFactory.SHIELDPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 1.9,
                    scaleY: 1.9,
                    scaleZ: 1.9,
                    geometry: 'sniper',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 8,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 4
        }
    },

    DRILLER: {
        props: {
            danger: 3,
            acceleration: 800,
            turnSpeed: 1.2,
            hp: 10,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip',
            name: 'DRILLER',
            pointWorth: 100,
            enemyIndex: 9,
            calloutSound: 'sniper',
            powerLevel: 1.5,
            logic: {
                brain: {
                    shootingArc: 8,
                    nearDistance: 400,
                    farDistance: 700,
                    firingDistance: 700,
                    leadSkill: 0.6
                },
                weapon: {
                    type: 'MINIGUN',
                    firingPoints: [{ offsetAngle: 0, offsetDistance: 16, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 10,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 8,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [200, 300]
                    }, {
                        classId: ActorFactory.SMALLEXPLOSION,
                        delay: 100
                    }, {
                        probability: 0.3,
                        classId: ActorFactory.SHIELDPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }, {
                        probability: 1,
                        classId: ActorFactory.BULLETAMMOPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }, {
                        probability: 0.5,
                        classId: ActorFactory.BULLETAMMOPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }, {
                        probability: 0.25,
                        classId: ActorFactory.BULLETAMMOPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 3.1,
                    scaleY: 3.1,
                    scaleZ: 3.1,
                    geometry: 'driller',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 10,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 7
        }
    },

    SHULK: {
        props: {
            danger: 2,
            acceleration: 500,
            turnSpeed: 0.75,
            hp: 15,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip',
            name: 'LOW GUARD',
            pointWorth: 50,
            enemyIndex: 3,
            calloutSound: 'shulk',
            powerLevel: 1.1,
            logic: {
                brain: {
                    firingDistance: 180,
                    leadSkill: 0.3
                },
                weapon: {
                    type: 'GREEN_BLASTER',
                    randomPool: ['BLUE_BLASTER', 'RED_BLASTER', 'PURPLE_BLASTER'],
                    chanceForRandomWeapon: 0.3,
                    firingMode: 'alternate',
                    firingPoints: [{ offsetAngle: -37, offsetDistance: 10.5, fireAngle: 0 }, { offsetAngle: 37, offsetDistance: 10.5, fireAngle: 0 }, { offsetAngle: -35, offsetDistance: 10, fireAngle: 0 }, { offsetAngle: 35, offsetDistance: 10, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 20,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 15,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [200, 300]
                    }, {
                        amount: 1,
                        classId: ActorFactory.BOOMCHUNK,
                        angle: [0, 360],
                        velocity: [20, 40]
                    }, {
                        classId: ActorFactory.EXPLOSION,
                        delay: 100
                    }, {
                        classId: ActorFactory.ENERGYPICKUP,
                        probability: 0.3,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }, {
                        classId: ActorFactory.SHIELDPICKUP,
                        probability: 0.5,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 6,
                    scaleY: 6,
                    scaleZ: 6,
                    geometry: 'shulk',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomLarge'],
                    uiFlash: 'white',
                    shake: true
                }
            }
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
            danger: 3,
            acceleration: 700,
            turnSpeed: 0.75,
            hp: 40,
            hpBarCount: 7,
            enemy: true,
            type: 'enemyShip',
            name: 'HIGH GUARD',
            pointWorth: 80,
            enemyIndex: 4,
            calloutSound: 'mhulk',
            powerLevel: 1.5,
            delayedDeath: {
                time: 60,
                deathObjectSpawnChance: 0.1,
                deathObjectPool: [ActorFactory.CHUNK, ActorFactory.FLAMECHUNK]
            },
            logic: {
                brain: {
                    firingDistance: 500,
                    shootingArc: 30,
                    leadSkill: 0.4
                },
                weapon: {
                    type: 'ENEMY_CONCUSSION_MISSILE_LAUNCHER',
                    randomPool: ['CONCUSSION_MISSILE_LAUNCHER'],
                    chanceForRandomWeapon: 0.5,
                    firingMode: 'alternate',
                    firingPoints: [{ offsetAngle: -37, offsetDistance: 12.5, fireAngle: 0 }, { offsetAngle: 37, offsetDistance: 12.5, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 20,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 15,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [200, 300]
                    }, {
                        amount: 3,
                        classId: ActorFactory.BOOMCHUNK,
                        angle: [0, 360],
                        velocity: [40, 80]
                    }, {
                        classId: ActorFactory.EXPLOSION,
                        delay: 100
                    }, {
                        classId: ActorFactory.MISSILEQUADPICKUP,
                        probability: 0.8,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }, {
                        classId: ActorFactory.MISSILEQUADPICKUP,
                        probability: 0.2,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 3.8,
                    scaleY: 3.8,
                    scaleZ: 3.8,
                    geometry: 'mhulk',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomLarge'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 30,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 10
        }
    },

    LHULK: {
        props: {
            danger: 3,
            acceleration: 1200,
            turnSpeed: 0.5,
            hp: 100,
            hpBarCount: 7,
            enemy: true,
            type: 'enemyShip',
            name: 'GRAND GUARD',
            pointWorth: 200,
            enemyIndex: 7,
            calloutSound: 'lhulk',
            powerLevel: 1,
            delayedDeath: {
                time: 120,
                deathObjectSpawnChance: 0.1,
                deathObjectPool: [ActorFactory.CHUNK, ActorFactory.FLAMECHUNK]
            },
            logic: {
                brain: {
                    firingDistance: 1500,
                    shootingArc: 30,
                    leadSkill: 0.4
                },
                weapon: {
                    type: 'ENEMY_HOMING_MISSILE_LAUNCHER',
                    firingMode: 'alternate',
                    firingPoints: [{ offsetAngle: -57, offsetDistance: 14.5, fireAngle: 0 }, { offsetAngle: 57, offsetDistance: 14.5, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 20,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 10,
                        classId: ActorFactory.BOOMCHUNK,
                        angle: [0, 360],
                        velocity: [60, 120]
                    }, {
                        amount: 20,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [250, 300]
                    }, {
                        classId: ActorFactory.EXPLOSION,
                        delay: 100
                    }, {
                        probability: 1,
                        classId: ActorFactory.MISSILEQUADPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }, {
                        probability: 0.75,
                        classId: ActorFactory.MISSILEQUADPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }, {
                        probability: 0.5,
                        classId: ActorFactory.MISSILEQUADPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }, {
                        probability: 0.25,
                        classId: ActorFactory.MISSILEQUADPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }, {
                        probability: 1,
                        classId: ActorFactory.ENERGYPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }, {
                        probability: 0.66,
                        classId: ActorFactory.ENERGYPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }, {
                        probability: 0.33,
                        classId: ActorFactory.ENERGYPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20]
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 5,
                    scaleY: 5,
                    scaleZ: 5,
                    geometry: 'lhulk',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomLarge'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 50,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 11
        }
    },

    SPIDER: {
        props: {
            danger: 2,
            acceleration: 2200,
            turnSpeed: 2,
            hp: 10,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip',
            name: 'SPIDER',
            pointWorth: 60,
            enemyIndex: 6,
            calloutSound: 'spider',
            powerLevel: 1.5,
            logic: {
                brain: {
                    shootingArc: 50,
                    nearDistance: 20,
                    farDistance: 50,
                    firingDistance: 200,
                    leadSkill: 1.2
                },
                weapon: {
                    type: 'MOLTEN_BALL_SHOTGUN',
                    firingMode: 'alternate',
                    firingPoints: [{ offsetAngle: -90, offsetDistance: 0.5, fireAngle: 0 }, { offsetAngle: 90, offsetDistance: 0.5, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 10,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 15,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [200, 300]
                    }, {
                        classId: ActorFactory.ENEMY,
                        subclassId: getSubclassIdFor('SPIDERLING'),
                        probability: 0.8,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        classId: ActorFactory.ENEMY,
                        subclassId: getSubclassIdFor('SPIDERLING'),
                        probability: 0.6,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        classId: ActorFactory.ENEMY,
                        subclassId: getSubclassIdFor('SPIDERLING'),
                        probability: 0.4,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        classId: ActorFactory.ENEMY,
                        subclassId: getSubclassIdFor('SPIDERLING'),
                        probability: 0.2,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        classId: ActorFactory.ENERGYPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20],
                        probability: 0.4
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 3,
                    scaleY: 3,
                    scaleZ: 3,
                    geometry: 'spider',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomMedium'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 25,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 6
        }
    },

    SPIDERLING: {
        props: {
            danger: 1,
            acceleration: 400,
            turnSpeed: 2,
            hp: 2,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip',
            calloutSound: 'spiderling',
            powerLevel: 0.8,
            logic: {
                brain: {
                    shootingArc: 50,
                    nearDistance: 20,
                    farDistance: 50,
                    firingDistance: 100,
                    leadSkill: 0
                },
                weapon: {
                    type: 'MOLTEN_BALL_THROWER',
                    firingMode: 'alternate',
                    firingPoints: [{ offsetAngle: 0, offsetDistance: 0, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 5,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 5,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [200, 300]
                    }, {
                        classId: ActorFactory.SMALLEXPLOSION,
                        delay: 100
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 2,
                    scaleY: 2,
                    scaleZ: 2,
                    geometry: 'spider2',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 4,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 3
        }
    },

    ORBOT: {
        props: {
            danger: 1,
            acceleration: 150,
            turnSpeed: 4,
            hp: 2,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip',
            name: 'ORBOT',
            pointWorth: 10,
            enemyIndex: 2,
            calloutSound: 'orbot',
            powerLevel: 0.5,
            logic: {
                brain: {
                    shootingArc: 30,
                    nearDistance: 10,
                    farDistance: 30,
                    firingDistance: 50
                },
                weapon: {
                    type: 'SLOW_PULSE_WAVE_GUN',
                    randomPool: ['PULSE_WAVE_GUN'],
                    chanceForRandomWeapon: 0.2,
                    firingPoints: [{ offsetAngle: 90, offsetDistance: 0.2, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 10,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 5,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [200, 300]
                    }, {
                        classId: ActorFactory.SMALLEXPLOSION,
                        delay: 100
                    }, {
                        classId: ActorFactory.PLASMAPICKUP,
                        angle: [0, 360],
                        velocity: [15, 20],
                        probability: 0.1
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 1.3,
                    scaleY: 1.3,
                    scaleZ: 1.3,
                    geometry: 'orbot',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 2,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 2
        }
    },

    ORBOTBOSS: {
        props: {
            danger: 3,
            acceleration: 1500,
            turnSpeed: 4,
            hp: 120,
            hpBarCount: 7,
            enemy: true,
            type: 'enemyShip',
            name: 'ALL-SEEING ORBOT',
            pointWorth: 300,
            enemyIndex: 2,
            calloutSound: 'orbot',
            powerLevel: 3,
            delayedDeath: {
                time: 180,
                deathObjectSpawnChance: 0.1,
                deathObjectPool: [ActorFactory.CHUNK, ActorFactory.FLAMECHUNK]
            },
            logic: {
                brain: {
                    shootingArc: 30,
                    nearDistance: 10,
                    farDistance: 30,
                    firingDistance: 200
                },
                weapon: {
                    type: 'SLOW_PULSE_WAVE_GUN',
                    randomPool: ['PULSE_WAVE_GUN', 'SLOW_PULSE_WAVE_GUN', 'SLOW_PULSE_WAVE_GUN', 'PLASMA_CANNON', 'PLASMA_BLAST'],
                    chanceForRandomWeapon: 1,
                    firingPoints: [{ offsetAngle: 90, offsetDistance: 0.2, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 20,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 10,
                        classId: ActorFactory.BOOMCHUNK,
                        angle: [0, 360],
                        velocity: [60, 120]
                    }, {
                        amount: 20,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [250, 300]
                    }, {
                        classId: ActorFactory.EXPLOSION,
                        delay: 100
                    }, {
                        amount: 3,
                        classId: ActorFactory.ENERGYPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 3,
                        classId: ActorFactory.SHIELDPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 2,
                        classId: ActorFactory.PLASMAPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        classId: ActorFactory.WEAPONPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100],
                        subclassId: Utils.rand(1, 15)
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                },
                championConfig: {
                    spawnTime: 120,
                    guardianTypes: ['ORBOT'],
                    guardianCount: 5
                }
            },
            render: {
                model: {
                    scaleX: 2.5,
                    scaleY: 2.5,
                    scaleZ: 2.5,
                    geometry: 'orbot',
                    material: 'championEnemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 15,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 5
        }
    },

    CHASERBOSS: {
        props: {
            danger: 3,
            hp: 70,
            enemy: true,
            acceleration: 11000,
            turnSpeed: 7,
            hpBarCount: 7,
            type: 'enemyShip',
            name: 'ELITE CHASER',
            pointWorth: 500,
            enemyIndex: 8,
            calloutSound: 'drone',
            powerLevel: 3,
            delayedDeath: {
                time: 180,
                deathObjectSpawnChance: 0.1,
                deathObjectPool: [ActorFactory.CHUNK, ActorFactory.FLAMECHUNK]
            },
            logic: {
                brain: {
                    firingDistance: 500,
                    leadSkill: 1,
                    nearDistance: 100,
                    farDistance: 500,
                    shootingArc: 30,
                    wallDetectionDistance: 40,
                    behavior: 'chaser'
                },
                weapon: {
                    type: 'RED_BLASTER',
                    randomPool: ['BLUE_BLASTER'],
                    chanceForRandomWeapon: 0.5,
                    firingMode: 'simultaneous',
                    firingPoints: [{ offsetAngle: -90, offsetDistance: 8, fireAngle: 0 }, { offsetAngle: 90, offsetDistance: 8, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 20,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 10,
                        classId: ActorFactory.BOOMCHUNK,
                        angle: [0, 360],
                        velocity: [60, 120]
                    }, {
                        amount: 20,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [250, 300]
                    }, {
                        classId: ActorFactory.EXPLOSION,
                        delay: 100
                    }, {
                        amount: 3,
                        classId: ActorFactory.ENERGYPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 3,
                        classId: ActorFactory.SHIELDPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        classId: ActorFactory.WEAPONPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100],
                        subclassId: Utils.rand(1, 15)
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                },
                championConfig: {
                    guardianTypes: ['CHASER'],
                    guardianCount: 4,
                    spawnTime: 120
                }
            },
            render: {
                model: {
                    scaleX: 5,
                    scaleY: 5,
                    scaleZ: 5,
                    geometry: 'chaser',
                    material: 'championEnemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 20,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 10
        }
    },

    SPIDERBOSS: {
        props: {
            danger: 3,
            acceleration: 1500,
            turnSpeed: 2,
            hp: 200,
            hpBarCount: 9,
            enemy: true,
            type: 'enemyShip',
            name: 'SPIDER QUEEN',
            pointWorth: 1200,
            enemyIndex: 6,
            calloutSound: 'spider',
            powerLevel: 1.5,
            delayedDeath: {
                time: 180,
                deathObjectSpawnChance: 0.1,
                deathObjectPool: [ActorFactory.CHUNK, ActorFactory.FLAMECHUNK]
            },
            logic: {
                brain: {
                    shootingArc: 0,
                    nearDistance: 20,
                    farDistance: 15000,
                    firingDistance: 0,
                    leadSkill: 0
                },
                weapon: {
                    type: 'NONE',
                    firingMode: 'alternate',
                    firingPoints: [{ offsetAngle: -90, offsetDistance: 0.5, fireAngle: 0 }, { offsetAngle: 90, offsetDistance: 0.5, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 20,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 10,
                        classId: ActorFactory.BOOMCHUNK,
                        angle: [0, 360],
                        velocity: [60, 120]
                    }, {
                        amount: 20,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [250, 300]
                    }, {
                        classId: ActorFactory.EXPLOSION,
                        delay: 100
                    }, {
                        amount: 3,
                        classId: ActorFactory.ENERGYPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 3,
                        classId: ActorFactory.SHIELDPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        classId: ActorFactory.WEAPONPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100],
                        subclassId: Utils.rand(1, 15)
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                },
                championConfig: {
                    guardianTypes: ['SPIDER'],
                    guardianCount: 4,
                    spawnTime: 30
                }
            },
            render: {
                model: {
                    scaleX: 6,
                    scaleY: 6,
                    scaleZ: 6,
                    geometry: 'spider',
                    material: 'championEnemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomMedium'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 50,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 12
        }
    },

    MOOKBOSS: {
        props: {
            danger: 3,
            acceleration: 700,
            turnSpeed: 2,
            hp: 250,
            hpBarCount: 9,
            enemy: true,
            type: 'enemyShip',
            name: 'MEGADRONE',
            pointWorth: 400,
            enemyIndex: 0,
            calloutSound: 'drone',
            powerLevel: 1,
            delayedDeath: {
                time: 180,
                deathObjectSpawnChance: 0.1,
                deathObjectPool: [ActorFactory.CHUNK, ActorFactory.FLAMECHUNK]
            },
            logic: {
                brain: {
                    firingDistance: 140,
                    leadSkill: 0
                },
                weapon: {
                    type: 'NONE',
                    firingMode: 'alternate',
                    firingPoints: [{ offsetAngle: -90, offsetDistance: 3.5, fireAngle: 0 }, { offsetAngle: 90, offsetDistance: 3.5, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 20,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 10,
                        classId: ActorFactory.BOOMCHUNK,
                        angle: [0, 360],
                        velocity: [60, 120]
                    }, {
                        amount: 20,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [250, 300]
                    }, {
                        classId: ActorFactory.EXPLOSION,
                        delay: 100
                    }, {
                        amount: 3,
                        classId: ActorFactory.ENERGYPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 3,
                        classId: ActorFactory.SHIELDPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        classId: ActorFactory.WEAPONPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100],
                        subclassId: Utils.rand(1, 15)
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                },
                championConfig: {
                    guardianTypes: ['MOOK'],
                    guardianCount: 12,
                    spawnTime: 60
                }
            },
            render: {
                model: {
                    scaleX: 2.6,
                    scaleY: 2.6,
                    scaleZ: 2.6,
                    geometry: 'drone',
                    material: 'championEnemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 20,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 10
        }
    },

    SHULKBOSS: {
        props: {
            danger: 2,
            acceleration: 4000,
            turnSpeed: 1.5,
            hp: 180,
            hpBarCount: 7,
            enemy: true,
            type: 'enemyShip',
            name: 'MASTER GUARD',
            pointWorth: 1000,
            enemyIndex: 3,
            calloutSound: 'shulk',
            powerLevel: 1.5,
            delayedDeath: {
                time: 180,
                deathObjectSpawnChance: 0.1,
                deathObjectPool: [ActorFactory.CHUNK, ActorFactory.FLAMECHUNK]
            },
            logic: {
                brain: {
                    nearDistance: 20,
                    farDistance: 20,
                    firingDistance: 400,
                    leadSkill: 0.3
                },
                weapon: {
                    type: 'GREEN_BLASTER',
                    randomPool: ['BLUE_BLASTER', 'RED_BLASTER', 'GREEN_BLASTER'],
                    chanceForRandomWeapon: 1,
                    firingMode: 'simultaneous',
                    firingPoints: [{ offsetAngle: -37, offsetDistance: 17, fireAngle: 0 }, { offsetAngle: 37, offsetDistance: 17, fireAngle: 0 }, { offsetAngle: -35, offsetDistance: 14, fireAngle: 0 }, { offsetAngle: 35, offsetDistance: 14, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 20,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 10,
                        classId: ActorFactory.BOOMCHUNK,
                        angle: [0, 360],
                        velocity: [60, 120]
                    }, {
                        amount: 20,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [250, 300]
                    }, {
                        classId: ActorFactory.EXPLOSION,
                        delay: 100
                    }, {
                        amount: 3,
                        classId: ActorFactory.ENERGYPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 3,
                        classId: ActorFactory.SHIELDPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        classId: ActorFactory.WEAPONPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100],
                        subclassId: Utils.rand(1, 15)
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                },
                championConfig: {
                    guardianTypes: ['SHULK'],
                    guardianCount: 2,
                    spawnTime: 120
                }
            },
            render: {
                model: {
                    scaleX: 12,
                    scaleY: 12,
                    scaleZ: 12,
                    geometry: 'shulk',
                    material: 'championEnemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomLarge'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 50,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 12
        }
    },

    MHULKBOSS: {
        props: {
            danger: 3,
            acceleration: 700,
            turnSpeed: 1,
            hp: 300,
            hpBarCount: 11,
            enemy: true,
            type: 'enemyShip',
            name: 'ELITE GUARD',
            pointWorth: 1600,
            enemyIndex: 4,
            calloutSound: 'mhulk',
            powerLevel: 2,
            delayedDeath: {
                time: 180,
                deathObjectSpawnChance: 0.1,
                deathObjectPool: [ActorFactory.CHUNK, ActorFactory.FLAMECHUNK]
            },
            logic: {
                brain: {
                    firingDistance: 500,
                    shootingArc: 30,
                    leadSkill: 0.01
                },
                weapon: {
                    type: 'ENEMY_CHAMPION_CONCUSSION_MISSILE_LAUNCHER',
                    firingPoints: [{ offsetAngle: -37, offsetDistance: 24.5, fireAngle: 0 }, { offsetAngle: 37, offsetDistance: 24.5, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 20,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 10,
                        classId: ActorFactory.BOOMCHUNK,
                        angle: [0, 360],
                        velocity: [60, 120]
                    }, {
                        amount: 20,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [250, 300]
                    }, {
                        classId: ActorFactory.EXPLOSION,
                        delay: 100
                    }, {
                        amount: 3,
                        classId: ActorFactory.ENERGYPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 3,
                        classId: ActorFactory.SHIELDPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        classId: ActorFactory.WEAPONPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100],
                        subclassId: Utils.rand(1, 15)
                    }, {
                        amount: 5,
                        classId: ActorFactory.MISSILEQUADPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 7,
                    scaleY: 7,
                    scaleZ: 7,
                    geometry: 'mhulk',
                    material: 'championEnemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomLarge'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 70,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 20
        }
    },

    SNIPERBOSS: {
        props: {
            danger: 3,
            acceleration: 0,
            turnSpeed: 2,
            hp: 120,
            hpBarCount: 7,
            enemy: true,
            type: 'enemyShip',
            name: 'ELITE SNIPER',
            pointWorth: 600,
            enemyIndex: 1,
            calloutSound: 'sniper',
            powerLevel: 4,
            delayedDeath: {
                time: 180,
                deathObjectSpawnChance: 0.1,
                deathObjectPool: [ActorFactory.CHUNK, ActorFactory.FLAMECHUNK]
            },
            logic: {
                brain: {
                    shootingArc: 8,
                    nearDistance: 200,
                    farDistance: 300,
                    firingDistance: 1500,
                    leadSkill: 0.5
                },
                weapon: {
                    type: 'PURPLE_BLASTER',
                    randomPool: ['BLUE_BLASTER', 'PURPLE_BLASTER', 'RED_BLASTER'],
                    chanceForRandomWeapon: 1,
                    firingPoints: [{ offsetAngle: 10, offsetDistance: 10, fireAngle: 0 }]
                },
                onDeath: {
                    spawn: [{
                        amount: 20,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 10,
                        classId: ActorFactory.BOOMCHUNK,
                        angle: [0, 360],
                        velocity: [60, 120]
                    }, {
                        amount: 20,
                        classId: ActorFactory.FLAMECHUNK,
                        angle: [0, 360],
                        velocity: [250, 300]
                    }, {
                        classId: ActorFactory.EXPLOSION,
                        delay: 100
                    }, {
                        amount: 3,
                        classId: ActorFactory.ENERGYPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        amount: 3,
                        classId: ActorFactory.SHIELDPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }, {
                        classId: ActorFactory.WEAPONPICKUP,
                        angle: [0, 360],
                        velocity: [50, 100],
                        subclassId: Utils.rand(1, 15)
                    }],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 4,
                    scaleY: 4,
                    scaleZ: 4,
                    geometry: 'sniper',
                    material: 'championEnemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },
        bodyConfig: {
            mass: 80,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 8
        }
    }

};

module.exports = EnemyConfig;

},{"shared/ActorFactory":110}],114:[function(require,module,exports){
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

},{}],115:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var Utils = {
    isBrowserMobile: function isBrowserMobile() {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    },

    isBrowserFirefox: function isBrowserFirefox() {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    },

    isBrowserEdge: function isBrowserEdge() {
        return navigator.userAgent.indexOf('Edge') > -1;
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
    },

    //expects each key and value to be unique; intended for name:id mappings and such.
    objectSwitchKeysAndValues: function objectSwitchKeysAndValues(object) {
        return Object.keys(object).reduce(function (carry, objectKey) {
            carry[object[objectKey]] = objectKey;
            return carry;
        }, {});
    },

    deepFreeze: function deepFreeze(o) {
        Object.freeze(o);
        if (o === undefined) {
            return o;
        }

        Object.getOwnPropertyNames(o).forEach(function (prop) {
            if (o[prop] !== null && (_typeof(o[prop]) === "object" || typeof o[prop] === "function") && !Object.isFrozen(o[prop])) {
                this.deepFreeze(o[prop]);
            }
        });

        return o;
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

},{}],116:[function(require,module,exports){
'use strict';

var ActorFactory = require('shared/ActorFactory')('renderer');

var NONE_WEAPON_NAME = 'NONE';

var WEAPON_MAP = {
    BLUE_BLASTER: 1,
    EMD_GUN: 2,
    RED_BLASTER: 3,
    PLASMA_BLAST: 4,
    PLASMA_CANNON: 5,
    PULSE_WAVE_GUN: 6,
    HOMING_MISSILE_LAUNCHER: 7,
    CONCUSSION_MISSILE_LAUNCHER: 8,
    PURPLE_BLASTER: 9,
    ENEMY_CONCUSSION_MISSILE_LAUNCHER: 10,
    GREEN_BLASTER: 11,
    MINI_RED_BLASTER: 12,
    MOLTEN_BALL_THROWER: 13,
    MOLTEN_BALL_SHOTGUN: 14,
    SLOW_PULSE_WAVE_GUN: 15,
    MINIGUN: 16,

    ENEMY_HOMING_MISSILE_LAUNCHER: 100,
    ENEMY_CHAMPION_CONCUSSION_MISSILE_LAUNCHER: 101,

    NONE: 999
};

var ID_MAP = Utils.objectSwitchKeysAndValues(WEAPON_MAP);

var getNoneName = function getNoneName() {
    return NONE_WEAPON_NAME;
};

var getNameById = function getNameById(id) {
    var className = ID_MAP[id];
    if (!className) throw new Error('Missing weapon name for subclassId ' + id);
    return className;
};

var getById = function getById(id) {
    var config = WeaponConfig[ID_MAP[id]];
    if (!config) throw new Error('Missing weapon config for subclassId ' + id);
    return config;
};

var getSubclassIdFor = function getSubclassIdFor(className) {
    var id = WEAPON_MAP[className];
    if (!id) throw new Error('Missing weapon config for ' + className);
    return id;
};

var WeaponConfig = {
    getById: getById,
    getNameById: getNameById,
    getSubclassIdFor: getSubclassIdFor,
    getNoneName: getNoneName,

    NONE: {
        projectileClass: ActorFactory.LASERPROJECTILE,
        noneType: true,
        modelName: 'none',
        name: 'EMPTY SLOT'
    },
    BLUE_BLASTER: {
        projectileClass: ActorFactory.LASERPROJECTILE,
        cooldown: 80,
        velocity: 350,
        burstCount: 1,
        sound: 'blue_laser',
        firingMode: 'simultaneous',
        name: 'HEAVY BLASTER',
        modelName: 'lasgun',
        ammoConfig: {
            energy: 2
        }
    },
    EMD_GUN: {
        projectileClass: ActorFactory.EMDPROJECTILE,
        cooldown: 30,
        velocity: 165,
        sound: 'disrupter',
        firingMode: 'alternate',
        volume: 0.8,
        name: 'EMD RIFLE',
        modelName: 'emdgun2',
        ammoConfig: {
            energy: 1.5
        }
    },
    ENEMY_HOMING_MISSILE_LAUNCHER: {
        projectileClass: ActorFactory.ENEMYHOMINGMISSILE,
        cooldown: 100,
        velocity: 150,
        burstCount: 2,
        burstCooldown: 20,
        sound: 'missile',
        firingMode: 'alternate',
        name: 'HOMING MISSILE LAUNCHER',
        modelName: 'homingmissilelauncher',
        ammoConfig: {
            missiles: 1,
            energy: 3
        }
    },
    ENEMY_CONCUSSION_MISSILE_LAUNCHER: {
        projectileClass: ActorFactory.ENEMYCONCSNMISSILE,
        cooldown: 120,
        velocity: 150,
        burstCount: 2,
        burstCooldown: 20,
        randomAngle: 6,
        sound: 'missile',
        name: 'CONCUSSION MISSILE POD',
        firingMode: 'alternate',
        modelName: 'missilelauncher',
        ammoConfig: {
            missiles: 1
        }
    },
    ENEMY_CHAMPION_CONCUSSION_MISSILE_LAUNCHER: {
        projectileClass: ActorFactory.ENEMYCONCSNMISSILE,
        cooldown: 250,
        velocity: 50,
        burstCount: 15,
        burstCooldown: 15,
        projectileCount: 2,
        randomAngle: 25,
        sound: 'missile',
        name: 'CONCUSSION MISSILE POD',
        firingMode: 'alternate',
        modelName: 'missilelauncher',
        ammoConfig: {
            missiles: 1
        }
    },
    GREEN_BLASTER: {
        projectileClass: ActorFactory.GREENLASERPROJECTILE,
        cooldown: 120,
        velocity: 350,
        burstCount: 4,
        burstCooldown: 14,
        sound: 'laser_green',
        firingMode: 'alternate',
        name: 'BURST BLASTER',
        modelName: 'greenlasgun',
        ammoConfig: {
            energy: 0.5
        }
    },
    HOMING_MISSILE_LAUNCHER: {
        projectileClass: ActorFactory.HOMINGMISSILE,
        cooldown: 120,
        velocity: 0,
        sound: 'missile',
        firingMode: 'alternate',
        volume: 0.5,
        name: 'HOMING MISSILE SYSTEM',
        modelName: 'homingmissilelauncher3',
        ammoConfig: {
            missiles: 1,
            energy: 6
        }
    },
    MINI_RED_BLASTER: {
        projectileClass: ActorFactory.REDLASERENEMYPROJECTILE,
        cooldown: 15,
        velocity: 200,
        sound: 'red_light_laser',
        firingMode: 'alternate',
        name: 'LIGHT BLASTER',
        modelName: 'lightlasgun',
        ammoConfig: {
            energy: 0.3
        }
    },
    CONCUSSION_MISSILE_LAUNCHER: {
        projectileClass: ActorFactory.CONCSNMISSILE,
        cooldown: 80,
        velocity: 60,
        sound: 'missile',
        firingMode: 'alternate',
        name: 'CONCUSSION MISSILE SYSTEM',
        modelName: 'missilelauncher3',
        ammoConfig: {
            missiles: 1
        }
    },
    MOLTEN_BALL_THROWER: {
        projectileClass: ActorFactory.MOLTENPROJECTILE,
        cooldown: 60,
        velocity: 160,
        randomAngle: 10,
        burstCount: 3,
        burstCooldown: 7,
        sound: 'molten',
        volume: 0.4,
        firingMode: 'alternate',
        name: 'MOLTEN BALL THROWER',
        modelName: 'molten',
        ammoConfig: {
            energy: 0.3
        }
    },
    MOLTEN_BALL_SHOTGUN: {
        projectileClass: ActorFactory.MOLTENPROJECTILE,
        cooldown: 150,
        velocity: 160,
        projectileCount: 5,
        randomAngle: 15,
        burstCount: 2,
        burstCooldown: 20,
        sound: 'molten',
        firingMode: 'alternate',
        name: 'MOLTEN BALL SHOTGUN',
        modelName: 'moltenshotgun',
        ammoConfig: {
            energy: 1.5
        }
    },
    PLASMA_BLAST: {
        projectileClass: ActorFactory.PLASMABLASTPROJECTILE,
        cooldown: 300,
        velocity: 70,
        sound: 'plasmabig2',
        firingMode: 'alternate',
        recoil: 40000,
        volume: 0.8,
        name: 'PLASMA BLAST',
        modelName: 'plasmablast',
        ammoConfig: {
            plasma: 4
        }
    },
    PLASMA_CANNON: {
        projectileClass: ActorFactory.PLASMAPROJECTILE,
        cooldown: 24,
        velocity: 75,
        sound: 'plasmashot3',
        firingMode: 'simultaneous',
        name: 'PLASMA CANNON',
        modelName: 'plasmagun',
        volume: 0.8,
        ammoConfig: {
            plasma: 1
        }
    },
    PULSE_WAVE_GUN: {
        projectileClass: ActorFactory.PULSEWAVEPROJECTILE,
        cooldown: 15,
        velocity: 165,
        volume: 0.5,
        sound: 'disrupter',
        firingMode: 'alternate',
        name: 'PULSE WAVE GUN',
        modelName: 'pulsewavegun',
        ammoConfig: {
            energy: 0.5
        }
    },
    RED_BLASTER: {
        projectileClass: ActorFactory.REDLASERPROJECTILE,
        cooldown: 45,
        velocity: 460,
        sound: 'red_laser',
        firingMode: 'simultaneous',
        name: 'COMBAT BLASTER',
        modelName: 'redlasgun',
        ammoConfig: {
            energy: 0.5
        }
    },
    SLOW_PULSE_WAVE_GUN: {
        projectileClass: ActorFactory.RINGPROJECTILE,
        cooldown: 40,
        velocity: 250,
        sound: 'disrupter',
        firingMode: 'alternate',
        name: 'PULSE WAVE BLASTER',
        modelName: 'pulsewaveblast',
        ammoConfig: {
            energy: 0.5
        }
    },
    PURPLE_BLASTER: {
        projectileClass: ActorFactory.PURPLELASERPROJECTILE,
        cooldown: 150,
        velocity: 800,
        burstCount: 2,
        burstCooldown: 20,
        sound: 'laser_purple',
        firingMode: 'alternate',
        name: 'SNIPER BLASTER',
        modelName: 'bluelasgun',
        ammoConfig: {
            energy: 0.5
        }
    },
    MINIGUN: {
        projectileClass: ActorFactory.MINIGUNPROJECTILE,
        burstCount: 60,
        burstCooldown: 3,
        cooldown: 120,
        velocity: 1200,
        randomAngle: 2,
        sound: 'minigun',
        firingMode: 'alternate',
        name: 'MINIGUN',
        modelName: 'minigun',
        recoil: 1200,
        ammoConfig: {
            bullets: 2
        }
    }
};

module.exports = WeaponConfig;

},{"shared/ActorFactory":110}],117:[function(require,module,exports){
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
