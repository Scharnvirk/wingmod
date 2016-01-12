var Utils = {
    makeRandomColor: function(){
        var colors = ['','',''];

        colors.forEach(function(color, index){
            var newColor = Math.floor(Math.random()* 256).toString(16);
            colors[index] = newColor.length === 1 ? '0' + newColor : newColor;
        });

        var color = '0x' + colors.join('');
        return Number(color);
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
        if (min > max) throw 'ERROR: getRandomInteger min > max';
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    rand: function(min, max){
        return this.getRandomInteger(min, max);
    },

    mixin: function(receiver, donor){
        for(var prop in donor.prototype){
            receiver[prop] = donor.prototype[prop];
        }
    },

    uptrunc: function(x){
        return x < 0 ? Math.floor(x) : Math.ceil(x);
    }
};

if(!Function.prototype.extend){
    Function.prototype.extend = function(oldClass){
        this.prototype = Object.create(oldClass.prototype);
        this.prototype.constructor = oldClass;
    };
}
