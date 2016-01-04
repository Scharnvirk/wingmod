class MapLightActor extends BaseActor{
    constructor(config){
        super(config);
        Object.assign(this, config);
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
