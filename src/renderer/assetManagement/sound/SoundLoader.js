function SoundLoader(config){
    config = config || {};
    Object.assign(this, config);
}

SoundLoader.prototype.loadSounds = function(){
    createjs.Sound.alternateExtensions = ['mp3']; 
    createjs.Sound.registerSound({src:'sounds/laser2.mp3', id:'blue_laser'});
    createjs.Sound.registerSound({src:'sounds/laser13.mp3', id:'red_laser'});
    createjs.Sound.registerSound({src:'sounds/laser3.mp3', id:'plasmashot3'});
    createjs.Sound.registerSound({src:'sounds/laser14.mp3', id:'laser_purple'});
    createjs.Sound.registerSound({src:'sounds/laser12.mp3', id:'laser_green'});
    createjs.Sound.registerSound({src:'sounds/laser15.mp3', id:'plasmabig1'});
    createjs.Sound.registerSound({src:'sounds/laser16.mp3', id:'plasmabig2'});
    createjs.Sound.registerSound({src:'sounds/matterhit3.wav', id:'matterhit3'});
    createjs.Sound.registerSound({src:'sounds/laser4.mp3', id:'molten'});
    createjs.Sound.registerSound({src:'sounds/explosion5.mp3', id:'debris1'});
    createjs.Sound.registerSound({src:'sounds/explosion2.mp3', id:'debris2'});
    createjs.Sound.registerSound({src:'sounds/explosion3.mp3', id:'debris3'});
    createjs.Sound.registerSound({src:'sounds/explosion4.mp3', id:'debris4'});
    createjs.Sound.registerSound({src:'sounds/explosion6.mp3', id:'debris5'});
    createjs.Sound.registerSound({src:'sounds/explosion7.mp3', id:'debris6'});
    createjs.Sound.registerSound({src:'sounds/callout4.mp3', id:'drone'});
    createjs.Sound.registerSound({src:'sounds/callout6.mp3', id:'sniper'});
    createjs.Sound.registerSound({src:'sounds/callout2.mp3', id:'orbot'});
    createjs.Sound.registerSound({src:'sounds/callout1.mp3', id:'shulk'});
    createjs.Sound.registerSound({src:'sounds/callout7.mp3', id:'mhulk'});
    createjs.Sound.registerSound({src:'sounds/callout9.mp3', id:'spider'}); 
    createjs.Sound.registerSound({src:'sounds/callout10.mp3', id:'spiderling'});
    createjs.Sound.registerSound({src:'sounds/powerBoom2.mp3', id:'spawn'});
    createjs.Sound.registerSound({src:'sounds/weaponChange1.mp3', id:'cannon_change'});
    createjs.Sound.registerSound({src:'sounds/emptyError.mp3', id:'empty'});
    createjs.Sound.registerSound({src:'sounds/ammocon_empty.mp3', id:'ammo_empty'});
    createjs.Sound.registerSound({src:'sounds/shieldcon_empty.mp3', id:'shield_empty'});
    createjs.Sound.registerSound({src:'sounds/armorHit1.wav', id:'armorHit1'});
    createjs.Sound.registerSound({src:'sounds/armorHit2.wav', id:'armorHit2'});
    createjs.Sound.registerSound({src:'sounds/shield5.mp3', id:'shieldHit1'});
    createjs.Sound.registerSound({src:'sounds/shield4.mp3', id:'shieldHit2'});
    createjs.Sound.registerSound({src:'sounds/shield3.mp3', id:'shieldHit3'});
    createjs.Sound.registerSound({src:'sounds/pickup.mp3', id:'powerup'});
    createjs.Sound.registerSound({src:'sounds/distrupter_fire.wav', id:'disrupter'});
    createjs.Sound.registerSound({src:'sounds/missile2.mp3', id:'missile'});
};

module.exports = SoundLoader;
