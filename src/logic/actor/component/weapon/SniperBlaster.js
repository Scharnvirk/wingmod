var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function SniperBlaster(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.PURPLELASERPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 150;
    this.velocity = 500;
    this.burstCount = 2;
    this.burstCooldown = 20;
    this.sound = 'laser_purple';
}

SniperBlaster.extend(BaseWeapon);

module.exports = SniperBlaster;
