function ActorStorage(){
    this.SIZE = Constants.STORAGE_SIZE;
    this.storage = [];
    this.currentId = 0;
    this.holes = [];
}

ActorStorage.prototype.put = function(actor){
    let id;
    if (this.holes.length > 0){
        id = this.holes.shift();
    } else {
        id = this.currentId;
        this.currentId ++;
    }

    this.storage[id] = actor;

    return id;
};

ActorStorage.prototype.getAt = function(id){
    return this.storage[id];
};

ActorStorage.prototype.removeAt = function(id){
    delete this.storage[id];
    this.holes.push(id);
};
