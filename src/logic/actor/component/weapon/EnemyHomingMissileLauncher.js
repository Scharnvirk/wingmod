var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function EnemyHomingMissileLauncher(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.ENEMYHOMINGMISSILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 100;
    this.velocity = 150;
    this.burstCount = 2;
    this.burstCooldown = 20;
    this.sound = 'missile';
    this.firingMode = 'alternate';
    this.volume = 1;
}

EnemyHomingMissileLauncher.extend(BaseWeapon);

module.exports = EnemyHomingMissileLauncher;
