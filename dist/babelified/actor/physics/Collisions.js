'use strict';

function Collisions(masterManager) {
    this.masterManager = masterManager;
    this.collisionClassMap = this.makeCollisionClassMap();
    this.fineCheckCount = 0;
    this.coarseCheckCount = 0;
    this.counter = 0;
}

Collisions.prototype.makeCollisionClassMap = function () {
    return {
        'object': ['object', 'explosion', 'ship', 'level'],
        'explosion': ['ship'],
        'ship': ['ship', 'level']
    };
};

Collisions.prototype.update = function () {
    this.coarseCheck();

    this.counter++;
    if (this.counter > 60) {
        console.log('coarse collisions:', this.coarseCheckCount);
        this.counter = 0;
        this.fineCheckCount = 0;
        this.coarseCheckCount = 0;
    }
};

Collisions.prototype.coarseCheck = function () {
    var collisionMap = this.masterManager.collisionMap;
    var actorA, actorB, collisionCell;
    var collisionIndices = Object.keys(collisionMap);
    for (var c = 0; c < collisionIndices.length; c++) {
        collisionCell = collisionMap[collisionIndices[c]];
        if (collisionCell && collisionCell.length > 1) {
            if (this.counter === 0) this.coarseCheckCount++;
            for (var i = 0; i <= collisionCell.length; i++) {
                for (var j = i + 1; j < collisionCell.length; j++) {
                    actorA = collisionCell[i];
                    actorB = collisionCell[j];
                    if (actorA.position.x + actorA.diameter > actorB.position.x - actorB.diameter || actorA.position.x - actorA.diameter < actorB.position.x + actorB.diameter || actorA.position.y + actorA.diameter > actorB.position.y - actorB.diameter || actorA.position.y - actorA.diameter < actorB.position.y + actorB.diameter) {
                        if (actorA.actorsCollidingWith.indexOf(actorB) < 0) actorA.actorsCollidingWith.push(actorB);
                    }
                }
            }
        }
    }
};

//
// Collisions.prototype.gridCollisionCheck = function(actors){
//     var collisionGrid = this.fillRoughCollisionGrid(actors);
//     var a = true;
// };
//
// Collisions.prototype.gridCollisionCheck = function(actors){
//     var collisionGrid = {};
//     var index = 0;
//     actors.forEach((actor)=>{
//         var diameter = actor.diameter / 2;
//         var indices = [];
//         indices.push((Math.floor((actor.position.x - diameter) / this.GRID_BOX_SIDE_LENGTH) + 1 + this.HALF_EDGE) + (Math.floor((actor.position.y - diameter) / this.GRID_BOX_SIDE_LENGTH) + 1 + this.HALF_EDGE)* this.BOXES_PER_GRID_EDGE);
//         indices.push((Math.floor((actor.position.x - diameter) / this.GRID_BOX_SIDE_LENGTH) + 1 + this.HALF_EDGE) + (Math.floor((actor.position.y + diameter) / this.GRID_BOX_SIDE_LENGTH) + 1 + this.HALF_EDGE)* this.BOXES_PER_GRID_EDGE);
//         indices.push((Math.floor((actor.position.x + diameter) / this.GRID_BOX_SIDE_LENGTH) + 1 + this.HALF_EDGE) + (Math.floor((actor.position.y - diameter) / this.GRID_BOX_SIDE_LENGTH) + 1 + this.HALF_EDGE)* this.BOXES_PER_GRID_EDGE);
//         indices.push((Math.floor((actor.position.x + diameter) / this.GRID_BOX_SIDE_LENGTH) + 1 + this.HALF_EDGE) + (Math.floor((actor.position.y + diameter) / this.GRID_BOX_SIDE_LENGTH) + 1 + this.HALF_EDGE)* this.BOXES_PER_GRID_EDGE);
//
//         for(var j = 0; j<3; j++){
//             if( collisionGrid[indices[j]]){
//                 if(collisionGrid[indices[j]].indexOf(actor) < 0 ){
//                      collisionGrid[indices[j]].push(actor);
//                 }
//             } else {
//                 collisionGrid[indices[j]] = [actor];
//             }
//         }
//     });
//     return collisionGrid;
// };
//
// Collisions.prototype.gridIntersect2D = function(actors, H) {
//     var grid = {}, result = [], x = [0,0];
//     actors.forEach(function(actor, id) {
//         for(x[0]=Math.floor((actor.position.x - actor.diameter) / H); x[0]<=Math.ceil((actor.position.y + actor.diameter) / H); ++x[0])
//             for(x[1]=Math.floor((actor.position.x + actor.diameter) / H); x[1]<=Math.ceil((actor.position.y - actor.diameter) / H); ++x[1]) {
//                 var list = grid[x];
//                 if(list) {
//                     list.forEach(function(otherId) {
//                         var a = actors[otherId];
//
//                         var s = Math.max(a.position.x - a.diameter, actor.position.x - actor.diameter);
//                         var t = Math.min(a.position.y + a.diameter, actor.position.y + actor.diameter);
//                         if(t < s || Math.floor(s/H) !== x[0]) return;
//
//                         s = Math.max(a.position.x + a.diameter, actor.position.x + actor.diameter);
//                         t = Math.min(a.position.y - a.diameter, actor.position.y - actor.diameter);
//                         if(t < s || Math.floor(s/H) !== x[1]) return;
//
//                         result.push([id, otherId]);
//                     });
//                     list.push(id);
//                 } else {
//                     grid[x] = [id];
//                 }
//             }
//     });
//     return result;
// };
//# sourceMappingURL=Collisions.js.map
