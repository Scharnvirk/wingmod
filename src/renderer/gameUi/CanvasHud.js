function CanvasHud(config){
    Object.assign(this, config);

    if(!this.canvasElement){
        this.canvasElement = this.createCanvasElement();
    }

    this.drawContext = this.canvasElement.getContext('2d');

    this.fill();
}

CanvasHud.prototype.createCanvasElement = function(){
    var hudCanvas = document.createElement('canvas');
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;

    hudCanvas.width = width;
    hudCanvas.height = width;

    // document.body.appendChild( hudCanvas );
    hudCanvas.className += 'canvasHud noPointerEvents';

    return hudCanvas;
};

CanvasHud.prototype.fill = function(){
    // this.drawContext.fillStyle = '#ffccbb';
    // this.drawContext.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    var context = this.drawContext;

    context.font = "Normal 40px Arial";
    context.textAlign = 'center';
    context.fillStyle = "rgba(245,245,245,1)";


    setInterval(() => {
        context.fillText(
            'Initializing...',
            context.canvas.width / 2 + Utils.rand(-500, 500),
            context.canvas.height / 2 + Utils.rand(-500, 500)
        );
    }, 16);

    setInterval(() => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }, 1600);




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
