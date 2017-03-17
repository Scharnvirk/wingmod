var Utils = {
    isBrowserMobile: function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    },

    isBrowserFirefox: function() {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    },

    isBrowserEdge: function() {
        return navigator.userAgent.indexOf('Edge') > -1;
    },

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

    makeRandomColor: function(min = 0, max = 255, r, g, b){
        var colors = [r || '', g || '', b || ''];

        let newColor = 0;
        colors.forEach(function(color, index){
            if (colors[index] === ''){
                newColor = this.rand(min, max).toString(16);
            } else {
                newColor = colors[index].toString(16);
            }   
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
