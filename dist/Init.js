(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],2:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn)
  }

});

},{}],3:[function(require,module,exports){
/*
Copyright (c) 2010,2011,2012,2013,2014 Morgan Roderick http://roderick.dk
License: MIT - http://mrgnrdrck.mit-license.org

https://github.com/mroderick/PubSubJS
*/
(function (root, factory){
	'use strict';

    if (typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define(['exports'], factory);

    } else if (typeof exports === 'object'){
        // CommonJS
        factory(exports);

    }

    // Browser globals
    var PubSub = {};
    root.PubSub = PubSub;
    factory(PubSub);
    
}(( typeof window === 'object' && window ) || this, function (PubSub){
	'use strict';

	var messages = {},
		lastUid = -1;

	function hasKeys(obj){
		var key;

		for (key in obj){
			if ( obj.hasOwnProperty(key) ){
				return true;
			}
		}
		return false;
	}

	/**
	 *	Returns a function that throws the passed exception, for use as argument for setTimeout
	 *	@param { Object } ex An Error object
	 */
	function throwException( ex ){
		return function reThrowException(){
			throw ex;
		};
	}

	function callSubscriberWithDelayedExceptions( subscriber, message, data ){
		try {
			subscriber( message, data );
		} catch( ex ){
			setTimeout( throwException( ex ), 0);
		}
	}

	function callSubscriberWithImmediateExceptions( subscriber, message, data ){
		subscriber( message, data );
	}

	function deliverMessage( originalMessage, matchedMessage, data, immediateExceptions ){
		var subscribers = messages[matchedMessage],
			callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,
			s;

		if ( !messages.hasOwnProperty( matchedMessage ) ) {
			return;
		}

		for (s in subscribers){
			if ( subscribers.hasOwnProperty(s)){
				callSubscriber( subscribers[s], originalMessage, data );
			}
		}
	}

	function createDeliveryFunction( message, data, immediateExceptions ){
		return function deliverNamespaced(){
			var topic = String( message ),
				position = topic.lastIndexOf( '.' );

			// deliver the message as it is now
			deliverMessage(message, message, data, immediateExceptions);

			// trim the hierarchy and deliver message to each level
			while( position !== -1 ){
				topic = topic.substr( 0, position );
				position = topic.lastIndexOf('.');
				deliverMessage( message, topic, data, immediateExceptions );
			}
		};
	}

	function messageHasSubscribers( message ){
		var topic = String( message ),
			found = Boolean(messages.hasOwnProperty( topic ) && hasKeys(messages[topic])),
			position = topic.lastIndexOf( '.' );

		while ( !found && position !== -1 ){
			topic = topic.substr( 0, position );
			position = topic.lastIndexOf( '.' );
			found = Boolean(messages.hasOwnProperty( topic ) && hasKeys(messages[topic]));
		}

		return found;
	}

	function publish( message, data, sync, immediateExceptions ){
		var deliver = createDeliveryFunction( message, data, immediateExceptions ),
			hasSubscribers = messageHasSubscribers( message );

		if ( !hasSubscribers ){
			return false;
		}

		if ( sync === true ){
			deliver();
		} else {
			setTimeout( deliver, 0 );
		}
		return true;
	}

	/**
	 *	PubSub.publish( message[, data] ) -> Boolean
	 *	- message (String): The message to publish
	 *	- data: The data to pass to subscribers
	 *	Publishes the the message, passing the data to it's subscribers
	**/
	PubSub.publish = function( message, data ){
		return publish( message, data, false, PubSub.immediateExceptions );
	};

	/**
	 *	PubSub.publishSync( message[, data] ) -> Boolean
	 *	- message (String): The message to publish
	 *	- data: The data to pass to subscribers
	 *	Publishes the the message synchronously, passing the data to it's subscribers
	**/
	PubSub.publishSync = function( message, data ){
		return publish( message, data, true, PubSub.immediateExceptions );
	};

	/**
	 *	PubSub.subscribe( message, func ) -> String
	 *	- message (String): The message to subscribe to
	 *	- func (Function): The function to call when a new message is published
	 *	Subscribes the passed function to the passed message. Every returned token is unique and should be stored if
	 *	you need to unsubscribe
	**/
	PubSub.subscribe = function( message, func ){
		if ( typeof func !== 'function'){
			return false;
		}

		// message is not registered yet
		if ( !messages.hasOwnProperty( message ) ){
			messages[message] = {};
		}

		// forcing token as String, to allow for future expansions without breaking usage
		// and allow for easy use as key names for the 'messages' object
		var token = 'uid_' + String(++lastUid);
		messages[message][token] = func;

		// return token for unsubscribing
		return token;
	};

	/* Public: Clears all subscriptions
	 */
	PubSub.clearAllSubscriptions = function clearAllSubscriptions(){
		messages = {};
	};

	/*Public: Clear subscriptions by the topic
	*/
	PubSub.clearSubscriptions = function clearSubscriptions(topic){
		var m; 
		for (m in messages){
			if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0){
				delete messages[m];
			}
		}
	};

	/* Public: removes subscriptions.
	 * When passed a token, removes a specific subscription.
	 * When passed a function, removes all subscriptions for that function
	 * When passed a topic, removes all subscriptions for that topic (hierarchy)
	 *
	 * value - A token, function or topic to unsubscribe.
	 *
	 * Examples
	 *
	 *		// Example 1 - unsubscribing with a token
	 *		var token = PubSub.subscribe('mytopic', myFunc);
	 *		PubSub.unsubscribe(token);
	 *
	 *		// Example 2 - unsubscribing with a function
	 *		PubSub.unsubscribe(myFunc);
	 *
	 *		// Example 3 - unsubscribing a topic
	 *		PubSub.unsubscribe('mytopic');
	 */
	PubSub.unsubscribe = function(value){
		var isTopic    = typeof value === 'string' && messages.hasOwnProperty(value),
			isToken    = !isTopic && typeof value === 'string',
			isFunction = typeof value === 'function',
			result = false,
			m, message, t;

		if (isTopic){
			delete messages[value];
			return;
		}

		for ( m in messages ){
			if ( messages.hasOwnProperty( m ) ){
				message = messages[m];

				if ( isToken && message[value] ){
					delete message[value];
					result = value;
					// tokens are unique, so we can just stop here
					break;
				}

				if (isFunction) {
					for ( t in message ){
						if (message.hasOwnProperty(t) && message[t] === value){
							delete message[t];
							result = true;
						}
					}
				}
			}
		}

		return result;
	};
}));

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
(function (global){
"use strict";

global.Utils = require("Utils");
global.Constants = require("Constants");

var domready = require("domready");
var Ui = require("renderer/ui/Ui");
var gameCore;

function Init() {}

Init.prototype.start = function () {
    domready(function () {
        var ui = new Ui();
        global.uiDebugHandle = ui;
    });
};

var init = new Init();
init.start();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"Constants":4,"Utils":6,"domready":2,"renderer/ui/Ui":53}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"logic/actor/components/ai/BaseBrain":8}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

        if (this.timer > 300) {
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

},{"logic/actor/BaseActor":7,"logic/actor/components/ai/MookBrain":9,"logic/actor/components/body/BaseBody":10,"renderer/actorManagement/ActorFactory":24}],12:[function(require,module,exports){
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

},{"logic/actor/BaseActor":7,"logic/actor/components/body/BaseBody":10,"renderer/actorManagement/ActorFactory":24}],13:[function(require,module,exports){
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

},{"logic/actor/BaseActor":7,"logic/actor/components/body/BaseBody":10}],14:[function(require,module,exports){
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

},{"logic/actor/BaseActor":7,"logic/actor/components/body/BaseBody":10}],15:[function(require,module,exports){
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

},{"logic/actor/BaseActor":7,"logic/actor/components/body/BaseBody":10,"renderer/actorManagement/ActorFactory":24}],16:[function(require,module,exports){
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

},{"logic/actor/BaseActor":7,"logic/actor/components/body/BaseBody":10}],17:[function(require,module,exports){
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

},{"logic/actor/BaseActor":7,"logic/actor/components/body/BaseBody":10}],18:[function(require,module,exports){
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

},{"logic/actor/BaseActor":7,"logic/actor/components/body/BaseBody":10}],19:[function(require,module,exports){
'use strict';

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

    this.expectedPositionZ = this.position.z;
    this.rotation.reorder('ZXY');

    this.position.z = 800;
    this.rotation.x = 0.9;
    this.rotation.y = 0;
}

Camera.extend(THREE.PerspectiveCamera);

Camera.prototype.update = function () {
    var inputState = this.inputListener.inputState;

    if (this.actor) {
        var offsetPosition = Utils.angleToVector(this.actor.angle, -50);

        this.rotation.z = this.actor.angle;

        this.position.x = this.actor.position[0] + offsetPosition[0];
        this.position.y = this.actor.position[1] + offsetPosition[1];
    }

    if (this.inputListener && this.actor) {
        if (this.inputListener.inputState.scrollUp) {
            this.position.z += inputState.scrollUp;
        }

        if (this.inputListener.inputState.scrollDown) {
            this.position.z -= inputState.scrollDown;
        }
    }

    if (this.expectedPositionZ != this.position.z && this.expectedPositionZ > -1) {
        if (this.expectedPositionZ / this.position.z > this.ZOOM_THRESHOLD) {
            this.position.z = this.expectedPositionZ;
        } else {
            this.position.z += this.expectedPositionZ > this.position.z ? (this.expectedPositionZ + this.position.z) / this.zoomSpeed : (this.expectedPositionZ - this.position.z) / this.zoomSpeed;
        }
        this.updateProjectionMatrix();
    } else {
        this.expectedPositionZ = -1;
    }
};

Camera.prototype.setPositionZ = function (newPositionZ, zoomSpeed) {
    this.zoomSpeed = zoomSpeed ? zoomSpeed : this.zoomSpeed;
    this.expectedPositionZ = newPositionZ;
};

module.exports = Camera;

},{}],20:[function(require,module,exports){
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
}

ControlsHandler.prototype.update = function () {
    Object.assign(this.oldInputState, this.inputState);
    Object.assign(this.inputState, this.inputListener.inputState);

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

module.exports = ControlsHandler;

},{}],21:[function(require,module,exports){
"use strict";

var InputListener = require("renderer/InputListener");
var Camera = require("renderer/Camera");
var ParticleManager = require("renderer/particleSystem/ParticleManager");
var ActorManager = require("renderer/actorManagement/ActorManager");
var LogicBus = require("renderer/LogicBus");
var ControlsHandler = require("renderer/ControlsHandler");
var GameScene = require("renderer/scene/GameScene");
var ModelLoader = require("renderer/modelRepo/ModelLoader");
var ModelList = require("renderer/modelRepo/ModelList");
var ModelStore = require("renderer/modelRepo/ModelStore");
var CustomModelBuilder = require("renderer/modelRepo/CustomModelBuilder");
var AiImageRenderer = require("renderer/ai/AiImageRenderer");

function Core(config) {
    if (!config.logicWorker) throw new Error('Logic core initialization failure!');
    if (!config.ui) throw new Error('Missing Ui object for Core!');

    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.FRAMERATE = 60;

    this.ui = config.ui;
    this.logicWorker = config.logicWorker;
    this.viewportElement = document.getElementById('viewport');

    this.renderTicks = 0;
    this.resolutionCoefficient = config.lowRes ? 0.5 : 1;
    this.particleLimitMultiplier = config.lowParticles ? 0.5 : 1;
    this.initRenderer(config);
    this.initAssets();
}

Core.prototype.initRenderer = function (config) {
    this.makeMainComponents(config);
    this.renderStats = this.makeRenderStatsWatcher();
    this.stats = this.makeStatsWatcher();
    this.startTime = Date.now();
    this.attachToDom(this.renderer, this.stats, this.renderStats);
};

Core.prototype.makeMainComponents = function (config) {
    this.renderer = this.makeRenderer(config);
    this.inputListener = new InputListener({ domElement: this.renderer.domElement });
    this.camera = this.makeCamera(this.inputListener);
    this.scene = this.makeScene(this.camera);
    this.particleManager = new ParticleManager({ scene: this.scene, resolutionCoefficient: this.resolutionCoefficient, particleLimitMultiplier: this.particleLimitMultiplier });
    this.actorManager = new ActorManager({ scene: this.scene, particleManager: this.particleManager, core: this });
    this.logicBus = new LogicBus({ core: this, logicWorker: this.logicWorker, actorManager: this.actorManager });
    this.controlsHandler = new ControlsHandler({ inputListener: this.inputListener, logicBus: this.logicBus, camera: this.camera });
    this.gameScene = new GameScene({ core: this, scene: this.scene, logicBus: this.logicBus, actorManager: this.actorManager, shadows: config.shadows });
    this.aiImageRenderer = new AiImageRenderer();
};

Core.prototype.makeRenderStatsWatcher = function () {
    var stats = new THREEx.RendererStats();
    stats.domElement.style.position = 'fixed';
    stats.domElement.style.top = 0;
    stats.domElement.style['z-index'] = 999999999;
    return stats;
};

Core.prototype.makeStatsWatcher = function () {
    var stats = new Stats();
    stats.domElement.style.position = 'fixed';
    stats.domElement.style.left = '100px';
    stats.domElement.style['z-index'] = 999999999;
    return stats;
};

Core.prototype.attachToDom = function (renderer, stats, renderStats) {
    document.body.appendChild(stats.domElement);
    document.body.appendChild(renderStats.domElement);
    this.viewportElement.appendChild(renderer.domElement);
    this.autoResize();
};

Core.prototype.makeCamera = function (inputListener) {
    var camera = new Camera({ inputListener: inputListener });
    return camera;
};

Core.prototype.makeScene = function (camera) {
    var scene = new THREE.Scene();
    scene.add(camera);
    return scene;
};

Core.prototype.makeRenderer = function (config) {
    config = config || {};
    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(this.resolutionCoefficient);
    renderer.setSize(this.WIDTH, this.HEIGHT);
    renderer.shadowMap.enabled = !!config.shadows;
    renderer.shadowMap.type = !!config.shadows ? THREE.BasicShadowMap : null;
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
    this.gameScene.make(false);

    setInterval(this.onEachSecond.bind(this), 1000);

    this.renderLoop = new THREEx.RenderingLoop();
    this.renderLoop.add(this.render.bind(this));

    this.logicBus.postMessage('start', {});

    var controlsLoop = new THREEx.PhysicsLoop(120);
    controlsLoop.add(this.controlsUpdate.bind(this));
    controlsLoop.start();

    setTimeout(this.startGameRenderMode.bind(this), 1000);
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
    this.renderStats.update(this.renderer);
    this.stats.update();
};

Core.prototype.startGameRenderMode = function () {
    this.camera.setPositionZ(80, 20);
    this.renderLoop.start();
};

Core.prototype.stopGame = function (info) {
    setTimeout(function () {
        this.ui.stopGame(info);
        this.renderLoop.stop();
    }.bind(this), 2000);
};

Core.prototype.getAiImageObject = function (wallsData) {
    return this.aiImageRenderer.getImageObject(wallsData);
};

module.exports = Core;

},{"renderer/Camera":19,"renderer/ControlsHandler":20,"renderer/InputListener":22,"renderer/LogicBus":23,"renderer/actorManagement/ActorManager":25,"renderer/ai/AiImageRenderer":41,"renderer/modelRepo/CustomModelBuilder":42,"renderer/modelRepo/ModelList":43,"renderer/modelRepo/ModelLoader":44,"renderer/modelRepo/ModelStore":45,"renderer/particleSystem/ParticleManager":48,"renderer/scene/GameScene":50}],22:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InputListener = function InputListener(config) {
    _classCallCheck(this, InputListener);

    this.scrollDuration = 4;
    this.scrollFallOffPercent = 10;

    this.domElement = config.domElement !== undefined ? config.domElement : document;
    if (this.domElement) {
        this.domElement.setAttribute('tabindex', -1);
    }

    this.viewportElement = config.viewportElement;

    this.inputState = Object.create(null);
    this.inputState.mouseAngle = 0;

    this.PI_2 = Math.PI / 2;

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
        var mouseX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var mouseY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        this.inputState.mouseAngle -= mouseX * 0.002;
        this.inputState.mouseY = mouseY;
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

    var pointerLockFunction = this.domElement.requestPointerLock || this.domElement.mozRequestPointerLock || this.domElement.webkitRequestPointerLock;
    this.domElement.onclick = pointerLockFunction;
};

