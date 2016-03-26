var WallMesh = require("renderer/actor/component/mesh/WallMesh");
var BaseActor = require("renderer/actor/BaseActor");

function WallActor(){
    BaseActor.apply(this, arguments);
}

WallActor.extend(BaseActor);

WallActor.prototype.createMesh = function(){
    return new WallMesh({actor: this});
};

module.exports = WallActor;
