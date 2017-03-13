var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function MoltenHeavyThrower(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.MOLTENPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.burstCount = 2;
    this.burstCooldown = 10;
    this.cooldown = 60;
    this.recoil = 100;
    this.velocity = 240;
    this.projectileCount = 3;
    this.randomAngle = 10;
    this.sound = 'molten';
    this.volume = 0.4;
}

MoltenHeavyThrower.extend(BaseWeapon);

module.exports = MoltenHeavyThrower;