module.exports = InputListener;

},{}],23:[function(require,module,exports){
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
        case 'getAiImage':
            var imageObject = this.core.getAiImageObject(message.data);
            this.postMessage('aiImageDone', imageObject);
            break;
    }
};

LogicBus.prototype.postMessage = function (type, message) {
    message.type = type;
    this.logicWorker.postMessage(message);
};

LogicBus.prototype.postMessageTransferrable = function (type, message, buffer) {
    message.type = type;
    this.logicWorker.postMessage(message, [buffer]);
};

module.exports = LogicBus;

},{}],24:[function(require,module,exports){
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

},{"logic/actor/enemy/MookActor":11,"logic/actor/map/PillarActor":12,"logic/actor/map/WallActor":13,"logic/actor/object/ChunkActor":14,"logic/actor/player/ShipActor":15,"logic/actor/projectile/LaserProjectileActor":16,"logic/actor/projectile/MoltenProjectileActor":17,"logic/actor/projectile/PlasmaProjectileActor":18,"renderer/actor/enemy/MookActor":33,"renderer/actor/map/PillarActor":34,"renderer/actor/map/WallActor":35,"renderer/actor/object/ChunkActor":36,"renderer/actor/player/ShipActor":37,"renderer/actor/projectile/LaserProjectileActor":38,"renderer/actor/projectile/MoltenProjectileActor":39,"renderer/actor/projectile/PlasmaProjectileActor":40}],25:[function(require,module,exports){
'use strict';

var ActorFactory = require("renderer/actorManagement/ActorFactory")('renderer');

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

},{"renderer/actorManagement/ActorFactory":24}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{"renderer/actor/components/mesh/BaseMesh":27,"renderer/modelRepo/ModelStore":45}],29:[function(require,module,exports){
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

},{"renderer/actor/components/mesh/BaseMesh":27}],30:[function(require,module,exports){
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

},{"renderer/actor/components/mesh/BaseMesh":27,"renderer/modelRepo/ModelStore":45}],31:[function(require,module,exports){
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

},{"renderer/actor/components/mesh/BaseMesh":27,"renderer/modelRepo/ModelStore":45}],32:[function(require,module,exports){
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

},{"renderer/actor/components/mesh/BaseMesh":27}],33:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":26,"renderer/actor/components/mesh/ShipMesh":31}],34:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":26,"renderer/actor/components/mesh/PillarMesh":29}],35:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":26,"renderer/actor/components/mesh/WallMesh":32}],36:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":26,"renderer/actor/components/mesh/ChunkMesh":28}],37:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":26,"renderer/actor/components/mesh/RavierMesh":30}],38:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":26}],39:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":26}],40:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":26}],41:[function(require,module,exports){
'use strict';

function AiImageRenderer() {
    this.AI_SCENE_SIZE_X = 128;
    this.AI_SCENE_SIZE_Y = 128;

    this.LOGIC_SCENE_SIZE_X = 1000;
    this.LOGIC_SCENE_SIZE_Y = 1000;

    this.centerX = this.AI_SCENE_SIZE_X / 2;
    this.centerY = this.AI_SCENE_SIZE_Y / 2;

    this.lengthMultiplierX = this.AI_SCENE_SIZE_X / this.LOGIC_SCENE_SIZE_X;
    this.lengthMultiplierY = this.AI_SCENE_SIZE_Y / this.LOGIC_SCENE_SIZE_Y;

    this.canvas = this.createCanvas();
    this.drawContext = this.canvas.getContext('2d');
}

AiImageRenderer.prototype.createCanvas = function () {
    var canvas = document.createElement('canvas', {
        alpha: false,
        antialias: false,
        depth: false
    });
    canvas.width = this.AI_SCENE_SIZE_X;
    canvas.height = this.AI_SCENE_SIZE_Y;
    return canvas;
};

AiImageRenderer.prototype.getImageObject = function (wallsData) {
    this.drawImage(wallsData);

    return {
        imageData: this.drawContext.getImageData(0, 0, this.AI_SCENE_SIZE_X, this.AI_SCENE_SIZE_Y),
        lengthMultiplierX: this.lengthMultiplierX,
        lengthMultiplierY: this.lengthMultiplierY,
        centerX: this.centerX,
        centerY: this.centerY
    };
};

AiImageRenderer.prototype.drawImage = function (wallsData) {
    // document.body.appendChild(this.canvas);
    // this.canvas.className = 'reactContent';

    this.drawContext.fillStyle = 'white';
    this.drawContext.fillRect(0, 0, this.AI_SCENE_SIZE_X, this.AI_SCENE_SIZE_Y);

    this.drawContext.fillStyle = 'black';
    wallsData.forEach(this.drawObject.bind(this));
};

AiImageRenderer.prototype.drawObject = function (object) {
    if (object.class === 'Box') {
        this.drawBox(object);
    }
};

AiImageRenderer.prototype.drawBox = function (boxDataObject) {
    var objectsPosition = boxDataObject.position;
    var halfWidth = boxDataObject.width / 2 * this.lengthMultiplierX;
    var halfHeight = boxDataObject.height / 2 * this.lengthMultiplierY;
    var angle = boxDataObject.angle;
    objectsPosition[0] = objectsPosition[0] * this.lengthMultiplierX + this.centerX;
    objectsPosition[1] = objectsPosition[1] * this.lengthMultiplierY + this.centerY;

    var bottomLeft = Utils.rotateOffsetPoint(objectsPosition[0], objectsPosition[1], objectsPosition[0] - halfWidth, objectsPosition[1] - halfHeight, angle);
    var topLeft = Utils.rotateOffsetPoint(objectsPosition[0], objectsPosition[1], objectsPosition[0] - halfWidth, objectsPosition[1] + halfHeight, angle);
    var topRight = Utils.rotateOffsetPoint(objectsPosition[0], objectsPosition[1], objectsPosition[0] + halfWidth, objectsPosition[1] + halfHeight, angle);
    var bottomRight = Utils.rotateOffsetPoint(objectsPosition[0], objectsPosition[1], objectsPosition[0] + halfWidth, objectsPosition[1] - halfHeight, angle);

    var dc = this.drawContext;
    dc.moveTo(bottomLeft[0], bottomLeft[1]);
    dc.lineTo(topLeft[0], topLeft[1]);
    dc.lineTo(topRight[0], topRight[1]);
    dc.lineTo(bottomRight[0], bottomRight[1]);
    dc.closePath();
    dc.fill();
};

AiImageRenderer.prototype.drawConvex = function (convexDataObject) {
    var pos = convexDataObject.position;
    pos[0] += this.centerX;
    pos[1] += this.centerY;
    var dc = this.drawContext;

    dc.moveTo(pos[0] - convexDataObject.vertices[0][0], pos[1] - convexDataObject.vertices[0][1]);
    for (var i = 1; i < convexDataObject.vertices.length; i++) {
        dc.lineTo(pos[0] - convexDataObject.vertices[i][0], pos[1] - convexDataObject.vertices[i][1]);
    }

    dc.closePath();
    dc.fill();
};

module.exports = AiImageRenderer;

},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
'use strict';

var ModelList = {
    models: ['/models/ship.json', '/models/ravier.json', '/models/chunk.json']
};

module.exports = ModelList;

},{}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
"use strict";

