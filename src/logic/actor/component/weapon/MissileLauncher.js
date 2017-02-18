var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function MissileLauncher(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.CONCSNMISSILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 40;
    this.velocity = 100;
    this.sound = 'missile';
    this.firingMode = 'alternate';
    this.volume = 0.5;
    this.ammoConfig = {
        missiles: 1
    };
}

MissileLauncher.extend(BaseWeapon);

module.exports = MissileLauncher;
