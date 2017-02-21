var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function GreenBlaster(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.GREENLASERPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 120;
    this.velocity = 350;
    this.burstCount = 4;
    this.burstCooldown = 6;
    this.sound = 'laser_green';
}

GreenBlaster.extend(BaseWeapon);

module.exports = GreenBlaster;
