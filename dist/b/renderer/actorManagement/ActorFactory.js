"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//This class is used also in the Logic worker!
//create mess responsibly

function ActorFactory() {
    var _actorMap;

    this.actorMap = (_actorMap = {}, _defineProperty(_actorMap, ActorFactory.SHIP_ACTOR, ShipActor), _defineProperty(_actorMap, ActorFactory.MOOK_ACTOR, MookActor), _defineProperty(_actorMap, ActorFactory.LIGHT_ACTOR, LightActor), _actorMap);
}

ActorFactory.SHIP_ACTOR = 1;
ActorFactory.MOOK_ACTOR = 2;
ActorFactory.LIGHT_ACTOR = 3;

//actorDataArray format is: [classId, positionX, positionY, angle, velocityX, velocityY]

ActorFactory.prototype.create = function (actorDataArray) {
    return new this.actorMap[actorDataArray[0]](actorDataArray);
};
//# sourceMappingURL=ActorFactory.js.map
