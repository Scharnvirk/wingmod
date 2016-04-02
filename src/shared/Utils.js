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
        if (min > max) throw 'ERROR: getRandomInteger min > max';
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    rand: function(min, max){
        return this.getRandomInteger(min, max);
    },

    makeRandomColor: function(min = 0, max = 256){
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

    angleToVector: function(angle, velocity){
        velocity = velocity || 0;
        return [(Math.sin(angle) * -1) * velocity, Math.cos(angle) * velocity];
    },

    angleBetweenPointsFromCenter: function(p1, p2){
        var angle = Math.atan2(p1[1], p1[0]) - Math.atan2(p2[1], p2[0]);

        angle = angle * 360 / (2*Math.PI);

        if (angle < 0){
            angle = angle + 360;
        }
        return angle;
    },

    angleBetweenPoints: function(p1, p2){
        var angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
        angle -= Math.PI/2;
        return angle % (Math.PI*2);
    },

    pointInArc: function(p1, p2, p1LookAngle, p1ArcAngle){
        var angleToP2 = this.angleBetweenPoints(p1, p2);
        var normalizedAngle = p1LookAngle % (Math.PI*2);
        var angleDifference = normalizedAngle >= 0 && angleToP2 >= 0 || normalizedAngle < 0 && angleToP2 < 0 ? normalizedAngle - angleToP2 : normalizedAngle + angleToP2 * -1;
        return Math.abs(angleDifference) < this.degToRad(p1ArcAngle) ||
            Math.abs(angleDifference - (Math.PI*2)) < this.degToRad(p1ArcAngle) ||
            Math.abs(angleDifference + (Math.PI*2)) < this.degToRad(p1ArcAngle);
    },

    arcAngleDifference: function(p1, p2, p1LookAngle){
        var angleToP2 = this.angleBetweenPoints(p1, p2);
        var normalizedAngle = p1LookAngle % (Math.PI*2);
        return normalizedAngle >= 0 && angleToP2 >= 0 || normalizedAngle < 0 && angleToP2 < 0 ? normalizedAngle - angleToP2 : normalizedAngle + angleToP2 * -1;
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
    }
};

if(!Function.prototype.extend){
    Function.prototype.extend = function(oldClass){
        this.prototype = Object.create(oldClass.prototype);
        this.prototype.constructor = oldClass;
    };
}

module.exports = Utils;
