module.exports = {
    getLayout: function(layoutIndex) {
        if (layoutIndex < 0 || layoutIndex >= this._layouts.length) throw new Error(`Unknown keyboard layout, requested was of index ${layoutIndex}`);
        return this._layouts[layoutIndex];
    },
    getKeyForControl: function(key){
        return this._layouts[this._currentKeyboardLayout][key];
    },
    setCurrentKeyboardLayout: function(layoutIndex) {
        if (layoutIndex < 0 || layoutIndex >= this._layouts.length) throw new Error(`Unknown keyboard layout, requested was of index ${layoutIndex}`);
        this._currentKeyboardLayout = layoutIndex;
    },

    _currentKeyboardLayout: 0, //save from controls
    _layouts: [
        {
            strafeLeft: 'a',
            strafeRight: 'd',
            forward: 'w',
            backward: 's',
            rotateLeft: 'mouseX',
            rotateRight: 'mouseX',
            fireWeapon1: 'mouseLeft',
            fireWeapon2: 'mouseRight',
            swapWeapon1: 'q',
            swapWeapon2: 'e',
            targetingLonger: 'mouseY',
            targetingShorter: 'mouseY',
            viewHigher: 'mouseScroll',
            viewLower: 'mouseScroll'
        },
        {
            strafeLeft: 'a',
            strafeRight: 'd',
            forward: 'up',
            backward: 'down',
            rotateLeft: 'left',
            rotateRight: 'right',
            fireWeapon1: 's',
            fireWeapon2: 'space',
            swapWeapon1: 'q',
            swapWeapon2: 'e',
            targetingLonger: 'o',
            targetingShorter: 'p',
            viewHigher: 'w',
            viewLower: 'x'
        },
        {
            strafeLeft: 'a',
            strafeRight: 'd',
            forward: 'w',
            backward: 's',
            rotateLeft: 'left',
            rotateRight: 'right',
            fireWeapon1: 'shiftLeft',
            fireWeapon2: 'space',
            swapWeapon1: 'q',
            swapWeapon2: 'e',
            targetingLonger: 'o',
            targetingShorter: 'p',
            viewHigher: 'up',
            viewLower: 'down'
        }        
    ]
};