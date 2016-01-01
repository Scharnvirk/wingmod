class Manager {
    constructor(scene){
        this._scene = scene;
        this._objectPool = [];
    }

    update(delta) {
        this._objectPool.forEach((object) => {
            object.update(delta);
        });
    }

    add(actor){
        this._objectPool.push(actor);
        actor.addToScene(this._scene);
    }
}
