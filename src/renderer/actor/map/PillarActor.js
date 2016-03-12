var PillarMesh = require("renderer/actor/components/mesh/PillarMesh");
var BaseActor = require("renderer/actor/BaseActor");

function PillarActor(){
    BaseActor.apply(this, arguments);
}

PillarActor.extend(BaseActor);

PillarActor.prototype.createMesh = function(){
    return new PillarMesh({actor: this});
};

module.exports = PillarActor;
