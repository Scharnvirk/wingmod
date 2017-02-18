'use strict';
global.Utils = require('shared/Utils');
global.Constants = require('shared/Constants');
global.EventEmitter = require('shared/EventEmitter');

const Action = require('../tools/Action');
const ActionLoop = require('../tools/ActionLoop');
const WeaponSwitcherItem = require('renderer/gameUi/component/WeaponSwitcherItem');

let availableWeapons = ['plasmagun', 'lasgun', 'redlasgun', 'pulsewavegun', 'missilelauncher'];

const switcherProps = {
    amountOfWeapons: 7,    
    angleBetweenItems: 15,
    rotationOffset: 90,        
    scene: {threeScene: {add: function(){}}}
};

const createSwitcherItem = function(weaponIndex, customConfig) {    
    customConfig = customConfig || {};

    const switcherItemConfig = {
        amountOfWeapons: 7,
        availableWeapons: availableWeapons,
        weaponIndex: weaponIndex,
        angleBetweenItems: switcherProps.angleBetweenItems,
        rotationOnArc: 0,
        rotationOffset: switcherProps.rotationOffset,
        rotationLimit: Math.floor(switcherProps.amountOfWeapons / 2),
        visibilityLimit: 3,
        scene: switcherProps.scene,        
    };

    const switcherItem = new WeaponSwitcherItem(Object.assign(switcherItemConfig, customConfig));

    return switcherItem;
};


describe ('WeaponSwitcherItem', function() {
    beforeEach(function(){
        const mockedShipPosition = [0,0];
        this.switcherItem = createSwitcherItem(0);        

        this.switcherItemUpdateAction = new Action( () => {
            this.switcherItem.update({position: mockedShipPosition});
        });
        
        this.switchItemToNextAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 15, executions: 1});
    });

    it ('can be created', function() {     
        expect(this.switcherItem).not.toBeNull();         
    });

    it ('changed rotation if requested', function() {        
        ActionLoop(180, this.switchItemToNextAction, this.switcherItemUpdateAction); 
        expect(this.switcherItem.state.rotation).toBe(15);
    });

    it ('changed rotation twice if requested twice', function() {        
        this.switchItemToNextAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 15, executions: 2});

        ActionLoop(180, this.switchItemToNextAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.rotation).toBe(30);
    });

    it ('changed rotation twice if requested twice without delay', function() {        
        this.switchItemToNextAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 0, executions: 2});

        ActionLoop(180, this.switchItemToNextAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.rotation).toBe(30);
    });

    it ('weapon index not changed if there was no overflow', function() {        
        ActionLoop(180, this.switchItemToNextAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).toBe(0);
    });

    it ('has overflown eventually', function() {        
        this.switchItemToNextAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 15, executions: 4});

        ActionLoop(180, this.switchItemToNextAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.rotation).toBeLessThan(0);
    });

    it ('overflows upwards', function() {        
        this.switcherItem = createSwitcherItem(0, {rotationOnArc: 3});        

        this.switchItemToNextAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToNextAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.rotation).toBe(-45);
    });

    it ('overflows downwards', function() {        
        this.switcherItem = createSwitcherItem(0, {rotationOnArc: -4});        

        this.switchItemToPrevAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(-1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToPrevAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.rotation).toBe(30);
    });

    it ('does not overflow its weaponIndex on multiple rotations downwards', function() {    
        this.switcherItem = createSwitcherItem(2, {availableWeapons: ['w1', 'w2', 'w3']});   

        this.switchItemToPrevAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 5, executions: 50});

        ActionLoop(500, this.switchItemToPrevAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).not.toBeLessThan(0);
    });
});

describe ('WeaponSwitcherItem on lower overflow,', function() {
    beforeEach(function(){
        const mockedShipPosition = [0,0];
        this.switcherItem = createSwitcherItem(0);        

        this.switcherItemUpdateAction = new Action( () => {
            this.switcherItem.update({position: mockedShipPosition});
        });
    });

    it ('weaponIndex is changed when switcherItem started at position 3', function() {    
        this.switcherItem = createSwitcherItem(3, {rotationOnArc: 3});   

        this.switchItemToNextAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToNextAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).toBe(1);
    });

    it ('weaponIndex is changed when switcherItem started at position 2', function() {    
        this.switcherItem = createSwitcherItem(2, {rotationOnArc: 3});   

        this.switchItemToNextAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToNextAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).toBe(0);
    });

    it ('weaponIndex is changed when switcherItem started at position 1', function() {    
        this.switcherItem = createSwitcherItem(1, {rotationOnArc: 3});   

        this.switchItemToNextAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToNextAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).toBe(4);
    });

    it ('weaponIndex is changed when switcherItem started at position 0', function() {    
        this.switcherItem = createSwitcherItem(0, {rotationOnArc: 3});   

        this.switchItemToNextAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToNextAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).toBe(3);
    });

    it ('weaponIndex is changed when switcherItem started at position -1', function() {    
        this.switcherItem = createSwitcherItem(-1, {rotationOnArc: 3});   

        this.switchItemToNextAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToNextAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).toBe(3);
    });

    it ('weaponIndex is changed when switcherItem started at position -2', function() {    
        this.switcherItem = createSwitcherItem(-2, {rotationOnArc: 3});   

        this.switchItemToNextAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToNextAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).toBe(3);
    });

    it ('weaponIndex is changed on overflow for two weapons', function() {    
        this.switcherItem = createSwitcherItem(1, {rotationOnArc: 3, availableWeapons: ['w1', 'w2']});   

        this.switchItemToPrevAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToPrevAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).toBe(0);
    });

    it ('weaponIndex is changed on overflow for even amount of weapons', function() {    
        this.switcherItem = createSwitcherItem(3, {rotationOnArc: 3, availableWeapons: ['w1', 'w2', 'w3', 'w4']});   

        this.switchItemToPrevAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToPrevAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).toBe(0); 
    });
});


describe ('WeaponSwitcherItem on upper overflow,', function() {
    beforeEach(function(){
        const mockedShipPosition = [0,0];
        this.switcherItem = createSwitcherItem(0);        

        this.switcherItemUpdateAction = new Action( () => {
            this.switcherItem.update({position: mockedShipPosition});
        });
    });

    it ('weaponIndex is changed when switcherItem started at position 3', function() {    
        this.switcherItem = createSwitcherItem(2, {rotationOnArc: -4});   

        this.switchItemToPrevAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(-1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToPrevAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).toBe(4);
    });

    it ('weaponIndex is changed when switcherItem started at position 3', function() {    
        this.switcherItem = createSwitcherItem(3, {rotationOnArc: -4});   

        this.switchItemToPrevAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(-1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToPrevAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).toBe(0);
    });

    it ('weaponIndex is changed on overflow for two weapons', function() {    
        this.switcherItem = createSwitcherItem(1, {rotationOnArc: -4, availableWeapons: ['w1', 'w2']});   

        this.switchItemToPrevAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(-1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToPrevAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).toBe(0);
    });

    it ('weaponIndex is changed on overflow for even amount of weapons', function() {    
        this.switcherItem = createSwitcherItem(3, {rotationOnArc: -4, availableWeapons: ['w1', 'w2', 'w3', 'w4']});   

        this.switchItemToPrevAction = new Action( () => {
            this.switcherItem.updateRotationOnArc(-1);                
        }, {frequency: 15, executions: 1});

        ActionLoop(180, this.switchItemToPrevAction, this.switcherItemUpdateAction);
        expect(this.switcherItem.state.weaponIndex).toBe(2);
    });

});