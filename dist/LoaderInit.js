(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

global.Utils = require("shared/Utils");
global.Constants = require("shared/Constants");
global.EventEmitter = require("shared/EventEmitter");

if ('function' === typeof importScripts) {
    var LoaderCore = require('loader/Core');
    self.core = new LoaderCore(self);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"loader/Core":2,"shared/Constants":3,"shared/EventEmitter":4,"shared/Utils":5}],2:[function(require,module,exports){
"use strict";

function Core(worker) {
    console.log("loaderCore initialized");
}

module.exports = Core;

},{}],3:[function(require,module,exports){
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

    CHUNK_SIZE: 352
};

module.exports = Constants;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}]},{},[1]);
