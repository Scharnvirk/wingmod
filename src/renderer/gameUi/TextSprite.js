function TextSprite(config){
    config = config || {};
    config.message = config.message || '';
    config.fontSize = config.fontSize || 20;
    config.fontStyle = config.fontStyle || 'Oswald';
    config.fontScale = config.fontScale || 10;
    config.height = config.height || 64;
    config.widthMultiplier = config.widthMultiplier || 4;

    Object.assign(this, config);

    this.canvas = this.createCanvas();
    this.canvas.height = this.height;
    this.canvas.width = this.height * this.widthMultiplier;

    this.texture = new THREE.Texture(this.canvas);
    this.context = this.canvas.getContext('2d');

	this.material = new THREE.SpriteMaterial(
		{ map: this.texture, color: 0xffffff }
    );

    THREE.Sprite.apply(this, [this.material]);

    this.scale.x = config.fontScale * this.canvas.width / this.canvas.height;
    this.scale.y = config.fontScale;
}

TextSprite.extend(THREE.Sprite);

TextSprite.prototype.createCanvas = function(){
    return document.createElement('canvas');
};

TextSprite.prototype.drawMessage = function(message){
    var metrics = this.context.measureText( message );
	var textWidth = metrics.width;

    var centerStartPosition = this.canvas.width / 2 - textWidth / 2;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.font = "Bold " + this.fontSize + "px " + this.fontStyle;
    this.context.fillStyle = '#00ff00';
    this.context.fillText( message, centerStartPosition, this.fontSize);
    this.texture.needsUpdate = true;
};

module.exports = TextSprite;
