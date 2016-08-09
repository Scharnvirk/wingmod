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
/**
sprintf() for JavaScript 0.7-beta1
http://www.diveintojavascript.com/projects/javascript-sprintf

Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of sprintf() for JavaScript nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


Changelog:
2010.11.07 - 0.7-beta1-node
  - converted it to a node.js compatible module

2010.09.06 - 0.7-beta1
  - features: vsprintf, support for named placeholders
  - enhancements: format cache, reduced global namespace pollution

2010.05.22 - 0.6:
 - reverted to 0.4 and fixed the bug regarding the sign of the number 0
 Note:
 Thanks to Raphael Pigulla <raph (at] n3rd [dot) org> (http://www.n3rd.org/)
 who warned me about a bug in 0.5, I discovered that the last update was
 a regress. I appologize for that.

2010.05.09 - 0.5:
 - bug fix: 0 is now preceeded with a + sign
 - bug fix: the sign was not at the right position on padded results (Kamal Abdali)
 - switched from GPL to BSD license

2007.10.21 - 0.4:
 - unit test and patch (David Baird)

2007.09.17 - 0.3:
 - bug fix: no longer throws exception on empty paramenters (Hans Pufal)

2007.09.11 - 0.2:
 - feature: added argument swapping

2007.04.03 - 0.1:
 - initial release
**/

var sprintf = (function() {
	function get_type(variable) {
		return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
	}
	function str_repeat(input, multiplier) {
		for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
		return output.join('');
	}

	var str_format = function() {
		if (!str_format.cache.hasOwnProperty(arguments[0])) {
			str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
		}
		return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
	};

	// convert object to simple one line string without indentation or
	// newlines. Note that this implementation does not print array
	// values to their actual place for sparse arrays. 
	//
	// For example sparse array like this
	//    l = []
	//    l[4] = 1
	// Would be printed as "[1]" instead of "[, , , , 1]"
	// 
	// If argument 'seen' is not null and array the function will check for 
	// circular object references from argument.
	str_format.object_stringify = function(obj, depth, maxdepth, seen) {
		var str = '';
		if (obj != null) {
			switch( typeof(obj) ) {
			case 'function': 
				return '[Function' + (obj.name ? ': '+obj.name : '') + ']';
			    break;
			case 'object':
				if ( obj instanceof Error) { return '[' + obj.toString() + ']' };
				if (depth >= maxdepth) return '[Object]'
				if (seen) {
					// add object to seen list
					seen = seen.slice(0)
					seen.push(obj);
				}
				if (obj.length != null) { //array
					str += '[';
					var arr = []
					for (var i in obj) {
						if (seen && seen.indexOf(obj[i]) >= 0) arr.push('[Circular]');
						else arr.push(str_format.object_stringify(obj[i], depth+1, maxdepth, seen));
					}
					str += arr.join(', ') + ']';
				} else if ('getMonth' in obj) { // date
					return 'Date(' + obj + ')';
				} else { // object
					str += '{';
					var arr = []
					for (var k in obj) { 
						if(obj.hasOwnProperty(k)) {
							if (seen && seen.indexOf(obj[k]) >= 0) arr.push(k + ': [Circular]');
							else arr.push(k +': ' +str_format.object_stringify(obj[k], depth+1, maxdepth, seen)); 
						}
					}
					str += arr.join(', ') + '}';
				}
				return str;
				break;
			case 'string':				
				return '"' + obj + '"';
				break
			}
		}
		return '' + obj;
	}

	str_format.format = function(parse_tree, argv) {
		var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
		for (i = 0; i < tree_length; i++) {
			node_type = get_type(parse_tree[i]);
			if (node_type === 'string') {
				output.push(parse_tree[i]);
			}
			else if (node_type === 'array') {
				match = parse_tree[i]; // convenience purposes only
				if (match[2]) { // keyword argument
					arg = argv[cursor];
					for (k = 0; k < match[2].length; k++) {
						if (!arg.hasOwnProperty(match[2][k])) {
							throw new Error(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
						}
						arg = arg[match[2][k]];
					}
				}
				else if (match[1]) { // positional argument (explicit)
					arg = argv[match[1]];
				}
				else { // positional argument (implicit)
					arg = argv[cursor++];
				}

				if (/[^sO]/.test(match[8]) && (get_type(arg) != 'number')) {
					throw new Error(sprintf('[sprintf] expecting number but found %s "' + arg + '"', get_type(arg)));
				}
				switch (match[8]) {
					case 'b': arg = arg.toString(2); break;
					case 'c': arg = String.fromCharCode(arg); break;
					case 'd': arg = parseInt(arg, 10); break;
					case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
					case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
				    case 'O': arg = str_format.object_stringify(arg, 0, parseInt(match[7]) || 5); break;
					case 'o': arg = arg.toString(8); break;
					case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
					case 'u': arg = Math.abs(arg); break;
					case 'x': arg = arg.toString(16); break;
					case 'X': arg = arg.toString(16).toUpperCase(); break;
				}
				arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
				pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
				pad_length = match[6] - String(arg).length;
				pad = match[6] ? str_repeat(pad_character, pad_length) : '';
				output.push(match[5] ? arg + pad : pad + arg);
			}
		}
		return output.join('');
	};

	str_format.cache = {};

	str_format.parse = function(fmt) {
		var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
		while (_fmt) {
			if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
				parse_tree.push(match[0]);
			}
			else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
				parse_tree.push('%');
			}
			else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosOuxX])/.exec(_fmt)) !== null) {
				if (match[2]) {
					arg_names |= 1;
					var field_list = [], replacement_field = match[2], field_match = [];
					if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
						field_list.push(field_match[1]);
						while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
							if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else {
								throw new Error('[sprintf] ' + replacement_field);
							}
						}
					}
					else {
                        throw new Error('[sprintf] ' + replacement_field);
					}
					match[2] = field_list;
				}
				else {
					arg_names |= 2;
				}
				if (arg_names === 3) {
					throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported');
				}
				parse_tree.push(match);
			}
			else {
				throw new Error('[sprintf] ' + _fmt);
			}
			_fmt = _fmt.substring(match[0].length);
		}
		return parse_tree;
	};

	return str_format;
})();

var vsprintf = function(fmt, argv) {
	var argvClone = argv.slice();
	argvClone.unshift(fmt);
	return sprintf.apply(null, argvClone);
};

module.exports = sprintf;
sprintf.sprintf = sprintf;
sprintf.vsprintf = vsprintf;

},{}],5:[function(require,module,exports){
(function (global){
"use strict";

global.Utils = require("shared/Utils");
global.Constants = require("shared/Constants");
global.EventEmitter = require("shared/EventEmitter");

var Core = require('renderer/Core');
var domready = require("domready");
var Ui = require("renderer/ui/Ui");
var gameCore;

function Init() {}

Init.prototype.start = function () {
    domready(function () {
        var ui = new Ui();

        var logicWorker = new Worker('dist/LogicInit.js');

        var core = new Core({
            logicWorker: logicWorker,
            ui: ui
        });

        ui.gameCore = core;
        ui.init();

        global.uiDebugHandle = ui;
        global.gameCore = core;
    });
};

var init = new Init();
init.start();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"domready":2,"renderer/Core":39,"renderer/ui/Ui":114,"shared/Constants":128,"shared/EventEmitter":129,"shared/Utils":130}],6:[function(require,module,exports){
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
        this.deathMain();
    }
    this.customUpdate();
    this.processMovement();
};

BaseActor.prototype.onCollision = function (otherActor, relativeContactPoint) {
    if (otherActor && this.hp != Infinity && otherActor.damage > 0) {
        this.hp -= otherActor.damage;
        this.sendActorEvent('currentHp', this.hp);
        this.onHit();
    }

    if (this.hp <= 0 || this.removeOnHit) {
        if (this.collisionFixesPosition) {
            this.body.position = relativeContactPoint;
        }
        this.deathMain();
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

BaseActor.prototype.onDeath = function () {};

BaseActor.prototype.deathMain = function () {
    this.manager.actorDied(this);
    this.onDeath();
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

},{"shared/ActorFactory":127}],7:[function(require,module,exports){
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

},{"logic/actor/BaseActor":6,"logic/actor/component/body/BaseBody":11}],8:[function(require,module,exports){
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

},{"logic/actor/component/weapon/Blaster":13,"logic/actor/component/weapon/PlasmaGun":15,"logic/actor/component/weapon/PulseWaveGun":16}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"logic/actor/component/ai/BaseBrain":9}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"logic/actor/component/weapon/BaseWeapon":12,"shared/ActorFactory":127}],14:[function(require,module,exports){
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

},{"logic/actor/component/weapon/BaseWeapon":12,"shared/ActorFactory":127}],15:[function(require,module,exports){
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

},{"logic/actor/component/weapon/BaseWeapon":12,"shared/ActorFactory":127}],16:[function(require,module,exports){
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

},{"logic/actor/component/weapon/BaseWeapon":12,"shared/ActorFactory":127}],17:[function(require,module,exports){
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

},{"logic/actor/component/weapon/BaseWeapon":12,"shared/ActorFactory":127}],18:[function(require,module,exports){
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

},{"logic/actor/component/weapon/BaseWeapon":12,"shared/ActorFactory":127}],19:[function(require,module,exports){
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

},{"logic/actor/component/weapon/BaseWeapon":12,"shared/ActorFactory":127}],20:[function(require,module,exports){
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

},{"logic/actor/BaseActor":6,"logic/actor/component/ai/MookBrain":10,"logic/actor/component/body/BaseBody":11,"logic/actor/component/weapon/MoltenBallThrower":14,"logic/actor/component/weapon/RedBlaster":17,"shared/ActorFactory":127}],21:[function(require,module,exports){
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

},{"logic/actor/BaseActor":6,"logic/actor/component/ai/MookBrain":10,"logic/actor/component/body/BaseBody":11,"logic/actor/component/weapon/RedSuperBlaster":18,"logic/actor/enemy/MookActor":20,"shared/ActorFactory":127}],22:[function(require,module,exports){
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

},{"logic/actor/BaseActor":6,"logic/actor/component/ai/MookBrain":10,"logic/actor/component/body/BaseBody":11,"logic/actor/component/weapon/RingBlaster":19,"shared/ActorFactory":127}],23:[function(require,module,exports){
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

},{"logic/actor/BaseActor":6,"logic/actor/component/ai/MookBrain":10,"logic/actor/component/body/BaseBody":11,"logic/actor/component/weapon/RedBlaster":17,"shared/ActorFactory":127}],24:[function(require,module,exports){
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

},{"logic/actor/BaseActor":6,"logic/actor/component/body/BaseBody":11,"shared/ActorFactory":127}],25:[function(require,module,exports){
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
        hp: 350,
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

},{"logic/actor/BaseActor":6,"logic/actor/component/body/BaseBody":11,"shared/ActorFactory":127}],26:[function(require,module,exports){
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

},{"logic/actor/BaseActor":6,"logic/actor/component/body/BaseBody":11}],27:[function(require,module,exports){
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

},{"logic/actor/object/ChunkActor":28}],28:[function(require,module,exports){
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

},{"logic/actor/BaseActor":6,"logic/actor/component/body/BaseBody":11}],29:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseBrain = require("logic/actor/component/ai/BaseBrain");
var BaseActor = require("logic/actor/BaseActor");
var WeaponSystem = require("logic/actor/component/WeaponSystem");
var ActorFactory = require("shared/ActorFactory")('logic');

function ShipActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        acceleration: 1000,
        turnSpeed: 6,
        hp: 30,
        bodyConfig: {
            actor: this,
            mass: 4,
            damping: 0.85,
            angularDamping: 0,
            inertia: 10,
            radius: 7,
            collisionType: 'playerShip'
        }
    });

    this.hudModifier = 'shift';

    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

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

},{"logic/actor/BaseActor":6,"logic/actor/component/WeaponSystem":8,"logic/actor/component/ai/BaseBrain":9,"logic/actor/component/body/BaseBody":11,"shared/ActorFactory":127}],30:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function LaserProjectileActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 3,
        removeOnHit: true,
        timeout: 60,
        bodyConfig: {
            radius: 1,
            mass: 0.04,
            ccdSpeedThreshold: 1,
            ccdIterations: 4,
            collisionType: 'playerProjectile',
            actor: this
        }
    });

    BaseActor.apply(this, arguments);

    this.collisionFixesPosition = true;
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

},{"logic/actor/BaseActor":6,"logic/actor/component/body/BaseBody":11}],31:[function(require,module,exports){
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

    this.collisionFixesPosition = true;
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

},{"logic/actor/BaseActor":6,"logic/actor/component/body/BaseBody":11}],32:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function PlasmaProjectileActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 1.8,
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

    this.collisionFixesPosition = true;
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

},{"logic/actor/BaseActor":6,"logic/actor/component/body/BaseBody":11}],33:[function(require,module,exports){
"use strict";

var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function PulseWaveProjectileActor(config) {
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 3,
        removeOnHit: true,
        timeout: 30,
        bodyConfig: {
            radius: 3,
            mass: 2,
            ccdSpeedThreshold: 1,
            ccdIterations: 2,
            collisionType: 'playerProjectile',
            actor: this
        }
    });

    BaseActor.apply(this, arguments);

    this.collisionFixesPosition = true;
}

PulseWaveProjectileActor.extend(BaseActor);

PulseWaveProjectileActor.prototype.createBody = function () {
    return new BaseBody(this.bodyConfig);
};

PulseWaveProjectileActor.prototype.customUpdate = function () {
    this.damage *= 0.97;
    this.body.updateMassProperties();
};

PulseWaveProjectileActor.prototype.onDeath = function () {
    this.body.dead = true;
    this.manager.playSound({ sounds: ['matterhit3'], actor: this });
};

