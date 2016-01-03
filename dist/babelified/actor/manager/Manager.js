"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = (function () {
    function Manager(scene, collisionClass) {
        _classCallCheck(this, Manager);

        this._scene = scene;
        this._objectPool = [];
        this.collisionClass = collisionClass;
        this.collisionMap = {};

        this.GRID_BOX_SIDE_LENGTH = 10;
        this.BOXES_PER_GRID_EDGE = 1000;

        this.BOXES_PER_GRID_EDGE = Math.floor(this.BOXES_PER_GRID_EDGE);
        this.HALF_EDGE = this.BOXES_PER_GRID_EDGE / 2;
    }

    _createClass(Manager, [{
        key: "update",
        value: function update() {
            var _this = this;

            if (this.collisionClass) {
                this._objectPool.forEach(function (object) {
                    _this.collisionGridUpdate(_this.collisionMap, object);
                });
            }

            this._objectPool.forEach(function (object) {
                object.update();
            });
        }
    }, {
        key: "add",
        value: function add(actor) {
            this._objectPool.push(actor);
            actor.addToScene(this._scene);
        }
    }, {
        key: "getActiveActors",
        value: function getActiveActors() {
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

    }, {
        key: "makeActorPositionIndices",
        value: function makeActorPositionIndices(actor) {
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
    }, {
        key: "addToCollisionGrid",
        value: function addToCollisionGrid(collisionMap, indices, actor) {
            var actorListAtCollisionMap;
            for (var j = 0; j < 4; j++) {
                actorListAtCollisionMap = collisionMap[indices[j]];
                if (actorListAtCollisionMap) {
                    if (actorListAtCollisionMap.indexOf(actor) < 0) {
                        actorListAtCollisionMap.push(actor);
                        actor.collisionCells.push(indices[j]);
                    }
                } else {
                    collisionMap[indices[j]] = [actor];
                    actor.collisionCells.push(indices[j]);
                }
            }
        }
    }, {
        key: "cleanCollisionGrid",
        value: function cleanCollisionGrid(collisionMap, indices, actor) {
            for (var i = 0; i < actor.collisionCells.length; i++) {
                if (indices.indexOf(actor.collisionCells[i]) < 0) {
                    collisionMap[actor.collisionCells[i]].splice(collisionMap[actor.collisionCells[i]].indexOf(actor), 1);
                    if (collisionMap[actor.collisionCells[i]].length === 0) {
                        delete collisionMap[actor.collisionCells[i]];
                    }
                    actor.collisionCells.splice(i, 1);
                }
            }
        }
    }, {
        key: "collisionGridUpdate",
        value: function collisionGridUpdate(collisionMap, actor) {
            var indices = this.makeActorPositionIndices(actor);
            this.addToCollisionGrid(collisionMap, indices, actor);
            this.cleanCollisionGrid(collisionMap, indices, actor);
        }
    }]);

    return Manager;
})();
//# sourceMappingURL=Manager.js.map
