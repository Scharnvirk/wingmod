function ActorStorage(size){
    this.storage = Array.apply(null, Array(size)).map(function(){});
    this.holes = Array.apply(null, Array(size)).map(function(){});
}
