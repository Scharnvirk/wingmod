var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var GreenBlaster = require('logic/actor/component/weapon/GreenBlaster');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var DropMixin = require('logic/actor/mixin/DropMixin');

function ShulkActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.SHULK);

    this.calloutSound = 'shulk';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    
    BaseActor.apply(this, arguments);
}

ShulkActor.extend(BaseActor);
ShulkActor.mixin(BrainMixin);
ShulkActor.mixin(DropMixin);

ShulkActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        gameState: this.gameState,
        enemyActor: this.manager.getFirstPlayerActor(),
        firingDistance: 180,
        leadSkill: 0.3
    });
};

ShulkActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig); 
};

ShulkActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

ShulkActor.prototype.createWeapon = function(){
    return new GreenBlaster({
        actor: this,
        manager: this.manager,
        firingMode: 'alternate',
        firingPoints: [
            {offsetAngle: -37, offsetDistance: 10.5, fireAngle: 0},
            {offsetAngle: 37, offsetDistance: 10.5 , fireAngle: 0},
            {offsetAngle: -35, offsetDistance: 10, fireAngle: 0},
            {offsetAngle: 35, offsetDistance: 10 , fireAngle: 0}
        ]
    });
};

ShulkActor.prototype.onDeath = function(){
    this.spawn({
        amount: 20,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: 1,
        classId: ActorFactory.BOOMCHUNK,
        angle: [0, 360],
        velocity: [20, 40]
    });

    setTimeout(() => {
        this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);       

    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

ShulkActor.prototype.onHit = function(){
    this.spawn({
        amount: 1,
        probability: 0.3,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.playSound(['armorHit1', 'armorHit2'], 1);
};

module.exports = ShulkActor;
