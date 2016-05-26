var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function RingBlaster(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.RINGPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 80;
    this.velocity = 130;
}

RingBlaster.extend(BaseWeapon);

module.exports = RingBlaster;