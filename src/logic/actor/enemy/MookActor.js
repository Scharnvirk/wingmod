var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var MoltenBallThrower = require('logic/actor/component/weapon/MoltenBallThrower');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');

function MookActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.MOOK);

    this.calloutSound = 'drone';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    this.stepAngle = Utils.radToDeg(this.props.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    BaseActor.apply(this, arguments);
}

MookActor.extend(BaseActor);
MookActor.mixin(BrainMixin);

MookActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        firingDistance: 140
    });
};

MookActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

MookActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

MookActor.prototype.createWeapon = function(){
    return new MoltenBallThrower({
        actor: this,
        manager: this.manager,
        firingMode: 'alternate',
        firingPoints: [
            {offsetAngle: -90, offsetDistance: 3.5, fireAngle: 0},
            {offsetAngle: 90, offsetDistance: 3.5 , fireAngle: 0}
        ]
    });
};

MookActor.prototype.onDeath = function(){
    this.spawn({
        amount: 10,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });

    this.manager.playSound({sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8'], actor: this, volume: 10});
};

MookActor.prototype.onHit = function(){
    this.spawn({
        amount: 1,
        probability: 0.1,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
};

module.exports = MookActor;
