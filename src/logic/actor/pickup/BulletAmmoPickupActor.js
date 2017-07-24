var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function BulletAmmoPickupActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.BULLETAMMOPICKUP);
    BaseActor.apply(this, arguments);
    if (this.parent && this.parent.isSpawner) {
        this.props.timeout = 9999999;
    }
}

BulletAmmoPickupActor.extend(BaseActor);

BulletAmmoPickupActor.prototype.onDeath = function(){
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};

module.exports = BulletAmmoPickupActor;
