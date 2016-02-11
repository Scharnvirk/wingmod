var MathUtils = {

    angleToVector: function(angle, velocity){
        velocity = velocity || 0;
        return [(Math.sin(angle) * -1) * velocity, Math.cos(angle) * velocity];
    },

    vectorAngleToPoint: function(p1x, p2x, p1y, p2y){
        // var dotproduct = p1x*p2x + p1y*p2y;
        // var determinant = p1x*p2y - p1y*p2x;
        var angle = Math.atan2(p1y, p1x) - Math.atan2(p2y, p2x);

        angle = angle * 360 / (2*Math.PI);

        if (angle < 0){
            angle = angle + 360;
        }
        return angle;
    },

    angleBetweenPoints: function(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dx, dy);
        theta *= 180 / Math.PI;
        if (theta < 0) theta = 360 + theta;
        return theta;
    }

};
