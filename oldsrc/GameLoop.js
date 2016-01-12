class GameLoop{
    constructor(controls, camera) {
       this.controls = controls;
       this.camera = camera;
   }

   update() {
       if (this.controls.moveState.scrollUp) {
           this.camera.position.z += this.controls.moveState.scrollUp;
       }

       if (this.controls.moveState.scrollDown) {
           this.camera.position.z -= this.controls.moveState.scrollDown;
       }
   }
}
