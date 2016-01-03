class BaseActor{
    constructor(position, angle, positionZ, diameter){
        if(position && (position instanceof THREE.Vector2 !== true)) throw 'ERROR: invalid position vector for actor';

        this.collisionCells = [];

        this.position = position || new THREE.Vector2(0,0);
        this.positionZ = positionZ || 10;
        this.diameter = diameter || 0;

        this.angle = angle || 0;
        this.thrust = 0;
        this.counter = 0;

        this.actorsCollidingWith = [];

        this.physicsProperties = {
            friction: 0,
            acceleration: 0,
            deceleration: 0,
        };
    }

    getPVAS(){
        return [this.position, this.angle];
    }

    update(){

        this.fixAngleRollover();

        if (this.controls){
            this.controls.update();
        }

        this.customUpdate();

        if (this.physics){
            this.handleCollisions();
            this.physics.update(this.position, this.angle, this.thrust);
            this.position = this.physics.position;
            this.angle = this.physics.angle;
        }

        if (this.mesh){
            this.mesh.update(this.position, this.angle, this.positionZ);
        }

        if (this.light){
            this.light.update(this.position, this.angle);
        }
    }

    handleCollisions(){
        for(var i = 0; i < this.actorsCollidingWith; i++){
            var x = this.actorsCollidingWith[i];
        }
        this.actorsCollidingWith = [];
    }

    customUpdate(){}

    addToScene(scene){
        if (this.mesh){
            scene.add(this.mesh.get());
        }

        if (this.light){
            scene.add(this.light.get());
        }
    }

    removeFromScene(scene){
        if (this.mesh){
            scene.remove(this.mesh.get());
        }

        if (this.light){
            scene.remove(this.light.get());
            delete this.light.get();
        }
    }

    fixAngleRollover(){
        if (this.angle > 360) this.angle -= 360;
        if (this.angle < 0) this.angle += 360;
    }

    updatePhysicsProperties(physicsProperties){
        if(physicsProperties instanceof 'object' !== true) throw 'ERROR: Actor\'s physicsProperties must be object';
        this.physicsProperties = physicsProperties;

        if(this.physics) this.physics.updateProperties(physicsProperties);
    }

}
