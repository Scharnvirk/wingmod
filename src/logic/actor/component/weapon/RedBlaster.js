var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function Blaster(config){
    Object.assign(this, config);

    this.PROJECTILE_CLASS = ActorFactory.REDLASERPROJECITLE;

    BaseWeapon.apply(this, arguments);

    this.COOLDOWN = 60;
    this.VELOCITY = 400;
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;