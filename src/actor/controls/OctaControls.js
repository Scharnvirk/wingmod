class OctaControls{
    constructor(actor, controlsHandler){
        this.controlsHandler = controlsHandler;
        this.actor = actor;
    }

    update(){
        this.actor.thrust = 0;

        if (this.controlsHandler.moveState.w) {
            this.actor.thrust = 1;
        }

        if (this.controlsHandler.moveState.s) {
            this.actor.thrust = -1;
        }

        if (this.controlsHandler.moveState.a) {
            this.actor.angle -= 3;
        }

        if (this.controlsHandler.moveState.d) {
            this.actor.angle += 3;
        }
    }
}
