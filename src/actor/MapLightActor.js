class MapLightActor extends BaseActor{
    constructor(){
        super(null, null, 10, 50);
        this.diameter = 50;
        this.light = this.createLight();
    }

    createLight(){
        return new MapPointLight(this, this.diameter, 0xffffff);
    }

    setVisible(visible){
        this.light.light.visible = visible;
    }
}