module.exports = PulseWaveProjectileActor;

},{"logic/actor/BaseActor":6,"logic/actor/component/body/BaseBody":11}],34:[function(require,module,exports){
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

    this.collisionFixesPosition = true;
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

},{"logic/actor/BaseActor":6,"logic/actor/component/body/BaseBody":11}],35:[function(require,module,exports){
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

    this.collisionFixesPosition = true;
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

},{"logic/actor/BaseActor":6,"logic/actor/component/body/BaseBody":11}],36:[function(require,module,exports){
'use strict';

function Camera(config) {
    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.VIEW_ANGLE = 45;
    this.ASPECT = this.WIDTH / this.HEIGHT;
    this.NEAR = 0.1;
    this.FAR = Constants.RENDER_DISTANCE;

    this.ZOOM_THRESHOLD = 0.995;
    this.zoomSpeed = 5;

    config = config || {};
    Object.assign(this, config);
    THREE.PerspectiveCamera.call(this, this.VIEV_ANGLE, this.ASPECT, this.NEAR, this.FAR);

    this.expectedPositionZ = this.position.z;
    this.rotation.reorder('ZXY');

    this.position.z = 0;
    this.rotation.x = 0;
    this.rotation.y = 0;

    this.zOffset = 60;
}

Camera.extend(THREE.PerspectiveCamera);

Camera.prototype.update = function () {
    var inputState = this.inputListener.inputState;

    if (this.actor) {
        var offsetPosition = Utils.angleToVector(this.actor.angle, -this.zOffset);

        this.rotation.z = this.actor.angle;

        this.position.x = this.actor.position[0] + offsetPosition[0];
        this.position.y = this.actor.position[1] + offsetPosition[1];
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
        if (this.inputListener && this.actor) {
            if (inputState.scrollUp && this.position.z < 150) {
                this.position.z += inputState.scrollUp;
                this.rotation.x -= inputState.scrollUp * 0.01;
                this.zOffset -= inputState.scrollUp * 0.5;
            }

            if (inputState.scrollDown && this.position.z > 30) {
                this.position.z -= inputState.scrollDown;
                this.rotation.x += inputState.scrollDown * 0.01;
                this.zOffset += inputState.scrollDown * 0.5;
            }
        }
    }
};

Camera.prototype.setMovementZ = function (newPositionZ, zoomSpeed) {
    this.zoomSpeed = zoomSpeed ? zoomSpeed : this.zoomSpeed;
    this.expectedPositionZ = newPositionZ;
};

module.exports = Camera;

},{}],37:[function(require,module,exports){
'use strict';

var sprintf = require("sprintf");

function ConfigManager(config) {
    Object.assign(this, config);

    this.defaultConfig = {
        soundVolume: 2,
        shadow: 1,
        resolution: 2
    };

    this.storageKey = 'wingmodConfig033';

    this.config = {};
    this.settingConfig = {};

    this.restore();

    EventEmitter.apply(this, arguments);
}

ConfigManager.extend(EventEmitter);

ConfigManager.prototype.makeConfig = function () {
    for (var property in this.defaultConfig) {
        var configFunction = sprintf('save%s', Utils.firstToUpper(property));
        if (this[configFunction]) {
            this[configFunction](this.settingConfig[property]);
        } else {
            console.warn(sprintf('function %s is missing! The game might be misconfigured!'), configFunction);
        }
    }

    return {};
};

ConfigManager.prototype.restore = function () {
    this.restoreFromLocalStorage();
    this.makeConfig();
};

ConfigManager.prototype.restoreFromLocalStorage = function () {
    if (!localStorage) {
        return false;
    } else {
        try {
            var config = JSON.parse(localStorage.getItem(this.storageKey));
            Object.assign(this.settingConfig, this.defaultConfig);
            Object.assign(this.settingConfig, config);
        } catch (error) {
            console.warn("Failed reading from local storage! Reverting to defaults!", error);
            return false;
        }
    }
};

ConfigManager.prototype.saveToLocalStorage = function () {
    localStorage.setItem(this.storageKey, JSON.stringify(this.settingConfig));
};

ConfigManager.prototype.saveShadow = function (value) {
    this.settingConfig.shadow = value;
    switch (value) {
        case 0:
            this.config.shadow = null;
            break;
        case 1:
            this.config.shadow = THREE.PCFShadowMap;
            break;
        case 2:
            this.config.shadow = THREE.PCFSoftShadowMap;
            break;
    }
    this.saveToLocalStorage();
};

ConfigManager.prototype.saveResolution = function (value) {
    this.settingConfig.resolution = value;
    this.config.resolution = 1 - (1 - (value + 1.6) * 0.25);
    this.saveToLocalStorage();
};

ConfigManager.prototype.saveSoundVolume = function (value) {
    this.settingConfig.soundVolume = value;
    this.config.soundVolume = value > 0 ? 0.8 - (1 - value * 0.3) : 0;
    this.saveToLocalStorage();
};

module.exports = ConfigManager;

},{"sprintf":4}],38:[function(require,module,exports){
'use strict';

function ControlsHandler(config) {
    if (!config.inputListener) throw new Error('No inputListener specified for the handler!');
    if (!config.logicBus) throw new Error('No logic bus specified for the handler!');

    Object.assign(this, config);

    this.inputListener = config.inputListener;
    this.logicBus = config.logicBus;
    this.oldInputState = {};
    this.inputState = {};

    this.hudKeys = ['shift', 'mouseLeft', 'mouseRight'];

    EventEmitter.apply(this, arguments);
}

ControlsHandler.extend(EventEmitter);

ControlsHandler.prototype.update = function () {
    Object.assign(this.oldInputState, this.inputState);
    Object.assign(this.inputState, this.inputListener.inputState);

    var changed = this.hasInputStateChanged();

    var hudKeys = this.getChangedHudKeys();
    if (hudKeys) {
        this.emit({ type: 'hud', data: this.inputState });
    }

    if (changed) this.sendUpdate();
};

ControlsHandler.prototype.hasInputStateChanged = function () {
    var changed = false;
    for (var key in this.inputState) {
        if (this.inputState[key] != this.oldInputState[key]) {
            changed = true;
            break;
        }
    }
    return changed;
};

ControlsHandler.prototype.getChangedHudKeys = function () {
    var hudKeys = {};
    for (var key in this.hudKeys) {
        var value = this.hudKeys[key];
        if (this.inputState[value] != this.oldInputState[value]) {
            hudKeys[value] = this.inputState[value];
        }
    }
    return Object.keys(hudKeys).length > 0 ? hudKeys : null;
};

ControlsHandler.prototype.sendUpdate = function () {
    this.logicBus.postMessage('inputState', this.inputState);
};

module.exports = ControlsHandler;

},{}],39:[function(require,module,exports){
"use strict";

var ConfigManager = require("renderer/ConfigManager");
var InputListener = require("renderer/InputListener");
var ParticleManager = require("renderer/particleSystem/ParticleManager");
var ActorManager = require("renderer/actor/ActorManager");
var LogicBus = require("renderer/LogicBus");
var ControlsHandler = require("renderer/ControlsHandler");
var SceneManager = require("renderer/scene/SceneManager");
var AssetManager = require("renderer/assetManagement/assetManager.js");
var AiImageRenderer = require("renderer/ai/AiImageRenderer");
var Hud = require("renderer/gameUi/Hud");
var FlatHud = require("renderer/gameUi/FlatHud");
var ChunkStore = require("renderer/assetManagement/level/ChunkStore");

function Core(config) {
    if (!config.logicWorker) throw new Error('Logic core initialization failure!');
    if (!config.ui) throw new Error('Missing Ui object for Core!');

    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.FRAMERATE = 60;

    this.ui = config.ui;
    this.logicWorker = config.logicWorker;
    this.viewportElement = document.getElementById('viewport');
    this.activeScene = '';

    this.renderTicks = 0;
}

Core.prototype.init = function () {
    this.assetManager = new AssetManager();
    this.assetManager.loadAll();

    this.createMainComponents();
    this.initEventHandlers();
    this.renderStats = this.createRenderStatsWatcher();
    this.stats = this.createStatsWatcher();
    this.startTime = Date.now();
    this.attachToDom(this.renderStats);
    this.attachToDom(this.stats);
    this.attachRendererToDom(this.renderer);

    PubSub.publish('setConfig', this.configManager.settingConfig);
};

Core.prototype.createMainComponents = function () {
    this.configManager = new ConfigManager();
    this.renderer = this.createRenderer();
    this.inputListener = new InputListener({ renderer: this.renderer });
    this.sceneManager = new SceneManager({ renderer: this.renderer, core: this });
    this.particleManager = new ParticleManager({ sceneManager: this.sceneManager, resolutionCoefficient: 1, particleLimitMultiplier: this.particleLimitMultiplier });
    this.actorManager = new ActorManager({ sceneManager: this.sceneManager, particleManager: this.particleManager });
    this.logicBus = new LogicBus({ worker: this.logicWorker });
    this.controlsHandler = new ControlsHandler({ inputListener: this.inputListener, logicBus: this.logicBus });
    this.aiImageRenderer = new AiImageRenderer();
    this.hud = new Hud({ actorManager: this.actorManager, particleManager: this.particleManager });
    this.flatHud = new FlatHud({ sceneManager: this.sceneManager, renderer: this.renderer, configManager: this.configManager });
};

Core.prototype.initEventHandlers = function () {
    this.logicBus.on('updateActors', this.onUpdateActors.bind(this));
    this.logicBus.on('attachPlayer', this.onAttachPlayer.bind(this));
    this.logicBus.on('gameEnded', this.onGameEnded.bind(this));
    this.logicBus.on('gameFinished', this.onGameFinished.bind(this));
    this.logicBus.on('getAiImage', this.onGetAiImage.bind(this));
    this.logicBus.on('actorEvents', this.onActorEvents.bind(this));
    this.logicBus.on('mapDone', this.onMapDone.bind(this));
    this.logicBus.on('playSound', this.onPlaySound.bind(this));

    this.ui.on('getPointerLock', this.onGetPointerLock.bind(this));
    this.ui.on('startGame', this.onStartGame.bind(this));
    this.ui.on('soundConfig', this.onSoundConfig.bind(this));
    this.ui.on('resolutionConfig', this.onResolutionConfig.bind(this));
    this.ui.on('shadowConfig', this.onShadowConfig.bind(this));

    this.inputListener.on('gotPointerLock', this.onGotPointerLock.bind(this));
    this.inputListener.on('lostPointerLock', this.onLostPointerLock.bind(this));

    this.controlsHandler.on('hud', this.onFlatHud.bind(this));

    this.actorManager.on('playerActorAppeared', this.onPlayerActorAppeared.bind(this));
    this.actorManager.on('requestUiFlash', this.onRequestUiFlash.bind(this));

    this.assetManager.on('assetsLoaded', this.onAssetsLoaded.bind(this));

    this.flatHud.on('weaponSwitched', this.onWeaponSwitched.bind(this));
};

Core.prototype.createRenderStatsWatcher = function () {
    var stats = new THREEx.RendererStats();
    stats.domElement.style.position = 'fixed';
    stats.domElement.style.top = 0;
    stats.domElement.style['z-index'] = 999999999;
    return stats;
};

Core.prototype.createStatsWatcher = function () {
    var stats = new Stats();
    stats.domElement.style.position = 'fixed';
    stats.domElement.style.left = '100px';
    stats.domElement.style['z-index'] = 999999999;
    return stats;
};

Core.prototype.attachToDom = function (object) {
    document.body.appendChild(object.domElement);
};

Core.prototype.attachRendererToDom = function (renderer) {
    this.viewportElement.appendChild(renderer.domElement);
    this.autoResize();
};

Core.prototype.createRenderer = function () {
    var config = this.configManager.config;
    var exisitngDomElement = this.renderer ? this.renderer.domElement : undefined;
    var renderer = new THREE.WebGLRenderer({ antialias: false, canvas: exisitngDomElement });
    renderer.setPixelRatio(config.resolution);
    renderer.setSize(this.WIDTH, this.HEIGHT);
    renderer.shadowMap.enabled = !!config.shadow;
    renderer.shadowMap.type = config.shadow;
    renderer.autoClear = false;
    return renderer;
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
    this.sceneManager.get(this.activeScene).resetCamera();
    this.sceneManager.get('FlatHudScene').resetCamera();
};

Core.prototype.getActiveScene = function () {
    return this.activeScene;
};

Core.prototype.onAssetsLoaded = function () {
    console.log("assets loaded");
    this.activeScene = 'MainMenuScene';
    this.sceneManager.createScene('MainMenuScene', { shadows: this.renderShadows, inputListener: this.inputListener });
    this.sceneManager.createScene('GameScene', { shadows: this.renderShadows, inputListener: this.inputListener });
    this.sceneManager.createScene('FlatHudScene');
    this.particleManager.buildGenerators();
    this.particleManager.updateResolutionCoefficient(this.configManager.config.resolution);

    setInterval(this.onEachSecond.bind(this), 1000);

    this.renderLoop = new THREEx.RenderingLoop();
    this.renderLoop.add(this.render.bind(this));

    this.logicBus.postMessage('mapHitmapsLoaded', { hitmaps: ChunkStore.serializeHitmaps() });

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
    this.actorManager.update();
    this.hud.update();
    this.particleManager.update();
    this.sceneManager.update();
    this.renderTicks++;
    this.sceneManager.render(this.activeScene);
    this.flatHud.update();
    this.renderStats.update(this.renderer);
    this.stats.update();
};

Core.prototype.startGameRenderMode = function () {
    PubSub.publish('assetsLoaded');
    this.ui.setAssetsLoaded(true);
    this.renderLoop.start();
};

Core.prototype.getAiImageObject = function (wallsData) {
    return this.aiImageRenderer.getImageObject(wallsData);
};

//todo: something better for injecting that actor?
Core.prototype.onPlayerActorAppeared = function (event) {
    var actor = event.data;
    actor.inputListener = this.inputListener;

    this.hud.onPlayerActorAppeared(actor);
    this.flatHud.onPlayerActorAppeared(actor);
    this.sceneManager.get(this.activeScene).onPlayerActorAppeared(actor);
};

Core.prototype.onUpdateActors = function (event) {
    this.actorManager.updateFromLogic(event.data);
};

Core.prototype.onAttachPlayer = function (event) {
    console.log('attach player');
    this.actorManager.attachPlayer(event.data);
};

Core.prototype.onGameEnded = function (event) {
    this.gameEnded = true;
    setTimeout(function () {
        this.ui.stopGame(event.data);
        this.renderLoop.stop();
    }.bind(this), 2000);
};

Core.prototype.onGameFinished = function (event) {
    this.gameEnded = true;
    setTimeout(function () {
        this.ui.stopGameFinished();
        this.renderLoop.stop();
    }.bind(this), 500);
};

Core.prototype.onGetAiImage = function (event) {
    this.logicBus.postMessage('aiImageDone', this.getAiImageObject(event.data));
};

Core.prototype.onActorEvents = function (event) {
    this.actorManager.handleActorEvents(event.data);
};

Core.prototype.onRequestUiFlash = function (event) {
    this.sceneManager.get(this.activeScene).doUiFlash(event.data);
};

Core.prototype.onStartGame = function (event) {
    if (!this.running) {
        this.running = true;
        this.logicBus.postMessage('startGame', {});
        this.activeScene = 'GameScene';
    }
};

Core.prototype.onGetPointerLock = function (event) {
    this.inputListener.acquirePointerLock();
};

Core.prototype.onGotPointerLock = function (event) {
    //TODO: game state machine
    if (!this.gameEnded) {
        this.ui.gotPointerLock();
    }
};

Core.prototype.onLostPointerLock = function (event) {
    if (!this.gameEnded) {
        this.ui.lostPointerLock();
    }
};

Core.prototype.onShadowConfig = function (event) {
    this.configManager.saveShadow(event.value);
    this.rebuildRenderer();
};

Core.prototype.onResolutionConfig = function (event) {
    this.configManager.saveResolution(event.value);
    this.rebuildRenderer();
};

Core.prototype.onSoundConfig = function (event) {
    this.configManager.saveSoundVolume(event.value);
};

Core.prototype.rebuildRenderer = function () {
    var config = this.configManager.config;
    this.viewportElement.removeChild(this.renderer.domElement);
    this.renderer = this.createRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.setPixelRatio(config.resolution);
    this.particleManager.updateResolutionCoefficient(config.resolution);
    this.sceneManager.renderer = this.renderer;

    this.attachToDom(this.renderStats);
    this.attachToDom(this.stats);
    this.attachRendererToDom(this.renderer);
};

Core.prototype.onPlaySound = function (event) {
    var config = this.configManager.config;
    var baseVolume = Math.max(Constants.MAX_SOUND_DISTANCE - event.data.distance, 0) / Constants.MAX_SOUND_DISTANCE;
    var configVolume = event.data.volume || 1;
    var finalVolume = config.soundVolume * Math.min(baseVolume * (Utils.rand(80, 100) / 100) * configVolume, 1);
    if (finalVolume > 0.01) {
        createjs.Sound.play(event.data.sounds[Utils.rand(0, event.data.sounds.length - 1)], { volume: finalVolume });
    }
};

Core.prototype.onFlatHud = function (event) {
    this.flatHud.onInput(event.data);
};

Core.prototype.onWeaponSwitched = function (event) {
    this.logicBus.postMessage('weaponSwitched', event.data);
};

Core.prototype.onMapDone = function (event) {
    this.sceneManager.get('GameScene').createMap(event.data);
};

module.exports = Core;

},{"renderer/ConfigManager":37,"renderer/ControlsHandler":38,"renderer/InputListener":40,"renderer/LogicBus":41,"renderer/actor/ActorManager":42,"renderer/ai/AiImageRenderer":65,"renderer/assetManagement/assetManager.js":66,"renderer/assetManagement/level/ChunkStore":69,"renderer/gameUi/FlatHud":76,"renderer/gameUi/Hud":78,"renderer/particleSystem/ParticleManager":85,"renderer/scene/SceneManager":111}],40:[function(require,module,exports){
'use strict';

function InputListener(config) {
    this.scrollDuration = 4;
    this.scrollFallOffPercent = 10;

    this.domElement = config.renderer !== undefined ? config.renderer.domElement : document;
    if (this.domElement) {
        this.domElement.setAttribute('tabindex', -1);
    }

    this.viewportElement = config.viewportElement;

    EventEmitter.apply(this, arguments);

    this.inputState = Object.create(null);
    this.inputState.mouseAngle = 0;

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
        16: 'shift',
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
        this.inputState.mouseAngle -= (event.movementX || event.mozMovementX || event.webkitMovementX || 0) * 0.002;
        this.inputState.mouseY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
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
}

InputListener.extend(EventEmitter);

InputListener.prototype.acquirePointerLock = function () {
    this.domElement.onclick = function () {
        if (!document.pointerLockElement && this.domElement.requestPointerLock) {
            this.domElement.requestPointerLock();
        }
        if (!document.mozPointerLockElement && this.domElement.mozRequestPointerLock) {
            this.domElement.mozRequestPointerLock();
        }
        if (!document.webkitPointerLockElement && this.domElement.webkitRequestPointerLock) {
            this.domElement.webkitRequestPointerLock();
        }
    }.bind(this);

    var onPointerLockChange = function onPointerLockChange(event) {
        if (document.pointerLockElement !== null) {
            this.emit({ type: 'gotPointerLock' });
        } else {
            this.emit({ type: 'lostPointerLock' });
        }
        document.removeEventListener('pointerlockchange', onPointerLockChange, false);
    };

    var mozOnPointerLockChange = function mozOnPointerLockChange(event) {
        if (document.mozPointerLockElement !== null) {
            this.emit({ type: 'gotPointerLock' });
        } else {
            this.emit({ type: 'lostPointerLock' });
        }
        document.removeEventListener('mozpointerlockchange', mozOnPointerLockChange, false);
    };

    var webkitOnPointerLockChange = function webkitOnPointerLockChange(event) {
        if (document.webkitPointerLockElement !== null) {
            this.emit({ type: 'gotPointerLock' });
        } else {
            this.emit({ type: 'lostPointerLock' });
        }
        document.removeEventListener('webkitpointerlockchange', webkitOnPointerLockChange, false);
    };

    document.addEventListener('pointerlockchange', onPointerLockChange.bind(this));
    document.addEventListener('mozpointerlockchange', mozOnPointerLockChange.bind(this));
    document.addEventListener('webkitpointerlockchange', webkitOnPointerLockChange.bind(this));
};

module.exports = InputListener;

},{}],41:[function(require,module,exports){
"use strict";

var WorkerBus = require("shared/WorkerBus");

function LogicBus(config) {
    WorkerBus.apply(this, arguments);
}

LogicBus.extend(WorkerBus);

module.exports = WorkerBus;

},{"shared/WorkerBus":131}],42:[function(require,module,exports){
'use strict';

var ActorFactory = require("shared/ActorFactory")('renderer');

function ActorManager(config) {
    config = config || {};
    this.storage = Object.create(null);
    this.enemies = Object.create(null);

    this.scene = null;
    this.framerate = config.framerate || 60;

    Object.assign(this, config);

    if (!this.particleManager) throw new Error('No particleManager for Renderer ActorManager!');
    if (!this.sceneManager) throw new Error('No sceneManager for Renderer ActorManager!');

    this.factory = config.factory || ActorFactory.getInstance({ particleManager: this.particleManager });
    this.currentPhysicsTime = Date.now();
    this.lastPhysicsTime = Date.now() - 1;

    EventEmitter.apply(this, arguments);
}

ActorManager.extend(EventEmitter);

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
ActorManager.prototype.updateFromLogic = function (messageObject) {
    this.lastPhysicsTime = this.currentPhysicsTime;
    this.currentPhysicsTime = Date.now();
    var dataArray = messageObject.transferArray;
    var deadDataArray = messageObject.deadTransferArray;

    for (var i = 0; i < messageObject.actorCount; i++) {
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

    for (var _i = 0; _i < messageObject.deadActorCount; _i++) {
        var _actor = this.storage[deadDataArray[_i]];
        this.deleteActor(deadDataArray[_i * 5], deadDataArray[_i * 5 + 2], deadDataArray[_i * 5 + 3]);
    }
};

ActorManager.prototype.createActor = function (config) {
    var actor = this.factory.create(config);
    actor.actorId = config.actorId;
    actor.manager = this;

    if (this.actorRequestingPlayer && this.actorRequestingPlayer === config.actorId) {
        this.emit({
            type: 'playerActorAppeared',
            data: actor
        });
    }

    this.storage[config.actorId] = actor;
    actor.addToScene(this.sceneManager.getCoreActiveScene().threeScene);
    actor.onSpawn();
};

ActorManager.prototype.attachPlayer = function (messageObject) {
    if (!this.storage[messageObject.actorId]) {
        this.actorRequestingPlayer = messageObject.actorId;
    }
};

ActorManager.prototype.deleteActor = function (actorId, positionX, positionY) {
    var actor = this.storage[actorId];
    if (actor) {
        actor.setPosition(positionX, positionY);
        actor.onDeath();

        actor.removeFromScene(this.sceneManager.getCoreActiveScene().threeScene);
    }
    delete this.storage[actorId];
};

ActorManager.prototype.handleActorEvents = function (messageObject) {
    var actorData = messageObject.actorData;

    for (var actorId in actorData) {
        var actor = this.storage[actorId];
        if (actor) {
            actor.handleEvent(actorData[actorId]);
        }
    }
};

ActorManager.prototype.newEnemy = function (actorId) {
    this.enemies[actorId] = this.storage[actorId];
};

ActorManager.prototype.enemyDestroyed = function (actorId) {
    delete this.enemies[actorId];
};

ActorManager.prototype.requestUiFlash = function (flashType) {
    this.emit({
        type: 'requestUiFlash',
        data: flashType
    });
};

module.exports = ActorManager;

},{"shared/ActorFactory":127}],43:[function(require,module,exports){
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

    this.meshes = this.createMeshes() || [];

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

    if (this.meshes) {
        for (var i = 0, l = this.meshes.length; i < l; i++) {
            this.meshes[i].update();
        }
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

BaseActor.prototype.setPosition = function (positionX, positionY) {
    this.position[0] = positionX || 0;
    this.position[1] = positionY || 0;
};

BaseActor.prototype.createMeshes = function () {
    return [];
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

BaseActor.prototype.onDeath = function () {};

BaseActor.prototype.onSpawn = function () {};

module.exports = BaseActor;

},{}],44:[function(require,module,exports){
"use strict";

var BaseActor = require("renderer/actor/BaseActor");

function DebugActor() {
    BaseActor.apply(this, arguments);
}

DebugActor.extend(BaseActor);

DebugActor.prototype.customUpdate = function () {
    this.particleManager.createParticle('particleAdd', {
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

},{"renderer/actor/BaseActor":43}],45:[function(require,module,exports){
'use strict';

function BaseMesh(config) {
    config.scaleX = config.scaleX || 1;
    config.scaleY = config.scaleY || 1;
    config.scaleZ = config.scaleZ || 1;

    config = config || {};

    THREE.Mesh.apply(this, [config.geometry, config.material]);
    this.angleOffset = 0;
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
        var offsetVector = Utils.rotateVector(this.positionOffset[0], this.positionOffset[1], this.actor.angle * -1);
        this.position.x = this.actor.position[0] + offsetVector[0];
        this.position.y = this.actor.position[1] + offsetVector[1];
        this.position.z = this.actor.positionZ + this.positionZOffset;
        this.rotation.z = this.actor.angle + this.angleOffset;
    }
};

module.exports = BaseMesh;

},{}],46:[function(require,module,exports){
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

},{"renderer/actor/component/mesh/BaseMesh":45,"renderer/assetManagement/model/ModelStore":74}],47:[function(require,module,exports){
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

},{"renderer/actor/component/mesh/BaseMesh":45,"renderer/assetManagement/model/ModelStore":74}],48:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function ShipMesh(config) {
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    Object.assign(this, config);

    this.castShadow = true;
    this.receiveShadow = true;
}

ShipMesh.extend(BaseMesh);

module.exports = ShipMesh;

},{"renderer/actor/component/mesh/BaseMesh":45,"renderer/assetManagement/model/ModelStore":74}],49:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":43,"renderer/actor/component/mesh/ShipMesh":48,"renderer/assetManagement/model/ModelStore":74}],50:[function(require,module,exports){
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

},{"renderer/actor/component/mesh/ShipMesh":48,"renderer/actor/enemy/MookActor":49}],51:[function(require,module,exports){
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
            angle: this.angle,
            angleOffset: 0,
            distance: 1.65
        });
    }
};

