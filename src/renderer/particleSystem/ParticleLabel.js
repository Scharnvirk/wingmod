function ParticleLabel(config){
    THREE.Object3D.apply(this, arguments);    
    
    config = config || {};
    config.color = config.color || {r: 1, g: 1, b: 1};
    config.size = config.size || config.scale || 1;
    config.alpha = config.alpha || 1;    
    
    delete config.scale; 
    
    Object.assign(this, config);   
    
    this.finalText = this.text;
    this.finalAlpha = this.alpha;
}

ParticleLabel.extend(THREE.Object3D);

ParticleLabel.prototype.update = function(){
    if(this.particleManager){
        var text = this.finalText.toString();        
        var lines = text.split('\n');
        this.visible = this.parent && this.isVisibleInParentTree();
        
        for(var i = 0, li = lines.length; i < li; i++){
            for(var j = 0, lj = lines[i].length; j < lj; j++){
                this.particleManager.createParticle('particleNumberAdd',{
                    positionX: this.position.x,
                    positionY: this.position.y,
                    positionZ: this.position.z,
                    colorR: this.color.r,
                    colorG: this.color.g,
                    colorB: this.color.b,
                    colorA: this.visible ? (this.finalAlpha) : 0,
                    scale: this.camera.zoom,
                    spriteNumber: this.getTextPosition(lines[i][j]),
                    offset: j + i * 32768,
                    size: this.size 
                });
            }
        }
    }    
};

ParticleLabel.prototype.reset = function(){
    this.overlapped = false;
    this.finalText = this.text;
    this.finalAlpha = this.alpha;
};

ParticleLabel.prototype.getTextPosition = function(symbol){
    switch(symbol){
    case '0': return 1;
    case '1': return 2;
    case '2': return 3;
    case '3': return 4;
    case '4': return 5;
    case '5': return 6;
    case '6': return 7;
    case '7': return 8;
    case '8': return 9;
    case '9': return 10;
    
    case '-': return 11;
    case '+': return 12;
    case '/': return 13;
    case '\\': return 14;
    case '*': return 15;
    case '[': return 16;
    case ']': return 17;
    case '(': return 18;
    case ')': return 19;
            
    case 'A': return 20;
    case 'B': return 21;
    case 'C': return 22;
    case 'D': return 23;
    case 'E': return 24;
    case 'F': return 25;
    case 'G': return 26;
    case 'h': return 27;
    case 'I': return 28;
    case 'J': return 29;
    case 'K': return 30;
    case 'L': return 31;
    case 'M': return 32;
    case 'N': return 33;
    case 'O': return 34;
    case 'P': return 35;
    case 'Q': return 36;
    case 'R': return 37;
    case 'S': return 38;
    case 'T': return 39;
    case 'U': return 40;
    case 'V': return 41;
    case 'W': return 42;
    case 'X': return 43;
    case 'Y': return 44;
    case 'Z': return 45;
    
    case 's': return 46;
    case 'e': return 47;
    case 'p': return 48;
    case 'z': return 49;
    case 'n': return 50;
    case 'm': return 51;
    case 'b': return 52;
    
    
    default: return 0;
    }
};