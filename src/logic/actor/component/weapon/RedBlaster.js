var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function Blaster(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.REDLASERPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 150;
    this.velocity = 500;
    this.burstCount = 1;
    this.burstCooldown = 20;
    this.sound = 'laser_purple';
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;