var ParticleShaders = require("renderer/particleSystem/ParticleShaders");

function ParticleConfigBuilder(config) {

    this.particleFamilyTypeConfigs = {
        particleAdd: {
            lightGreenTrail: {
                colorR: 0.7,
                colorG: 1,
                colorB: 0.9,
                scale: 2,
                alpha: 1,
                alphaMultiplier: 0.4,
                lifetime: 5
            },
            whiteFlashSmall: {
                colorR: 1,
                colorG: 1,
                colorB: 1,
                scale: 3,
                alpha: 1,
                alphaMultiplier: 0.4,
                lifetime: 2
            },
            greenFlashBig: {
                colorR: 0.3,
                colorG: 1,
                colorB: 0.5,
                scale: 10,
                alpha: 0.3,
                alphaMultiplier: 0.91,
                lifetime: 2
            }
        }
    };

    this.particleMaterialConfig = {
        smokePuffAlpha: new THREE.ShaderMaterial({
            uniforms: {
                map: { type: 't', value: new THREE.TextureLoader().load(window.location.href + "gfx/smokePuffAlpha.png") },
                time: { type: "f", value: 1.0 }
            },
            vertexShader: ParticleShaders.vertexShader,
            fragmentShader: ParticleShaders.fragmentShader,
            transparent: true,
            depthWrite: false
        }),
        particleAdd: new THREE.ShaderMaterial({
            uniforms: {
                map: { type: "t", value: new THREE.TextureLoader().load(window.location.href + "gfx/particleAdd.png") },
                time: { type: "f", value: 1.0 }
            },
            // types: { type: 'fv1', value: this.buildTypeParameters('particleAdd')},
            vertexShader: ParticleShaders.vertexShader,
            fragmentShader: ParticleShaders.fragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        }),
        mainExplosionAdd: new THREE.ShaderMaterial({
            uniforms: {
                map: { type: "t", value: new THREE.TextureLoader().load(window.location.href + "gfx/particleAdd.png") },
                time: { type: "f", value: 1.0 }
            },
            vertexShader: ParticleShaders.vertexShader,
            fragmentShader: ParticleShaders.fragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        })
    };

    this.particleGeneratorConfig = {
        smokePuffAlpha: {
            material: this.particleMaterialConfig.smokePuffAlpha,
            maxParticles: 1500 * config.particleLimitMultiplier,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient
        },
        particleAddTrail: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 6000,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient,
            types: this.buildTypeList('particleAdd')
        },
        particleAddSplash: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 3000 * config.particleLimitMultiplier,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient,
            types: this.buildTypeList('particleAdd')
        },
        mainExplosionAdd: {
            material: this.particleMaterialConfig.mainExplosionAdd,
            maxParticles: 500 * config.particleLimitMultiplier,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient
        }
    };
}

