var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var RingBlaster = require('logic/actor/component/weapon/RingBlaster');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var DropMixin = require('logic/actor/mixin/DropMixin');

function OrbotActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.ORBOT);

    this.calloutSound = 'orbot';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();

    BaseActor.apply(this, arguments);
}

OrbotActor.extend(BaseActor);
OrbotActor.mixin(BrainMixin);
OrbotActor.mixin(DropMixin);

OrbotActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        shootingArc: 30,
        nearDistance: 10,
        farDistance: 30,
        firingDistance: 50
    });
};

OrbotActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

OrbotActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

OrbotActor.prototype.createWeapon = function(){
    return new RingBlaster({
        actor: this,
        manager: this.manager,
        firingPoints: [
            {offsetAngle: 90, offsetDistance: 0.2, fireAngle: 0},
        ]
    });
};

OrbotActor.prototype.onDeath = function(){
    this.spawn({
        amount: 10,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });

    this.spawn({
        classId: ActorFactory.EXPLOSION
    });

    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8'], 10);
};

OrbotActor.prototype.onHit = function(){
    this.spawn({
        amount: 1,
        probability: 0.1,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.playSound(['armorHit1', 'armorHit2'], 1);
};


module.exports = OrbotActor;
