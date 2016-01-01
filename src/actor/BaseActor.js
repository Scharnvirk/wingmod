class BaseActor{
    constructor(position, angle, positionZ, diameter){
        if(position && (position instanceof THREE.Vector2 !== true)) throw 'ERROR: invalid position vector for actor';

        this.position = position || new THREE.Vector2(0,0);
        this.positionZ = positionZ || 10;
        this.diameter = diameter || 0;

        this.angle = angle || 0;
        this.thrust = 0;

        this.physicsProperties = {
            friction: 0,
            acceleration: 0,
            deceleration: 0,
        };
    }

    getPVAS(){
        return [this.position, this.angle];
    }

    updatePositionAndAngle(positionAndAngle){
        this.position = positionAndAngle[0];
        this.angle = positionAndAngle[1];
    }

    update(){
        this.fixAngleRollover();
        //var oldAngle = this.angle;

        if (this.controls){
            this.controls.update();
        }

        this.customUpdate();

        if (this.physics){
            this.physics.update(this.position, this.angle, this.thrust);
            this.updatePositionAndAngle(this.physics.getPositionAndAngle());
        }

        if (this.mesh){
            this.mesh.update(this.position, this.angle, this.positionZ);
        }

        if (this.light){
            this.light.update(this.position, this.angle);
        }


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
