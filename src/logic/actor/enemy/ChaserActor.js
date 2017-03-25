var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var LightEnemyBlaster = require('logic/actor/component/weapon/LightEnemyBlaster'); 
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var DropMixin = require('logic/actor/mixin/DropMixin');

function ChaserActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.CHASER);

    this.calloutSound = 'drone';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    
    BaseActor.apply(this, arguments);
}

ChaserActor.extend(BaseActor);
ChaserActor.mixin(BrainMixin);
ChaserActor.mixin(DropMixin);

ChaserActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        gameState: this.gameState,
        enemyActor: this.manager.getFirstPlayerActor(),
        firingDistance: 250,
        leadSkill: 0.4,
        nearDistance: 100,
        farDistance: 500,
        shootingArc: 30,
        wallDetectionDistance: 30,
        behavior: 'chaser'
    });
};

ChaserActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

ChaserActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

ChaserActor.prototype.createWeapon = function(){
    return new LightEnemyBlaster({
        actor: this,
        manager: this.manager,
        firingMode: 'alternate',
        firingPoints: [
            {offsetAngle: -90, offsetDistance: 3.5, fireAngle: 0},
            {offsetAngle: 90, offsetDistance: 3.5 , fireAngle: 0}
        ]
    });
};

ChaserActor.prototype.onDeath = function(){
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

ChaserActor.prototype.onHit = function(){
    this.spawn({
        amount: 1,
        probability: 0.3,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.playSound(['armorHit1', 'armorHit2'], 1);
};

module.exports = ChaserActor;
