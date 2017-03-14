var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var SniperBlaster = require('logic/actor/component/weapon/SniperBlaster');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var DropMixin = require('logic/actor/mixin/DropMixin');

function SniperActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.SNIPER);

    this.calloutSound = 'sniper';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();

    BaseActor.apply(this, arguments);
}

SniperActor.extend(BaseActor);
SniperActor.mixin(BrainMixin);
SniperActor.mixin(DropMixin);

SniperActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        shootingArc: 8,
        nearDistance: 200,
        farDistance: 300,
        firingDistance: 400,
        leadSkill: 0.5
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
    return new SniperBlaster({
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

    setTimeout(() => {
        this.spawn({
            classId: ActorFactory.SMALLEXPLOSION
        });
    }, 100);         
    
    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

SniperActor.prototype.onHit = function(){
    this.spawn({
        amount: 1,
        probability: 0.3,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.playSound(['armorHit1', 'armorHit2'], 1);
};

module.exports = SniperActor;
