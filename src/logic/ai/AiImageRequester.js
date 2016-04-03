// function AiImageRequester(config){
//     Object.assign(this, config);
//     if(!this.world) throw new Error('No world specified for Logic AiImageRequester');
//     if(!this.renderBus) throw new Error('No render bus specified for Logic AiImageRequester');
// }
//
// AiImageRequester.prototype.requestImage = function(){
//     var wallActors = this.world.getWallActors();
//     this.renderBus.postMessage('getAiImage', wallActors);
// };
//
//
// module.exports = AiImageRequester;
