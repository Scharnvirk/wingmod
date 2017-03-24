var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var EnemyHomingMissileLauncher = require('logic/actor/component/weapon/EnemyHomingMissileLauncher');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var DropMixin = require('logic/actor/mixin/DropMixin');

function LhulkActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.LHULK);

    this.calloutSound = 'lhulk';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    
    BaseActor.apply(this, arguments);
}

LhulkActor.extend(BaseActor);
LhulkActor.mixin(BrainMixin);
LhulkActor.mixin(DropMixin);

LhulkActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        gameState: this.gameState,
        enemyActor: this.manager.getFirstPlayerActor(),
        firingDistance: 1500,
        shootingArc: 30,
        leadSkill: 0.4
    });
};

LhulkActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig); 
};

LhulkActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

LhulkActor.prototype.createWeapon = function(){
    return new EnemyHomingMissileLauncher({
        actor: this,
        manager: this.manager,
        firingMode: 'alternate',
        firingPoints: [
            {offsetAngle: -57, offsetDistance: 14.5, fireAngle: 0},
            {offsetAngle: 57, offsetDistance: 14.5 , fireAngle: 0}
        ]
    });
};

LhulkActor.prototype.onDeath = function(){
    this.spawn({
        amount: 20,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: 10,
        classId: ActorFactory.BOOMCHUNK,
        angle: [0, 360],
        velocity: [60, 120]
    });

    setTimeout(() => {
        this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);       

    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

LhulkActor.prototype.onHit = function(){
    this.spawn({
        amount: 1,
        probability: 0.3,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.playSound(['armorHit1', 'armorHit2'], 1);
};

module.exports = LhulkActor;
