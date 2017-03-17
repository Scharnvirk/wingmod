var ShipActor = require('logic/actor/player/ShipActor');
var ActorConfig = require('shared/ActorConfig');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var RedBlaster = require('logic/actor/component/weapon/RedBlaster');
var ActorTypes = require('shared/ActorTypes');

function DemoShipActor(){
    this.applyConfig(ActorConfig.DEMOSHIP);    
    ShipActor.apply(this, arguments);
    this.weapon = this.createWeapon();
    this.brain = this.createBrain();    
}

DemoShipActor.extend(ShipActor);
DemoShipActor.mixin(BrainMixin);

DemoShipActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        gameState: this.gameState,
        enemyTypes: ActorTypes.getEnemyTypes(),
        firingDistance: 800,
        shootingArc: 20,
        leadSkill: 1
    });
};

DemoShipActor.prototype.customUpdate = function(){
    this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

DemoShipActor.prototype.createWeapon = function(){
    return new RedBlaster({
        actor: this,
        manager: this.manager,
        firingMode: 'alternate',
        firingPoints: [
            {offsetAngle: -90, offsetDistance: 3.5, fireAngle: 0},
            {offsetAngle: 90, offsetDistance: 3.5 , fireAngle: 0}
        ]
    });
};

module.exports = DemoShipActor;