module.exports = OrbotActor;

},{"renderer/actor/BaseActor":43,"renderer/actor/component/mesh/ShipMesh":48,"renderer/assetManagement/model/ModelStore":74}],52:[function(require,module,exports){
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

    this.eyeAngle = 0;
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

},{"renderer/actor/BaseActor":43,"renderer/actor/component/mesh/ShipMesh":48,"renderer/assetManagement/model/ModelStore":74}],53:[function(require,module,exports){
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
        particleAngle: 0,
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
        particleAngle: 0,
        lifeTime: 2
    });

    for (var i = 0; i < this.timer / 15; i++) {
        var angle = Utils.rand(0, 360);
        var offsetPosition = Utils.angleToVector(angle, Utils.rand(20, 30));
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
            particleAngle: angle,
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
            particleAngle: 360 / pointCount * i,
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
            particleAngle: 360 / pointCount * i,
            lifeTime: 5
        });
    }
};

module.exports = EnemySpawnMarkerActor;

},{"renderer/actor/BaseActor":43}],54:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":43,"renderer/actor/component/mesh/BaseMesh":45,"renderer/assetManagement/model/ModelStore":74}],55:[function(require,module,exports){
"use strict";

var BaseActor = require("renderer/actor/BaseActor");

function MapActor() {
    BaseActor.apply(this, arguments);
}

MapActor.extend(BaseActor);

module.exports = MapActor;

},{"renderer/actor/BaseActor":43}],56:[function(require,module,exports){
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

},{"renderer/actor/object/ChunkActor":57}],57:[function(require,module,exports){
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

},{"renderer/actor/BaseActor":43,"renderer/actor/component/mesh/ChunkMesh":46}],58:[function(require,module,exports){
"use strict";

var RavierMesh = require("renderer/actor/component/mesh/RavierMesh");
var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");
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
            angleOffset: Utils.degToRad(-90),
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

},{"renderer/actor/BaseActor":43,"renderer/actor/component/mesh/BaseMesh":45,"renderer/actor/component/mesh/RavierMesh":47,"renderer/assetManagement/model/ModelStore":74}],59:[function(require,module,exports){
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
    var offsetPosition = Utils.angleToVector(this.angle, -3);
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
        particleAngle: 0,
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
        particleAngle: this.angle,
        lifeTime: 3
    });
};

module.exports = LaserProjectileActor;

},{"renderer/actor/BaseActor":43}],60:[function(require,module,exports){
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
    var offsetPosition = Utils.angleToVector(this.angle, -3);
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
        particleAngle: 0,
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
        particleAngle: this.angle,
        lifeTime: 10
    });
};

module.exports = MoltenProjectileActor;

},{"renderer/actor/BaseActor":43}],61:[function(require,module,exports){
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
    var offsetPosition = Utils.angleToVector(this.angle, -5);
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
        particleAngle: 0,
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
        particleAngle: this.angle,
        lifeTime: 10
    });
};

module.exports = PlasmaProjectileActor;

},{"renderer/actor/BaseActor":43}],62:[function(require,module,exports){
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
        offsetPositionZ = Utils.angleToVector(Utils.degToRad(240 / ringSections * i) + this.angle, 1 + this.timer / 3);
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
            particleAngle: this.angle,
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
            particleAngle: 0,
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
            particleAngle: Utils.rand(0, 360),
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
        particleAngle: 0,
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
        particleAngle: this.angle,
        lifeTime: 3
    });
};

module.exports = PulseWaveProjectileActor;

},{"renderer/actor/BaseActor":43}],63:[function(require,module,exports){
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
    var offsetPosition = Utils.angleToVector(this.angle, -3);
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
        particleAngle: 0,
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
        particleAngle: this.angle,
        lifeTime: 3
    });
};

module.exports = RedLaserProjectileActor;

},{"renderer/actor/BaseActor":43}],64:[function(require,module,exports){
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
            particleAngle: this.angle,
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
            particleAngle: 0,
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
            particleAngle: Utils.rand(0, 360),
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
        particleAngle: 0,
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
        particleAngle: this.angle,
        lifeTime: 3
    });
};

