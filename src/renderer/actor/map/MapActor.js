var BaseActor = require('renderer/actor/BaseActor');

function MapActor(){
    BaseActor.apply(this, arguments);
}

MapActor.extend(BaseActor);

module.exports = MapActor;
