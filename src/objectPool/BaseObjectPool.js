class BaseObjectPool{
    constructor(poolSize){
        this.usedPool = [];
        this.emptyPool = [];
        this.poolSize = poolSize || 10;
        this._initPool();
    }

    create(newObjectParams){
        var newlyCreatedObject = this._fetchNextEmpty();
        this.resetObject(newlyCreatedObject);
        Object.assign(newlyCreatedObject, newObjectParams);
        this.usedPool.unshift(newlyCreatedObject);
        return newlyCreatedObject;
    }

    destroy(object){
        var result = this._moveObjectToEmptyPool(object);
        this.resetObject(object);
        return result;
    }

    constructNewObject(){
        return {
            reset: function(){
                console.warn("Default object reset function is not implemented");
            }
        };
    }

    resetObject(object){
        if (!object.reset){
            throw("No reset function implemented for object " + object);
        } else {
            object.reset();
        }
    }

    iterate(fn){
        this.usedPool.forEach(fn);
    }

    _initObject(){
        var object = this.constructNewObject();
        this.resetObject(object);
        return object;
    }

    _initPool(){
        for(var i = 0; i < this.poolSize; i++){
            var object = this._initObject();
            this.emptyPool.push(object);
        }
    }

    fetchNextEmpty(){
        var poolToTakeFrom = this.emptyPool.length > 0 ? this.emptyPool : this.usedPool;
        return poolToTakeFrom.pop();
    }

    moveObjectToEmptyPool(object){
        var index = this.usedPool.indexOf(object);

        if (index >= 0){
            this.usedPool.splice(index,1);
            this.emptyPool.push(object);
            return true;
        }
        return false;
    }
}
