class Manager {
    constructor(scene, collisionClass){
        this._scene = scene;
        this._objectPool = [];
        this.collisionClass = collisionClass;
        this.collisionMap = {};

        this.GRID_BOX_SIDE_LENGTH = 10;
        this.BOXES_PER_GRID_EDGE = 1000;

        this.BOXES_PER_GRID_EDGE = Math.floor(this.BOXES_PER_GRID_EDGE);
        this.HALF_EDGE = this.BOXES_PER_GRID_EDGE / 2;
    }

    update() {
        if(this.collisionClass){
            this._objectPool.forEach((object) => {
                this.collisionGridUpdate(this.collisionMap, object);
            });
        }

        this._objectPool.forEach((object) => {
            object.update();
        });
    }

    add(actor){
        this._objectPool.push(actor);
        actor.addToScene(this._scene);
    }

    getActiveActors(){
        return this._objectPool;
    }

    //
    // collisionBruteForce(a){
    //     this._objectPool.forEach((b) => {
    //         if(
    //             a.position.x + a.diameter > b.position.x - b.diameter ||
    //             a.position.x - a.diameter < b.position.x + b.diameter ||
    //             a.position.y + a.diameter > b.position.y - b.diameter ||
    //             a.position.y - a.diameter < b.position.y + b.diameter
    //         ){
    //             var x = 'asd';
    //         }
    //     });
    // }

    makeActorPositionIndices(actor){
        var indices = [];

        var xPlusPart = Math.floor((actor.position.x + actor.diameter) / this.GRID_BOX_SIDE_LENGTH) + 1 + this.HALF_EDGE;
        var xMinusPart = Math.floor((actor.position.x - actor.diameter) / this.GRID_BOX_SIDE_LENGTH) + 1 + this.HALF_EDGE;
        var yPlusPart = (Math.floor((actor.position.y + actor.diameter) / this.GRID_BOX_SIDE_LENGTH) + 1 + this.HALF_EDGE) * this.BOXES_PER_GRID_EDGE;
        var yMinusPart = (Math.floor((actor.position.y - actor.diameter) / this.GRID_BOX_SIDE_LENGTH) + 1 + this.HALF_EDGE) * this.BOXES_PER_GRID_EDGE;

        indices.push(xMinusPart + yMinusPart);
        indices.push(xMinusPart + yPlusPart);
        indices.push(xPlusPart + yMinusPart);
        indices.push(xPlusPart + yPlusPart);

        return indices;
    }

    addToCollisionGrid(collisionMap, indices, actor){
        var actorListAtCollisionMap;
        for(var j = 0; j<4; j++){
            actorListAtCollisionMap = collisionMap[indices[j]];
            if( actorListAtCollisionMap ){
                if(actorListAtCollisionMap.indexOf(actor) < 0 ){
                     actorListAtCollisionMap.push(actor);
                     actor.collisionCells.push(indices[j]);
                }
            } else {
                 collisionMap[indices[j]] = [actor];
                 actor.collisionCells.push(indices[j]);
            }
        }
    }

    cleanCollisionGrid(collisionMap, indices, actor){
        for(var i = 0; i < actor.collisionCells.length; i++){
            if(indices.indexOf(actor.collisionCells[i]) < 0){
                collisionMap[actor.collisionCells[i]].splice(collisionMap[actor.collisionCells[i]].indexOf(actor), 1 );
                if(collisionMap[actor.collisionCells[i]].length === 0){
                    delete collisionMap[actor.collisionCells[i]];
                }
                actor.collisionCells.splice(i,1);
            }
        }
    }

    collisionGridUpdate(collisionMap, actor){
        var indices = this.makeActorPositionIndices(actor);
        this.addToCollisionGrid(collisionMap, indices, actor);
        this.cleanCollisionGrid(collisionMap, indices, actor);
    }
}
