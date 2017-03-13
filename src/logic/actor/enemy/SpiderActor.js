var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var MoltenHeavyThrower = require('logic/actor/component/weapon/MoltenHeavyThrower');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var DropMixin = require('logic/actor/mixin/DropMixin');

function SpiderActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.SPIDER); 

    this.calloutSound = 'spider';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    
    BaseActor.apply(this, arguments);
}

SpiderActor.extend(BaseActor);
SpiderActor.mixin(BrainMixin);
SpiderActor.mixin(DropMixin);

SpiderActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        shootingArc: 50,
        nearDistance: 20,
        farDistance: 50,
        firingDistance: 200
    });
};

SpiderActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

SpiderActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

SpiderActor.prototype.createWeapon = function(){
    return new MoltenHeavyThrower({
        actor: this,
        manager: this.manager,
        firingMode: 'alternate',
        firingPoints: [
            {offsetAngle: -90, offsetDistance: 0.5, fireAngle: 0},
            {offsetAngle: 90, offsetDistance: 0.5 , fireAngle: 0}
        ]
    });
};

SpiderActor.prototype.onDeath = function(){
    this.spawn({
        amount: 10,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });     

    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

SpiderActor.prototype.onHit = function(){
    this.spawn({
        amount: 1,
        probability: 0.3,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.playSound(['armorHit1', 'armorHit2'], 1);
};

module.exports = SpiderActor;
