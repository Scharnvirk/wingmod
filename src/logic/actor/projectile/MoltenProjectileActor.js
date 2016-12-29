var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorConfig = require("shared/ActorConfig");

function MoltenProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.MOLTENPROJECTILE);
    BaseActor.apply(this, arguments);
}

MoltenProjectileActor.extend(BaseActor);

MoltenProjectileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

module.exports = MoltenProjectileActor;
