"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseLight = (function () {
    function BaseLight(actor) {
        _classCallCheck(this, BaseLight);

        this.actor = actor;
        this.followActor = true;
        this.zOffset = 0;
    }

    _createClass(BaseLight, [{
        key: "update",
        value: function update() {
            if (this.followActor && this.light) {
                this.light.position.x = this.actor.position.x;
                this.light.position.y = this.actor.position.y;
                this.light.position.z = this.actor.positionZ + this.zOffset;
            }
        }
    }, {
        key: "createLight",
        value: function createLight() {
            return null;
        }
    }, {
        key: "get",
        value: function get() {
            return this.light;
        }
    }]);

    return BaseLight;
})();
//# sourceMappingURL=BaseLight.js.map
