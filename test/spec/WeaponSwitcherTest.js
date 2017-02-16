'use strict';
global.Utils = require('shared/Utils');
global.Constants = require('shared/Constants');
global.EventEmitter = require('shared/EventEmitter');

const Action = require('../tools/Action');
const ActionLoop = require('../tools/ActionLoop');
const WeaponSwitcher = require('renderer/gameUi/WeaponSwitcher');

const availableWeapons = ['plasmagun', 'lasgun', 'redlasgun', 'pulsewavegun', 'missilelauncher'];

const createSwitcher = function() {
    const switcherConfig = {
        index: 0,
        rotationOffset: 90,
        switchNextKey: 'mouseLeft',
        switchPrevKey: 'mouseRight',
        activationKey: 'e',
        weapons: availableWeapons,
        amountOfWeapons: 7,    
        angleBetweenItems: 15,
        scene: { threeScene: {add: function(){}} }
    };

    const switcher = new WeaponSwitcher(switcherConfig);

    return switcher;
};

describe ('WeaponSwitcher rotation', function() {
    beforeEach(function(){
        const mockedShipPosition = [0,0];
        this.switcher = createSwitcher();        

        this.firstSwitchersState = this.switcher.getItems()[0].state;
        this.switcherRotationAtTheStart = this.firstSwitchersState.rotation;

        this.switcherUpdateAction = new Action( () => {
            this.switcher.update(mockedShipPosition);
        });

        this.switchToNextAction = new Action( () => {
            this.switcher.switchToNext();                
        }, {frequency: 15, executions: 1});
    });

    it ('works once if requested once', function() {        
        ActionLoop(180, this.switchToNextAction, this.switcherUpdateAction);
        expect(this.firstSwitchersState.rotation).toBe(this.switcherRotationAtTheStart + 15);
    });

    it ('works twice if requested twice with sufficient delay', function() {        
        this.switchToNextAction = new Action( () => {
            this.switcher.switchToNext();                
        }, {frequency: 15, executions: 2});

        ActionLoop(180, this.switchToNextAction, this.switcherUpdateAction);
        expect(this.firstSwitchersState.rotation).toBe(this.switcherRotationAtTheStart + 30);
    });

    it ('works once if requested twice with delay too short', function() {        
        this.switchToNextAction = new Action( () => {
            this.switcher.switchToNext();                
        }, {frequency: 0, executions: 2});

        ActionLoop(180, this.switchToNextAction, this.switcherUpdateAction);
        expect(this.firstSwitchersState.rotation).toBe(this.switcherRotationAtTheStart + 30);
    });

    it ('will overflow eventually', function() {        
        this.switchToNextAction = new Action( () => {
            this.switcher.switchToNext();           
        }, {frequency: 15, executions: 4});

        ActionLoop(180, this.switchToNextAction, this.switcherUpdateAction);
        expect(this.firstSwitchersState.rotation).not.toBeLessThan(0);

        ActionLoop(180, this.switchToNextAction, this.switcherUpdateAction);
        expect(this.firstSwitchersState.rotation).toBeLessThan(0);
    });
});

describe('WeaponSwitcher current weapon', function(){
    beforeEach(function(){
        const mockedShipPosition = [0,0];
        this.switcher = createSwitcher();        

        this.switcherUpdateAction = new Action( () => {
            this.switcher.update(mockedShipPosition);
        });
    });

    it ('will be its first weapon after creation', function(){
        expect(this.switcher.state.activeWeapon).toBe(availableWeapons[0]);
    });

    it ('will change to next weapon after one switch forward', function(){
        this.switchToNextAction = new Action( () => {
            this.switcher.switchToNext();           
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchToNextAction, this.switcherUpdateAction);

        expect(this.switcher.state.activeWeapon).toBe(availableWeapons[1]);
    });

    it ('will change to double-next weapon after two switches forward without sufficient delay', function(){
        this.switchToNextAction = new Action( () => {
            this.switcher.switchToNext();           
        }, {frequency: 0, executions: 2});

        ActionLoop(180, this.switchToNextAction, this.switcherUpdateAction);

        expect(this.switcher.state.activeWeapon).toBe(availableWeapons[2]);
    });

    it ('will change to last weapon after one switch backward (from first, so expecting rollover)', function(){
        this.switchToNextAction = new Action( () => {
            this.switcher.switchToPrev();           
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchToNextAction, this.switcherUpdateAction);

        expect(this.switcher.state.activeWeapon).toBe(availableWeapons[availableWeapons.length - 1]);
    });

    it ('will go through entire range and end on first weapon if called as many as there are weapons', function(){
        this.switchToNextAction = new Action( () => {
            this.switcher.switchToPrev();           
        }, {frequency: 15, executions: availableWeapons.length});

        ActionLoop(180, this.switchToNextAction, this.switcherUpdateAction);

        expect(this.switcher.state.activeWeapon).toBe(availableWeapons[0]);
    });
    
    it ('will go through entire range forwards and it will always have a defined weapon', function(){
        this.switchToNextAction = new Action( () => {
            this.switcher.switchToNext();   
            expect(this.switcher.state.activeWeapon).not.toBeUndefined();
        }, {frequency: 15, executions: 10});

        ActionLoop(180, this.switchToNextAction, this.switcherUpdateAction);
    });
});

describe('WeaponSwitcher weapon creation:', function(){
    beforeEach(function(){
        this.switcher = createSwitcher();        
    });

    it ('will create items in correct order', function(){
        const generatedWeapons = this.switcher._createWeaponItems(this.switcher.props.availableWeapons[0]);
        const weaponOrder = generatedWeapons.map(weapon => weapon.state.weaponIndex);
        expect(weaponOrder).toEqual([2,3,4,0,3,2,1,0]);
        // console.log(weaponOrder);
    });
});