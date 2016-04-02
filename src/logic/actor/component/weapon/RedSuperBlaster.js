var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function Blaster(config){
    Object.assign(this, config);

    this.PROJECTILE_CLASS = ActorFactory.REDLASERPROJECITLE;

    BaseWeapon.apply(this, arguments);

    this.BURST_COUNT = 5;
    this.BURST_COOLDOWN = 12;
    this.COOLDOWN = 40;
    this.VELOCITY = 700;
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;
