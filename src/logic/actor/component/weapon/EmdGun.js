var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function EmdGun(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.EMDPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 10;
    this.velocity = 500; 
    this.sound = 'disrupter';
    this.firingMode = 'alternate';
    this.volume = 0.8;
    this.ammoConfig = {
        energy: 1
    };
}

EmdGun.extend(BaseWeapon);

module.exports = EmdGun;
