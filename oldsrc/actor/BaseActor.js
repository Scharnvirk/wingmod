class BaseActor{
    constructor(config){
        Object.assign(this, config);
        this.collisionCells = [];

        if(!config) config = {};

        this.position = config.position || [0,0];
        this.positionZ = config.positionZ || 10;

        this.angle = config.angle || 0;
        this.thrust = 0;

    }

    update(){
        //this.fixAngleRollover();

        if (this.controls){
            this.controls.update();
        }

        this.customUpdate();

        if (this.body){
            this.updatePhysicsFromBody();
        }

        if (this.mesh){
            this.mesh.update(this.position, this.angle, this.positionZ);
        }

        if (this.light){
            this.light.update(this.position, this.angle);
        }
    }

    // handleCollisions(){
    //     for(var i = 0; i < this.actorsCollidingWith; i++){
    //         var x = this.actorsCollidingWith[i];
    //     }
    //     this.actorsCollidingWith = [];
    // }

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

    // fixAngleRollover(){
    //     if (this.angle > 360) this.angle -= 360;
    //     if (this.angle < 0) this.angle += 360;
    // }

    updatePhysicsFromBody(){
        this.position = this.body.position;
        this.angle = Utils.radToDeg(this.body.angle);
    }
}
