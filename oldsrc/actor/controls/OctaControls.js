class OctaControls{
    constructor(actor, controlsHandler){
        this.controlsHandler = controlsHandler;
        this.actor = actor;
    }

    update(){
        this.actor.thrust = 0;
        this.actor.horizontalThrust = 0;
        this.actor.rotationForce = 0;

        if (this.controlsHandler.moveState.a) {
            this.actor.horizontalThrust = -1;
        }

        if (this.controlsHandler.moveState.d) {
            this.actor.horizontalThrust = 1;
        }

        if (this.controlsHandler.moveState.left) {
            this.actor.rotationForce = 1;
        }

        if (this.controlsHandler.moveState.right) {
            this.actor.rotationForce = -1;
        }

        if (this.controlsHandler.moveState.up) {
            this.actor.thrust = 1;
        }

        if (this.controlsHandler.moveState.down) {
            this.actor.thrust = -1;
        }
    }
}