ParticleConfigBuilder.prototype.getConfig = function (configName) {
    return this.particleGeneratorConfig[configName];
};

ParticleConfigBuilder.prototype.getAllConfigs = function () {
    return this.particleGeneratorConfig;
};

ParticleConfigBuilder.prototype.buildTypeParameters = function (particleFamilyName) {
    var particleFamilyConfig = this.particleFamilyTypeConfigs[particleFamilyName];
    var i = 0;
    var configArray = [];

    for (var typeConfig in particleFamilyConfig) {
        for (var particleProperty in particleFamilyConfig[typeConfig]) {
            configArray[i] = particleFamilyConfig[typeConfig][particleProperty];
            i++;
        }
    }

    if (configArray.length > Constants.MAX_SHADER_UNIFORM_SIZE) {
        throw 'ERROR: Exceeded max shader uniform size! Got ' + configArray.length + ' and max allowed is ' + Constants.MAX_SHADER_UNIFORM_SIZE;
    }

    console.log(configArray);

    return configArray;
};

ParticleConfigBuilder.prototype.buildTypeList = function (particleFamilyName) {
    var particleFamilyConfig = this.particleFamilyTypeConfigs[particleFamilyName];
    var i = 0;
    var configList = {};

    for (var typeConfig in particleFamilyConfig) {
        configList[typeConfig] = i;
        i++;
    }
    return configList;
};

