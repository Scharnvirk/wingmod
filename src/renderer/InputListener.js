function InputListener(config){
    this.scrollDuration = 4;
    this.scrollFallOffPercent = 10;

    this.domElement = (config.renderer !== undefined) ? config.renderer.domElement : document;
    if (this.domElement) {
        this.domElement.setAttribute('tabindex', -1);
    }

    this.viewportElement = config.viewportElement;

    EventEmitter.apply(this, arguments);

    this.inputState = Object.create(null);
    this.inputState.mouseRotation = 0;
    this.inputState.mouseY = 0;

    this.keys = {
        87: 'w',
        83: 's',
        65: 'a',
        68: 'd',
        69: 'q',
        81: 'e',
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
        this.inputState.mouseRotation -= (event.movementX || event.mozMovementX || event.webkitMovementX || 0) * 0.0015;
        this.inputState.mouseY += event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    };

    this.drag = function (event) {
        event.preventDefault();
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
        this.domElement.removeEventListener('mousemove', _move, false);
        this.domElement.removeEventListener('drag', _drag, false);
        this.domElement.removeEventListener('mousedown', _mousedown, false);
        this.domElement.removeEventListener('mouseup', _mouseup, false);
        this.domElement.removeEventListener('keydown', _keydown, false);
        this.domElement.removeEventListener('keyup', _keyup, false);
    };

    var _keydown = bind(this, this.keydown);
    var _keyup = bind(this, this.keyup);
    var _wheel = bind(this, this.mouseWheel);
    var _move = bind(this, this.mouseMove);
    var _drag = bind(this, this.drag);
    var _mousedown = bind(this, this.mouseDown);
    var _mouseup = bind(this, this.mouseUp);

    this.domElement.addEventListener('contextmenu', contextmenu, false);
    this.domElement.addEventListener('wheel', _wheel, false);
    this.domElement.addEventListener('mousemove', _move, false);
    this.domElement.addEventListener('drag', _drag, false);
    this.domElement.addEventListener('mousedown', _mousedown, false);
    this.domElement.addEventListener('mouseup', _mouseup, false);
    this.domElement.addEventListener('keydown', _keydown, false);
    this.domElement.addEventListener('keyup', _keyup, false);

    this.initPointerLock();
}

InputListener.extend(EventEmitter);

InputListener.prototype.requestPointerLock = function(){
    this.pointerLockRequestFunction = function(){
        if (!document.pointerLockElement && this.domElement.requestPointerLock){
            this.domElement.requestPointerLock();
        }
        if (!document.mozPointerLockElement && this.domElement.mozRequestPointerLock){
            this.domElement.mozRequestPointerLock();
        }
        if (!document.webkitPointerLockElement && this.domElement.webkitRequestPointerLock){
            this.domElement.webkitRequestPointerLock();
        }
    }.bind(this);

    this.domElement.onclick = this.pointerLockRequestFunction;
};

InputListener.prototype.abandonPointerLock = function(){
    this.domElement.onclick = function(){};
};

InputListener.prototype.initPointerLock = function(){
    var onPointerLockChange = function(event){
        if (document.pointerLockElement !== null) {
            this.emit({type: 'gotPointerLock'});
        } else {
            this.emit({type: 'lostPointerLock'});
        }
    };

    var mozOnPointerLockChange = function(event){
        if (document.mozPointerLockElement !== null) {
            this.emit({type: 'gotPointerLock'});
        } else {
            this.emit({type: 'lostPointerLock'});
        }
    };

    var webkitOnPointerLockChange = function(event){
        if (document.webkitPointerLockElement !== null) {
            this.emit({type: 'gotPointerLock'});
        } else {
            this.emit({type: 'lostPointerLock'});
        }
    };

    document.addEventListener('pointerlockchange', onPointerLockChange.bind(this));
    document.addEventListener('mozpointerlockchange', mozOnPointerLockChange.bind(this));
    document.addEventListener('webkitpointerlockchange', webkitOnPointerLockChange.bind(this));
};

module.exports = InputListener;
