class BaseLight{
    constructor(actor){
        this.actor = actor;
        this.followActor = true;
        this.zOffset = 0;
    }

    update(){
        if(this.followActor && this.light){
            this.light.position.x = this.actor.position.x;
            this.light.position.y = this.actor.position.y;
            this.light.position.z = this.actor.positionZ + this.zOffset;
        }
    }

    createLight(){
        return null;
    }

    get(){
        return this.light;
    }
}
