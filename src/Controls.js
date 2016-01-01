
class TopDownControls{
    constructor(object, domElement) {
        this.scrollDuration = 4;
        this.scrollFallOffPercent = 10;

        this.domElement = (domElement !== undefined) ? domElement : document;
        if (domElement) {
            this.domElement.setAttribute('tabindex', -1);
        }

        this.moveState = {};

        this.keys = {
            87: 'w',
            83: 's',
            65: 'a',
            68: 'd',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            //mouse below
            1001: 'scrollUp',
            1002: 'scrollDown'
        };

        Object.keys(this.keys).forEach(function (key) {
            this.moveState[this.keys[key]] = 0;
        }.bind(this));

        this.keydown = function (event) {
            if (event.altKey) {
                return;
            }
            if (this.keys.hasOwnProperty(event.keyCode)) {
                this.moveState[this.keys[event.keyCode]] += 1;
            }
        };

        this.keyup = function (event) {
            if (this.keys.hasOwnProperty(event.keyCode)) {
                this.moveState[this.keys[event.keyCode]] = 0;
            }
        };

        this.mouseWheel = function (event) {
            this.moveState.scrollUp = event.deltaY > 0 ? this.scrollDuration : 0;
            this.moveState.scrollDown = event.deltaY < 0 ? this.scrollDuration : 0;
        };

        this.handleEvent = function (event) {
            if (typeof this[ event.type ] === 'function') {
                this[ event.type ](event);
            }
        };

        function bind(scope, fn) {
            return function () {
                fn.apply(scope, arguments);
            };
        }

        function contextmenu(event) {
            event.preventDefault();
        }

        this.update = function (delta) {
            Object.keys(this.moveState).forEach(function (key) {
                switch(key){
                    case 'scrollUp':
                    case 'scrollDown':
                        if (this.moveState[key] > 0) {
                            this.moveState[key] *= 1-this.scrollFallOffPercent/100;
                        }
                        if (this.moveState[key] < 0.5) {
                            this.moveState[key] = 0;
                        }
                    break;
                }
            }.bind(this));
        };

        this.dispose = function () {
            this.domElement.removeEventListener('contextmenu', contextmenu, false);
            this.domElement.removeEventListener('wheel', _wheel, false);
            window.removeEventListener('keydown', _keydown, false);
            window.removeEventListener('keyup', _keyup, false);
        };

        var _keydown = bind(this, this.keydown);
        var _keyup = bind(this, this.keyup);
        var _wheel = bind(this, this.mouseWheel);

        this.domElement.addEventListener('contextmenu', contextmenu, false);
        this.domElement.addEventListener('wheel', _wheel, false);
        window.addEventListener('keydown', _keydown, false);
        window.addEventListener('keyup', _keyup, false);
    }
}
