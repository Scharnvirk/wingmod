var GameScene = require("renderer/scene/GameScene");
var MainMenuScene = require("renderer/scene/MainMenuScene");

function SceneManager(config){
    Object.assign(this, config);
    EventEmitter.apply(this, arguments);
    this.activeScene = null;
    this.sceneList = this.buildSceneList();
    this.scenes = {};

    this.threeObjects = [];

    this.storedMapData = null;
}

SceneManager.extend(EventEmitter);


SceneManager.prototype.buildSceneList = function(){
    return {
        'gameScene': GameScene,
        'mainMenuScene': MainMenuScene
    };
};

SceneManager.prototype.update = function(){
    if(this.activeScene){
        this.activeScene.update();
    }
};

SceneManager.prototype.makeScene = function(sceneName, config){
    if (!this.sceneList[sceneName]) throw new Error('No such scene: ' + sceneName);

    this.scenes[sceneName] = new this.sceneList[sceneName](config);
    this.activeScene = this.scenes[sceneName];
    this.activeScene.build();

    if(this.storedMapData){
        this.activeScene.buildMap(this.storedMapData);
    }

    this.threeObjects.forEach(objectToAdd => {
        this.activeScene.add(objectToAdd);
    });
    this.threeObjects = [];
};

SceneManager.prototype.onMapDone = function(event){
    this.storedMapData = event.data;
};

SceneManager.prototype.doUiFlash = function(flashConfig){
    this.activeScene.doUiFlash(flashConfig);
};

SceneManager.prototype.add = function(object){
    if (!this.activeScene) {
        this.threeObjects.push(object);
    } else {
        this.activeScene.add(object);
    }
};

SceneManager.prototype.getThreeScene = function(){
    return this.activeScene.threeScene;
};

SceneManager.prototype.resetCamera = function(){
    if (this.activeScene){
        this.activeScene.resetCamera();
    }
};

SceneManager.prototype.render = function(renderer){
    if (this.activeScene){
        renderer.render(this.activeScene.threeScene, this.activeScene.camera);
    }
};

SceneManager.prototype.onPlayerActorAppeared = function(actor){
    if (this.activeScene){
        this.activeScene.addPlayerActor(actor);
    }
};

module.exports = SceneManager;
