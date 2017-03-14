var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var EnemyMissileLauncher = require('logic/actor/component/weapon/EnemyMissileLauncher');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var DropMixin = require('logic/actor/mixin/DropMixin');

function MhulkActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.MHULK);

    this.calloutSound = 'mhulk';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    
    BaseActor.apply(this, arguments);
}

MhulkActor.extend(BaseActor);
MhulkActor.mixin(BrainMixin);
MhulkActor.mixin(DropMixin);

MhulkActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        firingDistance: 500,
        shootingArc: 30,
        leadSkill: 0.4
    });
};

MhulkActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig); 
};

MhulkActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

MhulkActor.prototype.createWeapon = function(){
    return new EnemyMissileLauncher({
        actor: this,
        manager: this.manager,
        firingMode: 'alternate',
        firingPoints: [
            {offsetAngle: -37, offsetDistance: 12.5, fireAngle: 0},
            {offsetAngle: 37, offsetDistance: 12.5 , fireAngle: 0}
        ]
    });
};

MhulkActor.prototype.onDeath = function(){
    this.spawn({
        amount: 20,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: 3,
        classId: ActorFactory.BOOMCHUNK,
        angle: [0, 360],
        velocity: [40, 80]
    });

    setTimeout(() => {
        this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);       

    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

MhulkActor.prototype.onHit = function(){
    this.spawn({
        amount: 1,
        probability: 0.3,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.playSound(['armorHit1', 'armorHit2'], 1);
};

module.exports = MhulkActor;
