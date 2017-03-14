var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function MoltenLightThrower(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.MOLTENPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.burstCount = 2;
    this.burstCooldown = 20;
    this.cooldown = 60;
    this.recoil = 100;
    this.velocity = 140;
    this.sound = 'molten';
    this.volume = 0.4;
}

MoltenLightThrower.extend(BaseWeapon);

module.exports = MoltenLightThrower;
