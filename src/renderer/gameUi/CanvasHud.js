function CanvasHud(config){
    Object.assign(this, config);

    if(!this.canvasElement) throw new Error('No canvasElement defined for CanvasHud!');

    this.drawContext = this.canvasElement.getContext('2d');
}

CanvasHud.prototype.fill = function(){
    this.drawContext.fillStyle = '#ffccbb';
    this.drawContext.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
};

CanvasHud.prototype.resize = function(){
    if (this.autoHeight){
        this.canvasElement.height = document.documentElement.clientHeight;
    }

    if (this.autoWidth){
        this.canvasElement.width = document.documentElement.clientWidth;
    }

    if (this.buffer){
        this.drawBuffer(this.buffer);
    }
};

CanvasHud.prototype.drawBuffer = function(bufferCanvas){
    if (!(bufferCanvas instanceof BufferCanvas)) {
        throw new Error('CanvasHud drawBuffer requires a BufferCanvas instance!');
    }

    this.buffer = bufferCanvas;

    switch(bufferCanvas.position){
        case 'topLeft':
            this.drawContext.drawImage(bufferCanvas.canvas, 0, 0);
            break;
        case 'topLeft':
            this.drawContext.drawImage(bufferCanvas.canvas, 0, 0);
            break;
        case 'topLeft':
            this.drawContext.drawImage(bufferCanvas.canvas, 0, 0);
            break;
        case 'topLeft':
            this.drawContext.drawImage(bufferCanvas.canvas, 0, 0);
            break;
        default:
            this.drawContext.drawImage(bufferCanvas.canvas, 0, 0);
    }


};

module.exports = CanvasHud;
