class LightPool extends BaseObjectPool {
    constructNewObject(){
        return new MapPointLight(null, 0, 0xffffff);
    }
}
