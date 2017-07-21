var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var WeaponSystem = require('logic/actor/component/WeaponSystem');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var InputMixin = require('logic/actor/mixin/InputMixin');
var PickupMixin = require('logic/actor/mixin/PickupMixin');

function ShipActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.SHIP);

    this.lastInputStateX = 0;
    this.lastInputStateY = 0;

    this.primaryWeaponSystem = this.createPrimaryWeaponSystem();
    this.secondaryWeaponSystem = this.createSecondaryWeaponSystem();

    BaseActor.apply(this, arguments);
}

ShipActor.extend(BaseActor);
ShipActor.mixin(InputMixin);
ShipActor.mixin(PickupMixin);  

ShipActor.prototype.customUpdate = function(){
    this.primaryWeaponSystem.update();
    this.secondaryWeaponSystem.update();
};

ShipActor.prototype.playerUpdate = function(inputState){
    if(inputState){
        this.applyThrustInput(inputState);
        this.applyLookAtAngleInput(inputState);
        this.applyWeaponInput(inputState);
        this.saveLastInput(inputState);
    }
};

ShipActor.prototype.createPrimaryWeaponSystem = function(){
    return new WeaponSystem({
        actor: this,
        gameState: this.gameState,
        firingPoints: [
            {offsetAngle: -40, offsetDistance: 7.5, fireAngle: 0},
            {offsetAngle: 40, offsetDistance: 7.5 , fireAngle: 0}
        ],
        weaponSystemIndex: 0
    });
};

ShipActor.prototype.createSecondaryWeaponSystem = function(){
    return new WeaponSystem({
        actor: this,
        gameState: this.gameState,        
        firingPoints: [
            {offsetAngle: -50, offsetDistance: 4, fireAngle: 0},
            {offsetAngle: 50, offsetDistance: 4, fireAngle: 0}
        ],
        weaponSystemIndex: 1
    });
};

ShipActor.prototype.onDeath = function(){
    this.spawn({
        amount: 40,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: 5,
        classId: ActorFactory.BOOMCHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: Utils.rand(15,20),
        classId: ActorFactory.FLAMECHUNK,
        angle: [0, 360],
        velocity: [200, 300]
    });

    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
}; 

ShipActor.prototype.onHit = function(shielded){
    if (shielded) {
        this.playSound(['shieldHit1', 'shieldHit2', 'shieldHit3'], 1);
    } else {
        this.spawn({
            amount: 1,
            probability: 0.5,
            classId: ActorFactory.CHUNK,
            angle: [0, 360],
            velocity: [50, 100]
        });
        this.playSound(['armorHit1', 'armorHit2'], 1);
    }
};

module.exports = ShipActor;