module.exports = RingProjectileActor;

},{"renderer/actor/BaseActor":43}],65:[function(require,module,exports){
'use strict';

function AiImageRenderer() {
    this.AI_SCENE_SIZE_X = Constants.CHUNK_SIZE;
    this.AI_SCENE_SIZE_Y = Constants.CHUNK_SIZE;

    this.LOGIC_SCENE_SIZE_X = Constants.CHUNK_SIZE * 5;
    this.LOGIC_SCENE_SIZE_Y = Constants.CHUNK_SIZE * 5;

    this.centerX = this.AI_SCENE_SIZE_X / 2;
    this.centerY = this.AI_SCENE_SIZE_Y / 2;

    this.lengthMultiplierX = this.AI_SCENE_SIZE_X / this.LOGIC_SCENE_SIZE_X;
    this.lengthMultiplierY = this.AI_SCENE_SIZE_Y / this.LOGIC_SCENE_SIZE_Y;

    this.canvas = this.createCanvas();
    this.drawContext = this.canvas.getContext('2d');
    this.drawContext.translate(this.AI_SCENE_SIZE_X / 2, this.AI_SCENE_SIZE_Y / 2);
}

AiImageRenderer.prototype.debugDraw = function () {
    document.body.insertBefore(this.canvas, document.getElementById('react-content'));
    this.canvas.style.position = 'absolute';
    this.canvas.style.zIndex = 9999;
};

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
    this.drawContext.fillStyle = 'white';
    this.drawContext.fillRect(-this.AI_SCENE_SIZE_X / 2, -this.AI_SCENE_SIZE_Y / 2, this.AI_SCENE_SIZE_X, this.AI_SCENE_SIZE_Y);

    this.drawContext.fillStyle = 'black';
    wallsData.forEach(this.drawObject.bind(this));
};

AiImageRenderer.prototype.drawObject = function (object) {
    if (object) {
        switch (object.class) {
            case "Box":
                this.drawBox(object);
                break;
            case "Convex":
                this.drawConvex(object);
                break;
        }
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
    var dc = this.drawContext;

    var pos = convexDataObject.position;
    pos[0] *= this.lengthMultiplierX;
    pos[1] *= this.lengthMultiplierY;

    dc.translate(pos[0], pos[1]);
    dc.rotate(convexDataObject.angle);

    dc.moveTo(convexDataObject.vertices[0][0] * this.lengthMultiplierX, convexDataObject.vertices[0][1] * this.lengthMultiplierY);
    for (var i = 1; i < convexDataObject.vertices.length; i++) {
        dc.lineTo(convexDataObject.vertices[i][0] * this.lengthMultiplierX, convexDataObject.vertices[i][1] * this.lengthMultiplierY);
    }

    dc.closePath();
    dc.fill();

    dc.rotate(-convexDataObject.angle);
    dc.translate(-pos[0], -pos[1]);
};

module.exports = AiImageRenderer;

},{}],66:[function(require,module,exports){
"use strict";

var ModelLoader = require("renderer/assetManagement/model/ModelLoader");
var ModelList = require("renderer/assetManagement/model/ModelList");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

var CustomModelBuilder = require("renderer/assetManagement/model/CustomModelBuilder");

var ChunkLoader = require("renderer/assetManagement/level/ChunkLoader");
var ChunkList = require("renderer/assetManagement/level/ChunkList");
var ChunkStore = require("renderer/assetManagement/level/ChunkStore");

var SoundLoader = require("renderer/assetManagement/sound/SoundLoader");

function AssetManager(config) {
    config = config || {};
    Object.assign(this, config);

    this.modelStore = ModelStore;
    this.chunkStore = ChunkStore;
    this.soundLoader = new SoundLoader();

    EventEmitter.apply(this, arguments);
}

AssetManager.extend(EventEmitter);

AssetManager.prototype.loadAll = function () {
    var _this = this;

    this.soundLoader.loadSounds();

    var loaders = [this.loadModels, this.loadChunks];

    var willLoadModels = new Promise(function (resolve, reject) {
        _this.loadModels(resolve);
    });

    var willLoadChunks = new Promise(function (resolve, reject) {
        _this.loadChunks(resolve);
    });

    Promise.all([willLoadModels, willLoadChunks]).then(function () {
        _this.modelsLoaded();
        _this.chunksLoaded();
        _this.emit({
            type: 'assetsLoaded'
        });
    });
};

AssetManager.prototype.loadModels = function (resolve) {
    this.modelLoader = new ModelLoader();
    this.modelLoader.on('loaded', resolve);
    this.modelLoader.loadModels(ModelList.models);

    this.customModelBuilder = new CustomModelBuilder();
    this.customModelBuilder.loadModels();
    ModelStore.loadBatch(this.customModelBuilder.getBatch());
};

AssetManager.prototype.modelsLoaded = function (event) {
    ModelStore.loadBatch(this.modelLoader.getBatch());
    this.modelLoader.clearBatch();
};

AssetManager.prototype.loadChunks = function (resolve) {
    this.chunkLoader = new ChunkLoader();
    this.chunkLoader.on('loaded', resolve);
    this.chunkLoader.loadChunks(ChunkList.chunks);
};

AssetManager.prototype.chunksLoaded = function (event) {
    ChunkStore.loadBatch(this.chunkLoader.getBatch());
    this.chunkLoader.clearBatch();
};

module.exports = AssetManager;

},{"renderer/assetManagement/level/ChunkList":67,"renderer/assetManagement/level/ChunkLoader":68,"renderer/assetManagement/level/ChunkStore":69,"renderer/assetManagement/model/CustomModelBuilder":71,"renderer/assetManagement/model/ModelList":72,"renderer/assetManagement/model/ModelLoader":73,"renderer/assetManagement/model/ModelStore":74,"renderer/assetManagement/sound/SoundLoader":75}],67:[function(require,module,exports){
'use strict';

var levelPath = '/models/levels';

var ChunkList = {
    chunks: [{
        model: levelPath + '/chunk_HangarStraight_SideSmall_1.json',
        hitmap: levelPath + '/chunk_HangarStraight_SideSmall_1_hitmap.json'
    }, {
        model: levelPath + '/chunk_HangarEndcap_1.json',
        hitmap: levelPath + '/chunk_HangarEndcap_1_hitmap.json'
    }, {
        model: levelPath + '/chunk_HangarCorner_1.json',
        hitmap: levelPath + '/chunk_HangarCorner_1_hitmap.json'
    }]
};

module.exports = ChunkList;

},{}],68:[function(require,module,exports){
'use strict';

var HitmapLoader = require("renderer/assetManagement/level/HitmapLoader");

function ChunkLoader() {
    this.batch = {};

    this.hitmapLoader = new HitmapLoader();
    this.jsonLoader = new THREE.JSONLoader();

    EventEmitter.apply(this, arguments);
}

ChunkLoader.extend(EventEmitter);

ChunkLoader.prototype.loadChunks = function (chunks) {
    var _this = this;

    var loaders = [];

    chunks.forEach(function (chunk) {
        var chunkObject = _this.batch[_this.getModelName(chunk.model)] = {};
        var hitmapLoader = new Promise(function (resolve, reject) {
            _this.hitmapLoader.load(chunk.hitmap, function (faceObject) {
                chunkObject.hitmap = faceObject;
                resolve();
            });
        });
        var modelLoader = new Promise(function (resolve, reject) {
            _this.jsonLoader.load(chunk.model, function (geometry, material) {
                chunkObject.geometry = geometry;
                chunkObject.material = material;
                resolve();
            });
        });
        loaders.push(hitmapLoader);
        loaders.push(modelLoader);
    });

    Promise.all(loaders).then(this.doneAction.bind(this));
};

ChunkLoader.prototype.doneAction = function () {
    this.emit({ type: 'loaded' });
};

ChunkLoader.prototype.getBatch = function () {
    return this.batch;
};

ChunkLoader.prototype.clearBatch = function () {
    this.batch = {};
};

ChunkLoader.prototype.getModelName = function (path) {
    var name = path.split('.')[0].split('/').pop();
    if (!name) throw 'ERROR: Bad model path: ' + path;
    return name;
};

module.exports = ChunkLoader;

},{"renderer/assetManagement/level/HitmapLoader":70}],69:[function(require,module,exports){
"use strict";

var ChunkStore = {
    geometries: {},
    materials: {},
    hitmaps: {},

    get: function get(name) {
        return {
            geometry: this.geometries[name],
            material: this.materials[name],
            hitmap: this.hitmaps[name]
        };
    },

    loadBatch: function loadBatch(batch) {
        Object.keys(batch).forEach(function (chunkName) {
            this.addHitmap(chunkName, batch[chunkName].hitmap);
            this.addGeometry(chunkName, batch[chunkName].geometry);
            this.addMaterial(chunkName, batch[chunkName].material);
        }.bind(this));
    },

    addHitmap: function addHitmap(name, hitmap) {
        this.hitmaps[name] = hitmap;
    },

    addGeometry: function addGeometry(name, geometry) {
        this.geometries[name] = geometry;
    },

    addMaterial: function addMaterial(name, material) {
        this.materials[name] = material instanceof Array ? material[0] : material;
    },

    serializeHitmaps: function serializeHitmaps() {
        return JSON.stringify(this.hitmaps);
    }
};

module.exports = ChunkStore;

},{}],70:[function(require,module,exports){
"use strict";

function HitmapLoader() {
    this.loader = new THREE.XHRLoader();
}

HitmapLoader.prototype.load = function (path, callback) {
    var _this = this;

    this.loader.load(path, function (result) {
        var jsonObject = JSON.parse(result);
        var faces = _this.jsonToFaces(jsonObject);
        _this.addVerticesToFaces(jsonObject.vertices, faces);
        callback(faces);
    });
};

HitmapLoader.prototype.jsonToFaces = function (json) {
    function isBitSet(value, position) {
        return value & 1 << position;
    }

    var offset,
        zLength,
        type,
        isQuad,
        hasMaterial,
        hasFaceUv,
        hasFaceVertexUv,
        hasFaceNormal,
        hasFaceVertexNormal,
        hasFaceColor,
        hasFaceVertexColor,
        vertex,
        normalIndex,
        faces = json.faces,
        vertices = json.vertices,
        normals = json.normals,
        colors = json.colors,
        nUvLayers = 0,
        nVertices = 0;

    for (var i = 0; i < json.uvs.length; i++) {
        if (json.uvs[i].length) nUvLayers++;
    }

    offset = 0;

    zLength = faces.length;

    var doneFaces = [];

    while (offset < zLength) {
        var face = [];
        type = faces[offset++];

        isQuad = isBitSet(type, 0);
        hasMaterial = isBitSet(type, 1);
        hasFaceUv = isBitSet(type, 2);
        hasFaceVertexUv = isBitSet(type, 3);
        hasFaceNormal = isBitSet(type, 4);
        hasFaceVertexNormal = isBitSet(type, 5);
        hasFaceColor = isBitSet(type, 6);
        hasFaceVertexColor = isBitSet(type, 7);

        if (isQuad) {
            face.push(faces[offset++]);
            face.push(faces[offset++]);
            face.push(faces[offset++]);
            face.push(faces[offset++]);
            nVertices = 4;
        } else {
            face.push(faces[offset++]);
            face.push(faces[offset++]);
            face.push(faces[offset++]);
            nVertices = 3;
        }

        if (hasMaterial) {
            offset++;
        }

        if (hasFaceUv) {
            for (var _i = 0; _i < nUvLayers; _i++) {
                offset++;
            }
        }

        if (hasFaceVertexUv) {
            for (var _i2 = 0; _i2 < nUvLayers; _i2++) {
                for (var j = 0; j < nVertices; j++) {
                    offset++;
                }
            }
        }

        if (hasFaceNormal) {
            offset++;
        }

        if (hasFaceVertexNormal) {
            for (var _i3 = 0; _i3 < nVertices; _i3++) {
                offset++;
            }
        }

        if (hasFaceColor) {
            offset++;
        }

        if (hasFaceVertexColor) {
            for (var _i4 = 0; _i4 < nVertices; _i4++) {
                offset++;
            }
        }
        doneFaces.push(face);
    }
    return doneFaces;
};

HitmapLoader.prototype.addVerticesToFaces = function (vertices, faces) {
    for (var i = 0, l = faces.length; i < l; i++) {
        var face = faces[i];
        for (var j = 0, fl = face.length; j < fl; j++) {
            face[j] = [vertices[face[j] * 3], vertices[face[j] * 3 + 1], vertices[face[j] * 3 + 2]];
        }
    }
};

module.exports = HitmapLoader;

},{}],71:[function(require,module,exports){
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

},{}],72:[function(require,module,exports){
'use strict';

var ModelList = {
    models: ['/models/ship.json', '/models/ravier.json', '/models/ravier_gunless.json', '/models/drone.json', '/models/sniper.json', '/models/orbot.json', '/models/chunk.json', '/models/telering_bottom.json', '/models/telering_top.json', '/models/levels/startmenu.json', '/models/lasgun.json', '/models/plasmagun.json', '/models/pulsewavegun.json', '/models/hudMaterial.json', '/models/flatHudMaterial.json']
};

module.exports = ModelList;

},{}],73:[function(require,module,exports){
'use strict';

function ModelLoader() {
    this.batch = {};
    EventEmitter.apply(this, arguments);
}

ModelLoader.extend(EventEmitter);

ModelLoader.prototype.loadModels = function (modelPaths) {
    var _this = this;

    if (!modelPaths) throw "ERROR: No model paths have been specified for the loader!";
    var loader = new THREE.JSONLoader();

    Promise.all(modelPaths.map(function (modelPath) {
        return new Promise(function (resolve, reject) {
            loader.load(modelPath, function (geometry, material) {
                _this.batch[_this.getModelName(modelPath)] = {
                    geometry: geometry,
                    material: material
                };
                resolve();
            }, function () {}, function () {});
        });
    })).then(this.doneAction.bind(this));
};

ModelLoader.prototype.getBatch = function () {
    return this.batch;
};

ModelLoader.prototype.clearBatch = function () {
    this.batch = {};
};

ModelLoader.prototype.doneAction = function () {
    this.emit({ type: 'loaded' });
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

},{}],74:[function(require,module,exports){
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

},{}],75:[function(require,module,exports){
"use strict";

function SoundLoader(config) {
    config = config || {};
    Object.assign(this, config);
}

SoundLoader.prototype.loadSounds = function () {
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSound({ src: "sounds/shortzap2.wav", id: "shortzap2" });
    createjs.Sound.registerSound({ src: "sounds/blue_laser.wav", id: "blue_laser" });
    createjs.Sound.registerSound({ src: "sounds/plasmashot.wav", id: "plasmashot" });
    createjs.Sound.registerSound({ src: "sounds/plasmashot2.wav", id: "plasmashot2" });
    createjs.Sound.registerSound({ src: "sounds/plasmashot3.wav", id: "plasmashot3" });
    createjs.Sound.registerSound({ src: "sounds/plasma1.wav", id: "plasmashot4" });
    createjs.Sound.registerSound({ src: "sounds/SoundsCrate-SciFi-Laser1.wav", id: "laser_charged" });
    createjs.Sound.registerSound({ src: "sounds/SoundsCrate-SciFi-Laser1b.wav", id: "laser_short" });
    createjs.Sound.registerSound({ src: "sounds/SoundsCrate-SciFi-Laser2.wav", id: "laser_purple" });
    createjs.Sound.registerSound({ src: "sounds/matterhit3.wav", id: "matterhit3" });
    createjs.Sound.registerSound({ src: "sounds/plasmahit.wav", id: "plasmahit" });
    createjs.Sound.registerSound({ src: "sounds/molten.wav", id: "molten" });
    createjs.Sound.registerSound({ src: "sounds/debris1.wav", id: "debris1" });
    createjs.Sound.registerSound({ src: "sounds/debris2.wav", id: "debris2" });
    createjs.Sound.registerSound({ src: "sounds/debris3.wav", id: "debris3" });
    createjs.Sound.registerSound({ src: "sounds/debris4.wav", id: "debris4" });
    createjs.Sound.registerSound({ src: "sounds/debris5.wav", id: "debris5" });
    createjs.Sound.registerSound({ src: "sounds/debris6.wav", id: "debris6" });
    createjs.Sound.registerSound({ src: "sounds/debris7.wav", id: "debris7" });
    createjs.Sound.registerSound({ src: "sounds/debris8.wav", id: "debris8" });
    createjs.Sound.registerSound({ src: "sounds/drone1s1.wav", id: "drone" });
    createjs.Sound.registerSound({ src: "sounds/spiders1.wav", id: "sniper" });
    createjs.Sound.registerSound({ src: "sounds/itds3.wav", id: "orbot" });
    createjs.Sound.registerSound({ src: "sounds/spawn.wav", id: "spawn" });
    createjs.Sound.registerSound({ src: "sounds/cannon_change.wav", id: "cannon_change" });
};

module.exports = SoundLoader;

},{}],76:[function(require,module,exports){
"use strict";

var WeaponSwitcher = require("renderer/gameUi/WeaponSwitcher");
var TextSprite = require("renderer/gameUi/TextSprite");

function FlatHud(config) {
    Object.assign(this, config);

    if (!this.sceneManager) throw new Error('No sceneManager defined for FlatHud!');
    if (!this.renderer) throw new Error('No renderer defined for FlatHud!');

    this.activationKey = 'shift';
    this.switchersConfig = [{
        angle: Utils.degToRad(90),
        switchKey: 'mouseLeft'
    }, {
        angle: Utils.degToRad(-90),
        switchKey: 'mouseRight'
    }];

    this.weaponNames = {
        'lasgun': 'BURST LASER',
        'plasmagun': 'PLASMA CANNON',
        'pulsewavegun': 'PULSE WAVE GUN'
    };

    this.switchers = this.createSwitchers();
    this.weaponTextSprites = this.createWeaponTextSprites();
    this.hudActive = false;

    EventEmitter.apply(this, arguments);
}

FlatHud.extend(EventEmitter);

FlatHud.prototype.update = function () {
    var _this = this;

    if (this.actor && !this.actor.dead && this.hudActive) {
        var gameSceneCamera = this.sceneManager.get('GameScene').camera;
        var hudSceneCamera = this.sceneManager.get('FlatHudScene').camera;
        var actorPosition = Utils.objToScreenPosition(this.actor, this.renderer, gameSceneCamera);
        var coefficient = hudSceneCamera.viewWidth / document.documentElement.clientWidth / this.configManager.config.resolution;
        var positionY = -(actorPosition[1] * coefficient - hudSceneCamera.viewHeight / 2);

        this.switchers.forEach(function (switcher) {
            var offsetPosition = Utils.angleToVector(switcher.angle, 30);
            var textSprite = _this.weaponTextSprites[switcher.index];
            textSprite.position.x = offsetPosition[0];
            textSprite.position.y = positionY + offsetPosition[1];

            switcher.position = [0, positionY];
            switcher.update();
        });
    }

    this.sceneManager.render('FlatHudScene');
};

FlatHud.prototype.onPlayerActorAppeared = function (actor) {
    var _this2 = this;

    this.actor = actor;
    this.weaponTextSprites.forEach(function (textSprite) {
        _this2.sceneManager.get('FlatHudScene').threeScene.add(textSprite);
    });
};

FlatHud.prototype.createSwitchers = function () {
    var _this3 = this;

    var switcherIndex = 0;
    var switchers = [];
    this.switchersConfig.forEach(function (switcherConfig) {
        var switcher = _this3.createSwitcher(switcherConfig, switcherIndex);
        switchers.push(switcher);
        switcherIndex++;
    });
    return switchers;
};

FlatHud.prototype.createWeaponTextSprites = function () {
    var _this4 = this;

    var switcherIndex = 0;
    var weaponTextSprites = [];
    this.switchersConfig.forEach(function (switcherConfig) {
        var weaponTextSprite = _this4.createWeaponTextSprite(switcherConfig, switcherIndex);
        weaponTextSprites.push(weaponTextSprite);
        switcherIndex++;
    });
    return weaponTextSprites;
};

FlatHud.prototype.onInput = function (inputState) {
    var _this5 = this;

    this.hudActive = !!inputState[this.activationKey];
    this.switchers.forEach(function (switcher) {
        switcher.handleInput(inputState);
    });

    this.weaponTextSprites.forEach(function (textSprite) {
        textSprite.visible = _this5.hudActive;
    });
};

FlatHud.prototype.onWeaponSwitched = function (event) {
    var changeConfig = {
        weapon: event.data.weapon,
        index: event.index
    };

    if (this.actor && !this.actor.dead) {
        this.actor.switchWeapon(changeConfig);
    }

    this.drawWeaponName(event.index, event.data.weapon);

    this.emit({
        type: 'weaponSwitched',
        data: changeConfig
    });
};

FlatHud.prototype.createSwitcher = function (switcherConfig, switcherIndex) {
    switcherConfig.sceneManager = this.sceneManager;
    switcherConfig.activationKey = this.activationKey;
    switcherConfig.index = switcherIndex;

    var switcher = new WeaponSwitcher(switcherConfig);
    switcher.on('weaponSwitched', this.onWeaponSwitched.bind(this));

    return switcher;
};

FlatHud.prototype.createWeaponTextSprite = function (switcherConfig, switcherIndex) {
    var switcherTextSprite = new TextSprite({
        visible: false,
        fontSize: 40,
        fontScale: 3,
        height: 64,
        widthMultiplier: 16
    });
    switcherTextSprite.drawMessage('');

    return switcherTextSprite;
};

FlatHud.prototype.drawWeaponName = function (switcherIndex, weaponName) {
    this.weaponTextSprites[switcherIndex].drawMessage(this.weaponNames[weaponName]);
};

module.exports = FlatHud;

},{"renderer/gameUi/TextSprite":79,"renderer/gameUi/WeaponSwitcher":81}],77:[function(require,module,exports){
'use strict';

function FlatHudCamera(config) {
    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.VIEW_ANGLE = 45;
    this.ASPECT = this.WIDTH / this.HEIGHT;
    this.NEAR = 0.1;
    this.FAR = Constants.RENDER_DISTANCE;

    config = config || {};
    Object.assign(this, config);
    THREE.PerspectiveCamera.call(this, this.VIEV_ANGLE, this.ASPECT, this.NEAR, this.FAR);

    this.rotation.reorder('ZXY');

    this.position.z = 0;
    this.rotation.x = 0;
    this.rotation.y = 0;

    this.zOffset = 60;
}
FlatHudCamera.extend(THREE.PerspectiveCamera);

FlatHudCamera.prototype.update = function () {};

module.exports = FlatHudCamera;

},{}],78:[function(require,module,exports){
'use strict';

function Hud(config) {
    Object.assign(this, config);

    if (!this.actorManager) throw new Error('No actorManager defined for Hud!');
    if (!this.particleManager) throw new Error('No particleManager defined for Hud!');

    this.defaultHpBarCount = 10;

    EventEmitter.apply(this, arguments);
}

Hud.extend(EventEmitter);

Hud.prototype.update = function () {
    if (this.actor && !this.actor.dead) {
        this.drawRadar();
        this.drawHealthBar(this.actor);
    }
};

Hud.prototype.onPlayerActorAppeared = function (actor) {
    this.actor = actor;
};

Hud.prototype.drawRadar = function () {
    for (var enemyId in this.actorManager.enemies) {
        var enemyActor = this.actorManager.enemies[enemyId];
        var angle = Utils.angleBetweenPoints(enemyActor.position, this.actor.position);
        var offsetPosition = Utils.angleToVector(angle + Math.PI, 12);

        this.drawHealthBar(enemyActor);

        this.particleManager.createParticle('particleAddHUD', {
            positionX: this.actor.position[0] + offsetPosition[0],
            positionY: this.actor.position[1] + offsetPosition[1],
            positionZ: -Constants.DEFAULT_POSITION_Z,
            colorR: 1,
            colorG: 0,
            colorB: 0,
            scale: 0.75,
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: 0,
            particleAngle: 0,
            lifeTime: 1
        });
    }
};

Hud.prototype.drawHealthBar = function (otherActor) {
    var hpPercentage = otherActor.hp / otherActor.initialHp;
    var hpBarCount = otherActor.hpBarCount || this.defaultHpBarCount;
    for (var i = 0; i < hpBarCount; i++) {
        var angle = otherActor !== this.actor ? Utils.angleBetweenPoints(otherActor.position, this.actor.position) : this.actor.angle;
        var offsetPosition = Utils.angleToVector(angle + Utils.degToRad(hpBarCount / 2 * 3) - Utils.degToRad(i * 3) + Math.PI, 8);
        this.particleManager.createParticle('particleAddHUD', {
            positionX: otherActor.position[0] + offsetPosition[0],
            positionY: otherActor.position[1] + offsetPosition[1],
            positionZ: otherActor !== this.actor ? -15 + hpBarCount : -Constants.DEFAULT_POSITION_Z,
            colorR: i >= hpPercentage * hpBarCount ? 1 : 0,
            colorG: i < hpPercentage * hpBarCount ? 1 : 0,
            colorB: 0,
            scale: 0.75,
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: 0,
            particleAngle: angle,
            lifeTime: 1,
            spriteNumber: 3
        });
    }
};

Hud.prototype.drawCrosshairs = function (actor) {
    this.particleManager.createPremade('CrosshairBlue', {
        position: actor.position,
        positionZ: actor.positionZ - Constants.DEFAULT_POSITION_Z,
        angle: actor.angle,
        angleOffset: 9,
        distance: 20
    });
    this.particleManager.createPremade('CrosshairBlue', {
        position: actor.position,
        positionZ: actor.positionZ - Constants.DEFAULT_POSITION_Z,
        angle: actor.angle,
        angleOffset: -9,
        distance: 20
    });
    this.particleManager.createPremade('CrosshairGreen', {
        position: actor.position,
        positionZ: actor.positionZ - Constants.DEFAULT_POSITION_Z,
        angle: actor.angle,
        angleOffset: 18,
        distance: 16
    });
    this.particleManager.createPremade('CrosshairGreen', {
        position: actor.position,
        positionZ: actor.positionZ - Constants.DEFAULT_POSITION_Z,
        angle: actor.angle,
        angleOffset: -18,
        distance: 16
    });
};

module.exports = Hud;

},{}],79:[function(require,module,exports){
'use strict';

function TextSprite(config) {
    config = config || {};
    config.message = config.message || '';
    config.fontSize = config.fontSize || 20;
    config.fontStyle = config.fontStyle || 'Oswald';
    config.fontScale = config.fontScale || 10;
    config.height = config.height || 64;
    config.widthMultiplier = config.widthMultiplier || 4;

    Object.assign(this, config);

    this.canvas = this.createCanvas();
    this.canvas.height = this.height;
    this.canvas.width = this.height * this.widthMultiplier;

    this.texture = new THREE.Texture(this.canvas);
    this.context = this.canvas.getContext('2d');

    this.material = new THREE.SpriteMaterial({ map: this.texture, color: 0xffffff });

    THREE.Sprite.apply(this, [this.material]);

    this.scale.x = config.fontScale * this.canvas.width / this.canvas.height;
    this.scale.y = config.fontScale;
}

TextSprite.extend(THREE.Sprite);

TextSprite.prototype.createCanvas = function () {
    return document.createElement('canvas');
};

TextSprite.prototype.drawMessage = function (message) {
    var metrics = this.context.measureText(message);
    var textWidth = metrics.width;

    var centerStartPosition = this.canvas.width / 2 - textWidth / 2;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.font = "Bold " + this.fontSize + "px " + this.fontStyle;
    this.context.fillStyle = '#00ff00';
    this.context.fillText(message, centerStartPosition, this.fontSize);
    this.texture.needsUpdate = true;
};

module.exports = TextSprite;

},{}],80:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function WeaponMesh(config) {
    BaseMesh.apply(this, arguments);
    config = config || {};

    config.angleOffset = Math.PI;
    config.weaponIndex = config.weaponIndex || 0;
    config.angle = config.angle || 0;

    Object.assign(this, config);

    if (!this.weaponModels) throw new Error('No weaponModels defined for WeaponMesh!');

    this.material = ModelStore.get('hudMaterial').material;
    this.geometry = ModelStore.get(this.weaponModels[this.weaponIndex]).geometry;
    this.visible = false;
    this.castShadow = false;
    this.receiveShadow = false;
    this.scale.x = config.scale || 1;
    this.scale.y = config.scale || 1;
    this.scale.z = config.scale || 1;
}

WeaponMesh.extend(BaseMesh);

WeaponMesh.prototype.setNewWeapon = function (newWeaponIndex) {
    this.weaponIndex = newWeaponIndex;
    this.geometry = ModelStore.get(this.weaponModels[this.weaponIndex]).geometry;
};

module.exports = WeaponMesh;

},{"renderer/actor/component/mesh/BaseMesh":45,"renderer/assetManagement/model/ModelStore":74}],81:[function(require,module,exports){
'use strict';

var WeaponMesh = require("renderer/gameUi/WeaponMesh");

function WeaponSwitcher(config) {
    Object.assign(this, config);
    if (!this.sceneManager) throw new Error('No sceneManager defined for WeaponSwitcher!');

    this.visible = false;
    this.itemRotation = 0;
    this.position = [0, 0];

    this.weapons = ['plasmagun', 'lasgun', 'pulsewavegun'];
    this.moveCounter = 0;
    this.weaponsToDisplay = 5;
    this.currentWeapon = Math.floor(this.weaponsToDisplay / 2); //the middle one
    this.meshDistance = 24;
    this.angleSpeed = 3;
    this.hidePassed = true;
    EventEmitter.apply(this, arguments);

    this.switchWeaponToNext();
}

WeaponSwitcher.extend(EventEmitter);

WeaponSwitcher.prototype.update = function () {
    var _this = this;

    if (!this.meshes) {
        this.meshes = this.createMeshes();
    }

    this.meshes.forEach(function (mesh) {
        var offsetPosition = Utils.angleToVector(_this.angle + Utils.degToRad(mesh.angleDistance), 15);
        var scale = (_this.weaponsToDisplay * _this.meshDistance - 1.5 * Math.abs(mesh.angleDistance)) / (_this.weaponsToDisplay * _this.meshDistance) * 1.5;
        scale = scale > 0 ? scale : 0.2;
        mesh.position.x = _this.position[0] + offsetPosition[0];
        mesh.position.y = _this.position[1] + offsetPosition[1];
        mesh.rotation.z = Utils.degToRad(mesh.angleDistance);
        mesh.scale.x = scale;
        mesh.scale.y = scale;
        mesh.scale.z = scale;

        if (_this.moveCounter > 0) {
            mesh.angleDistance -= _this.angleSpeed;
        }

        if (mesh.angleDistance <= -(_this.weaponsToDisplay - Math.floor(_this.weaponsToDisplay / 2)) * _this.meshDistance) {
            mesh.angleDistance += _this.weaponsToDisplay * _this.meshDistance;
            var newWeaponIndex = (_this.currentWeapon + Math.floor(_this.weaponsToDisplay / 2)) % _this.weapons.length;
            mesh.weaponIndex = newWeaponIndex;
            mesh.setNewWeapon(newWeaponIndex);
        }
    });

    if (this.moveCounter > 0) {
        this.moveCounter--;
    }
};

WeaponSwitcher.prototype.handleInput = function (inputState) {
    var _this2 = this;

    var hudActive = !!inputState[this.activationKey];
    this.visible = hudActive;
    if (this.meshes) {
        this.meshes.forEach(function (mesh) {
            mesh.visible = _this2.visible;
        });
    }

    if (hudActive && inputState[this.switchKey] && this.moveCounter === 0) {
        this.switchWeaponToNext();
    }
};

//more like something like switchTo..?
WeaponSwitcher.prototype.switchWeaponToNext = function () {
    var oldWeapon = this.weapons[this.currentWeapon];
    this.currentWeapon++;
    this.moveCounter = this.meshDistance / this.angleSpeed;

    if (this.currentWeapon >= this.weapons.length) {
        this.currentWeapon = 0;
    }

    this.emit({ type: 'weaponSwitched', data: {
            weapon: this.weapons[this.currentWeapon] },
        index: this.index
    });
};

WeaponSwitcher.prototype.createMeshes = function () {
    var scale = 2;
    var meshes = [];

    for (var i = 0; i < this.weaponsToDisplay; i++) {
        var offset = (-parseInt(this.weaponsToDisplay / 2) + i) * this.meshDistance;
        var mesh = new WeaponMesh({
            angleDistance: offset,
            weaponIndex: i % this.weapons.length,
            weaponModels: this.weapons
        });
        meshes.push(mesh);
        this.sceneManager.get('FlatHudScene').threeScene.add(mesh);
    }

    return meshes;
};

module.exports = WeaponSwitcher;

},{"renderer/gameUi/WeaponMesh":80}],82:[function(require,module,exports){
'use strict';

function ChunkMesh(config) {
    config = config || {};

    config.geometry.dynamic = false;

    THREE.Mesh.apply(this, [config.geometry, config.material]);

    this.receiveShadow = true;
    this.castShadow = true;
    this.matrixAutoUpdate = false;

    Object.assign(this, config);

    this.rotation.x = Utils.degToRad(90);
    this.updateMatrix();
}

ChunkMesh.extend(THREE.Mesh);

ChunkMesh.prototype.setPosition = function (position2d) {
    if (!position2d || position2d.length !== 2) throw new Error('No or invalid position2d array specified for ChunkMesh.setPosition!');
    this.position.x = position2d[0] * Constants.CHUNK_SIZE;
    this.position.y = position2d[1] * Constants.CHUNK_SIZE;
    this.updateMatrix();
};

ChunkMesh.prototype.setRotation = function (rotation) {
    if (typeof rotation === 'undefined') throw new Error('No rotation specified for ChunkMesh.setRotation!');
    this.rotation.y = Utils.degToRad(rotation);
    this.updateMatrix();
};

module.exports = ChunkMesh;

},{}],83:[function(require,module,exports){
"use strict";

var ParticleShaders = require("renderer/particleSystem/ParticleShaders");

function ParticleConfigBuilder(config) {
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
                map: { type: "t", value: new THREE.TextureLoader().load(window.location.href + "gfx/shaderSpriteAdd.png") },
                time: { type: "f", value: 1.0 },
                spriteSheetLength: { type: "f", value: 8.0 }
            },
            vertexShader: ParticleShaders.vertexShaderSpriteSheet,
            fragmentShader: ParticleShaders.fragmentShaderSpriteSheet,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        }),
        particleAddHUD: new THREE.ShaderMaterial({
            uniforms: {
                map: { type: "t", value: new THREE.TextureLoader().load(window.location.href + "gfx/shaderSpriteAdd.png") },
                time: { type: "f", value: 1.0 },
                spriteSheetLength: { type: "f", value: 8.0 }
            },
            vertexShader: ParticleShaders.vertexShaderSpriteSheet,
            fragmentShader: ParticleShaders.fragmentShaderSpriteSheet,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false
        })
    };

    this.particleGeneratorConfig = {
        smokePuffAlpha: {
            material: this.particleMaterialConfig.smokePuffAlpha,
            maxParticles: 1000,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient
        },
        particleAdd: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 8000,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient
        },
        particleAddHUD: {
            material: this.particleMaterialConfig.particleAddHUD,
            maxParticles: 500,
            positionZ: 20,
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

ParticleConfigBuilder.prototype.buildPremades = function () {
    return {
        BlueSparks: require("renderer/particleSystem/premade/BlueSparks"),
        BlueLaserTrail: require("renderer/particleSystem/premade/BlueLaserTrail"),
        OrangeTrail: require("renderer/particleSystem/premade/OrangeTrail"),
        OrangeBoomTiny: require("renderer/particleSystem/premade/OrangeBoomTiny"),
        GreenTrail: require("renderer/particleSystem/premade/GreenTrail"),
        GreenBoomTiny: require("renderer/particleSystem/premade/GreenBoomTiny"),
        EngineGlowMedium: require("renderer/particleSystem/premade/EngineGlowMedium"),
        EngineGlowSmall: require("renderer/particleSystem/premade/EngineGlowSmall"),
        OrangeBoomLarge: require("renderer/particleSystem/premade/OrangeBoomLarge"),
        SmokePuffSmall: require("renderer/particleSystem/premade/SmokePuffSmall"),
        OrangeBoomMedium: require("renderer/particleSystem/premade/OrangeBoomMedium"),
        RedLaserTrail: require("renderer/particleSystem/premade/RedLaserTrail"),
        RedSparks: require("renderer/particleSystem/premade/RedSparks"),
        RedEye: require("renderer/particleSystem/premade/RedEye"),
        RedEyeBig: require("renderer/particleSystem/premade/RedEyeBig"),
        PurpleEye: require("renderer/particleSystem/premade/PurpleEye"),
        PurpleLaserTrail: require("renderer/particleSystem/premade/PurpleLaserTrail"),
        PurpleSparks: require("renderer/particleSystem/premade/PurpleSparks"),
        CrosshairBlue: require("renderer/particleSystem/premade/CrosshairBlue"),
        CrosshairGreen: require("renderer/particleSystem/premade/CrosshairGreen")
    };
};

module.exports = ParticleConfigBuilder;

},{"renderer/particleSystem/ParticleShaders":86,"renderer/particleSystem/premade/BlueLaserTrail":87,"renderer/particleSystem/premade/BlueSparks":88,"renderer/particleSystem/premade/CrosshairBlue":89,"renderer/particleSystem/premade/CrosshairGreen":90,"renderer/particleSystem/premade/EngineGlowMedium":91,"renderer/particleSystem/premade/EngineGlowSmall":92,"renderer/particleSystem/premade/GreenBoomTiny":93,"renderer/particleSystem/premade/GreenTrail":94,"renderer/particleSystem/premade/OrangeBoomLarge":95,"renderer/particleSystem/premade/OrangeBoomMedium":96,"renderer/particleSystem/premade/OrangeBoomTiny":97,"renderer/particleSystem/premade/OrangeTrail":98,"renderer/particleSystem/premade/PurpleEye":99,"renderer/particleSystem/premade/PurpleLaserTrail":100,"renderer/particleSystem/premade/PurpleSparks":101,"renderer/particleSystem/premade/RedEye":102,"renderer/particleSystem/premade/RedEyeBig":103,"renderer/particleSystem/premade/RedLaserTrail":104,"renderer/particleSystem/premade/RedSparks":105,"renderer/particleSystem/premade/SmokePuffSmall":106}],84:[function(require,module,exports){
'use strict';

function ParticleGenerator(config) {
    THREE.Points.apply(this, arguments);

    config = config || {};
    config.positionZ = config.positionZ || 10;
    config.maxParticles = config.maxParticles || 100;
    config.resolutionCoefficient = config.resolutionCoefficient || 1;

    config.positionHiddenFromView = 100000;

    Object.assign(this, config);

    this.position.z = config.positionZ;

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
    var colors = new Float32Array(this.maxParticles * 3);
    var speeds = new Float32Array(this.maxParticles * 3);
    var alphas = new Float32Array(this.maxParticles * 2);
    var configs = new Float32Array(this.maxParticles * 4);

    for (var i = 0; i < this.maxParticles; i++) {
        vertices[i * 3 + 0] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
        vertices[i * 3 + 1] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
        vertices[i * 3 + 2] = 0;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('speed', new THREE.BufferAttribute(speeds, 3));
    geometry.addAttribute('alpha', new THREE.BufferAttribute(alphas, 2));
    geometry.addAttribute('configs', new THREE.BufferAttribute(configs, 4));

    this.positionHandle = geometry.attributes.position.array;
    this.alphaHandle = geometry.attributes.alpha.array;
    this.colorHandle = geometry.attributes.color.array;
    this.speedHandle = geometry.attributes.speed.array;
    this.configsHandle = geometry.attributes.configs.array;

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
    this.material.uniforms.pixelRatio = Math.round(window.devicePixelRatio * 10) / 10 || 0.1;

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.speed.needsUpdate = true;
    this.geometry.attributes.alpha.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.configs.needsUpdate = true;

    this.frameResolution = this.resolutionCoefficient * 1 / window.devicePixelRatio;
};

ParticleGenerator.prototype.initParticle = function (particleId, config) {
    var particle3 = particleId * 3;
    var offsetPosition = Utils.angleToVector(config.particleAngle, config.particleVelocity);
    this.positionHandle[particle3] = config.positionX;
    this.positionHandle[particle3 + 1] = config.positionY;
    this.positionHandle[particle3 + 2] = config.positionZ || 0;
    this.colorHandle[particle3] = config.colorR;
    this.colorHandle[particle3 + 1] = config.colorG;
    this.colorHandle[particle3 + 2] = config.colorB;
    this.alphaHandle[particleId * 2] = config.alpha;
    this.alphaHandle[particleId * 2 + 1] = config.alphaMultiplier;
    this.speedHandle[particle3] = offsetPosition[0];
    this.speedHandle[particle3 + 1] = offsetPosition[1];
    this.speedHandle[particle3 + 2] = config.speedZ || 0;
    this.configsHandle[particleId * 4] = config.scale * this.frameResolution;
    this.configsHandle[particleId * 4 + 1] = this.tick;
    this.configsHandle[particleId * 4 + 2] = config.lifeTime;
    this.configsHandle[particleId * 4 + 3] = config.spriteNumber || 0;
};

ParticleGenerator.prototype.updateResolutionCoefficient = function (resolutionCoefficient) {
    this.resolutionCoefficient = resolutionCoefficient;
};

module.exports = ParticleGenerator;

},{}],85:[function(require,module,exports){
"use strict";

var ParticleConfigBuilder = require("renderer/particleSystem/ParticleConfigBuilder");
var ParticleGenerator = require("renderer/particleSystem/ParticleGenerator");

function ParticleManager(config) {
    config = config || {};
    Object.assign(this, config);

    this.configBuilder = new ParticleConfigBuilder(config);
    this.configs = this.configBuilder.getAllConfigs();
    this.generators = {};
    this.premades = this.buildPremadeGenerators();

    if (!this.sceneManager) throw new Error('No sceneManager for Renderer ParticleManager!');
}

ParticleManager.prototype.buildGenerators = function () {
    var _this = this;

    Object.keys(this.configs).forEach(function (configName) {
        var generator = new ParticleGenerator(_this.configs[configName]);
        _this.generators[configName] = generator;
        _this.sceneManager.get('GameScene').add(generator);
    });
};

ParticleManager.prototype.buildPremadeGenerators = function () {
    return this.configBuilder.buildPremades();
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

ParticleManager.prototype.createPremade = function (premadeName, config) {
    config.particleManager = this;
    this.premades[premadeName](config);
};

ParticleManager.prototype.updateResolutionCoefficient = function (coefficient) {
    for (var typeName in this.generators) {
        this.generators[typeName].updateResolutionCoefficient(coefficient);
    }
};

module.exports = ParticleManager;

},{"renderer/particleSystem/ParticleConfigBuilder":83,"renderer/particleSystem/ParticleGenerator":84}],86:[function(require,module,exports){
"use strict";

var ParticleShaders = {
    vertexShader: " \
        attribute vec2 alpha; \
        attribute vec3 speed; \
        attribute float alphaMultiplier; \
        attribute vec3 color; \
        attribute vec3 configs; \
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
            if ((time - configs[1]) <= configs[2]){ \
                vAlpha = alpha.x * pow(alpha.y, (time - configs[1])); \
                vColor = color; \
                vPosition = position; \
                vPosition.x += speed.x * (time - configs[1]); \
                vPosition.y += speed.y * (time - configs[1]); \
                vPosition.z += speed.z * (time - configs[1]); \
                mvPosition = modelViewMatrix * vec4( vPosition, 1.0 ); \
                gl_PointSize = configs[0] * (1000.0 / - mvPosition.z);  \
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
    ",

    vertexShaderSpriteSheet: " \
        attribute vec2 alpha; \
        attribute vec3 speed; \
        attribute float alphaMultiplier; \
        attribute vec3 color; \
        attribute vec4 configs; \
        \
        varying float vAlpha; \
        varying vec3 vColor; \
        varying vec2 textureCoord; \
        varying vec2 textureSize; \
        \
        uniform float time; \
        uniform float textureCoordPointSize; \
        uniform float spriteSheetLength; \
        \
        attribute float type;\
        \
        void main() { \
            vec4 mvPosition; \
            vec3 vPosition; \
            if ((time - configs[1]) <= configs[2]){ \
                vAlpha = alpha.x * pow(alpha.y, (time - configs[1])); \
                vColor = color; \
                vPosition = position; \
                vPosition.x += speed.x * (time - configs[1]); \
                vPosition.y += speed.y * (time - configs[1]); \
                vPosition.z += speed.z * (time - configs[1]); \
                mvPosition = modelViewMatrix * vec4( vPosition, 1.0 ); \
                gl_PointSize = configs[0] * (1000.0 / - mvPosition.z);  \
            } \
            gl_Position = projectionMatrix * mvPosition; \
            textureCoord = vec2((1.0 / spriteSheetLength) * configs[3], 0.0); \
            textureSize = vec2(1.0 / spriteSheetLength, 1.0); \
        }",

    fragmentShaderSpriteSheet: " \
        uniform sampler2D map; \
        varying vec3 vColor; \
        varying float vAlpha; \
        varying mediump vec2 textureCoord; \
        varying mediump vec2 textureSize; \
        void main() { \
            float sin_factor = sin(0.02); \
            float cos_factor = cos(0.02); \
            mediump vec2 realTexCoord = textureCoord + (gl_PointCoord * textureSize); \
            mediump vec4 fragColor = texture2D(map, realTexCoord); \
            gl_FragColor = vec4(vColor, vAlpha) * fragColor; \
        } \
    "
};

module.exports = ParticleShaders;

},{}],87:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    for (var i = 0; i < 44; i++) {
        var offsetPosition = Utils.angleToVector(config.angle, -i * 0.6);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + offsetPosition[0],
            positionY: config.position[1] + offsetPosition[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 1,
            alpha: 1 - 0.05 * i,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleAngle: config.angle,
            lifeTime: 1
        });
    }

    for (var _i = 0; _i < 15; _i++) {
        var _offsetPosition = Utils.angleToVector(config.angle, -_i * 1.8);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + _offsetPosition[0],
            positionY: config.position[1] + _offsetPosition[1],
            colorR: 0.3,
            colorG: 0.3,
            colorB: 1,
            scale: 5,
            alpha: 0.7 - 0.1 * _i,
            alphaMultiplier: 0.6,
            particleVelocity: 2,
            particleAngle: config.angle,
            lifeTime: 1
        });
    }
};

},{}],88:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    for (var i = 0; i < 30; i++) {
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0],
            positionY: config.position[1],
            colorR: 0.8,
            colorG: 0.8,
            colorB: 1,
            scale: 0.75,
            alpha: 1,
            alphaMultiplier: 0.94,
            particleVelocity: Utils.rand(5, 8) / 10,
            particleAngle: Utils.rand(0, 360),
            speedZ: Utils.rand(-50, 50) / 100,
            lifeTime: Utils.rand(10, 20)
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
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

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 0.8,
        colorG: 0.8,
        colorB: 1,
        scale: 2,
        alpha: 1,
        alphaMultiplier: 0.9,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 60
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
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

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 0.3,
        colorG: 0.3,
        colorB: 1,
        scale: 8,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
};

},{}],89:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 0.2,
        colorG: 0.4,
        colorB: 1,
        scale: 2,
        alpha: 1,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1,
        spriteNumber: 1
    });
};

},{}],90:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 0.2,
        colorG: 1,
        colorB: 0.6,
        scale: 2,
        alpha: 1,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1,
        spriteNumber: 1
    });
};

},{}],91:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 0.5,
        colorG: 0.6,
        colorB: 1,
        scale: Utils.rand(10, 15),
        alpha: 0.4,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: Utils.rand(3, 4),
        alpha: 1,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1
    });
};

},{}],92:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 0.5,
        colorG: 0.6,
        colorB: 1,
        scale: Utils.rand(6, 11),
        alpha: 0.4,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: Utils.rand(2, 3),
        alpha: 1,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1
    });
};

},{}],93:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    for (var i = 0; i < 20; i++) {
        config.particleManager.createParticle('smokePuffAlpha', {
            positionX: config.position[0] + Utils.rand(-1, 1),
            positionY: config.position[1] + Utils.rand(-1, 1),
            positionZ: config.positionZ + Utils.rand(-1, 1),
            colorR: 0.8,
            colorG: 1,
            colorB: 0.85,
            scale: Utils.rand(1, 3),
            alpha: 0.6,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0, 1) / 10,
            particleAngle: Utils.rand(0, 360),
            speedZ: Utils.rand(-10, 10) / 100,
            lifeTime: 60
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
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

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
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

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 0.8,
        colorG: 1,
        colorB: 0.85,
        scale: 15,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
};

},{}],94:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    for (var i = 0; i < 5; i++) {
        var offsetPosition = Utils.angleToVector(config.angle, -i * 0.7);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + offsetPosition[0],
            positionY: config.position[1] + offsetPosition[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 2.2 - 0.4 * i,
            alpha: 1 - 0.19 * i,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleAngle: config.angle,
            lifeTime: 1
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 0.3,
        colorG: 1,
        colorB: 0.5,
        scale: Utils.rand(4, 10),
        alpha: 0.5,
        alphaMultiplier: 0.6,
        particleVelocity: 1,
        particleAngle: config.angle,
        lifeTime: 2
    });
};

},{}],95:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    for (var i = 0; i < 100; i++) {
        config.particleManager.createParticle('smokePuffAlpha', {
            positionX: config.position[0] + Utils.rand(-2, 2),
            positionY: config.position[1] + Utils.rand(-2, 2),
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

    for (var _i = 0; _i < 60; _i++) {
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0],
            positionY: config.position[1],
            colorR: 1,
            colorG: 0.8,
            colorB: 0.5,
            scale: 1.2,
            alpha: 1,
            alphaMultiplier: 0.94,
            particleVelocity: Utils.rand(1, 20) / 10,
            particleAngle: Utils.rand(0, 360),
            speedZ: Utils.rand(-50, 50) / 100,
            lifeTime: Utils.rand(10, 50)
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 250,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 50,
        alpha: 1,
        alphaMultiplier: 0.95,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 80
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
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

},{}],96:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    for (var i = 0; i < 100; i++) {
        config.particleManager.createParticle('smokePuffAlpha', {
            positionX: config.position[0] + Utils.rand(-2, 2),
            positionY: config.position[1] + Utils.rand(-2, 2),
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

    for (var _i = 0; _i < 40; _i++) {
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0],
            positionY: config.position[1],
            colorR: 1,
            colorG: 0.8,
            colorB: 0.5,
            scale: 1.2,
            alpha: 1,
            alphaMultiplier: 0.94,
            particleVelocity: Utils.rand(1, 20) / 10,
            particleAngle: Utils.rand(0, 360),
            speedZ: Utils.rand(-50, 50) / 100,
            lifeTime: Utils.rand(10, 50)
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 220,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 50,
        alpha: 1,
        alphaMultiplier: 0.95,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 80
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
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

},{}],97:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    for (var i = 0; i < 5; i++) {
        config.particleManager.createParticle('smokePuffAlpha', {
            positionX: config.position[0] + Utils.rand(-2, 2),
            positionY: config.position[1] + Utils.rand(-2, 2),
            positionZ: config.positionZ + Utils.rand(-2, 2),
            colorR: 1,
            colorG: 0.8,
            colorB: 0.73,
            scale: Utils.rand(1, 3),
            alpha: 0.6,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0, 1) / 10,
            particleAngle: Utils.rand(0, 360),
            speedZ: Utils.rand(-10, 10) / 100,
            lifeTime: 60
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
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

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
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

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 0.8,
        colorB: 0.73,
        scale: 10,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
};

},{}],98:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    for (var i = 0; i < 3; i++) {
        var offsetPosition = Utils.angleToVector(config.angle, -i * 0.6);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0],
            positionY: config.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 1.5,
            alpha: 1,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleAngle: config.angle,
            lifeTime: 1,
            spriteNumber: 2
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 0.3,
        colorB: 0.1,
        scale: Utils.rand(5, 11),
        alpha: 0.8,
        alphaMultiplier: 0.6,
        particleVelocity: 1,
        particleAngle: config.angle,
        lifeTime: 1
    });
};

},{}],99:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 1,
        colorG: 0,
        colorB: 1,
        scale: 5,
        alpha: 0.2,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1,
        spriteNumber: 3
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 1,
        colorG: 0.2,
        colorB: 1,
        scale: 1.5,
        alpha: 1,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1
    });
};

},{}],100:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    for (var i = 0; i < 15; i++) {
        var offsetPosition = Utils.angleToVector(config.angle, -i * 0.6);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + offsetPosition[0],
            positionY: config.position[1] + offsetPosition[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 1,
            alpha: 1 - 0.05 * i,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleAngle: config.angle,
            lifeTime: 1
        });
    }

    for (var _i = 0; _i < 5; _i++) {
        var _offsetPosition = Utils.angleToVector(config.angle, -_i * 1.8);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + _offsetPosition[0],
            positionY: config.position[1] + _offsetPosition[1],
            colorR: 1,
            colorG: 0.3,
            colorB: 1,
            scale: 5,
            alpha: 0.7 - 0.1 * _i,
            alphaMultiplier: 0.6,
            particleVelocity: 2,
            particleAngle: config.angle,
            lifeTime: 1
        });
    }
};

},{}],101:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    for (var i = 0; i < 30; i++) {
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0],
            positionY: config.position[1],
            colorR: 1,
            colorG: 0.8,
            colorB: 1,
            scale: 0.75,
            alpha: 1,
            alphaMultiplier: 0.94,
            particleVelocity: Utils.rand(5, 8) / 10,
            particleAngle: Utils.rand(0, 360),
            speedZ: Utils.rand(-50, 50) / 100,
            lifeTime: Utils.rand(10, 20)
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
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

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 0.8,
        colorB: 1,
        scale: 2,
        alpha: 1,
        alphaMultiplier: 0.9,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 60
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
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

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 0.3,
        colorB: 1,
        scale: 8,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
};

},{}],102:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 1,
        colorG: 0,
        colorB: 0,
        scale: Utils.rand(45, 50) / 10,
        alpha: 0.3,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 1,
        colorG: 0.2,
        colorB: 0.2,
        scale: 1,
        alpha: 0.8,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1
    });
};

},{}],103:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 1,
        colorG: 0,
        colorB: 0,
        scale: 2.5,
        alpha: 0.3,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 1,
        colorG: 0.2,
        colorB: 0.2,
        scale: 5,
        alpha: 1,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1
    });
};

},{}],104:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    for (var i = 0; i < 15; i++) {
        var offsetPosition = Utils.angleToVector(config.angle, -i * 0.6);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + offsetPosition[0],
            positionY: config.position[1] + offsetPosition[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 1,
            alpha: 1 - 0.05 * i,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleAngle: config.angle,
            lifeTime: 1
        });
    }

    for (var _i = 0; _i < 5; _i++) {
        var _offsetPosition = Utils.angleToVector(config.angle, -_i * 1.8);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + _offsetPosition[0],
            positionY: config.position[1] + _offsetPosition[1],
            colorR: 1,
            colorG: 0.3,
            colorB: 0.3,
            scale: 5,
            alpha: 0.7 - 0.1 * _i,
            alphaMultiplier: 0.6,
            particleVelocity: 2,
            particleAngle: config.angle,
            lifeTime: 1
        });
    }
};

},{}],105:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    for (var i = 0; i < 30; i++) {
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0],
            positionY: config.position[1],
            colorR: 1,
            colorG: 0.8,
            colorB: 0.8,
            scale: 0.75,
            alpha: 1,
            alphaMultiplier: 0.94,
            particleVelocity: Utils.rand(5, 8) / 10,
            particleAngle: Utils.rand(0, 360),
            speedZ: Utils.rand(-50, 50) / 100,
            lifeTime: Utils.rand(10, 20)
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
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

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 0.8,
        colorB: 0.8,
        scale: 2,
        alpha: 1,
        alphaMultiplier: 0.9,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 60
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
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

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 0.3,
        colorB: 0.3,
        scale: 8,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
};

},{}],106:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    config.particleManager.createParticle('smokePuffAlpha', {
        positionX: config.position[0] + Utils.rand(-2, 2),
        positionY: config.position[1] + Utils.rand(-2, 2),
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: Utils.rand(2, 5),
        alpha: Utils.rand(0, 3) / 10 + 0.1,
        alphaMultiplier: 0.95,
        particleVelocity: Utils.rand(0, 10) / 100,
        particleAngle: Utils.rand(0, 360),
        speedZ: Utils.rand(0, 10) / 100,
        lifeTime: 120
    });
};

},{}],107:[function(require,module,exports){
"use strict";

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function BaseScene(config) {
    Object.assign(this, config);

    if (!this.renderer) {
        throw new Error('No renderer specified for a Scene!');
    }

    this.camera = this.createCamera();
    this.threeScene = this.createThreeScene(this.camera);
    this.threeScene.add(this.camera);
}

BaseScene.prototype.add = function (object) {
    this.threeScene.add(object);
};

BaseScene.prototype.update = function () {
    this.camera.update();
    this.customUpdate();
};

BaseScene.prototype.createCamera = function () {
    throw new Error('Attempting to use default (empty) camera constructor for Scene!');
};

BaseScene.prototype.create = function () {
    throw new Error('Attempting to use default (empty) create function for Scene!');
};

BaseScene.prototype.createThreeScene = function () {
    return new THREE.Scene();
};

BaseScene.prototype.addPlayerActor = function (actor) {};
BaseScene.prototype.customUpdate = function () {};
BaseScene.prototype.resetCamera = function () {};
BaseScene.prototype.doUiFlash = function () {};

BaseScene.prototype.testMesh = function (meshClass, scale) {
    scale = scale || 1;
    var mesh = new BaseMesh({
        geometry: ModelStore.get(meshClass).geometry,
        material: ModelStore.get(meshClass).material
    });
    mesh.scale.x = scale;
    mesh.scale.y = scale;
    mesh.scale.z = scale;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.threeScene.add(mesh);

    setInterval(function () {
        mesh.rotation.z += 0.001;
    }, 5);

    return mesh;
};

module.exports = BaseScene;

},{"renderer/actor/component/mesh/BaseMesh":45,"renderer/assetManagement/model/ModelStore":74}],108:[function(require,module,exports){
"use strict";

var BaseScene = require("renderer/scene/BaseScene");
var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");
var FlatHudCamera = require("renderer/gameUi/FlatHudCamera");

function FlatHudScene(config) {
    Object.assign(this, config);
    BaseScene.apply(this, arguments);
    this.timer = 0;

    this.sceneSize = 100; //arbitrary unit, affects the size of objects appearing on scene
}

FlatHudScene.extend(BaseScene);

FlatHudScene.prototype.create = function () {
    this.createStartScene();
    this.resetCamera();
};

FlatHudScene.prototype.createCamera = function () {
    var camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0, 200);
    camera.update = function () {};
    return camera;
};

FlatHudScene.prototype.resetCamera = function () {
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;

    this.camera.right = this.sceneSize / 2;
    this.camera.left = -this.camera.right;
    this.camera.top = windowHeight / windowWidth * this.sceneSize / 2;
    this.camera.bottom = -this.camera.top;

    this.camera.viewWidth = this.sceneSize;
    this.camera.viewHeight = windowHeight / windowWidth * this.sceneSize;

    this.camera.updateProjectionMatrix();
};

FlatHudScene.prototype.redraw = function (textSprite) {
    textSprite.drawMessage(Math.random().toString(36).substring(7));
};

FlatHudScene.prototype.createStartScene = function () {};

FlatHudScene.prototype.customUpdate = function () {};

module.exports = FlatHudScene;

},{"renderer/actor/component/mesh/BaseMesh":45,"renderer/assetManagement/model/ModelStore":74,"renderer/gameUi/FlatHudCamera":77,"renderer/scene/BaseScene":107}],109:[function(require,module,exports){
"use strict";

var ChunkStore = require("renderer/assetManagement/level/ChunkStore");
var ModelStore = require("renderer/assetManagement/model/ModelStore");
var ChunkMesh = require("renderer/map/ChunkMesh");
var BaseScene = require("renderer/scene/BaseScene");
var Camera = require("renderer/Camera");

function GameScene(config) {

    if (!config.inputListener) throw new Error('no Input Listener specified for GameScene!');

    Object.assign(this, config);
    this.lightCounter = 0;

    BaseScene.apply(this, arguments);
}

GameScene.extend(BaseScene);

GameScene.prototype.create = function () {
    this.initialColor = {
        r: Utils.rand(100, 100) / 100,
        g: Utils.rand(100, 100) / 100,
        b: Utils.rand(100, 100) / 100
    };

    this.currentColor = {
        r: Utils.rand(100, 100) / 100,
        g: Utils.rand(100, 100) / 100,
        b: Utils.rand(100, 100) / 100
    };

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(0, 0, 200);
    this.directionalLight.distance = 1000;

    this.directionalLight.color = this.initialColor;

    this.directionalLight.castShadow = true;

    var shadowCamera = this.directionalLight.shadow.camera;

    shadowCamera.near = 1;
    shadowCamera.far = Constants.RENDER_DISTANCE;
    shadowCamera.left = Constants.RENDER_DISTANCE;
    shadowCamera.right = -Constants.RENDER_DISTANCE;
    shadowCamera.top = Constants.RENDER_DISTANCE;
    shadowCamera.bottom = -Constants.RENDER_DISTANCE;

    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.bias = -0.0075;

    this.threeScene.add(this.directionalLight);

    this.ambientLight = new THREE.AmbientLight(0x505050, 1);

    this.threeScene.add(this.ambientLight);

    this.threeScene.fog = new THREE.Fog(0x000000, Constants.RENDER_DISTANCE - 150, Constants.RENDER_DISTANCE);
};

GameScene.prototype.customUpdate = function () {
    if (this.actor) {
        this.directionalLight.position.x = this.actor.position[0] + 100;
        this.directionalLight.position.y = this.actor.position[1] + 100;
        this.directionalLight.target.position.x = this.actor.position[0];
        this.directionalLight.target.position.y = this.actor.position[1];
        this.directionalLight.target.updateMatrixWorld();
    }
    this.handleFlash();

    this.directionalLight.color = this.currentColor;
};

GameScene.prototype.flashRed = function () {
    this.currentColor = {
        r: this.initialColor.r + 3,
        g: this.initialColor.g,
        b: this.initialColor.b
    };
};

GameScene.prototype.flashWhite = function () {
    this.currentColor = {
        r: this.initialColor.r + 1.5,
        g: this.initialColor.g + 1.5,
        b: this.initialColor.b + 1.5
    };
};

GameScene.prototype.handleFlash = function () {
    if (this.currentColor.r > this.initialColor.r) this.currentColor.r -= 0.3;
    if (this.currentColor.g > this.initialColor.g) this.currentColor.g -= 0.3;
    if (this.currentColor.b > this.initialColor.b) this.currentColor.b -= 0.3;

    if (this.currentColor.r < this.initialColor.r) this.currentColor.r = this.initialColor.r;
    if (this.currentColor.g < this.initialColor.g) this.currentColor.g = this.initialColor.g;
    if (this.currentColor.b < this.initialColor.b) this.currentColor.b = this.initialColor.b;
};

GameScene.prototype.doUiFlash = function (type) {
    switch (type) {
        case 'red':
            this.flashRed();
            break;
        default:
            this.flashWhite();
    }
};

GameScene.prototype.createMap = function (layoutData) {
    for (var i = 0, l = layoutData.length; i < l; i++) {
        var config = layoutData[i];
        var chunk = new ChunkMesh({
            geometry: ChunkStore.get(config.name).geometry,
            material: ChunkStore.get(config.name).material
        });
        chunk.setPosition(config.position);
        chunk.setRotation(config.rotation);
        this.threeScene.add(chunk);
    }
};

GameScene.prototype.createCamera = function () {
    var camera = new Camera({ inputListener: this.inputListener });
    camera.position.z = 800;
    camera.setMovementZ(80, 20);
    camera.rotation.x = 1;
    return camera;
};

GameScene.prototype.resetCamera = function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
};

GameScene.prototype.onPlayerActorAppeared = function (actor) {
    this.camera.actor = actor;
    this.actor = actor;
};

module.exports = GameScene;

},{"renderer/Camera":36,"renderer/assetManagement/level/ChunkStore":69,"renderer/assetManagement/model/ModelStore":74,"renderer/map/ChunkMesh":82,"renderer/scene/BaseScene":107}],110:[function(require,module,exports){
"use strict";

var BaseScene = require("renderer/scene/BaseScene");
var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");
var Camera = require("renderer/Camera");

function MainMenuScene(config) {
    Object.assign(this, config);
    BaseScene.apply(this, arguments);
    this.timer = 0;
    this.lightChargeDelay = 20;
    this.lightChargeTime = 300;
}

MainMenuScene.extend(BaseScene);

MainMenuScene.prototype.create = function () {
    this.initialColor = {
        r: Utils.rand(100, 100) / 100,
        g: Utils.rand(100, 100) / 100,
        b: Utils.rand(100, 100) / 100
    };

    this.currentColor = {
        r: Utils.rand(100, 100) / 100,
        g: Utils.rand(100, 100) / 100,
        b: Utils.rand(100, 100) / 100
    };

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(50, -50, 200);
    this.directionalLight.distance = 1000;

    this.directionalLight.color = this.initialColor;

    this.directionalLight.castShadow = true;

    var shadowCamera = this.directionalLight.shadow.camera;

    shadowCamera.near = 1;
    shadowCamera.far = Constants.RENDER_DISTANCE;
    shadowCamera.left = Constants.RENDER_DISTANCE;
    shadowCamera.right = -Constants.RENDER_DISTANCE;
    shadowCamera.top = Constants.RENDER_DISTANCE;
    shadowCamera.bottom = -Constants.RENDER_DISTANCE;

    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.bias = -0.0075;

    this.threeScene.add(this.directionalLight);

    this.ambientLight = new THREE.AmbientLight(0x505050, 1);

    this.threeScene.add(this.ambientLight);

    this.createStartScene();
};

MainMenuScene.prototype.createCamera = function () {
    var camera = new Camera({ inputListener: this.inputListener });
    camera.position.y = -50;
    camera.position.z = 15;
    camera.position.x = 10;

    camera.rotation.x = 1.1;
    camera.rotation.z = 0.15;

    camera.setMovementZ(camera.position.z, 0);
    return camera;
};

MainMenuScene.prototype.resetCamera = function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
};

MainMenuScene.prototype.createStartScene = function () {

    this.sceneMaterial = ModelStore.get('startmenu').material;

    var mesh = new BaseMesh({
        geometry: ModelStore.get('startmenu').geometry,
        material: this.sceneMaterial
    });
    var scale = 0.5;
    mesh.scale.x = scale;
    mesh.scale.y = scale;
    mesh.scale.z = scale;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.rotation.x = Utils.degToRad(90);
    mesh.rotation.y = Utils.degToRad(-90);
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    this.threeScene.add(mesh);

    var shipMesh = new BaseMesh({
        geometry: ModelStore.get('ravier').geometry,
        material: ModelStore.get('ravier').material
    });

    scale = 4;
    shipMesh.scale.x = scale;
    shipMesh.scale.y = scale;
    shipMesh.scale.z = scale;
    shipMesh.castShadow = true;
    shipMesh.receiveShadow = true;
    shipMesh.rotation.z = Utils.degToRad(-120);

    shipMesh.position.z = 4;
    shipMesh.speedZ = 0.03;
    shipMesh.speedY = 0.0025;
    shipMesh.speedX = 0.002;

    this.shipMesh = shipMesh;
    this.sceneMesh = mesh;

    this.threeScene.add(shipMesh);

    this.directionalLight.intensity = 0;
    this.ambientLight.intensity = 0;
    this.sceneMaterial.emissiveIntensity = 0;
};

MainMenuScene.prototype.customUpdate = function () {
    this.doBob();
    this.lightPowerUp();
    this.doFlicker();
    this.timer++;
};

MainMenuScene.prototype.doBob = function () {
    this.shipMesh.position.z += this.shipMesh.speedZ;
    if (this.shipMesh.position.z > 4) {
        this.shipMesh.speedZ -= 0.001;
    } else {
        this.shipMesh.speedZ += 0.001;
    }

    this.shipMesh.rotation.y += this.shipMesh.speedY;
    if (this.shipMesh.rotation.y > 0) {
        this.shipMesh.speedY -= 0.0002;
    } else {
        this.shipMesh.speedY += 0.0002;
    }

    this.shipMesh.rotation.x += this.shipMesh.speedX;
    if (this.shipMesh.rotation.x > 0) {
        this.shipMesh.speedX -= 0.00015;
    } else {
        this.shipMesh.speedX += 0.00015;
    }

    this.shipMesh.rotation.z -= 0.003;
};

MainMenuScene.prototype.doFlicker = function () {
    var random = Utils.rand(0, 1000);

    if (random > 980) {
        this.directionalLight.intensity -= 0.05;
        this.ambientLight.intensity -= 0.05;
        this.sceneMaterial.emissiveIntensity -= 0.2;
    }
};

MainMenuScene.prototype.lightPowerUp = function () {
    var lightIntensity, lampIntensity;

    lightIntensity = (this.timer - this.lightChargeDelay) * (1 / this.lightChargeTime);
    lampIntensity = (this.timer - this.lightChargeDelay) * (4 / this.lightChargeTime);
    lightIntensity = Math.min(1, lightIntensity);
    lampIntensity = Math.min(1, lampIntensity);

    this.directionalLight.intensity = lightIntensity;
    this.ambientLight.intensity = lightIntensity;
    this.sceneMaterial.emissiveIntensity = lampIntensity;
};

module.exports = MainMenuScene;

},{"renderer/Camera":36,"renderer/actor/component/mesh/BaseMesh":45,"renderer/assetManagement/model/ModelStore":74,"renderer/scene/BaseScene":107}],111:[function(require,module,exports){
"use strict";

var BaseScene = require("renderer/scene/BaseScene");
var GameScene = require("renderer/scene/GameScene");
var MainMenuScene = require("renderer/scene/MainMenuScene");
var FlatHudScene = require("renderer/scene/FlatHudScene");

function SceneManager(config) {
    Object.assign(this, config);

    if (!this.renderer) {
        throw new Error('No renderer specified for SceneManager!');
    }
    if (!this.core) {
        throw new Error('No core specified for SceneManager!');
    }

    this.knownSceneClasses = {
        'GameScene': GameScene,
        'MainMenuScene': MainMenuScene,
        'FlatHudScene': FlatHudScene
    };

    this.activeScenes = {};
    EventEmitter.apply(this, arguments);
}

SceneManager.extend(EventEmitter);

SceneManager.prototype.render = function (sceneName) {
    if (!this.activeScenes[sceneName]) {
        throw new Error("No such scene for render: " + sceneName);
    }

    this.renderer.render(this.activeScenes[sceneName].threeScene, this.activeScenes[sceneName].camera);
};

SceneManager.prototype.createScene = function (sceneName, config) {
    if (!this.knownSceneClasses[sceneName]) {
        throw new Error("No such scene for createScene: " + sceneName);
    }

    var configWithRenderer = Object.assign(config || {}, { renderer: this.renderer });
    var newScene = new this.knownSceneClasses[sceneName](configWithRenderer);
    newScene.create();

    this.activeScenes[sceneName] = newScene;
};

SceneManager.prototype.update = function () {
    for (var sceneName in this.activeScenes) {
        this.activeScenes[sceneName].update();
    }
};

SceneManager.prototype.addObjectToScene = function (sceneName, object) {
    if (!this.activeScenes[sceneName]) {
        throw new Error("No such scene for addObjectToScene: " + sceneName);
    }
    this.activeScenes[sceneName].add(object);
};

SceneManager.prototype.get = function (sceneName) {
    return this.activeScenes[sceneName];
};

SceneManager.prototype.destroyScene = function (sceneName) {
    this.activeScenes[sceneName] = null;
};

SceneManager.prototype.getCoreActiveScene = function () {
    return this.activeScenes[this.core.activeScene];
};

module.exports = SceneManager;

},{"renderer/scene/BaseScene":107,"renderer/scene/FlatHudScene":108,"renderer/scene/GameScene":109,"renderer/scene/MainMenuScene":110}],112:[function(require,module,exports){
'use strict';

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InitialView = require('renderer/ui/component/InitialView');

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

    switch (newMode) {
        case 'running':
            document.getElementById('gameViewport').addClass('noPointerEvents');
            break;

    }
};

module.exports = ReactUi;

//https://blog.risingstack.com/the-react-way-getting-started-tutorial/
//http://hugogiraudel.com/2015/06/18/styling-react-component-in-sass/
//http://sass-guidelin.es/#architecture
//https://css-tricks.com/the-debate-around-do-we-even-need-css-anymore/

},{"classnames":1,"renderer/ui/component/InitialView":116}],113:[function(require,module,exports){
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

},{}],114:[function(require,module,exports){
'use strict';

var ReactUi = require('renderer/ui/ReactUi');
var PubSub = require('pubsub-js');
var Core = require('renderer/Core');

function Ui(config) {
    Object.assign(this, config);
    this.reactUi = new ReactUi();
    this.gameCore = null;

    this.assetsLoaded = false;

    this.setupButtonListener();
    EventEmitter.apply(this, arguments);
}

Ui.extend(EventEmitter);

Ui.prototype.setupButtonListener = function () {
    var _this = this;

    PubSub.subscribe('buttonClick', function (msg, data) {
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
            case 'resolutionConfig':
                _this.onResolutionConfig(data);
                break;
            case 'soundConfig':
                _this.onSoundConfig(data);
                break;
        }
    });
};

Ui.prototype.init = function () {
    if (!this.gameCore) {
        console.error("no GameCore set in UI!");
    }

    this.gameCore.init();
};

Ui.prototype.setAssetsLoaded = function (state) {
    this.assetsLoaded = state;
};

Ui.prototype.stopGame = function (info) {
    var bigText = 'GAME OVER';
    var scoreText = 'BOTS DESTROYED: ' + info.enemiesKilled;
    this.reactUi.changeMode('gameOverScreen', { scoreText: scoreText, bigText: bigText });
};

Ui.prototype.stopGameFinished = function () {
    var bigText = 'SUCCESS!';
    var scoreText = 'Congratulations! You have done it!';
    this.reactUi.changeMode('gameOverScreen', { scoreText: scoreText, bigText: bigText });
};

Ui.prototype.onStartButtonClick = function () {
    if (this.assetsLoaded) {
        this.emit({ type: 'getPointerLock' });
        this.reactUi.changeMode('helpScreen');
    }
};

Ui.prototype.gotPointerLock = function () {
    this.emit({ type: 'startGame' });
    this.reactUi.changeMode('running');
};

Ui.prototype.lostPointerLock = function () {
    this.emit({ type: 'getPointerLock' });
    this.reactUi.changeMode('helpScreen');
};

Ui.prototype.onShadowConfig = function (data) {
    this.emit({ type: 'shadowConfig', option: data.buttonEvent, value: data.state });
};

Ui.prototype.onResolutionConfig = function (data) {
    this.emit({ type: 'resolutionConfig', option: data.buttonEvent, value: data.state });
};

Ui.prototype.onSoundConfig = function (data) {
    this.emit({ type: 'soundConfig', option: data.buttonEvent, value: data.state });
};

module.exports = Ui;

},{"pubsub-js":3,"renderer/Core":39,"renderer/ui/ReactUi":112}],115:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StyledText = require('renderer/ui/component/base/StyledText');

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
                    this.props.bigText
                ),
                React.createElement(
                    StyledText,
                    { style: 'smallText' },
                    this.props.scoreText
                ),
                React.createElement(
                    StyledText,
                    { style: 'smallText' },
                    'Press F5 to restart'
                )
            );
        }
    }]);

    return EndScreen;
}(React.Component);

