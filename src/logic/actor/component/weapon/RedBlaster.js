var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function Blaster(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.REDLASERPROJECITLE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 60;
    this.velocity = 400;
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;
