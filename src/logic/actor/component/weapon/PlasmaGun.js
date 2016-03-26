var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function PlasmaGun(config){
    Object.assign(this, config);

    this.PROJECTILE_CLASS = ActorFactory.PLASMAPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.COOLDOWN = 10;
    this.VELOCITY = 200;
}

PlasmaGun.extend(BaseWeapon);

module.exports = PlasmaGun;
