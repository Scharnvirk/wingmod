function WorldAiMapExtractor(config){
    config = config || {};
    if(!config.world) throw new Error('No world specified for WorldAiMapExtractor');

    Object.assign(this, config);
}

WorldAiMapExtractor.prototype.getTerrainBodies = function(){
    let wallBodies = [];
    for(let i = 0; i < this.world.bodies.length; i ++){
        let body = this.world.bodies[i];
        if (Array.isArray(body.shape)){
            wallBodies = wallBodies.concat(this.extractShapes(body));
        } else {
            wallBodies.push(this.extractSingleShape(body));
        }
    }
    return wallBodies;
};

WorldAiMapExtractor.prototype.extractSingleShape = function(body){
    if (body.shape.collisionGroup === Constants.COLLISION_GROUPS.TERRAIN){
        switch(body.shape.constructor.name){
        case 'Box':
            return {
                class: body.shape.constructor.name,
                angle: body.angle,
                height: body.shape.height,
                width: body.shape.width,
                position: body.position
            };
        case 'Convex':
            return {
                class: body.shape.constructor.name,
                vertices: body.shape.vertices,
                position: body.position
            };
        }
    }
};

WorldAiMapExtractor.prototype.extractShapes = function(body){
    let wallBodies = [];
    for(let i = 0, l = body.shape.length; i < l; i++){
        let shape = body.shape[i];
        if (shape.collisionGroup === Constants.COLLISION_GROUPS.TERRAIN){
            var position = [
                body.position[0] + shape.position[0],
                body.position[1] + shape.position[1]
            ];
            switch(shape.constructor.name){
            case 'Box':
                wallBodies.push ({
                    class: shape.constructor.name,
                    angle: body.angle,
                    height: shape.height,
                    width: shape.width,
                    position: position
                });
                break;
            case 'Convex':
                wallBodies.push ({
                    class: shape.constructor.name,
                    angle: body.angle,
                    vertices: shape.vertices,
                    position: position
                });
                break;
            }
        }
    }
    return wallBodies;
};

module.exports = WorldAiMapExtractor;
