var ShipMesh = require("renderer/actor/component/mesh/ShipMesh");
var MookActor = require("renderer/actor/enemy/MookActor");

function MookBossActor(){
    MookActor.apply(this, arguments);
    this.speedZ = Utils.rand(35,45)/1000;
    this.bobSpeed = Utils.rand(18,22)/10000;

    this.initialHp = 100;
    this.hp = 100;
    this.hpBarCount = 30;
}

MookBossActor.extend(MookActor);

MookBossActor.prototype.createMeshes = function(){
    return [new ShipMesh({actor: this, scaleX: 2, scaleY: 2, scaleZ: 2})];
};

module.exports = MookBossActor;