module.exports = EndScreen;

},{"classnames":1,"renderer/ui/component/base/StyledText":123}],116:[function(require,module,exports){
'use strict';

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StartScreen = require('renderer/ui/component/StartScreen');
var EndScreen = require('renderer/ui/component/EndScreen');
var StartHelp = require('renderer/ui/component/StartHelp');
var FullScreenEffect = require('renderer/ui/component/base/FullScreenEffect');
var Viewport = require('renderer/ui/component/base/Viewport');
var Hud = require('renderer/ui/component/hud/Hud');

var ReactUtils = require('renderer/ui/ReactUtils');

var InitialView = React.createClass({
    displayName: 'InitialView',
    render: function render() {
        var UIcontent = [];
        switch (this.props.mode || 'startScreen') {
            case 'startScreen':
                UIcontent.push(React.createElement(StartScreen, { key: ReactUtils.generateKey() }));
                break;
            case 'helpScreen':
                UIcontent.push(React.createElement(StartHelp, { key: ReactUtils.generateKey() }));
                break;
            case 'gameOverScreen':
                UIcontent.push(React.createElement(EndScreen, { key: ReactUtils.generateKey(),
                    scoreText: ReactUtils.multilinize(this.props.context.scoreText),
                    bigText: ReactUtils.multilinize(this.props.context.bigText)
                }));
                break;
        }

        var blurState = void 0;
        switch (this.props.mode) {
            case 'running':
                blurState = 'end';
                break;
            case 'gameOverScreen':
                blurState = 'start';
                break;
            default:
                blurState = 'end';
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

},{"classnames":1,"renderer/ui/ReactUtils":113,"renderer/ui/component/EndScreen":115,"renderer/ui/component/StartHelp":118,"renderer/ui/component/StartScreen":119,"renderer/ui/component/base/FullScreenEffect":121,"renderer/ui/component/base/Viewport":125,"renderer/ui/component/hud/Hud":126}],117:[function(require,module,exports){
'use strict';

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyledText = require('renderer/ui/component/base/StyledText');
var ToggleButton = require('renderer/ui/component/base/ToggleButton');
var OptionButton = require('renderer/ui/component/base/OptionButton');

var SettingsMenu = React.createClass({
    displayName: 'SettingsMenu',
    getInitialState: function getInitialState() {
        return { initialConfigs: {} };
    },
    componentWillMount: function componentWillMount() {
        var _this = this;

        PubSub.subscribe('setConfig', function (message, data) {
            _this.setState({ initialConfigs: data });
        });
    },
    render: function render() {
        return React.createElement(
            'div',
            { style: { marginTop: '100px' }, className: 'bottomCenter' },
            React.createElement(
                'div',
                { style: { width: '350px' }, className: 'centerHorizontal' },
                React.createElement(
                    'div',
                    { style: { float: 'left', marginTop: '6px' } },
                    ' ',
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('class', ['smallText', 'verticalSpacing']) },
                        React.createElement(
                            'span',
                            { className: 'textDark' },
                            'SHADOWS:'
                        )
                    ),
                    ' '
                ),
                React.createElement(
                    'div',
                    { style: { float: 'right' } },
                    ' ',
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('class', ['smallText', 'verticalSpacing']) },
                        React.createElement(OptionButton, { buttonEvent: 'shadowConfig', options: ['NONE', 'BASIC', 'SMOOTH'], value: this.state.initialConfigs.shadow })
                    ),
                    '  '
                )
            ),
            React.createElement(
                'div',
                { style: { width: '350px' }, className: 'centerHorizontal' },
                React.createElement(
                    'div',
                    { style: { float: 'left', marginTop: '12px' } },
                    ' ',
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('class', ['smallText', 'verticalSpacing']) },
                        React.createElement(
                            'span',
                            { className: 'textDark' },
                            'RESOLUTION:'
                        )
                    ),
                    ' '
                ),
                React.createElement(
                    'div',
                    { style: { float: 'right' } },
                    ' ',
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('class', ['smallText', 'verticalSpacing']) },
                        React.createElement(OptionButton, { buttonEvent: 'resolutionConfig', options: ['LOW', 'MEDIUM', 'HIGH', 'TOO HIGH'], value: this.state.initialConfigs.resolution })
                    ),
                    '  '
                )
            ),
            React.createElement(
                'div',
                { style: { width: '350px' }, className: 'centerHorizontal' },
                React.createElement(
                    'div',
                    { style: { float: 'left', marginTop: '12px' } },
                    ' ',
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('class', ['smallText', 'verticalSpacing']) },
                        React.createElement(
                            'span',
                            { className: 'textDark' },
                            'SOUND:'
                        )
                    ),
                    ' '
                ),
                React.createElement(
                    'div',
                    { style: { float: 'right' } },
                    ' ',
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('class', ['smallText', 'verticalSpacing']) },
                        React.createElement(OptionButton, { buttonEvent: 'soundConfig', options: ['OFF', 'SILENT', 'NORMAL', 'LOUD'], value: this.state.initialConfigs.soundVolume })
                    ),
                    '  '
                )
            )
        );
    }
});

