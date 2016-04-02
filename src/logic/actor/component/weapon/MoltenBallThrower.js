var BaseWeapon = require("logic/actor/component/weapon/BaseWeapon");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function MoltenBallThrower(config){
    Object.assign(this, config);

    this.PROJECTILE_CLASS = ActorFactory.MOLTENPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.BURST_COUNT = 3;
    this.BURST_COOLDOWN = 5;
    this.COOLDOWN = 60;
    this.RECOIL = 100;
    this.VELOCITY = 210;


}

MoltenBallThrower.extend(BaseWeapon);

module.exports = MoltenBallThrower;
