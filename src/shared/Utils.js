var Utils = {
    degToRad: function(degrees){
        return degrees * (Math.PI / 180);
    },

    radToDeg: function(radians){
        return radians * (180 / Math.PI);
    },

    getRandomFloat: function(min, max){
        if (min > max) throw 'ERROR: getRandomFloat min > max';
        return Math.random() * (max-min) + min;
    },

    getRandomInteger: function(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    rand: function(min, max){
        return min === max ? min : this.getRandomInteger(min, max);
    },

    randArray: function(config){
        if (config instanceof Array) {
            return this.rand(config[0], config[1]);
        } else {
            return config;
        }
    },

    makeRandomColor: function(min = 0, max = 255){
        var colors = ['','',''];

        colors.forEach(function(color, index){
            var newColor = this.rand(min, max).toString(16);
            colors[index] = newColor.length === 1 ? '0' + newColor : newColor;
        }.bind(this));

        var color = '0x' + colors.join('');
        return Number(color);
    },

    mixin: function(receiver, donor){
        for(var prop in donor.prototype){
            receiver[prop] = donor.prototype[prop];
        }
        return receiver;
    },

    uptrunc: function(x){
        return x < 0 ? Math.floor(x) : Math.ceil(x);
    },

    rotationToVector: function(rotation, length){
        length = length || 0;
        return [(Math.sin(rotation) * -1) * length, Math.cos(rotation) * length];
    },

    rotationBetweenPointsFromCenter: function(p1, p2){
        var rotation = Math.atan2(p1[1], p1[0]) - Math.atan2(p2[1], p2[0]);

        rotation = rotation * 360 / (2*Math.PI);

        if (rotation < 0){
            rotation = rotation + 360;
        }
        return rotation;
    },

    rotationBetweenPoints: function(p1, p2){
        var rotation = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
        rotation -= Math.PI/2;
        return rotation % (Math.PI*2);
    },

    pointInArc: function(p1, p2, p1LookAngle, p1ArcAngle){
        var rotationToP2 = this.rotationBetweenPoints(p1, p2);
        var normalizedAngle = p1LookAngle % (Math.PI*2);
        var rotationDifference = normalizedAngle >= 0 && rotationToP2 >= 0 || normalizedAngle < 0 && rotationToP2 < 0 ? normalizedAngle - rotationToP2 : normalizedAngle + rotationToP2 * -1;
        return Math.abs(rotationDifference) < this.degToRad(p1ArcAngle) ||
            Math.abs(rotationDifference - (Math.PI*2)) < this.degToRad(p1ArcAngle) ||
            Math.abs(rotationDifference + (Math.PI*2)) < this.degToRad(p1ArcAngle);
    },

    arcAngleDifference: function(p1, p2, p1LookAngle){
        var rotationToP2 = this.rotationBetweenPoints(p1, p2);
        var normalizedAngle = p1LookAngle % (Math.PI*2);
        return normalizedAngle >= 0 && rotationToP2 >= 0 || normalizedAngle < 0 && rotationToP2 < 0 ? normalizedAngle - rotationToP2 : normalizedAngle + rotationToP2 * -1;
    },

    firstToUpper: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    rotateOffsetPoint: function(centerX, centerY, pointX, pointY, radAngle){
        let newX = centerX + ( Math.cos(radAngle) * (pointX-centerX) + Math.sin(radAngle) * (pointY -centerY));
        let newY = centerY + ( -Math.sin(radAngle) * (pointX-centerX) + Math.cos(radAngle) * (pointY -centerY));
        return [newX, newY];
    },

    distanceBetweenPoints: function(p1x, p2x, p1y, p2y){
        return Math.sqrt( (p1x-p2x)*(p1x-p2x) + (p1y-p2y)*(p1y-p2y) );
    },

    pointDifference: function(p1x, p2x, p1y, p2y){
        return [
            p1x >= 0 && p2x >= 0 || p1x < 0 && p2x < 0 ? p1x - p2x : p1x + p2x * -1,
            p1y >= 0 && p2y >= 0 || p1y < 0 && p2y < 0 ? p1y - p2y : p1y + p2y * -1
        ];
    },

    rotateVector: function(x, y, rotation) {
        var cos = Math.cos(rotation),
            sin = Math.sin(rotation),
            nx = (cos * x) + (sin * y),
            ny = (cos * y) - (sin * x);
        return [nx, ny];
    },

    gamePositionToScreenPosition: function(position, renderer, camera){
        var vector = new THREE.Vector3();
        var canvas = renderer.domElement;

        vector.set( position[0], position[1], Constants.DEFAULT_POSITION_Z );
        vector.project( camera );

        vector.x = Math.round( (   vector.x + 1 ) * canvas.width  / 2 );
        vector.y = Math.round( ( - vector.y + 1 ) * canvas.height / 2 );

        return [vector.x, vector.y];
    },

    //proxies for p2.js - it uses "angle" as angle, while three.js uses "rotation"
    angleBetweenPointsFromCenter: function(p1, p2){
        return this.rotationBetweenPointsFromCenter(p1, p2);
    },

    angleToVector: function(rotation, length){
        return this.rotationToVector(rotation, length);
    },

    distanceBetweenActors: function(actor1, actor2){
        return this.distanceBetweenPoints(
            actor1._body.position[0],
            actor2._body.position[0],
            actor1._body.position[1],
            actor2._body.position[1]
        );
    }
};

if(!Function.prototype.extend){
    Function.prototype.extend = function(oldClass){
        this.prototype = Object.create(oldClass.prototype);
        this.prototype.constructor = oldClass;
    };
}

let mixinInit = function(prototype, mixin){
    let newMixinInstanceValues = Object.assign(prototype._mixinInstanceValues || {}, mixin._mixinInstanceValues);
    let newProto = Object.assign(this.prototype, mixin);
    newProto._mixinInstanceValues = newMixinInstanceValues;

    prototype = newProto;
};

if(!Function.prototype.mixin){
    Function.prototype.mixin = function(mixins){
        if (mixins instanceof Array) {
            mixins.forEach(mixin => {
                mixinInit.call(this, this.prototype, mixin);
            });
        } else {
            mixinInit.call(this, this.prototype, mixins);
        }
    };
}



module.exports = Utils;