module.exports = SettingsMenu;

},{"classnames":1,"renderer/ui/component/base/OptionButton":122,"renderer/ui/component/base/StyledText":123,"renderer/ui/component/base/ToggleButton":124}],118:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StyledText = require('renderer/ui/component/base/StyledText');

var StartHelp = function (_React$Component) {
    _inherits(StartHelp, _React$Component);

    function StartHelp() {
        _classCallCheck(this, StartHelp);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(StartHelp).apply(this, arguments));
    }

    _createClass(StartHelp, [{
        key: 'render',
        value: function render() {
            var versionText = 'ver. ' + (Constants.VERSION || 'LOCAL BUILD');
            return React.createElement(
                'div',
                { style: { bottom: '100px' } },
                React.createElement(
                    'div',
                    {
                        className: (0, _classnames2.default)('class', ['centerHorizontal', 'topCenter', 'verticalSpacing'])
                    },
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('mediumText') },
                        React.createElement(
                            'span',
                            null,
                            'CONTROLS:'
                        )
                    ),
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('smallText', 'textDark') },
                        React.createElement(
                            'span',
                            null,
                            'WSAD: move the ship'
                        )
                    ),
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('smallText', 'textDark') },
                        React.createElement(
                            'span',
                            null,
                            'Mouse left: fire primary weapon system'
                        )
                    ),
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('smallText', 'textDark') },
                        React.createElement(
                            'span',
                            null,
                            'Mouse right: fire secondary weapon system'
                        )
                    ),
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('smallText', 'textDark') },
                        React.createElement(
                            'span',
                            null,
                            'hold SHIFT + mouse left: change primary weapon'
                        )
                    ),
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('smallText', 'textDark') },
                        React.createElement(
                            'span',
                            null,
                            'hold SHIFT + mouse right: change secondary weapon'
                        )
                    )
                ),
                React.createElement(
                    'div',
                    {
                        className: (0, _classnames2.default)('class', ['centerHorizontal', 'bottomCenter', 'verticalSpacing'])
                    },
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('mediumText', 'textBlink') },
                        React.createElement(
                            'span',
                            null,
                            'ACCEPT POINTER LOCK!'
                        )
                    ),
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('smallText', 'textDark') },
                        React.createElement(
                            'span',
                            null,
                            'CHROME: Just click.'
                        )
                    ),
                    React.createElement(
                        StyledText,
                        { style: (0, _classnames2.default)('smallText', 'textDark') },
                        React.createElement(
                            'span',
                            null,
                            'FIREFOX: Click and accept a popup dialog.'
                        )
                    )
                ),
                React.createElement(
                    StyledText,
                    { style: (0, _classnames2.default)('class', ['smallText', 'topRightCorner']) },
                    React.createElement(
                        'span',
                        { className: 'textDark' },
                        versionText
                    )
                )
            );
        }
    }]);

    return StartHelp;
}(React.Component);

