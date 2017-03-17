var ActorConfig = require('shared/ActorConfig');
var ShipActor = require('renderer/actor/player/ShipActor');

function DemoShipActor(){
    this.applyConfig(ActorConfig.DEMOSHIP);
    ShipActor.apply(this, arguments);
}

DemoShipActor.extend(ShipActor);

module.exports = DemoShipActor;
