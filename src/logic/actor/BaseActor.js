var ActorFactory = require('shared/ActorFactory')('logic');

function BaseActor(config){
    this.id = this.id || config.id;
    this.props = this._createProps(this.props || {});
    this.state = this._createState(this.state || {});
    this.timer = 0;   

    this.gameState = config.gameState || null;     
    this.manager = config.manager || null;

    this._body = this.createBody();
    if(!this._body) throw new Error('No body defined for Logic Actor!');

    this._body.position = [config.positionX || 0, config.positionY || 0];
    this._body.angle = config.angle || 0;
    this._body.actor = this;
    this._body.velocity = Utils.angleToVector(config.angle, config.velocity || 0);
    this._body.actorId = this.id;
    this._body.classId = config.classId;

    this._stepAngle = Utils.radToDeg((this.props.turnSpeed || 0) / Constants.LOGIC_REFRESH_RATE);
    this._thrust = 0;
    this._horizontalThrust = 0;
    this._angleForce = 0;

    if (this.props.isPlayer){
        this.manager.attachPlayer(this);
    }

    Object.assign(this, this._mixinInstanceValues || {});
}

BaseActor.prototype.applyConfig = function(config){
    for (let property in config){
        this[property] = this[property] || config[property];
    }
};

BaseActor.prototype.getPosition = function(){
    return this._body.position;
};

BaseActor.prototype.getAngle = function(){
    return this._body.angle;
};

BaseActor.prototype.getStepAngle = function(){
    return this._stepAngle;
};

BaseActor.prototype.getVelocity = function(){
    return this._body.velocity;
};

BaseActor.prototype.applyRecoil = function(amount){
    this._body.applyForceLocal([0, -amount]);
};

BaseActor.prototype.destroyBody = function(){
    return this._body.dead = true;
};

BaseActor.prototype.getAngleVector = function(leadFactor){
    return Utils.angleToVector(this._body.angle, leadFactor || 1);
};

BaseActor.prototype.getBody = function(){
    return this._body;
};

BaseActor.prototype.setThrust = function(thrust){
    this._thrust = thrust;
};

BaseActor.prototype.setHorizontalThrust = function(horizontalThrust){
    this._horizontalThrust = horizontalThrust;
};

BaseActor.prototype.setAngleForce = function(angleForce){
    this._angleForce = angleForce;
};

BaseActor.prototype.setMass = function(mass){
    this._body.mass = mass;
    this._body.updateMassProperties();
};

BaseActor.prototype.getMass = function(){
    return this._body.mass;
};

BaseActor.prototype.playSound = function(sounds, volume){
    this.manager.playSound({sounds:sounds, actor: this, volume: volume || 1});
};

BaseActor.prototype.createBody = function(){
    return null;
};

BaseActor.prototype.onCollision = function(otherActor, relativeContactPoint){
    this._updateHpAndShieldOnCollision(otherActor, relativeContactPoint);

    if (this.state.hp <= 0 || this.props.removeOnHit){
        this.deathMain(relativeContactPoint);
    }

    if (otherActor && this.state.pickup && otherActor.state.canPickup) {
        otherActor.handlePickup(this.state.pickup);
        this.deathMain(relativeContactPoint);
    }

    this.manager.updateActorState(this);

    this.customOnCollision();
};

BaseActor.prototype.update = function(){
    this.timer ++;
    if(this.timer > this.props.timeout){
        this.deathMain();
    }
    this.customUpdate();
    this.processMovement();
};

BaseActor.prototype.remove = function(){
    this.manager.removeActorAt(this.id);
};

BaseActor.prototype.handlePickup = function(){};

BaseActor.prototype.customOnCollision = function(){};

BaseActor.prototype.customUpdate = function(){};

BaseActor.prototype.playerUpdate = function(){};

BaseActor.prototype.onHit = function(){};

BaseActor.prototype.onSpawn = function(){};

BaseActor.prototype.onDeath = function(){};

BaseActor.prototype.deathMain = function(relativeContactPoint){
    if (this.props.collisionFixesPosition && relativeContactPoint) {
        this._body.position = relativeContactPoint;
    }
    this.manager.actorDied(this);
    if(this.props.soundsOnDeath){
        this.manager.playSound({sounds: this.props.soundsOnDeath, actor: this});
    }
    this.onDeath();
};

BaseActor.prototype.processMovement = function(){
    if(this._angleForce !== 0){
        this._body.angularVelocity = this._angleForce * this.props.turnSpeed;
    } else {
        this._body.angularVelocity = 0;
    }

    if(this._thrust !== 0){
        this._body.applyForceLocal([0, this._thrust * this.props.acceleration]);
    }

    if(this._horizontalThrust !== 0){
        this._body.applyForceLocal([this._horizontalThrust * this.props.acceleration, 0]);
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

BaseActor.prototype.spawn = function(config){    
    config = config || {};
    config.amount = config.amount || 1;
    config.angle = config.angle || 0;
    config.velocity = config.velocity || 0;
    config.classId = config.classId || ActorFactory.DEBUG;
    config.probability = (config.probability || 1) * 100;
    
    for(let i = 0; i < Utils.randArray(config.amount); i++){        
        if (config.probability === 100 || Utils.rand(1, 100) <= config.probability){
            this.manager.addNew({
                classId: config.classId,
                positionX: this._body.position[0],
                positionY: this._body.position[1],
                angle: Utils.randArray(config.angle),
                velocity: Utils.randArray(config.velocity),
                parent: this
            });
        }
    }
};

BaseActor.prototype._createProps = function(props){
    let newProps = Object.assign({}, props);
    if (!newProps.timeout && props.timeoutRandomMin && newProps.timeoutRandomMax){
        newProps.timeout = Utils.rand(newProps.timeoutRandomMin, newProps.timeoutRandomMax);
    }
    return newProps;
};

BaseActor.prototype._createState = function(state){
    let newProps = Object.assign({}, this.props);
    let newState = Object.assign({}, state);
    return Object.assign(newProps, newState);    
};

BaseActor.prototype._updateHpAndShieldOnCollision = function(otherActor, relativeContactPoint){
    if(otherActor && this.state.hp != Infinity && otherActor.props.damage > 0){
        if (this.state.shield) {
            this.state.shield -= otherActor.props.damage;            
            if(this.state.shield < 0) {
                this.state.hp += this.state.shield;
                this.state.shield = 0;
            }
            this.onHit(true);
        } else {
            this.state.hp -= otherActor.props.damage;
            this.onHit();
        }        
        this.state.relativeContactPoint = relativeContactPoint;        
    }
};


module.exports = BaseActor;
