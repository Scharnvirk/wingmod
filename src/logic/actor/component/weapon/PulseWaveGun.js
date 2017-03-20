var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function PulseWaveGun(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.PULSEWAVEPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 5;
    this.velocity = 500;
    this.sound = 'disrupter';
    this.firingMode = 'alternate';
    this.volume = 0.5;
    this.ammoConfig = {
        energy: 0.4,
    };    
}

PulseWaveGun.extend(BaseWeapon);

module.exports = PulseWaveGun;