module.exports = ParticleConfigBuilder;

},{"renderer/particleSystem/ParticleShaders":49}],47:[function(require,module,exports){
'use strict';

function ParticleGenerator(config) {
    THREE.Points.apply(this, arguments);

    config = config || {};
    config.positionZ = config.positionZ || 10;
    config.maxParticles = config.maxParticles || 100;
    config.resolutionCoefficient = config.resolutionCoefficient || 1;

    config.positionHiddenFromView = 100000;

    Object.assign(this, config);

    if (!this.material) throw new Error('No material defined for ParticleGenerator!');

    this.usedPoints = new Float32Array(this.maxParticles);
    this.nextPointer = 0;

    this.geometry = this.createGeometry();
    this.tick = 0;
}

ParticleGenerator.extend(THREE.Points);

ParticleGenerator.prototype.createGeometry = function () {
    var geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array(this.maxParticles * 3);
    var types = new Float32Array(this.maxParticles * 1);
    var colors = new Float32Array(this.maxParticles * 3);
    var speeds = new Float32Array(this.maxParticles * 2);
    var alphas = new Float32Array(this.maxParticles * 2);
    var scales = new Float32Array(this.maxParticles * 1);
    var startTimes = new Float32Array(this.maxParticles * 1);
    var lifeTimes = new Float32Array(this.maxParticles * 1);

    for (var i = 0; i < this.maxParticles; i++) {
        vertices[i * 3 + 0] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
        vertices[i * 3 + 1] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
        vertices[i * 3 + 2] = this.positionZ;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('speed', new THREE.BufferAttribute(speeds, 2));
    geometry.addAttribute('alpha', new THREE.BufferAttribute(alphas, 2));
    geometry.addAttribute('scale', new THREE.BufferAttribute(scales, 1));
    geometry.addAttribute('startTime', new THREE.BufferAttribute(startTimes, 1));
    geometry.addAttribute('lifeTime', new THREE.BufferAttribute(lifeTimes, 1));

    this.positionHandle = geometry.attributes.position.array;
    this.alphaHandle = geometry.attributes.alpha.array;
    this.colorHandle = geometry.attributes.color.array;
    this.scaleHandle = geometry.attributes.scale.array;
    this.speedHandle = geometry.attributes.speed.array;
    this.startTimeHandle = geometry.attributes.startTime.array;
    this.lifeTimeHandle = geometry.attributes.lifeTime.array;

    return geometry;
};

ParticleGenerator.prototype.create = function (config) {
    this.initParticle(this.nextPointer, config);
    this.nextPointer++;
    if (this.nextPointer > this.maxParticles) {
        this.nextPointer = 0;
    }
};

ParticleGenerator.prototype.deactivate = function (particleId) {
    this.positionHandle[particleId * 3] = this.positionHiddenFromView;
    this.positionHandle[particleId * 3 + 1] = this.positionHiddenFromView;
};

ParticleGenerator.prototype.update = function () {
    this.tick += 1;

    this.material.uniforms.time.value = this.tick;

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.speed.needsUpdate = true;

    this.geometry.attributes.alpha.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.scale.needsUpdate = true;
    this.geometry.attributes.startTime.needsUpdate = true;
    this.geometry.attributes.lifeTime.needsUpdate = true;
};

ParticleGenerator.prototype.initParticle = function (particleId, config) {
    var offsetPosition = Utils.angleToVector(config.particleAngle, config.particleVelocity);
    this.positionHandle[particleId * 3] = config.positionX;
    this.positionHandle[particleId * 3 + 1] = config.positionY;
    this.colorHandle[particleId * 3] = config.colorR;
    this.colorHandle[particleId * 3 + 1] = config.colorG;
    this.colorHandle[particleId * 3 + 2] = config.colorB;
    this.scaleHandle[particleId] = config.scale * this.resolutionCoefficient;
    this.alphaHandle[particleId * 2] = config.alpha;
    this.alphaHandle[particleId * 2 + 1] = config.alphaMultiplier;
    this.speedHandle[particleId * 2] = offsetPosition[0];
    this.speedHandle[particleId * 2 + 1] = offsetPosition[1];
    this.startTimeHandle[particleId] = this.tick;
    this.lifeTimeHandle[particleId] = config.lifeTime;
};

module.exports = ParticleGenerator;

},{}],48:[function(require,module,exports){
"use strict";

var ParticleConfigBuilder = require("renderer/particleSystem/ParticleConfigBuilder");
var ParticleGenerator = require("renderer/particleSystem/ParticleGenerator");

function ParticleManager(config) {
    config = config || {};
    Object.assign(this, config);

    if (!this.scene) throw new Error('No scene specified for ParticleGenerator!');

    this.configBuilder = new ParticleConfigBuilder(config);
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

},{"renderer/particleSystem/ParticleConfigBuilder":46,"renderer/particleSystem/ParticleGenerator":47}],49:[function(require,module,exports){
"use strict";

var ParticleShaders = {
    vertexShader: " \
        attribute float scale; \
        attribute vec2 alpha; \
        attribute vec2 speed; \
        attribute float alphaMultiplier; \
        attribute float startTime; \
        attribute float lifeTime; \
        attribute vec3 color; \
        \
        varying float vAlpha; \
        varying vec3 vColor; \
        \
        uniform float time; \
        \
        attribute float type;\
        \
        void main() { \
            vec4 mvPosition; \
            vec3 vPosition; \
            if ((time - startTime) <= lifeTime){ \
                vAlpha = alpha.x * pow(alpha.y, (time - startTime)); \
                vColor = color; \
                vPosition = position; \
                vPosition.x += speed.x * (time - startTime); \
                vPosition.y += speed.y * (time - startTime); \
                mvPosition = modelViewMatrix * vec4( vPosition, 1.0 ); \
                gl_PointSize = scale * (1000.0 / - mvPosition.z) ;  \
            } \
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

},{}],50:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameScene = function () {
    function GameScene(config) {
        _classCallCheck(this, GameScene);

        Object.assign(this, config);
        this.lightCounter = 0;
        this.shadows = config.shadows;
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

            var lcolor = Utils.makeRandomColor();
            //var lcolor = 0xffffff;

            var directionalLight = new THREE.DirectionalLight(lcolor, Utils.rand(5, 8) / 10);
            directionalLight.position.set(2, 2, 10);
            this.scene.add(directionalLight);

            this.pointLight = new THREE.PointLight(lcolor, 2);
            this.pointLight.distance = 200;
            this.pointLight.castShadow = this.shadows;
            this.pointLight.shadowCameraNear = 1;
            this.pointLight.shadowCameraFar = 200;
            this.pointLight.shadowMapWidth = 2048;
            this.pointLight.shadowMapHeight = 2048;
            this.pointLight.shadowBias = 0;
            this.pointLight.shadowDarkness = 0.4;
            this.pointLight.position.set(0, 0, 13);
            this.scene.add(this.pointLight);
        }
    }, {
        key: "update",
        value: function update() {
            if (this.actor) {
                var shipPosition = Utils.angleToVector(this.actor.angle, 15);
                this.pointLight.position.x = this.actor.position[0] + shipPosition[0];
                this.pointLight.position.y = this.actor.position[1] + shipPosition[1];
            }
        }
    }]);

    return GameScene;
}();

