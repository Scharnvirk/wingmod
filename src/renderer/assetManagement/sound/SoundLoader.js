function SoundLoader(config){
    config = config || {};
    Object.assign(this, config);
}

SoundLoader.prototype.loadSounds = function(){
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSound({src:"sounds/shortzap2.wav", id:"shortzap2"});
    createjs.Sound.registerSound({src:"sounds/blue_laser.wav", id:"blue_laser"});
    createjs.Sound.registerSound({src:"sounds/plasmashot.wav", id:"plasmashot"});
    createjs.Sound.registerSound({src:"sounds/plasmashot2.wav", id:"plasmashot2"});
    createjs.Sound.registerSound({src:"sounds/plasmashot3.wav", id:"plasmashot3"});
    createjs.Sound.registerSound({src:"sounds/plasma1.wav", id:"plasmashot4"});
    createjs.Sound.registerSound({src:"sounds/SoundsCrate-SciFi-Laser1.wav", id:"laser_charged"});
    createjs.Sound.registerSound({src:"sounds/SoundsCrate-SciFi-Laser1b.wav", id:"laser_short"});
    createjs.Sound.registerSound({src:"sounds/SoundsCrate-SciFi-Laser2.wav", id:"laser_purple"});
    createjs.Sound.registerSound({src:"sounds/matterhit3.wav", id:"matterhit3"});
    createjs.Sound.registerSound({src:"sounds/plasmahit.wav", id:"plasmahit"});
    createjs.Sound.registerSound({src:"sounds/molten.wav", id:"molten"});
    createjs.Sound.registerSound({src:"sounds/debris1.wav", id:"debris1"});
    createjs.Sound.registerSound({src:"sounds/debris2.wav", id:"debris2"});
    createjs.Sound.registerSound({src:"sounds/debris3.wav", id:"debris3"});
    createjs.Sound.registerSound({src:"sounds/debris4.wav", id:"debris4"});
    createjs.Sound.registerSound({src:"sounds/debris5.wav", id:"debris5"});
    createjs.Sound.registerSound({src:"sounds/debris6.wav", id:"debris6"});
    createjs.Sound.registerSound({src:"sounds/debris7.wav", id:"debris7"});
    createjs.Sound.registerSound({src:"sounds/debris8.wav", id:"debris8"});
    createjs.Sound.registerSound({src:"sounds/drone1s1.wav", id:"drone"});
    createjs.Sound.registerSound({src:"sounds/spiders1.wav", id:"sniper"});
    createjs.Sound.registerSound({src:"sounds/itds3.wav", id:"orbot"});
    createjs.Sound.registerSound({src:"sounds/spawn.wav", id:"spawn"});
};

module.exports = SoundLoader;
