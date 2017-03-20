var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function PlasmaBlast(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.PLASMABLASTPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 90;
    this.velocity = 200;
    this.sound = 'plasmabig2';
    this.firingMode = 'alternate';
    this.recoil = 40000;
    this.volume = 0.8;
    this.ammoConfig = {
        plasma: 3
    };
}

PlasmaBlast.extend(BaseWeapon);

module.exports = PlasmaBlast;
