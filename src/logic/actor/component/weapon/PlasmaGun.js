var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("shared/ActorFactory")('logic');

function PlasmaGun(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.PLASMAPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 10;
    this.velocity = 230;
    this.sound = 'plasmashot3';
    this.volume = 0.5;
}

PlasmaGun.extend(BaseWeapon);

module.exports = PlasmaGun;
