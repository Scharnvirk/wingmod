var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function Blaster(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.REDLASERPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 15;
    this.velocity = 1400;
    this.sound = 'red_laser';
    this.firingMode = 'simultaneous';
    this.ammoConfig = {
        energy: 0.5,
    };
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;