module.exports = GameScene;

},{}],51:[function(require,module,exports){
'use strict';

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InitialView = require('renderer/ui/components/InitialView');

function ReactUi() {
    Utils.mixin(this, THREE.EventDispatcher);
    this.InitialView = React.createElement(InitialView, null);
    this.render();
}

ReactUi.prototype.render = function () {
    ReactDOM.render(this.InitialView, document.getElementById('react-content'));
};

ReactUi.prototype.changeMode = function (newMode, context) {
    var additionalConfig = context || null;
    this.InitialView = React.createElement(InitialView, { mode: newMode, context: context });
    this.render();
};

module.exports = ReactUi;

//https://blog.risingstack.com/the-react-way-getting-started-tutorial/
//http://hugogiraudel.com/2015/06/18/styling-react-components-in-sass/
//http://sass-guidelin.es/#architecture
//https://css-tricks.com/the-debate-around-do-we-even-need-css-anymore/

},{"classnames":1,"renderer/ui/components/InitialView":55}],52:[function(require,module,exports){
'use strict';

var ReactUtils = {
    currentKey: 0,
    generateKey: function generateKey() {
        return this.currentKey++;
    },
    multilinize: function multilinize(multilineString) {
        return multilineString.split('\n').map(function (item) {
            return React.createElement(
                'span',
                { key: this.generateKey() },
                item,
                React.createElement('br', null)
            );
        }.bind(this));
    }
};

module.exports = ReactUtils;

},{}],53:[function(require,module,exports){
(function (global){
'use strict';

var ReactUi = require('renderer/ui/ReactUi');
var PubSub = require('pubsub-js');
var Core = require('renderer/Core');

function Ui(config) {
    var _this = this;

    Object.assign(this, config);
    this.reactUi = new ReactUi();

    this.configState = {};

    var listener = PubSub.subscribe('buttonClick', function (msg, data) {
        switch (data.buttonEvent) {
            case 'start':
                _this.onStartButtonClick();
                break;
            case 'stop':
                _this.onStop();
                break;
            case 'shadowConfig':
                _this.onShadowConfig(data);
                break;
            case 'lowResConfig':
                _this.onLowResConfig(data);
                break;
            case 'lowParticlesConfig':
                _this.onLowParticleConfig(data);
                break;
        }
    });
}

Ui.prototype.startGame = function () {
    var logicWorker = new Worker('dist/LogicInit.js');
    var core = new Core({
        logicWorker: logicWorker,
        ui: this,
        shadows: !this.configState.shadows,
        lowRes: this.configState.lowRes,
        lowParticles: this.configState.lowParticles
    });
    global.gameCore = core;
};

Ui.prototype.stopGame = function (info) {
    var scoreText = 'KILLED: ' + info.killed + '\nREMAINING: ' + info.remaining + '\n\n' + this.getOpinionOnResult(info.remaining);
    this.reactUi.changeMode('gameOverScreen', { scoreText: scoreText });
};

Ui.prototype.onStartButtonClick = function () {
    this.startGame();
    this.reactUi.changeMode('running');
};

Ui.prototype.onShadowConfig = function (data) {
    this.configState.shadows = data.state;
};

Ui.prototype.onLowResConfig = function (data) {
    this.configState.lowRes = data.state;
};

Ui.prototype.onLowParticleConfig = function (data) {
    this.configState.lowParticles = data.state;
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"pubsub-js":3,"renderer/Core":21,"renderer/ui/ReactUi":51}],54:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StyledText = require('renderer/ui/components/base/StyledText');

var EndScreen = function (_React$Component) {
    _inherits(EndScreen, _React$Component);

    function EndScreen() {
        _classCallCheck(this, EndScreen);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(EndScreen).apply(this, arguments));
    }

    _createClass(EndScreen, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: (0, _classnames2.default)('class', ['centerHorizontal', 'centerVertical']) },
                React.createElement(
                    StyledText,
                    { style: 'titleText' },
                    'GAME OVER'
                ),
                React.createElement(
                    StyledText,
                    { style: 'smallText' },
                    this.props.scoreText
                )
            );
        }
    }]);

    return EndScreen;
}(React.Component);

