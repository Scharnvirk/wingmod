"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameLoop = (function () {
    function GameLoop(controls, camera) {
        _classCallCheck(this, GameLoop);

        this.controls = controls;
        this.camera = camera;
    }

    _createClass(GameLoop, [{
        key: "update",
        value: function update() {
            if (this.controls.moveState.scrollUp) {
                this.camera.position.z += this.controls.moveState.scrollUp;
            }

            if (this.controls.moveState.scrollDown) {
                this.camera.position.z -= this.controls.moveState.scrollDown;
            }
        }
    }]);

    return GameLoop;
})();
//# sourceMappingURL=GameLoop.js.map