module.exports = StartHelp;

},{"classnames":1,"renderer/ui/component/base/StyledText":123}],119:[function(require,module,exports){
'use strict';

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyledText = require('renderer/ui/component/base/StyledText');
var SettingsMenu = require('renderer/ui/component/SettingsMenu');
var Button = require('renderer/ui/component/base/Button');
var ReactUtils = require('renderer/ui/ReactUtils');

var bottomText = ReactUtils.multilinize('Wingmod 2 is a little experimental project aimed at learning' + '\nand experimenting with various web technologies.\n' + '\n' + 'Please note that this project depends very heavily on WebGL, so it works best on a PC.\n' + 'No mobile support is planned as keyboard and mouse are essential, but for debug you can try it.\n' + '\n' + 'Some frameworks were surely and painfully harmed in the making of this... thing.\n');

var StartScreen = React.createClass({
    displayName: 'StartScreen',
    getInitialState: function getInitialState() {
        return { assetsLoaded: false };
    },
    componentWillMount: function componentWillMount() {
        var _this = this;

        PubSub.subscribe('assetsLoaded', function (msg, data) {
            _this.setState({ assetsLoaded: true });
        });
    },
    render: function render() {
        var versionText = 'ver. ' + (Constants.VERSION || 'LOCAL BUILD');
        var startButtonText = this.state.assetsLoaded ? 'START GAME' : 'LOADING...';
        var startClass = this.state.assetsLoaded ? '' : 'textDark';
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                {
                    className: (0, _classnames2.default)('class', ['bottomCenter', 'verticalSpacing']),
                    style: { bottom: '300px' }
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
                React.createElement(Button, { text: startButtonText, buttonEvent: 'start' }),
                React.createElement(SettingsMenu, null)
            ),
            React.createElement(
                StyledText,
                { style: (0, _classnames2.default)('class', ['smallText', 'topRightCorner']) },
                React.createElement(
                    'span',
                    { className: 'textDark' },
                    versionText
                )
            )
        );
    }
});

module.exports = StartScreen;

},{"classnames":1,"renderer/ui/ReactUtils":113,"renderer/ui/component/SettingsMenu":117,"renderer/ui/component/base/Button":120,"renderer/ui/component/base/StyledText":123}],120:[function(require,module,exports){
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

},{"classnames":1,"pubsub-js":3}],121:[function(require,module,exports){
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
        var blur = '';
        if (!this.state.noEffects) {
            switch (this.props.blur) {
                case 'start':
                    blur = 'blurStart';
                    break;
                case 'end':
                    setTimeout(function () {
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

},{"classnames":1}],122:[function(require,module,exports){
'use strict';

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PubSub = require('pubsub-js');

var OptionButton = React.createClass({
    displayName: 'OptionButton',
    getInitialState: function getInitialState() {
        return {
            selectedOption: -1
        };
    },
    render: function render() {
        var _this = this;

        var classes = (0, _classnames2.default)('button', ['button', 'buttonText', 'textLight', 'verticalSpacing', 'Oswald', 'noSelect']);
        var options = this.props.options || [];
        var optionValue = this.state.selectedOption >= 0 ? this.state.selectedOption : this.props.value;

        var buttonEvent = {
            buttonEvent: this.props.buttonEvent || 'noAction',
            state: optionValue
        };

        return React.createElement(
            'div',
            {
                onClick: function onClick() {
                    var nextOptionValue = optionValue >= options.length - 1 ? 0 : optionValue + 1;
                    _this.setState({ selectedOption: nextOptionValue });
                    buttonEvent.state = nextOptionValue;
                    PubSub.publish('buttonClick', buttonEvent);
                },
                className: classes
            },
            options[optionValue]
        );
    }
});

module.exports = OptionButton;

},{"classnames":1,"pubsub-js":3}],123:[function(require,module,exports){
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

},{"classnames":1}],124:[function(require,module,exports){
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

},{"classnames":1,"pubsub-js":3}],125:[function(require,module,exports){
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

},{"classnames":1}],126:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PubSub = require('pubsub-js');

var Hud = function (_React$Component) {
    _inherits(Hud, _React$Component);

    function Hud(properties) {
        _classCallCheck(this, Hud);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Hud).call(this, properties));

        _this.width = document.documentElement.clientWidth;
        _this.height = document.documentElement.clientHeight;

        _this.setupListener();
        return _this;
    }

    _createClass(Hud, [{
        key: 'setupListener',
        value: function setupListener() {
            PubSub.subscribe('hud', function (msg, data) {});
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement('canvas', {
                id: 'hud',
                width: this.width,
                height: this.height,
                className: (0, _classnames2.default)('class', ['fullScreen', 'noSelect'])
            });
        }
    }, {
        key: 'onSetHudOpen',
        value: function onSetHudOpen(keyStatus) {}
    }]);

    return Hud;
}(React.Component);

module.exports = Hud;

},{"classnames":1,"pubsub-js":3}],127:[function(require,module,exports){
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

},{"logic/actor/DebugActor":7,"logic/actor/enemy/MookActor":20,"logic/actor/enemy/MookBossActor":21,"logic/actor/enemy/OrbotActor":22,"logic/actor/enemy/SniperActor":23,"logic/actor/map/EnemySpawnMarkerActor":24,"logic/actor/map/EnemySpawnerActor":25,"logic/actor/map/MapActor":26,"logic/actor/object/BoomChunkActor":27,"logic/actor/object/ChunkActor":28,"logic/actor/player/ShipActor":29,"logic/actor/projectile/LaserProjectileActor":30,"logic/actor/projectile/MoltenProjectileActor":31,"logic/actor/projectile/PlasmaProjectileActor":32,"logic/actor/projectile/PulseWaveProjectileActor":33,"logic/actor/projectile/RedLaserProjectileActor":34,"logic/actor/projectile/RingProjectileActor":35,"renderer/actor/DebugActor":44,"renderer/actor/enemy/MookActor":49,"renderer/actor/enemy/MookBossActor":50,"renderer/actor/enemy/OrbotActor":51,"renderer/actor/enemy/SniperActor":52,"renderer/actor/map/EnemySpawnMarkerActor":53,"renderer/actor/map/EnemySpawnerActor":54,"renderer/actor/map/MapActor":55,"renderer/actor/object/BoomChunkActor":56,"renderer/actor/object/ChunkActor":57,"renderer/actor/player/ShipActor":58,"renderer/actor/projectile/LaserProjectileActor":59,"renderer/actor/projectile/MoltenProjectileActor":60,"renderer/actor/projectile/PlasmaProjectileActor":61,"renderer/actor/projectile/PulseWaveProjectileActor":62,"renderer/actor/projectile/RedLaserProjectileActor":63,"renderer/actor/projectile/RingProjectileActor":64}],128:[function(require,module,exports){
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

},{}],129:[function(require,module,exports){
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

},{}],130:[function(require,module,exports){
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

    angleToVector: function angleToVector(angle, length) {
        length = length || 0;
        return [Math.sin(angle) * -1 * length, Math.cos(angle) * length];
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
    },

    rotateVector: function rotateVector(x, y, angle) {
        var cos = Math.cos(angle),
            sin = Math.sin(angle),
            nx = cos * x + sin * y,
            ny = cos * y - sin * x;
        return [nx, ny];
    },

    objToScreenPosition: function objToScreenPosition(object, renderer, camera) {
        var vector = new THREE.Vector3();
        var canvas = renderer.domElement;

        vector.set(object.position[0], object.position[1], object.positionZ);
        vector.project(camera);

        vector.x = Math.round((vector.x + 1) * canvas.width / 2);
        vector.y = Math.round((-vector.y + 1) * canvas.height / 2);

        return [vector.x, vector.y];
    }
};

if (!Function.prototype.extend) {
    Function.prototype.extend = function (oldClass) {
        this.prototype = Object.create(oldClass.prototype);
        this.prototype.constructor = oldClass;
    };
}

module.exports = Utils;

},{}],131:[function(require,module,exports){
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

},{}]},{},[5]);
