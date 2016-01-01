"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseMesh = (function () {
    function BaseMesh(actor) {
        _classCallCheck(this, BaseMesh);

        this.actor = actor;
        this.followActor = true;
        this.meshRotationVector = new THREE.Vector3(0, 0, 1);
        this.angleOffset = 0;
    }

    _createClass(BaseMesh, [{
        key: "update",
        value: function update(position, deltaAngle, positionZ) {
            if (this.followActor && this.mesh) {
                this.mesh.position.x = position.x;
                this.mesh.position.y = position.y;
                this.mesh.position.z = positionZ;
                this.mesh.rotation.z = Utils.degToRad(-this.actor.angle + this.angleOffset);
            }
        }
    }, {
        key: "createMesh",
        value: function createMesh() {
            return null;
        }
    }, {
        key: "get",
        value: function get() {
            return this.mesh;
        }
    }]);

    return BaseMesh;
})();
//# sourceMappingURL=BaseMesh.js.map
