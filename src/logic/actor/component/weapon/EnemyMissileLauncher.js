var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function EnemyMissileLauncher(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.ENEMYCONCSNMISSILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 100;
    this.velocity = 150;
    this.burstCount = 3;
    this.burstCooldown = 20;
    this.sound = 'missile';
    this.firingMode = 'alternate';
    this.volume = 1;
}

EnemyMissileLauncher.extend(BaseWeapon);

module.exports = EnemyMissileLauncher;
