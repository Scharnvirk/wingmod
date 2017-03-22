var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function HomingMissileLauncher(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.HOMINGMISSILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 40;
    this.velocity = 0;
    this.sound = 'missile';
    this.firingMode = 'alternate';
    this.volume = 0.5;
    this.ammoConfig = {
        missiles: 1,
        energy: 10
    };
}

HomingMissileLauncher.extend(BaseWeapon);

module.exports = HomingMissileLauncher;
