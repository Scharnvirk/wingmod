var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var RedBlaster = require('logic/actor/component/weapon/RedBlaster');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');

function SniperActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.SNIPER);

    this.calloutSound = 'sniper';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    this.stepAngle = Utils.radToDeg(this.props.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    BaseActor.apply(this, arguments);
}

SniperActor.extend(BaseActor);
SniperActor.mixin(BrainMixin);

SniperActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        shootingArc: 8,
        nearDistance: 200,
        farDistance: 300,
        firingDistance: 400
    });
};

SniperActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

SniperActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

SniperActor.prototype.createWeapon = function(){
    return new RedBlaster({
        actor: this,
        manager: this.manager,
        firingPoints: [
            {offsetAngle: 10, offsetDistance: 5, fireAngle: 0},
        ]
    });
};

SniperActor.prototype.onDeath = function(){
    this.spawn({
        amount: 10,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });

    this.manager.playSound({sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8'], actor: this, volume: 10});
};

SniperActor.prototype.onHit = function(){
    this.spawn({
        amount: 1,
        probability: 0.1,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
};

module.exports = SniperActor;
