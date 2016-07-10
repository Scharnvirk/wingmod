var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function Blaster(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.LASERPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 28;
    this.velocity = 1500;
    this.burstCount = 4;
    this.burstCooldown = 4;
    this.sound = 'blue_laser';
    this.firingMode = 'alternate';
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;
