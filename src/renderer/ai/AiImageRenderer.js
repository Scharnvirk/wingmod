function AiImageRenderer(){
    this.AI_SCENE_SIZE_X = Constants.CHUNK_SIZE;
    this.AI_SCENE_SIZE_Y = Constants.CHUNK_SIZE;

    this.LOGIC_SCENE_SIZE_X = Constants.CHUNK_SIZE*5;
    this.LOGIC_SCENE_SIZE_Y = Constants.CHUNK_SIZE*5;

    this.centerX = this.AI_SCENE_SIZE_X / 2;
    this.centerY = this.AI_SCENE_SIZE_Y / 2;

    this.lengthMultiplierX = this.AI_SCENE_SIZE_X / this.LOGIC_SCENE_SIZE_X;
    this.lengthMultiplierY= this.AI_SCENE_SIZE_Y / this.LOGIC_SCENE_SIZE_Y;

    this.canvas = this.createCanvas();
    this.drawContext = this.canvas.getContext('2d');
    this.drawContext.translate(this.AI_SCENE_SIZE_X/2, this.AI_SCENE_SIZE_Y/2);

    //this.debugDraw();
}

AiImageRenderer.prototype.debugDraw = function(){
    document.body.insertBefore(this.canvas, document.getElementById('react-content'));
};

AiImageRenderer.prototype.createCanvas = function(){
    var canvas = document.createElement('canvas', {
        alpha: false,
        antialias: false,
        depth: false
    });
    canvas.width = this.AI_SCENE_SIZE_X;
    canvas.height = this.AI_SCENE_SIZE_Y;
    return canvas;
};

AiImageRenderer.prototype.getImageObject = function(wallsData){
    this.drawImage(wallsData);

    return {
        imageData:  this.drawContext.getImageData(0, 0, this.AI_SCENE_SIZE_X, this.AI_SCENE_SIZE_Y),
        lengthMultiplierX: this.lengthMultiplierX,
        lengthMultiplierY: this.lengthMultiplierY,
        centerX: this.centerX,
        centerY: this.centerY
    };
};

AiImageRenderer.prototype.drawImage = function(wallsData){
    this.drawContext.fillStyle = 'white';
    this.drawContext.fillRect(-this.AI_SCENE_SIZE_X/2, -this.AI_SCENE_SIZE_Y/2, this.AI_SCENE_SIZE_X, this.AI_SCENE_SIZE_Y);

    this.drawContext.fillStyle = 'black';
    wallsData.forEach(this.drawObject.bind(this));
};


AiImageRenderer.prototype.drawObject = function(object){
    if(object){
        switch(object.class){
            case "Box":
                this.drawBox(object);
                break;
            case "Convex":
                this.drawConvex(object);
                break;
        }
    }
};

AiImageRenderer.prototype.drawBox = function(boxDataObject){
    let objectsPosition = boxDataObject.position;
    let halfWidth = (boxDataObject.width / 2) * this.lengthMultiplierX;
    let halfHeight = (boxDataObject.height / 2) * this.lengthMultiplierY;
    let angle = boxDataObject.angle;
    objectsPosition[0] = objectsPosition[0] * this.lengthMultiplierX + this.centerX;
    objectsPosition[1] = objectsPosition[1] * this.lengthMultiplierY + this.centerY;

    let bottomLeft = Utils.rotateOffsetPoint(objectsPosition[0], objectsPosition[1], objectsPosition[0] - halfWidth, objectsPosition[1] - halfHeight, angle);
    let topLeft = Utils.rotateOffsetPoint(objectsPosition[0], objectsPosition[1], objectsPosition[0] - halfWidth, objectsPosition[1] + halfHeight, angle);
    let topRight = Utils.rotateOffsetPoint(objectsPosition[0], objectsPosition[1], objectsPosition[0] + halfWidth, objectsPosition[1] + halfHeight, angle);
    let bottomRight = Utils.rotateOffsetPoint(objectsPosition[0], objectsPosition[1], objectsPosition[0] + halfWidth, objectsPosition[1] - halfHeight, angle);

    let dc = this.drawContext;
    dc.moveTo(bottomLeft[0], bottomLeft[1]);
    dc.lineTo(topLeft[0], topLeft[1]);
    dc.lineTo(topRight[0], topRight[1]);
    dc.lineTo(bottomRight[0], bottomRight[1]);
    dc.closePath();
    dc.fill();
};

AiImageRenderer.prototype.drawConvex = function(convexDataObject){
    let dc = this.drawContext;

    let pos = convexDataObject.position;
    pos[0] *= this.lengthMultiplierX;
    pos[1] *= this.lengthMultiplierX;

    dc.translate(pos[0], pos[1]);
    dc.rotate(convexDataObject.angle);

    dc.moveTo(
        convexDataObject.vertices[0][0] * this.lengthMultiplierX,
        convexDataObject.vertices[0][1] * this.lengthMultiplierX
    );
    for(let i = 1; i < convexDataObject.vertices.length; i++){
        dc.lineTo(
            convexDataObject.vertices[i][0] * this.lengthMultiplierX,
            convexDataObject.vertices[i][1] * this.lengthMultiplierX
        );
    }

    dc.closePath();
    dc.fill();

    dc.rotate(convexDataObject.angle);
    dc.translate(-pos[0], -pos[1]);
};


module.exports = AiImageRenderer;
