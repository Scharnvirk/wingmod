var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function PlasmaGun(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.PULSEWAVEPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 6;
    this.velocity = 460;
    this.sound = 'laser_charged';
    this.firingMode = 'alternate';
    this.volume = 0.5;
}

PlasmaGun.extend(BaseWeapon);

module.exports = PlasmaGun;
