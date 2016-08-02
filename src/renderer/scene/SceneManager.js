var BaseScene = require("renderer/scene/BaseScene");
var GameScene = require("renderer/scene/GameScene");
var MainMenuScene = require("renderer/scene/MainMenuScene");
var FlatHudScene = require("renderer/scene/FlatHudScene");

function SceneManager(config){
    Object.assign(this, config);

    if (!this.renderer){ throw new Error ('No renderer specified for SceneManager!'); }
    if (!this.core){ throw new Error ('No core specified for SceneManager!'); }

    this.knownSceneClasses = {
        'GameScene': GameScene,
        'MainMenuScene': MainMenuScene,
        'FlatHudScene': FlatHudScene
    };

    this.activeScenes = {};
    EventEmitter.apply(this, arguments);
}

SceneManager.extend(EventEmitter);

SceneManager.prototype.render = function(sceneName){
    if (!this.activeScenes[sceneName]){
        throw new Error ("No such scene for render: " + sceneName);
    }

    this.renderer.render(
        this.activeScenes[sceneName].threeScene,
        this.activeScenes[sceneName].camera
    );
};

SceneManager.prototype.createScene = function(sceneName, config){
    if (!this.knownSceneClasses[sceneName]){
        throw new Error ("No such scene for createScene: " + sceneName);
    }

    var configWithRenderer = Object.assign(config || {}, {renderer: this.renderer});
    var newScene = new this.knownSceneClasses[sceneName](configWithRenderer);
    newScene.create();

    this.activeScenes[sceneName] = newScene;
};

SceneManager.prototype.update = function(){
    for (let sceneName in this.activeScenes){
        this.activeScenes[sceneName].update();
    }
};

SceneManager.prototype.addObjectToScene = function(sceneName, object){
    if (!this.activeScenes[sceneName]){
        throw new Error ("No such scene for addObjectToScene: " + sceneName);
    }
    this.activeScenes[sceneName].add(object);
};

SceneManager.prototype.get = function(sceneName){
    return this.activeScenes[sceneName];
};


SceneManager.prototype.destroyScene = function(sceneName){
    this.activeScenes[sceneName] = null;
};

SceneManager.prototype.getCoreActiveScene = function(){
    return this.activeScenes[this.core.activeScene];
};

module.exports = SceneManager;
