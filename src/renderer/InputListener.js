class InputListener{
    constructor(config) {
        this.scrollDuration = 4;
        this.scrollFallOffPercent = 10;

        this.domElement = (config.domElement !== undefined) ? config.domElement : document;
        if (this.domElement) {
            this.domElement.setAttribute('tabindex', -1);
        }

        this.viewportElement = config.viewportElement;

        this.inputState = Object.create(null);
        this.inputState.mouseAngle = 0;

        this.PI_2 = Math.PI/2;

        this.keys = {
            81: 'q',
            69: 'e',
            87: 'w',
            83: 's',
            65: 'a',
            68: 'd',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            1001: 'scrollUp',
            1002: 'scrollDown',
            1003: 'mouseLeft',
            1004: 'mouseRight'
        };

        Object.keys(this.keys).forEach(function (key) {
            this.inputState[this.keys[key]] = 0;
        }.bind(this));

        this.keydown = function (event) {
            if (event.altKey) {
                return;
            }
            if (this.keys.hasOwnProperty(event.keyCode)) {
                this.inputState[this.keys[event.keyCode]] = 1;
            }
        };

        this.keyup = function (event) {
            if (this.keys.hasOwnProperty(event.keyCode)) {
                this.inputState[this.keys[event.keyCode]] = 0;
            }
        };

        this.mouseWheel = function (event) {
            this.inputState.scrollUp = event.deltaY > 0 ? this.scrollDuration : 0;
            this.inputState.scrollDown = event.deltaY < 0 ? this.scrollDuration : 0;
        };

        this.mouseMove = function (event) {
            var mouseX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var mouseY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            this.inputState.mouseAngle -= mouseX * 0.002;		    
        };

        this.mouseDown = function (event) {
            switch(event.button){
                case 0:
                    this.inputState.mouseLeft = 1;
                    break;
                case 2:
                    this.inputState.mouseRight = 1;
                    break;
            }
        };

        this.mouseUp = function(event) {
            switch(event.button){
                case 0:
                    this.inputState.mouseLeft = 0;
                    break;
                case 2:
                    this.inputState.mouseRight = 0;
                    break;
            }
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

        this.update = function () {
            for (let key in this.inputState){
                switch(key){
                    case 'scrollUp':
                    case 'scrollDown':
                        if (this.inputState[key] > 0) {
                            this.inputState[key] *= 1-this.scrollFallOffPercent/100;
                        }
                        if (this.inputState[key] < 0.5) {
                            this.inputState[key] = 0;
                        }
                    break;
                }
            }
        };

        this.dispose = function () {
            this.domElement.removeEventListener('contextmenu', contextmenu, false);
            this.domElement.removeEventListener('wheel', _wheel, false);
            this.domElement.removeEventListener('mousemove', _wheel, false);
            this.domElement.removeEventListener('mousedown', _mousedown, false);
            this.domElement.removeEventListener('mouseup', _mouseup, false);
            window.removeEventListener('keydown', _keydown, false);
            window.removeEventListener('keyup', _keyup, false);
        };

        var _keydown = bind(this, this.keydown);
        var _keyup = bind(this, this.keyup);
        var _wheel = bind(this, this.mouseWheel);
        var _move = bind(this, this.mouseMove);
        var _mousedown = bind(this, this.mouseDown);
        var _mouseup = bind(this, this.mouseUp);

        this.domElement.addEventListener('contextmenu', contextmenu, false);
        this.domElement.addEventListener('wheel', _wheel, false);
        this.domElement.addEventListener('mousemove', _move, false);
        this.domElement.addEventListener('mousedown', _mousedown, false);
        this.domElement.addEventListener('mouseup', _mouseup, false);
        window.addEventListener('keydown', _keydown, false);
        window.addEventListener('keyup', _keyup, false);


        this.domElement.onclick = function(){
            this.domElement.requestPointerLock();
        }.bind(this);
    }
}

module.exports = InputListener;
