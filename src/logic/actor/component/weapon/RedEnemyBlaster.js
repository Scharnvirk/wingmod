var BaseWeapon = require('logic/actor/component/weapon/BaseWeapon');
var ActorFactory = require('shared/ActorFactory')('logic');

function RedEnemyBlaster(config){
    Object.assign(this, config);

    this.projectileClass = ActorFactory.REDLASERENEMYPROJECTILE;

    BaseWeapon.apply(this, arguments);

    this.cooldown = 80;
    this.velocity = 300;
    this.sound = 'red_laser';
}

RedEnemyBlaster.extend(BaseWeapon);

module.exports = RedEnemyBlaster;
