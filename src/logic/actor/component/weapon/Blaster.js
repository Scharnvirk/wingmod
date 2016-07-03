var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function Blaster(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.LASERPROJECITLE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 28;
    this.velocity = 1500;
    this.sound = 'blue_laser';
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;
