class Manager {
    constructor(scene, world){
        this._scene = scene;
        this._world = world;
        this._objectPool = [];
    }

    update() {
        this._objectPool.forEach((object) => {
            object.update();
        });
    }

    create(actorClass, config){
        if(!config) config = {};
        Object.assign(config, {
            world: this._world
        });

        var actor = new actorClass(config);

        this._objectPool.push(actor);
        actor.addToScene(this._scene);

        return actor;
    }

    getActiveActors(){
        return this._objectPool;
    }
}
