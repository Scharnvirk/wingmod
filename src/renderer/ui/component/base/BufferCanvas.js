function BufferCanvas(config){
    config = config || {};
    config.position = config.position || 'topLeft';

    Object.assign(this, config);

    this.canvas = document.createElement('canvas');
    this.canvas.height = this.height || 0;
    this.canvas.width = this.width || 0;
}

Module.exports = BufferCanvas;