module.exports = EndScreen;

},{"classnames":1,"renderer/ui/components/base/StyledText":59}],55:[function(require,module,exports){
'use strict';

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StartScreen = require('renderer/ui/components/StartScreen');
var EndScreen = require('renderer/ui/components/EndScreen');
var FullScreenEffect = require('renderer/ui/components/base/FullScreenEffect');
var Viewport = require('renderer/ui/components/base/Viewport');

var ReactUtils = require('renderer/ui/ReactUtils');

var InitialView = React.createClass({
    displayName: 'InitialView',
    render: function render() {
        var UIcontent = [];
        switch (this.props.mode || 'startScreen') {
            case 'startScreen':
                UIcontent.push(React.createElement(StartScreen, { key: ReactUtils.generateKey() }));
                break;
            case 'gameOverScreen':
                UIcontent.push(React.createElement(EndScreen, { key: ReactUtils.generateKey(), scoreText: ReactUtils.multilinize(this.props.context.scoreText) }));
                break;
        }

        var blurState = undefined;
        switch (this.props.mode) {
            case 'running':
                blurState = 'end';
                break;
            case 'gameOverScreen':
                blurState = 'start';
                break;
            default:
                blurState = 'on';
        }

        return React.createElement(
            'div',
            null,
            React.createElement(
                FullScreenEffect,
                { blur: blurState },
                React.createElement(Viewport, null)
            ),
            UIcontent
        );
    }
});

module.exports = InitialView;

},{"classnames":1,"renderer/ui/ReactUtils":52,"renderer/ui/components/EndScreen":54,"renderer/ui/components/StartScreen":56,"renderer/ui/components/base/FullScreenEffect":58,"renderer/ui/components/base/Viewport":61}],56:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StyledText = require('renderer/ui/components/base/StyledText');
var Button = require('renderer/ui/components/base/Button');
var ToggleButton = require('renderer/ui/components/base/ToggleButton');
var ReactUtils = require('renderer/ui/ReactUtils');

var BOTTOM_TEXT = ReactUtils.multilinize('Wingmod 2 is a little experimental project aimed at learning' + '\nand experimenting with various web technologies.\n' + '\n' + 'Please note that this project depends very heavily on WebGL, so it works best on a PC.\n' + 'No mobile support is planned as keyboard and mouse are essential, but for debug you can try it.\n' + '\n' + 'Some frameworks were surely and painfully harmed in the making of this... thing.\n');

var StartScreen = function (_React$Component) {
    _inherits(StartScreen, _React$Component);

    function StartScreen() {
        _classCallCheck(this, StartScreen);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(StartScreen).apply(this, arguments));
    }

    _createClass(StartScreen, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    {
                        className: (0, _classnames2.default)('class', ['centerHorizontal', 'centerVertical', 'verticalSpacing'])
                    },
                    React.createElement(
                        StyledText,
                        { style: 'titleText' },
                        React.createElement(
                            'span',
                            null,
                            'WINGMOD'
                        ),
                        React.createElement(
                            'span',
                            { style: { color: 'red' } },
                            '2'
                        )
                    ),
                    React.createElement(Button, { text: 'START GAME', buttonEvent: 'start' }),
                    React.createElement(SettingsMenu, null)
                ),
                React.createElement(
                    StyledText,
                    { style: (0, _classnames2.default)('class', ['smallText', 'centerHorizontal', 'bottomVertical']) },
                    React.createElement(
                        'span',
                        { className: 'textDark' },
                        BOTTOM_TEXT
                    )
                )
            );
        }
    }]);

    return StartScreen;
}(React.Component);

