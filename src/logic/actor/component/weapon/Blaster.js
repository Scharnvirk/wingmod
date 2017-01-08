var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function Blaster(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.LASERPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 30;
    this.velocity = 1800;
    this.sound = 'blue_laser';
    this.firingMode = 'simultaneous';
    this.ammoConfig = {
        energy: 2,
    };
}

Blaster.extend(BaseWeapon);

module.exports = Blaster;
