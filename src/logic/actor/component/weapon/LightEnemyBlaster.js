var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function LightEnemyBlaster(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.REDLASERENEMYPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.burstCount = 10;
    this.burstCooldown = 5;
    this.firingMode = 'alternate';
    this.cooldown = 60;
    this.velocity = 400;
    this.sound = 'red_laser';
}

LightEnemyBlaster.extend(BaseWeapon);

module.exports = LightEnemyBlaster;
