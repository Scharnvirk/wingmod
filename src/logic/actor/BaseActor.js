var ActorFactory = require("shared/ActorFactory")('logic');
var BaseStateChangeHandler = require("logic/actor/component/stateChangeHandler/BaseStateChangeHandler");

function BaseActor(config){
    Object.assign(this, config);

    this.body = this.createBody();
    if(!this.body) throw new Error('No body defined for Logic Actor!');

    this.body.position = [this.positionX || 0, this.positionY || 0];
    this.body.angle = this.angle || 0;
    this.body.actor = this;
    this.body.velocity = Utils.angleToVector(this.angle, this.velocity || 0);

    this.thrust = 0;
    this.horizontalThrust = 0;
    this.angleForce = 0;

    this.timer = 0;
    this.id = this.id || config.id;

    this.props = this.props || {};

    this.stateChangeHandler = this.createStateHandler();

    if (this.props.isPlayer){
        this.manager.attachPlayer(this);
    }
}

BaseActor.prototype.applyConfig = function(config){
    for (let property in config){
        this[property] = this[property] || config[property];
    }
};

BaseActor.prototype.createBody = function(){
    return null;
};

BaseActor.prototype.createStateHandler = function(){
    return new BaseStateChangeHandler({actor: this, initialState: Object.assign({},this.props)});
};

BaseActor.prototype.update = function(){
    this.timer ++;
    if(this.timer > this.props.timeout){
        this.deathMain();
    }
    this.customUpdate();
    this.processMovement();
};

BaseActor.prototype.onCollision = function(otherActor, relativeContactPoint){
    this.stateChangeHandler.onCollision(otherActor, relativeContactPoint);
};

BaseActor.prototype.notifyManagerOfStateChange = function(newState){
    this.manager.notifyOfActorChangedState(this.id, newState);
};

BaseActor.prototype.remove = function(){
    this.manager.removeActorAt(this.id);
};

BaseActor.prototype.customUpdate = function(){};

BaseActor.prototype.playerUpdate = function(){};

BaseActor.prototype.onHit = function(){};

BaseActor.prototype.onSpawn = function(){};

BaseActor.prototype.onDeath = function(){};

BaseActor.prototype.deathMain = function(relativeContactPoint){
    if (this.props.collisionFixesPosition) {
        this.body.position = relativeContactPoint;
    }
    this.manager.actorDied(this);
    this.onDeath();
};

BaseActor.prototype.processMovement = function(){
    if(this.angleForce !== 0){
        this.body.angularVelocity = this.angleForce * this.props.turnSpeed;
    } else {
        this.body.angularVelocity = 0;
    }

    if(this.thrust !== 0){
        this.body.applyForceLocal([0, this.thrust * this.props.acceleration]);
    }

    if(this.horizontalThrust !== 0){
        this.body.applyForceLocal([this.horizontalThrust * this.props.acceleration, 0]);
    }
};

BaseActor.prototype.drawDebug = function(position){
    this.manager.addNew({
        classId: ActorFactory.DEBUG,
        positionX: position[0],
        positionY: position[1],
        angle: 0,
        velocity: 0
    });
};

module.exports = BaseActor;
