"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OctaControls = (function () {
    function OctaControls(actor, controlsHandler) {
        _classCallCheck(this, OctaControls);

        this.controlsHandler = controlsHandler;
        this.actor = actor;
    }

    _createClass(OctaControls, [{
        key: "update",
        value: function update() {
            this.actor.thrust = 0;

            if (this.controlsHandler.moveState.w) {
                this.actor.thrust = 1;
            }

            if (this.controlsHandler.moveState.s) {
                this.actor.thrust = -1;
            }

            if (this.controlsHandler.moveState.a) {
                this.actor.angle -= 3;
            }

            if (this.controlsHandler.moveState.d) {
                this.actor.angle += 3;
            }
        }
    }]);

    return OctaControls;
})();
//# sourceMappingURL=OctaControls.js.map