var SettingsMenu = function (_React$Component2) {
    _inherits(SettingsMenu, _React$Component2);

    function SettingsMenu() {
        _classCallCheck(this, SettingsMenu);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SettingsMenu).apply(this, arguments));
    }

    _createClass(SettingsMenu, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                {
                    className: (0, _classnames2.default)('class', ['centerVertical']),
                    style: { marginTop: '150px' }
                },
                React.createElement(
                    StyledText,
                    { style: (0, _classnames2.default)('class', ['smallText', 'verticalSpacing']) },
                    React.createElement(
                        'span',
                        { className: 'textDark' },
                        'Performance settings'
                    )
                ),
                React.createElement(ToggleButton, { text: 'No shadows', buttonEvent: 'shadowConfig' }),
                React.createElement(ToggleButton, { text: 'Low-res', buttonEvent: 'lowResConfig' }),
                React.createElement(ToggleButton, { text: 'Less particles', buttonEvent: 'lowParticlesConfig' })
            );
        }
    }]);

    return SettingsMenu;
}(React.Component);

module.exports = StartScreen;

},{"classnames":1,"renderer/ui/ReactUtils":52,"renderer/ui/components/base/Button":57,"renderer/ui/components/base/StyledText":59,"renderer/ui/components/base/ToggleButton":60}],57:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PubSub = require('pubsub-js');

var Button = function (_React$Component) {
    _inherits(Button, _React$Component);

    function Button() {
        _classCallCheck(this, Button);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Button).apply(this, arguments));
    }

    _createClass(Button, [{
        key: 'render',
        value: function render() {
            var classes = (0, _classnames2.default)('button', ['button', 'buttonText', 'textLight', 'verticalSpacing', 'Oswald']);
            var buttonEvent = { buttonEvent: this.props.buttonEvent || 'noAction' };
            return React.createElement(
                'div',
                {
                    onClick: function onClick() {
                        PubSub.publish('buttonClick', buttonEvent);
                    },
                    className: classes
                },
                this.props.text
            );
        }
    }]);

    return Button;
}(React.Component);

module.exports = Button;

},{"classnames":1,"pubsub-js":3}],58:[function(require,module,exports){
'use strict';

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FullScreenEffect = React.createClass({
    displayName: 'FullScreenEffect',
    getInitialState: function getInitialState() {
        return {
            noEffects: false
        };
    },
    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
        if (newProps.blur === 'start' && this.state.noEffects) {
            this.setState({ noEffects: false });
        }
    },
    render: function render() {
        console.log("rendering FullScreenEffect", this.props.blur);
        var blur = '';
        if (!this.state.noEffects) {
            switch (this.props.blur) {
                case 'start':
                    blur = 'blurStart';
                    break;
                case 'end':
                    setTimeout(function () {
                        console.log('set to true');
                        this.setState({ noEffects: true });
                    }.bind(this), 2000);
                    blur = 'fadeout';
                    break;
                case 'on':
                    blur = 'blur';
                    break;
                default:
                    blur = '';
            }
        }

        return React.createElement(
            'div',
            { className: (0, _classnames2.default)('class', ['fullScreen', blur]) },
            this.props.children
        );
    }
});

module.exports = FullScreenEffect;

},{"classnames":1}],59:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StyledText = function (_React$Component) {
    _inherits(StyledText, _React$Component);

    function StyledText() {
        _classCallCheck(this, StyledText);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(StyledText).apply(this, arguments));
    }

    _createClass(StyledText, [{
        key: 'render',
        value: function render() {
            var classes = (0, _classnames2.default)('title', [this.props.style, 'Oswald', 'noSelect']);
            return React.createElement(
                'div',
                { className: classes },
                this.props.children
            );
        }
    }]);

    return StyledText;
}(React.Component);

module.exports = StyledText;

},{"classnames":1}],60:[function(require,module,exports){
'use strict';

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PubSub = require('pubsub-js');

var ToggleButton = React.createClass({
    displayName: 'ToggleButton',
    getInitialState: function getInitialState() {
        return {
            active: false
        };
    },
    render: function render() {
        var _this = this;

        var classes = this.state.active ? (0, _classnames2.default)('button', ['button', 'buttonText', 'textLight', 'verticalSpacing', 'Oswald', 'noSelect']) : (0, _classnames2.default)('button', ['button', 'buttonText', 'textDark', 'verticalSpacing', 'Oswald', 'noSelect']);

        var onOffText = this.state.active ? 'ON' : 'OFF';

        var buttonEvent = {
            buttonEvent: this.props.buttonEvent || 'noAction',
            state: this.state.active
        };

        return React.createElement(
            'div',
            {
                onClick: function onClick() {
                    _this.setState({ active: !_this.state.active });
                    buttonEvent.state = !buttonEvent.state;
                    PubSub.publish('buttonClick', buttonEvent);
                },
                className: classes
            },
            this.props.text + ' ' + onOffText
        );
    }
});

module.exports = ToggleButton;

},{"classnames":1,"pubsub-js":3}],61:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Viewport = function (_React$Component) {
    _inherits(Viewport, _React$Component);

    function Viewport() {
        _classCallCheck(this, Viewport);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Viewport).apply(this, arguments));
    }

    _createClass(Viewport, [{
        key: 'render',
        value: function render() {
            return React.createElement('div', { id: 'viewport', className: (0, _classnames2.default)('class', ['fullScreen', 'allPointerEvents', 'noSelect']) });
        }
    }]);

    return Viewport;
}(React.Component);

module.exports = Viewport;

},{"classnames":1}]},{},[5]);
